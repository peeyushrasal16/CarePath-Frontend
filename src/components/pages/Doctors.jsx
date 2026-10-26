import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitle from '../common/PageTitle'
import { api } from '../../api'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    api.get('/doctor')
      .then((res) => setDoctors(res.data || []))
      .catch((err) => {
        console.error(err)
        setError('Failed to load doctors.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredDoctors = doctors.filter((d) => {
    const q = searchQuery.toLowerCase()
    return (
      (d.doctorName && d.doctorName.toLowerCase().includes(q)) ||
      (d.specialization && d.specialization.toLowerCase().includes(q)) ||
      (d.qualification && d.qualification.toLowerCase().includes(q))
    )
  })

  return (
    <main className="main">
      <PageTitle
        title="Our Medical Specialists"
        subtitle="Choose a certified doctor to view available slots and book your appointment."
        current="Doctors"
      />
      <section className="section py-5">
        <div className="container">
          {/* Search bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 col-lg-5">
              <div className="input-group shadow-sm rounded-pill overflow-hidden border">
                <span className="input-group-text bg-white border-0 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-2"
                  placeholder="Search by doctor name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="btn btn-white border-0 text-muted" 
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading doctors...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center max-w-600 mx-auto rounded-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          )}

          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4">
              <i className="bi bi-person-x display-3 text-muted mb-3"></i>
              <h5 className="fw-bold">No doctors found</h5>
              <p className="text-muted small">Try a different search query or check back later.</p>
            </div>
          )}

          {!loading && filteredDoctors.length > 0 && (
            <div className="row g-4">
              {filteredDoctors.map((d) => (
                <div key={d.id} className="col-md-6 col-lg-4">
                  <div className="modern-card h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      {/* Doctor Top Avatar & Status */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-primary shadow-sm"
                          style={{ width: '56px', height: '56px', backgroundColor: '#e0f2fe', fontSize: '1.5rem' }}
                        >
                          <i className="bi bi-person-badge"></i>
                        </div>
                        <div>
                          <h5 className="fw-bold mb-0 text-dark">{d.doctorName}</h5>
                          <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded-pill small">
                            {d.specialization || 'Specialist'}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 border-top border-bottom my-3">
                        {d.qualification && (
                          <div className="d-flex align-items-center gap-2 mb-1 text-muted small">
                            <i className="bi bi-mortarboard text-secondary"></i>
                            <span>{d.qualification}</span>
                          </div>
                        )}
                        {d.yearsOfExperience != null && (
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <i className="bi bi-award text-secondary"></i>
                            <span><strong>{d.yearsOfExperience}+</strong> years of clinical experience</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link 
                        to={`/appointment/${d.id}`} 
                        className="btn-modern-primary w-100 py-2 d-flex justify-content-center align-items-center gap-2"
                      >
                        <i className="bi bi-calendar2-check"></i> Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
