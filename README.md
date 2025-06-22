# LaTeX Resume Customizer

A modern web-based application for customizing LaTeX resume bullet points with real-time PDF generation.

## Features

- 🎯 **Interactive Bullet Point Editor**: Organize and edit resume bullets by company
- 🔄 **Smart Replacement System**: Choose from 30+ professional bullet point templates
- 📄 **Direct PDF Generation**: Compile LaTeX to PDF using SwiftLaTeX WebAssembly (no installation required)
- 🚀 **Modern Node.js Backend**: Fast, reliable server with proper error handling
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations

## Prerequisites

- **Node.js** (v14 or higher)
- Modern web browser

**No LaTeX installation required!** This application uses SwiftLaTeX WebAssembly engine for PDF compilation.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
latex-resume-customizer/
├── package.json              # Node.js dependencies and scripts
├── server.js                 # Express server with LaTeX compilation
├── main.tex                  # Sample LaTeX resume file
├── public/                   # Static files served to browser
│   ├── index.html            # Main application interface
│   └── replacement-points.js # Bullet point templates
└── temp/                     # Temporary files (auto-created)
```

## How It Works

### 1. Load Your Resume
- The app automatically loads `main.tex` on startup
- Or upload your own LaTeX resume file
- Extracts bullet points from `\resumeItem{}` commands

### 2. Edit Bullet Points
- Bullet points are organized by company from `\resumeSubheading`
- Edit existing bullets or add new ones
- Company-specific "Add New Bullet" buttons

### 3. Replace with Templates
- Click "Replace" on any bullet point
- Choose from 30+ professional software development bullets
- Instantly updates your resume content

### 4. Generate PDF
- **Direct PDF Generation**: Uses SwiftLaTeX WebAssembly for high-quality output (no installation required)
- **View LaTeX Code**: Copy or download the modified LaTeX
- **Error Handling**: Clear error messages with helpful suggestions

## API Endpoints

- `GET /` - Main application
- `GET /main.tex` - Load the main LaTeX file
- `POST /compile-pdf` - Compile LaTeX to PDF
- `GET /health` - Server health check

## LaTeX Requirements

Your LaTeX resume should use:
- `\section{Experience}` for the experience section
- `\resumeSubheading{Job Title}{Company}{Location}{Date}` for job headers
- `\resumeItem{bullet point text}` for individual bullet points

Example structure:
```latex
\section{Experience}
\resumeSubheading{Software Engineer}{Atlas of Behavior Change}{Remote}{Jan 2023 -- Present}
\resumeItemListStart
    \resumeItem{Developed scalable web applications using modern frameworks}
    \resumeItem{Collaborated with cross-functional teams on feature delivery}
\resumeItemListEnd
```

## Customization

### Adding New Replacement Points
Edit `public/replacement-points.js` to add your own bullet point templates:

```javascript
const replacementPoints = [
    "Your custom bullet point here",
    "Another professional achievement",
    // ... add more
];
```

### Styling
The application uses embedded CSS in `public/index.html`. Key design elements:
- CSS Grid layout for responsive design
- Gradient backgrounds and modern shadows
- Smooth hover animations
- Modal dialogs for replacement selection

## Troubleshooting

### PDF Generation Issues

**Error: "pdflatex not found"**
- Install a LaTeX distribution (TeX Live, MiKTeX)
- Ensure `pdflatex` is in your system PATH
- Test with: `pdflatex --version`

**Error: "LaTeX compilation failed"**
- Check your LaTeX syntax
- Ensure all required packages are installed
- Use "View LaTeX Code" to debug manually

### File Loading Issues

**Error: "main.tex not found"**
- Ensure `main.tex` exists in the project root
- Use "Upload Different LaTeX File" as alternative

## Development

### Running in Development Mode
```bash
npm run dev
```
Uses `nodemon` for automatic server restart on file changes.

### Project Dependencies
- **express**: Web server framework
- **fs-extra**: Enhanced file system operations
- **uuid**: Unique session ID generation
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling (for future features)

## Deployment

The application can be deployed to:
- **Heroku**: Add `engines` field in package.json
- **Railway**: Direct deployment from Git
- **DigitalOcean App Platform**: Node.js app deployment
- **Self-hosted**: Any server with Node.js and LaTeX

**Note**: Ensure your deployment environment has LaTeX installed for PDF generation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs in the console
3. Use "View LaTeX Code" for manual debugging
4. Open an issue on GitHub

---

**Happy resume customizing!** 🚀 