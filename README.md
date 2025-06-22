# LaTeX Resume Customizer

A web-based tool for customizing LaTeX resume content with an intuitive interface. Edit your resume bullet points, preview the generated LaTeX code, and export it for compilation in Overleaf or your local LaTeX environment.

## ✨ Features

- **Interactive Resume Editor**: Load and edit your LaTeX resume content
- **Bullet Point Customization**: Easily modify job experience bullet points
- **Persistent Replacement Points**: Manage and store custom bullet points using Vercel Edge Config
- **Live LaTeX Preview**: View generated LaTeX code in real-time
- **Copy & Export**: Copy LaTeX code to clipboard or download as .tex file
- **Company-Organized Interface**: Bullet points grouped by company for easy navigation
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd latex-resume-customizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Deploy with default settings

3. **Your app is live!**
   Vercel will provide you with a live URL for your LaTeX Resume Customizer.

## 📁 Project Structure

```
latex-resume-customizer/
├── public/
│   └── index.html          # Main web interface
├── server.js               # Express server
├── main.tex                # Your LaTeX resume template
├── package.json            # Node.js dependencies
├── vercel.json            # Vercel deployment configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 How to Use

1. **Load Your Resume**
   - Click "Load main.tex" to load the default resume template
   - Or upload your own LaTeX file using "Upload Different LaTeX File"

2. **Customize Bullet Points**
   - Click "🔧 Manage Replacement Points" to access the bullet point library
   - Edit, add, or remove bullet points with persistent storage
   - Points are automatically saved and available across deployments (with Edge Config)
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

## 🛠 API Endpoints

- `GET /` - Main application interface
- `GET /main.tex` - Serve the LaTeX template file
- `GET /api/latex` - Get LaTeX content as JSON
- `POST /api/latex` - Save LaTeX content (optional)
- `GET /api/replacement-points` - Get replacement points from Edge Config
- `POST /api/replacement-points` - Save replacement points
- `GET /health` - Health check endpoint (includes Edge Config status)

## 🔧 Environment Variables

- `EDGE_CONFIG` - Vercel Edge Config connection string (automatically set by Vercel)
- `VERCEL_ENV` - Environment indicator (development/preview/production)

For persistent replacement points storage, set up Edge Config in your Vercel dashboard. See `EDGE_CONFIG_SETUP.md` for detailed instructions.

## 📦 Dependencies

- **express**: Web server framework
- **cors**: Cross-origin resource sharing
- **fs-extra**: Enhanced file system operations
- **@vercel/edge-config**: Vercel Edge Config SDK for persistent storage

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