import React, { useState } from 'react'
import './Survey.css'
import Section1 from './sections/Section1'
import Section2 from './sections/Section2'
import Section3 from './sections/Section3'
import Section4 from './sections/Section4'
import Section5 from './sections/Section5'
import Section6 from './sections/Section6'
import Section7 from './sections/Section7'
import Section8 from './sections/Section8'

const TOTAL_SECTIONS = 8

function Survey({ onSubmit }) {
  const [currentSection, setCurrentSection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    section1: {},
    section2: {},
    section3: {},
    section4: {},
    section5: {},
    section6: {},
    section7: {},
    section8: {},
  })

  const updateSection = (sectionNum, data) => {
    setFormData((prev) => ({
      ...prev,
      [`section${sectionNum}`]: data,
    }))
  }

  const handleNext = () => {
    if (currentSection < TOTAL_SECTIONS) {
      setCurrentSection(currentSection + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const surveyData = {
        ...formData,
        submittedAt: new Date().toISOString(),
      }

      // Send to backend API
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      const result = await response.json()
      onSubmit(surveyData)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Error submitting survey: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Section1
            data={formData.section1}
            onChange={(data) => updateSection(1, data)}
          />
        )
      case 2:
        return (
          <Section2
            data={formData.section2}
            onChange={(data) => updateSection(2, data)}
          />
        )
      case 3:
        return (
          <Section3
            data={formData.section3}
            onChange={(data) => updateSection(3, data)}
          />
        )
      case 4:
        return (
          <Section4
            data={formData.section4}
            onChange={(data) => updateSection(4, data)}
          />
        )
      case 5:
        return (
          <Section5
            data={formData.section5}
            onChange={(data) => updateSection(5, data)}
          />
        )
      case 6:
        return (
          <Section6
            data={formData.section6}
            onChange={(data) => updateSection(6, data)}
          />
        )
      case 7:
        return (
          <Section7
            data={formData.section7}
            onChange={(data) => updateSection(7, data)}
          />
        )
      case 8:
        return (
          <Section8
            data={formData.section8}
            onChange={(data) => updateSection(8, data)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="survey">
      <div className="progress-container">
        <div className="progress-info">
          <span className="progress-text">
            SECTION {currentSection} OF {TOTAL_SECTIONS}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentSection / TOTAL_SECTIONS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="section-content">{renderSection()}</div>

      <div className="navigation">
        <button
          onClick={handlePrevious}
          disabled={currentSection === 1}
          className="btn btn-secondary"
        >
          ← Previous
        </button>

        <button
          onClick={
            currentSection === TOTAL_SECTIONS ? handleSubmit : handleNext
          }
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting
            ? 'Submitting...'
            : currentSection === TOTAL_SECTIONS
              ? 'Submit'
              : 'Next →'}
        </button>
      </div>
    </div>
  )
}

export default Survey
