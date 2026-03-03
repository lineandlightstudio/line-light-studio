import React from 'react'
import '../SectionBase.css'

function Section1({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Client & Property Overview</h2>
      <p className="section-description">Tell us about your property and family</p>

      <div className="form-group">
        <label htmlFor="address">Property Address</label>
        <input
          id="address"
          type="text"
          placeholder="e.g., 123 Main Street, Sydney NSW 2000"
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lotDp">Lot/DP Number</label>
        <input
          id="lotDp"
          type="text"
          placeholder="e.g., Lot 42 DP 123456"
          value={data.lotDp || ''}
          onChange={(e) => handleChange('lotDp', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Intended Use</label>
        <div className="radio-group">
          {['Primary Residence', 'Holiday Home', 'Investment Property', 'Other'].map(
            (option) => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="intendedUse"
                  value={option}
                  checked={data.intendedUse === option}
                  onChange={(e) => handleChange('intendedUse', e.target.value)}
                />
                <span>{option}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="family">Family Description</label>
        <textarea
          id="family"
          placeholder="e.g., Couple with two children, ages 8 and 12"
          value={data.familyDescription || ''}
          onChange={(e) => handleChange('familyDescription', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Stage of Ownership</label>
        <div className="radio-group">
          {['Own Land', 'Under Contract', 'Researching'].map((option) => (
            <label key={option} className="radio-label">
              <input
                type="radio"
                name="ownershipStage"
                value={option}
                checked={data.ownershipStage === option}
                onChange={(e) => handleChange('ownershipStage', e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Section1
