import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitle from '../common/PageTitle'
import { api } from '../../api'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/doctor')
      .then((res) => setDoctors(res.data || []))
      .catch((err) => {
        console.error(err)
        setError('Failed to load doctors.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="main">
      <PageTitle
        title="Our Doctors"
        subtitle="Choose a doctor to book an appointment."
        current="Doctors"
      />
      <section className="section">
        <div className="container">
          {loading && <p>Loading doctors...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && doctors.length === 0 && (
            <p>No doctors found.</p>
          )}
          {!loading && doctors.length > 0 && (
            <div className="row g-4">
              {doctors.map((d) => (
                <div key={d.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{d.doctorName}</h5>
                      <p className="card-text text-muted mb-1">{d.specialization}</p>
                      {d.qualification && <p className="card-text small mb-1">{d.qualification}</p>}
                      {d.yearsOfExperience != null && (
                        <p className="card-text small">{d.yearsOfExperience}+ years experience</p>
                      )}
                      <Link to={`/appointment/${d.id}`} className="btn btn-primary mt-2">
                        Book Appointment
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
