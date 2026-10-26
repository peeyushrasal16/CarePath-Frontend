import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer 
      className="text-white pt-5 pb-4 mt-auto" 
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderTop: '1px solid #334155' }}
    >
      <div className="container">
        <div className="row g-4 justify-content-between mb-4">
          {/* Brand Col */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center text-white"
                style={{ width: '38px', height: '38px', background: 'var(--primary-gradient)', fontSize: '1.2rem' }}
              >
                <i className="bi bi-hospital"></i>
              </div>
              <span className="fs-4 fw-bold tracking-tight text-white">
                CarePath<span style={{ color: '#0d9488' }}>.</span>
              </span>
            </div>
            <p className="text-light opacity-75 small mb-3">
              Providing modern, compassionate healthcare coordination. Schedule appointments seamlessly with certified specialists.
            </p>
            <div className="d-flex flex-column gap-2 text-light opacity-75 small">
              <div><i className="bi bi-geo-alt me-2 text-info"></i> 123 Healthcare Blvd, Medical District</div>
              <div><i className="bi bi-telephone me-2 text-info"></i> +1 (555) 123-4567</div>
              <div><i className="bi bi-envelope me-2 text-info"></i> CarePath@digital.com</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li><Link to="/" className="text-light opacity-75 text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-light opacity-75 text-decoration-none">About Us</Link></li>
              <li><Link to="/doctors" className="text-light opacity-75 text-decoration-none">Find Doctors</Link></li>
              <li><Link to="/contact" className="text-light opacity-75 text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Specialties</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li><Link to="/doctors" className="text-light opacity-75 text-decoration-none">Cardiology Care</Link></li>
              <li><Link to="/doctors" className="text-light opacity-75 text-decoration-none">Neurology Services</Link></li>
              <li><Link to="/doctors" className="text-light opacity-75 text-decoration-none">General Medicine</Link></li>
              <li><Link to="/doctors" className="text-light opacity-75 text-decoration-none">Preventive Health</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>User Access</h6>
            <p className="text-light opacity-75 small mb-3">
              Access your medical history, manage consult appointments, or publish doctor slots.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/login" className="btn btn-sm btn-outline-light rounded-pill px-3">
                <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-info text-white rounded-pill px-3">
                <i className="bi bi-person-plus me-1"></i> Register
              </Link>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 mt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-light opacity-50">
          <div>
            © {new Date().getFullYear()} CarePath Digital Clinic Management. All rights reserved.
          </div>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
