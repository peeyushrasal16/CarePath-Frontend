import React from 'react'
import { Link } from 'react-router-dom'

export default function PageTitle({ title, subtitle, current }) {
  return (
    <div className="page-header-banner mb-4">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h1 className="mb-2">{title}</h1>
            {subtitle && <p className="text-light opacity-75 fs-6 mb-3">{subtitle}</p>}
            <nav>
              <ol className="breadcrumb breadcrumb-modern justify-content-center mb-0">
                <li className="breadcrumb-item"><Link to="/"><i className="bi bi-house-door me-1"></i>Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{current}</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
