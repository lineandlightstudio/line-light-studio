import React from 'react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg fill='%231b6b5c'%3E%3Cline x1='40' y1='130' x2='160' y2='50' stroke='%231b6b5c' stroke-width='8' stroke-linecap='round'/%3E%3Cline x1='190' y1='70' x2='170' y2='50' stroke='%231b6b5c' stroke-width='6' stroke-linecap='round'/%3E%3Cline x1='190' y1='100' x2='170' y2='80' stroke='%231b6b5c' stroke-width='6' stroke-linecap='round'/%3E%3Cline x1='160' y1='130' x2='40' y2='130' stroke='%231b6b5c' stroke-width='8' stroke-linecap='round'/%3E%3Ctext x='50' y='160' font-family='Arial' font-size='16' font-weight='bold' fill='%231b6b5c'%3ELINE %26 LIGHT%3C/text%3E%3C/g%3E%3C/svg%3E" alt="Line & Light Studio" className="logo" />
          <h1>Line & Light Studio</h1>
        </div>
        <p className="tagline">Project Brief Intake</p>
      </div>
    </header>
  )
}

export default Header
