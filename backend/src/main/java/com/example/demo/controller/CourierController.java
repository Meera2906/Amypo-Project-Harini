package com.example.demo.controller;

import com.example.demo.entity.DeliveryTask;
import com.example.demo.service.TaskDispatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/couriers")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('FIELD_COURIER')")
public class CourierController {

    private final TaskDispatchService taskDispatchService;

    public CourierController(TaskDispatchService taskDispatchService) {
        this.taskDispatchService = taskDispatchService;
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<DeliveryTask>> getMyTasks(Authentication authentication) {
        return ResponseEntity.ok(taskDispatchService.getCourierTasks(authentication.getName()));
    }
}
