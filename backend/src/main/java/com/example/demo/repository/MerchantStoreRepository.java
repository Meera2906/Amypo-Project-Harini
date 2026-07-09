package com.example.demo.repository;

import com.example.demo.entity.MerchantStore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MerchantStoreRepository extends JpaRepository<MerchantStore, Long> {
    List<MerchantStore> findByOwnerId(Long ownerId);
}
