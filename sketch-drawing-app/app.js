// Drawing modes
const DrawingMode = {
    FREEHAND: 'freehand',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    SQUARE: 'square',
    ELLIPSE: 'ellipse',
    CIRCLE: 'circle',
    SELECT: 'select'
};

// Object types
const ObjectType = {
    FREEHAND_PATH: 'freehand_path',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse'
};

// Base drawable object class
class DrawableObject {
    constructor(type, points, color) {
        this.id = Math.random().toString(36).substring(2, 11);
        this.type = type;
        this.points = [...points];
        this.color = color;
        this.isSelected = false;
        this.bounds = this.calculateBounds();
    }

    calculateBounds() {
        if (this.points.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        const xs = this.points.map(p => p.x);
        const ys = this.points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    move(delta) {
        this.points = this.points.map(p => ({
            x: p.x + delta.x,
            y: p.y + delta.y
        }));
        this.bounds = this.calculateBounds();
    }

    renderSelection(context) {
        context.strokeStyle = '#007bff';
        context.lineWidth = 1;
        context.setLineDash([5, 5]);
        context.strokeRect(this.bounds.x - 2, this.bounds.y - 2, this.bounds.width + 4, this.bounds.height + 4);
        context.setLineDash([]);
    }
}

// Freehand path class
class FreehandPath extends DrawableObject {
    constructor(points, color) {
        super(ObjectType.FREEHAND_PATH, points, color);
    }

    render(context) {
        if (this.points.length < 2) return;

        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }

        context.stroke();

        if (this.isSelected) {
            this.renderSelection(context);
        }
    }

    containsPoint(point) {
        const tolerance = 5;
        
        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            
            const distance = this.distanceToLineSegment(point, p1, p2);
            if (distance <= tolerance) {
                return true;
            }
        }
        
        return false;
    }

    distanceToLineSegment(point, p1, p2) {
        const A = point.x - p1.x;
        const B = point.y - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) {
            return Math.sqrt(A * A + B * B);
        }

        let param = dot / lenSq;
        param = Math.max(0, Math.min(1, param));

        const xx = p1.x + param * C;
        const yy = p1.y + param * D;

        const dx = point.x - xx;
        const dy = point.y - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    clone() {
        return new FreehandPath([...this.points], this.color);
    }
}

// Line class
class Line extends DrawableObject {
    constructor(startPoint, endPoint, color) {
        super(ObjectType.LINE, [startPoint, endPoint], color);
    }

    render(context) {
        if (this.points.length !== 2) return;

        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.lineCap = 'round';

        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        context.lineTo(this.points[1].x, this.points[1].y);
        context.stroke();

        if (this.isSelected) {
            this.renderSelection(context);
        }
    }

    containsPoint(point) {
        if (this.points.length !== 2) return false;
        
        const tolerance = 5;
        const distance = this.distanceToLineSegment(point, this.points[0], this.points[1]);
        return distance <= tolerance;
    }

    distanceToLineSegment(point, p1, p2) {
        const A = point.x - p1.x;
        const B = point.y - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) {
            return Math.sqrt(A * A + B * B);
        }

        let param = dot / lenSq;
        param = Math.max(0, Math.min(1, param));

        const xx = p1.x + param * C;
        const yy = p1.y + param * D;

        const dx = point.x - xx;
        const dy = point.y - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    clone() {
        return new Line(this.points[0], this.points[1], this.color);
    }
}

// Rectangle class
class Rectangle extends DrawableObject {
    constructor(startPoint, endPoint, color, isSquare = false) {
        const adjustedEndPoint = isSquare ? Rectangle.makeSquare(startPoint, endPoint) : endPoint;
        super(ObjectType.RECTANGLE, [startPoint, adjustedEndPoint], color);
        this.isSquare = isSquare;
    }

    static makeSquare(startPoint, endPoint) {
        const width = Math.abs(endPoint.x - startPoint.x);
        const height = Math.abs(endPoint.y - startPoint.y);
        const size = Math.max(width, height);
        
        return {
            x: startPoint.x + (endPoint.x >= startPoint.x ? size : -size),
            y: startPoint.y + (endPoint.y >= startPoint.y ? size : -size)
        };
    }

    render(context) {
        if (this.points.length !== 2) return;

        const [start, end] = this.points;
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);

        if (this.isSelected) {
            this.renderSelection(context);
        }
    }

    containsPoint(point) {
        if (this.points.length !== 2) return false;
        
        const [start, end] = this.points;
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);
        
        const tolerance = 5;
        
        // Check if point is on the border of the rectangle
        const onLeftEdge = Math.abs(point.x - x) <= tolerance && point.y >= y - tolerance && point.y <= y + height + tolerance;
        const onRightEdge = Math.abs(point.x - (x + width)) <= tolerance && point.y >= y - tolerance && point.y <= y + height + tolerance;
        const onTopEdge = Math.abs(point.y - y) <= tolerance && point.x >= x - tolerance && point.x <= x + width + tolerance;
        const onBottomEdge = Math.abs(point.y - (y + height)) <= tolerance && point.x >= x - tolerance && point.x <= x + width + tolerance;
        
        return onLeftEdge || onRightEdge || onTopEdge || onBottomEdge;
    }

    clone() {
        return new Rectangle(this.points[0], this.points[1], this.color, this.isSquare);
    }
}

// Ellipse class
class Ellipse extends DrawableObject {
    constructor(startPoint, endPoint, color, isCircle = false) {
        const adjustedEndPoint = isCircle ? Ellipse.makeCircle(startPoint, endPoint) : endPoint;
        super(ObjectType.ELLIPSE, [startPoint, adjustedEndPoint], color);
        this.isCircle = isCircle;
    }

    static makeCircle(startPoint, endPoint) {
        const width = Math.abs(endPoint.x - startPoint.x);
        const height = Math.abs(endPoint.y - startPoint.y);
        const radius = Math.max(width, height) / 2;
        const size = radius * 2;
        
        return {
            x: startPoint.x + (endPoint.x >= startPoint.x ? size : -size),
            y: startPoint.y + (endPoint.y >= startPoint.y ? size : -size)
        };
    }

    render(context) {
        if (this.points.length !== 2) return;

        const [start, end] = this.points;
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;

        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.beginPath();
        context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        context.stroke();

        if (this.isSelected) {
            this.renderSelection(context);
        }
    }

    containsPoint(point) {
        if (this.points.length !== 2) return false;
        
        const [start, end] = this.points;
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;
        
        const tolerance = 5;
        
        // Check if point is on the ellipse border
        const normalizedX = (point.x - centerX) / radiusX;
        const normalizedY = (point.y - centerY) / radiusY;
        const distanceFromCenter = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
        
        return Math.abs(distanceFromCenter - 1) <= tolerance / Math.min(radiusX, radiusY);
    }

    clone() {
        return new Ellipse(this.points[0], this.points[1], this.color, this.isCircle);
    }
}

// Main application class
class SketchApp {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.context = this.canvas.getContext('2d');
        this.currentMode = DrawingMode.FREEHAND;
        this.currentColor = '#000000';
        this.isDrawing = false;
        this.objects = [];
        this.currentPath = [];
        this.startPoint = null;
        this.selectedObject = null;
        this.undoStack = [];
        this.redoStack = [];

        this.initializeEventListeners();
        this.render();
    }

    initializeEventListeners() {
        // Drawing mode selector
        document.getElementById('drawingMode').addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            this.canvas.className = this.currentMode === DrawingMode.SELECT ? 'select-mode' : '';
            this.clearSelection();
        });

        // Color picker
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });

        // Clear canvas button
        document.getElementById('clearCanvas').addEventListener('click', () => {
            this.clearCanvas();
        });

        // Undo button
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });

        // Redo button
        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });

        // Canvas mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            } else if (e.key === 'Delete' && this.selectedObject) {
                this.deleteSelected();
            }
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        
        if (this.currentMode === DrawingMode.SELECT) {
            this.handleSelection(pos);
            return;
        }

        this.isDrawing = true;
        this.startPoint = pos;
        
        if (this.currentMode === DrawingMode.FREEHAND) {
            this.currentPath = [pos];
        }

        this.clearSelection();
    }

    handleMouseMove(e) {
        if (!this.isDrawing || !this.startPoint) return;
        
        const pos = this.getMousePos(e);
        
        if (this.currentMode === DrawingMode.FREEHAND) {
            this.currentPath.push(pos);
            this.render();
        }
    }

    handleMouseUp(e) {
        if (!this.isDrawing || !this.startPoint) return;
        
        const endPos = this.getMousePos(e);
        this.isDrawing = false;
        
        let newObject = null;

        switch (this.currentMode) {
            case DrawingMode.FREEHAND:
                if (this.currentPath.length > 1) {
                    newObject = new FreehandPath(this.currentPath, this.currentColor);
                }
                break;
            case DrawingMode.LINE:
                newObject = new Line(this.startPoint, endPos, this.currentColor);
                break;
            case DrawingMode.RECTANGLE:
                newObject = new Rectangle(this.startPoint, endPos, this.currentColor, false);
                break;
            case DrawingMode.SQUARE:
                newObject = new Rectangle(this.startPoint, endPos, this.currentColor, true);
                break;
            case DrawingMode.ELLIPSE:
                newObject = new Ellipse(this.startPoint, endPos, this.currentColor, false);
                break;
            case DrawingMode.CIRCLE:
                newObject = new Ellipse(this.startPoint, endPos, this.currentColor, true);
                break;
        }

        if (newObject) {
            this.addObject(newObject);
        }

        this.currentPath = [];
        this.startPoint = null;
        this.render();
    }

    handleSelection(pos) {
        // Find object at position
        for (let i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i].containsPoint(pos)) {
                this.selectObject(this.objects[i]);
                return;
            }
        }
        
        // No object found, clear selection
        this.clearSelection();
    }

    selectObject(obj) {
        this.clearSelection();
        obj.isSelected = true;
        this.selectedObject = obj;
        this.render();
    }

    clearSelection() {
        if (this.selectedObject) {
            this.selectedObject.isSelected = false;
            this.selectedObject = null;
            this.render();
        }
    }

    addObject(obj) {
        this.saveState();
        this.objects.push(obj);
        this.updateUndoRedoButtons();
    }

    deleteSelected() {
        if (this.selectedObject) {
            this.saveState();
            const index = this.objects.indexOf(this.selectedObject);
            if (index > -1) {
                this.objects.splice(index, 1);
            }
            this.selectedObject = null;
            this.render();
            this.updateUndoRedoButtons();
        }
    }

    clearCanvas() {
        if (this.objects.length > 0) {
            this.saveState();
            this.objects = [];
            this.selectedObject = null;
            this.render();
            this.updateUndoRedoButtons();
        }
    }

    saveState() {
        this.undoStack.push(JSON.stringify(this.objects.map(obj => ({
            type: obj.type,
            points: obj.points,
            color: obj.color,
            isSquare: obj.isSquare,
            isCircle: obj.isCircle
        }))));
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length > 0) {
            this.redoStack.push(JSON.stringify(this.objects.map(obj => ({
                type: obj.type,
                points: obj.points,
                color: obj.color,
                isSquare: obj.isSquare,
                isCircle: obj.isCircle
            }))));
            
            const state = JSON.parse(this.undoStack.pop());
            this.objects = this.restoreObjects(state);
            this.selectedObject = null;
            this.render();
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push(JSON.stringify(this.objects.map(obj => ({
                type: obj.type,
                points: obj.points,
                color: obj.color,
                isSquare: obj.isSquare,
                isCircle: obj.isCircle
            }))));
            
            const state = JSON.parse(this.redoStack.pop());
            this.objects = this.restoreObjects(state);
            this.selectedObject = null;
            this.render();
            this.updateUndoRedoButtons();
        }
    }

    restoreObjects(state) {
        return state.map(objData => {
            switch (objData.type) {
                case ObjectType.FREEHAND_PATH:
                    return new FreehandPath(objData.points, objData.color);
                case ObjectType.LINE:
                    return new Line(objData.points[0], objData.points[1], objData.color);
                case ObjectType.RECTANGLE:
                    return new Rectangle(objData.points[0], objData.points[1], objData.color, objData.isSquare);
                case ObjectType.ELLIPSE:
                    return new Ellipse(objData.points[0], objData.points[1], objData.color, objData.isCircle);
                default:
                    return null;
            }
        }).filter(obj => obj !== null);
    }

    updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = this.undoStack.length === 0;
        document.getElementById('redoBtn').disabled = this.redoStack.length === 0;
    }

    render() {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render all objects
        this.objects.forEach(obj => obj.render(this.context));

        // Render current drawing preview
        if (this.isDrawing && this.startPoint) {
            this.context.strokeStyle = this.currentColor;
            this.context.lineWidth = 2;
            this.context.lineCap = 'round';
            this.context.lineJoin = 'round';

            if (this.currentMode === DrawingMode.FREEHAND && this.currentPath.length > 1) {
                this.context.beginPath();
                this.context.moveTo(this.currentPath[0].x, this.currentPath[0].y);
                for (let i = 1; i < this.currentPath.length; i++) {
                    this.context.lineTo(this.currentPath[i].x, this.currentPath[i].y);
                }
                this.context.stroke();
            }
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SketchApp();
});