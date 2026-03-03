/**
 * Generate a professional project brief from survey data
 */
export function generateProjectBrief(surveyData) {
  const s1 = surveyData.section1 || {}
  const s2 = surveyData.section2 || {}
  const s3 = surveyData.section3 || {}
  const s4 = surveyData.section4 || {}
  const s5 = surveyData.section5 || {}
  const s6 = surveyData.section6 || {}
  const s7 = surveyData.section7 || {}
  const s8 = surveyData.section8 || {}

  const brief = {
    title: `Project Brief: ${s1.address || 'Unnamed Property'}`,
    submittedDate: new Date(surveyData.submittedAt).toLocaleDateString('en-AU'),
    projectId: `PROJ-${Date.now()}`,

    // Executive Summary
    executiveSummary: generateExecutiveSummary(s1, s2, s8),

    // Property Overview
    propertyOverview: {
      address: s1.address,
      lotDp: s1.lotDp,
      intendedUse: s1.intendedUse,
      ownershipStage: s1.ownershipStage,
      familyDescription: s1.family,
    },

    // Project Requirements
    projectRequirements: {
      projectType: s2.projectType,
      desiredFloorArea: s2.floorArea ? `${s2.floorArea} m²` : 'Not specified',
      bedrooms: s2.bedrooms,
      bathrooms: s2.bathrooms,
      layoutPreferences: s3.layoutPreferences,
      functionalRequirements: s3.functionalRequirements,
      outdoorSpaces: s3.outdoorSpaces,
    },

    // Design Direction
    designDirection: {
      finishLevel: s4.finishLevel,
      benchmarkReference: s4.benchmarkReference,
      characterWords: s6.characterWords,
      inspirationLinks: s7.inspirationLinks,
      inspirationNotes: s7.inspirationNotes,
    },

    // Constraints & Priorities
    constraints: {
      mustHaves: s5.mustHaves,
      nonNegotiables: s5.nonNegotiables,
      siteConstraints: s5.constraints,
    },

    // Budget & Timeline
    budgetTimeline: {
      estimatedBudget: s8.budget ? `$${parseInt(s8.budget).toLocaleString()}` : 'Not specified',
      preferredTimeline: s8.timeline,
      additionalNotes: s8.additionalNotes,
    },

    // Generated HTML for email/display
    html: generateBriefHTML(s1, s2, s3, s4, s5, s6, s7, s8),
  }

  return brief
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(s1, s2, s8) {
  const projectType = s2.projectType || 'residential project'
  const location = s1.address || 'the property'
  const budget = s8.budget ? `with an estimated budget of $${parseInt(s8.budget).toLocaleString()}` : ''

  return `This project brief outlines the vision for a ${projectType} at ${location} ${budget}. The client seeks to create a space that reflects their lifestyle and values, with careful attention to both functional requirements and aesthetic preferences.`
}

/**
 * Generate professional HTML brief for display
 */
function generateBriefHTML(s1, s2, s3, s4, s5, s6, s7, s8) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 3px solid #1B6B5C; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 10px 0; color: #1B6B5C; font-size: 28px; }
    .header p { margin: 5px 0; color: #666; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #1B6B5C; font-size: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 15px; }
    .section h3 { color: #1B6B5C; font-size: 16px; margin-top: 15px; margin-bottom: 8px; }
    .field { margin-bottom: 12px; }
    .label { font-weight: 600; color: #1B6B5C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { color: #555; margin-top: 4px; font-size: 15px; }
    .summary-box { background: #f5f5f5; border-left: 4px solid #1B6B5C; padding: 15px; margin-bottom: 20px; }
    .summary-box p { margin: 0; color: #555; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Project Brief</h1>
      <p><strong>${s1.address || 'Unnamed Property'}</strong></p>
      <p>Prepared: ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="section">
      <h2>Executive Summary</h2>
      <div class="summary-box">
        <p>${generateExecutiveSummary(s1, s2, s8)}</p>
      </div>
    </div>

    <div class="section">
      <h2>Property Overview</h2>
      <div class="grid">
        <div class="field">
          <div class="label">Address</div>
          <div class="value">${s1.address || 'Not provided'}</div>
        </div>
        <div class="field">
          <div class="label">Lot/DP</div>
          <div class="value">${s1.lotDp || 'Not provided'}</div>
        </div>
        <div class="field">
          <div class="label">Intended Use</div>
          <div class="value">${s1.intendedUse || 'Not provided'}</div>
        </div>
        <div class="field">
          <div class="label">Ownership Stage</div>
          <div class="value">${s1.ownershipStage || 'Not provided'}</div>
        </div>
      </div>
      <div class="field" style="margin-top: 15px;">
        <div class="label">Family Description</div>
        <div class="value">${s1.family || 'Not provided'}</div>
      </div>
    </div>

    <div class="section">
      <h2>Project Requirements</h2>
      <h3>Scope</h3>
      <div class="grid">
        <div class="field">
          <div class="label">Project Type</div>
          <div class="value">${s2.projectType || 'Not specified'}</div>
        </div>
        <div class="field">
          <div class="label">Desired Floor Area</div>
          <div class="value">${s2.floorArea ? s2.floorArea + ' m²' : 'Not specified'}</div>
        </div>
        <div class="field">
          <div class="label">Bedrooms</div>
          <div class="value">${s2.bedrooms || 'Not specified'}</div>
        </div>
        <div class="field">
          <div class="label">Bathrooms</div>
          <div class="value">${s2.bathrooms || 'Not specified'}</div>
        </div>
      </div>

      <h3>Functional Requirements</h3>
      <div class="field">
        <div class="label">Layout Preferences</div>
        <div class="value">${s3.layoutPreferences || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Functional Requirements</div>
        <div class="value">${s3.functionalRequirements || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Outdoor Spaces</div>
        <div class="value">${s3.outdoorSpaces || 'Not provided'}</div>
      </div>
    </div>

    <div class="section">
      <h2>Design Direction</h2>
      <div class="field">
        <div class="label">Finish Level</div>
        <div class="value">${s4.finishLevel || 'Not specified'}</div>
      </div>
      <div class="field">
        <div class="label">Benchmark Reference</div>
        <div class="value">${s4.benchmarkReference || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Project Character</div>
        <div class="value">${s6.characterWords || 'Not provided'}</div>
      </div>
      ${s7.inspirationLinks ? `
      <div class="field">
        <div class="label">Inspiration References</div>
        <div class="value">${s7.inspirationLinks}</div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2>Constraints & Priorities</h2>
      <div class="field">
        <div class="label">Must-Haves</div>
        <div class="value">${s5.mustHaves || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Non-Negotiables</div>
        <div class="value">${s5.nonNegotiables || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Site Constraints</div>
        <div class="value">${s5.constraints || 'Not provided'}</div>
      </div>
    </div>

    <div class="section">
      <h2>Budget & Timeline</h2>
      <div class="grid">
        <div class="field">
          <div class="label">Estimated Budget</div>
          <div class="value">${s8.budget ? '$' + parseInt(s8.budget).toLocaleString() : 'Not specified'}</div>
        </div>
        <div class="field">
          <div class="label">Preferred Timeline</div>
          <div class="value">${s8.timeline || 'Not specified'}</div>
        </div>
      </div>
      ${s8.additionalNotes ? `
      <div class="field" style="margin-top: 15px;">
        <div class="label">Additional Notes</div>
        <div class="value">${s8.additionalNotes}</div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>This brief was automatically generated from the Line & Light Studio Project Brief Intake form.</p>
      <p>For questions or clarifications, please contact the client directly.</p>
    </div>
  </div>
</body>
</html>
  `
}
