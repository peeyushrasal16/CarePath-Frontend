import React, { useContext, useEffect, useState } from 'react';
import PageTitle from '../common/PageTitle';
import { api } from '../../api';
import { loginContext } from '../../context/LoginContext';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { token, user } = useContext(loginContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError('');

    api.get('/appointments/patient')
      .then((res) => setAppointments(res.data || []))
      .catch((err) => {
        console.error(err);
        setError('Failed to load appointments.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="main">
      <PageTitle
        title="Patient Dashboard"
        subtitle="View your appointments and manage your care."
        current="Patient Dashboard"
      />

      <section className="section">
        <div className="container">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">
                Welcome, {user?.fullName || user?.username || 'Patient'}
              </h3>
              <p className="text-muted mb-0">
                Here you can see your booked appointments with doctors.
              </p>
            </div>
            <div>
              <Link to="/doctors" className="btn btn-primary">
                Book New Appointment
              </Link>
            </div>
          </div>

          {loading && <p>Loading appointments...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && !error && appointments.length === 0 && (
            <p>No appointments found. Click &quot;Book New Appointment&quot; to get started.</p>
          )}

          {!loading && appointments.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, index) => (
                    <tr key={a.id || index}>
                      <td>{index + 1}</td>
                      <td>{a.doctorName || (a.doctor && a.doctor.doctorName)}</td>
                      <td>
                        {a.appoinmentDateTime
                          ? new Date(a.appoinmentDateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                          : (a.appointmentDateTime || a.dateTime || '-')}
                      </td>
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
  );
}
