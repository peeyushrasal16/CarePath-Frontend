import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/common/Layout'
import Register from './components/common/user/Register'
import Login from './components/common/user/Login'
import Home from './components/Home'
import Doctors from './components/pages/Doctors'
import Appointment from './components/pages/Appointment'
import DoctorDashboard from './components/pages/DoctorDashboard'
import PatientDashboard from './components/pages/PatientDashboard'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import { LoginProvider } from './context/LoginContext'
import { ToastContainer } from 'react-toastify'
import MyAppointment from './components/pages/MyAppointment'

const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'doctors', element: <Doctors /> },
      { path: 'appointment/:doctorId', element: <Appointment /> },
      { path: 'doctor-dashboard', element: <DoctorDashboard /> },
      { path: 'patient-dashboard', element: <PatientDashboard /> },
      {path: 'my-appointments', element: <MyAppointment />},
      
      
    ],
  },
])

function App() {
  return (
    <LoginProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </LoginProvider>
  )
}

export default App
