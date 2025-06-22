const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const SwiftLaTeXCompiler = require('./swiftlatex-compiler');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SwiftLaTeX compiler
const swiftlatex = new SwiftLaTeXCompiler();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(tempDir);

// Route to serve main.tex
app.get('/main.tex', (req, res) => {
    const mainTexPath = path.join(__dirname, 'main.tex');
    if (fs.existsSync(mainTexPath)) {
        res.sendFile(mainTexPath);
    } else {
        res.status(404).json({ error: 'main.tex not found' });
    }
});

// PDF compilation endpoint using SwiftLaTeX
app.post('/compile-pdf', async (req, res) => {
    const { latex, texContent } = req.body;
    const latexContent = latex || texContent;
    
    if (!latexContent) {
        return res.status(400).json({ error: 'No LaTeX content provided' });
    }

    const sessionId = uuidv4();
    console.log(`📝 Compiling LaTeX with SwiftLaTeX for session ${sessionId}...`);

    try {
        // Compile LaTeX using SwiftLaTeX WebAssembly engine
        const result = await swiftlatex.compileLaTeX(latexContent);
        
        if (result.success && result.pdf) {
            // Set headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
            res.setHeader('Content-Length', result.pdf.length);
            
            // Send PDF
            res.send(Buffer.from(result.pdf));
            
            console.log(`✅ PDF compiled successfully with SwiftLaTeX for session ${sessionId}`);
        } else {
            throw new Error(result.error || 'SwiftLaTeX compilation failed');
        }
        
    } catch (error) {
        console.error(`❌ SwiftLaTeX compilation failed for session ${sessionId}:`, error.message);
        
        let suggestions = [
            'Check that your LaTeX syntax is correct',
            'Ensure you are using supported LaTeX packages',
            'Try using the "View LaTeX Code" option to debug manually'
        ];
        
        // Add specific suggestions based on error type
        if (error.message.includes('engine')) {
            suggestions.unshift('SwiftLaTeX WebAssembly engine may need reinitialization');
        }
        
        res.status(500).json({ 
            error: 'LaTeX compilation failed', 
            details: error.message,
            suggestions: suggestions,
            compilationLog: error.log || 'No compilation log available'
        });
    }
});

// SwiftLaTeX handles compilation internally - no external pdflatex needed!

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Fallback route - serve index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 LaTeX Resume Customizer server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`🔧 Temp directory: ${tempDir}`);
    console.log(`⚡ Using SwiftLaTeX WebAssembly engine (no pdflatex installation required!)`);
    console.log('\n📋 Available endpoints:');
    console.log(`   GET  /           - Main application`);
    console.log(`   GET  /main.tex   - Load main.tex file`);
    console.log(`   POST /compile-pdf - Compile LaTeX to PDF with SwiftLaTeX`);
    console.log(`   GET  /health     - Health check`);
    
    // Initialize SwiftLaTeX in the background
    console.log('\n🔄 Initializing SwiftLaTeX engine...');
    try {
        await swiftlatex.initialize();
        console.log('✅ SwiftLaTeX ready for PDF compilation!');
    } catch (error) {
        console.error('❌ Failed to initialize SwiftLaTeX:', error.message);
        console.log('⚠️  PDF generation will be attempted on first request');
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    try {
        await swiftlatex.cleanup();
        await fs.remove(tempDir);
        console.log('🧹 Cleaned up SwiftLaTeX and temporary files');
    } catch (error) {
        console.warn('⚠️ Error during cleanup:', error.message);
    }
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    try {
        await swiftlatex.cleanup();
        await fs.remove(tempDir);
        console.log('🧹 Cleaned up SwiftLaTeX and temporary files');
    } catch (error) {
        console.warn('⚠️ Error during cleanup:', error.message);
    }
    process.exit(0);
}); 