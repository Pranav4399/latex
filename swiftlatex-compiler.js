const pdflatex = require('node-pdflatex').default;

class LaTeXCompiler {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log('🔄 Initializing LaTeX compiler...');
            
            // Test if pdflatex is available by compiling a simple document
            const testLatex = `
\\documentclass{article}
\\begin{document}
Test document
\\end{document}
`;
            
            await pdflatex(testLatex);
            this.isInitialized = true;
            console.log('✅ LaTeX compiler initialized successfully');
            console.log('🚀 Using system pdflatex for high-quality PDF generation');
            
        } catch (error) {
            console.error('❌ Failed to initialize LaTeX compiler:', error.message);
            if (error.message.includes('pdflatex')) {
                throw new Error('pdflatex not found. Please install LaTeX (e.g., MacTeX, TeX Live, or MiKTeX)');
            }
            throw error;
        }
    }

    async compileLaTeX(texContent, mainFileName = 'main.tex') {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            console.log('📝 Compiling LaTeX with pdflatex...');
            
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('LaTeX compilation timeout (30 seconds)')), 30000);
            });
            
            // Compile LaTeX using node-pdflatex with timeout
            const pdfBuffer = await Promise.race([
                pdflatex(texContent),
                timeoutPromise
            ]);
            
            console.log('✅ LaTeX compilation successful');
            return {
                success: true,
                pdf: pdfBuffer,
                log: 'LaTeX compilation completed successfully using pdflatex'
            };
            
        } catch (error) {
            console.error('❌ LaTeX compilation error:', error.message);
            
            // Extract useful error information
            let errorMessage = error.message;
            let suggestions = [
                'Check that your LaTeX syntax is correct',
                'Ensure you are using supported LaTeX packages',
                'Try using the "View LaTeX Code" option to debug manually'
            ];
            
            // Add specific suggestions based on error type
            if (errorMessage.includes('timeout')) {
                suggestions.unshift('LaTeX compilation timed out - check for missing packages or infinite loops');
                suggestions.push('Try installing missing LaTeX packages: sudo tlmgr install <package-name>');
            } else if (errorMessage.includes('Undefined control sequence')) {
                suggestions.unshift('Check for typos in LaTeX commands');
            } else if (errorMessage.includes('Missing')) {
                suggestions.unshift('Check for missing braces, brackets, or packages');
            } else if (errorMessage.includes('Package') || errorMessage.includes('qrcode') || errorMessage.includes('soul')) {
                suggestions.unshift('Install missing LaTeX packages with: sudo tlmgr install qrcode soul babel-english');
            }
            
            return {
                success: false,
                error: errorMessage,
                log: `Compilation failed: ${errorMessage}`
            };
        }
    }

    cleanup() {
        // No cleanup needed for node-pdflatex
        this.isInitialized = false;
        console.log('🧹 LaTeX compiler cleanup completed');
    }
}

module.exports = LaTeXCompiler; 