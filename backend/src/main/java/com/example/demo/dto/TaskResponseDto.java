package com.example.demo.dto;

import com.example.demo.enums.TaskStatus;

public class TaskResponseDto {
    private Long id;
    private String pickupLocation;
    private String deliveryLocation;
    private Double packageWeightKg;
    private TaskStatus status;
    private Integer priority;
    private String merchantName;
    private String courierName;

    public TaskResponseDto() {}

    public TaskResponseDto(Long id, String pickupLocation, String deliveryLocation, Double packageWeightKg,
                           TaskStatus status, Integer priority, String merchantName, String courierName) {
        this.id = id;
        this.pickupLocation = pickupLocation;
        this.deliveryLocation = deliveryLocation;
        this.packageWeightKg = packageWeightKg;
        this.status = status;
        this.priority = priority;
        this.merchantName = merchantName;
        this.courierName = courierName;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String pickupLocation;
        private String deliveryLocation;
        private Double packageWeightKg;
        private TaskStatus status;
        private Integer priority;
        private String merchantName;
        private String courierName;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder pickupLocation(String v) { this.pickupLocation = v; return this; }
        public Builder deliveryLocation(String v) { this.deliveryLocation = v; return this; }
        public Builder packageWeightKg(Double v) { this.packageWeightKg = v; return this; }
        public Builder status(TaskStatus v) { this.status = v; return this; }
        public Builder priority(Integer v) { this.priority = v; return this; }
        public Builder merchantName(String v) { this.merchantName = v; return this; }
        public Builder courierName(String v) { this.courierName = v; return this; }
        public TaskResponseDto build() {
            return new TaskResponseDto(id, pickupLocation, deliveryLocation, packageWeightKg,
                    status, priority, merchantName, courierName);
        }
    }

    public Long getId() { return id; }
    public String getPickupLocation() { return pickupLocation; }
    public String getDeliveryLocation() { return deliveryLocation; }
    public Double getPackageWeightKg() { return packageWeightKg; }
    public TaskStatus getStatus() { return status; }
    public Integer getPriority() { return priority; }
    public String getMerchantName() { return merchantName; }
    public String getCourierName() { return courierName; }
}
