/**
 * Enhanced Feasibility Study Generator
 * Generates comprehensive feasibility reports with planning analysis,
 * site assessment, regulatory research, and detailed risk assessment
 */

import { compileHazardAssessment, generateHazardReportSection } from './property-hazard-research.js'
import { generateHazardHTML } from './hazard-html-generator.js'

export function generateEnhancedFeasibilityStudy(surveyData, hazardResearch = null) {
  const s1 = surveyData.section1 || {}
  const s2 = surveyData.section2 || {}
  const s3 = surveyData.section3 || {}
  const s4 = surveyData.section4 || {}
  const s5 = surveyData.section5 || {}
  const s8 = surveyData.section8 || {}

  const study = {
    projectId: `PROJ-${Date.now()}`,
    generatedDate: new Date().toISOString(),

    // Hazard research (if available)
    hazardAssessment: hazardResearch ? compileHazardAssessment(hazardResearch) : null,

    // Enhanced sections
    siteAnalysis: generateSiteAnalysis(s1, s5),
    planningResearchGuide: generatePlanningResearchGuide(s1, s2),
    planningControls: generatePlanningControlsTemplate(s1, s2),
    regulatoryAssessment: generateRegulatoryAssessment(s1, s2, s5),

    // Enhanced risk assessment
    risks: generateEnhancedRisks(s1, s2, s4, s5, s8),
    complexityScore: calculateComplexityScore(s1, s2, s4, s5, s8),
    recommendation: generateRecommendation(s1, s2, s4, s5, s8),

    // Cost and timeline
    costEstimate: estimateProjectCost(s2, s4, s8),
    timelineAssessment: assessTimeline(s2, s4, s8),

    // Strategic notes
    strategicNotes: generateStrategicNotes(s1, s2, s4, s5, s8),
    nextSteps: generateNextSteps(s1, s2, s5, s8),

    // HTML Report
    html: generateEnhancedFeasibilityHTML(surveyData, hazardResearch, hazardResearch ? compileHazardAssessment(hazardResearch) : null),
  }

  return study
}

/**
 * Generate site analysis section
 */
function generateSiteAnalysis(s1, s5) {
  const constraints = (s5.constraints || '').toLowerCase()

  return {
    address: s1.address,
    lotDp: s1.lotDp,
    ownershipStage: s1.ownershipStage,
    identifiedConstraints: {
      topography: constraints.includes('slope') || constraints.includes('steep'),
      access: constraints.includes('access') || constraints.includes('narrow'),
      heritage: constraints.includes('heritage'),
      environmental: constraints.includes('environment') || constraints.includes('bushfire'),
      flooding: constraints.includes('flood'),
      vegetation: constraints.includes('tree') || constraints.includes('vegetation'),
      utilities: constraints.includes('utility') || constraints.includes('services'),
    },
    constraintDetails: s5.constraints || 'To be assessed on site',
    researchRequired: [
      'Site survey and contour plan',
      'Geotechnical assessment (if sloped)',
      'Arboricultural report (if significant vegetation)',
      'Flood risk assessment (if applicable)',
      'Heritage assessment (if heritage listed)',
      'Services location plan (water, sewer, electricity, gas)',
      'Boundary survey and easement check',
      'Soil testing and site classification',
    ],
  }
}

/**
 * Generate planning research guide
 */
function generatePlanningResearchGuide(s1, s2) {
  const address = s1.address || 'property address'

  return {
    overview: `The following planning research must be completed to fully assess project feasibility. Use the NSW Planning Portal Spatial Viewer and local council resources.`,
    resources: [
      {
        name: 'NSW Planning Portal Spatial Viewer',
        url: 'https://www.planningportal.nsw.gov.au/spatialviewer/',
        purpose: 'Check zoning, overlays, and planning controls',
      },
      {
        name: 'SixMaps (NSW Spatial Services)',
        url: 'https://maps.six.nsw.gov.au/',
        purpose: 'View aerial imagery and cadastral data',
      },
      {
        name: 'Local Council Planning Portal',
        url: 'Contact local council for address',
        purpose: 'Development Control Plans (DCPs) and local planning policies',
      },
      {
        name: 'NSW Land Registry Services',
        url: 'https://online.nswlrs.com.au/',
        purpose: 'Title search and property details',
      },
    ],
    steps: [
      'Search property address in NSW Planning Portal Spatial Viewer',
      'Note zoning and all overlays displayed',
      'Check Development Control Plan (DCP) for local requirements',
      'Identify any heritage listings or environmental zones',
      'Check flood maps and bushfire zones',
      'Note setback requirements and height limits',
      'Identify any easements or restrictions',
      'Contact local council for any recent planning changes',
    ],
  }
}

/**
 * Generate planning controls template for user to fill in
 */
function generatePlanningControlsTemplate(s1, s2) {
  return {
    address: s1.address,
    instructions: 'Research and complete the following planning information using the NSW Planning Portal and local council resources.',
    zoning: {
      label: 'Zoning',
      description: 'Primary zoning classification (e.g., R2 Low Density Residential)',
      value: 'To be researched',
    },
    floorSpaceRatio: {
      label: 'Floor Space Ratio (FSR)',
      description: 'Maximum permitted floor area ratio',
      value: 'To be researched',
    },
    heightLimit: {
      label: 'Height Limit',
      description: 'Maximum building height in meters',
      value: 'To be researched',
    },
    setbacks: {
      label: 'Setback Requirements',
      description: 'Required distances from property boundaries (front, side, rear)',
      value: 'To be researched',
    },
    siteArea: {
      label: 'Minimum Site Area',
      description: 'Minimum lot size for development',
      value: 'To be researched',
    },
    heritage: {
      label: 'Heritage Listing',
      description: 'Is the property or area heritage listed?',
      value: 'To be researched',
    },
    floodZone: {
      label: 'Flood Zone',
      description: 'Flood risk classification',
      value: 'To be researched',
    },
    bushfireZone: {
      label: 'Bushfire Zone',
      description: 'Bushfire prone land classification',
      value: 'To be researched',
    },
    environmentalZone: {
      label: 'Environmental Zones',
      description: 'Any environmental protection zones',
      value: 'To be researched',
    },
    developmentApprovalPath: {
      label: 'Development Approval Pathway',
      description: 'Complying Development or Development Application required?',
      value: 'To be researched',
    },
  }
}

/**
 * Generate regulatory assessment
 */
function generateRegulatoryAssessment(s1, s2, s5) {
  const constraints = (s5.constraints || '').toLowerCase()

  const assessment = {
    approvalPathway: determineApprovalPathway(s2, constraints),
    likelyConditions: generateLikelyConditions(s2, constraints),
    consultantsRequired: identifyRequiredConsultants(constraints),
    estimatedApprovalTimeline: estimateApprovalTimeline(constraints),
  }

  return assessment
}

/**
 * Determine likely approval pathway
 */
function determineApprovalPathway(s2, constraints) {
  if (constraints.includes('heritage')) {
    return {
      pathway: 'Development Application (DA)',
      reason: 'Heritage constraints require full DA assessment',
      timeline: '8-12 weeks',
    }
  }

  if (constraints.includes('flood') || constraints.includes('bushfire')) {
    return {
      pathway: 'Development Application (DA)',
      reason: 'Environmental constraints require full assessment',
      timeline: '8-12 weeks',
    }
  }

  const projectType = (s2.projectType || '').toLowerCase()
  if (projectType.includes('new')) {
    return {
      pathway: 'Development Application (DA)',
      reason: 'New residential construction requires DA',
      timeline: '8-12 weeks',
    }
  }

  if (projectType.includes('renovation') && !projectType.includes('extension')) {
    return {
      pathway: 'Likely Complying Development or Exempt Work',
      reason: 'Interior renovations may not require approval',
      timeline: 'Immediate or 2-4 weeks',
    }
  }

  return {
    pathway: 'Development Application (DA) or Complying Development',
    reason: 'Depends on scope and local requirements',
    timeline: '4-12 weeks',
  }
}

/**
 * Generate likely planning conditions
 */
function generateLikelyConditions(s2, constraints) {
  const conditions = []

  if (constraints.includes('slope')) {
    conditions.push('Geotechnical report and slope stability certification')
    conditions.push('Retaining wall design and specifications')
    conditions.push('Erosion and sediment control measures')
  }

  if (constraints.includes('heritage')) {
    conditions.push('Heritage impact assessment')
    conditions.push('Heritage approval from Heritage NSW')
    conditions.push('Conservation plan compliance')
  }

  if (constraints.includes('tree') || constraints.includes('vegetation')) {
    conditions.push('Arboricultural report and tree protection plan')
    conditions.push('Compliance with tree preservation requirements')
  }

  if (constraints.includes('flood')) {
    conditions.push('Flood risk assessment and mitigation measures')
    conditions.push('Finished floor level above flood planning level')
    conditions.push('Flood evacuation and emergency management plan')
  }

  if (constraints.includes('bushfire')) {
    conditions.push('Bushfire assessment and protection measures')
    conditions.push('Compliance with Planning for Bushfire Protection')
  }

  conditions.push('Stormwater management and detention')
  conditions.push('Waste management plan')
  conditions.push('Construction management plan')
  conditions.push('Compliance with local Development Control Plan')

  return conditions
}

/**
 * Identify required consultants
 */
function identifyRequiredConsultants(constraints) {
  const consultants = ['Architect', 'Surveyor']

  if (constraints.includes('slope')) {
    consultants.push('Geotechnical Engineer')
  }

  if (constraints.includes('heritage')) {
    consultants.push('Heritage Consultant')
  }

  if (constraints.includes('tree') || constraints.includes('vegetation')) {
    consultants.push('Arboricultural Consultant')
  }

  if (constraints.includes('flood')) {
    consultants.push('Hydraulic/Flood Engineer')
  }

  if (constraints.includes('bushfire')) {
    consultants.push('Bushfire Protection Consultant')
  }

  consultants.push('Structural Engineer')
  consultants.push('Building Services Engineer')
  consultants.push('Certifier/Accredited Certifier')

  return consultants
}

/**
 * Estimate approval timeline
 */
function estimateApprovalTimeline(constraints) {
  let weeks = 8 // Base timeline

  if (constraints.includes('heritage')) weeks += 4
  if (constraints.includes('flood')) weeks += 2
  if (constraints.includes('bushfire')) weeks += 2
  if (constraints.includes('slope')) weeks += 2

  return `${weeks} weeks (${Math.ceil(weeks / 4)} months)`
}

/**
 * Generate enhanced risks
 */
function generateEnhancedRisks(s1, s2, s4, s5, s8) {
  const risks = []
  const constraints = (s5.constraints || '').toLowerCase()

  // Planning risks
  if (constraints.includes('heritage')) {
    risks.push({
      level: 'high',
      category: 'Planning & Regulatory',
      issue: 'Heritage constraints identified',
      impact: 'May significantly limit design options and increase approval timeline',
      recommendation: 'Engage heritage consultant early. Obtain preliminary heritage assessment.',
      mitigation: 'Develop design strategy that respects heritage significance',
    })
  }

  if (constraints.includes('flood')) {
    risks.push({
      level: 'high',
      category: 'Environmental & Regulatory',
      issue: 'Flood zone identified',
      impact: 'May require elevated floor levels, flood-resistant design, and increased costs',
      recommendation: 'Obtain flood risk assessment. Consult hydraulic engineer.',
      mitigation: 'Design above flood planning level. Implement flood-resistant construction.',
    })
  }

  if (constraints.includes('bushfire')) {
    risks.push({
      level: 'high',
      category: 'Environmental & Safety',
      issue: 'Bushfire prone area identified',
      impact: 'May require bushfire protection measures and increased construction costs',
      recommendation: 'Obtain bushfire assessment. Comply with Planning for Bushfire Protection.',
      mitigation: 'Implement required bushfire protection measures.',
    })
  }

  // Site constraint risks
  if (constraints.includes('slope')) {
    risks.push({
      level: 'medium',
      category: 'Site Conditions',
      issue: 'Sloped site identified',
      impact: 'May require retaining walls, site works, geotechnical advice',
      recommendation: 'Obtain site survey and geotechnical report',
      mitigation: 'Design appropriate retaining structures. Manage site drainage.',
    })
  }

  if (constraints.includes('access') || constraints.includes('narrow')) {
    risks.push({
      level: 'medium',
      category: 'Site Conditions',
      issue: 'Limited or narrow access identified',
      impact: 'May affect construction logistics and material delivery',
      recommendation: 'Assess access constraints. Plan construction methodology.',
      mitigation: 'Coordinate with builder on access requirements.',
    })
  }

  // Budget risks
  if (!s8.budget) {
    risks.push({
      level: 'high',
      category: 'Budget',
      issue: 'No budget specified',
      impact: 'Cannot assess financial feasibility',
      recommendation: 'Obtain clear budget parameters before proceeding',
      mitigation: 'Establish preliminary budget range',
    })
  } else if (parseInt(s8.budget) < 500000) {
    risks.push({
      level: 'medium',
      category: 'Budget',
      issue: 'Budget may be constrained for scope',
      impact: 'May require scope reduction or value engineering',
      recommendation: 'Discuss realistic budget vs. scope expectations',
      mitigation: 'Develop phased approach or value engineering strategy',
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
      mitigation: 'Establish realistic timeline with client',
    })
  } else if (s8.timeline.toLowerCase().includes('asap') || s8.timeline.toLowerCase().includes('urgent')) {
    risks.push({
      level: 'high',
      category: 'Timeline',
      issue: 'Urgent timeline requested',
      impact: 'May require expedited approvals and increased costs',
      recommendation: 'Discuss realistic fast-track options and costs',
      mitigation: 'Develop fast-track strategy with builder',
    })
  }

  // Design complexity risks
  if (s4.finishLevel === 'High-end Architectural') {
    risks.push({
      level: 'medium',
      category: 'Design Complexity',
      issue: 'High-end finish level selected',
      impact: 'Requires premium materials, specialized trades, and detailed coordination',
      recommendation: 'Ensure budget aligns with premium finish expectations',
      mitigation: 'Develop detailed finishes schedule. Engage premium trades early.',
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
      mitigation: 'Coordinate design timeline with purchase timeline',
    })
  }

  return risks
}

/**
 * Calculate complexity score
 */
function calculateComplexityScore(s1, s2, s4, s5, s8) {
  let score = 3 // Base score

  const constraints = (s5.constraints || '').toLowerCase()

  // Add for project type
  if (s2.projectType) {
    if (s2.projectType.toLowerCase().includes('renovation')) score += 2
    if (s2.projectType.toLowerCase().includes('extension')) score += 1.5
    if (s2.projectType.toLowerCase().includes('new')) score += 1
  }

  // Add for floor area
  if (s2.floorArea) {
    const area = parseInt(s2.floorArea)
    if (area > 500) score += 2
    else if (area > 300) score += 1
  }

  // Add for finish level
  if (s4.finishLevel === 'High-end Architectural') score += 2
  else if (s4.finishLevel === 'Premium') score += 1.5
  else if (s4.finishLevel === 'Standard') score += 0.5

  // Add for constraints
  if (constraints.includes('slope')) score += 1.5
  if (constraints.includes('heritage')) score += 2
  if (constraints.includes('bushfire')) score += 1.5
  if (constraints.includes('flood')) score += 1.5
  if (constraints.includes('access')) score += 1

  return Math.min(10, Math.round(score * 10) / 10)
}

/**
 * Generate feasibility recommendation
 */
function generateRecommendation(s1, s2, s4, s5, s8) {
  const score = calculateComplexityScore(s1, s2, s4, s5, s8)
  const risks = generateEnhancedRisks(s1, s2, s4, s5, s8)
  const highRisks = risks.filter((r) => r.level === 'high').length

  if (highRisks > 2) {
    return {
      status: 'CONDITIONAL',
      summary: 'Project is feasible but requires significant clarification and risk mitigation.',
      action: 'Schedule detailed discovery meeting to address identified risks before proceeding.',
      details: 'Multiple high-risk factors identified. Comprehensive planning research and specialist consultations required.',
    }
  } else if (score > 8) {
    return {
      status: 'FEASIBLE - COMPLEX',
      summary: 'Project is feasible but complex. Recommend experienced design and construction team.',
      action: 'Proceed with detailed planning and specialist consultations.',
      details: 'High complexity score indicates need for experienced professionals and careful coordination.',
    }
  } else if (highRisks > 0) {
    return {
      status: 'FEASIBLE - WITH CAVEATS',
      summary: 'Project is feasible. Address identified risks in planning phase.',
      action: 'Proceed with detailed planning, addressing specific risk mitigation strategies.',
      details: 'Several risks identified but manageable with appropriate planning and specialist input.',
    }
  } else {
    return {
      status: 'FEASIBLE',
      summary: 'Project appears straightforward and feasible.',
      action: 'Proceed to detailed design development.',
      details: 'Low complexity and minimal identified risks. Project can proceed to next phase.',
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
  else if (s4.finishLevel === 'High-end Architectural') baseRate = 5000

  const estimatedCost = floorArea * baseRate
  const clientBudget = parseInt(s8.budget) || 0

  return {
    estimatedCost: estimatedCost,
    estimatedCostFormatted: `$${estimatedCost.toLocaleString()}`,
    clientBudget: clientBudget,
    clientBudgetFormatted: clientBudget ? `$${clientBudget.toLocaleString()}` : 'Not specified',
    variance: clientBudget ? clientBudget - estimatedCost : 0,
    varianceFormatted: clientBudget ? `$${(clientBudget - estimatedCost).toLocaleString()}` : 'Not calculable',
    budgetStatus:
      clientBudget === 0
        ? 'Not specified'
        : clientBudget >= estimatedCost
          ? 'ADEQUATE'
          : 'INSUFFICIENT',
    costPerM2: `$${baseRate.toLocaleString()}/m²`,
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
  if (s4.finishLevel === 'High-end Architectural') estimatedMonths += 3

  return {
    clientTimeline: timeline,
    estimatedMonths: estimatedMonths,
    assessment: `Typical timeline for this project scope is approximately ${estimatedMonths} months from design approval to completion, including design development, approvals, and construction.`,
  }
}

/**
 * Generate strategic notes
 */
function generateStrategicNotes(s1, s2, s4, s5, s8) {
  const notes = []

  if (s1.intendedUse === 'Primary Residence') {
    notes.push('Client is building/renovating for personal use - focus on lifestyle fit and long-term satisfaction.')
  }

  if (s4.finishLevel === 'High-end Architectural') {
    notes.push('Premium finish level - recommend detailed material selections and finishes schedule early.')
  }

  if (s5.mustHaves) {
    notes.push(`Key priorities identified: ${s5.mustHaves.substring(0, 100)}...`)
  }

  if (!s8.budget || parseInt(s8.budget) < 500000) {
    notes.push('Budget may be a constraint - recommend value engineering approach and phasing options.')
  }

  if (s2.floorArea && parseInt(s2.floorArea) > 500) {
    notes.push('Large floor area - consider sustainability features and operational efficiency.')
  }

  notes.push('Comprehensive planning research required before final feasibility determination.')

  return notes
}

/**
 * Generate next steps
 */
function generateNextSteps(s1, s2, s5, s8) {
  const steps = [
    {
      phase: 'Immediate',
      tasks: [
        'Complete planning research using NSW Planning Portal and SixMaps',
        'Obtain title search and identify any easements or restrictions',
        'Confirm budget and timeline parameters with client',
        'Identify any site constraints requiring specialist assessment',
      ],
    },
    {
      phase: 'Planning Phase',
      tasks: [
        'Engage required specialist consultants',
        'Obtain site survey and contour plan',
        'Conduct site visit and photographic documentation',
        'Prepare preliminary design concept',
        'Assess compliance with planning controls',
      ],
    },
    {
      phase: 'Approval Phase',
      tasks: [
        'Prepare Development Application (if required)',
        'Obtain specialist reports and assessments',
        'Liaise with local council on planning requirements',
        'Address any council feedback or conditions',
      ],
    },
    {
      phase: 'Design Development',
      tasks: [
        'Develop detailed design documentation',
        'Finalize material and finish selections',
        'Prepare construction documentation',
        'Obtain building certification',
      ],
    },
  ]

  return steps
}

/**
 * Generate comprehensive HTML feasibility report
 */
function generateEnhancedFeasibilityHTML(surveyData, hazardResearch = null, hazardAssessment = null) {
  const s1 = surveyData.section1 || {}
  const s2 = surveyData.section2 || {}
  const s4 = surveyData.section4 || {}
  const s5 = surveyData.section5 || {}
  const s8 = surveyData.section8 || {}

  // Generate all components directly to avoid circular calls
  const siteAnalysis = generateSiteAnalysis(s1, s5)
  const planningGuide = generatePlanningResearchGuide(s1, s2)
  const regulatoryAssessment = generateRegulatoryAssessment(s1, s2, s5)
  const risks = generateEnhancedRisks(s1, s2, s4, s5, s8)
  const recommendation = generateRecommendation(s1, s2, s4, s5, s8)
  const costEst = estimateProjectCost(s2, s4, s8)
  const timeline = assessTimeline(s2, s4, s8)
  const complexity = calculateComplexityScore(s1, s2, s4, s5, s8)
  const hazardHTML = hazardAssessment ? generateHazardHTML(hazardAssessment) : ''

  const riskHTML = risks
    .map(
      (risk) => `
    <div class="risk-item risk-${risk.level}">
      <div class="risk-header">
        <span class="risk-level">${risk.level.toUpperCase()}</span>
        <span class="risk-category">${risk.category}</span>
      </div>
      <div class="risk-issue"><strong>Issue:</strong> ${risk.issue}</div>
      <div class="risk-impact"><strong>Impact:</strong> ${risk.impact}</div>
      <div class="risk-rec"><strong>Recommendation:</strong> ${risk.recommendation}</div>
      <div class="risk-mit"><strong>Mitigation:</strong> ${risk.mitigation}</div>
    </div>
  `
    )
    .join('')

  const consultantsHTML = regulatoryAssessment.consultantsRequired
    .map((c) => `<li>${c}</li>`)
    .join('')

  const nextStepsHTML = study.nextSteps
    .map(
      (phase) => `
    <div class="phase-box">
      <h4>${phase.phase}</h4>
      <ul>
        ${phase.tasks.map((task) => `<li>${task}</li>`).join('')}
      </ul>
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
    .container { max-width: 950px; margin: 0 auto; padding: 40px 20px; }
    .header { background: #1B6B5C; color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 5px 0; opacity: 0.9; font-size: 14px; }
    .recommendation-box { background: #f0f8f6; border-left: 5px solid #1B6B5C; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
    .recommendation-status { font-size: 18px; font-weight: 600; color: #1B6B5C; margin-bottom: 10px; }
    .section { margin-bottom: 35px; }
    .section h2 { color: #1B6B5C; font-size: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 15px; }
    .section h3 { color: #1B6B5C; font-size: 16px; margin-top: 15px; margin-bottom: 10px; }
    .metric { display: inline-block; margin-right: 30px; margin-bottom: 15px; }
    .metric-value { font-size: 24px; font-weight: 600; color: #1B6B5C; }
    .metric-label { font-size: 12px; color: #999; text-transform: uppercase; margin-top: 5px; }
    .risk-item { background: #fff; border: 1px solid #e0e0e0; border-left: 4px solid #ddd; padding: 15px; margin-bottom: 12px; border-radius: 4px; }
    .risk-high { border-left-color: #e74c3c; background: #fef5f5; }
    .risk-medium { border-left-color: #f39c12; background: #fef9f5; }
    .risk-low { border-left-color: #27ae60; background: #f5fef7; }
    .risk-header { display: flex; gap: 10px; margin-bottom: 8px; }
    .risk-level { display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 3px; text-transform: uppercase; }
    .risk-high .risk-level { background: #e74c3c; color: white; }
    .risk-medium .risk-level { background: #f39c12; color: white; }
    .risk-low .risk-level { background: #27ae60; color: white; }
    .risk-category { display: inline-block; font-size: 11px; color: #666; }
    .risk-issue, .risk-impact, .risk-rec, .risk-mit { font-size: 14px; margin-bottom: 6px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #1B6B5C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { color: #555; margin-top: 4px; font-size: 15px; line-height: 1.5; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .phase-box { background: #f9f9f9; border: 1px solid #e0e0e0; padding: 15px; margin-bottom: 12px; border-radius: 4px; }
    .phase-box h4 { margin-top: 0; color: #1B6B5C; }
    .phase-box ul { margin-left: 20px; margin-top: 8px; }
    .phase-box li { margin-bottom: 6px; font-size: 14px; }
    .research-box { background: #f5f5f5; border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
    .research-box h4 { margin-top: 0; color: #1B6B5C; }
    .research-box ul { margin-left: 20px; margin-top: 8px; }
    .research-box li { margin-bottom: 6px; font-size: 14px; }
    .research-box a { color: #1B6B5C; text-decoration: none; }
    .research-box a:hover { text-decoration: underline; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Feasibility Study</h1>
      <p><strong>${s1.address || 'Unnamed Property'}</strong></p>
      <p>Prepared: ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="section">
      <h2>Feasibility Assessment</h2>
      <div class="recommendation-box">
        <div class="recommendation-status">${recommendation.status}</div>
        <p><strong>${recommendation.summary}</strong></p>
        <p><strong>Action:</strong> ${recommendation.action}</p>
        <p>${recommendation.details}</p>
      </div>
    </div>

    <div class="section">
      <h2>Project Metrics</h2>
      <div class="metric">
        <div class="metric-value">${complexity}</div>
        <div class="metric-label">Complexity Score (1-10)</div>
      </div>
      <div class="metric">
        <div class="metric-value">${risks.length}</div>
        <div class="metric-label">Identified Risks</div>
      </div>
      <div class="metric">
        <div class="metric-value">${risks.filter((r) => r.level === 'high').length}</div>
        <div class="metric-label">High-Risk Factors</div>
      </div>
      <div class="metric">
        <div class="metric-value">${timeline.estimatedMonths}</div>
        <div class="metric-label">Est. Timeline (Months)</div>
      </div>
    </div>

    <div class="section">
      <h2>Site Analysis</h2>
      <div class="field">
        <div class="label">Address</div>
        <div class="value">${siteAnalysis.address || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Lot/DP</div>
        <div class="value">${siteAnalysis.lotDp || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Ownership Stage</div>
        <div class="value">${siteAnalysis.ownershipStage || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Identified Constraints</div>
        <div class="value">
          ${Object.entries(siteAnalysis.identifiedConstraints)
            .filter(([, v]) => v)
            .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
            .join(', ') || 'None identified'}
        </div>
      </div>
      <div class="field">
        <div class="label">Constraint Details</div>
        <div class="value">${siteAnalysis.constraintDetails}</div>
      </div>
      <div class="field">
        <div class="label">Research Required</div>
        <ul style="margin-left: 20px; margin-top: 8px;">
          ${siteAnalysis.researchRequired.map((r) => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>

    ${hazardHTML}

    <div class="section">
      <h2>Planning Research Guide</h2>
      <p>${planningGuide.overview}</p>
      
      <h3>Key Resources</h3>
      <div class="research-box">
        ${planningGuide.resources
          .map(
            (r) => `
          <div style="margin-bottom: 12px;">
            <strong>${r.name}</strong><br>
            <small>${r.purpose}</small><br>
            <a href="${r.url}" target="_blank">${r.url}</a>
          </div>
        `
          )
          .join('')}
      </div>

      <h3>Research Steps</h3>
      <ol style="margin-left: 20px;">
        ${planningGuide.steps.map((s) => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
      </ol>
    </div>

    <div class="section">
      <h2>Regulatory Assessment</h2>
      <h3>Development Approval Pathway</h3>
      <div class="field">
        <div class="label">Pathway</div>
        <div class="value">${regulatoryAssessment.approvalPathway.pathway}</div>
      </div>
      <div class="field">
        <div class="label">Reason</div>
        <div class="value">${regulatoryAssessment.approvalPathway.reason}</div>
      </div>
      <div class="field">
        <div class="label">Estimated Timeline</div>
        <div class="value">${regulatoryAssessment.approvalPathway.timeline}</div>
      </div>

      <h3>Likely Planning Conditions</h3>
      <ul style="margin-left: 20px;">
        ${regulatoryAssessment.likelyConditions.map((c) => `<li style="margin-bottom: 6px;">${c}</li>`).join('')}
      </ul>

      <h3>Required Consultants</h3>
      <ul style="margin-left: 20px;">
        ${consultantsHTML}
      </ul>
    </div>

    <div class="section">
      <h2>Risk Assessment</h2>
      ${riskHTML}
    </div>

    <div class="section">
      <h2>Cost Estimate</h2>
      <div class="grid">
        <div class="field">
          <div class="label">Estimated Project Cost</div>
          <div class="value">${costEst.estimatedCostFormatted}</div>
        </div>
        <div class="field">
          <div class="label">Cost per m²</div>
          <div class="value">${costEst.costPerM2}</div>
        </div>
        <div class="field">
          <div class="label">Client Budget</div>
          <div class="value">${costEst.clientBudgetFormatted}</div>
        </div>
        <div class="field">
          <div class="label">Budget Status</div>
          <div class="value" style="color: ${costEst.budgetStatus === 'ADEQUATE' ? '#27ae60' : costEst.budgetStatus === 'INSUFFICIENT' ? '#e74c3c' : '#999'};">
            ${costEst.budgetStatus}
          </div>
        </div>
      </div>
      ${costEst.variance !== 0 ? `
      <div class="field">
        <div class="label">Budget Variance</div>
        <div class="value" style="color: ${costEst.variance > 0 ? '#27ae60' : '#e74c3c'};">
          ${costEst.varianceFormatted} ${costEst.variance > 0 ? '(surplus)' : '(shortfall)'}
        </div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2>Timeline Assessment</h2>
      <div class="field">
        <div class="label">Client Timeline</div>
        <div class="value">${timeline.clientTimeline}</div>
      </div>
      <div class="field">
        <div class="label">Estimated Duration</div>
        <div class="value">${timeline.estimatedMonths} months</div>
      </div>
      <div class="field">
        <div class="label">Assessment</div>
        <div class="value">${timeline.assessment}</div>
      </div>
    </div>

    <div class="section">
      <h2>Next Steps</h2>
      ${nextStepsHTML}
    </div>

    <div class="footer">
      <p>This feasibility study was automatically generated from the Line & Light Studio Project Brief Intake form.</p>
      <p>It provides preliminary assessment based on information provided. Detailed planning research and specialist consultations are required before final feasibility determination.</p>
      <p>For questions or clarifications, please contact the studio directly.</p>
    </div>
  </div>
</body>
</html>
  `
}
