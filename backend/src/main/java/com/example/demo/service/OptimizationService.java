package com.example.demo.service;

import com.example.demo.dto.MetricDto;
import com.example.demo.entity.DeliveryTask;
import com.example.demo.entity.RouteMetric;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DeliveryTaskRepository;
import com.example.demo.repository.RouteMetricRepository;
import org.springframework.stereotype.Service;

@Service
public class OptimizationService {

    private final RouteMetricRepository metricRepository;
    private final DeliveryTaskRepository taskRepository;

    public OptimizationService(RouteMetricRepository metricRepository, DeliveryTaskRepository taskRepository) {
        this.metricRepository = metricRepository;
        this.taskRepository = taskRepository;
    }

    public RouteMetric finalizeTaskMetrics(Long taskId, MetricDto dto) {
        DeliveryTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        double efficiency = dto.getTimeTakenMinutes() > 0
                ? dto.getDistanceKm() / dto.getTimeTakenMinutes()
                : 0.0;
        RouteMetric metric = RouteMetric.builder()
                .task(task)
                .distanceKm(dto.getDistanceKm())
                .timeTakenMinutes(dto.getTimeTakenMinutes())
                .efficiencyScore(efficiency)
                .build();
        return metricRepository.save(metric);
    }
}
