# Line & Light Studio - Project Brief & Feasibility App

A professional web app for residential building designers to collect comprehensive project briefs and generate detailed feasibility reports with hazard assessments.

## Features

- **Multi-section survey form** capturing project details, budget, timeline, and design preferences
- **Automated hazard research** using official NSW Government data sources:
  - Bushfire Prone Land (NSW RFS certified data)
  - Flood risk (NSW Planning Portal)
  - Heritage listings (NSW EPI)
  - Zoning, height limits, FSR (NSW Planning layers)
- **Professional PDF reports** with dual versions:
  - Internal report (includes cost guide and rates)
  - Client report (excludes cost information)
- **Image upload** for inspiration references
- **Admin dashboard** to manage submissions and download reports
- **Progressive Web App (PWA)** — installable on phones like a native app
- **Responsive design** optimized for mobile and desktop

## Tech Stack

- **Frontend**: React 19, Vite, NativeWind (Tailwind CSS)
- **Backend**: Node.js, Express
- **Styling**: Tailwind CSS with custom branding
- **Data**: JSON file storage (upgradeable to PostgreSQL)
- **PWA**: Service Worker, Web Manifest, offline caching

## Project Structure

```
├── src/                      # React source files
│   ├── App.jsx              # Main app component
│   ├── App.css              # Styles
│   └── main.jsx             # Entry point
├── public/                  # PWA assets
│   ├── manifest.json        # Web app manifest
│   ├── sw.js               # Service worker
│   ├── logo.png            # Brand logo
│   ├── background.png      # Background image
│   └── icons/              # App icons (multiple sizes)
├── dist/                    # Built app (generated)
├── server-simple.js         # Express server
├── report-builder.js        # Report generation
├── property-hazard-research.js  # Hazard data fetching
├── brand-assets.js          # Logo/branding utilities
├── admin.html              # Admin dashboard
├── package.json            # Dependencies
├── vite.config.js          # Vite build config
├── tailwind.config.js      # Tailwind config
├── theme.config.js         # Brand colors
└── DEPLOYMENT.md           # Deployment guide
```

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Start server
node server-simple.js
```

The app will be available at `http://localhost:8080`

### Development Mode

For faster development with hot reload:

```bash
# Terminal 1: Build frontend in watch mode
npm run dev

# Terminal 2: Start server
node server-simple.js
```

## Admin Access

- **URL**: `/admin`
- **Password**: `LineLight2026` (change in production)

## Environment Variables

See `.env.example` for available options. Create a `.env` file to override defaults:

```
PORT=8080
NODE_ENV=production
ADMIN_PASSWORD=YourSecurePassword
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step Railway deployment instructions.

**Quick summary:**
1. Push to GitHub
2. Connect Railway to your GitHub repo
3. Add custom domain `lineandlightstudio.info`
4. Done! Railway handles SSL and auto-deploys on push

## Features in Detail

### Survey Sections

1. **Property Details** — Client name, address, ownership stage, family size
2. **Project Scope** — Type, floor area, bedrooms, bathrooms
3. **Design Preferences** — Layout, functionality, outdoor spaces
4. **Finish Level** — Standard/High/Luxury/Architectural (determines cost guide)
5. **Priorities** — Must-haves, constraints, non-negotiables
6. **Character** — Design words and style references
7. **Inspiration** — Links and image uploads
8. **Budget & Timeline** — Budget range, timeline, additional notes

### Hazard Assessment

Automatically queries official NSW Government data:

| Hazard | Source | Confidence |
|--------|--------|------------|
| Bushfire | NSW RFS BFPL | HIGH |
| Flood | NSW Planning Portal | HIGH (where available) |
| Heritage | NSW EPI | HIGH |
| Zoning | NSW EPI | HIGH |
| Height Limit | NSW EPI | HIGH |
| FSR | NSW EPI | HIGH |

Each result includes data source citation and confidence indicator.

### Cost Guide

Internal reports include cost estimates based on:
- Finish level selected
- Floor area
- Adjustments for complexity

**Current rates (per m²):**
- Standard: $2,500
- High: $3,000
- Luxury: $3,500
- Architectural: $4,500

### PDF Reports

Two versions generated automatically:

**Internal Report** (with cost guide):
- All hazard data
- Cost guide and rate table
- Estimated construction cost
- Marked "Internal Report"

**Client Report** (without costs):
- All hazard data
- Design recommendations
- No cost information
- Marked "Client Report"

## Branding

The app uses Line & Light Studio branding throughout:

- **Primary Color**: #1B3C34 (dark green)
- **Accent Color**: #1B6B5C
- **Font**: Georgia serif (professional, elegant)
- **Logo**: Embedded on landing page, headers, footers, and reports
- **Background**: Architectural render-to-sketch image on cover page

To customize for licensing:
- Update `theme.config.js` for colors
- Replace `public/logo.png` and `public/background.png`
- Update `public/manifest.json` app name
- Update `app.config.ts` (if using Expo mobile app)

## PWA (Progressive Web App)

The app is installable on phones:

- **Android**: Chrome shows "Install" banner or "Add to Home Screen" prompt
- **iOS**: Safari "Share" → "Add to Home Screen"
- **Desktop**: Chrome/Edge show install prompt in address bar

Once installed, the app:
- Opens full-screen without browser chrome
- Uses your logo as the app icon
- Works offline (cached assets)
- Sends push notifications (future feature)

## Performance

- **Lighthouse PWA Score**: 90+
- **First Load**: ~2s (optimized assets)
- **Offline**: Works with cached data
- **Mobile**: Fully responsive, touch-optimized

## Security

- Admin password protected (change in production)
- No external API keys required (uses official NSW Government APIs)
- File uploads validated (size, type)
- HTTPS enforced (Railway provides free SSL)

## Future Enhancements

- [ ] Multi-tenant support (license to other designers)
- [ ] Database backend (PostgreSQL) for scalability
- [ ] User authentication and role-based access
- [ ] Branding customization per licensee
- [ ] Usage tracking and billing
- [ ] Email notifications
- [ ] Push notifications
- [ ] Mobile app (Expo React Native)

## License

Proprietary — Line & Light Studio

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For feature requests or bugs, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: March 2026
