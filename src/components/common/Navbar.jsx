import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { loginContext } from '../../context/LoginContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useContext(loginContext)
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

  return (
    <nav id="navmenu" className="navmenu">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive: a }) => (a ? 'active' : '')}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive: a }) => (a ? 'active' : '')}>About</NavLink>
        </li>
        <li>
          <NavLink to="/doctors" className={({ isActive: a }) => (a ? 'active' : '')}>Doctors</NavLink>
        </li>

        {/* Role-based dashboard links */}
        {isAuthenticated && appRole === 'DOCTOR' && (
          <li>
            <NavLink
              to="/doctor-dashboard"
              className={({ isActive: a }) => (a ? 'active' : '')}
            >
              Doctor Dashboard
            </NavLink>
          </li>
        )}

        {isAuthenticated && appRole === 'PATIENT' && (
          <li>
            <NavLink
              to="/patient-dashboard"
              className={({ isActive: a }) => (a ? 'active' : '')}
            >
              Patient Dashboard
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/contact" className={({ isActive: a }) => (a ? 'active' : '')}>Contact</NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li className="nav-item ms-lg-3">
              <p className="nav-link mb-0">{displayName}</p>
            </li>
            <li className="nav-item ms-2">
              <button className="btn btn-light text-success fw-semibold" onClick={() => logout()}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item ms-lg-3">
              <Link className="btn btn-light text-success fw-semibold" to="/login">Login</Link>
            </li>
            <li className="nav-item ms-2">
              <Link className="btn btn-outline-light fw-semibold" to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
      <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
    </nav>
  )
}
