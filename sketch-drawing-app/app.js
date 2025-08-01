// Drawing modes
const DrawingMode = {
    FREEHAND: 'freehand',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    SQUARE: 'square',
    ELLIPSE: 'ellipse',
    CIRCLE: 'circle',
    OPEN_POLYGON: 'open_polygon',
    CLOSED_POLYGON: 'closed_polygon',
    SELECT: 'select'
};

// Object types
const ObjectType = {
    FREEHAND_PATH: 'freehand_path',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    POLYGON: 'polygon',
    GROUP: 'group'
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

    changeColor(newColor) {
        this.color = newColor;
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

// Polygon class
class Polygon extends DrawableObject {
    constructor(points, color, isClosed = true) {
        super(ObjectType.POLYGON, points, color);
        this.isClosed = isClosed;
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

        if (this.isClosed && this.points.length > 2) {
            context.closePath();
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
        
        // Check closing line for closed polygons
        if (this.isClosed && this.points.length > 2) {
            const distance = this.distanceToLineSegment(
                point, 
                this.points[this.points.length - 1], 
                this.points[0]
            );
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
        return new Polygon([...this.points], this.color, this.isClosed);
    }
}

// Group class
class Group extends DrawableObject {
    constructor(objects, color = '#000000') {
        // Calculate combined bounds for all objects
        const allPoints = objects.flatMap(obj => obj.points);
        super(ObjectType.GROUP, allPoints, color);
        this.groupedObjects = [...objects];
        this.bounds = this.calculateGroupBounds();
    }

    calculateGroupBounds() {
        if (this.groupedObjects.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        this.groupedObjects.forEach(obj => {
            const bounds = obj.bounds;
            minX = Math.min(minX, bounds.x);
            minY = Math.min(minY, bounds.y);
            maxX = Math.max(maxX, bounds.x + bounds.width);
            maxY = Math.max(maxY, bounds.y + bounds.height);
        });

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    render(context) {
        // Render all grouped objects
        this.groupedObjects.forEach(obj => obj.render(context));
        
        // Render group selection indicator if selected
        if (this.isSelected) {
            context.strokeStyle = '#ff6b6b';
            context.lineWidth = 2;
            context.setLineDash([10, 5]);
            context.strokeRect(
                this.bounds.x - 3, 
                this.bounds.y - 3, 
                this.bounds.width + 6, 
                this.bounds.height + 6
            );
            context.setLineDash([]);
        }
    }

    containsPoint(point) {
        // Check if point is within any grouped object
        return this.groupedObjects.some(obj => obj.containsPoint(point));
    }

    move(delta) {
        // Move all grouped objects
        this.groupedObjects.forEach(obj => obj.move(delta));
        this.bounds = this.calculateGroupBounds();
    }

    changeColor(newColor) {
        // Change color of all grouped objects
        this.color = newColor;
        this.groupedObjects.forEach(obj => {
            if (obj.type === ObjectType.GROUP) {
                obj.changeColor(newColor);
            } else {
                obj.color = newColor;
            }
        });
    }

    clone() {
        const clonedObjects = this.groupedObjects.map(obj => obj.clone());
        return new Group(clonedObjects, this.color);
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
        this.selectedObjects = [];
        this.undoStack = [];
        this.redoStack = [];
        this.copiedObjects = [];
        
        // Polygon drawing state
        this.polygonPoints = [];
        this.isDrawingPolygon = false;
        
        // Object dragging state
        this.isDragging = false;
        this.dragStartPos = null;
        this.dragOffset = { x: 0, y: 0 };

        this.initializeEventListeners();
        this.updateButtons();
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
            // If objects are selected, automatically change their color
            if (this.selectedObjects.length > 0) {
                this.changeSelectedColor();
            }
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

        // Copy button
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copySelected();
        });

        // Paste button
        document.getElementById('pasteBtn').addEventListener('click', () => {
            this.pasteObjects();
        });

        // Delete button
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.deleteSelected();
        });

        // Group button
        document.getElementById('groupBtn').addEventListener('click', () => {
            this.groupSelected();
        });

        // Ungroup button
        document.getElementById('ungroupBtn').addEventListener('click', () => {
            this.ungroupSelected();
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveSketch();
        });

        // Load button
        document.getElementById('loadBtn').addEventListener('click', () => {
            this.loadSketch();
        });

        // Change color button
        document.getElementById('changeColorBtn').addEventListener('click', () => {
            this.changeSelectedColor();
        });

        // Canvas mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('dblclick', (e) => {
            if (this.isDrawingPolygon) {
                e.preventDefault();
                this.finishPolygon();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            } else if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
                this.copySelected();
            } else if (e.ctrlKey && e.key === 'v') {
                e.preventDefault();
                this.pasteObjects();
            } else if (e.ctrlKey && e.key === 'g') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.ungroupSelected();
                } else {
                    this.groupSelected();
                }
            } else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveSketch();
            } else if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                this.loadSketch();
            } else if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.changeSelectedColor();
            } else if (e.key === 'Delete' && this.selectedObjects.length > 0) {
                this.deleteSelected();
            } else if (e.key === 'Escape') {
                if (this.isDrawingPolygon) {
                    this.cancelPolygon();
                } else {
                    this.clearSelection();
                }
            } else if (e.key === 'Enter' && this.isDrawingPolygon) {
                this.finishPolygon();
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
            this.handleSelection(pos, e.ctrlKey);
            return;
        }

        if (this.currentMode === DrawingMode.OPEN_POLYGON || this.currentMode === DrawingMode.CLOSED_POLYGON) {
            this.handlePolygonClick(pos);
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
        const pos = this.getMousePos(e);
        
        // Handle object dragging
        if (this.isDragging && this.selectedObjects.length > 0) {
            const delta = {
                x: pos.x - this.dragStartPos.x,
                y: pos.y - this.dragStartPos.y
            };
            
            this.selectedObjects.forEach(obj => {
                obj.move(delta);
            });
            
            this.dragStartPos = pos;
            this.render();
            return;
        }
        
        // Handle drawing
        if (!this.isDrawing || !this.startPoint) {
            // Show polygon preview
            if (this.isDrawingPolygon) {
                this.render();
                this.renderPolygonPreview(pos);
            }
            return;
        }
        
        if (this.currentMode === DrawingMode.FREEHAND) {
            this.currentPath.push(pos);
            this.render();
        } else {
            // Show preview for other shapes
            this.render();
            this.renderShapePreview(pos);
        }
    }

    handleMouseUp(e) {
        // Stop dragging
        if (this.isDragging) {
            this.isDragging = false;
            this.dragStartPos = null;
            this.saveState();
            this.updateButtons();
            return;
        }
        
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

    handleSelection(pos, ctrlKey = false) {
        // Find object at position
        for (let i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i].containsPoint(pos)) {
                if (ctrlKey) {
                    this.toggleObjectSelection(this.objects[i]);
                } else {
                    // Check if clicking on already selected object to start dragging
                    if (this.selectedObjects.includes(this.objects[i])) {
                        this.startDragging(pos);
                        return;
                    }
                    this.selectObject(this.objects[i]);
                }
                return;
            }
        }
        
        // No object found, clear selection if not holding Ctrl
        if (!ctrlKey) {
            this.clearSelection();
        }
    }

    selectObject(obj) {
        this.clearSelection();
        obj.isSelected = true;
        this.selectedObjects = [obj];
        this.updateButtons();
        this.render();
    }

    toggleObjectSelection(obj) {
        if (this.selectedObjects.includes(obj)) {
            obj.isSelected = false;
            this.selectedObjects = this.selectedObjects.filter(o => o !== obj);
        } else {
            obj.isSelected = true;
            this.selectedObjects.push(obj);
        }
        this.updateButtons();
        this.render();
    }

    clearSelection() {
        this.selectedObjects.forEach(obj => {
            obj.isSelected = false;
        });
        this.selectedObjects = [];
        this.updateButtons();
        this.render();
    }

    startDragging(pos) {
        this.isDragging = true;
        this.dragStartPos = pos;
    }

    addObject(obj) {
        this.saveState();
        this.objects.push(obj);
        this.updateButtons();
    }

    deleteSelected() {
        if (this.selectedObjects.length > 0) {
            this.saveState();
            this.selectedObjects.forEach(obj => {
                const index = this.objects.indexOf(obj);
                if (index > -1) {
                    this.objects.splice(index, 1);
                }
            });
            this.selectedObjects = [];
            this.render();
            this.updateButtons();
        }
    }

    clearCanvas() {
        if (this.objects.length > 0) {
            this.saveState();
            this.objects = [];
            this.selectedObjects = [];
            this.render();
            this.updateButtons();
        }
    }

    saveState() {
        this.undoStack.push(JSON.stringify(this.objects.map(obj => this.serializeObject(obj))));
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length > 0) {
            this.redoStack.push(JSON.stringify(this.objects.map(obj => this.serializeObject(obj))));
            
            const state = JSON.parse(this.undoStack.pop());
            this.objects = state.map(objData => this.deserializeObject(objData)).filter(obj => obj !== null);
            this.selectedObjects = [];
            this.render();
            this.updateButtons();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push(JSON.stringify(this.objects.map(obj => this.serializeObject(obj))));
            
            const state = JSON.parse(this.redoStack.pop());
            this.objects = state.map(objData => this.deserializeObject(objData)).filter(obj => obj !== null);
            this.selectedObjects = [];
            this.render();
            this.updateButtons();
        }
    }

    updateButtons() {
        document.getElementById('undoBtn').disabled = this.undoStack.length === 0;
        document.getElementById('redoBtn').disabled = this.redoStack.length === 0;
        document.getElementById('copyBtn').disabled = this.selectedObjects.length === 0;
        document.getElementById('pasteBtn').disabled = this.copiedObjects.length === 0;
        document.getElementById('deleteBtn').disabled = this.selectedObjects.length === 0;
        document.getElementById('changeColorBtn').disabled = this.selectedObjects.length === 0;
        document.getElementById('groupBtn').disabled = this.selectedObjects.length < 2;
        document.getElementById('ungroupBtn').disabled = 
            this.selectedObjects.length !== 1 || this.selectedObjects[0].type !== ObjectType.GROUP;
        
        // Update selection counter
        this.updateSelectionInfo();
    }

    updateSelectionInfo() {
        const selectionInfo = document.getElementById('selectionInfo');
        const selectionCount = document.getElementById('selectionCount');
        
        if (this.selectedObjects.length > 0) {
            let text = `${this.selectedObjects.length} object${this.selectedObjects.length > 1 ? 's' : ''} selected`;
            
            if (this.selectedObjects.length > 1) {
                text += ' • Ctrl+G to group';
            } else if (this.selectedObjects[0].type === ObjectType.GROUP) {
                text += ' • Group • Ctrl+Shift+G to ungroup';
            } else {
                text += ' • Drag to move • Change color';
            }
            
            selectionCount.textContent = text;
            selectionInfo.classList.add('visible');
        } else {
            selectionInfo.classList.remove('visible');
        }
    }

    // Polygon drawing methods
    handlePolygonClick(pos) {
        if (!this.isDrawingPolygon) {
            // Start new polygon
            this.isDrawingPolygon = true;
            this.polygonPoints = [pos];
        } else {
            // Add point to current polygon
            this.polygonPoints.push(pos);
        }
        this.render();
        this.renderPolygonPreview(pos);
    }

    finishPolygon() {
        if (this.polygonPoints.length >= 2) {
            const isClosed = this.currentMode === DrawingMode.CLOSED_POLYGON;
            const polygon = new Polygon([...this.polygonPoints], this.currentColor, isClosed);
            this.addObject(polygon);
        }
        this.cancelPolygon();
    }

    cancelPolygon() {
        this.isDrawingPolygon = false;
        this.polygonPoints = [];
        this.render();
    }

    renderPolygonPreview(currentPos) {
        if (this.polygonPoints.length === 0) return;

        this.context.strokeStyle = this.currentColor;
        this.context.lineWidth = 2;
        this.context.setLineDash([5, 5]);

        // Draw existing polygon lines
        this.context.beginPath();
        this.context.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
        for (let i = 1; i < this.polygonPoints.length; i++) {
            this.context.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
        }

        // Draw preview line to current mouse position
        if (this.polygonPoints.length > 0) {
            this.context.lineTo(currentPos.x, currentPos.y);
        }

        // Draw closing line for closed polygons
        if (this.currentMode === DrawingMode.CLOSED_POLYGON && this.polygonPoints.length > 2) {
            this.context.lineTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
        }

        this.context.stroke();
        this.context.setLineDash([]);

        // Draw points
        this.context.fillStyle = this.currentColor;
        this.polygonPoints.forEach(point => {
            this.context.beginPath();
            this.context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            this.context.fill();
        });
    }

    renderShapePreview(endPos) {
        if (!this.startPoint) return;

        this.context.strokeStyle = this.currentColor;
        this.context.lineWidth = 2;
        this.context.setLineDash([5, 5]);

        switch (this.currentMode) {
            case DrawingMode.LINE:
                this.context.beginPath();
                this.context.moveTo(this.startPoint.x, this.startPoint.y);
                this.context.lineTo(endPos.x, endPos.y);
                this.context.stroke();
                break;
            case DrawingMode.RECTANGLE:
            case DrawingMode.SQUARE:
                const adjustedEnd = this.currentMode === DrawingMode.SQUARE ? 
                    Rectangle.makeSquare(this.startPoint, endPos) : endPos;
                const x = Math.min(this.startPoint.x, adjustedEnd.x);
                const y = Math.min(this.startPoint.y, adjustedEnd.y);
                const width = Math.abs(adjustedEnd.x - this.startPoint.x);
                const height = Math.abs(adjustedEnd.y - this.startPoint.y);
                this.context.strokeRect(x, y, width, height);
                break;
            case DrawingMode.ELLIPSE:
            case DrawingMode.CIRCLE:
                const adjustedEndEllipse = this.currentMode === DrawingMode.CIRCLE ? 
                    Ellipse.makeCircle(this.startPoint, endPos) : endPos;
                const centerX = (this.startPoint.x + adjustedEndEllipse.x) / 2;
                const centerY = (this.startPoint.y + adjustedEndEllipse.y) / 2;
                const radiusX = Math.abs(adjustedEndEllipse.x - this.startPoint.x) / 2;
                const radiusY = Math.abs(adjustedEndEllipse.y - this.startPoint.y) / 2;
                this.context.beginPath();
                this.context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                this.context.stroke();
                break;
        }

        this.context.setLineDash([]);
    }

    // Copy/Paste methods
    copySelected() {
        if (this.selectedObjects.length > 0) {
            this.copiedObjects = this.selectedObjects.map(obj => obj.clone());
            this.updateButtons();
        }
    }

    pasteObjects() {
        if (this.copiedObjects.length > 0) {
            this.saveState();
            this.clearSelection();
            
            this.copiedObjects.forEach(obj => {
                const clone = obj.clone();
                // Offset pasted objects slightly
                clone.move({ x: 20, y: 20 });
                this.objects.push(clone);
                clone.isSelected = true;
                this.selectedObjects.push(clone);
            });
            
            this.render();
            this.updateButtons();
        }
    }

    // Grouping methods
    groupSelected() {
        if (this.selectedObjects.length >= 2) {
            this.saveState();
            
            // Remove selected objects from main array
            this.selectedObjects.forEach(obj => {
                const index = this.objects.indexOf(obj);
                if (index > -1) {
                    this.objects.splice(index, 1);
                }
            });
            
            // Create group
            const group = new Group(this.selectedObjects);
            this.objects.push(group);
            
            // Select the new group
            this.selectedObjects = [group];
            group.isSelected = true;
            
            this.render();
            this.updateButtons();
        }
    }

    ungroupSelected() {
        if (this.selectedObjects.length === 1 && this.selectedObjects[0].type === ObjectType.GROUP) {
            this.saveState();
            
            const group = this.selectedObjects[0];
            const index = this.objects.indexOf(group);
            
            if (index > -1) {
                // Remove group from objects
                this.objects.splice(index, 1);
                
                // Add individual objects back
                group.groupedObjects.forEach(obj => {
                    this.objects.push(obj);
                });
                
                // Select the ungrouped objects
                this.selectedObjects = [...group.groupedObjects];
                this.selectedObjects.forEach(obj => {
                    obj.isSelected = true;
                });
            }
            
            this.render();
            this.updateButtons();
        }
    }

    // Save/Load methods
    saveSketch() {
        const sketchName = prompt('Enter sketch name:', 'My Sketch');
        if (sketchName) {
            const sketchData = {
                version: '1.0',
                objects: this.objects.map(obj => this.serializeObject(obj)),
                metadata: {
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    name: sketchName
                }
            };
            
            try {
                localStorage.setItem(`sketch_${sketchName}`, JSON.stringify(sketchData));
                alert('Sketch saved successfully!');
            } catch (error) {
                alert('Error saving sketch: ' + error.message);
            }
        }
    }

    loadSketch() {
        const savedSketches = this.getSavedSketches();
        if (savedSketches.length === 0) {
            alert('No saved sketches found.');
            return;
        }
        
        const sketchList = savedSketches.map((name, index) => `${index + 1}. ${name}`).join('\n');
        const selection = prompt(`Select sketch to load:\n${sketchList}\n\nEnter number or name:`);
        
        if (selection) {
            let sketchName;
            const num = parseInt(selection);
            if (!isNaN(num) && num > 0 && num <= savedSketches.length) {
                sketchName = savedSketches[num - 1];
            } else {
                sketchName = selection;
            }
            
            try {
                const sketchData = JSON.parse(localStorage.getItem(`sketch_${sketchName}`));
                if (sketchData) {
                    this.saveState();
                    this.objects = sketchData.objects.map(objData => this.deserializeObject(objData));
                    this.selectedObjects = [];
                    this.render();
                    this.updateButtons();
                    alert('Sketch loaded successfully!');
                } else {
                    alert('Sketch not found.');
                }
            } catch (error) {
                alert('Error loading sketch: ' + error.message);
            }
        }
    }

    getSavedSketches() {
        const sketches = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sketch_')) {
                sketches.push(key.substring(7)); // Remove 'sketch_' prefix
            }
        }
        return sketches;
    }

    serializeObject(obj) {
        const baseData = {
            type: obj.type,
            points: obj.points,
            color: obj.color
        };

        switch (obj.type) {
            case ObjectType.RECTANGLE:
                return { ...baseData, isSquare: obj.isSquare };
            case ObjectType.ELLIPSE:
                return { ...baseData, isCircle: obj.isCircle };
            case ObjectType.POLYGON:
                return { ...baseData, isClosed: obj.isClosed };
            case ObjectType.GROUP:
                return { 
                    ...baseData, 
                    groupedObjects: obj.groupedObjects.map(o => this.serializeObject(o))
                };
            default:
                return baseData;
        }
    }

    deserializeObject(objData) {
        switch (objData.type) {
            case ObjectType.FREEHAND_PATH:
                return new FreehandPath(objData.points, objData.color);
            case ObjectType.LINE:
                return new Line(objData.points[0], objData.points[1], objData.color);
            case ObjectType.RECTANGLE:
                return new Rectangle(objData.points[0], objData.points[1], objData.color, objData.isSquare);
            case ObjectType.ELLIPSE:
                return new Ellipse(objData.points[0], objData.points[1], objData.color, objData.isCircle);
            case ObjectType.POLYGON:
                return new Polygon(objData.points, objData.color, objData.isClosed);
            case ObjectType.GROUP:
                const groupedObjects = objData.groupedObjects.map(o => this.deserializeObject(o));
                return new Group(groupedObjects, objData.color);
            default:
                return null;
        }
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

        // Render polygon in progress
        if (this.isDrawingPolygon && this.polygonPoints.length > 0) {
            this.context.strokeStyle = this.currentColor;
            this.context.lineWidth = 2;
            this.context.lineCap = 'round';
            this.context.lineJoin = 'round';

            this.context.beginPath();
            this.context.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
            for (let i = 1; i < this.polygonPoints.length; i++) {
                this.context.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
            }
            this.context.stroke();

            // Draw points
            this.context.fillStyle = this.currentColor;
            this.polygonPoints.forEach(point => {
                this.context.beginPath();
                this.context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                this.context.fill();
            });
        }
    }

    // Color change functionality
    changeSelectedColor() {
        if (this.selectedObjects.length > 0) {
            // Use the current color from the color picker
            const newColor = this.currentColor;
            
            this.saveState();
            
            this.selectedObjects.forEach(obj => {
                if (obj.type === ObjectType.GROUP) {
                    obj.changeColor(newColor);
                } else {
                    obj.color = newColor;
                }
            });
            
            this.render();
            this.updateButtons();
        }
    }

    // Copy/Paste functionality
    copySelected() {
        if (this.selectedObjects.length > 0) {
            this.copiedObjects = this.selectedObjects.map(obj => obj.clone());
            this.updateButtons();
        }
    }

    pasteObjects() {
        if (this.copiedObjects.length > 0) {
            this.saveState();
            this.clearSelection();
            
            // Paste with slight offset
            const offset = { x: 20, y: 20 };
            this.copiedObjects.forEach(obj => {
                const newObj = obj.clone();
                newObj.move(offset);
                newObj.isSelected = true;
                this.objects.push(newObj);
                this.selectedObjects.push(newObj);
            });
            
            this.render();
            this.updateButtons();
        }
    }

    // Grouping functionality
    groupSelected() {
        if (this.selectedObjects.length >= 2) {
            this.saveState();
            
            // Remove selected objects from main objects array
            this.selectedObjects.forEach(obj => {
                const index = this.objects.indexOf(obj);
                if (index > -1) {
                    this.objects.splice(index, 1);
                }
            });
            
            // Create group
            const group = new Group(this.selectedObjects);
            group.isSelected = true;
            this.objects.push(group);
            
            // Update selection
            this.selectedObjects = [group];
            
            this.render();
            this.updateButtons();
        }
    }

    ungroupSelected() {
        if (this.selectedObjects.length === 1 && this.selectedObjects[0].type === ObjectType.GROUP) {
            this.saveState();
            
            const group = this.selectedObjects[0];
            const index = this.objects.indexOf(group);
            
            if (index > -1) {
                // Remove group from objects
                this.objects.splice(index, 1);
                
                // Add individual objects back
                group.groupedObjects.forEach(obj => {
                    obj.isSelected = true;
                    this.objects.push(obj);
                });
                
                // Update selection to individual objects
                this.selectedObjects = [...group.groupedObjects];
            }
            
            this.render();
            this.updateButtons();
        }
    }

    // Save/Load functionality
    saveSketch() {
        const sketchName = prompt('Enter sketch name:', 'My Sketch');
        if (sketchName) {
            const sketchData = {
                version: '1.0',
                objects: this.objects.map(obj => this.serializeObject(obj)),
                metadata: {
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    name: sketchName
                }
            };
            
            try {
                localStorage.setItem(`sketch_${sketchName}`, JSON.stringify(sketchData));
                alert(`Sketch "${sketchName}" saved successfully!`);
            } catch (error) {
                alert('Error saving sketch: ' + error.message);
            }
        }
    }

    loadSketch() {
        // Get list of saved sketches
        const savedSketches = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sketch_')) {
                savedSketches.push(key.substring(7)); // Remove 'sketch_' prefix
            }
        }
        
        if (savedSketches.length === 0) {
            alert('No saved sketches found.');
            return;
        }
        
        const sketchName = prompt(`Available sketches:\n${savedSketches.join('\n')}\n\nEnter sketch name to load:`);
        if (sketchName && savedSketches.includes(sketchName)) {
            try {
                const sketchData = JSON.parse(localStorage.getItem(`sketch_${sketchName}`));
                
                // Clear current drawing
                this.objects = [];
                this.selectedObjects = [];
                this.undoStack = [];
                this.redoStack = [];
                
                // Load objects
                this.objects = sketchData.objects.map(objData => this.deserializeObject(objData)).filter(obj => obj !== null);
                
                this.render();
                this.updateButtons();
                alert(`Sketch "${sketchName}" loaded successfully!`);
            } catch (error) {
                alert('Error loading sketch: ' + error.message);
            }
        }
    }

    // Serialization methods
    serializeObject(obj) {
        const baseData = {
            id: obj.id,
            type: obj.type,
            points: obj.points,
            color: obj.color,
            isSelected: obj.isSelected
        };

        // Add type-specific properties
        switch (obj.type) {
            case ObjectType.RECTANGLE:
                baseData.isSquare = obj.isSquare;
                break;
            case ObjectType.ELLIPSE:
                baseData.isCircle = obj.isCircle;
                break;
            case ObjectType.POLYGON:
                baseData.isClosed = obj.isClosed;
                break;
            case ObjectType.GROUP:
                baseData.groupedObjects = obj.groupedObjects.map(groupedObj => this.serializeObject(groupedObj));
                break;
        }

        return baseData;
    }

    deserializeObject(objData) {
        try {
            let obj = null;

            switch (objData.type) {
                case ObjectType.FREEHAND_PATH:
                    obj = new FreehandPath(objData.points, objData.color);
                    break;
                case ObjectType.LINE:
                    obj = new Line(objData.points[0], objData.points[1], objData.color);
                    break;
                case ObjectType.RECTANGLE:
                    obj = new Rectangle(objData.points[0], objData.points[1], objData.color, objData.isSquare);
                    break;
                case ObjectType.ELLIPSE:
                    obj = new Ellipse(objData.points[0], objData.points[1], objData.color, objData.isCircle);
                    break;
                case ObjectType.POLYGON:
                    obj = new Polygon(objData.points, objData.color, objData.isClosed);
                    break;
                case ObjectType.GROUP:
                    const groupedObjects = objData.groupedObjects.map(groupedObjData => this.deserializeObject(groupedObjData)).filter(o => o !== null);
                    obj = new Group(groupedObjects, objData.color);
                    break;
            }

            if (obj) {
                obj.id = objData.id;
                obj.isSelected = objData.isSelected || false;
            }

            return obj;
        } catch (error) {
            console.error('Error deserializing object:', error);
            return null;
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SketchApp();
});