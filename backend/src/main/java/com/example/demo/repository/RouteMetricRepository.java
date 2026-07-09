package com.example.demo.repository;

import com.example.demo.entity.RouteMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RouteMetricRepository extends JpaRepository<RouteMetric, Long> {
    @Query("SELECT AVG(m.efficiencyScore) FROM RouteMetric m")
    Double getAverageEfficiencyScore();
}
