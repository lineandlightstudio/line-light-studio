/**
 * Brand Assets Module
 * Loads logo and background images as base64 for embedding in HTML reports
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let logoB64 = null
let bgB64 = null

function loadAssets() {
  try {
    const logoPath = path.join(__dirname, 'assets', 'logo_b64.txt')
    const bgPath = path.join(__dirname, 'assets', 'background_b64.txt')

    if (fs.existsSync(logoPath)) {
      logoB64 = fs.readFileSync(logoPath, 'utf8').trim()
    }
    if (fs.existsSync(bgPath)) {
      bgB64 = fs.readFileSync(bgPath, 'utf8').trim()
    }
    console.log(`[Brand] Loaded logo (${logoB64 ? logoB64.length : 0} chars), background (${bgB64 ? bgB64.length : 0} chars)`)
  } catch (err) {
    console.error('[Brand] Error loading assets:', err.message)
  }
}

// Load on import
loadAssets()

export function getLogoDataURI() {
  return logoB64 ? `data:image/png;base64,${logoB64}` : ''
}

export function getBackgroundDataURI() {
  return bgB64 ? `data:image/jpeg;base64,${bgB64}` : ''
}
