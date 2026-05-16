package com.microservices.ems.service.impl;

import com.microservices.ems.dto.EmployeeDto;
import com.microservices.ems.entity.Department;
import com.microservices.ems.entity.Employee;
import com.microservices.ems.exception.ResourceNotFoundException;
import com.microservices.ems.mapper.EmployeeMapper;
import com.microservices.ems.repository.DepartmentRepository;
import com.microservices.ems.repository.EmployeeRepository;
import com.microservices.ems.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService{


    private EmployeeRepository employeeRepository;

    private DepartmentRepository departmentRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);

        Department department = departmentRepository.findById(employeeDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department Id doesn't exist" + employeeDto.getDepartmentId()));
        employee.setDepartment(department);
        Employee savedEmployee= employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(@RequestParam Long employeeId) {
         Employee employee=employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ResourceNotFoundException
                        ("Employee Id doest'nt exist"+employeeId)
        );
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
       List<Employee> employees = employeeRepository.findAll();

        return employees.stream()
                .map(EmployeeMapper::mapToEmployeeDto).
                collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updateEmployee) {
       Employee employee= employeeRepository.findById(employeeId).
            orElseThrow(()-> new ResourceNotFoundException("Employee Id doesn't exist"+employeeId));

       employee.setFirstName(updateEmployee.getFirstName());
       employee.setLastName(updateEmployee.getLastName());
       employee.setEmail(updateEmployee.getEmail());
        Department department = departmentRepository.findById(updateEmployee.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department Id doesn't exist" + updateEmployee.getDepartmentId()));
        employee.setDepartment(department);
       Employee updateEmployeeObj=employeeRepository.save(employee);
       return EmployeeMapper.mapToEmployeeDto(updateEmployeeObj);
    }

    @Override
    public void  deleteEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException
                        ("Employee Id doest'nt exist" + employeeId)
                );
        employeeRepository.deleteById(employeeId);
    }

}
