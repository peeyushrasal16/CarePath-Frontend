import React from 'react'
import { Link } from 'react-router-dom'

export default function PageTitle({ title, subtitle, current }) {
  return (
    <div className="page-title py-4">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h1 className="mb-2">{title}</h1>
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </div>
        </div>
        <nav className="mt-2">
          <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">{current}</li>
          </ol>
        </nav>
      </div>
    </div>
  )
}
