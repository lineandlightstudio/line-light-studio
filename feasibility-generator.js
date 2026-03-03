/**
 * Generate an internal feasibility study from survey data
 */
export function generateFeasibilityStudy(surveyData) {
  const s1 = surveyData.section1 || {}
  const s2 = surveyData.section2 || {}
  const s4 = surveyData.section4 || {}
  const s5 = surveyData.section5 || {}
  const s8 = surveyData.section8 || {}

  const study = {
    projectId: `PROJ-${Date.now()}`,
    generatedDate: new Date().toISOString(),
    
    // Risk Assessment
    risks: assessRisks(s1, s2, s4, s5, s8),
    
    // Complexity Score (1-10)
    complexityScore: calculateComplexityScore(s1, s2, s4, s5, s8),
    
    // Feasibility Recommendation
    recommendation: generateRecommendation(s1, s2, s4, s5, s8),
    
    // Cost Estimate
    costEstimate: estimateProjectCost(s2, s4, s8),
    
    // Timeline Assessment
    timelineAssessment: assessTimeline(s2, s4, s8),
    
    // Strategic Notes
    strategicNotes: generateStrategicNotes(s1, s2, s4, s5, s8),
    
    // HTML Report
    html: generateFeasibilityHTML(s1, s2, s4, s5, s8),
  }

  return study
}

/**
 * Assess project risks
 */
function assessRisks(s1, s2, s4, s5, s8) {
  const risks = []

  // Budget-related risks
  if (!s8.budget) {
    risks.push({
      level: 'high',
      category: 'Budget',
      issue: 'No budget specified',
      impact: 'Cannot assess financial feasibility',
      recommendation: 'Obtain clear budget parameters before proceeding',
    })
  } else if (parseInt(s8.budget) < 500000) {
    risks.push({
      level: 'medium',
      category: 'Budget',
      issue: 'Budget may be constrained for scope',
      impact: 'May require scope reduction or value engineering',
      recommendation: 'Discuss realistic budget vs. scope expectations',
    })
  }

  // Timeline risks
  if (!s8.timeline) {
    risks.push({
      level: 'medium',
      category: 'Timeline',
      issue: 'No timeline specified',
      impact: 'Cannot assess delivery feasibility',
      recommendation: 'Clarify desired project completion date',
    })
  } else if (s8.timeline.toLowerCase().includes('urgent') || s8.timeline.toLowerCase().includes('asap')) {
    risks.push({
      level: 'high',
      category: 'Timeline',
      issue: 'Urgent timeline requested',
      impact: 'May require expedited approvals and increased costs',
      recommendation: 'Discuss realistic fast-track options and costs',
    })
  }

  // Finish level risks
  if (s4.finishLevel === 'High-end architectural') {
    risks.push({
      level: 'medium',
      category: 'Design Complexity',
      issue: 'High-end finish level selected',
      impact: 'Requires premium materials and specialized trades',
      recommendation: 'Ensure budget aligns with premium finish expectations',
    })
  }

  // Site constraint risks
  if (s5.constraints && s5.constraints.toLowerCase().includes('slope')) {
    risks.push({
      level: 'medium',
      category: 'Site Conditions',
      issue: 'Sloped site identified',
      impact: 'May require retaining walls, site works, geotechnical advice',
      recommendation: 'Obtain site survey and geotechnical report',
    })
  }

  if (s5.constraints && s5.constraints.toLowerCase().includes('heritage')) {
    risks.push({
      level: 'high',
      category: 'Regulatory',
      issue: 'Heritage constraints identified',
      impact: 'Requires heritage approval, may limit design options',
      recommendation: 'Engage heritage consultant early',
    })
  }

  // Ownership stage risks
  if (s1.ownershipStage === 'Researching') {
    risks.push({
      level: 'medium',
      category: 'Project Status',
      issue: 'Property not yet owned',
      impact: 'Project timeline dependent on purchase completion',
      recommendation: 'Clarify expected settlement date',
    })
  }

  return risks
}

/**
 * Calculate complexity score (1-10)
 */
function calculateComplexityScore(s1, s2, s4, s5, s8) {
  let score = 3 // Base score

  // Add for project type
  if (s2.projectType && s2.projectType.toLowerCase().includes('renovation')) score += 2
  if (s2.projectType && s2.projectType.toLowerCase().includes('extension')) score += 1.5
  if (s2.projectType && s2.projectType.toLowerCase().includes('new')) score += 1

  // Add for floor area
  if (s2.floorArea) {
    const area = parseInt(s2.floorArea)
    if (area > 500) score += 2
    else if (area > 300) score += 1
  }

  // Add for finish level
  if (s4.finishLevel === 'High-end architectural') score += 2
  else if (s4.finishLevel === 'Premium') score += 1.5
  else if (s4.finishLevel === 'Standard') score += 0.5

  // Add for constraints
  if (s5.constraints) {
    if (s5.constraints.toLowerCase().includes('slope')) score += 1.5
    if (s5.constraints.toLowerCase().includes('heritage')) score += 2
    if (s5.constraints.toLowerCase().includes('bushfire')) score += 1.5
  }

  return Math.min(10, Math.round(score * 10) / 10)
}

/**
 * Generate feasibility recommendation
 */
function generateRecommendation(s1, s2, s4, s5, s8) {
  const score = calculateComplexityScore(s1, s2, s4, s5, s8)
  const risks = assessRisks(s1, s2, s4, s5, s8)
  const highRisks = risks.filter((r) => r.level === 'high').length

  if (highRisks > 2) {
    return {
      status: 'CONDITIONAL',
      summary: 'Project is feasible but requires significant clarification and risk mitigation',
      action: 'Schedule detailed discovery meeting to address risks before proceeding',
    }
  } else if (score > 8) {
    return {
      status: 'FEASIBLE - COMPLEX',
      summary: 'Project is feasible but complex. Recommend experienced design and construction team.',
      action: 'Proceed with detailed planning and specialist consultations',
    }
  } else if (highRisks > 0) {
    return {
      status: 'FEASIBLE - WITH CAVEATS',
      summary: 'Project is feasible. Address identified risks in planning phase.',
      action: 'Proceed with detailed planning, addressing specific risk mitigation strategies',
    }
  } else {
    return {
      status: 'FEASIBLE',
      summary: 'Project appears straightforward and feasible.',
      action: 'Proceed to detailed design development',
    }
  }
}

/**
 * Estimate project cost
 */
function estimateProjectCost(s2, s4, s8) {
  const floorArea = parseInt(s2.floorArea) || 300
  let baseRate = 2500 // Base $/m² for standard residential

  // Adjust for finish level
  if (s4.finishLevel === 'Budget-conscious') baseRate = 1800
  else if (s4.finishLevel === 'Standard') baseRate = 2500
  else if (s4.finishLevel === 'Premium') baseRate = 3500
  else if (s4.finishLevel === 'High-end architectural') baseRate = 5000

  const estimatedCost = floorArea * baseRate
  const clientBudget = parseInt(s8.budget) || 0

  return {
    estimatedCost: estimatedCost,
    clientBudget: clientBudget,
    variance: clientBudget ? clientBudget - estimatedCost : 0,
    budgetStatus:
      clientBudget === 0
        ? 'Not specified'
        : clientBudget >= estimatedCost
          ? 'ADEQUATE'
          : 'INSUFFICIENT',
  }
}

/**
 * Assess timeline feasibility
 */
function assessTimeline(s2, s4, s8) {
  const timeline = s8.timeline || 'Not specified'
  let estimatedMonths = 12 // Default

  // Estimate based on project type
  if (s2.projectType) {
    if (s2.projectType.toLowerCase().includes('extension')) estimatedMonths = 8
    else if (s2.projectType.toLowerCase().includes('renovation')) estimatedMonths = 10
    else if (s2.projectType.toLowerCase().includes('new')) estimatedMonths = 14
  }

  // Adjust for finish level
  if (s4.finishLevel === 'High-end architectural') estimatedMonths += 3

  return {
    clientTimeline: timeline,
    estimatedMonths: estimatedMonths,
    assessment: `Typical timeline for this project scope is ${estimatedMonths} months from design approval to completion.`,
  }
}

/**
 * Generate strategic notes for the team
 */
function generateStrategicNotes(s1, s2, s4, s5, s8) {
  const notes = []

  if (s1.intendedUse === 'Primary Residence') {
    notes.push('Client is building/renovating for personal use - focus on lifestyle fit and long-term satisfaction')
  }

  if (s4.finishLevel === 'High-end architectural') {
    notes.push('Premium finish level - recommend detailed material selections and finishes schedule early')
  }

  if (s5.mustHaves) {
    notes.push(`Key priorities identified: ${s5.mustHaves.substring(0, 100)}...`)
  }

  if (!s8.budget || parseInt(s8.budget) < 500000) {
    notes.push('Budget may be a constraint - recommend value engineering approach and phasing options')
  }

  if (s2.floorArea && parseInt(s2.floorArea) > 500) {
    notes.push('Large floor area - consider sustainability features and operational efficiency')
  }

  return notes
}

/**
 * Generate HTML feasibility report
 */
function generateFeasibilityHTML(s1, s2, s4, s5, s8) {
  const risks = assessRisks(s1, s2, s4, s5, s8)
  const recommendation = generateRecommendation(s1, s2, s4, s5, s8)
  const costEst = estimateProjectCost(s2, s4, s8)
  const timeline = assessTimeline(s2, s4, s8)
  const complexity = calculateComplexityScore(s1, s2, s4, s5, s8)

  const riskHTML = risks
    .map(
      (risk) => `
    <div class="risk-item risk-${risk.level}">
      <div class="risk-header">
        <span class="risk-level">${risk.level.toUpperCase()}</span>
        <span class="risk-category">${risk.category}</span>
      </div>
      <div class="risk-issue">${risk.issue}</div>
      <div class="risk-impact"><strong>Impact:</strong> ${risk.impact}</div>
      <div class="risk-rec"><strong>Recommendation:</strong> ${risk.recommendation}</div>
    </div>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .header { background: #1B6B5C; color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 5px 0; opacity: 0.9; }
    .recommendation-box { background: #f0f8f6; border-left: 5px solid #1B6B5C; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
    .recommendation-status { font-size: 18px; font-weight: 600; color: #1B6B5C; margin-bottom: 10px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #1B6B5C; font-size: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 15px; }
    .metric { display: inline-block; margin-right: 30px; margin-bottom: 15px; }
    .metric-value { font-size: 24px; font-weight: 600; color: #1B6B5C; }
    .metric-label { font-size: 12px; color: #999; text-transform: uppercase; margin-top: 5px; }
    .risk-item { background: #fff; border: 1px solid #ddd; padding: 15px; margin-bottom: 12px; border-radius: 4px; border-left: 4px solid #ccc; }
    .risk-high { border-left-color: #ef4444; background: #fef2f2; }
    .risk-medium { border-left-color: #f59e0b; background: #fffbf0; }
    .risk-low { border-left-color: #10b981; background: #f0fdf4; }
    .risk-header { display: flex; gap: 10px; margin-bottom: 8px; }
    .risk-level { font-weight: 600; font-size: 11px; padding: 3px 8px; border-radius: 3px; }
    .risk-high .risk-level { background: #ef4444; color: white; }
    .risk-medium .risk-level { background: #f59e0b; color: white; }
    .risk-low .risk-level { background: #10b981; color: white; }
    .risk-category { font-size: 12px; color: #666; }
    .risk-issue { font-weight: 600; color: #333; margin-bottom: 8px; }
    .risk-impact, .risk-rec { font-size: 14px; color: #555; margin-bottom: 5px; }
    .note { background: #f9f9f9; padding: 12px; margin-bottom: 8px; border-left: 3px solid #1B6B5C; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Feasibility Study</h1>
      <p><strong>${s1.address || 'Unnamed Property'}</strong></p>
      <p>Generated: ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>

    <div class="recommendation-box">
      <div class="recommendation-status">Status: ${recommendation.status}</div>
      <p>${recommendation.summary}</p>
      <p><strong>Action:</strong> ${recommendation.action}</p>
    </div>

    <div class="section">
      <h2>Project Assessment</h2>
      <div class="metric">
        <div class="metric-value">${complexity}/10</div>
        <div class="metric-label">Complexity Score</div>
      </div>
      <div class="metric">
        <div class="metric-value">${timeline.estimatedMonths}</div>
        <div class="metric-label">Est. Months</div>
      </div>
      <div class="metric">
        <div class="metric-value">$${(costEst.estimatedCost / 1000000).toFixed(1)}M</div>
        <div class="metric-label">Est. Cost</div>
      </div>
    </div>

    <div class="section">
      <h2>Risk Assessment</h2>
      ${riskHTML || '<p>No significant risks identified.</p>'}
    </div>

    <div class="section">
      <h2>Cost Analysis</h2>
      <div class="metric">
        <div class="metric-value">$${(costEst.estimatedCost / 1000).toFixed(0)}k</div>
        <div class="metric-label">Estimated Cost</div>
      </div>
      ${costEst.clientBudget ? `
      <div class="metric">
        <div class="metric-value">$${(costEst.clientBudget / 1000).toFixed(0)}k</div>
        <div class="metric-label">Client Budget</div>
      </div>
      <div class="metric">
        <div class="metric-value">${costEst.budgetStatus}</div>
        <div class="metric-label">Budget Status</div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2>Timeline Assessment</h2>
      <p><strong>Client Timeline:</strong> ${timeline.clientTimeline}</p>
      <p>${timeline.assessment}</p>
    </div>

    <div class="section">
      <h2>Strategic Notes</h2>
      ${generateStrategicNotes(s1, s2, s4, s5, s8).map((note) => `<div class="note">${note}</div>`).join('')}
    </div>

    <div class="footer">
      <p>This feasibility study was automatically generated from the project brief intake form.</p>
      <p>For detailed analysis and recommendations, schedule a discovery meeting with the client.</p>
    </div>
  </div>
</body>
</html>
  `
}
