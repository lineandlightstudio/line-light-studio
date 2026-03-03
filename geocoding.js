/**
 * Geocoding Module
 * Converts addresses to coordinates using Nominatim (free, open-source)
 */

import axios from 'axios'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(address) {
  try {
    if (!address) {
      throw new Error('Address is required')
    }

    console.log(`[Geocoding] Looking up: ${address}`)

    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'au', // Australia only
      },
      headers: {
        'User-Agent': 'LineLight-Studio/1.0',
      },
      timeout: 10000,
    })

    if (!response.data || response.data.length === 0) {
      throw new Error(`Address not found: ${address}`)
    }

    const result = response.data[0]
    const coordinates = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    }

    console.log(`[Geocoding] Found: ${coordinates.displayName} (${coordinates.lat}, ${coordinates.lng})`)

    return coordinates
  } catch (error) {
    console.error(`[Geocoding] Error:`, error.message)
    throw error
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
      },
      headers: {
        'User-Agent': 'LineLight-Studio/1.0',
      },
      timeout: 10000,
    })

    return response.data.address
  } catch (error) {
    console.error(`[Reverse Geocoding] Error:`, error.message)
    throw error
  }
}
