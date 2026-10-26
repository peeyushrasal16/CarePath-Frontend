import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { api } from "../../../api"

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "ROLE_PATIENT"
    }
  })

  const role = watch("role")
  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      const roleName = data.role
      const userPayload = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      }

      await api.post("/users/register", userPayload)
      const userEmail = data.email

      if (roleName === "ROLE_PATIENT") {
        const patientData = {
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          medicalHistory: data.medicalHistory || null,
        }
        await api.post(`/patient/register?email=${encodeURIComponent(userEmail)}`, patientData)
      }

      if (roleName === "ROLE_DOCTOR") {
        const doctorData = {
          doctorName: data.doctorName,
          specialization: data.specialization,
          yearsOfExperience: parseInt(data.yearsOfExperience, 10),
          licenseNumber: data.licenseNumber,
          qualification: data.qualification,
        }
        await api.post(`/doctor/register?email=${encodeURIComponent(userEmail)}`, doctorData)
      }

      toast.success("Registration successful! Please sign in with your credentials.")
      window.location.href = "/login"
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Registration failed. Please check the inputs.")
    }
  }

  return (
    <section className="min-vh-100 py-5" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
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
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h3 className="fw-bold mb-1">Join CarePath Digital</h3>
                <p className="mb-0 small opacity-75">
                  Create your profile to book or manage clinic appointments seamlessly
                </p>
              </div>

              {/* Form Body */}
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Account Type Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2">Registering as</label>
                    <div className="row g-3">
                      <div className="col-6">
                        <label 
                          className={`card p-3 text-center border h-100 cursor-pointer ${role === 'ROLE_PATIENT' ? 'border-primary bg-primary-subtle' : ''}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="radio"
                            value="ROLE_PATIENT"
                            className="d-none"
                            {...register("role")}
                          />
                          <i className={`bi bi-person-heart fs-3 mb-1 ${role === 'ROLE_PATIENT' ? 'text-primary' : 'text-muted'}`}></i>
                          <strong className={role === 'ROLE_PATIENT' ? 'text-primary' : 'text-dark'}>Patient</strong>
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Book &amp; consult</span>
                        </label>
                      </div>
                      <div className="col-6">
                        <label 
                          className={`card p-3 text-center border h-100 cursor-pointer ${role === 'ROLE_DOCTOR' ? 'border-primary bg-primary-subtle' : ''}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="radio"
                            value="ROLE_DOCTOR"
                            className="d-none"
                            {...register("role")}
                          />
                          <i className={`bi bi-hospital fs-3 mb-1 ${role === 'ROLE_DOCTOR' ? 'text-primary' : 'text-muted'}`}></i>
                          <strong className={role === 'ROLE_DOCTOR' ? 'text-primary' : 'text-dark'}>Doctor</strong>
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Provide care</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">
                    <i className="bi bi-shield-lock me-2"></i>Account Details
                  </h6>

                  <div className="row g-3">
                    {/* Username */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Username</label>
                      <input
                        className="form-control modern-input"
                        placeholder="john_doe"
                        {...register("username", {
                          required: "Username is required",
                          minLength: { value: 3, message: "Minimum 3 characters" },
                          maxLength: { value: 20, message: "Maximum 20 characters" },
                          pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Letters, numbers, and underscores only" },
                        })}
                      />
                      {errors.username && <small className="text-danger d-block mt-1">{errors.username.message}</small>}
                    </div>

                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Full Name</label>
                      <input
                        className="form-control modern-input"
                        placeholder="John Doe"
                        {...register("fullName", {
                          required: "Full Name is required",
                          pattern: { value: /^[a-zA-Z\s]+$/, message: "Letters and spaces only" },
                        })}
                      />
                      {errors.fullName && <small className="text-danger d-block mt-1">{errors.fullName.message}</small>}
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Email Address</label>
                      <input
                        type="email"
                        className="form-control modern-input"
                        placeholder="john@example.com"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Valid email required" },
                        })}
                      />
                      {errors.email && <small className="text-danger d-block mt-1">{errors.email.message}</small>}
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Phone Number</label>
                      <input
                        className="form-control modern-input"
                        placeholder="9876543210"
                        {...register("phoneNumber", {
                          required: "Phone number is required",
                          pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit Indian phone number starting 6-9" },
                        })}
                      />
                      {errors.phoneNumber && <small className="text-danger d-block mt-1">{errors.phoneNumber.message}</small>}
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Password</label>
                      <input
                        type="password"
                        className="form-control modern-input"
                        placeholder="••••••••"
                        {...register("password", {
                          required: "Password is required",
                          minLength: { value: 6, message: "Minimum 6 characters" },
                        })}
                      />
                      {errors.password && <small className="text-danger d-block mt-1">{errors.password.message}</small>}
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control modern-input"
                        placeholder="••••••••"
                        {...register("confirmPassword", {
                          required: "Please confirm password",
                          validate: (val) => val === password || "Passwords do not match",
                        })}
                      />
                      {errors.confirmPassword && <small className="text-danger d-block mt-1">{errors.confirmPassword.message}</small>}
                    </div>
                  </div>

                  {/* Patient Specific Fields */}
                  {role === "ROLE_PATIENT" && (
                    <div className="mt-4 pt-3 border-top">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="bi bi-file-earmark-medical me-2"></i>Patient Profile Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">Date of Birth</label>
                          <input
                            type="date"
                            className="form-control modern-input"
                            {...register("dateOfBirth", { required: "Date of Birth is required" })}
                          />
                          {errors.dateOfBirth && <small className="text-danger d-block mt-1">{errors.dateOfBirth.message}</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">Gender</label>
                          <select
                            className="form-select modern-input"
                            {...register("gender", { required: "Gender is required" })}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.gender && <small className="text-danger d-block mt-1">{errors.gender.message}</small>}
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold small text-secondary">Residential Address</label>
                          <input
                            className="form-control modern-input"
                            placeholder="Street, City, Pin Code"
                            {...register("address", { required: "Address is required" })}
                          />
                          {errors.address && <small className="text-danger d-block mt-1">{errors.address.message}</small>}
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold small text-secondary">Medical History (Optional)</label>
                          <textarea
                            className="form-control modern-input"
                            rows="2"
                            placeholder="Any known allergies, chronic conditions, or previous treatments..."
                            {...register("medicalHistory")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Doctor Specific Fields */}
                  {role === "ROLE_DOCTOR" && (
                    <div className="mt-4 pt-3 border-top">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="bi bi-award me-2"></i>Doctor Credentials &amp; Specialty
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">Doctor Title &amp; Name</label>
                          <input
                            className="form-control modern-input"
                            placeholder="Dr. John Smith"
                            {...register("doctorName", { required: "Doctor name is required" })}
                          />
                          {errors.doctorName && <small className="text-danger d-block mt-1">{errors.doctorName.message}</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">Specialization</label>
                          <input
                            className="form-control modern-input"
                            placeholder="Cardiologist, Neurologist, etc."
                            {...register("specialization", { required: "Specialization is required" })}
                          />
                          {errors.specialization && <small className="text-danger d-block mt-1">{errors.specialization.message}</small>}
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold small text-secondary">Years of Experience</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control modern-input"
                            placeholder="e.g. 8"
                            {...register("yearsOfExperience", { required: "Experience is required" })}
                          />
                          {errors.yearsOfExperience && <small className="text-danger d-block mt-1">{errors.yearsOfExperience.message}</small>}
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold small text-secondary">License Number</label>
                          <input
                            className="form-control modern-input"
                            placeholder="MCI-123456"
                            {...register("licenseNumber", { required: "License number is required" })}
                          />
                          {errors.licenseNumber && <small className="text-danger d-block mt-1">{errors.licenseNumber.message}</small>}
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold small text-secondary">Qualification</label>
                          <input
                            className="form-control modern-input"
                            placeholder="MBBS, MD"
                            {...register("qualification", { required: "Qualification is required" })}
                          />
                          {errors.qualification && <small className="text-danger d-block mt-1">{errors.qualification.message}</small>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="mt-4 pt-2">
                    <button
                      type="submit"
                      className="btn-modern-primary w-100 py-3 fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Registering Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-1"></i> Complete Registration
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="mb-0 small text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                      Sign in here
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

export default Register
