package com.example.demo.controller;

import com.example.demo.entity.DeliveryTask;
import com.example.demo.entity.MerchantStore;
import com.example.demo.service.MerchantStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/merchants")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('MERCHANT_PARTNER')")
public class MerchantController {

    private final MerchantStoreService merchantStoreService;

    public MerchantController(MerchantStoreService merchantStoreService) {
        this.merchantStoreService = merchantStoreService;
    }

    @GetMapping("/my-stores")
    public ResponseEntity<List<MerchantStore>> getMyStores(Authentication authentication) {
        return ResponseEntity.ok(merchantStoreService.getStoresByOwner(authentication.getName()));
    }

    @GetMapping("/stores/{storeId}/tasks")
    public ResponseEntity<List<DeliveryTask>> getStoreTasks(@PathVariable Long storeId, Authentication authentication) {
        return ResponseEntity.ok(merchantStoreService.getTasksByStore(storeId));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<DeliveryTask>> getMyTasks(Authentication authentication) {
        return ResponseEntity.ok(merchantStoreService.getTasksByOwner(authentication.getName()));
    }
}
