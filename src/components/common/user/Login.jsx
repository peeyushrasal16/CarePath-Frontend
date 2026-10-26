import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../../api'
import { loginContext } from '../../../context/LoginContext'
import { toast } from 'react-toastify'

function Login() {
  const { login } = useContext(loginContext)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data)

      const userDto = response.data.userDto
      const token = response.data.token

      // Persist auth in context/localStorage
      login(userDto, token)

      const roleName = userDto?.roleName ?? userDto?.role?.roleName ?? (Array.isArray(userDto?.roles) ? userDto.roles[0] : null)

      if (roleName === 'ROLE_DOCTOR') {
        localStorage.setItem('role', 'DOCTOR')
        navigate('/doctor-dashboard')
      } else {
        localStorage.setItem('role', 'PATIENT')
        navigate('/patient-dashboard')
      }

      toast.success("Welcome back! Login successful.")
    } catch (error) {
      const msg = error.response?.status === 401
        ? "Invalid email or password."
        : (typeof error.response?.data === "string" ? error.response.data : "Login failed.")
      toast.error(msg)
    }
  }

  return (
    <section className="min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="modern-card border-0 shadow-lg">
              {/* Header */}
              <div 
                className="text-white text-center py-4 px-4"
                style={{ background: 'var(--primary-gradient)' }}
              >
                <div 
                  className="rounded-circle bg-white text-primary mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}
                >
                  <i className="bi bi-hospital"></i>
                </div>
                <h3 className="fw-bold mb-1">CarePath Digital</h3>
                <p className="mb-0 small opacity-75">
                  Sign in to access your consultations and appointments
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control modern-input border-start-0"
                        placeholder="name@example.com"
                        {...register("email", { required: "Email is required" })}
                      />
                    </div>
                    {errors.email && <small className="text-danger mt-1 d-block">{errors.email.message}</small>}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control modern-input border-start-0"
                        placeholder="Enter your password"
                        {...register("password", { required: "Password is required" })}
                      />
                    </div>
                    {errors.password && <small className="text-danger mt-1 d-block">{errors.password.message}</small>}
                  </div>

                  {/* Remember / Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label small text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>

                    <a href="#!" className="text-primary small fw-semibold text-decoration-none">
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn-modern-primary w-100 py-3 fw-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="mb-1 small text-muted">
                    Single unified login for Patients &amp; Doctors
                  </p>
                  <p className="mb-0 small">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-primary fw-bold text-decoration-none">
                      Create an Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
