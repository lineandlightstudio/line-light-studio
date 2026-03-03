/**
 * Property Research Module
 * Performs automated due diligence by querying SixMaps and planning data sources
 */

import axios from 'axios'

const SIXMAPS_BASE_URL = 'https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps'

/**
 * Main function to perform comprehensive property research
 */
export async function performPropertyResearch(address) {
  try {
    console.log(`[Property Research] Starting research for: ${address}`)

    // Step 1: Geocode address
    const coordinates = await geocodeAddress(address)
    if (!coordinates) {
      throw new Error(`Could not geocode address: ${address}`)
    }
    console.log(`[Property Research] Geocoded to: ${coordinates.lat}, ${coordinates.lng}`)

    // Step 2: Query SixMaps for property data
    const propertyData = await querySixMapsProperty(coordinates)
    console.log(`[Property Research] Retrieved property data`)

    // Step 3: Query planning constraints
    const planningConstraints = await queryPlanningConstraints(coordinates)
    console.log(`[Property Research] Retrieved planning constraints`)

    // Step 4: Query environmental hazards
    const hazards = await queryEnvironmentalHazards(coordinates)
    console.log(`[Property Research] Retrieved environmental hazards`)

    // Step 5: Generate imagery URLs
    const imagery = generateImageryUrls(coordinates, propertyData)
    console.log(`[Property Research] Generated imagery URLs`)

    // Compile research results
    const research = {
      address,
      coordinates,
      propertyData,
      planningConstraints,
      hazards,
      imagery,
      researchDate: new Date().toISOString(),
    }

    console.log(`[Property Research] Completed research for: ${address}`)
    return research
  } catch (error) {
    console.error(`[Property Research] Error researching property:`, error.message)
    // Return partial results with error flag
    return {
      address,
      error: error.message,
      researchDate: new Date().toISOString(),
    }
  }
}

/**
 * Geocode address to coordinates
 * Uses SixMaps PropertyAddress service
 */
async function geocodeAddress(address) {
  try {
    // Query SixMaps PropertyAddress service
    const response = await axios.get(`${SIXMAPS_BASE_URL}/PropertyAddress/MapServer/find`, {
      params: {
        searchText: address,
        contains: true,
        f: 'json',
      },
      timeout: 10000,
    })

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0]
      const geometry = result.geometry

      return {
        lat: geometry.y,
        lng: geometry.x,
        address: result.attributes.ADDRESS || address,
      }
    }

    // Fallback: Parse address manually (basic implementation)
    // In production, use Google Geocoding API or similar
    console.warn(`[Geocoding] Could not find address in SixMaps: ${address}`)
    return null
  } catch (error) {
    console.error(`[Geocoding] Error geocoding address:`, error.message)
    return null
  }
}

/**
 * Query SixMaps for property data
 */
async function querySixMapsProperty(coordinates) {
  try {
    const point = `${coordinates.lng},${coordinates.lat}`

    // Query Cadastre service for property boundaries
    const cadastreResponse = await axios.get(`${SIXMAPS_BASE_URL}/Cadastre/MapServer/identify`, {
      params: {
        geometry: point,
        geometryType: 'esriGeometryPoint',
        layers: 'all',
        tolerance: 5,
        mapExtent: `${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}`,
        imageDisplay: '800,600,96',
        f: 'json',
      },
      timeout: 10000,
    })

    const propertyData = {
      coordinates,
      cadastreResults: cadastreResponse.data.results || [],
    }

    // Extract lot/DP information if available
    if (cadastreResponse.data.results && cadastreResponse.data.results.length > 0) {
      const firstResult = cadastreResponse.data.results[0]
      if (firstResult.attributes) {
        propertyData.lotDp = firstResult.attributes.LOT_NUMBER || firstResult.attributes.DP || 'Not found'
        propertyData.area = firstResult.attributes.AREA_SQM || null
      }
    }

    return propertyData
  } catch (error) {
    console.error(`[SixMaps Query] Error querying property data:`, error.message)
    return { coordinates, error: error.message }
  }
}

/**
 * Query planning constraints
 */
async function queryPlanningConstraints(coordinates) {
  try {
    const point = `${coordinates.lng},${coordinates.lat}`

    // Query LPIMap for planning information
    const planningResponse = await axios.get(`${SIXMAPS_BASE_URL}/LPIMap/MapServer/identify`, {
      params: {
        geometry: point,
        geometryType: 'esriGeometryPoint',
        layers: 'all',
        tolerance: 5,
        mapExtent: `${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}`,
        imageDisplay: '800,600,96',
        f: 'json',
      },
      timeout: 10000,
    })

    return {
      planningResults: planningResponse.data.results || [],
    }
  } catch (error) {
    console.error(`[Planning Query] Error querying planning constraints:`, error.message)
    return { error: error.message }
  }
}

/**
 * Query environmental hazards (flood, bushfire, etc.)
 */
async function queryEnvironmentalHazards(coordinates) {
  try {
    const point = `${coordinates.lng},${coordinates.lat}`
    const hazards = {}

    // Query Flood zones
    try {
      const floodResponse = await axios.get(`${SIXMAPS_BASE_URL}/Flood/MapServer/identify`, {
        params: {
          geometry: point,
          geometryType: 'esriGeometryPoint',
          layers: 'all',
          tolerance: 5,
          mapExtent: `${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}`,
          imageDisplay: '800,600,96',
          f: 'json',
        },
        timeout: 10000,
      })
      hazards.flood = {
        status: floodResponse.data.results && floodResponse.data.results.length > 0 ? 'IN_FLOOD_ZONE' : 'NOT_IN_FLOOD_ZONE',
        details: floodResponse.data.results || [],
      }
    } catch (e) {
      hazards.flood = { status: 'UNKNOWN', error: e.message }
    }

    // Query Bushfire zones (RFS)
    try {
      const bushfireResponse = await axios.get(`${SIXMAPS_BASE_URL}/RFS/MapServer/identify`, {
        params: {
          geometry: point,
          geometryType: 'esriGeometryPoint',
          layers: 'all',
          tolerance: 5,
          mapExtent: `${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}`,
          imageDisplay: '800,600,96',
          f: 'json',
        },
        timeout: 10000,
      })
      hazards.bushfire = {
        status: bushfireResponse.data.results && bushfireResponse.data.results.length > 0 ? 'IN_BUSHFIRE_ZONE' : 'NOT_IN_BUSHFIRE_ZONE',
        details: bushfireResponse.data.results || [],
      }
    } catch (e) {
      hazards.bushfire = { status: 'UNKNOWN', error: e.message }
    }

    return hazards
  } catch (error) {
    console.error(`[Hazards Query] Error querying environmental hazards:`, error.message)
    return { error: error.message }
  }
}

/**
 * Generate imagery URLs for maps and overlays
 */
function generateImageryUrls(coordinates, propertyData) {
  const bbox = `${coordinates.lng - 0.005},${coordinates.lat - 0.005},${coordinates.lng + 0.005},${coordinates.lat + 0.005}`

  return {
    // Current aerial imagery
    aerialImagery: `${SIXMAPS_BASE_URL}/LPI_Imagery_Best/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&transparent=true&f=json`,

    // Aerial with cadastre overlay
    aerialWithCadastre: `${SIXMAPS_BASE_URL}/LPI_Imagery_Best/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&layers=0,1&transparent=true&f=json`,

    // Flood zone map
    floodZoneMap: `${SIXMAPS_BASE_URL}/Flood/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&transparent=true&f=json`,

    // Bushfire zone map
    bushfireZoneMap: `${SIXMAPS_BASE_URL}/RFS/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&transparent=true&f=json`,

    // Planning map
    planningMap: `${SIXMAPS_BASE_URL}/LPIMap/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&transparent=true&f=json`,

    // Topographic map
    topoMap: `${SIXMAPS_BASE_URL}/LPITopoMap/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&transparent=true&f=json`,

    // Historical imagery (1943)
    historicalImagery: `${SIXMAPS_BASE_URL}/sydney1943/MapServer/export?bbox=${bbox}&size=800,600&dpi=96&format=png&transparent=true&f=json`,

    // SixMaps direct link for user reference
    sixmapsLink: `https://maps.six.nsw.gov.au/?search=${encodeURIComponent(coordinates.lat + ',' + coordinates.lng)}`,
  }
}

/**
 * Format research results for display in reports
 */
export function formatResearchForReport(research) {
  if (research.error) {
    return {
      status: 'RESEARCH_ERROR',
      message: `Property research encountered an error: ${research.error}`,
      address: research.address,
    }
  }

  const formatted = {
    address: research.address,
    coordinates: research.coordinates,
    propertyDetails: {
      lotDp: research.propertyData.lotDp || 'Not found',
      area: research.propertyData.area ? `${research.propertyData.area} m²` : 'Not found',
    },
    planningStatus: {
      flood: research.hazards.flood?.status || 'UNKNOWN',
      bushfire: research.hazards.bushfire?.status || 'UNKNOWN',
    },
    imagery: research.imagery,
    researchDate: research.researchDate,
  }

  return formatted
}

/**
 * Extract key findings for feasibility report
 */
export function extractKeyFindings(research) {
  const findings = {
    constraints: [],
    opportunities: [],
    risks: [],
  }

  if (!research.error) {
    // Check flood zone
    if (research.hazards.flood?.status === 'IN_FLOOD_ZONE') {
      findings.constraints.push('Property is in flood-prone area - flood risk assessment required')
      findings.risks.push({
        level: 'high',
        category: 'Environmental',
        issue: 'Flood zone identified',
      })
    }

    // Check bushfire zone
    if (research.hazards.bushfire?.status === 'IN_BUSHFIRE_ZONE') {
      findings.constraints.push('Property is in bushfire-prone area - bushfire protection measures required')
      findings.risks.push({
        level: 'high',
        category: 'Environmental',
        issue: 'Bushfire zone identified',
      })
    }

    // Property area analysis
    if (research.propertyData.area) {
      const area = research.propertyData.area
      if (area < 300) {
        findings.constraints.push(`Small site (${area} m²) - may limit development potential`)
      } else if (area > 2000) {
        findings.opportunities.push(`Large site (${area} m²) - good development potential`)
      }
    }
  }

  return findings
}
