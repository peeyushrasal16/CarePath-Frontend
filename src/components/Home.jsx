import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper">
        <Container>
          <Row className="align-items-center py-4">
            <Col lg={7} className="mb-4 mb-lg-0">
              <span className="hero-chip">
                <i className="bi bi-shield-check"></i> Trusted Healthcare Provider
              </span>
              <h1 className="display-4 fw-bold mb-3" style={{ lineHeight: 1.2 }}>
                Compassionate Care, <br />
                <span style={{ color: 'var(--primary)' }}>Smarter Consultations.</span>
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem' }}>
                Welcome to <strong>CarePath Digital</strong>. Manage your appointments effortlessly, 
                connect with top certified medical specialists, and receive care with total peace of mind.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <Link to="/doctors" className="btn-modern-primary fs-6 px-4 py-3">
                  <i className="bi bi-calendar-check"></i> Book an Appointment
                </Link>
                <Link to="/about" className="btn-modern-outline fs-6 px-4 py-3">
                  <i className="bi bi-info-circle"></i> Learn About Us
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="d-flex flex-wrap gap-4 mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small fw-semibold text-secondary">Verified Doctors</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small fw-semibold text-secondary">Instant Slot Booking</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small fw-semibold text-secondary">Secure Digital Records</span>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="position-relative p-4">
                <div 
                  className="rounded-4 p-5 text-center shadow-lg position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%)',
                    border: '1px solid #bae6fd'
                  }}
                >
                  <div 
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm"
                    style={{ width: '110px', height: '110px' }}
                  >
                    <i className="bi bi-heart-pulse-fill text-primary" style={{ fontSize: '3.5rem' }}></i>
                  </div>
                  <h4 className="fw-bold mb-2 text-dark">24/7 Digital Healthcare</h4>
                  <p className="text-muted small mb-3">
                    Fast access to scheduled consultations with premier healthcare specialists.
                  </p>
                  <div className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-around text-center">
                    <div>
                      <h5 className="fw-bold text-primary mb-0">15+</h5>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Specialists</span>
                    </div>
                    <div className="border-end"></div>
                    <div>
                      <h5 className="fw-bold text-primary mb-0">5,000+</h5>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Patients Served</span>
                    </div>
                    <div className="border-end"></div>
                    <div>
                      <h5 className="fw-bold text-primary mb-0">99%</h5>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
              Our Medical Specialties
            </span>
            <h2 className="fw-bold mb-2">High Quality Healthcare Services</h2>
            <p className="text-muted">
              We bring specialized consultations to simplify patient booking and improve recovery outcomes.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="modern-card p-4 h-100 text-center">
                <div className="feature-icon-box mx-auto">
                  <i className="bi bi-heart-pulse" />
                </div>
                <h5 className="fw-bold mb-2">Cardiology</h5>
                <p className="text-muted mb-4 small">
                  Comprehensive heart health assessments, ECG analysis, and proactive cardiac wellness plans.
                </p>
                <Link to="/doctors" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
                  Find Cardiologist <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>

            <Col md={4}>
              <div className="modern-card p-4 h-100 text-center">
                <div className="feature-icon-box mx-auto">
                  <i className="bi bi-brain" />
                </div>
                <h5 className="fw-bold mb-2">Neurology</h5>
                <p className="text-muted mb-4 small">
                  Specialized neuro evaluations, headache clinics, and advanced treatments for nervous disorders.
                </p>
                <Link to="/doctors" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
                  Find Neurologist <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>

            <Col md={4}>
              <div className="modern-card p-4 h-100 text-center">
                <div className="feature-icon-box mx-auto">
                  <i className="bi bi-hospital" />
                </div>
                <h5 className="fw-bold mb-2">General Medicine</h5>
                <p className="text-muted mb-4 small">
                  Routine health examinations, preventive screenings, viral diagnoses, and ongoing wellness care.
                </p>
                <Link to="/doctors" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
                  Consult Physician <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Link to="/doctors" className="btn-modern-primary px-4 py-2">
              <i className="bi bi-grid me-1"></i> View All Doctors &amp; Book Appointment
            </Link>
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-5" style={{ backgroundColor: '#f1f5f9' }}>
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
                Why Choose CarePath
              </span>
              <h2 className="fw-bold mb-3">Modern Digital Care at Your Fingertips</h2>
              <p className="text-muted mb-4">
                Our clinic system brings patients and healthcare providers together under one unified digital platform.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-3 bg-white p-3 rounded-3 shadow-sm border">
                  <div className="p-2 rounded-3 bg-primary-subtle text-primary fs-4">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Easy Real-Time Slot Booking</h6>
                    <p className="text-muted small mb-0">Browse open slots dynamically and secure your appointment in seconds.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 bg-white p-3 rounded-3 shadow-sm border">
                  <div className="p-2 rounded-3 bg-success-subtle text-success fs-4">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Secure &amp; Instant Razorpay Integration</h6>
                    <p className="text-muted small mb-0">Confirmatory payments are handled seamlessly with complete protection.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 bg-white p-3 rounded-3 shadow-sm border">
                  <div className="p-2 rounded-3 bg-info-subtle text-info fs-4">
                    <i className="bi bi-clipboard2-pulse"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Dedicated Patient &amp; Doctor Dashboards</h6>
                    <p className="text-muted small mb-0">Track visit histories, appointment statuses, and schedule new slots easily.</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6} className="text-center">
              <div className="bg-white p-5 rounded-4 shadow-sm border">
                <i className="bi bi-person-hearts display-1 text-primary mb-3"></i>
                <h4 className="fw-bold mb-2">Ready to prioritize your health?</h4>
                <p className="text-muted small mb-4">
                  Sign up today or login to manage your upcoming clinic appointments.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <Link to="/register" className="btn-modern-primary">
                    Create Patient Account
                  </Link>
                  <Link to="/contact" className="btn-modern-outline">
                    Contact Clinic
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}
