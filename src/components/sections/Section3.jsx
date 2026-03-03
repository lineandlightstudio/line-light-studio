import React from 'react'
import '../SectionBase.css'

function Section3({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Layout & Function</h2>
      <p className="section-description">Describe your ideal layout and functionality</p>

      <div className="form-group">
        <label htmlFor="layoutPreferences">Layout Preferences</label>
        <textarea
          id="layoutPreferences"
          placeholder="e.g., Open plan living, separate formal dining, private study"
          value={data.layoutPreferences || ''}
          onChange={(e) => handleChange('layoutPreferences', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="functionalRequirements">Functional Requirements</label>
        <textarea
          id="functionalRequirements"
          placeholder="e.g., Home office, gym, wine cellar, guest accommodation"
          value={data.functionalRequirements || ''}
          onChange={(e) => handleChange('functionalRequirements', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="outdoorSpaces">Outdoor Spaces</label>
        <textarea
          id="outdoorSpaces"
          placeholder="e.g., Large entertaining deck, pool, garden, privacy screening"
          value={data.outdoorSpaces || ''}
          onChange={(e) => handleChange('outdoorSpaces', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section3
