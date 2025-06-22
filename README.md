# LaTeX Resume Customizer

A **static web-based tool** for customizing LaTeX resume content with an intuitive interface. Edit your resume bullet points, preview the generated LaTeX code, and export it for compilation in Overleaf or your local LaTeX environment.

## ✨ Features

- **Interactive Resume Editor**: Load and edit your LaTeX resume content
- **Bullet Point Customization**: Easily modify job experience bullet points
- **Persistent Replacement Points**: Manage and store custom bullet points using localStorage
- **Live LaTeX Preview**: View generated LaTeX code in real-time
- **Copy & Export**: Copy LaTeX code to clipboard or download as .tex file
- **Company-Organized Interface**: Bullet points grouped by company for easy navigation
- **Responsive Design**: Works on desktop and mobile devices
- **No Server Required**: Pure HTML/CSS/JavaScript - works offline!

## 🚀 Quick Start

### Static File Usage (Recommended)

1. **Clone or download the repository**
   ```bash
   git clone <your-repo-url>
   cd latex-resume-customizer
   ```

2. **Open the HTML file**
   - Simply double-click `index.html` to open in your browser
   - Or serve it with any static file server:
     ```bash
     # Using Python
     python3 -m http.server 8000
     
     # Using Node.js (if you have it)
     npx serve .
     
     # Using any other static file server
     ```

3. **Start customizing**
   - Your LaTeX file should be named `main.tex` in the same directory
   - Or upload any LaTeX file using the file picker

### Deploy Anywhere

Since this is now a static site, you can deploy it to any static hosting service:

- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **Netlify**: Drag and drop the files or connect your Git repo
- **Vercel**: Deploy static files without server configuration
- **Any web server**: Upload the files to any web hosting service

## 📁 Project Structure

```
latex-resume-customizer/
├── index.html              # Main web interface (standalone)
├── main.tex                # Your LaTeX resume template
├── replacement-points.json # Default replacement points (optional)
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 How to Use

1. **Load Your Resume**
   - Click "Load main.tex" to load the default resume template
   - Or upload your own LaTeX file using "Upload Different LaTeX File"

2. **Customize Bullet Points**
   - Click "🔧 Manage Replacement Points" to access the bullet point library
   - Edit, add, or remove bullet points with persistent localStorage storage
   - Points are automatically saved and available across browser sessions
   - Organize points by company/job for easy navigation

3. **Export LaTeX Code**
   - Click "View & Export LaTeX Code" to see the generated LaTeX
   - Copy the code to clipboard or download as a .tex file
   - Paste into [Overleaf](https://overleaf.com) or your local LaTeX editor to compile PDF

## 🌐 Generating PDF

This application generates LaTeX code that you can compile elsewhere:

1. **Using Overleaf (Recommended)**
   - Copy the generated LaTeX code
   - Paste it into a new project on [Overleaf](https://overleaf.com)
   - Click "Recompile" to generate your PDF

2. **Using Local LaTeX Installation**
   - Download the .tex file
   - Compile using your local LaTeX installation:
     ```bash
     pdflatex your-resume.tex
     ```

## 💾 Data Storage

- **Replacement Points**: Stored in browser localStorage for persistence across sessions
- **LaTeX Files**: Loaded from local files or uploaded via file picker
- **No Server Required**: All data processing happens in the browser

## 🔧 Browser Requirements

- **Modern Browser**: Chrome, Firefox, Safari, Edge (ES6+ support required)
- **File API Support**: For loading local LaTeX files
- **localStorage**: For persistent replacement points storage
- **Clipboard API**: For copy-to-clipboard functionality (optional)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check that your LaTeX syntax is valid
2. Ensure all required LaTeX packages are available in your compilation environment
3. Try the "View & Export LaTeX Code" option to debug manually
4. Open an issue on GitHub with details about the problem

## 🎯 Future Enhancements

- [ ] Support for multiple resume templates
- [ ] Real-time LaTeX syntax highlighting
- [ ] Integration with more LaTeX editors
- [ ] Template customization options
- [ ] Export to different formats

---

Made with ❤️ for the LaTeX community 