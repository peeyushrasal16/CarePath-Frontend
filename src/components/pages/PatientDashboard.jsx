import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../common/PageTitle'
import { api } from '../../api'
import { loginContext } from '../../context/LoginContext'
import { Link } from 'react-router-dom'

export default function PatientDashboard() {
  const { token, user } = useContext(loginContext)

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAppointments = () => {
    if (!token) return

    setLoading(true)
    setError('')

    api.get('/appointments/patient')
      .then((res) => setAppointments(res.data || []))
      .catch((err) => {
        console.error(err)
        setError('Failed to load appointments.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAppointments()
  }, [token])

  const formatDateTime = (dt) => {
    if (!dt) return '-'
    const d = new Date(dt)
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  }

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase()
    if (s === 'COMPLETED') return <span className="status-pill status-completed">Completed</span>
    if (s === 'SCHEDULED') return <span className="status-pill status-scheduled">Scheduled</span>
    if (s === 'CANCELLED') return <span className="status-pill status-cancelled">Cancelled</span>
    return <span className="status-pill status-pending">{status || 'Pending'}</span>
  }

  const totalCount = appointments.length
  const completedCount = appointments.filter(a => (a.status || '').toUpperCase() === 'COMPLETED').length
  const activeCount = appointments.filter(a => ['SCHEDULED', 'PENDING'].includes((a.status || '').toUpperCase())).length

  return (
    <main className="main">
      <PageTitle
        title="Patient Health Portal"
        subtitle="Review your consultation history, view booked appointments, and connect with doctors."
        current="Patient Dashboard"
      />

      <section className="section py-4">
        <div className="container">
          {/* Welcome Card */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-primary shadow-sm"
                style={{ width: '56px', height: '56px', backgroundColor: '#e0f2fe', fontSize: '1.6rem' }}
              >
                <i className="bi bi-person-heart"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-1 text-dark">
                  Hello, {user?.fullName || user?.username || 'Patient'}
                </h4>
                <p className="text-muted small mb-0">
                  Track your medical bookings and consult top specialists easily.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                onClick={fetchAppointments}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
              <Link to="/doctors" className="btn-modern-primary btn-sm py-2 px-3">
                <i className="bi bi-calendar-plus"></i> Book New Appointment
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-calendar2-check"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{totalCount}</h3>
                  <span className="text-muted small">Total Bookings</span>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{activeCount}</h3>
                  <span className="text-muted small">Upcoming / Active</span>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{completedCount}</h3>
                  <span className="text-muted small">Completed Consultations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Appointments */}
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-card-checklist text-primary me-2"></i>My Consultation History
              </h5>
              <span className="badge bg-light text-muted border">
                {appointments.length} Consultations
              </span>
            </div>

            {loading && (
              <div className="text-center py-4 bg-white rounded-3 shadow-sm border">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted small">Loading your appointments...</p>
              </div>
            )}

            {error && <div className="alert alert-danger rounded-3"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}

            {!loading && !error && appointments.length === 0 && (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm border">
                <i className="bi bi-calendar-x text-muted display-4 mb-3 d-block"></i>
                <h5 className="fw-bold">No appointments found yet</h5>
                <p className="text-muted small mb-3">You haven't scheduled any doctor consultations yet.</p>
                <Link to="/doctors" className="btn-modern-primary">
                  <i className="bi bi-search"></i> Find a Doctor &amp; Book Now
                </Link>
              </div>
            )}

            {!loading && appointments.length > 0 && (
              <div className="modern-table-container">
                <div className="table-responsive">
                  <table className="modern-table table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Doctor</th>
                        <th>Consultation Date &amp; Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a, index) => {
                        const docName = a.doctorName || (a.doctor && a.doctor.doctorName) || 'Doctor Specialist'
                        const rawDate = a.appoinmentDateTime || a.appointmentDateTime || a.dateTime

                        return (
                          <tr key={a.id || index}>
                            <td><strong>{index + 1}</strong></td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div 
                                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                                  style={{ width: '34px', height: '34px', fontSize: '0.95rem' }}
                                >
                                  <i className="bi bi-person-badge"></i>
                                </div>
                                <span className="fw-semibold text-dark">{docName}</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-calendar-event text-secondary"></i>
                                <span>{formatDateTime(rawDate)}</span>
                              </div>
                            </td>
                            <td>{getStatusBadge(a.status)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
