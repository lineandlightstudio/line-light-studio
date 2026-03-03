import React from 'react'
import '../SectionBase.css'

function Section4({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="section">
      <h2>Finish Level & Quality Benchmark</h2>
      <p className="section-description">What quality level are you targeting?</p>

      <div className="form-group">
        <label>Finish Level</label>
        <div className="radio-group">
          {['Budget-conscious', 'Standard', 'Premium', 'High-end Architectural'].map(
            (option) => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="finishLevel"
                  value={option}
                  checked={data.finishLevel === option}
                  onChange={(e) => handleChange('finishLevel', e.target.value)}
                />
                <span>{option}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="benchmarkReference">Benchmark Reference</label>
        <textarea
          id="benchmarkReference"
          placeholder="e.g., Describe homes or projects that represent your quality aspirations"
          value={data.benchmarkReference || ''}
          onChange={(e) => handleChange('benchmarkReference', e.target.value)}
        />
      </div>
    </div>
  )
}

export default Section4
