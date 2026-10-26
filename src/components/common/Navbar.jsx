import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { loginContext } from '../../context/LoginContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useContext(loginContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Derive simple role from localStorage or user object
  const storedRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const backendRole =
    user?.role ||
    user?.roleName ||
    (Array.isArray(user?.roles) ? user.roles[0] : null)

  let appRole = storedRole
  if (!appRole && backendRole === 'ROLE_DOCTOR') appRole = 'DOCTOR'
  if (!appRole && backendRole === 'ROLE_PATIENT') appRole = 'PATIENT'

  const displayName = user?.fullName || user?.username || user?.name || 'User'

  const toggleMobile = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <header className="modern-header py-2 shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="brand-badge" onClick={closeMobile}>
          <div className="brand-badge-icon">
            <i className="bi bi-hospital"></i>
          </div>
          <span>CarePath<span style={{ color: '#0d9488' }}>.</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="btn btn-link d-lg-none text-dark fs-3 p-1"
          onClick={toggleMobile}
          aria-label="Toggle navigation"
        >
          <i className={mobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'}></i>
        </button>

        {/* Nav Links & Actions */}
        <div className={`d-lg-flex align-items-center gap-3 ${mobileMenuOpen ? 'd-block mt-3 w-100' : 'd-none'}`}>
          <nav className="d-flex flex-column flex-lg-row align-items-lg-center gap-1">
            <NavLink
              to="/"
              onClick={closeMobile}
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMobile}
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>
            <NavLink
              to="/doctors"
              onClick={closeMobile}
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              Doctors
            </NavLink>

            {/* Role-based dashboard links */}
            {isAuthenticated && appRole === 'DOCTOR' && (
              <NavLink
                to="/doctor-dashboard"
                onClick={closeMobile}
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-speedometer2 me-1"></i> Doctor Dashboard
              </NavLink>
            )}

            {isAuthenticated && appRole === 'PATIENT' && (
              <NavLink
                to="/patient-dashboard"
                onClick={closeMobile}
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-calendar-check me-1"></i> Patient Dashboard
              </NavLink>
            )}

            <NavLink
              to="/contact"
              onClick={closeMobile}
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              Contact
            </NavLink>
          </nav>

          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 mt-3 mt-lg-0 ms-lg-3">
            {isAuthenticated ? (
              <>
                <div className="user-avatar-pill">
                  <i className="bi bi-person-circle"></i>
                  <span>{displayName}</span>
                  {appRole && (
                    <span className="badge bg-primary-subtle text-primary ms-1" style={{ fontSize: '0.7rem' }}>
                      {appRole}
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-outline-danger btn-sm rounded-3 px-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={() => {
                    closeMobile()
                    logout()
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn-modern-outline"
                  to="/login"
                  onClick={closeMobile}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Link>
                <Link
                  className="btn-modern-primary"
                  to="/register"
                  onClick={closeMobile}
                >
                  <i className="bi bi-person-plus"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
