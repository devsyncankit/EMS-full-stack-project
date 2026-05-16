package com.microservices.ems.mapper;

import com.microservices.ems.dto.EmployeeDto;
import com.microservices.ems.entity.Employee;

public class EmployeeMapper {

    public static EmployeeDto mapToEmployeeDto(Employee employee) {
     return new EmployeeDto(
             employee.getId(),
             employee.getFirstName(),
             employee.getLastName(),
             employee.getEmail(),
             employee.getDepartment() != null ? employee.getDepartment().getId() : null,
             employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : null
     );
    }
    public static Employee mapToEmployee(EmployeeDto employeeDto) {
       Employee employee= new Employee();
       employee.setId(employeeDto.getId());
       employee.setFirstName(employeeDto.getFirstName());
       employee.setLastName(employeeDto.getLastName());
       employee.setEmail(employeeDto.getEmail());
       return employee;
    }
}
