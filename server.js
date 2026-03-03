import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { sendSurveyEmail } from './api-handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')))

// Parse JSON bodies
app.use(express.json())

// API endpoint for survey submissions
app.post('/api/submit-survey', async (req, res) => {
  try {
    const surveyData = req.body
    const surveyId = `SURVEY-${Date.now()}`
    
    console.log('Survey submitted:', {
      id: surveyId,
      address: surveyData.section1?.address,
      projectType: surveyData.section2?.projectType,
      budget: surveyData.section8?.budget,
      submittedAt: surveyData.submittedAt,
    })

    // Send email notification
    const emailResult = await sendSurveyEmail(surveyData)
    console.log('Email result:', emailResult)

    res.json({
      success: true,
      message: 'Survey submitted successfully',
      id: surveyId,
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error('Error submitting survey:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting survey',
    })
  }
})

// Serve index.html for all other routes (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Line & Light Studio app running on http://localhost:${PORT}`)
})
