package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "route_metrics")
public class RouteMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "task_id")
    private DeliveryTask task;

    private Double distanceKm;
    private Integer timeTakenMinutes;
    private Double efficiencyScore;

    public RouteMetric() {}

    public RouteMetric(Long id, DeliveryTask task, Double distanceKm, Integer timeTakenMinutes, Double efficiencyScore) {
        this.id = id;
        this.task = task;
        this.distanceKm = distanceKm;
        this.timeTakenMinutes = timeTakenMinutes;
        this.efficiencyScore = efficiencyScore;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private DeliveryTask task;
        private Double distanceKm;
        private Integer timeTakenMinutes;
        private Double efficiencyScore;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder task(DeliveryTask task) { this.task = task; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder timeTakenMinutes(Integer timeTakenMinutes) { this.timeTakenMinutes = timeTakenMinutes; return this; }
        public Builder efficiencyScore(Double efficiencyScore) { this.efficiencyScore = efficiencyScore; return this; }
        public RouteMetric build() { return new RouteMetric(id, task, distanceKm, timeTakenMinutes, efficiencyScore); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public DeliveryTask getTask() { return task; }
    public void setTask(DeliveryTask task) { this.task = task; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Integer getTimeTakenMinutes() { return timeTakenMinutes; }
    public void setTimeTakenMinutes(Integer timeTakenMinutes) { this.timeTakenMinutes = timeTakenMinutes; }
    public Double getEfficiencyScore() { return efficiencyScore; }
    public void setEfficiencyScore(Double efficiencyScore) { this.efficiencyScore = efficiencyScore; }
}
