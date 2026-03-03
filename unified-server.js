import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import { generateCompleteReport } from './report-generator.js'
import { generateSubmissionPDF } from './pdf-generator.js'
import { geocodeAddress } from './geocoding.js'

// Admin password (change this to your own password)
const ADMIN_PASSWORD = 'LineLight2026'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

app.use(express.json())

// Submissions storage file
const submissionsFile = join(__dirname, 'submissions.json')

// Initialize submissions file if it doesn't exist
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, JSON.stringify([]))
}

// Helper function to read submissions
function getSubmissions() {
  try {
    const data = fs.readFileSync(submissionsFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Helper function to save submissions
function saveSubmissions(submissions) {
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2))
}

/**
 * Submit survey endpoint
 */
app.post('/api/submit-survey', async (req, res) => {
  try {
    const surveyData = req.body
    const projectId = `PROJ-${Date.now()}`

    console.log(`[${new Date().toISOString()}] Received survey submission for: ${surveyData.section1?.address || 'Unknown'}`)

    // Geocode address to get real coordinates
    let coordinates = null
    if (surveyData.section1?.address) {
      try {
        coordinates = await geocodeAddress(surveyData.section1.address)
      } catch (geocodeError) {
        console.warn(`[${new Date().toISOString()}] Geocoding failed:`, geocodeError.message)
        // Fall back to placeholder coordinates
        coordinates = {
          lat: -33.87,
          lng: 151.2,
        }
      }
    }

    // Generate complete report with hazard research
    if (!coordinates) {
      throw new Error('Unable to geocode address')
    }

    const report = await generateCompleteReport(surveyData, coordinates)

    // Create submission object
    const submission = {
      projectId,
      ...surveyData,
      report,
      submittedAt: new Date().toISOString(),
    }

    // Save submission
    const submissions = getSubmissions()
    submissions.push(submission)
    saveSubmissions(submissions)

    console.log(`[${new Date().toISOString()}] Submission saved: ${projectId}`)

    res.json({
      success: true,
      projectId,
      message: 'Survey submitted successfully',
      report,
    })
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error submitting survey:`, error.message)
    res.status(500).json({
      success: false,
      message: 'Error submitting survey',
      error: error.message,
    })
  }
})

/**
 * Get submissions endpoint (requires auth)
 */
app.get('/api/submissions', (req, res) => {
  try {
    const token = req.query.token
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const submissions = getSubmissions()
    res.json({
      success: true,
      count: submissions.length,
      submissions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * Get submission by ID (requires auth)
 */
app.get('/api/submissions/:projectId', (req, res) => {
  try {
    const token = req.query.token
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const submissions = getSubmissions()
    const submission = submissions.find((s) => s.projectId === req.params.projectId)

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      })
    }

    res.json({
      success: true,
      submission,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * Generate PDF for submission (requires auth)
 */
app.post('/api/submissions/:projectId/pdf', async (req, res) => {
  try {
    const token = req.query.token
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const submissions = getSubmissions()
    const submission = submissions.find((s) => s.projectId === req.params.projectId)

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      })
    }

    const pdfPath = await generateSubmissionPDF(submission)

    res.download(pdfPath, `${req.params.projectId}-report.html`, (err) => {
      if (err) {
        console.error('Error sending PDF:', err)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * Admin login
 */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-' + Date.now() })
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' })
  }
})

/**
 * Admin dashboard - MUST be before static files
 */
app.get('/admin', (req, res) => {
  const token = req.query.token
  if (!token) {
    return res.send(generateLoginPage())
  }

  const submissions = getSubmissions()
  res.send(generateDashboardPage(submissions, token))
})

/**
 * NOW serve static files (after all API routes)
 */
app.use(express.static(join(__dirname, 'dist')))

function generateDashboardPage(submissions, token) {
  const submissionCards = submissions
    .reverse()
    .map((s) => {
      return `
      <div class="submission-card">
        <h3>${s.section1?.address || 'Unnamed Property'}</h3>
        <p><strong>Project ID:</strong> ${s.projectId}</p>
        <p><strong>Submitted:</strong> ${new Date(s.submittedAt).toLocaleString('en-AU')}</p>
        
        <div class="meta">
          <div class="meta-item">
            <div class="label">Project Type</div>
            <div class="value">${s.section2?.projectType || 'Not specified'}</div>
          </div>
          <div class="meta-item">
            <div class="label">Floor Area</div>
            <div class="value">${s.section2?.floorArea || 'Not specified'} m²</div>
          </div>
          <div class="meta-item">
            <div class="label">Budget</div>
            <div class="value">$${s.section8?.budget || 'Not specified'}</div>
          </div>
          <div class="meta-item">
            <div class="label">Hazard Risk</div>
            <div class="value ${s.report?.hazardAssessment ? 'risk-' + s.report.hazardAssessment.overallRisk.level.toLowerCase() : ''}">
              ${s.report?.hazardAssessment?.overallRisk.level || 'Unknown'}
            </div>
          </div>
        </div>

        <div class="actions">
          <a href="/api/submissions/${s.projectId}?token=${token}" class="btn btn-secondary" target="_blank">View JSON</a>
          <button class="btn btn-primary" onclick="downloadPDF('${s.projectId}')">Download HTML</button>
        </div>
      </div>
      `
    })
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: #1B6B5C; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { opacity: 0.9; }
    .logout-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; }
    .logout-btn:hover { background: rgba(255,255,255,0.3); }
    .submissions { display: grid; gap: 20px; }
    .submission-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .submission-card h3 { color: #1B6B5C; margin-bottom: 10px; }
    .submission-card p { margin: 5px 0; font-size: 14px; color: #666; }
    .submission-card .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .meta-item { background: #f9f9f9; padding: 10px; border-radius: 4px; }
    .meta-item .label { font-size: 12px; color: #999; text-transform: uppercase; }
    .meta-item .value { font-weight: 600; color: #333; }
    .actions { margin-top: 15px; display: flex; gap: 10px; }
    .btn { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; }
    .btn-primary { background: #1B6B5C; color: white; }
    .btn-primary:hover { background: #155048; }
    .btn-secondary { background: #e0e0e0; color: #333; }
    .btn-secondary:hover { background: #d0d0d0; }
    .empty { text-align: center; padding: 40px; color: #999; }
    .risk-high { color: #ef4444; }
    .risk-medium { color: #f59e0b; }
    .risk-low { color: #22c55e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Project Submissions & Reports</p>
      </div>
      <button class="logout-btn" onclick="logout()">Logout</button>
    </div>

    ${submissions.length === 0 ? '<div class="empty"><p>No submissions yet</p></div>' : '<div class="submissions">' + submissionCards + '</div>'}
  </div>

  <script>
    function downloadPDF(projectId) {
      window.location.href = '/api/submissions/' + projectId + '/pdf?token=${token}';
    }
    
    function logout() {
      window.location.href = '/admin';
    }
  </script>
</body>
</html>
  `
}

/**
 * Generate login page HTML
 */
function generateLoginPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1b6b5c, #2a9d8f); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 400px; width: 100%; }
    .login-container h1 { color: #1b6b5c; margin-bottom: 10px; font-size: 28px; }
    .login-container p { color: #666; margin-bottom: 30px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: #333; font-weight: 600; margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
    .form-group input:focus { outline: none; border-color: #1b6b5c; box-shadow: 0 0 0 3px rgba(27, 107, 92, 0.1); }
    .btn { width: 100%; padding: 12px; background: #1b6b5c; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
    .btn:hover { background: #155048; }
    .error { color: #ef4444; font-size: 14px; margin-top: 10px; display: none; }
  </style>
</head>
<body>
  <div class="login-container">
    <h1>Admin Dashboard</h1>
    <p>Enter password to access submissions</p>
    <form id="loginForm">
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autofocus>
      </div>
      <button type="submit" class="btn">Login</button>
      <div class="error" id="error"></div>
    </form>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const password = document.getElementById('password').value
      const errorDiv = document.getElementById('error')
      
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        })
        
        const data = await response.json()
        
        if (data.success) {
          window.location.href = '/admin?token=' + data.token
        } else {
          errorDiv.textContent = 'Invalid password'
          errorDiv.style.display = 'block'
        }
      } catch (error) {
        errorDiv.textContent = 'Error logging in'
        errorDiv.style.display = 'block'
      }
    })
  </script>
</body>
</html>
  `
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Admin dashboard at http://localhost:${PORT}/admin`)
  console.log(`Admin password: ${ADMIN_PASSWORD}`)
})
