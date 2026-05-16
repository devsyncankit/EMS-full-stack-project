package com.microservices.ems.service.impl;

import com.microservices.ems.dto.DepartmentDto;
import com.microservices.ems.entity.Department;
import com.microservices.ems.exception.ResourceNotFoundException;
import com.microservices.ems.mapper.DepartmentMapper;
import com.microservices.ems.repository.DepartmentRepository;
import com.microservices.ems.service.DepartmentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = DepartmentMapper.mapToDepartment(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto getDepartmentById( Long departmentId) {
       Department department = departmentRepository.findById(departmentId).orElseThrow(
                () -> new ResourceNotFoundException("Department Id doesn't exist" + departmentId)
        );
        return DepartmentMapper.mapToDepartmentDto(department);

    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments=departmentRepository.findAll();
        return departments.stream()
                .map(DepartmentMapper::mapToDepartmentDto)
                .toList();
    }

    @Override
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto updatedDepartment) {
       Department department= departmentRepository.findById(departmentId).orElseThrow(
                () -> new ResourceNotFoundException("Department Id doesn't exist" + departmentId)
        );
        department.setDepartmentName(updatedDepartment.getDepartmentName());
        department.setDepartmentDescription(updatedDepartment.getDepartmentDescription());
        Department savedDepartment=departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);

    }

    @Override
    public void deleteDepartment(Long departmentId) {
        Department department= departmentRepository.findById(departmentId).orElseThrow(
                () -> new ResourceNotFoundException("Department Id doesn't exist" + departmentId)
        );
        departmentRepository.delete(department);
    }
}
