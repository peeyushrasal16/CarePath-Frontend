import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageTitle from '../common/PageTitle'
import { api } from '../../api'
import { loginContext } from '../../context/LoginContext'
import { toast } from 'react-toastify'

export default function DoctorSlots() {
  const { doctorId } = useParams()
  const { user, isAuthenticated, token } = useContext(loginContext)
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [myAppointments, setMyAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingSlotId, setBookingSlotId] = useState(null)
  const [patient, setPatient] = useState(null)

  // -------------------- Load doctor info --------------------
  const loadDoctor = () => {
    api.get(`/doctor/${doctorId}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error('Failed to load doctor info', err))
  }

  // -------------------- Load patient info --------------------
  const loadPatient = () => {
    if (!isAuthenticated || !token) return

    api.get(`/patient/${user?.username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setPatient(res.data)
        loadMyAppointments(res.data.id)
      })
      .catch((err) => {
        console.error('Failed to load patient info', err)
        toast.error('Failed to load your patient profile')
      })
  }

  // -------------------- Load available slots --------------------
  const loadSlots = () => {
    setLoading(true)
    setError('')
    api.get(`/appointments/${doctorId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => {
        const appointments = res.data || []
        const availableSlots = appointments.filter(
          (a) => !a.patient && (a.status === 'PENDING' || a.status === 'AVAILABLE')
        )
        setSlots(availableSlots)
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load slots.')
        toast.error('Failed to load slots.')
      })
      .finally(() => setLoading(false))
  }

  // -------------------- Load my appointments --------------------
  const loadMyAppointments = (patientId) => {
    api.get(`/appointments/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setMyAppointments(res.data || []))
      .catch((err) => {
        console.error('Failed to load my appointments', err)
        toast.error('Failed to load your appointments')
      })
  }

  // -------------------- Effects --------------------
  useEffect(() => {
    if (!doctorId) return
    loadDoctor()
    loadSlots()
    loadPatient()
  }, [doctorId, user, token, isAuthenticated])

  // -------------------- Format date & time --------------------
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
    return <span className="status-pill status-pending">{status || 'Available'}</span>
  }

  // -------------------- Book Now handler --------------------
  const handleBookNow = async (slotId) => {
    if (!isAuthenticated) {
      toast.error('Please log in as a patient to book appointments.')
      navigate('/login')
      return
    }

    if (!patient?.id) {
      toast.error('Patient profile not loaded. Please ensure you are logged in as a patient.')
      return
    }

    setBookingSlotId(slotId)

    api.post(
      `/appointments/${slotId}/book`,
      {},
      {
        params: { patientId: patient.id },
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        console.log('Book response:', res.data)
        const paymentOrderId = res.data.paymentOrderId
        const amount = res.data.amount || 50000

        const options = {
          key: "rzp_test_YourKeyId",
          amount: amount,
          currency: "INR",
          name: "Clinic Management System",
          description: "Doctor Appointment Fee",
          order_id: paymentOrderId,
          handler: function (response) {
            toast.success("Payment Successful! Verifying on server...")
            api.post(
              '/appointments/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: slotId
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            )
              .then((vRes) => {
                toast.success("Payment verified! Appointment confirmed.")
                loadSlots()
                loadMyAppointments(patient.id)
              })
              .catch((vErr) => {
                console.error(vErr)
                toast.error("Payment verification failed on server.")
              })
          },
          prefill: {
            name: user?.fullName || user?.name || "Patient",
            email: user?.email || "patient@example.com",
            contact: user?.phoneNumber || "9999999999"
          },
          theme: {
            color: "#0284c7"
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      })
      .catch((err) => {
        console.error(err)
        toast.error(err.response?.data?.message || 'Failed to book appointment.')
      })
      .finally(() => {
        setBookingSlotId(null)
      })
  }

  return (
    <main className="main">
      <PageTitle
        title="Doctor Appointments"
        subtitle="Reserve an open consultation slot or view your booked appointments."
        current="Book Slot"
      />
      <section className="section py-4">
        <div className="container">
          {/* Doctor Header Profile */}
          {doctor && (
            <div className="modern-card p-4 mb-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-primary shadow-sm"
                    style={{ width: '64px', height: '64px', backgroundColor: '#e0f2fe', fontSize: '1.8rem' }}
                  >
                    <i className="bi bi-person-badge"></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-1 text-dark">{doctor.doctorName}</h3>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded-pill">
                        {doctor.specialization || 'Medical Specialist'}
                      </span>
                      {doctor.qualification && (
                        <span className="text-muted small">
                          <i className="bi bi-mortarboard me-1"></i>{doctor.qualification}
                        </span>
                      )}
                      {doctor.yearsOfExperience != null && (
                        <span className="text-muted small">
                          <i className="bi bi-award me-1"></i>{doctor.yearsOfExperience}+ Years Experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <span className="text-muted small d-block">Consultation Fee</span>
                    <strong className="text-success fs-5">₹500.00</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading slots...</p>
            </div>
          )}

          {error && <div className="alert alert-danger rounded-3"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}

          {/* Available Slots */}
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-calendar-plus text-primary me-2"></i>Available Appointment Slots
              </h5>
              <span className="badge bg-light text-dark border">
                {slots.length} Slots Available
              </span>
            </div>

            {!loading && slots.length === 0 && (
              <div className="bg-white p-4 rounded-3 text-center border shadow-sm">
                <i className="bi bi-calendar-x text-muted fs-1 mb-2 d-block"></i>
                <p className="text-muted mb-0">No slots available right now. Please check back later or check another doctor.</p>
              </div>
            )}

            {!loading && slots.length > 0 && (
              <div className="modern-table-container">
                <div className="table-responsive">
                  <table className="modern-table table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Slot Date &amp; Time</th>
                        <th>Notes / Description</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((s, index) => (
                        <tr key={s.appointmentId || index}>
                          <td><strong>{index + 1}</strong></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-clock text-primary"></i>
                              <span className="fw-semibold">
                                {formatDateTime(s.appoinmentDateTime || s.appointmentDateTime)}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted small">
                            {s.description || 'General consultation'}
                          </td>
                          <td>
                            <span className="status-pill status-scheduled">Available</span>
                          </td>
                          <td className="text-end">
                            <button
                              id="rzp-button1"
                              className="btn-modern-primary btn-sm py-1 px-3"
                              onClick={() => handleBookNow(s.appointmentId)}
                              disabled={bookingSlotId === s.appointmentId}
                            >
                              {bookingSlotId === s.appointmentId ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                  Booking...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-lightning-charge-fill"></i> Book Now
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* My Appointments with this doctor */}
          {isAuthenticated && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-bookmark-check text-success me-2"></i>My Bookings with this Doctor
                </h5>
              </div>

              {!loading && myAppointments.length === 0 && (
                <div className="bg-white p-4 rounded-3 text-center border shadow-sm">
                  <p className="text-muted mb-0">You have not booked any appointments with this doctor yet.</p>
                </div>
              )}

              {!loading && myAppointments.length > 0 && (
                <div className="modern-table-container">
                  <div className="table-responsive">
                    <table className="modern-table table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Doctor</th>
                          <th>Date &amp; Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myAppointments.map((a, index) => (
                          <tr key={a.appointmentId || index}>
                            <td>{index + 1}</td>
                            <td>
                              <span className="fw-semibold">{a.doctor?.doctorName || doctor?.doctorName || 'Doctor'}</span>
                            </td>
                            <td>{formatDateTime(a.appoinmentDateTime || a.appointmentDateTime)}</td>
                            <td>{getStatusBadge(a.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
