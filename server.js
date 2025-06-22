const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const { get } = require('@vercel/edge-config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Default replacement points fallback
const DEFAULT_REPLACEMENT_POINTS = [
    "Spearheaded development of scalable web applications using modern JavaScript frameworks, resulting in 40% improved user engagement",
    "Engineered high-performance RESTful APIs using Node.js and Express, processing 10,000+ requests per minute with 99.9% uptime",
    "Implemented comprehensive testing strategies including unit, integration, and E2E tests, achieving 95% code coverage",
    "Collaborated with cross-functional teams using Agile methodologies to deliver features 25% faster than previous sprints",
    "Optimized database queries and implemented caching strategies, reducing response times by 60%",
    "Developed responsive user interfaces using React and TypeScript, supporting 10+ different device types",
    "Integrated third-party APIs and services, enabling seamless data synchronization across multiple platforms",
    "Mentored junior developers and conducted code reviews, improving team code quality by 30%",
    "Implemented CI/CD pipelines using GitHub Actions, reducing deployment time from hours to minutes",
    "Designed and built microservices architecture, improving system scalability and maintainability",
    "Created comprehensive documentation and technical specifications, reducing onboarding time for new team members by 50%",
    "Utilized Docker and Kubernetes for containerization and orchestration, ensuring consistent deployment environments",
    "Implemented security best practices including authentication, authorization, and data encryption",
    "Developed real-time features using WebSockets and Server-Sent Events, enhancing user experience",
    "Optimized application performance through code splitting, lazy loading, and bundle optimization techniques",
    "Built data visualization dashboards using D3.js and Chart.js, enabling stakeholders to make data-driven decisions",
    "Implemented automated monitoring and alerting systems, reducing system downtime by 80%",
    "Led migration from legacy systems to modern tech stack, improving performance and reducing maintenance costs",
    "Developed mobile-responsive applications using Progressive Web App (PWA) technologies",
    "Implemented GraphQL APIs for efficient data fetching, reducing network requests by 40%",
    "Created reusable component libraries and design systems, improving development efficiency across teams",
    "Integrated machine learning models into web applications, enabling intelligent features and recommendations",
    "Implemented advanced state management solutions using Redux and Context API for complex applications",
    "Developed automated testing frameworks and tools, reducing manual testing effort by 70%",
    "Built serverless functions using AWS Lambda and Vercel, optimizing costs and improving scalability",
    "Implemented advanced security measures including OWASP compliance and vulnerability assessments",
    "Created data migration scripts and ETL pipelines, successfully migrating 1M+ records with zero data loss",
    "Developed real-time collaboration features using operational transformation and conflict resolution algorithms",
    "Implemented internationalization (i18n) and localization (l10n) support for global user base",
    "Built advanced search functionality using Elasticsearch, improving search relevance and speed by 300%",
    "Developed custom build tools and webpack configurations, optimizing development workflow and build times",
    "Implemented advanced caching strategies using Redis and CDN, reducing server load by 50%",
    "Created automated deployment and rollback procedures, ensuring zero-downtime deployments",
    "Built comprehensive logging and monitoring solutions using ELK stack, improving debugging efficiency",
    "Developed API rate limiting and throttling mechanisms, ensuring fair usage and system stability"
];

// Route to serve main.tex
app.get('/main.tex', (req, res) => {
    const mainTexPath = path.join(__dirname, 'main.tex');
    if (fs.existsSync(mainTexPath)) {
        res.sendFile(mainTexPath);
    } else {
        res.status(404).json({ error: 'main.tex not found' });
    }
});

// API route to get LaTeX content
app.get('/api/latex', (req, res) => {
    const mainTexPath = path.join(__dirname, 'main.tex');
    if (fs.existsSync(mainTexPath)) {
        const content = fs.readFileSync(mainTexPath, 'utf8');
        res.json({ content });
    } else {
        res.status(404).json({ error: 'main.tex not found' });
    }
});

// API route to save LaTeX content (optional, for future use)
app.post('/api/latex', (req, res) => {
    const { content } = req.body;
    
    if (!content) {
        return res.status(400).json({ error: 'No LaTeX content provided' });
    }
    
    try {
        const mainTexPath = path.join(__dirname, 'main.tex');
        fs.writeFileSync(mainTexPath, content, 'utf8');
        res.json({ success: true, message: 'LaTeX content saved successfully' });
    } catch (error) {
        console.error('Error saving LaTeX content:', error);
        res.status(500).json({ error: 'Failed to save LaTeX content' });
    }
});

// API route to get replacement points
app.get('/api/replacement-points', async (req, res) => {
    try {
        // Try to get replacement points from Edge Config
        let points = null;
        
        if (process.env.EDGE_CONFIG) {
            try {
                points = await get('replacement-points');
                console.log('✅ Loaded replacement points from Edge Config');
            } catch (edgeConfigError) {
                console.log('⚠️ Edge Config not available or no data found, using fallback');
            }
        }
        
        // Fallback to local file if Edge Config is not available (local development)
        if (!points) {
            const replacementPointsPath = path.join(__dirname, 'replacement-points.json');
            if (fs.existsSync(replacementPointsPath)) {
                const content = fs.readFileSync(replacementPointsPath, 'utf8');
                points = JSON.parse(content);
                console.log('✅ Loaded replacement points from local file');
            } else {
                points = DEFAULT_REPLACEMENT_POINTS;
                console.log('✅ Using default replacement points');
            }
        }
        
        res.json(points);
    } catch (error) {
        console.error('Error loading replacement points:', error);
        // Return default points as final fallback
        res.json(DEFAULT_REPLACEMENT_POINTS);
    }
});

// API route to save replacement points
app.post('/api/replacement-points', async (req, res) => {
    try {
        const points = req.body;
        
        if (!Array.isArray(points)) {
            return res.status(400).json({ error: 'Replacement points must be an array' });
        }
        
        // Note: Edge Config is read-only from the API
        // We'll save to local file for development and inform user about Edge Config for production
        const replacementPointsPath = path.join(__dirname, 'replacement-points.json');
        fs.writeFileSync(replacementPointsPath, JSON.stringify(points, null, 2), 'utf8');
        
        let message = `Replacement points saved locally (${points.length} points)`;
        
        if (process.env.VERCEL_ENV === 'production') {
            message += '. Note: For production persistence, update these points in your Vercel Edge Config dashboard.';
        }
        
        res.json({ 
            success: true, 
            message: message,
            count: points.length,
            environment: process.env.VERCEL_ENV || 'development'
        });
        
        console.log(`✅ Saved ${points.length} replacement points`);
        
        if (process.env.VERCEL_ENV === 'production') {
            console.log('⚠️ Production detected: Remember to update Edge Config for persistence');
        }
        
    } catch (error) {
        console.error('Error saving replacement points:', error);
        res.status(500).json({ error: 'Failed to save replacement points' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        edgeConfig: !!process.env.EDGE_CONFIG,
        environment: process.env.VERCEL_ENV || 'development'
    });
});

// Fallback route - serve index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 LaTeX Resume Customizer server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`🔧 Edge Config: ${process.env.EDGE_CONFIG ? 'Enabled' : 'Not configured'}`);
    console.log(`🌍 Environment: ${process.env.VERCEL_ENV || 'development'}`);
    console.log('\n📋 Available endpoints:');
    console.log(`   GET  /           - Main application`);
    console.log(`   GET  /main.tex   - Load main.tex file`);
    console.log(`   GET  /api/latex  - Get LaTeX content as JSON`);
    console.log(`   POST /api/latex  - Save LaTeX content`);
    console.log(`   GET  /api/replacement-points  - Get replacement points`);
    console.log(`   POST /api/replacement-points - Save replacement points`);
    console.log(`   GET  /health     - Health check`);
    console.log('\n✨ LaTeX editor ready! Users can copy the generated LaTeX code to compile elsewhere.');
    
    if (process.env.VERCEL_ENV === 'production' && !process.env.EDGE_CONFIG) {
        console.log('\n⚠️  WARNING: Edge Config not configured for production. Replacement points will not persist between deployments.');
        console.log('   Set up Edge Config in your Vercel dashboard for persistent storage.');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
}); 