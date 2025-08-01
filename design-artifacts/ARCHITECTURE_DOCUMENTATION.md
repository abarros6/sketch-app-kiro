# Sketch Drawing App - Architecture Documentation

**Author: Anthony Barros + Kiro**

This document provides comprehensive technical information about the Sketch Drawing App architecture, interactive functions, and design patterns to enable the creation of statecharts and object diagrams.

## Application Overview

The Sketch Drawing App is a vanilla JavaScript application that provides a 2D drawing canvas with multiple drawing modes, object manipulation, grouping, undo/redo functionality, and save/load capabilities. The application follows an object-oriented architecture with a single main controller class managing all functionality.

## Core Architecture Components

### 1. Main Application Class

**SketchApp** - Central controller class that manages all application functionality:
- Canvas rendering and drawing operations
- Object collection and state management
- Event handling (mouse, keyboard, UI controls)
- Undo/redo system with state snapshots
- File operations (save/load to localStorage)
- Grouping and ungrouping operations

### 2. Drawable Object Hierarchy

**DrawableObject (Base Class)**
- Properties: id, type, points, color, isSelected, bounds
- Methods: calculateBounds(), move(), renderSelection(), changeColor()

**Concrete Shape Classes (inherit from DrawableObject):**
- **FreehandPath**: Handles freehand drawing with array of points
- **Line**: Manages straight lines between two points
- **Rectangle**: Handles rectangles with optional square constraint
- **Ellipse**: Manages ellipses with optional circle constraint
- **Polygon**: Handles polygons with open/closed options
- **Group**: Special object containing multiple grouped objects

### 3. Application State Management

**State Properties in SketchApp:**
- `currentMode`: Current drawing mode (enum)
- `currentColor`: Selected color for new objects
- `isDrawing`: Boolean flag for drawing state
- `objects[]`: Array of all drawable objects
- `selectedObjects[]`: Array of currently selected objects
- `undoStack[]`: Stack of serialized states for undo
- `redoStack[]`: Stack of serialized states for redo
- `copiedObjects[]`: Array of objects in clipboard
- `polygonPoints[]`: Temporary array for polygon creation
- `isDrawingPolygon`: Boolean flag for polygon drawing state

## Interactive Functions and State Transitions

### 1. Drawing Mode State Machine

**States:**
- FREEHAND: Continuous line drawing
- LINE: Two-point line creation
- RECTANGLE: Rectangle creation with drag
- SQUARE: Square creation (constrained rectangle)
- ELLIPSE: Ellipse creation with drag
- CIRCLE: Circle creation (constrained ellipse)
- OPEN_POLYGON: Multi-point polygon creation (open)
- CLOSED_POLYGON: Multi-point polygon creation (closed)
- SELECT: Object selection and manipulation mode

**State Transitions:**
- User selects mode from dropdown → Changes currentMode
- Mode change → Clears current selection and resets drawing state

### 2. Drawing Process State Machine

**States:**
- IDLE: Waiting for user input
- DRAWING: Active drawing in progress
- POLYGON_BUILDING: Building polygon with multiple clicks
- DRAGGING: Moving selected objects

**Transitions:**
- IDLE + mousedown → DRAWING (for shape modes) or DRAGGING (for select mode)
- DRAWING + mousemove → Updates preview shape
- DRAWING + mouseup → Creates object, returns to IDLE
- POLYGON_BUILDING + click → Adds point, stays in POLYGON_BUILDING
- POLYGON_BUILDING + double-click → Completes polygon, returns to IDLE

### 3. Selection State Machine

**States:**
- NO_SELECTION: No objects selected
- SINGLE_SELECTION: One object selected
- MULTI_SELECTION: Multiple objects selected
- GROUP_SELECTION: A group object selected

**Transitions:**
- Click on object → SINGLE_SELECTION
- Ctrl+Click on additional objects → MULTI_SELECTION
- Click on group → GROUP_SELECTION
- Click on empty space → NO_SELECTION

### 4. Object Manipulation State Machine

**States:**
- SELECTED: Object(s) ready for manipulation
- MOVING: Objects being dragged
- COPYING: Objects in clipboard
- GROUPING: Creating group from selection
- UNGROUPING: Breaking apart group

**Transitions:**
- Selection + drag → MOVING
- Selection + Ctrl+C → COPYING
- Multi-selection + Group button → GROUPING
- Group selection + Ungroup button → UNGROUPING

## Design Patterns Used

### 1. Command Pattern (Undo/Redo System)

**Implementation:**
- Each state-changing operation saves current state to undoStack
- Undo operation restores previous state from undoStack
- Redo operation restores next state from redoStack
- State serialization/deserialization for persistence

**Commands (implicit):**
- AddObjectCommand: Adding new drawn objects
- DeleteObjectCommand: Removing selected objects
- MoveObjectCommand: Moving objects
- GroupCommand: Creating groups
- UngroupCommand: Breaking groups
- ChangeColorCommand: Modifying object colors

### 2. Factory Pattern (Object Creation)

**Implementation:**
- Different object types created based on drawing mode
- Centralized object creation in SketchApp methods
- Type-specific construction parameters

**Factory Methods:**
- createFreehandPath()
- createLine()
- createRectangle()
- createEllipse()
- createPolygon()
- createGroup()

### 3. Observer Pattern (Event Handling)

**Implementation:**
- DOM event listeners observe user interactions
- UI state updates when application state changes
- Button enable/disable based on selection state

**Observers:**
- Mouse event handlers
- Keyboard event handlers
- UI control event handlers
- Button state updaters

### 4. Strategy Pattern (Drawing Modes)

**Implementation:**
- Different drawing strategies based on current mode
- Mode-specific behavior in mouse event handlers
- Polymorphic shape rendering

**Strategies:**
- FreehandDrawingStrategy
- LineDrawingStrategy
- RectangleDrawingStrategy
- EllipseDrawingStrategy
- PolygonDrawingStrategy
- SelectionStrategy

### 5. Composite Pattern (Grouping)

**Implementation:**
- Group objects contain other drawable objects
- Groups can contain other groups (nested composition)
- Uniform interface for individual objects and groups

**Structure:**
- DrawableObject (Component)
- Individual shapes (Leaf)
- Group (Composite)

## Event Flow and Interactions

### 1. Drawing Workflow

1. User selects drawing mode
2. User clicks on canvas (mousedown)
3. SketchApp.handleMouseDown() processes event
4. Drawing state activated, startPoint recorded
5. User drags mouse (mousemove)
6. SketchApp.handleMouseMove() updates preview
7. User releases mouse (mouseup)
8. SketchApp.handleMouseUp() creates final object
9. Object added to objects array
10. State saved for undo functionality
11. Canvas re-rendered

### 2. Selection Workflow

1. User switches to SELECT mode
2. User clicks on object
3. SketchApp.handleSelection() identifies clicked object
4. Object marked as selected
5. Selection UI updated (buttons enabled/disabled)
6. Selection info displayed
7. User can manipulate selected object(s)

### 3. Grouping Workflow

1. User selects multiple objects (Ctrl+click)
2. User clicks Group button or presses Ctrl+G
3. SketchApp.groupSelected() creates Group object
4. Selected objects removed from main objects array
5. Group object added to objects array
6. Selection updated to group object
7. State saved for undo

### 4. Undo/Redo Workflow

1. User performs state-changing action
2. Current state serialized and pushed to undoStack
3. User presses Ctrl+Z or Undo button
4. Current state pushed to redoStack
5. Previous state popped from undoStack
6. Application state restored from serialized data
7. Canvas re-rendered with restored state

## Data Structures and Relationships

### Object Relationships

```
SketchApp (1) ←→ (0..*) DrawableObject
    ↓
    ├── FreehandPath
    ├── Line  
    ├── Rectangle
    ├── Ellipse
    ├── Polygon
    └── Group (1) ←→ (2..*) DrawableObject
```

### State Management

```
SketchApp
├── objects[] (main object collection)
├── selectedObjects[] (current selection)
├── undoStack[] (serialized states)
├── redoStack[] (serialized states)
├── copiedObjects[] (clipboard)
└── UI State (mode, color, flags)
```

## Key Algorithms

### 1. Hit Testing (Object Selection)

```javascript
// For each object in reverse order (top to bottom)
for (let i = objects.length - 1; i >= 0; i--) {
    if (objects[i].containsPoint(clickPoint)) {
        return objects[i]; // First hit wins
    }
}
```

### 2. State Serialization

```javascript
// Serialize current state
const state = objects.map(obj => ({
    type: obj.type,
    points: obj.points,
    color: obj.color,
    // ... other properties
}));
undoStack.push(JSON.stringify(state));
```

### 3. Group Bounds Calculation

```javascript
// Calculate combined bounds of all grouped objects
let minX = Infinity, minY = Infinity;
let maxX = -Infinity, maxY = -Infinity;
groupedObjects.forEach(obj => {
    minX = Math.min(minX, obj.bounds.x);
    minY = Math.min(minY, obj.bounds.y);
    maxX = Math.max(maxX, obj.bounds.x + obj.bounds.width);
    maxY = Math.max(maxY, obj.bounds.y + obj.bounds.height);
});
```

## User Interface Components

### 1. Toolbar Controls

- Drawing mode selector (dropdown)
- Color picker (HTML5 color input)
- Action buttons (Clear, Undo, Redo)
- Object manipulation buttons (Copy, Paste, Delete, Change Color)
- Grouping buttons (Group, Ungroup)
- File operations (Save, Load)

### 2. Canvas Area

- HTML5 Canvas element for drawing
- Mouse event capture for interactions
- Real-time preview rendering
- Selection indicators

### 3. Status Display

- Selection information tooltip
- Context-sensitive help text
- Visual feedback for current mode

## Error Handling and Edge Cases

### 1. Drawing Validation

- Minimum point requirements for shapes
- Canvas boundary checking
- Invalid coordinate handling

### 2. Selection Edge Cases

- Empty selections
- Invalid object references
- Group selection conflicts

### 3. State Management

- Undo/redo stack limits
- Serialization failures
- State corruption recovery

## Performance Considerations

### 1. Rendering Optimization

- Canvas clearing and redrawing
- Object culling for off-screen items
- Efficient hit testing algorithms

### 2. Memory Management

- Undo stack size limits
- Object cleanup on deletion
- Event listener management

### 3. User Experience

- Responsive UI updates
- Smooth drawing feedback
- Minimal input lag

## File Structure and Dependencies

```
sketch-drawing-app/
├── index.html (UI structure)
├── app.js (main application logic)
├── styles.css (styling and layout)
├── Dockerfile (containerization)
└── nginx.conf (server configuration)
```

**Dependencies:**
- HTML5 Canvas API
- DOM Event API
- localStorage API
- No external libraries or frameworks

This documentation provides the complete technical foundation needed to create detailed statecharts showing the interactive function state transitions and object diagrams representing the software architecture and design patterns used in the Sketch Drawing App.