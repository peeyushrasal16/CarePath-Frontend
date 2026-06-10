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
      headers: { Authorization: `Bearer ${token}` } // <-- added auth header
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
      { headers: { Authorization: `Bearer ${token}` } } // <-- added auth header
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
      { headers: { Authorization: `Bearer ${token}` } } // <-- added auth header
    )
      .then(() => {
        toast.success('Slot created.')
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

  return (
    <main className="main">
      <PageTitle
        title="Doctor Dashboard"
        subtitle="Manage appointments and create available slots."
        current="Doctor Dashboard"
      />
      <section className="section">
        <div className="container">
          <div className="mb-4">
            <h3 className="mb-1">Welcome, {user?.fullName || user?.username || 'Doctor'}</h3>
            <p className="text-muted mb-0">Review appointments and create slots for patients to book.</p>
          </div>

          {doctorId && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Create available slot</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateSlot} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={slotTime}
                      onChange={(e) => setSlotTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Description (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. General checkup"
                      value={slotDesc}
                      onChange={(e) => setSlotDesc(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success" disabled={creating}>
                      {creating ? 'Creating...' : 'Create slot'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <h5 className="mb-3">Appointments</h5>
          {loading && <p>Loading appointments...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && appointments.length === 0 && (
            <p className="text-muted">No appointments yet. Create slots so patients can book.</p>
          )}
          {!loading && appointments.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Date &amp; time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {appointments.map((a, i) => (


                    <tr key={a.appointmentId || a.id}>
                      <td>{i + 1}</td>
                      <td>
                        {
                          a.patient?.user?.name ||       
                          a.patient?.user?.fullName ||   
                          a.patient?.name ||             
                          a.patientName ||              
                          'N/A'                          
                        }
                      </td>
                      {/* <td>{a.patient ? a.patient.fullName || '-' : '-'}</td> */}
                      <td>{formatDateTime(a.appoinmentDateTime || a.appointmentDateTime)}</td>
                      <td>{a.status}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={a.status}
                          onChange={(e) => handleStatusChange(a.appointmentId || a.id, e.target.value)}
                        >
                          {APPOINTMENT_STATUS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
