# Vercel Edge Config Setup Guide

This guide will help you set up Vercel Edge Config for persistent replacement points storage in your LaTeX Resume Customizer.

## What is Edge Config?

Vercel Edge Config is a global, read-only data store that allows you to store configuration data that can be accessed at the edge with ultra-low latency. It's perfect for storing replacement points that need to persist across deployments.

## Pricing

- **Hobby Plan**: 100 writes/month FREE, 100,000 reads/month FREE
- **Pro Plan**: 1,000 writes/month included, 1M reads/month included
- **Additional usage**: $5.00 per 500 writes, $3.00 per 1M reads

For managing replacement points, the free tier is more than sufficient.

## Setup Instructions

### Step 1: Create Edge Config in Vercel Dashboard

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Storage** tab
4. Click **Create Database** → **Edge Config**
5. Name it `latex-replacement-points` (or any name you prefer)
6. Click **Create**

### Step 2: Connect Edge Config to Your Project

1. In your project's **Settings** → **Environment Variables**
2. Vercel should automatically add `EDGE_CONFIG` environment variable
3. If not, add it manually:
   - **Name**: `EDGE_CONFIG`
   - **Value**: Your Edge Config connection string (found in Storage tab)
   - **Environment**: Production, Preview, Development

### Step 3: Add Initial Replacement Points Data

1. Go to **Storage** → Your Edge Config
2. Click **Edit Config**
3. Add a new item:
   - **Key**: `replacement-points`
   - **Value**: Copy and paste the JSON array from your `replacement-points.json` file

Example JSON structure:
```json
[
  "Spearheaded development of scalable web applications using modern JavaScript frameworks, resulting in 40% improved user engagement",
  "Engineered high-performance RESTful APIs using Node.js and Express, processing 10,000+ requests per minute with 99.9% uptime",
  "Implemented comprehensive testing strategies including unit, integration, and E2E tests, achieving 95% code coverage"
]
```

4. Click **Save**

### Step 4: Deploy Your Application

1. Push your updated code to your repository
2. Vercel will automatically deploy with Edge Config enabled
3. Your replacement points will now persist across deployments!

## How It Works

### Development (Local)
- Uses local `replacement-points.json` file
- Changes are saved locally for testing
- Falls back to default points if file doesn't exist

### Production (Vercel)
- **Reading**: Automatically loads from Edge Config
- **Writing**: Saves locally + shows message about updating Edge Config
- **Fallback**: Uses default points if Edge Config is unavailable

## Managing Replacement Points in Production

### Option 1: Vercel Dashboard (Recommended)
1. Go to **Storage** → Your Edge Config
2. Edit the `replacement-points` key
3. Update the JSON array
4. Save changes (takes effect immediately)

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Update Edge Config
vercel env pull  # Get your EDGE_CONFIG URL
# Use the Vercel API or dashboard to update
```

### Option 3: API (Advanced)
Use Vercel's Edge Config API to programmatically update values.

## Verification

### Check if Edge Config is Working

1. Visit your deployed app's `/health` endpoint
2. Look for:
   ```json
   {
     "status": "OK",
     "edgeConfig": true,
     "environment": "production"
   }
   ```

3. Check your application logs for:
   ```
   ✅ Loaded replacement points from Edge Config
   🔧 Edge Config: Enabled
   ```

### Test the Flow

1. **Load Points**: Visit your app, click "🔧 Manage Replacement Points"
2. **Verify Source**: Check browser network tab - should load from `/api/replacement-points`
3. **Edit Points**: Make changes and save
4. **Check Persistence**: Redeploy your app and verify points are still there

## Troubleshooting

### Edge Config Not Working
```
⚠️ Edge Config not available or no data found, using fallback
```

**Solutions:**
1. Verify `EDGE_CONFIG` environment variable is set
2. Check that the `replacement-points` key exists in your Edge Config
3. Ensure Edge Config is connected to your project

### Points Not Persisting
```
⚠️ Production detected: Remember to update Edge Config for persistence
```

**Solutions:**
1. Manually update Edge Config through Vercel dashboard
2. Copy your local `replacement-points.json` content to Edge Config
3. Set up automated sync (advanced)

### Local Development Issues
- Edge Config is not required for local development
- App will use local `replacement-points.json` file
- Falls back to default points if file doesn't exist

## Migration from File-Based Storage

Your existing `replacement-points.json` will continue to work:
- **Local development**: Uses file as before
- **Production**: Automatically tries Edge Config first, then falls back to file
- **No data loss**: Default points are always available as final fallback

## Best Practices

1. **Keep a Backup**: Save your replacement points in your repository as `replacement-points.json`
2. **Version Control**: Consider versioning your Edge Config changes
3. **Testing**: Test changes in preview deployments before production
4. **Monitoring**: Check the `/health` endpoint to verify Edge Config status

## Cost Optimization

- **Reads are cheap**: 100,000 reads/month free on Hobby plan
- **Writes are limited**: 100 writes/month free - perfect for occasional updates
- **Caching**: Edge Config is cached globally for ultra-fast access

## Next Steps

1. Follow the setup instructions above
2. Deploy your application
3. Test the replacement points management
4. Enjoy persistent storage without databases!

---

Need help? Check the [Vercel Edge Config documentation](https://vercel.com/docs/storage/edge-config) or open an issue in this repository. 