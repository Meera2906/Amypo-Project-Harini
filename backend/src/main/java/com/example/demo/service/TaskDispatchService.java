package com.example.demo.service;

import com.example.demo.entity.DeliveryTask;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.TaskStatus;
import com.example.demo.enums.UserRole;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DeliveryTaskRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskDispatchService {

    private final DeliveryTaskRepository taskRepository;
    private final SystemUserRepository userRepository;

    public TaskDispatchService() {
        this.taskRepository = null;
        this.userRepository = null;
    }

    public TaskDispatchService(DeliveryTaskRepository taskRepository, SystemUserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public DeliveryTask assignTaskToCourier(Long taskId, Long courierId) {
        DeliveryTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        SystemUser courier = userRepository.findById(courierId)
                .orElseThrow(() -> new ResourceNotFoundException("Courier not found: " + courierId));
        task.setCourier(courier);
        task.setStatus(TaskStatus.PENDING);
        return taskRepository.save(task);
    }

    public DeliveryTask updateTaskStatus(Long taskId, TaskStatus status) {
        DeliveryTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public List<DeliveryTask> getPendingTasks() {
        return taskRepository.findByStatus(TaskStatus.PENDING);
    }

    public List<SystemUser> getAvailableCouriers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.FIELD_COURIER && u.isActive())
                .toList();
    }

    public List<DeliveryTask> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<DeliveryTask> getCourierTasks(String username) {
        SystemUser courier = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return taskRepository.findByCourierIdAndStatusIn(courier.getId(),
                List.of(TaskStatus.PENDING, TaskStatus.PICKED_UP));
    }
}
