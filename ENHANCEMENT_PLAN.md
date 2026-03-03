# Brief & Feasibility Report Enhancement Plan

## Current Status
The application currently generates basic briefs and feasibility reports. The user wants:
- More thorough and professional briefs
- Detailed feasibility reports with planning research
- Site analysis with images from SixMaps
- Planning overlays and constraints

## Data Sources Available

### 1. NSW Planning Portal Spatial Viewer
- **URL**: https://www.planningportal.nsw.gov.au/spatialviewer/
- **Data Available**:
  - Zoning information
  - Planning overlays
  - Development control plans (DCPs)
  - Environmental planning instruments (EPIs)
  - Historical planning data
- **Limitation**: No direct API for automated queries (portal is interactive only)
- **Workaround**: Can provide guidance to users to check portal manually, or integrate via web scraping

### 2. SixMaps (NSW Spatial Services)
- **URL**: https://maps.six.nsw.gov.au/
- **Data Available**:
  - Aerial photography (current and historical from 1943)
  - Cadastral data (lot boundaries)
  - Topographic information
  - Satellite data
- **Limitation**: No direct API for automated image retrieval
- **Workaround**: Can provide direct links to SixMaps for user to generate screenshots, or use ArcGIS REST services

### 3. NSW Land Registry Services
- **URL**: https://online.nswlrs.com.au/
- **Data Available**:
  - Title information
  - Property details
  - Street address data
- **Limitation**: No API, interactive portal only

## Implementation Strategy

### Phase 1: Enhanced Brief Generation
**Goal**: Make project briefs more comprehensive and professional

**Enhancements**:
1. **Design Principles Section**
   - Extract key design principles from survey responses
   - Generate architectural style recommendations
   - Suggest material palettes and finishes
   - Create mood board descriptions

2. **Detailed Analysis**
   - Expand executive summary with more context
   - Add design strategy section
   - Include spatial analysis recommendations
   - Suggest key design moves

3. **Improved Formatting**
   - Better visual hierarchy
   - More professional styling
   - Include placeholder areas for images/mood boards

### Phase 2: Comprehensive Feasibility Report
**Goal**: Create detailed planning and site analysis

**Sections to Add**:
1. **Site Analysis**
   - Site area and orientation
   - Topography assessment
   - Access and connections
   - Existing conditions

2. **Planning Controls Research** (User-Guided)
   - Zoning information
   - Floor space ratio (FSR)
   - Height limitations
   - Setback requirements
   - Heritage listings
   - Flood zones
   - Bushfire areas
   - Other overlays

3. **Regulatory Assessment**
   - Development approval pathway
   - Likely conditions
   - Estimated approval timeline
   - Key consultants needed

4. **Risk Assessment** (Enhanced)
   - Planning risks
   - Site-specific risks
   - Regulatory risks
   - Mitigation strategies

### Phase 3: SixMaps Integration
**Goal**: Include site imagery in reports

**Implementation**:
1. Generate direct SixMaps links for the property address
2. Provide instructions for users to capture screenshots
3. Include placeholder sections in PDF for images
4. Alternatively: Use ArcGIS REST API to programmatically fetch imagery

### Phase 4: Planning Portal Integration
**Goal**: Provide planning data in reports

**Implementation Options**:
1. **Manual User Input** (Simplest)
   - Add optional fields to survey for planning info
   - User researches and enters data
   - System includes in report

2. **Guided Research** (Recommended)
   - Generate direct links to planning portal
   - Provide checklist of what to look for
   - Include in report as reference

3. **Web Scraping** (Complex)
   - Scrape planning portal for address
   - Extract zoning, overlays, controls
   - Requires error handling for portal changes

## Recommended Approach

**For MVP (Immediate Implementation)**:
1. Enhance brief generation with design principles and analysis
2. Add comprehensive feasibility report sections
3. Include guided links to SixMaps and Planning Portal
4. Add optional fields for user to input planning data
5. Provide checklist/template for planning research

**For Future Enhancement**:
1. Integrate ArcGIS REST API for automated imagery
2. Implement planning portal web scraping
3. Add more sophisticated planning analysis
4. Include cost estimation based on planning complexity

## Technical Implementation

### Files to Modify
- `brief-generator.js` - Enhance brief generation
- `feasibility-generator.js` - Add planning sections
- `index.html` - Add optional planning fields to survey
- `admin.html` - Display enhanced reports

### New Data Structure
```javascript
{
  // Existing fields...
  
  // New planning section
  planning: {
    zoning: "string",
    fsr: "number",
    heightLimit: "number",
    heritage: "boolean",
    floodZone: "boolean",
    bushfireArea: "boolean",
    otherOverlays: "string",
    planningNotes: "string"
  },
  
  // Site analysis
  siteAnalysis: {
    area: "number",
    orientation: "string",
    topography: "string",
    access: "string",
    existingConditions: "string"
  }
}
```

## Next Steps
1. Implement enhanced brief generation
2. Add comprehensive feasibility report
3. Add optional planning fields to survey
4. Test with sample data
5. Deploy and gather user feedback
