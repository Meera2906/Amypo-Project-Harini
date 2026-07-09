package com.example.demo.controller;

import com.example.demo.dto.DeliveryRequestDto;
import com.example.demo.entity.DeliveryTask;
import com.example.demo.enums.TaskStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.MerchantStoreService;
import com.example.demo.service.TaskDispatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskDispatchService taskDispatchService;
    private final MerchantStoreService merchantStoreService;

    public TaskController(TaskDispatchService taskDispatchService, MerchantStoreService merchantStoreService) {
        this.taskDispatchService = taskDispatchService;
        this.merchantStoreService = merchantStoreService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('MERCHANT_PARTNER')")
    public ResponseEntity<String> create(@RequestBody DeliveryRequestDto dto) {
        merchantStoreService.createDeliveryRequest(dto);
        return ResponseEntity.ok("Task created successfully");
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('DISPATCH_MANAGER')")
    public ResponseEntity<DeliveryTask> assign(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        return ResponseEntity.ok(taskDispatchService.assignTaskToCourier(id, payload.get("courierId")));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('FIELD_COURIER') or hasRole('DISPATCH_MANAGER')")
    public ResponseEntity<DeliveryTask> updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskDispatchService.updateTaskStatus(id, status));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('DISPATCH_MANAGER')")
    public ResponseEntity<List<DeliveryTask>> getPending() {
        return ResponseEntity.ok(taskDispatchService.getPendingTasks());
    }

    @GetMapping("/available-couriers")
    @PreAuthorize("hasRole('DISPATCH_MANAGER')")
    public ResponseEntity<?> getAvailableCouriers() {
        return ResponseEntity.ok(taskDispatchService.getAvailableCouriers());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('DISPATCH_MANAGER')")
    public ResponseEntity<List<DeliveryTask>> getAllTasks() {
        return ResponseEntity.ok(taskDispatchService.getAllTasks());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DISPATCH_MANAGER') or hasRole('MERCHANT_PARTNER')")
    public ResponseEntity<DeliveryTask> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskDispatchService.getAllTasks().stream()
                .filter(t -> t.getId().equals(id)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id)));
    }
}
