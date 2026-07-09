package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "merchant_stores")
public class MerchantStore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private SystemUser owner;

    public MerchantStore() {}

    public MerchantStore(Long id, String name, String address, SystemUser owner) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.owner = owner;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String address;
        private SystemUser owner;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder owner(SystemUser owner) { this.owner = owner; return this; }
        public MerchantStore build() { return new MerchantStore(id, name, address, owner); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public SystemUser getOwner() { return owner; }
    public void setOwner(SystemUser owner) { this.owner = owner; }
}
