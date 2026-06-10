import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../../api'
import { loginContext } from '../../../context/LoginContext';
import { toast } from 'react-toastify';

function Login() {
   const {login}= useContext(loginContext);
 const navigate=useNavigate();
  const {register,handleSubmit,watch,formState:{errors}}=useForm();
 
  const onSubmit = async (data) => {
  console.log(data);

  try {
    const response = await api.post('/auth/login', data); // wait for response

    console.log(response);

    const userDto = response.data.userDto;
    const token = response.data.token;

    // Persist auth in context/localStorage
    login(userDto, token);

    // Derive role name from backend response (adjust if your field is different)
    const roleName = userDto?.roleName ?? userDto?.role?.roleName ?? (Array.isArray(userDto?.roles) ? userDto.roles[0] : null);

    if (roleName === 'ROLE_DOCTOR') {
      localStorage.setItem('role', 'DOCTOR');
      navigate('/doctor-dashboard');
    } else {
      // default to patient
      localStorage.setItem('role', 'PATIENT');
      navigate('/patient-dashboard');
    }

    toast.success("Login successful");
  } catch (error) {
    const msg = error.response?.status === 401
      ? "Invalid email or password."
      : (typeof error.response?.data === "string" ? error.response.data : "Login failed.");
    toast.error(msg);
  }
};

  
  
  return (
    <div>
      <section className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">

              {/* Header */}
              <div className="card-header bg-success text-white text-center py-4 rounded-top-4">
                <h2 className="fw-bold mb-1">CarePath Digital ⚕️💻</h2>
                <p className="mb-0 small">
                  Please log in to continue managing your health journey.
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      {...register("email",{required:"Email is required"})}
                    />
                    {errors.email && <small className='text-danger'>{errors.email.message}</small>}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      {...register("password",{required:"Password is required"})}
                    />
                    {errors.password && <small className='text-danger'>{errors.password.message}</small>}
                  </div>

                  {/* Remember / Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>

                    <a href="#" className="text-success small fw-semibold">
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg fw-semibold"
                    >
                      Login
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="mb-1 small text-muted">
                    Same login for Admin & User
                  </p>
                  <p className="mb-0">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-success fw-semibold">
                      Register
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
      
      
      
    </div>
  )
}

export default Login
