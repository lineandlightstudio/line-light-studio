import React, { useState, useEffect } from 'react'
import '../styles/AdminDashboard.css'

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    fetchSubmissions()
    const interval = setInterval(fetchSubmissions, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.submissions.reverse())
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadJSON = (projectId) => {
    const submission = submissions.find((s) => s.projectId === projectId)
    if (submission) {
      const dataStr = JSON.stringify(submission, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${projectId}-submission.json`
      link.click()
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH':
        return '#ef4444'
      case 'MEDIUM':
        return '#f59e0b'
      case 'LOW':
        return '#22c55e'
      default:
        return '#6b7280'
    }
  }

  if (loading) {
    return <div className="admin-dashboard"><p>Loading submissions...</p></div>
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Total Submissions: {submissions.length}</p>
      </div>

      <div className="dashboard-content">
        <div className="submissions-list">
          <h2>Recent Submissions</h2>
          {submissions.length === 0 ? (
            <p className="no-submissions">No submissions yet</p>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => (
                <div
                  key={submission.projectId}
                  className={`submission-card ${selectedSubmission?.projectId === submission.projectId ? 'selected' : ''}`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="card-header">
                    <h3>{submission.section1?.address || 'Unnamed Property'}</h3>
                    <span className="project-id">{submission.projectId}</span>
                  </div>

                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="label">Project Type</span>
                      <span className="value">{submission.section2?.projectType || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Floor Area</span>
                      <span className="value">{submission.section2?.floorArea || 'N/A'} m²</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Risk Level</span>
                      <span
                        className="value risk-badge"
                        style={{
                          color: getRiskColor(submission.report?.hazardAssessment?.overallRisk.level),
                        }}
                      >
                        {submission.report?.hazardAssessment?.overallRisk.level || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <span className="submitted-date">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSubmission && (
          <div className="submission-details">
            <div className="details-header">
              <h2>{selectedSubmission.section1?.address}</h2>
              <button className="close-btn" onClick={() => setSelectedSubmission(null)}>
                ✕
              </button>
            </div>

            <div className="details-tabs">
              <div className="details-section">
                <h3>Property Information</h3>
                <div className="detail-field">
                  <span className="label">Address:</span>
                  <span className="value">{selectedSubmission.section1?.address}</span>
                </div>
                <div className="detail-field">
                  <span className="label">Lot/DP:</span>
                  <span className="value">{selectedSubmission.section1?.lotDp || 'N/A'}</span>
                </div>
                <div className="detail-field">
                  <span className="label">Intended Use:</span>
                  <span className="value">{selectedSubmission.section1?.intendedUse}</span>
                </div>
              </div>

              <div className="details-section">
                <h3>Project Details</h3>
                <div className="detail-field">
                  <span className="label">Type:</span>
                  <span className="value">{selectedSubmission.section2?.projectType}</span>
                </div>
                <div className="detail-field">
                  <span className="label">Floor Area:</span>
                  <span className="value">{selectedSubmission.section2?.floorArea} m²</span>
                </div>
                <div className="detail-field">
                  <span className="label">Bedrooms:</span>
                  <span className="value">{selectedSubmission.section2?.bedrooms || 'N/A'}</span>
                </div>
                <div className="detail-field">
                  <span className="label">Budget:</span>
                  <span className="value">
                    ${selectedSubmission.section8?.budget ? parseInt(selectedSubmission.section8.budget).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="details-section">
                <h3>Hazard Assessment</h3>
                {selectedSubmission.report?.hazardAssessment ? (
                  <>
                    <div className="detail-field">
                      <span className="label">Overall Risk:</span>
                      <span
                        className="value risk-badge"
                        style={{
                          color: getRiskColor(selectedSubmission.report.hazardAssessment.overallRisk.level),
                        }}
                      >
                        {selectedSubmission.report.hazardAssessment.overallRisk.level}
                      </span>
                    </div>
                    <div className="detail-field">
                      <span className="label">Identified Hazards:</span>
                      <span className="value">
                        {selectedSubmission.report.hazardAssessment.hazards?.length || 0}
                      </span>
                    </div>
                    {selectedSubmission.report.hazardAssessment.sixmapsLink && (
                      <div className="detail-field">
                        <a
                          href={selectedSubmission.report.hazardAssessment.sixmapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-small"
                        >
                          View on SixMaps
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <p>No hazard assessment available</p>
                )}
              </div>
            </div>

            <div className="details-actions">
              <button
                className="btn btn-secondary"
                onClick={() => downloadJSON(selectedSubmission.projectId)}
              >
                Download JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
