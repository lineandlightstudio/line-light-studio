/**
 * PDF Generator
 * Generates comprehensive HTML reports that can be printed to PDF
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generate HTML report from submission data
 */
export async function generateSubmissionPDF(submission) {
  try {
    const report = submission.report
    const projectId = submission.projectId

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'pdfs')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(outputDir, `${projectId}-report.html`)

    // Generate HTML content
    const htmlContent = generatePDFHTML(submission, report)

    // Save HTML file
    fs.writeFileSync(outputPath, htmlContent)

    console.log(`[PDF Generator] Report saved: ${outputPath}`)

    return outputPath
  } catch (error) {
    console.error('[PDF Generator] Error:', error.message)
    throw error
  }
}

/**
 * Generate comprehensive HTML for PDF
 */
function generatePDFHTML(submission, report) {
  const s1 = submission.section1 || {}
  const s2 = submission.section2 || {}
  const s8 = submission.section8 || {}
  const hazard = report.hazardAssessment || {}

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s1.address} - Project Brief & Feasibility Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: white; }
    .page { page-break-after: always; padding: 40px; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #1b6b5c, #2a9d8f); color: white; padding: 40px; margin: -40px -40px 40px -40px; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { font-size: 14px; opacity: 0.9; }
    h2 { color: #1b6b5c; font-size: 24px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
    h3 { color: #1b6b5c; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
    h4 { color: #333; font-size: 16px; margin-top: 15px; margin-bottom: 8px; }
    h5 { color: #333; font-size: 14px; margin-top: 12px; margin-bottom: 6px; }
    p { margin-bottom: 12px; }
    ul, ol { margin-left: 20px; margin-bottom: 12px; }
    li { margin-bottom: 6px; }
    .section { margin-bottom: 30px; }
    .property-info { background: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
    .property-info div { margin-bottom: 10px; }
    .property-info strong { color: #1b6b5c; display: inline-block; width: 150px; }
    .risk-card { padding: 20px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid; }
    .risk-high { background: #fee2e2; border-left-color: #ef4444; }
    .risk-medium { background: #fef3c7; border-left-color: #f59e0b; }
    .risk-low { background: #dcfce7; border-left-color: #22c55e; }
    .risk-level { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: 600; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; color: white; }
    .risk-level-high { background: #ef4444; }
    .risk-level-medium { background: #f59e0b; }
    .risk-level-low { background: #22c55e; }
    .hazard-item { padding: 15px; background: #f9f9f9; border-radius: 4px; margin-bottom: 15px; border-left: 4px solid #f59e0b; }
    .severity { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
    .severity-high { background: #fee2e2; color: #991b1b; }
    .severity-medium { background: #fef3c7; color: #92400e; }
    .severity-low { background: #dcfce7; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    .link { color: #0284c7; text-decoration: none; }
    .link:hover { text-decoration: underline; }
    @media print { 
      body { margin: 0; padding: 0; background: white; }
      .page { padding: 20px; page-break-after: always; }
      .header { margin: -20px -20px 20px -20px; }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page">
    <div class="header">
      <h1>Project Brief & Feasibility Report</h1>
      <p>Comprehensive Site Analysis & Planning Assessment</p>
    </div>

    <div class="section">
      <h2>Property Information</h2>
      <div class="property-info">
        <div><strong>Address:</strong> ${s1.address}</div>
        <div><strong>Lot/DP:</strong> ${s1.lotDp || 'Not provided'}</div>
        <div><strong>Project ID:</strong> ${submission.projectId}</div>
        <div><strong>Generated:</strong> ${new Date(report.generatedDate).toLocaleDateString('en-AU')}</div>
        <div><strong>Coordinates:</strong> ${report.coordinates?.lat.toFixed(4)}, ${report.coordinates?.lng.toFixed(4)}</div>
      </div>
    </div>

    <div class="section">
      <h2>Project Overview</h2>
      <div class="property-info">
        <div><strong>Intended Use:</strong> ${s1.intendedUse}</div>
        <div><strong>Project Type:</strong> ${s2.projectType}</div>
        <div><strong>Floor Area:</strong> ${s2.floorArea} m²</div>
        <div><strong>Bedrooms:</strong> ${s2.bedrooms || 'Not specified'}</div>
        <div><strong>Budget:</strong> $${s8.budget ? parseInt(s8.budget).toLocaleString() : 'Not specified'}</div>
        <div><strong>Timeline:</strong> ${s8.timeline || 'Not specified'}</div>
      </div>
    </div>

    <div class="footer">
      <p>This report provides a comprehensive analysis of the property's planning constraints, hazards, and feasibility for development.</p>
      <p>For detailed planning information and overlays, visit: <a href="${hazard.sixmapsLink}" class="link" target="_blank">${hazard.sixmapsLink}</a></p>
    </div>
  </div>

  <!-- Hazard Assessment Page -->
  <div class="page">
    <h2>Hazard & Constraint Assessment</h2>

    <div class="section">
      <h3>Overall Risk Assessment</h3>
      ${
        hazard.overallRisk
          ? `
        <div class="risk-card risk-${hazard.overallRisk.level.toLowerCase()}">
          <span class="risk-level risk-level-${hazard.overallRisk.level.toLowerCase()}">
            ${hazard.overallRisk.level}
          </span>
          <p><strong>${hazard.overallRisk.summary}</strong></p>
        </div>
      `
          : '<p>No hazard assessment available</p>'
      }
    </div>

    ${
      hazard.hazards && hazard.hazards.length > 0
        ? `
    <div class="section">
      <h3>Identified Hazards & Constraints</h3>
      ${hazard.hazards
        .map(
          (h) => `
        <div class="hazard-item">
          <h4>${h.type.replace(/_/g, ' ')}</h4>
          <span class="severity severity-${h.severity.toLowerCase()}">
            Severity: ${h.severity}
          </span>
          <p>${h.description}</p>

          <h5>Implications for Development:</h5>
          <ul>
            ${h.implications.map((imp) => `<li>${imp}</li>`).join('')}
          </ul>

          <h5>Recommended Mitigations:</h5>
          <ul>
            ${h.mitigations.map((mit) => `<li>${mit}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}
    </div>
    `
        : ''
    }

    <div class="section">
      <h3>Planning Research Resources</h3>
      <p>For detailed planning information, flood zones, bushfire zones, heritage overlays, and other planning constraints, visit SixMaps:</p>
      <p><a href="${hazard.sixmapsLink}" class="link" target="_blank">${hazard.sixmapsLink}</a></p>
      <p><strong>Instructions:</strong></p>
      <ol>
        <li>Click the link above to open SixMaps with the property location</li>
        <li>Use the layers panel to view planning zones, flood zones, and bushfire zones</li>
        <li>Capture screenshots of relevant overlays for your records</li>
        <li>Note any heritage listings or environmental constraints</li>
      </ol>
    </div>
  </div>

  <!-- Project Brief Page -->
  <div class="page">
    <h2>Project Brief</h2>

    <div class="section">
      <h3>Design Direction</h3>
      <p>${report.brief?.designDirection?.characterWords || 'Not specified'}</p>
    </div>

    <div class="section">
      <h3>Project Requirements</h3>
      <div class="property-info">
        <div><strong>Layout Preferences:</strong> ${report.brief?.projectRequirements?.layoutPreferences || 'Not specified'}</div>
        <div><strong>Functional Requirements:</strong> ${report.brief?.projectRequirements?.functionalRequirements || 'Not specified'}</div>
        <div><strong>Outdoor Spaces:</strong> ${report.brief?.projectRequirements?.outdoorSpaces || 'Not specified'}</div>
      </div>
    </div>

    <div class="section">
      <h3>Constraints & Must-Haves</h3>
      <p><strong>Must-Haves:</strong> ${submission.section5?.mustHaves || 'Not specified'}</p>
      <p><strong>Non-Negotiables:</strong> ${submission.section5?.nonNegotiables || 'Not specified'}</p>
      <p><strong>Site Constraints:</strong> ${submission.section5?.constraints || 'Not specified'}</p>
    </div>
  </div>

  <!-- Feasibility Page -->
  <div class="page">
    <h2>Feasibility Assessment</h2>

    <div class="section">
      <h3>Complexity Analysis</h3>
      <div class="property-info">
        <div><strong>Complexity Score:</strong> ${report.feasibility?.complexityScore || 'N/A'}/10</div>
        <div><strong>Primary Challenges:</strong> ${report.feasibility?.primaryChallenges?.join(', ') || 'None identified'}</div>
        <div><strong>Estimated Timeline:</strong> ${report.feasibility?.timelineAssessment?.estimatedMonths || 'N/A'} months</div>
      </div>
    </div>

    ${
      report.feasibility?.risks && report.feasibility.risks.length > 0
        ? `
    <div class="section">
      <h3>Identified Risks</h3>
      <ul>
        ${report.feasibility.risks.map((r) => `<li><strong>${r.category}:</strong> ${r.description}</li>`).join('')}
      </ul>
    </div>
    `
        : ''
    }

    <div class="section">
      <h3>Next Steps</h3>
      <ol>
        <li>Review planning constraints and hazard assessment</li>
        <li>Capture SixMaps imagery for planning overlays</li>
        <li>Consult with relevant specialists (surveyor, engineer, etc.)</li>
        <li>Obtain formal planning advice if required</li>
        <li>Proceed with detailed design development</li>
      </ol>
    </div>
  </div>

  <!-- Footer Page -->
  <div class="page">
    <h2>Report Information</h2>
    <div class="property-info">
      <div><strong>Report Generated:</strong> ${new Date(report.generatedDate).toLocaleString('en-AU')}</div>
      <div><strong>Project ID:</strong> ${submission.projectId}</div>
      <div><strong>Property Address:</strong> ${s1.address}</div>
      <div><strong>Coordinates:</strong> ${report.coordinates?.lat.toFixed(4)}, ${report.coordinates?.lng.toFixed(4)}</div>
    </div>

    <div class="section">
      <h3>Disclaimer</h3>
      <p>This report is based on publicly available planning data and SixMaps information. It is provided for preliminary assessment purposes only. For formal planning advice, consult with a qualified town planner or architect. All development must comply with local planning controls and relevant legislation.</p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Line Light Studio. All rights reserved.</p>
      <p>This report is confidential and intended only for the recipient.</p>
    </div>
  </div>
</body>
</html>
  `
}
