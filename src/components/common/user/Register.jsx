import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../../../api";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const role = watch("role");
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const roleName = data.role;
      const userPayload = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      };

      await api.post("/users/register", userPayload);
      const userEmail = data.email;

      if (roleName === "ROLE_PATIENT") {
        const patientData = {
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          medicalHistory: data.medicalHistory || null,
        };
        await api.post(`/patient/register?email=${encodeURIComponent(userEmail)}`, patientData);
      }

      if (roleName === "ROLE_DOCTOR") {
        const doctorData = {
          doctorName: data.doctorName,
          specialization: data.specialization,
          yearsOfExperience: parseInt(data.yearsOfExperience, 10),
          licenseNumber: data.licenseNumber,
          qualification: data.qualification,
        };
        await api.post(`/doctor/register?email=${encodeURIComponent(userEmail)}`, doctorData);
      }

      toast.success("Registration successful. Please log in.");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const errorStyle = { display: "block", marginTop: "4px", marginBottom: "8px" };

  return (
    <section className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-8 col-lg-7">
            <div className="card border-0 shadow-lg rounded-4">

              {/* Header */}
              <div className="card-header bg-success text-white text-center py-4 rounded-top-4">
                <h2 className="fw-bold mb-1">CarePath Digital ⚕️💻</h2>
                <p className="mb-0 small">
                  Create your account to start managing your health journey.
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">

                <h3 className="text-center mb-4">Register</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Username */}
                  <label className="form-label fw-bold">User Name</label>
                  <input
                    className="form-control form-control-lg mb-2"
                    placeholder="Enter Username"
                    {...register("username", {
                      required: "Username is required",
                      minLength: { value: 3, message: "Username must be at least 3 characters" },
                      maxLength: { value: 20, message: "Username must be at most 20 characters" },
                      pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers, and underscores allowed" },
                    })}
                  />
                  {errors.username && <small className="text-danger" style={errorStyle}>{errors.username.message}</small>}

                  {/* Full Name */}
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    className="form-control form-control-lg mb-2"
                    placeholder="Enter your Full Name"
                    {...register("fullName", {
                      required: "Full Name is required",
                      minLength: { value: 3, message: "Full Name must be at least 3 characters" },
                      maxLength: { value: 50, message: "Full Name must be at most 50 characters" },
                    })}
                  />
                  {errors.fullName && <small className="text-danger" style={errorStyle}>{errors.fullName.message}</small>}

                  {/* Email */}
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg mb-2"
                    placeholder="Enter your Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && <small className="text-danger" style={errorStyle}>{errors.email.message}</small>}

                  {/* Password */}
                  <label className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg mb-2"
                    placeholder="Create a Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                  />
                  {errors.password && <small className="text-danger" style={errorStyle}>{errors.password.message}</small>}

                  {/* Confirm Password */}
                  <label className="form-label fw-bold">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg mb-2"
                    placeholder="Re-enter password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (v) => v === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && <small className="text-danger" style={errorStyle}>{errors.confirmPassword.message}</small>}

                  {/* Phone */}
                  <label className="form-label fw-bold">Phone Number</label>
                  <input
                    className="form-control form-control-lg mb-2"
                    placeholder="Enter your Phone Number"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" },
                    })}
                  />
                  {errors.phoneNumber && <small className="text-danger" style={errorStyle}>{errors.phoneNumber.message}</small>}

                  {/* Role */}
                  <label className="form-label fw-bold">Role</label>
                  <select
                    className="form-select form-select-lg mb-3"
                    {...register("role", { required: "Role is required" })}
                  >
                    <option value="">Select Role</option>
                    <option value="ROLE_PATIENT">Patient</option>
                    <option value="ROLE_DOCTOR">Doctor</option>
                  </select>
                  {errors.role && <small className="text-danger" style={errorStyle}>{errors.role.message}</small>}

                  {/* Doctor */}
                  {role === "ROLE_DOCTOR" && (
                    <>
                      <h5>Doctor Details</h5>

                      <label className="form-label fw-bold">Doctor Name</label>
                      <input className="form-control form-control-lg mb-2" {...register("doctorName", { required: "Doctor Name is required" })} />
                      {errors.doctorName && <small className="text-danger">{errors.doctorName.message}</small>}

                      <label className="form-label fw-bold">Specialization</label>
                      <input className="form-control form-control-lg mb-2" {...register("specialization", { required: "Specialization is required" })} />
                      {errors.specialization && <small className="text-danger">{errors.specialization.message}</small>}

                      <label className="form-label fw-bold">Experience</label>
                      <input type="number" className="form-control form-control-lg mb-2" {...register("yearsOfExperience", { required: "Experience is required" })} />
                      {errors.yearsOfExperience && <small className="text-danger">{errors.yearsOfExperience.message}</small>}

                      <label className="form-label fw-bold">License Number</label>
                      <input className="form-control form-control-lg mb-2" {...register("licenseNumber", { required: "License Number is required" })} />
                      {errors.licenseNumber && <small className="text-danger">{errors.licenseNumber.message}</small>}

                      <label className="form-label fw-bold">Qualification</label>
                      <input className="form-control form-control-lg mb-3" {...register("qualification", { required: "Qualification is required" })} />
                      {errors.qualification && <small className="text-danger">{errors.qualification.message}</small>}
                    </>
                  )}

                  {/* Patient */}
                  {role === "ROLE_PATIENT" && (
                    <>
                      <h5>Patient Details</h5>

                      <label className="form-label fw-bold">Date of Birth</label>
                      <input type="date" className="form-control form-control-lg mb-2" {...register("dateOfBirth", { required: "Date of Birth is required" })} />
                      {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth.message}</small>}

                      <label className="form-label fw-bold">Gender</label>
                      <select className="form-select form-select-lg mb-2" {...register("gender", { required: "Gender is required" })}>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>

                      <label className="form-label fw-bold">Address</label>
                      <input className="form-control form-control-lg mb-2" {...register("address", { required: "Address is required" })} />

                      <label className="form-label fw-bold">Medical History</label>
                      <textarea className="form-control form-control-lg mb-3" {...register("medicalHistory")} />
                    </>
                  )}

                  {/* Button */}
                  <button className="btn btn-success btn-lg w-100 fw-semibold">
                    Register
                  </button>

                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Register;