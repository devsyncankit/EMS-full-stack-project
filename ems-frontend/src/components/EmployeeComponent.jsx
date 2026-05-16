import React, { useState, useEffect    } from 'react'
import { createEmployee, getEmployeeById ,updateEmployee} from '../services/EmployeeService'
import { useNavigate , useParams} from 'react-router-dom'
import { listDepartments } from '../services/DepartmentService';
import { useToast } from './ToastProvider'

const EmployeeComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [departmentId, setDepartmentId] = useState('')
    const [departments, setDepartments] = useState([])
    //validation of form fields
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        departmentId: '' 
    })
    const showToast = useToast()

    useEffect(() => {
        console.log("useEffect called")
        listDepartments()
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error(error))
    }, [])
    useEffect(() => {
        if(id) {
            console.log("useEffect called with id: " + id)
            getEmployeeById(id)
                .then((response) => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setEmail(response.data.email);
                   setDepartmentId(response.data.departmentId);
                })
                .catch((error) => console.error(error));     
        }}, [id])

    function saveOrUpdateEmployee(e) {
        e.preventDefault();
        if (validateForm()) {
             const employee = {firstName, lastName, email, departmentId}
        console.log(employee)
            if(id) {
                console.log("updateEmployee called with id: " + id)  
                 console.log("saveOrUpdateEmployee called")
                    updateEmployee(id, employee).then((response) => {   
                        console.log(response.data);
                        showToast('Employee updated successfully', 'success', 'Saved')
                        navigate('/employees')
                    }).catch((error) => {console.error(error); showToast('Unable to update employee. Please try again.', 'danger', 'Error')}); 
                
            } else {
            createEmployee(employee)
            .then((response) => {
                console.log(response.data)
                showToast('Employee added successfully', 'success', 'Saved')
                navigate('/employees')
            })
            .catch((error) => {console.error(error); showToast('Unable to add employee. Please try again.', 'danger', 'Error')});
            }
        
    }}

    function validateForm() {
        let formIsValid = true;
        let errors = {};
        if (!firstName.trim()) {
            formIsValid = false;
            errors.firstName = 'First name is required';
        }
        if (!lastName.trim()) {
            formIsValid = false;
            errors.lastName = 'Last name is required';
        }
        if (!email.trim()) {
            formIsValid = false;
            errors.email = 'Email is required';
        }
        if (!departmentId) {
            formIsValid = false;
            errors.departmentId = 'Department is required';
        }   
        setErrors(errors);
        return formIsValid;
    }
    function pageTitle() {
        if (id) {
            return <h2 className='text-center'>Update Employee</h2>
        } else {
            return <h2 className='text-center'>Add Employee</h2>
        } 

    }

  return (
    <div className='container'>
        <br />
        <div className='row'>
            <div className='card col-md-6 offset-md-3 offset-md-3'>
                    {pageTitle()}
                <div className='card-body'>
                    <form>
                        <div className='form-group'>
                            <label>First Name</label>
                            <input type='text' className={'form-control' + (errors.firstName ? ' is-invalid' : '')} placeholder='Enter First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                        </div>
                        <div className='form-group'>
                            <label>Last Name</label>
                            <input type='text' className={'form-control' + (errors.lastName ? ' is-invalid' : '')} placeholder='Enter Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}  
                        </div>
                        <div className='form-group'>
                            <label>Email</label>
                            <input type='email' className={'form-control' + (errors.email ? ' is-invalid' : '')} placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                        </div>
                        <div className='form-group'>
                            <label>Department</label>
                            <select className={'form-control' + (errors.departmentId ? ' is-invalid' : '')} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                                <option value=''>Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.departmentName}
                                    </option>
                                ))}
                            </select>
                            {errors.departmentId && <div className='invalid-feedback'>{errors.departmentId}</div>}
                        </div>
                        <button className='btn btn-success' type='submit' onClick={saveOrUpdateEmployee}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EmployeeComponent