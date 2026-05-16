import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import HelloWorld from './HelloWorld'
import ListEmployeeComponent from './components/ListEmployeeComponent'
import ListDepartmentComponents from './components/ListDepartmentComponents'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import EmployeeComponent from './components/EmployeeComponent'
import DepartmentComponent from './components/DepartmentComponent'
import { ToastProvider } from './components/ToastProvider'
function App() {
  

  return (
    <ToastProvider>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          {/* //http://localhost:3000 */}
          <Route path='/' element={<ListEmployeeComponent />} />
          {/* //http://localhost:3000/employees */}
          <Route path='/employees' element={<ListEmployeeComponent />} />
          {/* //http://localhost:3000/add-employee */}
          <Route path='/add-employee' element={<EmployeeComponent />} />
          {/* //http://localhost:3000/update-employee/:id */}
          <Route path='/update-employee/:id' element={<EmployeeComponent />} />
          <Route path='/departments' element={<ListDepartmentComponents />} />  
          <Route path='/add-department' element={<DepartmentComponent />} />
          <Route path='/update-department/:id' element={<DepartmentComponent />} />
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
