import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'

export default function Home() {
  return (
    <div>
      <section className="hero-section bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1>Welcome to Our CarePath Digital</h1>
              <p className="lead">
                Your health is our priority. Book appointments with top specialists easily.
              </p>
              <Button variant="primary" as={Link} to="/doctors">
                Book Appointment
              </Button>
            </Col>
            <Col md={6}>
              <div className="bg-light rounded p-4 text-center">
                <i className="bi bi-heart-pulse display-1 text-primary" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">Our Services</h2>
          <Row>
            <Col md={4} className="mb-3">
              <div className="p-4 text-center border rounded h-100">
                <i className="bi bi-heart-pulse display-4 mb-3 text-primary" />
                <h5>Cardiology</h5>
                <p className="text-muted mb-0">Expert heart care and diagnostic services.</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="p-4 text-center border rounded h-100">
                <i className="bi bi-brain display-4 mb-3 text-primary" />
                <h5>Neurology</h5>
                <p className="text-muted mb-0">Comprehensive neurological treatments.</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="p-4 text-center border rounded h-100">
                <i className="bi bi-hospital display-4 mb-3 text-primary" />
                <h5>General Medicine</h5>
                <p className="text-muted mb-0">Preventive care and routine checkups.</p>
              </div>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Button variant="outline-primary" as={Link} to="/doctors">
              View doctors &amp; book appointment
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}

