package com.microservices.ems.service;

import com.microservices.ems.dto.DepartmentDto;

import java.util.List;

public interface DepartmentService {

    DepartmentDto createDepartment(DepartmentDto departmentDto);
    DepartmentDto getDepartmentById(Long departmentId);
    List<DepartmentDto> getAllDepartments();
  DepartmentDto updateDepartment(Long departmentId, DepartmentDto updatedDepartment);
  void deleteDepartment(Long departmentId);
}
