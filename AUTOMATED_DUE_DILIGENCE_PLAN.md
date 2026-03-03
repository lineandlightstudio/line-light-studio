# Automated Due Diligence System - Architecture Plan

## Overview
The system will automatically perform comprehensive property research when a client submits an address. All research, imagery, and analysis will be embedded in the generated briefs and feasibility reports.

## Available Data Sources & APIs

### 1. SixMaps ArcGIS REST API
**Base URL**: `https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps`

**Available Services** (directly queryable):
- `LPI_Imagery_Best` - High-resolution aerial imagery
- `Cadastre` - Property boundaries and lot information
- `Flood` - Flood zone mapping
- `RFS` - Bushfire prone land (RFS data)
- `LPIMap` - Topographic and planning information
- `PropertyAddress` - Property address lookup
- `Plan_Section_Lot` - Historical DP/plan information
- `sydney1943` - Historical imagery (1943)

**Key Capabilities**:
- Export map images with specific layers/overlays
- Query features by location (lat/long or address)
- Get property boundaries and cadastral data
- Retrieve flood and bushfire zone information

**API Endpoint Pattern**:
```
https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/{service}/MapServer/export
```

### 2. NSW Planning Portal APIs
**Status**: Requires subscription key (request from ePlanningAPI@planning.nsw.gov.au)

**Available APIs**:
- Online DA Service API - Development application data
- Online Certificate Registration API - Building certifications
- Online Post-Consent Certificate API - Certificate data
- Online CDC Service API - Complying Development Certificate data
- Common APIs - Administrative functions

**Limitation**: Requires authentication and subscription key. May not provide direct property search by address.

### 3. NSW Data Portal
**URL**: `https://data.nsw.gov.au/`

**Available Datasets**:
- NSW Bush Fire Prone Land - Bushfire zone mapping
- NSW Flood Prone Land - Flood zone data
- Heritage Listings - Heritage property database

### 4. Google Maps / Google Static Maps API
**Fallback imagery source** when SixMaps is unavailable

## Proposed Architecture

### Phase 1: Address Geocoding & Lookup
1. Accept property address from client
2. Geocode address to lat/long coordinates
3. Query SixMaps PropertyAddress service to get:
   - Exact coordinates
   - Lot/DP number
   - Property boundaries
   - Cadastral information

### Phase 2: Automated Planning Research
1. Query SixMaps Cadastre service for property details
2. Query NSW Planning Portal (if API key available) for:
   - Zoning classification
   - FSR limits
   - Height restrictions
   - Heritage listing status
3. Query NSW Data Portal for:
   - Bushfire prone land status
   - Flood zone classification

### Phase 3: Imagery & Overlays Generation
1. **Current Aerial Imagery**:
   - Export from SixMaps LPI_Imagery_Best with property boundary overlay
   - Generate map showing:
     - Property boundary
     - Zoning overlay
     - Flood zone overlay
     - Bushfire zone overlay

2. **Historical Imagery**:
   - Query SixMaps sydney1943 for historical context
   - Generate historical comparison image

3. **Planning Overlays**:
   - Generate zoning map
   - Generate flood zone map
   - Generate bushfire zone map
   - Generate heritage zone map (if applicable)

### Phase 4: Site Analysis Report
1. Compile all research findings
2. Generate comprehensive site analysis with:
   - Property dimensions and area
   - Topography (from LPIMap)
   - Access and boundaries
   - Environmental constraints
   - Planning constraints
   - Historical context

### Phase 5: PDF Generation
1. Embed all imagery and overlays in PDF
2. Include planning data summary
3. Include risk assessment based on findings
4. Include next steps and recommendations

## Implementation Strategy

### Backend Module: `property-research.js`
```javascript
async function performPropertyResearch(address) {
  // 1. Geocode address
  const coordinates = await geocodeAddress(address);
  
  // 2. Query SixMaps for property data
  const propertyData = await querySixMapsProperty(coordinates);
  
  // 3. Query planning data
  const planningData = await queryPlanningData(coordinates);
  
  // 4. Generate imagery and overlays
  const imagery = await generateImageryAndOverlays(coordinates, propertyData);
  
  // 5. Compile site analysis
  const siteAnalysis = compileSiteAnalysis(propertyData, planningData, imagery);
  
  return {
    propertyData,
    planningData,
    imagery,
    siteAnalysis
  };
}
```

### Key Functions to Implement

1. **Geocoding**:
   - Use Google Geocoding API or SixMaps PropertyAddress service
   - Convert address to lat/long coordinates

2. **SixMaps Queries**:
   - Query Cadastre service for property boundaries
   - Query Flood service for flood zones
   - Query RFS service for bushfire zones
   - Query LPIMap for planning information
   - Export map images with overlays

3. **Imagery Generation**:
   - Capture aerial imagery with property boundary
   - Generate planning overlay maps
   - Create historical comparison images

4. **Data Compilation**:
   - Aggregate all research findings
   - Generate site analysis report
   - Identify constraints and risks

5. **PDF Integration**:
   - Embed imagery in PDF
   - Include planning data summary
   - Add risk assessment
   - Include recommendations

## SixMaps API Usage Examples

### Export Map with Overlay
```
GET https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPI_Imagery_Best/MapServer/export
?bbox={xmin},{ymin},{xmax},{ymax}
&size=800,600
&dpi=96
&format=png
&transparent=true
&f=json
```

### Query Feature by Location
```
GET https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/Cadastre/MapServer/identify
?geometry={point}
&geometryType=esriGeometryPoint
&layers=all
&tolerance=5
&mapExtent={bbox}
&imageDisplay=800,600,96
&f=json
```

### Get Flood Zone Information
```
GET https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/Flood/MapServer/identify
?geometry={point}
&geometryType=esriGeometryPoint
&layers=all
&f=json
```

## Data Flow

```
Client submits address
    ↓
Geocode address to coordinates
    ↓
Query SixMaps for property data
    ↓
Query planning data sources
    ↓
Generate imagery with overlays
    ↓
Compile site analysis
    ↓
Integrate into brief & feasibility report
    ↓
Generate PDF with embedded imagery
    ↓
Return to client
```

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Address geocoding accuracy | Use multiple geocoding services, validate results |
| SixMaps API rate limiting | Implement caching, batch requests efficiently |
| Imagery generation complexity | Use ArcGIS export endpoint, pre-generate common overlays |
| Large PDF file sizes | Optimize image compression, use progressive loading |
| Planning data availability | Fallback to manual research guidance if API unavailable |
| Historical DP documentation | Query SixMaps Plan_Section_Lot service, link to NSW LRS |

## Next Steps

1. Implement geocoding module
2. Build SixMaps query functions
3. Create imagery generation pipeline
4. Integrate with brief/feasibility generators
5. Build PDF generation with embedded imagery
6. Test with sample addresses
7. Deploy and monitor

## Dependencies to Install

```bash
npm install axios dotenv sharp # For HTTP requests, config, image processing
npm install puppeteer # For screenshot/PDF generation if needed
npm install turf # For geographic calculations
```

## Environment Variables Needed

```
GOOGLE_MAPS_API_KEY=xxx (optional, for geocoding fallback)
SIXMAPS_BASE_URL=https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps
NSW_PLANNING_API_KEY=xxx (if available)
```
