import React from 'react'
import PageTitle from '../common/PageTitle'

export default function Contact() {
  return (
    <main className="main">
      <PageTitle title="Contact" subtitle="Get in touch." current="Contact" />
      <section className="section">
        <div className="container">
          <p><i className="bi bi-geo-alt me-2" />123 Healthcare Ave, City</p>
          <p><i className="bi bi-telephone me-2" />+1 555 123 4567</p>
          <p><i className="bi bi-envelope me-2" />CarePath@digital.com</p>
        </div>
      </section>
    </main>
  )
}
