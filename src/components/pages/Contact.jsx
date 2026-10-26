import React from 'react'
import PageTitle from '../common/PageTitle'

export default function Contact() {
  return (
    <main className="main">
      <PageTitle 
        title="Get In Touch" 
        subtitle="Have questions about appointments or specialized care? Reach out to our support team." 
        current="Contact" 
      />
      <section className="section py-5">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="modern-card p-4 text-center h-100">
                <div className="feature-icon-box mx-auto">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <h5 className="fw-bold mb-2">Clinic Location</h5>
                <p className="text-muted small mb-0">123 Healthcare Boulevard, Medical District, NY 10012</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="modern-card p-4 text-center h-100">
                <div className="feature-icon-box mx-auto">
                  <i className="bi bi-telephone"></i>
                </div>
                <h5 className="fw-bold mb-2">Phone &amp; Hotline</h5>
                <p className="text-muted small mb-1">+1 (555) 123-4567</p>
                <p className="text-muted small mb-0">Mon - Sat: 8:00 AM - 8:00 PM</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="modern-card p-4 text-center h-100">
                <div className="feature-icon-box mx-auto">
                  <i className="bi bi-envelope"></i>
                </div>
                <h5 className="fw-bold mb-2">Email Inquiries</h5>
                <p className="text-muted small mb-1">CarePath@digital.com</p>
                <p className="text-muted small mb-0">support@carepath.org</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
