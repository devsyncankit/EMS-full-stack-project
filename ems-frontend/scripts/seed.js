import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

const defaultDepartments = [
  'Engineering',
  'Sales',
  'Human Resources',
  'Finance',
  'Support',
  'Marketing',
  'Operations'
]

const firstNames = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Christopher','Nancy','Daniel','Lisa','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Kimberly','Paul','Emily','Andrew','Donna','Joshua','Michelle']
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson']

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeEmployee(deptId, i) {
  const first = randomFrom(firstNames)
  const last = randomFrom(lastNames)
  const email = `${first}.${last}${i}@example.com`.toLowerCase()
  const jobTitle = ['Engineer','Manager','Analyst','Specialist','Coordinator','Consultant','Administrator'][i % 7]
  return { firstName: first, lastName: last, email, departmentId: deptId, jobTitle }
}

async function createDepartments() {
  const created = []
  for (const name of defaultDepartments) {
    const dept = {
      departmentName: name,
      departmentDescription: `${name} team responsible for ${name.toLowerCase()} tasks.`
    }
    try {
      const res = await axios.post(`${API_BASE}/departments`, dept)
      console.log('Created department', res.data.departmentName || res.data.name || res.data)
      created.push(res.data)
    } catch (err) {
      console.error('Failed to create department', name, err.response?.data || err.message)
    }
  }
  return created
}

async function createEmployees(count, departments) {
  const created = []
  for (let i = 1; i <= count; i++) {
    const dept = randomFrom(departments)
    const deptId = dept.id ?? dept.departmentId ?? dept.id
    const emp = makeEmployee(deptId, i)
    try {
      const res = await axios.post(`${API_BASE}/employees`, emp)
      created.push(res.data)
      if (i % 10 === 0) console.log(`Created ${i} employees`)
    } catch (err) {
      console.error('Failed to create employee', emp.email, err.response?.data || err.message)
    }
    // small pause to avoid overwhelming backend
    await new Promise((r) => setTimeout(r, 20))
  }
  return created
}

async function run() {
  console.log('Seeding departments...')
  const depts = await createDepartments()
  if (depts.length === 0) {
    console.error('No departments created — aborting employee creation. Ensure backend is running and accepts department creation.')
    return
  }

  console.log(`Creating 100 realistic employees assigned to ${depts.length} departments...`)
  const emps = await createEmployees(100, depts)
  console.log(`Finished. Created ${emps.length} employees.`)
}

run().catch((e) => console.error(e))
