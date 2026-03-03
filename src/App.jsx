import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function App() {
  const [view, setView] = useState('home')
  const [adminToken, setAdminToken] = useState(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reportHTML, setReportHTML] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [inspirationImages, setInspirationImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  // PWA install prompt
  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!standalone && !sessionStorage.getItem('pwa-dismissed')) {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  }

  const dismissInstall = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  }

  const [formData, setFormData] = useState({
    section1: { clientName: '', address: '', lotDp: '', intendedUse: '', ownershipStage: '', family: '' },
    section2: { projectType: '', floorArea: '', bedrooms: '', bathrooms: '' },
    section3: { layoutPreferences: '', functionalRequirements: '', outdoorSpaces: '' },
    section4: { finishLevel: '', benchmarkReference: '' },
    section5: { mustHaves: '', nonNegotiables: '', constraints: '' },
    section6: { characterWords: '' },
    section7: { inspirationLinks: '', inspirationNotes: '' },
    section8: { budget: '', timeline: '', additionalNotes: '' },
  })

  useEffect(() => {
    if (adminToken) fetchSubmissions()
  }, [adminToken])

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`/api/submissions?token=${adminToken}`)
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setAdminToken(data.token)
        setAdminPassword('')
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploadingImages(true)
    try {
      const formDataUpload = new FormData()
      files.forEach(file => formDataUpload.append('images', file))
      const res = await fetch('/api/upload-inspiration', {
        method: 'POST',
        body: formDataUpload,
      })
      const data = await res.json()
      if (data.success) {
        setInspirationImages(prev => [...prev, ...data.files])
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploadingImages(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index) => {
    setInspirationImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.section1.address) {
      alert('Please enter the property address')
      return
    }
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const payload = {
        ...formData,
        section7: {
          ...formData.section7,
          inspirationImagePaths: inspirationImages.map(f => f.path),
        },
      }
      const res = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitResult(data)
        setView('result')
      } else {
        alert('Submission failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const viewReport = async (submissionId) => {
    try {
      const res = await fetch(`/api/submissions/${submissionId}/report?token=${adminToken}`)
      const html = await res.text()
      setReportHTML(html)
      setView('report')
    } catch (error) {
      console.error('Error loading report:', error)
    }
  }

  // ============================================================
  // BRANDED HEADER COMPONENT
  // ============================================================
  const BrandedHeader = ({ showBack, backAction, backLabel, rightContent }) => (
    <header className="header branded-header">
      <div className="header-left">
        {showBack && (
          <button className="btn-back" onClick={backAction}>{backLabel || '\u2190 Back'}</button>
        )}
        <img src="/logo.png" alt="Line & Light Studio" className="header-logo" />
      </div>
      {rightContent && <div className="header-right">{rightContent}</div>}
    </header>
  )

  // ============================================================
  // HOME VIEW
  // ============================================================
  if (view === 'home') {
    return (
      <div className="app">
        {showInstallBanner && (
          <div className="pwa-install-banner">
            <div className="pwa-install-content">
              <img src="/icons/icon-96x96.png" alt="" className="pwa-install-icon" />
              <div className="pwa-install-text">
                <strong>Install Line & Light Studio</strong>
                <span>Add to your home screen for quick access</span>
              </div>
              <button className="pwa-install-btn" onClick={handleInstall}>Install</button>
              <button className="pwa-dismiss-btn" onClick={dismissInstall}>&times;</button>
            </div>
          </div>
        )}
        <div className="home-hero">
          <div className="home-hero-bg"></div>
          <div className="home-hero-content">
            <img src="/logo.png" alt="Line & Light Studio" className="home-logo" />
            <div className="home-divider"></div>
            <h2>Project Brief & Feasibility</h2>
            <p className="home-subtitle">
              Complete the project brief intake form to help us understand your vision and generate a comprehensive feasibility report for your property.
            </p>
            <button className="btn btn-primary btn-hero" onClick={() => setView('submit')}>
              Start Your Project Brief
            </button>
            <button className="btn btn-secondary btn-hero" onClick={() => setView('admin')}>
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // SUBMIT VIEW - Full multi-section survey
  // ============================================================
  if (view === 'submit') {
    return (
      <div className="app">
        <BrandedHeader showBack backAction={() => setView('home')} backLabel={'\u2190 Back'} />
        <div className="survey-intro">
          <h1>Project Brief Intake</h1>
          <p>Tell us about your project. The more detail you provide, the more comprehensive your feasibility report will be.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>

          {/* Section 1: Property & Client */}
          <div className="form-section">
            <h2>1. Property & Client Information</h2>
            <div className="form-group">
              <label>Client Name *</label>
              <input type="text" value={formData.section1.clientName} onChange={(e) => handleChange('section1', 'clientName', e.target.value)} placeholder="e.g. Grace and James Smith" required />
            </div>
            <div className="form-group">
              <label>Property Address *</label>
              <input type="text" value={formData.section1.address} onChange={(e) => handleChange('section1', 'address', e.target.value)} placeholder="e.g. 45 Paddington Street, Paddington NSW 2021" required />
            </div>
            <div className="form-group">
              <label>Lot/DP (if known)</label>
              <input type="text" value={formData.section1.lotDp} onChange={(e) => handleChange('section1', 'lotDp', e.target.value)} placeholder="e.g. Lot 1 DP 123456" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Intended Use</label>
                <select value={formData.section1.intendedUse} onChange={(e) => handleChange('section1', 'intendedUse', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Primary Residence">Primary Residence</option>
                  <option value="Holiday Home">Holiday Home</option>
                  <option value="Investment Property">Investment Property</option>
                  <option value="Dual Occupancy">Dual Occupancy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ownership Stage</label>
                <select value={formData.section1.ownershipStage} onChange={(e) => handleChange('section1', 'ownershipStage', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Own">Own the property</option>
                  <option value="Under Contract">Under contract</option>
                  <option value="Researching">Still researching</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Family / Household Description</label>
              <textarea value={formData.section1.family} onChange={(e) => handleChange('section1', 'family', e.target.value)} placeholder="e.g. Couple with two young children (ages 3 and 5), one dog" rows={2} />
            </div>
          </div>

          {/* Section 2: Project Scope */}
          <div className="form-section">
            <h2>2. Project Scope</h2>
            <div className="form-group">
              <label>Project Type *</label>
              <select value={formData.section2.projectType} onChange={(e) => handleChange('section2', 'projectType', e.target.value)} required>
                <option value="">Select...</option>
                <option value="New Build">New Build</option>
                <option value="Renovation">Renovation</option>
                <option value="Extension">Extension</option>
                <option value="Renovation & Extension">Renovation & Extension</option>
                <option value="Knockdown Rebuild">Knockdown Rebuild</option>
                <option value="Dual Occupancy">Dual Occupancy</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Desired Floor Area (m&sup2;)</label>
                <input type="number" value={formData.section2.floorArea} onChange={(e) => handleChange('section2', 'floorArea', e.target.value)} placeholder="e.g. 350" />
              </div>
              <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" value={formData.section2.bedrooms} onChange={(e) => handleChange('section2', 'bedrooms', e.target.value)} placeholder="e.g. 4" />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" value={formData.section2.bathrooms} onChange={(e) => handleChange('section2', 'bathrooms', e.target.value)} placeholder="e.g. 2" />
              </div>
            </div>
          </div>

          {/* Section 3: Layout & Function */}
          <div className="form-section">
            <h2>3. Layout & Functional Requirements</h2>
            <div className="form-group">
              <label>Layout Preferences</label>
              <textarea value={formData.section3.layoutPreferences} onChange={(e) => handleChange('section3', 'layoutPreferences', e.target.value)} placeholder="e.g. Open plan living/kitchen/dining, separate study, master suite on ground floor" rows={3} />
            </div>
            <div className="form-group">
              <label>Functional Requirements</label>
              <textarea value={formData.section3.functionalRequirements} onChange={(e) => handleChange('section3', 'functionalRequirements', e.target.value)} placeholder="e.g. Double garage, butler's pantry, mudroom, home office, media room" rows={3} />
            </div>
            <div className="form-group">
              <label>Outdoor Spaces</label>
              <textarea value={formData.section3.outdoorSpaces} onChange={(e) => handleChange('section3', 'outdoorSpaces', e.target.value)} placeholder="e.g. Covered alfresco dining, pool, landscaped garden, children's play area" rows={2} />
            </div>
          </div>

          {/* Section 4: Design & Finish — NO PRICES */}
          <div className="form-section">
            <h2>4. Design & Finish Level</h2>
            <div className="form-group">
              <label>Finish Level</label>
              <select value={formData.section4.finishLevel} onChange={(e) => handleChange('section4', 'finishLevel', e.target.value)}>
                <option value="">Select...</option>
                <option value="Budget-conscious">Standard</option>
                <option value="Standard">High</option>
                <option value="Premium">Luxury</option>
                <option value="High-end Architectural">Architectural</option>
              </select>
              <p className="field-hint">This helps us understand the level of quality and detailing you're aiming for.</p>
            </div>
            <div className="form-group">
              <label>Benchmark / Reference Projects</label>
              <textarea value={formData.section4.benchmarkReference} onChange={(e) => handleChange('section4', 'benchmarkReference', e.target.value)} placeholder="e.g. We love the work of Alexander &amp; Co, or a specific project you admire" rows={2} />
            </div>
          </div>

          {/* Section 5: Constraints & Priorities */}
          <div className="form-section">
            <h2>5. Constraints & Priorities</h2>
            <div className="form-group">
              <label>Must-Haves</label>
              <textarea value={formData.section5.mustHaves} onChange={(e) => handleChange('section5', 'mustHaves', e.target.value)} placeholder="e.g. North-facing living areas, natural ventilation, separate kids' zone" rows={3} />
            </div>
            <div className="form-group">
              <label>Non-Negotiables</label>
              <textarea value={formData.section5.nonNegotiables} onChange={(e) => handleChange('section5', 'nonNegotiables', e.target.value)} placeholder="e.g. Must retain existing mature trees, no two-storey at rear" rows={2} />
            </div>
            <div className="form-group">
              <label>Known Site Constraints</label>
              <textarea value={formData.section5.constraints} onChange={(e) => handleChange('section5', 'constraints', e.target.value)} placeholder="e.g. Steep slope to rear, heritage conservation area, bushfire prone, easement on northern boundary" rows={3} />
            </div>
          </div>

          {/* Section 6: Character */}
          <div className="form-section">
            <h2>6. Project Character</h2>
            <p className="form-hint">In 5 words, describe the feeling and character you want your home to have. For example: <em>warm, modern, timeless, light-filled, grounded</em> — or perhaps <em>bold, minimal, earthy, serene, crafted</em>.</p>
            <div className="form-group">
              <label>5 Words That Describe Your Vision</label>
              <input type="text" value={formData.section6.characterWords} onChange={(e) => handleChange('section6', 'characterWords', e.target.value)} placeholder="e.g. warm, modern, timeless, light-filled, grounded" />
            </div>
          </div>

          {/* Section 7: Inspiration — with image upload */}
          <div className="form-section">
            <h2>7. Inspiration</h2>
            <p className="form-hint">Share images, links, or notes about designs that inspire you. Upload photos directly from your phone or paste links to Pinterest boards, Instagram posts, or websites.</p>
            
            {/* Image Upload Area */}
            <div className="form-group">
              <label>Upload Inspiration Images</label>
              <div className="image-upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="file-input-hidden"
                  id="inspiration-upload"
                />
                <label htmlFor="inspiration-upload" className="upload-btn">
                  <span className="upload-icon">&#128247;</span>
                  <span>{uploadingImages ? 'Uploading...' : 'Tap to upload photos'}</span>
                  <span className="upload-hint">JPG, PNG, HEIC — up to 10MB each</span>
                </label>
              </div>
              {inspirationImages.length > 0 && (
                <div className="image-preview-grid">
                  {inspirationImages.map((img, i) => (
                    <div key={i} className="image-preview-item">
                      <img src={`/uploads/${img.filename}`} alt={`Inspiration ${i + 1}`} />
                      <button type="button" className="image-remove-btn" onClick={() => removeImage(i)}>&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Inspiration Links</label>
              <textarea value={formData.section7.inspirationLinks} onChange={(e) => handleChange('section7', 'inspirationLinks', e.target.value)} placeholder="Paste links to Pinterest boards, Instagram posts, or websites" rows={2} />
            </div>
            <div className="form-group">
              <label>Inspiration Notes</label>
              <textarea value={formData.section7.inspirationNotes} onChange={(e) => handleChange('section7', 'inspirationNotes', e.target.value)} placeholder="Describe what you like about these references — materials, colours, spatial qualities, mood" rows={3} />
            </div>
          </div>

          {/* Section 8: Budget & Timeline */}
          <div className="form-section">
            <h2>8. Budget & Timeline</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Construction Budget ($)</label>
                <input type="number" value={formData.section8.budget} onChange={(e) => handleChange('section8', 'budget', e.target.value)} placeholder="e.g. 1500000" />
              </div>
              <div className="form-group">
                <label>Preferred Timeline</label>
                <input type="text" value={formData.section8.timeline} onChange={(e) => handleChange('section8', 'timeline', e.target.value)} placeholder="e.g. 18 months" />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea value={formData.section8.additionalNotes} onChange={(e) => handleChange('section8', 'additionalNotes', e.target.value)} placeholder="Anything else we should know?" rows={3} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
            {submitting ? 'Generating Report...' : 'Submit & Generate Report'}
          </button>
        </form>
        <footer className="survey-footer">
          <img src="/logo.png" alt="Line & Light Studio" className="footer-logo" />
          <p>Line & Light Studio — Residential Drafting and Building Design</p>
        </footer>
      </div>
    )
  }

  // ============================================================
  // RESULT VIEW - After submission
  // ============================================================
  if (view === 'result' && submitResult) {
    return (
      <div className="app">
        <BrandedHeader />
        <div className="result-container">
          <div className="result-card">
            <div className="result-icon">&#10003;</div>
            <h2>Thank You</h2>
            <p style={{ color: '#687076', marginBottom: '16px', fontSize: '15px' }}>
              Your project brief has been received. We will review the details and be in touch shortly.
            </p>
            <p>Project ID: <strong>{submitResult.id}</strong></p>
            <div className="result-summary">
              <div className="result-item">
                <span className="result-label">Address</span>
                <span className="result-value">{submitResult.summary?.address}</span>
              </div>
            </div>
            <p style={{ color: '#687076', marginTop: '20px', fontSize: '14px' }}>
              A feasibility report is being prepared based on your submission.
            </p>
            <button className="btn btn-primary" onClick={() => { setView('home'); setInspirationImages([]); }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // ADMIN LOGIN
  // ============================================================
  if (view === 'admin' && !adminToken) {
    return (
      <div className="app">
        <BrandedHeader showBack backAction={() => setView('home')} />
        <form className="form login-form" onSubmit={handleAdminLogin}>
          <h2>Admin Login</h2>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Enter admin password" required />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    )
  }

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================
  if (view === 'admin' && adminToken) {
    return (
      <div className="app">
        <BrandedHeader
          showBack
          backAction={() => { setView('home'); setAdminToken(null) }}
          backLabel={'\u2190 Logout'}
          rightContent={<span className="submission-count">{submissions.length} project{submissions.length !== 1 ? 's' : ''}</span>}
        />
        <div className="dashboard">
          {submissions.length === 0 ? (
            <div className="empty-state">
              <p>No submissions yet. Share the form link with clients to get started.</p>
            </div>
          ) : (
            <div className="submissions-list">
              {submissions.map(s => (
                <div key={s.id} className="submission-card" onClick={() => viewReport(s.id)} role="button" tabIndex={0}>
                  <div className="card-top">
                    <h3>{s.address}</h3>
                    <span className={`risk-badge risk-${(s.overallRisk || 'unknown').toLowerCase()}`}>
                      {s.overallRisk || '?'}
                    </span>
                  </div>
                  <div className="card-meta">
                    <span>{s.clientName}</span>
                    <span>{s.projectType}</span>
                    <span>{s.floorArea ? s.floorArea + 'm\u00B2' : ''}</span>
                    <span>{s.estimatedCost ? '$' + s.estimatedCost.toLocaleString() : ''}</span>
                  </div>
                  <div className="card-footer">
                    <span className="card-date">{new Date(s.createdAt).toLocaleDateString('en-AU')}</span>
                    <span className="card-action">View Report &#8594;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ============================================================
  // REPORT VIEW
  // ============================================================
  if (view === 'report' && reportHTML) {
    return (
      <div className="app">
        <header className="header branded-header">
          <div className="header-left">
            <button className="btn-back" onClick={() => { setView('admin'); setReportHTML('') }}>{'\u2190'} Back to Dashboard</button>
            <img src="/logo.png" alt="Line & Light Studio" className="header-logo" />
          </div>
          <button className="btn btn-secondary btn-print" onClick={() => {
            const win = window.open('', '_blank')
            win.document.write(reportHTML)
            win.document.close()
            setTimeout(() => win.print(), 500)
          }}>
            Print / Save PDF
          </button>
        </header>
        <div className="report-container">
          <iframe
            srcDoc={reportHTML}
            title="Feasibility Report"
            className="report-iframe"
          />
        </div>
      </div>
    )
  }

  return null
}
