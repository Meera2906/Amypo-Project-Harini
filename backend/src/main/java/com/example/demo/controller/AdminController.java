package com.example.demo.controller;

import com.example.demo.entity.DeliveryTask;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.UserRole;
import com.example.demo.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('PLATFORM_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<SystemUser>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<SystemUser> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.updateUserRole(id, UserRole.valueOf(body.get("role"))));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<String> toggleStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok("User status updated successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/audit/tasks")
    public ResponseEntity<List<DeliveryTask>> auditTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }
}
