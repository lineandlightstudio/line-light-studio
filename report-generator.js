/**
 * Report Generator
 * Clean integration layer that combines brief, feasibility, and hazard research
 */

import { generateProjectBrief } from './brief-generator.js'
import { generateFeasibilityStudy } from './feasibility-generator.js'
import { performHazardResearch, compileHazardAssessment, generateHazardReportSection } from './property-hazard-research.js'

/**
 * Generate complete report with hazard research
 */
export async function generateCompleteReport(surveyData, coordinates = null) {
  try {
    // Generate base brief and feasibility
    const brief = generateProjectBrief(surveyData)
    const feasibility = generateFeasibilityStudy(surveyData)

    // Perform hazard research if coordinates provided
    let hazardResearch = null
    let hazardAssessment = null
    if (coordinates) {
      try {
        hazardResearch = await performHazardResearch(surveyData.section1?.address || 'Property', coordinates)
        hazardAssessment = compileHazardAssessment(hazardResearch)
      } catch (error) {
        console.warn('[Report Generator] Hazard research failed:', error.message)
      }
    }

    // Compile complete report
    const report = {
      projectId: `PROJ-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      address: surveyData.section1?.address,
      coordinates,

      // Original content
      brief,
      feasibility,

      // Hazard research
      hazardResearch,
      hazardAssessment,

      // HTML reports
      briefHtml: generateBriefHtml(brief, hazardAssessment),
      feasibilityHtml: generateFeasibilityHtml(feasibility, hazardAssessment),
    }

    return report
  } catch (error) {
    console.error('[Report Generator] Error:', error.message)
    throw error
  }
}

/**
 * Generate brief HTML with hazard section
 */
function generateBriefHtml(brief, hazardAssessment = null) {
  let html = brief.html || ''

  // Add hazard section if available
  if (hazardAssessment) {
    const hazardSection = `
    <div class="section">
      <h2>Hazard & Constraint Analysis</h2>
      <div class="field">
        <div class="label">Overall Risk Level</div>
        <div class="value" style="color: ${getRiskColor(hazardAssessment.overallRisk.level)}; font-weight: 600;">
          ${hazardAssessment.overallRisk.level}
        </div>
      </div>
      <div class="field">
        <div class="label">Summary</div>
        <div class="value">${hazardAssessment.overallRisk.summary}</div>
      </div>
      ${hazardAssessment.hazards && hazardAssessment.hazards.length > 0 ? `
      <h3>Identified Hazards</h3>
      ${hazardAssessment.hazards
        .map(
          (hazard, idx) => `
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid ${hazard.severity === 'HIGH' ? '#ef4444' : '#f59e0b'};">
          <h4 style="margin-top: 0;">${idx + 1}. ${hazard.type.replace(/_/g, ' ')}</h4>
          <p><strong>Severity:</strong> ${hazard.severity}</p>
          <p>${hazard.description}</p>
          <h5>Implications for Development:</h5>
          <ul style="margin-left: 20px;">
            ${hazard.implications.map((imp) => `<li>${imp}</li>`).join('')}
          </ul>
          <h5>Recommended Mitigations:</h5>
          <ul style="margin-left: 20px;">
            ${hazard.mitigations.map((mit) => `<li>${mit}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}
      ` : '<p>No major hazards identified based on available planning data.</p>'}
      <h3>Next Steps</h3>
      <ul style="margin-left: 20px;">
        ${hazardAssessment.overallRisk.nextSteps.map((step) => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
      </ul>
      ${hazardAssessment.sixmapsLink ? `
      <div style="background: #e0f2fe; padding: 12px; border-radius: 6px; margin-top: 15px;">
        <strong>Planning Data Reference:</strong> <a href="${hazardAssessment.sixmapsLink}" target="_blank">View on SixMaps</a>
      </div>
      ` : ''}
    </div>
    `

    // Insert hazard section before closing body tag
    html = html.replace('</body>', `${hazardSection}</body>`)
  }

  return html
}

/**
 * Generate feasibility HTML with hazard section
 */
function generateFeasibilityHtml(feasibility, hazardAssessment = null) {
  let html = feasibility.html || ''

  // Add hazard section if available
  if (hazardAssessment) {
    const hazardSection = `
    <div class="section">
      <h2>Hazard & Constraint Analysis</h2>
      <div class="field">
        <div class="label">Overall Risk Level</div>
        <div class="value" style="color: ${getRiskColor(hazardAssessment.overallRisk.level)}; font-weight: 600;">
          ${hazardAssessment.overallRisk.level}
        </div>
      </div>
      <div class="field">
        <div class="label">Summary</div>
        <div class="value">${hazardAssessment.overallRisk.summary}</div>
      </div>
      ${hazardAssessment.hazards && hazardAssessment.hazards.length > 0 ? `
      <h3>Identified Hazards</h3>
      ${hazardAssessment.hazards
        .map(
          (hazard, idx) => `
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid ${hazard.severity === 'HIGH' ? '#ef4444' : '#f59e0b'};">
          <h4 style="margin-top: 0;">${idx + 1}. ${hazard.type.replace(/_/g, ' ')}</h4>
          <p><strong>Severity:</strong> ${hazard.severity}</p>
          <p>${hazard.description}</p>
          <h5>Implications for Development:</h5>
          <ul style="margin-left: 20px;">
            ${hazard.implications.map((imp) => `<li>${imp}</li>`).join('')}
          </ul>
          <h5>Recommended Mitigations:</h5>
          <ul style="margin-left: 20px;">
            ${hazard.mitigations.map((mit) => `<li>${mit}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}
      ` : '<p>No major hazards identified based on available planning data.</p>'}
      <h3>Next Steps</h3>
      <ul style="margin-left: 20px;">
        ${hazardAssessment.overallRisk.nextSteps.map((step) => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
      </ul>
      ${hazardAssessment.sixmapsLink ? `
      <div style="background: #e0f2fe; padding: 12px; border-radius: 6px; margin-top: 15px;">
        <strong>Planning Data Reference:</strong> <a href="${hazardAssessment.sixmapsLink}" target="_blank">View on SixMaps</a>
      </div>
      ` : ''}
    </div>
    `

    // Insert hazard section before closing body tag
    html = html.replace('</body>', `${hazardSection}</body>`)
  }

  return html
}

function getRiskColor(level) {
  switch (level) {
    case 'HIGH':
      return '#ef4444'
    case 'MEDIUM':
      return '#f59e0b'
    case 'LOW':
      return '#22c55e'
    default:
      return '#6b7280'
  }
}
