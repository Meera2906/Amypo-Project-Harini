package com.example.demo.controller;

import com.example.demo.dto.MetricDto;
import com.example.demo.repository.RouteMetricRepository;
import com.example.demo.service.OptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final RouteMetricRepository metricRepository;
    private final OptimizationService optimizationService;

    public AnalyticsController(RouteMetricRepository metricRepository, OptimizationService optimizationService) {
        this.metricRepository = metricRepository;
        this.optimizationService = optimizationService;
    }

    @GetMapping("/efficiency")
    @PreAuthorize("hasRole('DISPATCH_MANAGER') or hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<Double> getEfficiency() {
        return ResponseEntity.ok(metricRepository.getAverageEfficiencyScore());
    }

    @PostMapping("/tasks/{id}/finalize")
    @PreAuthorize("hasRole('DISPATCH_MANAGER')")
    public ResponseEntity<?> finalizeTask(@PathVariable Long id, @RequestBody MetricDto dto) {
        return ResponseEntity.ok(optimizationService.finalizeTaskMetrics(id, dto));
    }
}
