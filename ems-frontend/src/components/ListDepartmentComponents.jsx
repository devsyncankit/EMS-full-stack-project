import React, { useEffect, useState } from 'react'
import { listDepartments, deleteDepartment } from '../services/DepartmentService'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from './ToastProvider'

const ListDepartmentComponents = () => {
  const [departments, setDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()
  const showToast = useToast()

  useEffect(() => {
    fetchDepartments()
  }, [])

  // debounce searchTerm
  useEffect(() => {
    const h = setTimeout(() => setDebouncedTerm(searchTerm), 300)
    return () => clearTimeout(h)
  }, [searchTerm])

  const fetchDepartments = () => {
    listDepartments()
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error(error))
  }

  const updateDepartment = (id) => {
    navigate(`/update-department/${id}`)
  }

  const removeDepartment = (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return
    setDeletingId(id)
    deleteDepartment(id)
      .then(() => {
        setDeletingId(null)
        fetchDepartments()
        showToast('Department deleted successfully', 'success', 'Deleted')
      })
      .catch((error) => {
        setDeletingId(null)
        const errorMessage = error.response?.data?.message || 'Cannot delete department. Please ensure no employees are assigned to this department.'
        showToast(errorMessage, 'danger', 'Error')
        console.error(error)
      })
  }

  const filteredDepartments = departments.filter((department) => {
    const query = debouncedTerm.toLowerCase()
    return (
      department.departmentName.toLowerCase().includes(query) ||
      department.departmentDescription.toLowerCase().includes(query) ||
      department.id.toString().includes(query)
    )
  })

  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    if (!sortBy) return 0
    const valA = (a[sortBy] || '').toString().toLowerCase()
    const valB = (b[sortBy] || '').toString().toLowerCase()
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className='container py-4'>
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4'>
        <div>
          <h1 className='h3 mb-1'>Departments</h1>
          <p className='text-muted mb-0'>Manage department records, descriptions, and assignments.</p>
        </div>
        <Link to='/add-department' className='btn btn-primary btn-sm px-4 shadow-sm'>Add Department</Link>
      </div>

      <div className='row gx-3 gy-3 mb-4'>
        <div className='col-12 col-lg-4'>
          <div className='card shadow-sm border-0'>
            <div className='card-body'>
              <h5 className='card-title mb-2'>Departments</h5>
              <p className='display-6 mb-0'>{departments.length}</p>
            </div>
          </div>
        </div>
        <div className='col-12 col-lg-8'>
          <div className='d-flex gap-2'>
            <input
              type='search'
              className='form-control'
              placeholder='Search by id, name, or description'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className='form-select w-auto'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value=''>No sort</option>
              <option value='departmentName'>Name</option>
              <option value='departmentDescription'>Description</option>
              <option value='id'>Id</option>
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
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Description</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDepartments.length > 0 ? (
              sortedDepartments.map((department, index) => (
                <tr key={department.id}>
                  <td>{index + 1}</td>
                  <td>{department.departmentName}</td>
                  <td>{department.departmentDescription}</td>
                  <td>
                    <button className='btn btn-outline-primary btn-sm me-2' onClick={() => updateDepartment(department.id)}>
                      Edit
                    </button>
                    <button
                      className='btn btn-outline-danger btn-sm'
                      onClick={() => removeDepartment(department.id)}
                      disabled={deletingId === department.id}
                    >
                      {deletingId === department.id && (
                        <span className='spinner-border spinner-border-sm me-1' role='status' aria-hidden='true'></span>
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='text-center py-4 text-muted'>No departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListDepartmentComponents