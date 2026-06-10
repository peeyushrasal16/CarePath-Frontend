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
        console.log("Patient fetched:", res.data)
        loadMyAppointments(res.data.id) // Load my appointments once patient is fetched
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

  // -------------------- Book Now handler --------------------
  const handleBookNow = async (slotId) => {
    if (!isAuthenticated) {
      toast.error('Please log in as a patient to book appointments.')
      navigate('/login')
      return
    }

    if (!patient || !patient.id) {
      console.error("Patient object missing or no ID:", patient)
      toast.error('Patient profile missing. Please complete your registration.')
      return
    }

    setBookingSlotId(slotId)
  const reponse=  await api.put(`/appointments/book/${patient.id}/${slotId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((data) => {
        toast.success('Appointment booked successfully!')
        setBookingSlotId(null)
        loadSlots() // refresh available slots
        loadMyAppointments(patient.id) // refresh my appointments

    const { razorpayOrderId, amount,appointmentId } = data.data

        console.log(data)
        

        // razorpay4
 var options = {
    "key": "rzp_test_S060WMnc2eFoWe", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. 
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature)

         api.post(`/appointments/confirm`, {
  razorpayOrderId: response.razorpay_order_id,
  razorpayPaymentId: response.razorpay_payment_id,
  razorpaySignature: response.razorpay_signature
}, {
  headers: { Authorization: `Bearer ${token}` }
})



    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "+919876543210"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});
const rzp = new window.Razorpay(options)
  rzp.open()

        // =======

        
      })
      .catch((err) => {
        console.error(err)
        toast.error(err.response?.data?.message || 'Failed to book appointment.')
        setBookingSlotId(null)
      })
  }

  

  // -------------------- Render --------------------
  return (
    <main className="main">
      <PageTitle
        title="Doctor Appointments"
        subtitle="Book a new slot or view your appointments."
        current="Doctor Slots"
      />
      <section className="section">
        <div className="container">
          {loading && <p>Loading slots...</p>}
          {error && <p className="text-danger">{error}</p>}

          {doctor && (
            <div className="mb-4">
              <h4>{doctor.doctorName}</h4>
              <p className="text-muted mb-1">{doctor.specialization}</p>
              {doctor.qualification && <p className="small mb-1">{doctor.qualification}</p>}
              {doctor.yearsOfExperience != null && (
                <p className="small">{doctor.yearsOfExperience}+ years experience</p>
              )}
            </div>
          )}

          {/* Available Slots */}
          <h5>Available Slots</h5>
          {!loading && slots.length === 0 && (
            <p className="text-muted">No available slots at the moment.</p>
          )}
          {!loading && slots.length > 0 && (
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Slot Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s, index) => (
                    <tr key={s.appointmentId || index}>
                      <td>{index + 1}</td>
                      <td>{formatDateTime(s.appoinmentDateTime || s.appointmentDateTime)}</td>
                      <td>Available</td>
                      <td>
                        <button
                          id='rzp-button1'
                          className="btn btn-primary btn-sm"
                          onClick={() => handleBookNow(s.appointmentId)}
                          disabled={bookingSlotId === s.appointmentId}
                        >
                          {bookingSlotId === s.appointmentId ? 'Booking...' : 'Book Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* My Appointments */}
          <h5>My Appointments</h5>
          {!loading && myAppointments.length === 0 && (
            <p className="text-muted">You have not booked any appointments yet.</p>
          )}
          {!loading && myAppointments.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Slot Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map((a, index) => (
                    <tr key={a.appointmentId || index}>
                      <td>{index + 1}</td>
                      <td>{a.doctor?.doctorName || '-'}</td>
                      <td>{formatDateTime(a.appoinmentDateTime || a.appointmentDateTime)}</td>
                      <td>{a.status}</td>
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
