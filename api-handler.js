import { execSync } from 'child_process'
import { generateProjectBrief } from './brief-generator.js'
import { generateFeasibilityStudy } from './feasibility-generator.js'

/**
 * Send survey submission email using MCP Gmail integration
 */
export async function sendSurveyEmail(surveyData) {
  try {
    // Generate brief and feasibility study
    const brief = generateProjectBrief(surveyData)
    const feasibility = generateFeasibilityStudy(surveyData)

    const subject = `New Project Brief Submission: ${surveyData.section1?.address || 'Unnamed Property'}`

    const emailBody = formatSurveyEmailWithAnalysis(surveyData, brief, feasibility)

    // Use MCP Gmail tool to send email
    const command = `manus-mcp-cli tool call gmail_send_messages --server gmail --input '${JSON.stringify({
      messages: [
        {
          to: 'jacob@lineandlightstudio.com.au',
          subject: subject,
          body: emailBody,
          isHtml: true,
        },
      ],
    }).replace(/'/g, "'\\''")}'`

    console.log('Sending email via MCP Gmail...')
    const result = execSync(command, { encoding: 'utf-8' })
    console.log('Email sent successfully:', result)

    return {
      success: true,
      message: 'Survey submitted and email sent',
      brief: brief,
      feasibility: feasibility,
    }
  } catch (error) {
    console.error('Error sending email:', error.message)
    return {
      success: false,
      message: 'Survey submitted but email failed to send',
      error: error.message,
    }
  }
}

/**
 * Format survey data with brief and feasibility into a professional HTML email
 */
function formatSurveyEmailWithAnalysis(data, brief, feasibility) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    .header { background: #1B6B5C; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .section { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #1B6B5C; }
    .section h3 { margin: 0 0 10px 0; color: #1B6B5C; }
    .field { margin-bottom: 8px; }
    .label { font-weight: 600; color: #1B6B5C; font-size: 12px; text-transform: uppercase; }
    .value { color: #666; margin-top: 4px; }
    .alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 10px 0; }
    .alert-high { background: #fef2f2; border-left-color: #ef4444; }
    .alert-medium { background: #fffbf0; border-left-color: #f59e0b; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Project Brief Submission</h2>
      <p>A client has submitted a new project brief intake form.</p>
    </div>

    <div class="section">
      <h3>⚡ Quick Summary</h3>
      <div class="field">
        <div class="label">Property</div>
        <div class="value">${data.section1?.address || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Project Type</div>
        <div class="value">${data.section2?.projectType || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Estimated Budget</div>
        <div class="value">${data.section8?.budget ? '$' + parseInt(data.section8.budget).toLocaleString() : 'Not provided'}</div>
      </div>
    </div>

    <div class="section">
      <h3>📋 Feasibility Assessment</h3>
      <div class="field">
        <div class="label">Status</div>
        <div class="value" style="font-weight: 600; color: #1B6B5C;">${feasibility.recommendation.status}</div>
      </div>
      <div class="field">
        <div class="label">Complexity Score</div>
        <div class="value">${feasibility.complexityScore}/10</div>
      </div>
      <div class="field">
        <div class="label">Estimated Timeline</div>
        <div class="value">${feasibility.timelineAssessment.estimatedMonths} months</div>
      </div>
      ${feasibility.risks.length > 0 ? `
      <div class="field" style="margin-top: 10px;">
        <div class="label">Key Risks (${feasibility.risks.length} identified)</div>
        ${feasibility.risks
          .slice(0, 3)
          .map(
            (risk) => `
          <div class="alert alert-${risk.level}" style="margin: 8px 0; padding: 8px;">
            <strong>${risk.category}:</strong> ${risk.issue}
          </div>
        `
          )
          .join('')}
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h3>💰 Cost Analysis</h3>
      <div class="field">
        <div class="label">Estimated Build Cost</div>
        <div class="value">$${(feasibility.costEstimate.estimatedCost / 1000).toFixed(0)}k</div>
      </div>
      ${feasibility.costEstimate.clientBudget ? `
      <div class="field">
        <div class="label">Client Budget</div>
        <div class="value">$${(feasibility.costEstimate.clientBudget / 1000).toFixed(0)}k</div>
      </div>
      <div class="field">
        <div class="label">Budget Status</div>
        <div class="value">${feasibility.costEstimate.budgetStatus}</div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h3>📝 Full Survey Details</h3>
      <div class="field">
        <div class="label">Submitted</div>
        <div class="value">${new Date(data.submittedAt).toLocaleString('en-AU')}</div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Next Steps:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Review the full project brief and feasibility study (see attached documents)</li>
        <li>Schedule discovery meeting to discuss ${feasibility.risks.length > 0 ? 'identified risks and' : ''} project vision</li>
        <li>Prepare fee proposal based on complexity and scope</li>
      </ul>
      <p>Line & Light Studio Project Brief System</p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Generate brief and feasibility documents
 */
export function generateDocuments(surveyData) {
  const brief = generateProjectBrief(surveyData)
  const feasibility = generateFeasibilityStudy(surveyData)

  return {
    brief,
    feasibility,
  }
}
