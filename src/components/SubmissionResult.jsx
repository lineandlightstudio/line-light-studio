import React, { useState } from 'react'
import '../styles/SubmissionResult.css'

function SubmissionResult({ result, onNewSubmission }) {
  const [activeTab, setActiveTab] = useState('brief')
  const report = result.report

  const downloadReport = (format) => {
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${result.projectId}-report.json`
    link.click()
  }

  const openSixMaps = () => {
    if (report.hazardAssessment?.sixmapsLink) {
      window.open(report.hazardAssessment.sixmapsLink, '_blank')
    }
  }

  return (
    <div className="submission-result">
      <div className="result-header">
        <div className="result-header-content">
          <h1>Report Generated Successfully</h1>
          <p className="project-id">Project ID: {result.projectId}</p>
          <p className="address">{report.address}</p>
        </div>
        <div className="result-actions">
          <button className="btn btn-primary" onClick={onNewSubmission}>
            New Submission
          </button>
          <button className="btn btn-secondary" onClick={() => downloadReport('json')}>
            Download JSON
          </button>
        </div>
      </div>

      <div className="result-tabs">
        <button
          className={`tab ${activeTab === 'brief' ? 'active' : ''}`}
          onClick={() => setActiveTab('brief')}
        >
          Project Brief
        </button>
        <button
          className={`tab ${activeTab === 'feasibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('feasibility')}
        >
          Feasibility Study
        </button>
        <button
          className={`tab ${activeTab === 'hazard' ? 'active' : ''}`}
          onClick={() => setActiveTab('hazard')}
        >
          Hazard Analysis
        </button>
      </div>

      <div className="result-content">
        {activeTab === 'brief' && (
          <div className="tab-content">
            <h2>Project Brief</h2>
            {report.brief?.html ? (
              <div
                className="html-content"
                dangerouslySetInnerHTML={{ __html: report.brief.html }}
              />
            ) : (
              <div className="brief-summary">
                <h3>{report.brief?.title}</h3>
                <div className="brief-field">
                  <strong>Property:</strong>
                  <p>{report.brief?.propertyOverview?.address}</p>
                </div>
                <div className="brief-field">
                  <strong>Project Type:</strong>
                  <p>{report.brief?.projectRequirements?.projectType}</p>
                </div>
                <div className="brief-field">
                  <strong>Floor Area:</strong>
                  <p>{report.brief?.projectRequirements?.desiredFloorArea}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feasibility' && (
          <div className="tab-content">
            <h2>Feasibility Study</h2>
            {report.feasibility?.html ? (
              <div
                className="html-content"
                dangerouslySetInnerHTML={{ __html: report.feasibility.html }}
              />
            ) : (
              <div className="feasibility-summary">
                <div className="feasibility-field">
                  <strong>Complexity Score:</strong>
                  <p>{report.feasibility?.complexityScore}/10</p>
                </div>
                <div className="feasibility-field">
                  <strong>Identified Risks:</strong>
                  <p>{report.feasibility?.risks?.length || 0}</p>
                </div>
                <div className="feasibility-field">
                  <strong>Estimated Timeline:</strong>
                  <p>{report.feasibility?.timelineAssessment?.estimatedMonths} months</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hazard' && (
          <div className="tab-content">
            <h2>Hazard & Constraint Analysis</h2>
            {report.hazardAssessment ? (
              <div className="hazard-summary">
                <div className="risk-card">
                  <div className={`risk-level risk-${report.hazardAssessment.overallRisk.level.toLowerCase()}`}>
                    {report.hazardAssessment.overallRisk.level}
                  </div>
                  <h3>Overall Risk Assessment</h3>
                  <p>{report.hazardAssessment.overallRisk.summary}</p>
                </div>

                {report.hazardAssessment.hazards && report.hazardAssessment.hazards.length > 0 && (
                  <div className="hazards-list">
                    <h3>Identified Hazards</h3>
                    {report.hazardAssessment.hazards.map((hazard, idx) => (
                      <div key={idx} className="hazard-item">
                        <h4>{hazard.type.replace(/_/g, ' ')}</h4>
                        <p className={`severity severity-${hazard.severity.toLowerCase()}`}>
                          Severity: {hazard.severity}
                        </p>
                        <p>{hazard.description}</p>

                        <h5>Implications for Development:</h5>
                        <ul>
                          {hazard.implications.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>

                        <h5>Recommended Mitigations:</h5>
                        <ul>
                          {hazard.mitigations.map((mit, i) => (
                            <li key={i}>{mit}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {report.hazardAssessment.sixmapsLink && (
                  <div className="sixmaps-section">
                    <h3>View Planning Overlays</h3>
                    <p>
                      Use SixMaps to view detailed planning information, flood zones, bushfire zones, and other
                      overlays for this property.
                    </p>
                    <button className="btn btn-primary" onClick={openSixMaps}>
                      Open SixMaps
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>No hazard assessment available</p>
            )}
          </div>
        )}
      </div>

      <div className="result-footer">
        <p>
          <strong>Generated:</strong> {new Date(report.generatedDate).toLocaleString()}
        </p>
        <p>
          <strong>Coordinates:</strong> {report.coordinates?.lat.toFixed(4)}, {report.coordinates?.lng.toFixed(4)}
        </p>
      </div>
    </div>
  )
}

export default SubmissionResult
