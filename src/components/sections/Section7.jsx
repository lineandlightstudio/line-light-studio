import React from 'react'
import '../SectionBase.css'

function Section7({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Inspiration & References</h2>
      <p className="section-description">Share images, links, or descriptions of inspiration</p>

      <div className="form-group">
        <label htmlFor="inspirationLinks">Inspiration Links</label>
        <textarea
          id="inspirationLinks"
          placeholder="e.g., Pinterest boards, Houzz projects, architect websites"
          value={data.inspirationLinks || ''}
          onChange={(e) => handleChange('inspirationLinks', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="inspirationNotes">Inspiration Notes</label>
        <textarea
          id="inspirationNotes"
          placeholder="e.g., Describe specific design elements, materials, or spatial qualities you love"
          value={data.inspirationNotes || ''}
          onChange={(e) => handleChange('inspirationNotes', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section7
