package com.example.demo.dto;

public class DeliveryRequestDto {
    private String parcelName;
    private String pickupLocation;
    private String deliveryLocation;
    private Double packageWeightKg;
    private Long storeId;

    public String getParcelName() { return parcelName; }
    public void setParcelName(String parcelName) { this.parcelName = parcelName; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }
    public Double getPackageWeightKg() { return packageWeightKg; }
    public void setPackageWeightKg(Double packageWeightKg) { this.packageWeightKg = packageWeightKg; }
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
}
