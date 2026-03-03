/**
 * Generates HTML for hazard assessment section
 */
export function generateHazardHTML(hazardAssessment) {
  if (!hazardAssessment) {
    return ''
  }

  let html = `
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
  `

  if (hazardAssessment.hazards && hazardAssessment.hazards.length > 0) {
    html += '<h3>Identified Hazards</h3>'

    hazardAssessment.hazards.forEach((hazard, idx) => {
      const borderColor = hazard.severity === 'HIGH' ? '#ef4444' : '#f59e0b'
      html += `
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid ${borderColor};">
        <h4 style="margin-top: 0;">${idx + 1}. ${hazard.type.replace(/_/g, ' ')}</h4>
        <p><strong>Severity:</strong> ${hazard.severity}</p>
        <p>${hazard.description}</p>
        <h5>Implications for Development:</h5>
        <ul style="margin-left: 20px;">
      `

      hazard.implications.forEach((imp) => {
        html += `<li>${imp}</li>`
      })

      html += `
        </ul>
        <h5>Recommended Mitigations:</h5>
        <ul style="margin-left: 20px;">
      `

      hazard.mitigations.forEach((mit) => {
        html += `<li>${mit}</li>`
      })

      html += `
        </ul>
      </div>
      `
    })
  } else {
    html += '<p>No major hazards identified based on available planning data.</p>'
  }

  html += '<h3>Next Steps</h3><ul style="margin-left: 20px;">'
  hazardAssessment.overallRisk.nextSteps.forEach((step) => {
    html += `<li style="margin-bottom: 8px;">${step}</li>`
  })
  html += '</ul>'

  if (hazardAssessment.sixmapsLink) {
    html += `
    <div style="background: #e0f2fe; padding: 12px; border-radius: 6px; margin-top: 15px;">
      <strong>Planning Data Reference:</strong> <a href="${hazardAssessment.sixmapsLink}" target="_blank">View on SixMaps</a>
    </div>
    `
  }

  html += '</div>'

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
