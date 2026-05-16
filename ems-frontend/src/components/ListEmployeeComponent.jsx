import React, { useEffect, useState } from 'react'
import { deleteEmployee, listEmployees } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ToastProvider'

const ListEmployeeComponent = () => {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()
  const showToast = useToast()

  useEffect(() => {
    getAllEmployees()
  }, [])

  // debounce searchTerm -> debouncedTerm to reduce filtering frequency
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  function getAllEmployees() {
    listEmployees()
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error(error))
  }

  function addNewEmployee() {
    navigate('/add-employee')
  }

  function updateEmployee(id) {
    navigate(`/update-employee/${id}`)
  }

  function removeEmployee(id) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    setDeletingId(id)
    deleteEmployee(id)
      .then((response) => {
        setDeletingId(null)
        getAllEmployees()
        showToast('Employee deleted successfully', 'success', 'Deleted')
      })
      .catch((error) => {
        setDeletingId(null)
        const errorMessage = error.response?.data?.message || 'Cannot delete employee. Please try again.'
        showToast(errorMessage, 'danger', 'Error')
        console.error(error)
      })
  }

  const filteredEmployees = employees.filter((employee) => {
    const query = debouncedTerm.toLowerCase()
    const matchesQuery =
      employee.firstName.toLowerCase().includes(query) ||
      employee.lastName.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      (employee.departmentName?.toLowerCase().includes(query) || '') ||
      (employee.departmentId?.toString().includes(query) || false)

    const matchesDept = selectedDepartment ? (employee.departmentId?.toString() === selectedDepartment || employee.departmentName === selectedDepartment) : true

    return matchesQuery && matchesDept
  })

  // apply sorting
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortBy) return 0
    const valA = (a[sortBy] || '').toString().toLowerCase()
    const valB = (b[sortBy] || '').toString().toLowerCase()
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // unique department options for filter
  const departmentOptions = Array.from(
    employees
      .map((e) => ({ id: e.departmentId?.toString() ?? '', name: e.departmentName ?? '' }))
      .reduce((map, obj) => {
        const key = obj.id || obj.name
        if (key && !map.has(key)) map.set(key, obj)
        return map
      }, new Map())
      .values()
  )

  return (
    <div className='container py-4'>
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4'>
        <div>
          <h1 className='h3 mb-1'>Employees</h1>
          <p className='text-muted mb-0'>View and manage employees including their department assignment.</p>
        </div>
        <button className='btn btn-primary btn-sm px-4 shadow-sm' onClick={addNewEmployee}>
          Add Employee
        </button>
      </div>

      <div className='row gx-3 gy-3 mb-4'>
        <div className='col-12 col-lg-4'>
          <div className='card shadow-sm border-0'>
            <div className='card-body'>
              <h5 className='card-title mb-2'>Total employees</h5>
              <p className='display-6 mb-0'>{employees.length}</p>
            </div>
          </div>
        </div>
        <div className='col-12 col-lg-8'>
          <div className='d-flex gap-2 flex-wrap'>
            <input
              type='search'
              className='form-control'
              placeholder='Search by name, email or department'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select className='form-select w-auto' value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value=''>All Departments</option>
              {departmentOptions.map((d) => (
                <option key={d.id || d.name} value={d.id || d.name}>
                  {d.name || d.id}
                </option>
              ))}
            </select>

            <select
              className='form-select w-auto'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value=''>No sort</option>
              <option value='firstName'>First Name</option>
              <option value='lastName'>Last Name</option>
              <option value='email'>Email</option>
            </select>

            <button
              className='btn btn-outline-secondary'
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              title='Toggle sort order'
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className='table-responsive shadow-sm rounded'>
        <table className='table table-hover align-middle mb-0'>
          <thead className='table-light'>
            <tr>
              <th scope='col'>Sr No.</th>
              <th scope='col'>First Name</th>
              <th scope='col'>Last Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Department</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.departmentName ?? employee.departmentId ?? '-'}</td>
                  <td>
                    <button className='btn btn-outline-primary btn-sm me-2' onClick={() => updateEmployee(employee.id)}>
                      Edit
                    </button>
                    <button
                      className='btn btn-outline-danger btn-sm'
                      onClick={() => removeEmployee(employee.id)}
                      disabled={deletingId === employee.id}
                    >
                      {deletingId === employee.id && (
                        <span className='spinner-border spinner-border-sm me-1' role='status' aria-hidden='true'></span>
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='text-center py-4 text-muted'>No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListEmployeeComponent
