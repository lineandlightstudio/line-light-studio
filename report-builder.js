/**
 * Report Builder - Generates professional feasibility reports
 * Line & Light Studio — Residential Drafting and Building Design
 * 
 * Generates two HTML versions:
 *   - Internal (includes cost guide section)
 *   - Client (excludes cost guide section)
 */

import { getLogoDataURI, getBackgroundDataURI } from './brand-assets.js'

/**
 * Build a complete feasibility report from survey data, geocoding, and hazard research
 */
export function buildFeasibilityReport(surveyData, coords, hazardResearch) {
  const s1 = surveyData.section1 || {}
  const s2 = surveyData.section2 || {}
  const s3 = surveyData.section3 || {}
  const s4 = surveyData.section4 || {}
  const s5 = surveyData.section5 || {}
  const s6 = surveyData.section6 || {}
  const s7 = surveyData.section7 || {}
  const s8 = surveyData.section8 || {}

  const clientName = s1.clientName || 'the Client'
  const address = s1.address || 'Address not provided'

  // Build cost guide
  const costGuide = buildCostGuide(s2, s3, s4, s5, hazardResearch)

  // Build the report object
  const report = {
    coverPage: {
      title: `Feasibility Report prepared for ${clientName}`,
      address: address,
      date: new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }),
    },

    introduction: buildIntroduction(clientName, address),

    clientBrief: buildClientBrief(s1, s2, s3, s4, s5, s6, s7, s8),

    siteDescription: buildSiteDescription(s1, coords, hazardResearch),

    siteContext: buildSiteContext(coords, address),

    planningReport: buildPlanningReport(hazardResearch, coords),

    costGuide: costGuide,

    hazardAssessment: buildHazardAssessment(hazardResearch),

    regulatoryControls: buildRegulatoryControls(hazardResearch),

    dataSources: hazardResearch?.dataSources || {},

    html: null,       // Internal version (with costs)
    htmlClient: null,  // Client version (without costs)
  }

  // Generate both HTML versions
  report.html = generateReportHTML(report, s1, coords, false)         // Internal
  report.htmlClient = generateReportHTML(report, s1, coords, true)    // Client

  return report
}

/**
 * Introduction section
 */
function buildIntroduction(clientName, address) {
  return `This feasibility report has been prepared for ${clientName} to explore the design and planning potential of the property at ${address}. The purpose of this document is to outline the due diligence undertaken, confirm alignment with relevant planning controls, and provide an informed foundation from which to progress the project with confidence.

This report examines the site context, known hazards, applicable planning instruments, and provides a general cost guide based on the project scope and finish level described. It is intended as a starting point for informed decision-making and should be read in conjunction with any specialist reports recommended herein.`
}

/**
 * Client Brief - written as flowing prose
 */
function buildClientBrief(s1, s2, s3, s4, s5, s6, s7, s8) {
  const parts = []

  const clientName = s1.clientName || 'The client'
  const familyDesc = s1.familyDescription || s1.family || ''
  const intendedUse = s1.intendedUse || 'a new home'
  const ownershipStage = s1.ownershipStage || ''

  let opening = `${clientName}`
  if (familyDesc) opening += ` (${familyDesc})`
  if (intendedUse === 'Primary Residence') {
    opening += ` is seeking to create a primary residence`
  } else if (intendedUse === 'Holiday Home') {
    opening += ` is seeking to design a holiday home`
  } else if (intendedUse === 'Investment Property') {
    opening += ` is seeking to develop an investment property`
  } else {
    opening += ` is seeking to develop a ${intendedUse || 'residential property'}`
  }
  opening += ` at ${s1.address || 'the subject site'}.`
  if (ownershipStage) opening += ` The property is currently at the "${ownershipStage}" stage.`
  parts.push(opening)

  // Project scope
  const projectType = s2.projectType || ''
  const floorArea = s2.floorArea || ''
  const bedrooms = s2.bedrooms || ''
  const bathrooms = s2.bathrooms || ''

  let scope = ''
  if (projectType) {
    scope += `The project involves a ${projectType.toLowerCase()}`
  } else {
    scope += 'The project involves a new residential dwelling'
  }
  if (floorArea) scope += ` with a desired floor area of approximately ${floorArea}m²`
  if (bedrooms || bathrooms) {
    scope += ', comprising'
    if (bedrooms) scope += ` ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}`
    if (bedrooms && bathrooms) scope += ' and'
    if (bathrooms) scope += ` ${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}`
  }
  scope += '.'
  parts.push(scope)

  if (s3.layoutPreferences) {
    parts.push(`In terms of layout, the client has expressed a preference for ${s3.layoutPreferences.toLowerCase().replace(/^\w/, c => c.toUpperCase())}.`)
  }
  if (s3.functionalRequirements) {
    parts.push(`Key functional requirements include ${s3.functionalRequirements}.`)
  }
  if (s3.outdoorSpaces) {
    parts.push(`For outdoor living, the brief calls for ${s3.outdoorSpaces}.`)
  }

  const characterWords = s6.characterWords || ''
  const finishLevel = s4.finishLevel || ''
  if (characterWords || finishLevel) {
    let designDesc = 'The design character is described as'
    if (characterWords) designDesc += ` "${characterWords}"`
    if (finishLevel) {
      if (characterWords) designDesc += ','
      designDesc += ` with a ${finishLevel.toLowerCase()} finish level`
    }
    designDesc += '.'
    parts.push(designDesc)
  }
  if (s4.benchmarkReference) {
    parts.push(`The client has referenced the following as a benchmark for quality: ${s4.benchmarkReference}.`)
  }

  if (s5.mustHaves) parts.push(`Critical must-haves for this project include: ${s5.mustHaves}.`)
  if (s5.nonNegotiables) parts.push(`Non-negotiable requirements are: ${s5.nonNegotiables}.`)
  if (s5.constraints) parts.push(`Known site constraints include: ${s5.constraints}.`)

  if (s7.inspirationNotes) parts.push(`The client has noted the following design inspiration: ${s7.inspirationNotes}.`)

  if (s8.budget) {
    const budgetFormatted = '$' + parseInt(s8.budget).toLocaleString()
    parts.push(`The project budget has been identified as ${budgetFormatted}.`)
  }
  if (s8.timeline) parts.push(`The preferred timeline is ${s8.timeline}.`)
  if (s8.additionalNotes) parts.push(`Additional notes: ${s8.additionalNotes}.`)

  return parts.join('\n\n')
}

/**
 * Site Description
 */
function buildSiteDescription(s1, coords, hazardResearch) {
  const address = s1.address || 'the subject site'
  const lotDp = s1.lotDp || ''

  let desc = `The subject site is located at ${address}`
  if (lotDp) desc += ` (${lotDp})`
  desc += '.'

  if (coords && coords.displayName) {
    desc += ` The property has been identified and geocoded to coordinates ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}.`
  }

  // Add zoning info from new hazard research structure
  if (hazardResearch && hazardResearch.planning) {
    const z = hazardResearch.planning.zoning
    if (z && z.zone && z.zone !== 'Not available' && z.zone !== 'Query failed') {
      desc += ` The property is zoned ${z.zone}`
      if (z.epiName) desc += ` under the ${z.epiName}`
      desc += '.'
    }
  }

  desc += '\n\nA detailed site survey should be obtained to confirm exact dimensions, levels, and any easements or encumbrances affecting the property. The site description above is based on available mapping data and should be verified by a registered surveyor prior to design development.'

  return desc
}

/**
 * Site Context
 */
function buildSiteContext(coords, address) {
  const addressParts = address.split(',').map(p => p.trim())
  let suburb = ''
  let state = 'NSW'

  for (const part of addressParts) {
    if (part.match(/NSW|QLD|VIC|SA|WA|TAS|NT|ACT/)) {
      const match = part.match(/^(.+?)\s+(NSW|QLD|VIC|SA|WA|TAS|NT|ACT)\s*(\d{4})?$/)
      if (match) {
        suburb = match[1].trim()
        state = match[2]
      }
    }
  }

  if (!suburb && coords && coords.displayName) {
    const parts = coords.displayName.split(',').map(p => p.trim())
    if (parts.length > 2) suburb = parts[1] || parts[0]
  }

  if (!suburb) suburb = 'the surrounding area'

  let context = `The property is situated in ${suburb}, ${state}. `
  context += `The surrounding context should be confirmed through a site visit and review of the local character. Factors to consider include the prevailing building typology, setback patterns, landscaping character, and any notable features of the streetscape.\n\n`
  context += `Zoning and development controls should be confirmed via the relevant local council and the NSW Planning Portal (planningportal.nsw.gov.au). Real estate trends and local amenities should be considered in the context of the project's intended use and long-term value.`

  return context
}

/**
 * Planning Report — uses new hazard research data structure
 */
function buildPlanningReport(hazardResearch, coords) {
  const sections = []

  sections.push('The following planning information has been compiled from official NSW Government data sources. All controls should be confirmed with the relevant local council and the NSW Planning Portal prior to lodging a development application.')

  if (hazardResearch) {
    // Zoning
    const z = hazardResearch.planning?.zoning
    if (z && z.zone && z.zone !== 'Not available' && z.zone !== 'Query failed') {
      sections.push(`**Zoning:** The property is zoned **${z.zone}**${z.epiName ? ` under the ${z.epiName}` : ''}. Permissible uses and development standards should be confirmed via the relevant LEP and the NSW Planning Portal.`)
    } else {
      sections.push(`**Zoning:** The land zoning should be confirmed via the relevant Local Environmental Plan (LEP) and the NSW Planning Portal.`)
    }

    // Height
    const h = hazardResearch.planning?.height
    if (h && h.maxHeight && h.maxHeight !== 'Not available' && h.maxHeight !== 'Query failed') {
      sections.push(`**Height of Building:** The maximum building height applicable to this site is **${h.maxHeight}**${h.epiName ? ` (${h.epiName})` : ''}. This is measured from existing ground level.`)
    } else {
      sections.push(`**Height of Building:** The maximum building height should be confirmed via the relevant LEP.`)
    }

    // FSR
    const f = hazardResearch.planning?.fsr
    if (f && f.maxFSR && f.maxFSR !== 'Not available' && f.maxFSR !== 'Query failed') {
      sections.push(`**Floor Space Ratio (FSR):** The maximum FSR applicable to this site is **${f.maxFSR}**${f.epiName ? ` (${f.epiName})` : ''}. FSR is the ratio of total gross floor area to site area.`)
    } else {
      sections.push(`**Floor Space Ratio (FSR):** The maximum FSR should be confirmed via the relevant LEP.`)
    }

    // Bushfire — from RFS BFPL
    if (hazardResearch.bushfire) {
      const bf = hazardResearch.bushfire
      if (bf.inBushfireZone) {
        const cat = bf.categoryDescription || `Category ${bf.category}`
        sections.push(`**Bushfire Prone Land:** The property has been identified as **${cat}** on the NSW RFS Bush Fire Prone Land Map (Certified BFPL data, confidence: ${bf.confidence || 'HIGH'}). ${bf.balNote || ''} Development on bushfire-prone land is subject to the requirements of Planning for Bush Fire Protection 2019 (PBP 2019) and AS 3959 – Construction of Buildings in Bushfire-Prone Areas. A Bushfire Attack Level (BAL) assessment will be required, and construction methods must comply with the determined BAL rating. Asset Protection Zones (APZs) and vegetation management may also be required.`)
      } else if (bf.status === 'NOT_BUSHFIRE_PRONE') {
        sections.push(`**Bushfire Prone Land:** Based on the NSW RFS Bush Fire Prone Land Map (Certified BFPL data, confidence: ${bf.confidence || 'HIGH'}), the property is **not within designated bushfire-prone land**. This should be confirmed with the NSW Rural Fire Service (RFS) and the relevant council.`)
      } else {
        sections.push(`**Bushfire Prone Land:** Bushfire status could not be determined from available data (${bf.status || 'unknown'}). ${bf.note || 'A bushfire certificate should be obtained from the relevant council or RFS.'}`)
      }
    }

    // Flood
    if (hazardResearch.flood) {
      const fl = hazardResearch.flood
      if (fl.inFloodZone) {
        sections.push(`**Flood Prone Land:** The property has been identified as **${fl.classification || 'Flood Planning Area'}**${fl.epiName ? ` under ${fl.epiName}` : ''}${fl.lgaName ? ` (${fl.lgaName})` : ''} (confidence: ${fl.confidence || 'HIGH'}). A flood risk assessment may be required as part of any development application. Minimum floor levels and flood-compatible construction methods may be mandated.`)
      } else if (fl.status === 'NO_DATA_FOUND') {
        sections.push(`**Flood Prone Land:** ${fl.note || 'No flood planning data was returned for this location. A flood certificate should be obtained from the relevant council to confirm.'}`)
      } else if (fl.status === 'QUERY_FAILED') {
        sections.push(`**Flood Prone Land:** Flood status could not be determined from available data. A flood certificate should be obtained from the relevant council.`)
      } else {
        sections.push(`**Flood Prone Land:** Based on available mapping data, the property does not appear to be within a designated flood-prone area. This should be confirmed with the relevant council.`)
      }
    }

    // Heritage
    if (hazardResearch.heritage) {
      const her = hazardResearch.heritage
      if (her.isHeritageListed) {
        sections.push(`**Heritage:** The property has been identified as **${her.classification || 'Heritage Listed'}**${her.epiName ? ` under ${her.epiName}` : ''}${her.lgaName ? ` (${her.lgaName})` : ''} (confidence: ${her.confidence || 'HIGH'}). A heritage impact assessment may be required. Development proposals should be sympathetic to the heritage character.`)
      } else if (her.status === 'NOT_HERITAGE_LISTED') {
        sections.push(`**Heritage:** Based on NSW EPI Heritage data (confidence: ${her.confidence || 'HIGH'}), the property does **not appear to be heritage listed**. Heritage status should be confirmed with the relevant council LEP heritage schedule.`)
      } else {
        sections.push(`**Heritage:** Heritage status could not be determined from available data. The relevant council LEP heritage schedule should be consulted.`)
      }
    }
  }

  sections.push(`**Minimum Lot Size:** The minimum lot size for subdivision and development should be confirmed via the relevant LEP.`)
  sections.push(`**Acid Sulfate Soils:** The acid sulfate soils classification should be confirmed via the relevant LEP mapping. Classes 1-4 may require an acid sulfate soils management plan for certain works.`)

  return sections.join('\n\n')
}

/**
 * Cost Guide
 */
function buildCostGuide(s2, s3, s4, s5, hazardResearch) {
  const floorArea = parseInt(s2.floorArea) || 0
  const finishLevel = s4.finishLevel || 'Standard'

  // Base rates per m² (updated March 2026)
  const rates = {
    'Budget-conscious': { rate: 2500, label: 'Standard' },
    'Standard': { rate: 3000, label: 'High' },
    'Premium': { rate: 3500, label: 'Luxury' },
    'High-end Architectural': { rate: 4500, label: 'Architectural' },
  }

  const selectedRate = rates[finishLevel] || rates['Standard']
  let baseRate = selectedRate.rate
  let adjustments = []
  let totalMultiplier = 1.0

  // Check for BAL 40+ (bushfire)
  if (hazardResearch && hazardResearch.bushfire && hazardResearch.bushfire.inBushfireZone) {
    const cat = hazardResearch.bushfire.category
    if (cat === 1) {
      adjustments.push({ reason: 'Vegetation Category 1 — high bushfire construction requirements (likely BAL-29 to BAL-FZ)', increase: 15 })
      totalMultiplier += 0.15
    } else {
      adjustments.push({ reason: 'Bushfire prone land — BAL-compliant construction required', increase: 10 })
      totalMultiplier += 0.10
    }
  }

  // Check for sloped site
  const constraints = (s5.constraints || '').toLowerCase()
  if (constraints.includes('slope') || constraints.includes('steep') || constraints.includes('fall') || constraints.includes('gradient')) {
    adjustments.push({ reason: 'Highly sloped site (additional earthworks, retaining, foundations)', increase: 10 })
    totalMultiplier += 0.10
  }

  // Check for expensive construction details
  const allText = [
    s3 ? s3.layoutPreferences : '',
    s3 ? s3.functionalRequirements : '',
    s5.mustHaves || '',
    s5.nonNegotiables || '',
    s4.benchmarkReference || '',
  ].join(' ').toLowerCase()

  const expensiveDetails = []
  if (allText.includes('raked ceiling') || allText.includes('cathedral ceiling') || allText.includes('vaulted')) {
    expensiveDetails.push('raked/cathedral ceilings')
  }
  if (allText.includes('steel frame') || allText.includes('steel structure')) {
    expensiveDetails.push('steel framing')
  }
  if (allText.includes('cantilever') || allText.includes('cantilevered')) {
    expensiveDetails.push('cantilevered elements')
  }
  if (allText.includes('basement') || allText.includes('underground')) {
    expensiveDetails.push('basement construction')
  }
  if (allText.includes('pool') || allText.includes('swimming')) {
    expensiveDetails.push('swimming pool')
  }

  if (expensiveDetails.length > 0) {
    adjustments.push({
      reason: `Expensive construction details (${expensiveDetails.join(', ')})`,
      increase: 10 * Math.min(expensiveDetails.length, 3),
    })
    totalMultiplier += 0.10 * Math.min(expensiveDetails.length, 3)
  }

  const adjustedRate = Math.round(baseRate * totalMultiplier)
  const estimatedCost = floorArea > 0 ? floorArea * adjustedRate : 0
  const lowEstimate = floorArea > 0 ? Math.round(floorArea * adjustedRate * 0.9) : 0
  const highEstimate = floorArea > 0 ? Math.round(floorArea * adjustedRate * 1.15) : 0

  return {
    finishLevel,
    finishLabel: selectedRate.label,
    baseRate,
    adjustments,
    totalMultiplier,
    adjustedRate,
    floorArea,
    estimatedCost,
    lowEstimate,
    highEstimate,
    rateTable: [
      { level: 'Standard', rate: 2500, description: 'Standard residential construction' },
      { level: 'High', rate: 3000, description: 'Above-average finishes and detailing' },
      { level: 'Luxury', rate: 3500, description: 'Premium materials and custom joinery' },
      { level: 'Architectural', rate: 4500, description: 'Bespoke design, premium everything' },
    ],
    notes: [
      'All figures are indicative only and based on current market rates for the NSW residential construction sector.',
      'Actual costs will depend on detailed design, site conditions, market conditions at time of tender, and builder selection.',
      'Figures exclude professional fees (architect, engineer, surveyor), council fees, and landscaping unless otherwise noted.',
      'A quantity surveyor cost estimate is recommended prior to finalising the budget.',
    ],
  }
}

/**
 * Hazard Assessment section — uses new data structure
 */
function buildHazardAssessment(hazardResearch) {
  if (!hazardResearch || hazardResearch.error) {
    return {
      status: 'INCOMPLETE',
      overallRisk: 'UNKNOWN',
      summary: 'Hazard research could not be completed. Manual investigation is required.',
      hazards: [],
      hazardCount: 0,
    }
  }

  const hazards = []
  let overallRisk = 'LOW'

  if (hazardResearch.flood && hazardResearch.flood.inFloodZone) {
    hazards.push({
      type: 'Flood',
      severity: 'HIGH',
      description: `Property is within a flood-prone area (${hazardResearch.flood.classification || 'Flood Planning Area'}).`,
      source: hazardResearch.flood.dataSource || 'NSW Planning Portal',
      confidence: hazardResearch.flood.confidence || 'HIGH',
      implications: [
        'Flood risk assessment required',
        'Minimum habitable floor levels may be mandated',
        'Flood-compatible construction methods required',
        'Increased insurance costs likely',
        'Council conditions may restrict ground-level habitable rooms',
      ],
      mitigation: [
        'Obtain flood certificate from council',
        'Engage flood engineer for detailed assessment',
        'Design with elevated floor levels',
        'Use flood-resistant materials below flood planning level',
      ],
    })
    overallRisk = 'HIGH'
  }

  if (hazardResearch.bushfire && hazardResearch.bushfire.inBushfireZone) {
    const cat = hazardResearch.bushfire.categoryDescription || `Category ${hazardResearch.bushfire.category}`
    hazards.push({
      type: 'Bushfire',
      severity: hazardResearch.bushfire.riskLevel || 'HIGH',
      description: `Property is within bushfire-prone land — ${cat}.`,
      source: hazardResearch.bushfire.dataSource || 'NSW RFS Bush Fire Prone Land',
      confidence: hazardResearch.bushfire.confidence || 'HIGH',
      implications: [
        'BAL assessment required under PBP 2019',
        'Construction must comply with AS 3959',
        'Asset Protection Zones (APZs) may be required',
        'Vegetation management obligations',
        `${hazardResearch.bushfire.balNote || 'Increased construction costs likely'}`,
        'Ongoing maintenance obligations',
      ],
      mitigation: [
        'Engage accredited bushfire consultant',
        'Obtain BAL assessment before design development',
        'Design to meet or exceed required BAL rating',
        'Implement required vegetation clearance zones',
        'Budget for bushfire-compliant construction',
      ],
    })
    overallRisk = 'HIGH'
  }

  if (hazardResearch.heritage && hazardResearch.heritage.isHeritageListed) {
    hazards.push({
      type: 'Heritage',
      severity: 'MEDIUM',
      description: `Property is heritage listed (${hazardResearch.heritage.classification || 'Heritage'}).`,
      source: hazardResearch.heritage.dataSource || 'NSW EPI Heritage',
      confidence: hazardResearch.heritage.confidence || 'HIGH',
      implications: [
        'Heritage impact assessment may be required',
        'Restrictions on external alterations and demolition',
        'Extended approval timelines',
        'Design must be sympathetic to heritage character',
      ],
      mitigation: [
        'Engage heritage consultant early',
        'Prepare heritage impact statement',
        'Design to respect heritage character while meeting client brief',
      ],
    })
    if (overallRisk === 'LOW') overallRisk = 'MEDIUM'
  }

  return {
    status: 'COMPLETE',
    overallRisk,
    hazardCount: hazards.length,
    hazards,
    summary: hazards.length === 0
      ? 'Based on available mapping data, no major hazards have been identified affecting this property. All findings should be confirmed with the relevant council.'
      : `${hazards.length} hazard(s) identified affecting this property. Specialist assessment is recommended before proceeding with design development.`,
    sixmapsLink: hazardResearch.sixmapsLink || '',
  }
}

/**
 * Regulatory Controls
 */
function buildRegulatoryControls(hazardResearch) {
  return {
    intro: 'The following regulatory instruments are likely to apply to development on this site. All controls should be confirmed with the relevant council prior to lodging a development application.',
    lep: {
      title: 'Local Environmental Plan (LEP)',
      items: [
        'Part 2 – Permitted and Prohibited Development (confirm zoning and permissible uses)',
        'Part 4 – Principal Development Standards (height, FSR, minimum lot size)',
        'Part 5 – Miscellaneous Provisions (heritage, acid sulfate soils, earthworks)',
        'Part 6 – Additional Local Provisions (as applicable)',
      ],
    },
    dcp: {
      title: 'Development Control Plan (DCP)',
      items: [
        'Residential development controls (site coverage, setbacks, landscaping)',
        'Building setbacks (front, side, rear)',
        'Private open space requirements',
        'Solar access and overshadowing controls',
        'Car parking requirements',
        'Stormwater management',
      ],
    },
    ncc: {
      title: 'National Construction Code (NCC)',
      items: [
        'NCC 2022 Volume Two – Housing Provisions',
        'NCC 2022 Volume Three – Plumbing Code of Australia',
        'Design and Building Practitioners Act 2020 (NSW)',
        'NCC Volume Two Part 3.10 – Livable Housing Design (Silver Level minimum)',
      ],
    },
    standards: {
      title: 'Key Australian Standards',
      items: [
        'AS 2870 – Residential slabs and footings',
        'AS 1684 series – Residential timber-framed construction',
        'AS 3600 – Concrete structures',
        'AS 3700 – Masonry structures',
        'AS 3740 – Waterproofing of domestic wet areas',
        'AS 2047 – Windows and external glazed doors',
        'AS 1288 – Glass in buildings',
        'AS 4055 – Wind loads for housing',
        'AS/NZS 3500 series – Plumbing and drainage',
        'AS/NZS 3000 – Electrical installations (Wiring Rules)',
        'AS 3660 series – Termite management',
      ],
    },
    bushfireStandards: hazardResearch && hazardResearch.bushfire && hazardResearch.bushfire.inBushfireZone
      ? {
          title: 'Bushfire-Specific Standards',
          items: [
            'AS 3959 – Construction of buildings in bushfire-prone areas',
            'Planning for Bush Fire Protection 2019 (PBP 2019)',
          ],
        }
      : null,
  }
}

/**
 * Generate the complete HTML report
 * @param {boolean} isClientVersion - if true, excludes cost guide section
 */
function generateReportHTML(report, s1, coords, isClientVersion = false) {
  const clientName = s1.clientName || 'the Client'
  const address = s1.address || 'Address not provided'
  const costGuide = report.costGuide
  const hazards = report.hazardAssessment
  const regulatory = report.regulatoryControls

  const logoURI = getLogoDataURI()
  const bgURI = getBackgroundDataURI()

  // Cost adjustments HTML (only for internal)
  let costSectionHTML = ''
  if (!isClientVersion) {
    let adjustmentsHTML = ''
    if (costGuide.adjustments.length > 0) {
      adjustmentsHTML = `
        <div class="subsection">
          <h3>Cost Adjustments Applied</h3>
          <table>
            <thead><tr><th>Adjustment</th><th>Increase</th></tr></thead>
            <tbody>
              ${costGuide.adjustments.map(a => `<tr><td>${a.reason}</td><td>+${a.increase}%</td></tr>`).join('')}
            </tbody>
          </table>
        </div>`
    }

    const rateTableHTML = costGuide.rateTable.map(r => `
      <tr>
        <td>${r.level}</td>
        <td>$${r.rate.toLocaleString()}/m²</td>
        <td>${r.description}</td>
      </tr>
    `).join('')

    costSectionHTML = `
    <!-- COST GUIDE (Internal Only) -->
    <h2>${isClientVersion ? '' : `${sectionNum(6, isClientVersion)}. `}Cost Guide</h2>

    <div class="subsection">
      <h3>Construction Rate Guide</h3>
      <table>
        <thead><tr><th>Finish Level</th><th>Rate per m²</th><th>Description</th></tr></thead>
        <tbody>${rateTableHTML}</tbody>
      </table>
    </div>

    <div class="highlight-box">
      <p><strong>Selected finish level:</strong> ${costGuide.finishLevel} (${costGuide.finishLabel}) — Base rate: $${costGuide.baseRate.toLocaleString()}/m²</p>
      ${costGuide.adjustments.length > 0 ? `<p><strong>Adjusted rate:</strong> $${costGuide.adjustedRate.toLocaleString()}/m² (after ${costGuide.adjustments.map(a => `+${a.increase}%`).join(', ')} adjustments)</p>` : ''}
    </div>

    ${adjustmentsHTML}

    ${costGuide.floorArea > 0 ? `
    <div class="cost-summary">
      <div class="label">Estimated Construction Cost</div>
      <div class="amount">$${costGuide.estimatedCost.toLocaleString()}</div>
      <div class="range">Range: $${costGuide.lowEstimate.toLocaleString()} — $${costGuide.highEstimate.toLocaleString()}</div>
      <div class="range" style="margin-top: 4px;">${costGuide.floorArea}m² × $${costGuide.adjustedRate.toLocaleString()}/m²</div>
    </div>
    ` : '<p>Floor area not specified — unable to calculate estimated construction cost.</p>'}

    <div class="notes">
      <ul>
        ${costGuide.notes.map(n => `<li>${n}</li>`).join('')}
      </ul>
    </div>`
  }

  // Hazards HTML
  let hazardsHTML = ''
  if (hazards.hazards && hazards.hazards.length > 0) {
    hazardsHTML = hazards.hazards.map(h => `
      <div class="hazard-card hazard-${h.severity.toLowerCase()}">
        <div class="hazard-header">
          <h3>${h.type} — ${h.severity} Risk</h3>
          <span class="confidence-badge">Confidence: ${h.confidence || 'HIGH'}</span>
        </div>
        <p>${h.description}</p>
        <p class="data-source">Source: ${h.source || 'NSW Government Data'}</p>
        <h4>Implications for Development:</h4>
        <ul>${h.implications.map(i => `<li>${i}</li>`).join('')}</ul>
        <h4>Recommended Mitigation:</h4>
        <ul>${h.mitigation.map(m => `<li>${m}</li>`).join('')}</ul>
      </div>
    `).join('')
  }

  // Regulatory HTML
  const regSections = [regulatory.lep, regulatory.dcp, regulatory.ncc, regulatory.standards]
  if (regulatory.bushfireStandards) regSections.push(regulatory.bushfireStandards)
  const regulatoryHTML = regSections.map(s => `
    <div class="subsection">
      <h3>${s.title}</h3>
      <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `).join('')

  // Map HTML
  let mapHTML = ''
  if (coords && coords.lat && coords.lng) {
    mapHTML = `
      <div class="map-container">
        <iframe
          width="100%"
          height="300"
          style="border:0; border-radius: 8px;"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.005}%2C${coords.lat - 0.003}%2C${coords.lng + 0.005}%2C${coords.lat + 0.003}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}"
        ></iframe>
        <p class="map-caption">Site location — ${address}</p>
      </div>`
  }

  // Section numbering changes when cost guide is excluded
  const hazardSec = isClientVersion ? 6 : 7
  const regSec = isClientVersion ? 7 : 8

  // Table of contents
  const tocItems = [
    '1. Introduction',
    '2. Client Brief',
    '3. Site Description',
    '4. Site Context',
    '5. Planning Report',
  ]
  if (!isClientVersion) tocItems.push('6. Cost Guide')
  tocItems.push(`${hazardSec}. Hazard Assessment`)
  tocItems.push(`${regSec}. Regulatory Controls`)

  // Data sources section
  const dataSources = report.dataSources || {}
  let dataSourcesHTML = ''
  if (Object.keys(dataSources).length > 0) {
    dataSourcesHTML = `
    <div class="data-sources-section">
      <h3>Data Sources</h3>
      <table>
        <thead><tr><th>Category</th><th>Source</th></tr></thead>
        <tbody>
          ${Object.entries(dataSources).map(([k, v]) => `<tr><td>${k.charAt(0).toUpperCase() + k.slice(1)}</td><td>${v}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`
  }

  const versionLabel = isClientVersion ? 'Client Report' : 'Internal Report'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${versionLabel} — ${address}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #1B3C34;
      line-height: 1.7;
      font-size: 14px;
      background: #fff;
    }
    .page { max-width: 800px; margin: 0 auto; padding: 40px 30px; }

    /* Cover Page */
    .cover {
      position: relative;
      text-align: center;
      padding: 60px 40px 80px;
      margin-bottom: 40px;
      overflow: hidden;
      border-radius: 4px;
    }
    .cover-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.15;
      z-index: 0;
    }
    .cover-content {
      position: relative;
      z-index: 1;
    }
    .cover-logo {
      width: 160px;
      height: auto;
      margin-bottom: 30px;
    }
    .cover-divider {
      width: 80px;
      height: 2px;
      background: #1B3C34;
      margin: 24px auto;
    }
    .cover h1 {
      font-size: 26px;
      font-weight: 400;
      color: #1B3C34;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    .cover .address {
      font-size: 16px;
      color: #1B3C34;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .cover .date {
      font-size: 13px;
      color: #687076;
    }
    .cover .version-label {
      display: inline-block;
      margin-top: 16px;
      padding: 4px 16px;
      background: ${isClientVersion ? '#1B3C34' : '#8B4513'};
      color: white;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-radius: 3px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* Page header with logo */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 30px;
    }
    .page-header img {
      width: 100px;
      height: auto;
      opacity: 0.7;
    }
    .page-header .header-text {
      font-size: 11px;
      color: #687076;
      text-align: right;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* Section headings */
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1B3C34;
      border-bottom: 2px solid #1B3C34;
      padding-bottom: 8px;
      margin: 40px 0 20px 0;
    }
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1B3C34;
      margin: 20px 0 10px 0;
    }
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1B3C34;
      margin: 12px 0 6px 0;
    }

    /* Body text */
    p { margin-bottom: 12px; text-align: justify; }
    ul { margin: 8px 0 16px 24px; }
    li { margin-bottom: 6px; }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f0f6f4;
      color: #1B3C34;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Highlight boxes */
    .highlight-box {
      background: #f0f6f4;
      border-left: 4px solid #1B3C34;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .cost-summary {
      background: #f0f6f4;
      border: 2px solid #1B3C34;
      border-radius: 8px;
      padding: 24px;
      margin: 20px 0;
      text-align: center;
    }
    .cost-summary .amount {
      font-size: 32px;
      font-weight: 700;
      color: #1B3C34;
      margin: 8px 0;
    }
    .cost-summary .range {
      font-size: 14px;
      color: #687076;
    }
    .cost-summary .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #687076;
    }

    /* Hazard cards */
    .hazard-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 16px 0;
    }
    .hazard-high { border-left: 4px solid #ef4444; }
    .hazard-medium { border-left: 4px solid #f59e0b; }
    .hazard-low { border-left: 4px solid #22c55e; }
    .hazard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .hazard-header h3 { margin: 0; }
    .confidence-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: #f0f6f4;
      color: #1B3C34;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .data-source {
      font-size: 12px;
      color: #687076;
      font-style: italic;
      margin-top: -4px;
    }

    /* Map */
    .map-container { margin: 20px 0; }
    .map-caption { font-size: 12px; color: #687076; text-align: center; margin-top: 8px; font-style: italic; }

    /* Subsection */
    .subsection { margin-bottom: 24px; }

    /* Risk badge */
    .risk-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .risk-high { background: #fef2f2; color: #ef4444; }
    .risk-medium { background: #fffbeb; color: #d97706; }
    .risk-low { background: #f0fdf4; color: #16a34a; }
    .risk-unknown { background: #f3f4f6; color: #6b7280; }

    /* Footer */
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #1B3C34;
      text-align: center;
    }
    .footer-logo {
      width: 80px;
      height: auto;
      margin-bottom: 12px;
      opacity: 0.6;
    }
    .footer p {
      font-size: 11px;
      color: #687076;
      text-align: center;
      margin-bottom: 4px;
    }

    /* Contents */
    .contents { margin: 30px 0; }
    .contents h3 { color: #1B3C34; margin-bottom: 12px; }
    .contents ul { list-style: none; margin: 0; padding: 0; }
    .contents li { padding: 6px 0; border-bottom: 1px dotted #e5e7eb; font-size: 14px; }

    /* Notes */
    .notes { font-size: 12px; color: #687076; font-style: italic; margin-top: 16px; }
    .notes li { margin-bottom: 4px; }

    /* Data sources */
    .data-sources-section { margin-top: 30px; }

    @media print {
      .page { padding: 0; }
      .cover { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- COVER PAGE -->
    <div class="cover">
      ${bgURI ? `<div class="cover-bg" style="background-image: url('${bgURI}');"></div>` : ''}
      <div class="cover-content">
        ${logoURI ? `<img src="${logoURI}" alt="Line & Light Studio" class="cover-logo" />` : '<div class="brand">LINE & LIGHT STUDIO</div>'}
        <div class="cover-divider"></div>
        <h1>${report.coverPage.title}</h1>
        <div class="address">${report.coverPage.address}</div>
        <div class="date">${report.coverPage.date}</div>
        <div class="version-label">${versionLabel}</div>
      </div>
    </div>

    <!-- PAGE HEADER -->
    <div class="page-header">
      ${logoURI ? `<img src="${logoURI}" alt="Line & Light Studio" />` : '<span style="color:#1B3C34; font-weight:600;">Line & Light Studio</span>'}
      <div class="header-text">
        Residential Drafting and Building Design<br/>
        ${address}
      </div>
    </div>

    <!-- CONTENTS -->
    <div class="contents">
      <h3>Contents</h3>
      <ul>
        ${tocItems.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>

    <!-- 1. INTRODUCTION -->
    <h2>1. Introduction</h2>
    <p>${report.introduction.replace(/\n\n/g, '</p><p>')}</p>

    <!-- 2. CLIENT BRIEF -->
    <h2>2. Client Brief</h2>
    <p>${report.clientBrief.replace(/\n\n/g, '</p><p>')}</p>

    <!-- 3. SITE DESCRIPTION -->
    <h2>3. Site Description</h2>
    ${mapHTML}
    <p>${report.siteDescription.replace(/\n\n/g, '</p><p>')}</p>

    <!-- 4. SITE CONTEXT -->
    <h2>4. Site Context</h2>
    <p>${report.siteContext.replace(/\n\n/g, '</p><p>')}</p>

    <!-- 5. PLANNING REPORT -->
    <h2>5. Planning Report</h2>
    <p>${report.planningReport.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>

    ${costSectionHTML}

    <!-- HAZARD ASSESSMENT -->
    <h2>${hazardSec}. Hazard Assessment</h2>
    <div class="highlight-box">
      <p><strong>Overall Risk Level:</strong> <span class="risk-badge risk-${(hazards.overallRisk || 'unknown').toLowerCase()}">${hazards.overallRisk || 'UNKNOWN'}</span></p>
      <p>${hazards.summary}</p>
    </div>
    ${hazardsHTML}

    <!-- REGULATORY CONTROLS -->
    <h2>${regSec}. Regulatory Controls</h2>
    <p>${regulatory.intro}</p>
    ${regulatoryHTML}

    ${dataSourcesHTML}

    <!-- FOOTER -->
    <div class="footer">
      ${logoURI ? `<img src="${logoURI}" alt="Line & Light Studio" class="footer-logo" />` : ''}
      <p><strong>Line & Light Studio</strong> — Residential Drafting and Building Design</p>
      <p>This report is intended as a preliminary assessment only. All information should be verified with the relevant authorities prior to lodging a development application.</p>
      <p style="margin-top: 8px; font-size: 10px;">© ${new Date().getFullYear()} Line & Light Studio. All rights reserved. ${versionLabel}.</p>
    </div>

  </div>
</body>
</html>`
}

function sectionNum(n, isClientVersion) {
  return isClientVersion ? n - 1 : n
}
