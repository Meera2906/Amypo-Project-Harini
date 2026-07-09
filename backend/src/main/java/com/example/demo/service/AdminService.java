package com.example.demo.service;

import com.example.demo.entity.DeliveryTask;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.UserRole;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DeliveryTaskRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {

    private final SystemUserRepository userRepository;
    private final DeliveryTaskRepository taskRepository;

    public AdminService(SystemUserRepository userRepository, DeliveryTaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    public List<SystemUser> getAllUsers() {
        return userRepository.findAll();
    }

    public SystemUser updateUserRole(Long id, UserRole role) {
        SystemUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setRole(role);
        return userRepository.save(user);
    }

    public SystemUser toggleUserStatus(Long id) {
        SystemUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<DeliveryTask> getAllTasks() {
        return taskRepository.findAll();
    }
}
