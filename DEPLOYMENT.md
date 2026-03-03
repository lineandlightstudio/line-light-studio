# Deployment Guide: Line & Light Studio

This guide walks you through deploying the Line & Light Studio app to Railway and connecting your custom domain `lineandlightstudio.info`.

## Prerequisites

- A Railway account (free tier available at railway.app)
- Your domain `lineandlightstudio.info` with DNS access
- Git installed locally (or you can use Railway's GitHub integration)

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with email or GitHub
3. Create a new project

## Step 2: Deploy to Railway

### Option A: Using GitHub (Recommended)

1. Push this project to GitHub
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/line-light-studio.git
   git branch -M main
   git push -u origin main
   ```

2. In Railway dashboard:
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize Railway to access your GitHub
   - Select your `line-light-studio` repository
   - Railway will auto-detect the Node.js project and deploy

### Option B: Using Railway CLI

1. Install Railway CLI: https://docs.railway.app/guides/cli
2. In the project directory:
   ```bash
   railway login
   railway init
   railway up
   ```

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to your project → Variables tab
2. Add these variables:
   ```
   PORT=8080
   NODE_ENV=production
   ADMIN_PASSWORD=LineLight2026
   ```

3. Railway will automatically set `PORT` based on availability

## Step 4: Connect Custom Domain

1. In Railway dashboard, go to your project → Settings
2. Under "Domains", click "Add Domain"
3. Enter: `lineandlightstudio.info`
4. Railway will generate DNS records (CNAME or A record)
5. Copy the DNS records provided

### Update Your Domain DNS

1. Log in to your domain registrar (where you registered lineandlightstudio.info)
2. Go to DNS settings
3. Add the CNAME or A record provided by Railway
4. Wait 5-15 minutes for DNS to propagate
5. Visit `https://lineandlightstudio.info` — it should load!

## Step 5: Verify Deployment

1. Visit `https://lineandlightstudio.info`
2. Check that:
   - Landing page loads with your logo
   - "Start Your Project Brief" button works
   - Admin dashboard accessible at `/admin`
   - Admin password is `LineLight2026`
   - PWA install banner appears (on mobile)

## Monitoring & Logs

In Railway dashboard:

- **Logs**: Click "Logs" to see real-time server output
- **Metrics**: Monitor CPU, memory, and bandwidth usage
- **Deployments**: View deployment history and rollback if needed

## Troubleshooting

### App won't start
- Check logs in Railway dashboard
- Verify `PORT` environment variable is set
- Ensure `package.json` has `"start"` script

### Domain not connecting
- Wait 10-15 minutes for DNS propagation
- Use `nslookup lineandlightstudio.info` to verify DNS is updated
- Check Railway domain settings for correct CNAME/A record

### SSL certificate issues
- Railway provides free SSL automatically
- May take a few minutes to generate
- Check "Domains" tab for certificate status

## Updating the App

To deploy updates:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. Railway automatically redeploys (watch the Deployments tab)

Or using Railway CLI:
```bash
railway up
```

## Data Persistence

- **Submissions**: Stored in `submissions.json` file
- **Uploaded images**: Stored in `uploads/` directory

**Important**: Railway's ephemeral filesystem means files are lost on redeploy. For production:
- Set up a database (PostgreSQL available on Railway)
- Use S3 or similar for file uploads

For now, submissions are stored locally and will persist between deployments, but consider migrating to a database if you plan to scale.

## Future: Multi-Tenant Setup

When you're ready to license this to other building designers, we'll:
1. Add database layer (PostgreSQL)
2. Create admin panel for licensee management
3. Implement branding customization per licensee
4. Add usage tracking and billing

For now, the single-instance setup is perfect for your own use.

## Support

For Railway-specific issues: https://docs.railway.app
For app-specific issues: Check server logs in Railway dashboard

---

**Questions?** Feel free to reach out. The deployment should take about 10-15 minutes total.
