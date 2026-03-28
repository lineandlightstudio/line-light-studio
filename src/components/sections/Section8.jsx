import React from 'react'
import '../SectionBase.css'

function Section8({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Budget & Timeline</h2>
      <p className="section-description">What are your financial and timeline expectations?</p>

      <div className="form-group">
        <label htmlFor="budget">Estimated Budget (AUD)</label>
        <input
          id="budget"
          type="number"
          placeholder=""
          value={data.budget || ''}
          onChange={(e) => handleChange('budget', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="timeline">Preferred Timeline</label>
        <select
          id="timeline"
          value={data.timeline || ''}
          onChange={(e) => handleChange('timeline', e.target.value)}
        >
          <option value="">Select timeline...</option>
          <option value="ASAP">ASAP (within 6 months)</option>
          <option value="6-12 months">6-12 months</option>
          <option value="12-18 months">12-18 months</option>
          <option value="18+ months">18+ months (flexible)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="additionalNotes">Additional Notes</label>
        <textarea
          id="additionalNotes"
          placeholder="Any additional information about your project"
          value={data.additionalNotes || ''}
          onChange={(e) => handleChange('additionalNotes', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section8
