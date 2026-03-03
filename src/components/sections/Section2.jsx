import React from 'react'
import '../SectionBase.css'

function Section2({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Project Fundamentals</h2>
      <p className="section-description">Tell us about your project requirements</p>

      <div className="form-group">
        <label htmlFor="projectType">Project Type</label>
        <input
          id="projectType"
          type="text"
          placeholder="e.g., New home, renovation, extension"
          value={data.projectType || ''}
          onChange={(e) => handleChange('projectType', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="floorArea">Desired Floor Area (m²)</label>
        <input
          id="floorArea"
          type="number"
          placeholder="e.g., 300"
          value={data.floorArea || ''}
          onChange={(e) => handleChange('floorArea', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bedrooms">Bedrooms</label>
        <input
          id="bedrooms"
          type="number"
          placeholder="e.g., 4"
          value={data.bedrooms || ''}
          onChange={(e) => handleChange('bedrooms', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bathrooms">Bathrooms</label>
        <input
          id="bathrooms"
          type="number"
          step="0.5"
          placeholder="e.g., 2.5"
          value={data.bathrooms || ''}
          onChange={(e) => handleChange('bathrooms', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section2
