import axios from "axios";

const Department_REST_API_BASE_URL = 'http://localhost:8080/api/departments';

export const listDepartments = () => axios.get(Department_REST_API_BASE_URL);
export const createDepartment = (department) => axios.post(Department_REST_API_BASE_URL, department);
export const getDepartmentById = (departmentId) => axios.get(`${Department_REST_API_BASE_URL}/${departmentId}`);
export const updateDepartment = (departmentId, department) => axios.put(`${Department_REST_API_BASE_URL}/${departmentId}`, department);
export const deleteDepartment = (departmentId) => axios.delete(`${Department_REST_API_BASE_URL}/${departmentId}`);