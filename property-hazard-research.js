/**
 * Property Hazard Research Module
 * Performs automated hazard identification and planning constraint analysis
 * 
 * Data Sources:
 * - Bushfire: NSW RFS Bush Fire Prone Land (portal.data.nsw.gov.au) — official certified BFPL data
 * - Flood: NSW Planning Portal Hazard Layer (mapprod3.environment.nsw.gov.au) — EPI flood planning
 * - Heritage: NSW EPI Primary Planning Layers (mapprod3.environment.nsw.gov.au) — LEP heritage
 * - Zoning/Height/FSR: NSW EPI Primary Planning Layers — LEP controls
 */

import axios from 'axios'

// Verified API endpoints
const BFPL_URL = 'https://portal.data.nsw.gov.au/arcgis/rest/services/Bush_Fire_Prone_Land_MIL1/MapServer/0/query'
const FLOOD_URL = 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Hazard/MapServer/1/query'
const EPI_BASE = 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/EPI_Primary_Planning_Layers/MapServer'
// Layer IDs: 0=Heritage, 1=FSR, 2=Zoning, 4=LotSize, 5=Height

const REQUEST_TIMEOUT = 15000

/**
 * Main function to perform comprehensive hazard and planning research
 */
export async function performHazardResearch(address, coordinates) {
  try {
    console.log(`[Hazard Research] Starting research for: ${address}`)

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      throw new Error('Valid coordinates required for hazard research')
    }

    // Query all data sources in parallel
    const [bushfireResult, floodResult, heritageResult, zoningResult, heightResult, fsrResult] = await Promise.allSettled([
      queryBushfireProneL(coordinates),
      queryFloodPlanning(coordinates),
      queryHeritage(coordinates),
      queryZoning(coordinates),
      queryBuildingHeight(coordinates),
      queryFSR(coordinates),
    ])

    // Extract results (handle failures gracefully)
    const bushfire = bushfireResult.status === 'fulfilled' ? bushfireResult.value : { status: 'ERROR', error: bushfireResult.reason?.message }
    const flood = floodResult.status === 'fulfilled' ? floodResult.value : { status: 'ERROR', error: floodResult.reason?.message }
    const heritage = heritageResult.status === 'fulfilled' ? heritageResult.value : { status: 'ERROR', error: heritageResult.reason?.message }
    const zoning = zoningResult.status === 'fulfilled' ? zoningResult.value : { zone: 'Unknown', error: zoningResult.reason?.message }
    const height = heightResult.status === 'fulfilled' ? heightResult.value : { maxHeight: 'Unknown', error: heightResult.reason?.message }
    const fsr = fsrResult.status === 'fulfilled' ? fsrResult.value : { maxFSR: 'Unknown', error: fsrResult.reason?.message }

    const research = {
      address,
      coordinates,
      bushfire,
      flood,
      heritage,
      planning: {
        zoning,
        height,
        fsr,
      },
      researchDate: new Date().toISOString(),
      sixmapsLink: `https://maps.six.nsw.gov.au/?search=${coordinates.lat.toFixed(6)},${coordinates.lng.toFixed(6)}`,
      planningPortalLink: `https://www.planningportal.nsw.gov.au/spatialviewer/#/find-a-property/address`,
      dataSources: {
        bushfire: 'NSW RFS Bush Fire Prone Land (portal.data.nsw.gov.au) — Certified BFPL mapping',
        flood: 'NSW Planning Portal EPI Flood Planning Layer (mapprod3.environment.nsw.gov.au)',
        heritage: 'NSW EPI Primary Planning Layers — Heritage (mapprod3.environment.nsw.gov.au)',
        zoning: 'NSW EPI Primary Planning Layers — Land Zoning (mapprod3.environment.nsw.gov.au)',
      },
    }

    console.log(`[Hazard Research] Completed. Bushfire: ${bushfire.status}, Flood: ${flood.status}, Heritage: ${heritage.status}`)
    return research
  } catch (error) {
    console.error(`[Hazard Research] Error:`, error.message)
    return {
      address,
      coordinates,
      error: error.message,
      researchDate: new Date().toISOString(),
    }
  }
}

/**
 * Query NSW RFS Bush Fire Prone Land — official certified dataset
 * Returns vegetation category (1, 2, 3) or Buffer zone
 */
async function queryBushfireProneL(coordinates) {
  try {
    console.log(`[BFPL] Querying Bush Fire Prone Land for ${coordinates.lat}, ${coordinates.lng}`)

    const response = await axios.get(BFPL_URL, {
      params: {
        geometry: `${coordinates.lng},${coordinates.lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'd_Category,Category,d_Guidelin',
        returnGeometry: false,
        f: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    })

    const features = response.data?.features || []

    if (features.length === 0) {
      console.log(`[BFPL] Property is NOT in Bush Fire Prone Land`)
      return {
        inBushfireZone: false,
        status: 'NOT_BUSHFIRE_PRONE',
        category: null,
        categoryDescription: null,
        guideline: null,
        riskLevel: 'LOW',
        requiresBAL: false,
        dataSource: 'NSW RFS Bush Fire Prone Land (Certified)',
        confidence: 'HIGH',
      }
    }

    // Property IS in bushfire prone land
    const attrs = features[0].attributes
    const category = attrs.Category
    const categoryDesc = attrs.d_Category || `Category ${category}`
    const guideline = attrs.d_Guidelin || `v${attrs.Guideline || 'unknown'}`

    console.log(`[BFPL] Property IS in Bush Fire Prone Land: ${categoryDesc} (Guideline ${guideline})`)

    // Determine risk level based on category
    let riskLevel = 'MEDIUM'
    let balNote = ''
    if (category === 1) {
      riskLevel = 'HIGH'
      balNote = 'Vegetation Category 1 — highest bushfire risk. BAL assessment mandatory. Likely BAL-12.5 to BAL-FZ depending on slope and distance to vegetation.'
    } else if (category === 2) {
      riskLevel = 'MEDIUM'
      balNote = 'Vegetation Category 2 — moderate bushfire risk. BAL assessment required.'
    } else if (category === 3) {
      riskLevel = 'MEDIUM'
      balNote = 'Vegetation Category 3 — lower bushfire risk but BAL assessment still required.'
    } else {
      // Buffer zone
      riskLevel = 'MEDIUM'
      balNote = 'Property is within the bushfire buffer zone. BAL assessment may be required depending on proximity to vegetation.'
    }

    return {
      inBushfireZone: true,
      status: 'BUSHFIRE_PRONE',
      category,
      categoryDescription: categoryDesc,
      guideline,
      riskLevel,
      requiresBAL: true,
      balNote,
      dataSource: 'NSW RFS Bush Fire Prone Land (Certified)',
      confidence: 'HIGH',
    }
  } catch (error) {
    console.error(`[BFPL] Query failed:`, error.message)
    return {
      inBushfireZone: false,
      status: 'QUERY_FAILED',
      error: error.message,
      riskLevel: 'UNKNOWN',
      requiresBAL: false,
      confidence: 'LOW',
      note: 'Bushfire status could not be determined. Manual verification with NSW RFS is recommended.',
    }
  }
}

/**
 * Query NSW Planning Portal Flood Planning Layer
 * Note: Coverage is limited to LGAs that have uploaded flood data
 */
async function queryFloodPlanning(coordinates) {
  try {
    console.log(`[Flood] Querying Flood Planning for ${coordinates.lat}, ${coordinates.lng}`)

    const response = await axios.get(FLOOD_URL, {
      params: {
        geometry: `${coordinates.lng},${coordinates.lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'EPI_NAME,LGA_NAME,LAY_CLASS',
        returnGeometry: false,
        f: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    })

    const features = response.data?.features || []

    if (features.length === 0) {
      console.log(`[Flood] No flood planning data found (may not be mapped for this LGA)`)
      return {
        inFloodZone: false,
        status: 'NO_DATA_FOUND',
        riskLevel: 'UNKNOWN',
        note: 'No flood planning data was returned for this location. This may mean the property is not flood-prone, OR that the relevant council has not yet uploaded flood data to the NSW Planning Portal. A flood certificate should be obtained from the relevant council to confirm.',
        dataSource: 'NSW Planning Portal EPI Flood Planning Layer',
        confidence: 'LOW',
      }
    }

    // Property IS in flood planning area
    const attrs = features[0].attributes
    const epiName = attrs.EPI_NAME || 'Unknown LEP'
    const lgaName = attrs.LGA_NAME || 'Unknown LGA'
    const layClass = attrs.LAY_CLASS || 'Flood Planning Area'

    // Check all features for different flood classifications
    const classifications = features.map(f => f.attributes.LAY_CLASS).filter(Boolean)

    console.log(`[Flood] Property IS in flood planning area: ${layClass} (${lgaName})`)

    return {
      inFloodZone: true,
      status: 'FLOOD_PRONE',
      epiName,
      lgaName,
      classification: layClass,
      allClassifications: [...new Set(classifications)],
      riskLevel: 'HIGH',
      note: `Property is identified as ${layClass} under ${epiName}. Flood risk assessment and compliance with council flood policy required.`,
      dataSource: 'NSW Planning Portal EPI Flood Planning Layer',
      confidence: 'HIGH',
    }
  } catch (error) {
    console.error(`[Flood] Query failed:`, error.message)
    return {
      inFloodZone: false,
      status: 'QUERY_FAILED',
      error: error.message,
      riskLevel: 'UNKNOWN',
      confidence: 'LOW',
      note: 'Flood status could not be determined. A flood certificate should be obtained from the relevant council.',
    }
  }
}

/**
 * Query NSW EPI Heritage Layer
 */
async function queryHeritage(coordinates) {
  try {
    console.log(`[Heritage] Querying Heritage for ${coordinates.lat}, ${coordinates.lng}`)

    const response = await axios.get(`${EPI_BASE}/0/query`, {
      params: {
        geometry: `${coordinates.lng},${coordinates.lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'EPI_NAME,LGA_NAME,LAY_NAME,LAY_CLASS',
        returnGeometry: false,
        f: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    })

    const features = response.data?.features || []

    if (features.length === 0) {
      console.log(`[Heritage] Property is NOT heritage listed`)
      return {
        isHeritageListed: false,
        status: 'NOT_HERITAGE_LISTED',
        riskLevel: 'LOW',
        dataSource: 'NSW EPI Primary Planning Layers — Heritage',
        confidence: 'HIGH',
      }
    }

    const attrs = features[0].attributes
    const epiName = attrs.EPI_NAME || 'Unknown LEP'
    const lgaName = attrs.LGA_NAME || 'Unknown LGA'
    const layClass = attrs.LAY_CLASS || 'Heritage'

    console.log(`[Heritage] Property IS heritage listed: ${layClass} (${lgaName})`)

    return {
      isHeritageListed: true,
      status: 'HERITAGE_LISTED',
      epiName,
      lgaName,
      classification: layClass,
      riskLevel: 'MEDIUM',
      note: `Property is identified under ${epiName} heritage provisions. Heritage impact assessment may be required.`,
      dataSource: 'NSW EPI Primary Planning Layers — Heritage',
      confidence: 'HIGH',
    }
  } catch (error) {
    console.error(`[Heritage] Query failed:`, error.message)
    return {
      isHeritageListed: false,
      status: 'QUERY_FAILED',
      error: error.message,
      riskLevel: 'UNKNOWN',
      confidence: 'LOW',
    }
  }
}

/**
 * Query Land Zoning
 */
async function queryZoning(coordinates) {
  try {
    const response = await axios.get(`${EPI_BASE}/2/query`, {
      params: {
        geometry: `${coordinates.lng},${coordinates.lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'EPI_NAME,LGA_NAME,LAY_NAME,LAY_CLASS',
        returnGeometry: false,
        f: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    })

    const features = response.data?.features || []
    if (features.length === 0) {
      return { zone: 'Not available', epiName: null, lgaName: null }
    }

    const attrs = features[0].attributes
    return {
      zone: attrs.LAY_CLASS || 'Unknown',
      zoneName: attrs.LAY_NAME || 'Zone',
      epiName: attrs.EPI_NAME || null,
      lgaName: attrs.LGA_NAME || null,
    }
  } catch (error) {
    console.error(`[Zoning] Query failed:`, error.message)
    return { zone: 'Query failed', error: error.message }
  }
}

/**
 * Query Maximum Building Height
 */
async function queryBuildingHeight(coordinates) {
  try {
    const response = await axios.get(`${EPI_BASE}/5/query`, {
      params: {
        geometry: `${coordinates.lng},${coordinates.lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'EPI_NAME,LGA_NAME,LAY_NAME,LAY_CLASS',
        returnGeometry: false,
        f: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    })

    const features = response.data?.features || []
    if (features.length === 0) {
      return { maxHeight: 'Not available' }
    }

    const attrs = features[0].attributes
    return {
      maxHeight: attrs.LAY_CLASS || 'Unknown',
      heightName: attrs.LAY_NAME || 'Maximum Building Height (m)',
      epiName: attrs.EPI_NAME || null,
    }
  } catch (error) {
    console.error(`[Height] Query failed:`, error.message)
    return { maxHeight: 'Query failed', error: error.message }
  }
}

/**
 * Query Floor Space Ratio
 */
async function queryFSR(coordinates) {
  try {
    const response = await axios.get(`${EPI_BASE}/1/query`, {
      params: {
        geometry: `${coordinates.lng},${coordinates.lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'EPI_NAME,LGA_NAME,LAY_NAME,LAY_CLASS',
        returnGeometry: false,
        f: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    })

    const features = response.data?.features || []
    if (features.length === 0) {
      return { maxFSR: 'Not available' }
    }

    const attrs = features[0].attributes
    return {
      maxFSR: attrs.LAY_CLASS || 'Unknown',
      fsrName: attrs.LAY_NAME || 'Maximum Floor Space Ratio (n:1)',
      epiName: attrs.EPI_NAME || null,
    }
  } catch (error) {
    console.error(`[FSR] Query failed:`, error.message)
    return { maxFSR: 'Query failed', error: error.message }
  }
}
