import React from 'react'
import PageTitle from '../common/PageTitle'

export default function About() {
  return (
    <main className="main">
      <PageTitle title="About" subtitle="Learn about our clinic." current="About" />
      <section className="section">
        <div className="container">
          <p className="lead">We provide compassionate care and modern healthcare services.</p>
          <p>Book appointments with our specialists through the platform.</p>
        </div>
      </section>
    </main>
  )
}
