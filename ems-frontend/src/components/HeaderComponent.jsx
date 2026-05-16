import React from 'react'
import { NavLink } from 'react-router-dom'

const HeaderComponent = () => {
  return (
    <header className='app-header shadow-sm'>
      <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
        <div className='container-fluid'>
          <NavLink className='navbar-brand d-flex align-items-center gap-2 fw-bold' to='/'>
            <span className='brand-mark'>EMS</span>
            <span className='brand-text'>Employee Management</span>
          </NavLink>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#mainNavbar'
            aria-controls='mainNavbar'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>

          <div className='collapse navbar-collapse' id='mainNavbar'>
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to='/employees'>
                  Employees
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to='/departments'>
                  Departments
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default HeaderComponent