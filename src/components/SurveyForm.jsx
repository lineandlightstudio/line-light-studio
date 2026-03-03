import React, { useState } from 'react'
import '../styles/SurveyForm.css'

function SurveyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    section1: {
      address: '',
      lotDp: '',
      intendedUse: '',
      familyDescription: '',
      ownershipStage: '',
    },
    section2: {
      projectType: '',
      floorArea: '',
      bedrooms: '',
      bathrooms: '',
    },
    section3: {
      layoutPreferences: '',
      functionalRequirements: '',
      outdoorSpaces: '',
    },
    section4: {
      finishLevel: '',
      benchmarkReference: '',
    },
    section5: {
      mustHaves: '',
      nonNegotiables: '',
      constraints: '',
    },
    section6: {
      characterWords: '',
    },
    section7: {
      inspirationLinks: '',
      inspirationNotes: '',
    },
    section8: {
      budget: '',
      timeline: '',
      additionalNotes: '',
    },
  })

  const [currentSection, setCurrentSection] = useState(1)
  const [errors, setErrors] = useState({})

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const validateSection = (section) => {
    const newErrors = {}
    const data = formData[section]

    if (section === 'section1') {
      if (!data.address?.trim()) newErrors.address = 'Address is required'
      if (!data.intendedUse?.trim()) newErrors.intendedUse = 'Intended use is required'
      if (!data.ownershipStage?.trim()) newErrors.ownershipStage = 'Ownership stage is required'
    }

    if (section === 'section2') {
      if (!data.projectType?.trim()) newErrors.projectType = 'Project type is required'
      if (!data.floorArea?.trim()) newErrors.floorArea = 'Floor area is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateSection(`section${currentSection}`)) {
      if (currentSection < 8) {
        setCurrentSection(currentSection + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const handlePrev = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateSection(`section${currentSection}`)) {
      onSubmit(formData)
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="form-section">
            <h2>Property Information</h2>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={formData.section1.address}
                onChange={(e) => handleInputChange('section1', 'address', e.target.value)}
                placeholder="e.g., 42 Clifton Street, Paddington NSW 2021"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Lot/DP (Optional)</label>
              <input
                type="text"
                value={formData.section1.lotDp}
                onChange={(e) => handleInputChange('section1', 'lotDp', e.target.value)}
                placeholder="e.g., Lot 1 DP 123456"
              />
            </div>

            <div className="form-group">
              <label>Intended Use *</label>
              <select
                value={formData.section1.intendedUse}
                onChange={(e) => handleInputChange('section1', 'intendedUse', e.target.value)}
                className={errors.intendedUse ? 'error' : ''}
              >
                <option value="">Select...</option>
                <option value="Primary Residence">Primary Residence</option>
                <option value="Investment Property">Investment Property</option>
                <option value="Development">Development</option>
                <option value="Commercial">Commercial</option>
              </select>
              {errors.intendedUse && <span className="error-message">{errors.intendedUse}</span>}
            </div>

            <div className="form-group">
              <label>Family Description (Optional)</label>
              <textarea
                value={formData.section1.familyDescription}
                onChange={(e) => handleInputChange('section1', 'familyDescription', e.target.value)}
                placeholder="e.g., Couple with two children"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Ownership Stage *</label>
              <select
                value={formData.section1.ownershipStage}
                onChange={(e) => handleInputChange('section1', 'ownershipStage', e.target.value)}
                className={errors.ownershipStage ? 'error' : ''}
              >
                <option value="">Select...</option>
                <option value="Own Land">Own Land</option>
                <option value="Under Contract">Under Contract</option>
                <option value="Considering Purchase">Considering Purchase</option>
              </select>
              {errors.ownershipStage && <span className="error-message">{errors.ownershipStage}</span>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="form-section">
            <h2>Project Scope</h2>
            <div className="form-group">
              <label>Project Type *</label>
              <select
                value={formData.section2.projectType}
                onChange={(e) => handleInputChange('section2', 'projectType', e.target.value)}
                className={errors.projectType ? 'error' : ''}
              >
                <option value="">Select...</option>
                <option value="New Home">New Home</option>
                <option value="Extension">Extension</option>
                <option value="Renovation">Renovation</option>
                <option value="New Home with Extension">New Home with Extension</option>
                <option value="Subdivision">Subdivision</option>
              </select>
              {errors.projectType && <span className="error-message">{errors.projectType}</span>}
            </div>

            <div className="form-group">
              <label>Desired Floor Area (m²) *</label>
              <input
                type="number"
                value={formData.section2.floorArea}
                onChange={(e) => handleInputChange('section2', 'floorArea', e.target.value)}
                placeholder="e.g., 450"
                className={errors.floorArea ? 'error' : ''}
              />
              {errors.floorArea && <span className="error-message">{errors.floorArea}</span>}
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                value={formData.section2.bedrooms}
                onChange={(e) => handleInputChange('section2', 'bedrooms', e.target.value)}
                placeholder="e.g., 4"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                value={formData.section2.bathrooms}
                onChange={(e) => handleInputChange('section2', 'bathrooms', e.target.value)}
                placeholder="e.g., 2.5"
                step="0.5"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="form-section">
            <h2>Layout & Functionality</h2>
            <div className="form-group">
              <label>Layout Preferences</label>
              <textarea
                value={formData.section3.layoutPreferences}
                onChange={(e) => handleInputChange('section3', 'layoutPreferences', e.target.value)}
                placeholder="e.g., Open plan living with separate formal dining"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Functional Requirements</label>
              <textarea
                value={formData.section3.functionalRequirements}
                onChange={(e) => handleInputChange('section3', 'functionalRequirements', e.target.value)}
                placeholder="e.g., Home office, gym, wine cellar"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Outdoor Spaces</label>
              <textarea
                value={formData.section3.outdoorSpaces}
                onChange={(e) => handleInputChange('section3', 'outdoorSpaces', e.target.value)}
                placeholder="e.g., Large entertaining deck, pool, garden"
                rows="3"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="form-section">
            <h2>Design Direction</h2>
            <div className="form-group">
              <label>Finish Level</label>
              <select
                value={formData.section4.finishLevel}
                onChange={(e) => handleInputChange('section4', 'finishLevel', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Budget">Budget</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="High-end Architectural">High-end Architectural</option>
              </select>
            </div>

            <div className="form-group">
              <label>Benchmark Reference</label>
              <textarea
                value={formData.section4.benchmarkReference}
                onChange={(e) => handleInputChange('section4', 'benchmarkReference', e.target.value)}
                placeholder="e.g., Contemporary homes with premium finishes"
                rows="3"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="form-section">
            <h2>Constraints & Must-Haves</h2>
            <div className="form-group">
              <label>Must-Haves</label>
              <textarea
                value={formData.section5.mustHaves}
                onChange={(e) => handleInputChange('section5', 'mustHaves', e.target.value)}
                placeholder="e.g., North-facing living, large windows, sustainable features"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Non-Negotiables</label>
              <textarea
                value={formData.section5.nonNegotiables}
                onChange={(e) => handleInputChange('section5', 'nonNegotiables', e.target.value)}
                placeholder="e.g., Must retain existing heritage trees"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Site Constraints</label>
              <textarea
                value={formData.section5.constraints}
                onChange={(e) => handleInputChange('section5', 'constraints', e.target.value)}
                placeholder="e.g., Steep slope at rear, heritage overlay, narrow street access"
                rows="3"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="form-section">
            <h2>Design Character</h2>
            <div className="form-group">
              <label>Character Words (comma-separated)</label>
              <input
                type="text"
                value={formData.section6.characterWords}
                onChange={(e) => handleInputChange('section6', 'characterWords', e.target.value)}
                placeholder="e.g., Modern, Timeless, Warm, Minimalist, Sustainable"
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="form-section">
            <h2>Inspiration & References</h2>
            <div className="form-group">
              <label>Inspiration Links</label>
              <textarea
                value={formData.section7.inspirationLinks}
                onChange={(e) => handleInputChange('section7', 'inspirationLinks', e.target.value)}
                placeholder="e.g., https://www.houzz.com/..."
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Inspiration Notes</label>
              <textarea
                value={formData.section7.inspirationNotes}
                onChange={(e) => handleInputChange('section7', 'inspirationNotes', e.target.value)}
                placeholder="e.g., Clean lines, natural materials, landscape integration"
                rows="3"
              />
            </div>
          </div>
        )

      case 8:
        return (
          <div className="form-section">
            <h2>Budget & Timeline</h2>
            <div className="form-group">
              <label>Budget ($)</label>
              <input
                type="number"
                value={formData.section8.budget}
                onChange={(e) => handleInputChange('section8', 'budget', e.target.value)}
                placeholder="e.g., 2500000"
              />
            </div>

            <div className="form-group">
              <label>Timeline</label>
              <input
                type="text"
                value={formData.section8.timeline}
                onChange={(e) => handleInputChange('section8', 'timeline', e.target.value)}
                placeholder="e.g., 12-18 months"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={formData.section8.additionalNotes}
                onChange={(e) => handleInputChange('section8', 'additionalNotes', e.target.value)}
                placeholder="Any additional information or notes"
                rows="3"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="survey-form">
      <div className="form-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentSection / 8) * 100}%` }}></div>
        </div>
        <p className="progress-text">
          Section {currentSection} of 8
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {renderSection()}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={currentSection === 1}
          >
            ← Previous
          </button>

          {currentSection < 8 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button type="submit" className="btn btn-success">
              Submit & Generate Report
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SurveyForm
