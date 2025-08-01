# Sketch Drawing App

A feature-rich 2D sketch drawing application built with vanilla JavaScript,
HTML, and CSS. This project demonstrates the power of spec-driven development
using Kiro's AI-assisted workflow.

## Features

- **Multiple Drawing Modes**: Freehand, Line, Rectangle, Square, Ellipse, Circle
- **Object Selection**: Select and manipulate drawn objects
- **Color Picker**: Choose any color for your drawings
- **Undo/Redo**: Full command history with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Object Deletion**: Delete selected objects with the Delete key
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with containerization

## How It Was Built

This project was developed using **Kiro's spec-driven development process**:

### 1. Requirements Gathering

- Started with a rough idea: "Create a sketch drawing program with basic shapes
  and selection"
- Kiro helped transform this into detailed requirements with user stories and
  acceptance criteria
- Added grouping and save/load functionality based on user feedback

### 2. Design Phase

- Created comprehensive technical design with architecture diagrams
- Defined data models, component interfaces, and error handling strategies
- Planned Docker containerization approach

### 3. Implementation Planning

- Generated 22 detailed implementation tasks
- Each task included specific coding objectives and requirement references
- Tasks were designed to build incrementally with proper testing

### 4. Iterative Development

- Initially started with React + TypeScript but encountered compatibility issues
- Pivoted to vanilla JavaScript for simplicity and reliability
- Kiro adapted the implementation to maintain all planned features

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Pure CSS with responsive design
- **Containerization**: Docker with Nginx
- **Architecture**: Object-oriented design with command pattern for undo/redo

## Quick Start

### Using Docker (Recommended)

```bash
# Build the container
docker build -t sketch-app .

# Run the application
docker run -p 3000:80 sketch-app
```

Then open http://localhost:3000 in your browser.

### Local Development

Simply open `index.html` in your web browser - no build process required!

## Usage

1. **Select Drawing Mode**: Choose from freehand, geometric shapes, polygons, or
   selection mode
2. **Pick a Color**: Use the color picker to set your drawing color
3. **Draw Shapes**: Click and drag on the canvas to create shapes
4. **Draw Polygons**: Click points in sequence, double-click to finish
5. **Select Objects**: Click individual objects or drag a selection box around
   multiple objects
6. **Manipulate Objects**: Copy (Ctrl+C), Paste (Ctrl+V), Delete, and move
   selected objects
7. **Undo/Redo**: Use Ctrl+Z and Ctrl+Y or the toolbar buttons

## Drawing Modes

- **Freehand**: Click and drag to draw freely
- **Line**: Click and drag to draw straight lines
- **Rectangle**: Click and drag to draw rectangles
- **Square**: Click and drag to draw perfect squares
- **Ellipse**: Click and drag to draw ellipses
- **Circle**: Click and drag to draw perfect circles
- **Open Polygon**: Click points in sequence, double-click to finish open shape
- **Closed Polygon**: Click points in sequence, double-click to close shape
- **Select**: Click objects or drag selection box to select multiple objects

## Keyboard Shortcuts

- `Ctrl + Z`: Undo
- `Ctrl + Y`: Redo
- `Ctrl + C`: Copy selected objects
- `Ctrl + V`: Paste copied objects
- `Delete`: Remove selected objects

## Project Structure

```
sketch-drawing-app/
├── index.html          # Main HTML file
├── app.js             # Core application logic
├── styles.css         # Styling and responsive design
├── Dockerfile.dev     # Development container
├── nginx.conf         # Nginx configuration
└── # Sketch Drawing App

A simple sketch drawing program built with vanilla JavaScript, HTML5 Canvas, and CSS. The application provides a 2D drawing space with multiple drawing modes, color selection, object manipulation capabilities, and advanced features like grouping, undo/redo, and save/load functionality.

## Features

### Drawing Modes
- **Freehand**: Draw sketches using scribbled freehand lines
- **Line**: Draw straight lines between two points
- **Rectangle**: Draw rectangles (with square constraint option)
- **Ellipse**: Draw ellipses (with circle constraint option)
- **Polygon**: Draw polygons with multiple vertices (open and closed)
- **Select**: Select and manipulate existing objects

### Object Manipulation
- **Single Selection**: Click on objects to select them
- **Multi-Selection**: Hold Ctrl and click to select multiple objects
- **Move Objects**: Drag selected objects to move them
- **Change Colors**: Select objects and use color picker or Change Color button
- **Delete Objects**: Use Delete key or button to remove selected objects
- **Copy/Paste**: Copy selected objects with Ctrl+C, paste with Ctrl+V
- **Group Objects**: Select multiple objects and use Group button or Ctrl+G
- **Ungroup Objects**: Select a group and use Ungroup button or Ctrl+Shift+G

### Advanced Features
- **Undo/Redo**: Full undo/redo functionality with Ctrl+Z and Ctrl+Y
- **Color Selection**: Choose colors for drawing objects
- **Save/Load**: Save and load drawings using browser localStorage
- **Real-time Preview**: See shapes as you draw them

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Canvas**: HTML5 Canvas API for rendering
- **Styling**: Pure CSS with flexbox layout
- **Architecture**: Object-oriented design with drawable shape classes
- **Container**: Docker with Nginx Alpine for serving static files
- **Storage**: Browser localStorage for persistence

## Project Structure

```
sketch-drawing-app/
├── index.html          # Main HTML file with canvas and toolbar
├── app.js             # Main application logic and classes
├── styles.css         # CSS styling and layout
├── Dockerfile         # Docker configuration
├── nginx.conf         # Nginx server configuration
├── .dockerignore      # Docker ignore file
└── .gitignore         # Git ignore file
```

## Running the Application

### Option 1: Docker (Recommended)

1. **Build the Docker image:**
   ```bash
   cd sketch-drawing-app
   docker build -t sketch-drawing-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:80 sketch-drawing-app
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

### Option 2: Local Development Server

For development, you can serve the files using any local web server:

#### Using Python (if installed):
```bash
cd sketch-drawing-app
# Python 3
python -m http.server 8000
# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js (if installed):
```bash
cd sketch-drawing-app
npx http-server -p 8000
```

#### Using PHP (if installed):
```bash
cd sketch-drawing-app
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 3: Direct File Access

You can also open `index.html` directly in your browser, though some features (like save/load) may not work due to browser security restrictions.

## Usage Instructions

### Basic Drawing
1. Select a drawing mode from the dropdown menu
2. Choose a color using the color picker
3. Click and drag on the canvas to draw shapes
4. For polygons, click multiple points and double-click to finish

### Object Manipulation
1. Switch to "Select" mode
2. **Single Selection**: Click on objects to select them (selected objects will be highlighted)
3. **Multi-Selection**: Hold Ctrl and click on additional objects to select multiple items
4. **Move Objects**: Drag selected objects to move them
5. **Change Colors**: 
   - Select objects and use the color picker to instantly change their color
   - Or use the "Change Color" button or press Ctrl+R
   - Works with individual objects, multiple objects, and groups
6. **Group Objects**: Select multiple objects and click Group button or press Ctrl+G
7. **Ungroup Objects**: Select a group and click Ungroup button or press Ctrl+Shift+G
8. **Delete Objects**: Use Delete key or button to remove selected objects
9. **Copy/Paste**: Use Ctrl+C and Ctrl+V to copy and paste objects

### Advanced Features
- **Undo/Redo**: Use Ctrl+Z to undo, Ctrl+Y to redo
- **Grouping**: Select multiple objects and use group button
- **Save/Load**: Use save/load buttons to persist your drawings
- **Clear**: Use clear button to remove all objects

## Keyboard Shortcuts

- `Ctrl+Z` - Undo last action
- `Ctrl+Y` - Redo last undone action
- `Delete` - Delete selected objects
- `Ctrl+C` - Copy selected objects
- `Ctrl+V` - Paste copied objects
- `Ctrl+G` - Group selected objects
- `Ctrl+Shift+G` - Ungroup selected group
- `Ctrl+R` - Change color of selected objects
- `Ctrl+S` - Save current drawing
- `Ctrl+O` - Load saved drawing

## Browser Compatibility

The application works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS Flexbox
- localStorage API

Tested browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Architecture

The application uses a single main class `SketchApp` that manages all functionality:

- **DrawableObject**: Base class for all shapes
- **Shape Classes**: FreehandPath, Line, Rectangle, Ellipse, Polygon
- **State Management**: Objects array, undo/redo stacks, selection state
- **Event Handling**: Mouse events for drawing and selection
- **Rendering**: Canvas-based rendering with real-time preview

### Adding New Features

1. **New Shape Types**: Extend the `DrawableObject` class
2. **New Tools**: Add to the `DrawingMode` enum and implement in `SketchApp`
3. **UI Enhancements**: Modify `index.html` and `styles.css`
4. **Storage**: Extend the save/load functionality in `SketchApp`

## Docker Configuration

The application uses a simple nginx-based Docker container:

- **Base Image**: nginx:alpine (lightweight)
- **Port**: 80 (mapped to host port 8080)
- **Health Check**: Built-in HTTP health check
- **Static Files**: All files served directly by nginx

## Assignment Requirements

This project fulfills the requirements for a simple sketch drawing program including:

✅ 2D drawing space with multiple drawing modes  
✅ Freehand, line, rectangle, ellipse, and polygon drawing  
✅ Special cases (squares and circles)  
✅ Color selection for graphical objects  
✅ Object selection and manipulation (move, cut, paste)  
✅ Advanced grouping and ungrouping functionality  
✅ Undo and redo operations  
✅ Save and load functionality for drawings  

## License

This project is created for educational purposes as part of a software design assignment.

## Contributing

This is an educational project. For improvements or bug fixes, please follow standard development practices:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Canvas not displaying**: Check browser console for JavaScript errors
2. **Save/Load not working**: Ensure localStorage is enabled in your browser
3. **Docker build fails**: Make sure Docker is installed and running
4. **Performance issues**: Try reducing the number of objects or clearing the canvas

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all files are present and accessible
3. Test in a different browser
4. Check Docker logs if using containerized version          # This file
```

## The Kiro Advantage

This project showcases how Kiro's AI-assisted development process enables:

- **Rapid Prototyping**: From idea to working application in hours
- **Comprehensive Planning**: Detailed specs prevent scope creep and missed
  requirements
- **Adaptive Development**: Ability to pivot technologies while maintaining
  feature completeness
- **Quality Assurance**: Built-in error handling and user experience
  considerations
- **Documentation**: Auto-generated specs serve as living documentation

The entire development process was guided by AI, from requirements gathering
through implementation, demonstrating the future of collaborative human-AI
software development.

---

_Built with ❤️ using Kiro's spec-driven development workflow_
