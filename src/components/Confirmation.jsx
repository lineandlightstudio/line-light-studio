import React from 'react'
import './Confirmation.css'

function Confirmation({ data, onStartNew }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h2>Thank You!</h2>
        <p className="confirmation-message">
          Your project brief has been successfully submitted to Line & Light Studio.
        </p>

        <div className="confirmation-details">
          <div className="detail-item">
            <span className="detail-label">Property Address:</span>
            <span className="detail-value">{data.section1?.address || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Project Type:</span>
            <span className="detail-value">{data.section2?.projectType || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Estimated Budget:</span>
            <span className="detail-value">
              {data.section8?.budget ? `$${parseInt(data.section8.budget).toLocaleString()}` : 'Not provided'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Submitted:</span>
            <span className="detail-value">{formatDate(data.submittedAt)}</span>
          </div>
        </div>

        <div className="confirmation-message-box">
          <h3>What Happens Next?</h3>
          <ul>
            <li>Our team will review your project brief within 2-3 business days</li>
            <li>We'll assess feasibility and prepare a detailed proposal</li>
            <li>You'll receive a follow-up email with next steps and fee basis</li>
            <li>We'll be in touch to discuss your vision in detail</li>
          </ul>
        </div>

        <button onClick={onStartNew} className="btn btn-primary">
          Submit Another Project
        </button>
      </div>
    </div>
  )
}

export default Confirmation
