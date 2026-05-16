import React, { useEffect, useState } from 'react'
import { createDepartment, getDepartmentById, updateDepartment } from '../services/DepartmentService'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useToast } from './ToastProvider'

const DepartmentComponent = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [departmentName, setDepartmentName] = useState('')
  const [departmentDescription, setDepartmentDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const showToast = useToast()

  useEffect(() => {
    if (id) {
      setLoading(true)
      getDepartmentById(id)
        .then((response) => {
          setDepartmentName(response.data.departmentName)
          setDepartmentDescription(response.data.departmentDescription)
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }
  }, [id])

  const saveOrUpdateDepartment = (e) => {
    e.preventDefault()
    const department = { departmentName, departmentDescription }

    if (!departmentName.trim()) {
      alert('Department name is required')
      return
    }

    const request = id ? updateDepartment(id, department) : createDepartment(department)
    request
      .then((response) => {
        showToast(id ? 'Department updated successfully' : 'Department added successfully', 'success', 'Saved')
        navigate('/departments')
      })
      .catch((error) => {
        console.error(error)
        showToast('Unable to save department. Please try again.', 'danger', 'Error')
      })
  }

  const title = id ? 'Update Department' : 'Add Department'
  const subtitle = id ? 'Edit the details for this department.' : 'Create a new department record.'

  return (
    <div className='container py-4'>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8 col-lg-6'>
          <div className='card shadow-sm border-0'>
            <div className='card-header bg-white'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <h2 className='h4 mb-1'>{title}</h2>
                  <p className='text-muted mb-0'>{subtitle}</p>
                </div>
                <Link to='/departments' className='btn btn-outline-secondary btn-sm'>Back</Link>
              </div>
            </div>
            <div className='card-body'>
              {loading ? (
                <div className='text-center py-5'>Loading department...</div>
              ) : (
                <form onSubmit={saveOrUpdateDepartment}>
                  <div className='mb-3'>
                    <label className='form-label fw-semibold'>Department Name</label>
                    <input
                      type='text'
                      placeholder='Enter department name'
                      className='form-control'
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label fw-semibold'>Department Description</label>
                    <textarea
                      rows='4'
                      placeholder='Enter department description'
                      className='form-control'
                      value={departmentDescription}
                      onChange={(e) => setDepartmentDescription(e.target.value)}
                    />
                  </div>

                  <div className='d-flex gap-2 justify-content-end'>
                    <Link to='/departments' className='btn btn-outline-secondary'>Cancel</Link>
                    <button className='btn btn-success' type='submit'>
                      {id ? 'Save Changes' : 'Create Department'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentComponent