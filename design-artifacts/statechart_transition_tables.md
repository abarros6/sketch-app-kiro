# Sketch Drawing App - State Transition Tables

## 1. Drawing Mode State Transition Table

| Current State | Event/Trigger | Next State | Actions |
|---------------|---------------|------------|---------|
| FREEHAND | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| FREEHAND | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| LINE | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| LINE | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| LINE | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| LINE | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| LINE | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| LINE | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| LINE | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| LINE | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| RECTANGLE | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| SQUARE | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| ELLIPSE | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| CIRCLE | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |
| OPEN_POLYGON | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| CLOSED_POLYGON | selectMode(SELECT) | SELECT | clearSelection(), resetDrawingState() |
| SELECT | selectMode(FREEHAND) | FREEHAND | clearSelection(), resetDrawingState() |
| SELECT | selectMode(LINE) | LINE | clearSelection(), resetDrawingState() |
| SELECT | selectMode(RECTANGLE) | RECTANGLE | clearSelection(), resetDrawingState() |
| SELECT | selectMode(SQUARE) | SQUARE | clearSelection(), resetDrawingState() |
| SELECT | selectMode(ELLIPSE) | ELLIPSE | clearSelection(), resetDrawingState() |
| SELECT | selectMode(CIRCLE) | CIRCLE | clearSelection(), resetDrawingState() |
| SELECT | selectMode(OPEN_POLYGON) | OPEN_POLYGON | clearSelection(), resetDrawingState() |
| SELECT | selectMode(CLOSED_POLYGON) | CLOSED_POLYGON | clearSelection(), resetDrawingState() |

## 2. Drawing Process State Transition Table

| Current State | Event/Trigger | Guard Condition | Next State | Actions |
|---------------|---------------|----------------|------------|---------|
| IDLE | mousedown | in shape mode | DRAWING | recordStartPoint(), setIsDrawing(true) |
| IDLE | mousedown | in polygon mode | POLYGON_BUILDING | addFirstPoint(), setIsDrawingPolygon(true) |
| IDLE | mousedown | in select mode & object hit | DRAGGING | startDrag(), recordSelectedObjects() |
| IDLE | mousedown | in select mode & no object hit | SELECTING | startSelectionBox() |
| DRAWING | mousemove | - | DRAWING | updatePreview(), renderPreviewShape() |
| DRAWING | mouseup | - | IDLE | createObject(), addToObjectsArray(), saveState(), setIsDrawing(false) |
| POLYGON_BUILDING | click | - | POLYGON_BUILDING | addPoint(), updatePolygonPreview() |
| POLYGON_BUILDING | doubleClick | - | IDLE | completePolygon(), createPolygonObject(), setIsDrawingPolygon(false) |
| POLYGON_BUILDING | escapeKey | - | IDLE | cancelPolygon(), clearPolygonPoints(), setIsDrawingPolygon(false) |
| DRAGGING | mousemove | - | DRAGGING | moveObjects(), updateObjectPositions() |
| DRAGGING | mouseup | - | IDLE | finishMove(), saveState() |
| SELECTING | mousemove | - | SELECTING | updateSelectionBox(), renderSelectionRectangle() |
| SELECTING | mouseup | - | IDLE | selectObjectsInBox(), updateSelection() |

## 3. Selection State Transition Table

| Current State | Event/Trigger | Guard Condition | Next State | Actions |
|---------------|---------------|----------------|------------|---------|
| NO_SELECTION | clickObject | object exists | SINGLE_SELECTION | selectObject(), updateUI(), enableObjectButtons() |
| NO_SELECTION | clickEmpty | - | NO_SELECTION | clearSelection(), updateUI() |
| SINGLE_SELECTION | clickEmpty | - | NO_SELECTION | clearSelection(), disableObjectButtons() |
| SINGLE_SELECTION | clickDifferentObject | !ctrl pressed | SINGLE_SELECTION | clearSelection(), selectNewObject() |
| SINGLE_SELECTION | ctrlClickObject | ctrl pressed & different object | MULTI_SELECTION | addToSelection(), enableGroupButton() |
| SINGLE_SELECTION | clickGroup | object is group | GROUP_SELECTION | selectGroup(), enableUngroupButton() |
| SINGLE_SELECTION | dragStart | - | SINGLE_SELECTION_MOVING | startDrag(), showMoveCursor() |
| SINGLE_SELECTION_MOVING | dragEnd | - | SINGLE_SELECTION | finishMove(), saveState() |
| SINGLE_SELECTION | copy | - | SINGLE_SELECTION_COPYING | copyToClipboard(), enablePasteButton() |
| SINGLE_SELECTION_COPYING | paste | - | SINGLE_SELECTION | pasteFromClipboard(), createCopies() |
| MULTI_SELECTION | clickEmpty | - | NO_SELECTION | clearSelection(), disableAllButtons() |
| MULTI_SELECTION | clickObject | !ctrl pressed | SINGLE_SELECTION | clearSelection(), selectSingleObject() |
| MULTI_SELECTION | ctrlClickObject | ctrl pressed & not selected | MULTI_SELECTION | addToSelection() |
| MULTI_SELECTION | ctrlClickSelectedObject | ctrl pressed & already selected | MULTI_SELECTION or SINGLE_SELECTION | removeFromSelection(), checkSelectionCount() |
| MULTI_SELECTION | dragStart | - | MULTI_SELECTION_MOVING | startMultiDrag() |
| MULTI_SELECTION_MOVING | dragEnd | - | MULTI_SELECTION | finishMultiMove(), saveState() |
| MULTI_SELECTION | groupAction | selection count >= 2 | SINGLE_SELECTION | createGroup(), replaceObjectsWithGroup() |
| GROUP_SELECTION | clickEmpty | - | NO_SELECTION | clearSelection(), disableAllButtons() |
| GROUP_SELECTION | clickObject | different object | SINGLE_SELECTION | clearSelection(), selectNewObject() |
| GROUP_SELECTION | ctrlClickObject | ctrl pressed | MULTI_SELECTION | addToSelection() |
| GROUP_SELECTION | dragStart | - | GROUP_SELECTION_MOVING | startGroupDrag() |
| GROUP_SELECTION_MOVING | dragEnd | - | GROUP_SELECTION | finishGroupMove(), saveState() |
| GROUP_SELECTION | ungroupAction | - | MULTI_SELECTION | breakGroup(), selectUngroupedObjects() |

## 4. Undo/Redo State Transition Table

| Current State | Event/Trigger | Guard Condition | Next State | Actions |
|---------------|---------------|----------------|------------|---------|
| NO_HISTORY | stateChange | - | HAS_HISTORY | saveToUndoStack(), clearRedoStack(), enableUndoButton() |
| HAS_HISTORY | stateChange | - | HAS_HISTORY | saveToUndoStack(), clearRedoStack() |
| HAS_HISTORY | undo | redoStack.isEmpty() | HAS_UNDO_ONLY | moveToRedoStack(), restorePreviousState() |
| HAS_HISTORY | undo | !redoStack.isEmpty() | HAS_BOTH | moveToRedoStack(), restorePreviousState(), enableRedoButton() |
| HAS_HISTORY | undoAll | - | HAS_REDO_ONLY | moveAllToRedoStack(), restoreInitialState(), disableUndoButton() |
| HAS_UNDO_ONLY | redo | - | HAS_BOTH | moveToUndoStack(), restoreNextState(), enableUndoButton() |
| HAS_UNDO_ONLY | undo | undoStack.size() > 1 | HAS_UNDO_ONLY | moveToRedoStack(), restorePreviousState() |
| HAS_UNDO_ONLY | undo | undoStack.size() == 1 | NO_HISTORY | moveToRedoStack(), restoreInitialState(), disableUndoButton() |
| HAS_UNDO_ONLY | stateChange | - | HAS_UNDO_ONLY | saveToUndoStack(), clearRedoStack(), disableRedoButton() |
| HAS_REDO_ONLY | undo | - | HAS_BOTH | restorePreviousState(), enableUndoButton() |
| HAS_REDO_ONLY | redo | redoStack.size() > 1 | HAS_REDO_ONLY | moveToUndoStack(), restoreNextState() |
| HAS_REDO_ONLY | redo | redoStack.size() == 1 | HAS_HISTORY | moveToUndoStack(), restoreNextState(), disableRedoButton() |
| HAS_BOTH | redoAll | - | HAS_UNDO_ONLY | moveAllToUndoStack(), restoreLatestState(), disableRedoButton() |
| HAS_BOTH | undoAll | - | HAS_REDO_ONLY | moveAllToRedoStack(), restoreInitialState(), disableUndoButton() |
| HAS_BOTH | undo | - | HAS_BOTH or HAS_REDO_ONLY | moveToRedoStack(), restorePreviousState(), checkUndoAvailability() |
| HAS_BOTH | redo | - | HAS_BOTH or HAS_UNDO_ONLY | moveToUndoStack(), restoreNextState(), checkRedoAvailability() |
| HAS_BOTH | stateChange | - | HAS_UNDO_ONLY | saveToUndoStack(), clearRedoStack(), disableRedoButton() |