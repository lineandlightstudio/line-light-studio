/**
 * Enhanced Project Brief Generator
 * Generates comprehensive, professional project briefs with design principles,
 * architectural analysis, and detailed recommendations
 */

export function generateEnhancedBrief(surveyData) {
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

    // Enhanced sections
    executiveSummary: generateEnhancedExecutiveSummary(s1, s2, s3, s4, s5, s6, s8),
    designStrategy: generateDesignStrategy(s3, s4, s5, s6, s7),
    designPrinciples: generateDesignPrinciples(s4, s6, s7),
    architecturalStyle: generateArchitecturalStyle(s4, s6, s7),
    materialPalette: generateMaterialPalette(s4, s6),
    spatialAnalysis: generateSpatialAnalysis(s2, s3, s5),
    keyDesignMoves: generateKeyDesignMoves(s3, s5, s6),

    // Original sections (enhanced)
    propertyOverview: generateEnhancedPropertyOverview(s1, s2),
    projectRequirements: generateEnhancedProjectRequirements(s2, s3),
    designDirection: generateEnhancedDesignDirection(s4, s6, s7),
    constraints: generateEnhancedConstraints(s5),
    budgetTimeline: generateEnhancedBudgetTimeline(s8),

    // HTML for display/PDF
    html: generateEnhancedBriefHTML(surveyData),
  }

  return brief
}

/**
 * Generate enhanced executive summary with more context
 */
function generateEnhancedExecutiveSummary(s1, s2, s3, s4, s5, s6, s8) {
  const projectType = s2.projectType || 'residential project'
  const location = s1.address || 'the property'
  const budget = s8.budget ? `with an estimated budget of $${parseInt(s8.budget).toLocaleString()}` : ''
  const characterWords = s6.characterWords ? s6.characterWords.split(',').map(w => w.trim()).slice(0, 3).join(', ') : ''
  const intendedUse = s1.intendedUse || 'residential use'

  let summary = `This comprehensive project brief outlines the vision for a ${projectType} at ${location} ${budget}. `
  summary += `The project is intended as a ${intendedUse} and will be designed to reflect the client's lifestyle, values, and aspirations. `

  if (characterWords) {
    summary += `The design will embody key characteristics including ${characterWords}. `
  }

  if (s3.layoutPreferences) {
    summary += `The spatial planning will prioritize ${s3.layoutPreferences.substring(0, 50).toLowerCase()}... `
  }

  summary += `This brief establishes the foundation for detailed design development, incorporating functional requirements, aesthetic preferences, site constraints, and regulatory considerations.`

  return summary
}

/**
 * Generate design strategy section
 */
function generateDesignStrategy(s3, s4, s5, s6, s7) {
  const strategy = {
    overview: 'The design strategy is developed from a comprehensive understanding of the client\'s lifestyle, site conditions, and regulatory environment.',
    spatialOrganization: s3.layoutPreferences || 'To be determined during design development',
    functionalZoning: s3.functionalRequirements || 'Standard residential zoning',
    outdoorIntegration: s3.outdoorSpaces || 'To be developed in consultation with client',
    keyPriorities: [
      ...(s5.mustHaves ? [`Must-haves: ${s5.mustHaves.substring(0, 80)}`] : []),
      ...(s5.nonNegotiables ? [`Non-negotiables: ${s5.nonNegotiables.substring(0, 80)}`] : []),
      ...(s4.finishLevel ? [`Quality level: ${s4.finishLevel}`] : []),
    ],
  }

  return strategy
}

/**
 * Generate core design principles
 */
function generateDesignPrinciples(s4, s6, s7) {
  const principles = []

  // Extract from character words
  const characterWords = (s6.characterWords || '').split(',').map(w => w.trim()).filter(Boolean)

  if (characterWords.includes('Modern')) {
    principles.push({
      name: 'Contemporary Expression',
      description: 'Clean lines, minimal ornamentation, and contemporary materials will define the architectural language.',
    })
  }

  if (characterWords.includes('Timeless')) {
    principles.push({
      name: 'Enduring Design',
      description: 'Design will employ classical proportions and quality materials that transcend trends.',
    })
  }

  if (characterWords.includes('Warm')) {
    principles.push({
      name: 'Warmth & Hospitality',
      description: 'Natural materials, warm color palettes, and inviting spatial qualities will create a welcoming environment.',
    })
  }

  if (characterWords.includes('Minimalist')) {
    principles.push({
      name: 'Refined Simplicity',
      description: 'Reduction of elements to essentials, emphasizing quality over quantity.',
    })
  }

  if (characterWords.includes('Sustainable')) {
    principles.push({
      name: 'Environmental Responsibility',
      description: 'Sustainable design practices, energy efficiency, and responsible material selection.',
    })
  }

  if (characterWords.includes('Luxurious')) {
    principles.push({
      name: 'Premium Quality',
      description: 'High-end materials, superior craftsmanship, and attention to detail throughout.',
    })
  }

  if (characterWords.includes('Serene')) {
    principles.push({
      name: 'Calm & Tranquility',
      description: 'Peaceful spatial qualities, natural light, and connection to nature.',
    })
  }

  if (characterWords.includes('Bold')) {
    principles.push({
      name: 'Confident Expression',
      description: 'Strong architectural gestures and distinctive design elements.',
    })
  }

  // Add default principles if none matched
  if (principles.length === 0) {
    principles.push({
      name: 'Quality & Functionality',
      description: 'Seamless integration of aesthetic excellence with practical functionality.',
    })
    principles.push({
      name: 'Site Responsiveness',
      description: 'Design that responds sensitively to site conditions and context.',
    })
  }

  return principles
}

/**
 * Generate architectural style recommendations
 */
function generateArchitecturalStyle(s4, s6, s7) {
  const characterWords = (s6.characterWords || '').split(',').map(w => w.trim()).filter(Boolean)
  const finishLevel = s4.finishLevel || 'Standard'

  let style = 'Contemporary Residential'
  let description = ''

  if (characterWords.includes('Modern') && characterWords.includes('Minimalist')) {
    style = 'Contemporary Minimalist'
    description = 'Clean geometric forms, minimal ornamentation, emphasis on material quality and craftsmanship.'
  } else if (characterWords.includes('Timeless') && characterWords.includes('Warm')) {
    style = 'Modern Vernacular'
    description = 'Contemporary interpretation of regional architectural traditions with warm, natural materials.'
  } else if (characterWords.includes('Bold') && characterWords.includes('Artistic')) {
    style = 'Architectural Expression'
    description = 'Distinctive design language with sculptural forms and confident spatial gestures.'
  } else if (characterWords.includes('Serene') && characterWords.includes('Sustainable')) {
    style = 'Eco-Conscious Contemporary'
    description = 'Sustainable design principles integrated with biophilic elements and natural aesthetics.'
  } else if (characterWords.includes('Luxurious')) {
    style = 'Premium Contemporary'
    description = 'High-end contemporary design with emphasis on superior materials and refined detailing.'
  } else {
    description = 'Contemporary residential architecture responsive to site, client lifestyle, and quality aspirations.'
  }

  return {
    style,
    description,
    finishLevel,
    qualityExpectation: getQualityExpectation(finishLevel),
  }
}

/**
 * Get quality expectations based on finish level
 */
function getQualityExpectation(finishLevel) {
  const expectations = {
    'Budget-conscious': 'Efficient design with practical material selections and standard finishes.',
    'Standard': 'Quality construction with good material selections and standard finishes throughout.',
    'Premium': 'High-quality materials, superior finishes, and attention to detail. Premium fixtures and fittings.',
    'High-end Architectural': 'Exceptional quality throughout. Premium materials, bespoke finishes, high-end fixtures. Meticulous craftsmanship.',
  }

  return expectations[finishLevel] || expectations['Standard']
}

/**
 * Generate material palette recommendations
 */
function generateMaterialPalette(s4, s6) {
  const characterWords = (s6.characterWords || '').split(',').map(w => w.trim()).filter(Boolean)
  const finishLevel = s4.finishLevel || 'Standard'

  const palette = {
    primary: [],
    secondary: [],
    accents: [],
  }

  // Determine material palette based on character and finish level
  if (characterWords.includes('Warm')) {
    palette.primary.push('Natural timber (warm tones)')
    palette.primary.push('Warm-toned stone or brick')
    palette.accents.push('Warm metals (brass, copper)')
  }

  if (characterWords.includes('Minimalist') || characterWords.includes('Modern')) {
    palette.primary.push('Concrete or polished plaster')
    palette.primary.push('Stainless steel or matte black metals')
    palette.secondary.push('White or neutral painted surfaces')
  }

  if (characterWords.includes('Luxurious')) {
    palette.primary.push('Premium hardwoods')
    palette.secondary.push('Natural stone (marble, granite)')
    palette.accents.push('Gold or polished brass fixtures')
  }

  if (characterWords.includes('Sustainable')) {
    palette.primary.push('Reclaimed or sustainably sourced timber')
    palette.secondary.push('Recycled or low-impact materials')
    palette.accents.push('Natural fiber textiles')
  }

  if (palette.primary.length === 0) {
    palette.primary.push('Quality timber or stone')
    palette.secondary.push('Neutral painted finishes')
    palette.accents.push('Brushed stainless steel')
  }

  return {
    primary: palette.primary,
    secondary: palette.secondary,
    accents: palette.accents,
    finishLevel,
  }
}

/**
 * Generate spatial analysis
 */
function generateSpatialAnalysis(s2, s3, s5) {
  const floorArea = parseInt(s2.floorArea) || 0
  const bedrooms = parseInt(s2.bedrooms) || 0
  const bathrooms = parseFloat(s2.bathrooms) || 0

  const analysis = {
    totalFloorArea: floorArea ? `${floorArea} m²` : 'To be determined',
    programSummary: `${bedrooms} bedrooms, ${bathrooms} bathrooms`,
    spatialStrategy: s3.layoutPreferences || 'To be determined',
    functionalZones: s3.functionalRequirements || 'Standard residential zones',
    outdoorProgram: s3.outdoorSpaces || 'To be developed',
  }

  if (floorArea > 0) {
    const areaPerBedroom = bedrooms > 0 ? (floorArea / bedrooms).toFixed(0) : 0
    analysis.areaPerBedroom = `${areaPerBedroom} m² per bedroom`

    if (floorArea < 200) {
      analysis.typeDescription = 'Compact residential'
    } else if (floorArea < 350) {
      analysis.typeDescription = 'Medium-scale residential'
    } else if (floorArea < 500) {
      analysis.typeDescription = 'Large residential'
    } else {
      analysis.typeDescription = 'Substantial residential'
    }
  }

  return analysis
}

/**
 * Generate key design moves
 */
function generateKeyDesignMoves(s3, s5, s6) {
  const moves = []

  if (s3.layoutPreferences) {
    moves.push({
      category: 'Spatial Organization',
      description: s3.layoutPreferences,
    })
  }

  if (s5.mustHaves) {
    moves.push({
      category: 'Functional Requirements',
      description: s5.mustHaves,
    })
  }

  if (s3.outdoorSpaces) {
    moves.push({
      category: 'Outdoor Integration',
      description: s3.outdoorSpaces,
    })
  }

  if (s5.nonNegotiables) {
    moves.push({
      category: 'Site Constraints & Opportunities',
      description: s5.nonNegotiables,
    })
  }

  return moves
}

/**
 * Generate enhanced property overview
 */
function generateEnhancedPropertyOverview(s1, s2) {
  return {
    address: s1.address,
    lotDp: s1.lotDp,
    intendedUse: s1.intendedUse,
    ownershipStage: s1.ownershipStage,
    familyDescription: s1.familyDescription,
    projectType: s2.projectType,
    scope: `${s2.bedrooms || '?'} bedrooms, ${s2.bathrooms || '?'} bathrooms, ${s2.floorArea || '?'} m²`,
  }
}

/**
 * Generate enhanced project requirements
 */
function generateEnhancedProjectRequirements(s2, s3) {
  return {
    scope: {
      projectType: s2.projectType,
      floorArea: s2.floorArea ? `${s2.floorArea} m²` : 'Not specified',
      bedrooms: s2.bedrooms,
      bathrooms: s2.bathrooms,
    },
    spatial: {
      layoutPreferences: s3.layoutPreferences,
      functionalRequirements: s3.functionalRequirements,
      outdoorSpaces: s3.outdoorSpaces,
    },
  }
}

/**
 * Generate enhanced design direction
 */
function generateEnhancedDesignDirection(s4, s6, s7) {
  return {
    finishLevel: s4.finishLevel,
    benchmarkReference: s4.benchmarkReference,
    characterWords: s6.characterWords,
    inspirationLinks: s7.inspirationLinks,
    inspirationNotes: s7.inspirationNotes,
  }
}

/**
 * Generate enhanced constraints section
 */
function generateEnhancedConstraints(s5) {
  return {
    mustHaves: s5.mustHaves,
    nonNegotiables: s5.nonNegotiables,
    siteConstraints: s5.constraints,
  }
}

/**
 * Generate enhanced budget and timeline
 */
function generateEnhancedBudgetTimeline(s8) {
  return {
    estimatedBudget: s8.budget ? `$${parseInt(s8.budget).toLocaleString()}` : 'Not specified',
    preferredTimeline: s8.timeline,
    additionalNotes: s8.additionalNotes,
  }
}

/**
 * Generate comprehensive HTML brief
 */
function generateEnhancedBriefHTML(surveyData) {
  const s1 = surveyData.section1 || {}
  const s2 = surveyData.section2 || {}
  const s3 = surveyData.section3 || {}
  const s4 = surveyData.section4 || {}
  const s5 = surveyData.section5 || {}
  const s6 = surveyData.section6 || {}
  const s7 = surveyData.section7 || {}
  const s8 = surveyData.section8 || {}

  // Generate all components directly instead of calling generateEnhancedBrief
  const designPrinciples = generateDesignPrinciples(s4, s6, s7)
  const architecturalStyle = generateArchitecturalStyle(s4, s6, s7)
  const materialPalette = generateMaterialPalette(s4, s6)
  const spatialAnalysis = generateSpatialAnalysis(s2, s3, s5)
  const designStrategy = generateDesignStrategy(s3, s4, s5, s6, s7)
  const keyDesignMoves = generateKeyDesignMoves(s3, s5, s6)
  const executiveSummary = generateEnhancedExecutiveSummary(s1, s2, s3, s4, s5, s6, s8)
  const propertyOverview = generateEnhancedPropertyOverview(s1, s2)
  const projectRequirements = generateEnhancedProjectRequirements(s2, s3)
  const designDirection = generateEnhancedDesignDirection(s4, s6, s7)
  const constraints = generateEnhancedConstraints(s5)
  const budgetTimeline = generateEnhancedBudgetTimeline(s8)


  const principlesHTML = designPrinciples
    .map(
      (p) => `
    <div class="principle-card">
      <h4>${p.name}</h4>
      <p>${p.description}</p>
    </div>
  `
    )
    .join('')

  const materialHTML = `
    <div class="material-section">
      <h4>Primary Materials</h4>
      <ul>
        ${materialPalette.primary.map((m) => `<li>${m}</li>`).join('')}
      </ul>
      ${materialPalette.secondary.length > 0 ? `
      <h4>Secondary Materials</h4>
      <ul>
        ${materialPalette.secondary.map((m) => `<li>${m}</li>`).join('')}
      </ul>
      ` : ''}
      ${materialPalette.accents.length > 0 ? `
      <h4>Accent Materials & Finishes</h4>
      <ul>
        ${materialPalette.accents.map((m) => `<li>${m}</li>`).join('')}
      </ul>
      ` : ''}
    </div>
  `

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 3px solid #1B6B5C; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 10px 0; color: #1B6B5C; font-size: 28px; }
    .header p { margin: 5px 0; color: #666; font-size: 14px; }
    .section { margin-bottom: 40px; }
    .section h2 { color: #1B6B5C; font-size: 22px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
    .section h3 { color: #1B6B5C; font-size: 16px; margin-top: 15px; margin-bottom: 10px; }
    .section h4 { color: #1B6B5C; font-size: 14px; margin-top: 12px; margin-bottom: 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #1B6B5C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { color: #555; margin-top: 4px; font-size: 15px; line-height: 1.5; }
    .summary-box { background: #f5f5f5; border-left: 4px solid #1B6B5C; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
    .summary-box p { margin: 0; color: #555; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .principle-card { background: #f9f9f9; border: 1px solid #e0e0e0; padding: 15px; margin-bottom: 12px; border-radius: 4px; }
    .principle-card h4 { margin-top: 0; color: #1B6B5C; }
    .principle-card p { margin: 8px 0 0 0; font-size: 14px; }
    .material-section { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 15px; }
    .material-section ul { margin-left: 20px; margin-top: 8px; }
    .material-section li { margin-bottom: 6px; font-size: 14px; }
    .style-box { background: #f0f8f6; border-left: 4px solid #1B6B5C; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
    .style-box h3 { margin-top: 0; }
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
        <p>${executiveSummary.summary}</p>
      </div>
    </div>

    <div class="section">
      <h2>Design Strategy</h2>
      <div class="field">
        <div class="label">Overview</div>
        <div class="value">${designStrategy.overview}</div>
      </div>
      <div class="field">
        <div class="label">Spatial Organization</div>
        <div class="value">${designStrategy.spatialOrganization}</div>
      </div>
      <div class="field">
        <div class="label">Functional Zoning</div>
        <div class="value">${designStrategy.functionalZoning}</div>
      </div>
      <div class="field">
        <div class="label">Outdoor Integration</div>
        <div class="value">${designStrategy.outdoorIntegration}</div>
      </div>
      ${designStrategy.keyPriorities && designStrategy.keyPriorities.length > 0 ? `
      <div class="field">
        <div class="label">Key Priorities</div>
        <ul style="margin-left: 20px; margin-top: 8px;">
          ${designStrategy.keyPriorities.map((p) => `<li>${p}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2>Design Principles</h2>
      <p>The following core principles will guide the design development:</p>
      ${principlesHTML}
    </div>

    <div class="section">
      <h2>Architectural Style & Quality</h2>
      <div class="style-box">
        <h3>${architecturalStyle.style}</h3>
        <p>${architecturalStyle.description}</p>
        <p><strong>Quality Level:</strong> ${architecturalStyle.qualityExpectation}</p>
      </div>
    </div>

    <div class="section">
      <h2>Material Palette</h2>
      ${materialHTML}
    </div>

    <div class="section">
      <h2>Spatial Analysis</h2>
      <div class="grid">
        <div class="field">
          <div class="label">Total Floor Area</div>
          <div class="value">${spatialAnalysis.totalFloorArea}</div>
        </div>
        <div class="field">
          <div class="label">Program Summary</div>
          <div class="value">${spatialAnalysis.programSummary}</div>
        </div>
      </div>
      ${spatialAnalysis.typeDescription ? `
      <div class="field">
        <div class="label">Project Type</div>
        <div class="value">${spatialAnalysis.typeDescription}</div>
      </div>
      ` : ''}
      ${spatialAnalysis.areaPerBedroom ? `
      <div class="field">
        <div class="label">Area per Bedroom</div>
        <div class="value">${spatialAnalysis.areaPerBedroom}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">Spatial Strategy</div>
        <div class="value">${spatialAnalysis.spatialStrategy}</div>
      </div>
      <div class="field">
        <div class="label">Functional Zones</div>
        <div class="value">${spatialAnalysis.functionalZones}</div>
      </div>
      <div class="field">
        <div class="label">Outdoor Program</div>
        <div class="value">${spatialAnalysis.outdoorProgram}</div>
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
        <div class="value">${s1.familyDescription || 'Not provided'}</div>
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
      <h2>Design Direction & References</h2>
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
      ${s7.inspirationNotes ? `
      <div class="field">
        <div class="label">Inspiration Notes</div>
        <div class="value">${s7.inspirationNotes}</div>
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
      <p>This comprehensive project brief was automatically generated from the Line & Light Studio Project Brief Intake form.</p>
      <p>It establishes the foundation for detailed design development and consultation.</p>
      <p>For questions or clarifications, please contact the studio directly.</p>
    </div>
  </div>
</body>
</html>
  `
}
