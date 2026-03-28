import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import multer from 'multer'
import nodemailer from 'nodemailer'
import { geocodeAddress } from './geocoding.js'
import { performHazardResearch } from './property-hazard-research.js'
import { buildFeasibilityReport } from './report-builder.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 8080
const ADMIN_PASSWORD = 'LineLight2026'

// CORS headers for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json({ limit: '50mb' }))

// Setup uploads directory
const uploadsDir = join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Multer config for inspiration image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    const name = `insp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    cb(null, name)
  }
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// Data storage
const submissionsFile = join(__dirname, 'submissions.json')
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, JSON.stringify([]))
}

function getSubmissions() {
  try {
    return JSON.parse(fs.readFileSync(submissionsFile, 'utf8'))
  } catch {
    return []
  }
}

function saveSubmissions(data) {
  fs.writeFileSync(submissionsFile, JSON.stringify(data, null, 2))
}

// ============================================================
// API ROUTES (must be before static file serving)
// ============================================================

// Login
app.post('/api/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-' + Date.now() })
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' })
  }
})

// Upload inspiration images
app.post('/api/upload-inspiration', upload.array('images', 20), (req, res) => {
  try {
    const files = (req.files || []).map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      path: f.path,
    }))
    console.log(`[Upload] ${files.length} inspiration image(s) uploaded`)
    res.json({ success: true, files })
  } catch (error) {
    console.error('[Upload] Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Submit survey - this is the main entry point
app.post('/api/submit-survey', async (req, res) => {
  try {
    const surveyData = req.body
    const s1 = surveyData.section1 || {}
    const address = s1.address || ''

    console.log(`[Submit] Processing submission for: ${address}`)

    // Step 1: Geocode address
    let coords = null
    try {
      coords = await geocodeAddress(address)
      console.log(`[Submit] Geocoded: ${coords.lat}, ${coords.lng}`)
    } catch (err) {
      console.error(`[Submit] Geocoding failed: ${err.message}`)
      coords = { lat: 0, lng: 0, displayName: address, error: err.message }
    }

    // Step 2: Hazard research
    let hazardResearch = null
    try {
      hazardResearch = await performHazardResearch(address, coords)
      console.log(`[Submit] Hazard research complete`)
    } catch (err) {
      console.error(`[Submit] Hazard research failed: ${err.message}`)
      hazardResearch = { error: err.message }
    }

    // Step 3: Build comprehensive report (generates both internal and client HTML)
    const report = buildFeasibilityReport(surveyData, coords, hazardResearch)

    // Step 4: Create submission record
    const submission = {
      id: `PROJ-${Date.now()}`,
      surveyData,
      coords,
      hazardResearch,
      report,
      createdAt: new Date().toISOString(),
    }

    // Step 5: Save
    const submissions = getSubmissions()
    submissions.push(submission)
    saveSubmissions(submissions)

    console.log(`[Submit] Saved submission ${submission.id}`)

    // Step 6: Send email notification
    try {
      if (process.env.GMAIL_APP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'jdhays88@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        })
        const s1 = surveyData.section1 || {}
        const s2 = surveyData.section2 || {}
        const s8 = surveyData.section8 || {}
        const subject = `New Project Brief: ${s1.address || 'Unknown Address'}`
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1B6B5C; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">Line &amp; Light Studio</h1>
              <p style="color: #a8d5cc; margin: 5px 0 0;">New Project Brief Submission</p>
            </div>
            <div style="padding: 24px; background: #f9f9f9;">
              <h2 style="color: #1B6B5C; margin-top: 0;">Client Details</h2>
              <p><strong>Name:</strong> ${s1.ownerName || 'Not provided'}</p>
              <p><strong>Email:</strong> ${s1.ownerEmail || 'Not provided'}</p>
              <p><strong>Phone:</strong> ${s1.ownerPhone || 'Not provided'}</p>
              <p><strong>Address:</strong> ${s1.address || 'Not provided'}</p>
              <h2 style="color: #1B6B5C;">Project Details</h2>
              <p><strong>Project Type:</strong> ${s2.projectType || 'Not provided'}</p>
              <p><strong>Description:</strong> ${s2.description || 'Not provided'}</p>
              <p><strong>Budget:</strong> ${s8.budget ? '$' + parseInt(s8.budget).toLocaleString() : 'Not provided'}</p>
              <h2 style="color: #1B6B5C;">Feasibility Summary</h2>
              <p><strong>Overall Risk:</strong> ${report.hazardAssessment?.overallRisk || 'Unknown'}</p>
              <p><strong>Estimated Cost:</strong> ${report.costGuide?.estimatedCost ? '$' + report.costGuide.estimatedCost.toLocaleString() : 'Not calculated'}</p>
              <div style="margin-top: 24px; padding: 16px; background: #e8f4f1; border-radius: 8px;">
                <p style="margin: 0; color: #1B6B5C;"><strong>View full submission in your admin dashboard:</strong></p>
                <p style="margin: 8px 0 0;"><a href="https://lineandlightstudio.info/admin" style="color: #1B6B5C;">https://lineandlightstudio.info/admin</a></p>
              </div>
            </div>
          </div>
        `
        await transporter.sendMail({
          from: '"Line & Light Studio" <jdhays88@gmail.com>',
          to: 'jacob@lineandlightstudio.com.au',
          subject,
          html,
        })
        console.log(`[Submit] Email notification sent for ${submission.id}`)
      } else {
        console.log('[Submit] GMAIL_APP_PASSWORD not set, skipping email')
      }
    } catch (emailErr) {
      console.error('[Submit] Email failed:', emailErr.message)
    }

    res.json({
      success: true,
      id: submission.id,
      summary: {
        address: address,
        overallRisk: report.hazardAssessment.overallRisk,
        estimatedCost: report.costGuide.estimatedCost,
        hazardCount: report.hazardAssessment.hazardCount,
      },
    })
  } catch (error) {
    console.error('[Submit] Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get all submissions (requires token)
app.get('/api/submissions', (req, res) => {
  if (!req.query.token) return res.status(401).json({ error: 'Unauthorized' })
  const submissions = getSubmissions()
  const summaries = submissions.map(s => ({
    id: s.id,
    address: s.surveyData?.section1?.address || 'Unknown',
    clientName: s.surveyData?.section1?.clientName || 'Unknown',
    projectType: s.surveyData?.section2?.projectType || 'Unknown',
    overallRisk: s.report?.hazardAssessment?.overallRisk || 'Unknown',
    estimatedCost: s.report?.costGuide?.estimatedCost || 0,
    floorArea: s.surveyData?.section2?.floorArea || '',
    budget: s.surveyData?.section8?.budget || '',
    createdAt: s.createdAt,
  }))
  res.json({ submissions: summaries })
})

// Get single submission detail (requires token)
app.get('/api/submissions/:id', (req, res) => {
  if (!req.query.token) return res.status(401).json({ error: 'Unauthorized' })
  const submissions = getSubmissions()
  const submission = submissions.find(s => s.id === req.params.id)
  if (!submission) return res.status(404).json({ error: 'Not found' })
  res.json({ submission })
})

// Get INTERNAL report HTML (with cost guide) — requires token
app.get('/api/submissions/:id/report', (req, res) => {
  if (!req.query.token) return res.status(401).json({ error: 'Unauthorized' })
  const submissions = getSubmissions()
  const submission = submissions.find(s => s.id === req.params.id)
  if (!submission) return res.status(404).json({ error: 'Not found' })
  res.setHeader('Content-Type', 'text/html')
  res.send(submission.report?.html || '<p>Report not available</p>')
})

// Get CLIENT report HTML (without cost guide) — requires token
app.get('/api/submissions/:id/report-client', (req, res) => {
  if (!req.query.token) return res.status(401).json({ error: 'Unauthorized' })
  const submissions = getSubmissions()
  const submission = submissions.find(s => s.id === req.params.id)
  if (!submission) return res.status(404).json({ error: 'Not found' })
  res.setHeader('Content-Type', 'text/html')
  res.send(submission.report?.htmlClient || '<p>Client report not available</p>')
})

// ============================================================
// ADMIN API ROUTES (for admin.html)
// ============================================================
app.get('/api/admin/submissions', (req, res) => {
  const submissions = getSubmissions()
  const summaries = submissions.map(s => ({
    projectId: s.id,
    section1: s.surveyData?.section1,
    section2: s.surveyData?.section2,
    section8: s.surveyData?.section8,
    report: {
      hazardAssessment: s.report?.hazardAssessment,
      costGuide: s.report?.costGuide,
    },
    submittedAt: s.createdAt,
  })).reverse()
  res.json({ success: true, submissions: summaries })
})

app.get('/api/admin/submission/:id', (req, res) => {
  const submissions = getSubmissions()
  const submission = submissions.find(s => s.id === req.params.id)
  if (!submission) return res.status(404).json({ error: 'Not found' })
  res.json({
    success: true,
    submission: {
      projectId: submission.id,
      ...submission.surveyData,
      coords: submission.coords,
      hazardResearch: submission.hazardResearch,
      report: submission.report,
      feasibility: {
        recommendation: { status: submission.report?.hazardAssessment?.overallRisk || 'Unknown' },
        complexityScore: submission.report?.hazardAssessment?.hazardCount || 0,
      },
    },
  })
})

// Download INTERNAL report as HTML (for printing to PDF)
app.get('/api/admin/submission/:id/pdf', (req, res) => {
  const submissions = getSubmissions()
  const submission = submissions.find(s => s.id === req.params.id)
  if (!submission) return res.status(404).json({ error: 'Not found' })
  const html = submission.report?.html || '<p>Report not available</p>'
  const address = submission.surveyData?.section1?.address || 'report'
  const safeName = address.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}_INTERNAL.html"`)
  res.send(html)
})

// Download CLIENT report as HTML (for printing to PDF)
app.get('/api/admin/submission/:id/pdf-client', (req, res) => {
  const submissions = getSubmissions()
  const submission = submissions.find(s => s.id === req.params.id)
  if (!submission) return res.status(404).json({ error: 'Not found' })
  const html = submission.report?.htmlClient || '<p>Client report not available</p>'
  const address = submission.surveyData?.section1?.address || 'report'
  const safeName = address.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}_CLIENT.html"`)
  res.send(html)
})

// Delete submission
app.delete('/api/admin/submission/:id', (req, res) => {
  let submissions = getSubmissions()
  const idx = submissions.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  submissions.splice(idx, 1)
  saveSubmissions(submissions)
  res.json({ success: true })
})

// ============================================================
// STATIC FILES (after API routes)
// ============================================================

// Serve assets directory for logo/background
app.use('/assets', express.static(join(__dirname, 'assets')))

// Serve uploaded images
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// PWA files from public directory
app.get('/manifest.json', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'manifest.json'))
})
app.get('/sw.js', (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/')
  res.sendFile(join(__dirname, 'public', 'sw.js'))
})
app.get('/favicon.ico', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'favicon.ico'))
})
app.use('/icons', express.static(join(__dirname, 'public', 'icons')))

// Serve admin.html
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'admin.html'))
})
app.get('/admin.html', (req, res) => {
  res.sendFile(join(__dirname, 'admin.html'))
})

app.use(express.static(join(__dirname, 'dist')))

// Catch-all: serve index.html for client-side routing
app.get('/{*path}', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('Not found')
  }
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
