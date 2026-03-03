import React from 'react'
import '../SectionBase.css'

function Section6({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Project Character</h2>
      <p className="section-description">
        In 5 words, describe the feeling and character you want your home to have.
      </p>

      <div className="form-group">
        <label htmlFor="characterWords">5 Words That Describe Your Vision</label>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', lineHeight: '1.5' }}>
          For example: <em>warm, modern, timeless, light-filled, grounded</em> — or perhaps <em>bold, minimal, earthy, serene, crafted</em>. 
          There are no wrong answers. Choose words that feel right to you.
        </p>
        <input
          id="characterWords"
          type="text"
          placeholder="e.g. warm, modern, timeless, light-filled, grounded"
          value={data.characterWords || ''}
          onChange={(e) => handleChange('characterWords', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section6
