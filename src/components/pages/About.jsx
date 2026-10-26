import React from 'react'
import PageTitle from '../common/PageTitle'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="main">
      <PageTitle 
        title="About CarePath Digital" 
        subtitle="Empowering patients and doctors with seamless medical appointment scheduling." 
        current="About Us" 
      />
      <section className="section py-5">
        <div className="container">
          <div className="row align-items-center g-5 mb-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
                Our Mission
              </span>
              <h2 className="fw-bold mb-3">Modernizing Patient Care with Technology</h2>
              <p className="lead text-muted">
                At CarePath Digital, we bridge the gap between patients and specialized healthcare professionals.
              </p>
              <p className="text-muted">
                Our platform eliminates long clinic waiting lines through transparent real-time slot booking,
                convenient digital consultation records, and automated booking receipts. Whether you need a cardiology consultation,
                neurological examination, or routine wellness review, CarePath connects you to certified doctors with confidence.
              </p>
              <div className="d-flex gap-3 mt-4">
                <Link to="/doctors" className="btn-modern-primary">
                  Meet Our Doctors
                </Link>
                <Link to="/contact" className="btn-modern-outline">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="modern-card p-4 text-center h-100">
                    <i className="bi bi-person-check-fill text-primary display-5 mb-2"></i>
                    <h3 className="fw-bold mb-1">100%</h3>
                    <p className="text-muted small mb-0">Certified Specialists</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="modern-card p-4 text-center h-100">
                    <i className="bi bi-clock-history text-success display-5 mb-2"></i>
                    <h3 className="fw-bold mb-1">Zero</h3>
                    <p className="text-muted small mb-0">Waiting Room Delays</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="modern-card p-4 text-center h-100">
                    <i className="bi bi-shield-check text-info display-5 mb-2"></i>
                    <h3 className="fw-bold mb-1">Secure</h3>
                    <p className="text-muted small mb-0">Digital Health Privacy</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="modern-card p-4 text-center h-100">
                    <i className="bi bi-headset text-warning display-5 mb-2"></i>
                    <h3 className="fw-bold mb-1">24/7</h3>
                    <p className="text-muted small mb-0">Portal Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
