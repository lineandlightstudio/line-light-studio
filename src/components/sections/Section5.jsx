import React from 'react'
import '../SectionBase.css'

function Section5({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Must-Haves & Non-Negotiables</h2>
      <p className="section-description">What are your absolute requirements?</p>

      <div className="form-group">
        <label htmlFor="mustHaves">Must-Haves</label>
        <textarea
          id="mustHaves"
          placeholder="e.g., North-facing living, large windows, sustainable features"
          value={data.mustHaves || ''}
          onChange={(e) => handleChange('mustHaves', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="nonNegotiables">Non-Negotiables</label>
        <textarea
          id="nonNegotiables"
          placeholder="e.g., Must retain existing trees, specific view lines, heritage considerations"
          value={data.nonNegotiables || ''}
          onChange={(e) => handleChange('nonNegotiables', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="constraints">Site Constraints</label>
        <textarea
          id="constraints"
          placeholder="e.g., Steep slope, narrow access, heritage overlay, environmental zones"
          value={data.constraints || ''}
          onChange={(e) => handleChange('constraints', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section5
