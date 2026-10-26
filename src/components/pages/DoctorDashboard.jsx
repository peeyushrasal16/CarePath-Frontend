import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../common/PageTitle'
import { api } from '../../api'
import { loginContext } from '../../context/LoginContext'
import { toast } from 'react-toastify'

const APPOINTMENT_STATUS = ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED']

export default function DoctorDashboard() {
  const { token, user } = useContext(loginContext)
  const doctorId = user?.doctor?.id

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slotDate, setSlotDate] = useState('')
  const [slotTime, setSlotTime] = useState('')
  const [slotDesc, setSlotDesc] = useState('')
  const [creating, setCreating] = useState(false)

  // Load doctor's appointments from backend
  const loadAppointments = () => {
    if (!token || !doctorId) return

    setLoading(true)
    setError('')
    api.get(`/appointments/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setAppointments(res.data || []))
      .catch((err) => {
        console.error(err)
        setError('Failed to load appointments.')
        toast.error('Failed to load appointments.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAppointments()
  }, [token, doctorId])

  // Change appointment status
  const handleStatusChange = (appointmentId, newStatus) => {
    if (!token || !appointmentId) return

    api.put(
      `/appointments/${appointmentId}/status?status=${newStatus}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setAppointments((prev) =>
          prev.map((a) =>
            (a.appointmentId || a.id) === appointmentId ? { ...a, status: newStatus } : a
          )
        )
        toast.success('Status updated.')
      })
      .catch((err) => {
        console.error(err)
        toast.error(err.response?.data?.message || 'Failed to update status.')
      })
  }

  // Create new slot for appointments
  const handleCreateSlot = (e) => {
    e.preventDefault()
    if (!doctorId || !slotDate || !slotTime) {
      toast.error('Please set date and time.')
      return
    }
    const appoinmentDateTime = `${slotDate}T${slotTime}:00`
    setCreating(true)
    api.post(
      `/appointments/${doctorId}/create`,
      {
        appoinmentDateTime,
        description: slotDesc || null,
        status: 'PENDING'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        toast.success('Slot created successfully!')
        setSlotDate('')
        setSlotTime('')
        setSlotDesc('')
        loadAppointments()
      })
      .catch((err) => {
        console.error(err)
        toast.error(err.response?.data?.message || 'Failed to create slot.')
      })
      .finally(() => setCreating(false))
  }

  // Format date-time for display
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

  // Quick metrics
  const totalSlots = appointments.length
  const bookedSlots = appointments.filter(a => a.patient || a.patientName).length
  const pendingSlots = appointments.filter(a => a.status === 'PENDING').length
  const completedSlots = appointments.filter(a => a.status === 'COMPLETED').length

  return (
    <main className="main">
      <PageTitle
        title="Doctor Portal"
        subtitle="Manage consultation schedule, create new patient slots, and update visit records."
        current="Doctor Dashboard"
      />
      <section className="section py-4">
        <div className="container">
          {/* Welcome Profile Bar */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-primary"
                style={{ width: '56px', height: '56px', backgroundColor: '#e0f2fe', fontSize: '1.6rem' }}
              >
                <i className="bi bi-hospital"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-1 text-dark">
                  Welcome, Dr. {user?.fullName || user?.username || 'Doctor'}
                </h4>
                <p className="text-muted small mb-0">
                  Manage patient consultations, add available time slots, and monitor treatment statuses.
                </p>
              </div>
            </div>

            <button 
              className="btn btn-outline-primary btn-sm rounded-pill px-3"
              onClick={loadAppointments}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{totalSlots}</h3>
                  <span className="text-muted small">Total Slots</span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{bookedSlots}</h3>
                  <span className="text-muted small">Booked Patients</span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-hourglass-split"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{pendingSlots}</h3>
                  <span className="text-muted small">Pending Slots</span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-check2-circle"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{completedSlots}</h3>
                  <span className="text-muted small">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slot Creation Form */}
          {doctorId && (
            <div className="modern-card mb-4 border shadow-sm">
              <div className="p-4 border-bottom bg-light">
                <h5 className="fw-bold mb-1 text-dark">
                  <i className="bi bi-plus-circle text-primary me-2"></i>Create New Available Slot
                </h5>
                <span className="text-muted small">Set date, time, and optional notes for patients to book</span>
              </div>
              <div className="p-4">
                <form onSubmit={handleCreateSlot} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Slot Date</label>
                    <input
                      type="date"
                      className="form-control modern-input"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Slot Time</label>
                    <input
                      type="time"
                      className="form-control modern-input"
                      value={slotTime}
                      onChange={(e) => setSlotTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Notes / Session Details (optional)</label>
                    <input
                      type="text"
                      className="form-control modern-input"
                      placeholder="e.g. General OPD / Routine Review"
                      value={slotDesc}
                      onChange={(e) => setSlotDesc(e.target.value)}
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <button type="submit" className="btn-modern-primary" disabled={creating}>
                      {creating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Publishing Slot...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i> Publish Slot
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Appointments Table */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-calendar2-range text-primary me-2"></i>All Appointments &amp; Slots
              </h5>
              <span className="badge bg-light text-muted border">
                {appointments.length} Entries
              </span>
            </div>

            {loading && (
              <div className="text-center py-4 bg-white rounded-3 shadow-sm border">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted small">Loading appointments...</p>
              </div>
            )}

            {error && <div className="alert alert-danger rounded-3"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}

            {!loading && !error && appointments.length === 0 && (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm border">
                <i className="bi bi-calendar-x text-muted display-4 mb-2 d-block"></i>
                <h5 className="fw-bold">No appointment slots yet</h5>
                <p className="text-muted small">Use the form above to add available consultation slots for your patients.</p>
              </div>
            )}

            {!loading && appointments.length > 0 && (
              <div className="modern-table-container">
                <div className="table-responsive">
                  <table className="modern-table table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Patient Name</th>
                        <th>Date &amp; Time</th>
                        <th>Notes</th>
                        <th>Status</th>
                        <th style={{ width: '180px' }}>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a, i) => {
                        const patName =
                          a.patient?.user?.name ||
                          a.patient?.user?.fullName ||
                          a.patient?.name ||
                          a.patientName ||
                          null

                        return (
                          <tr key={a.appointmentId || a.id}>
                            <td><strong>{i + 1}</strong></td>
                            <td>
                              {patName ? (
                                <div className="d-flex align-items-center gap-2">
                                  <div 
                                    className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center"
                                    style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                                  >
                                    <i className="bi bi-person-fill"></i>
                                  </div>
                                  <span className="fw-semibold text-dark">{patName}</span>
                                </div>
                              ) : (
                                <span className="badge bg-light text-muted border">
                                  <i className="bi bi-dash-circle me-1"></i>Unbooked Slot
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-clock text-secondary"></i>
                                <span>{formatDateTime(a.appoinmentDateTime || a.appointmentDateTime)}</span>
                              </div>
                            </td>
                            <td className="text-muted small">
                              {a.description || '-'}
                            </td>
                            <td>
                              {getStatusBadge(a.status)}
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm rounded-3 shadow-none border"
                                value={a.status}
                                onChange={(e) => handleStatusChange(a.appointmentId || a.id, e.target.value)}
                              >
                                {APPOINTMENT_STATUS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
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
