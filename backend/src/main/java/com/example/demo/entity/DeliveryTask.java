package com.example.demo.entity;

import com.example.demo.enums.TaskStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "delivery_tasks")
public class DeliveryTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String parcelName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String pickupLocation;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String deliveryLocation;

    @Column(nullable = false)
    private Double packageWeightKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    private Integer priority = 1;

    @ManyToOne
    @JoinColumn(name = "merchant_id")
    private MerchantStore merchant;

    @ManyToOne
    @JoinColumn(name = "courier_id")
    private SystemUser courier;

    public DeliveryTask() {}

    public DeliveryTask(Long id, String parcelName, String pickupLocation, String deliveryLocation,
                        Double packageWeightKg, TaskStatus status, Integer priority,
                        MerchantStore merchant, SystemUser courier) {
        this.id = id;
        this.parcelName = parcelName;
        this.pickupLocation = pickupLocation;
        this.deliveryLocation = deliveryLocation;
        this.packageWeightKg = packageWeightKg;
        this.status = status;
        this.priority = priority;
        this.merchant = merchant;
        this.courier = courier;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String parcelName;
        private String pickupLocation;
        private String deliveryLocation;
        private Double packageWeightKg;
        private TaskStatus status;
        private Integer priority = 1;
        private MerchantStore merchant;
        private SystemUser courier;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder parcelName(String parcelName) { this.parcelName = parcelName; return this; }
        public Builder pickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; return this; }
        public Builder deliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; return this; }
        public Builder packageWeightKg(Double packageWeightKg) { this.packageWeightKg = packageWeightKg; return this; }
        public Builder status(TaskStatus status) { this.status = status; return this; }
        public Builder priority(Integer priority) { this.priority = priority; return this; }
        public Builder merchant(MerchantStore merchant) { this.merchant = merchant; return this; }
        public Builder courier(SystemUser courier) { this.courier = courier; return this; }
        public DeliveryTask build() {
            return new DeliveryTask(id, parcelName, pickupLocation, deliveryLocation,
                    packageWeightKg, status, priority, merchant, courier);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getParcelName() { return parcelName; }
    public void setParcelName(String parcelName) { this.parcelName = parcelName; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }
    public Double getPackageWeightKg() { return packageWeightKg; }
    public void setPackageWeightKg(Double packageWeightKg) { this.packageWeightKg = packageWeightKg; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    public MerchantStore getMerchant() { return merchant; }
    public void setMerchant(MerchantStore merchant) { this.merchant = merchant; }
    public SystemUser getCourier() { return courier; }
    public void setCourier(SystemUser courier) { this.courier = courier; }
}
