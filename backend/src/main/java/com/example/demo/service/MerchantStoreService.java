package com.example.demo.service;

import com.example.demo.dto.DeliveryRequestDto;
import com.example.demo.entity.DeliveryTask;
import com.example.demo.entity.MerchantStore;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.TaskStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DeliveryTaskRepository;
import com.example.demo.repository.MerchantStoreRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MerchantStoreService {

    private final DeliveryTaskRepository taskRepository;
    private final MerchantStoreRepository storeRepository;
    private final SystemUserRepository userRepository;

    public MerchantStoreService(DeliveryTaskRepository taskRepository,
                                MerchantStoreRepository storeRepository,
                                SystemUserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    public DeliveryTask createDeliveryRequest(DeliveryRequestDto dto) {
        MerchantStore store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + dto.getStoreId()));
        DeliveryTask task = DeliveryTask.builder()
                .parcelName(dto.getParcelName())
                .pickupLocation(dto.getPickupLocation())
                .deliveryLocation(dto.getDeliveryLocation())
                .packageWeightKg(dto.getPackageWeightKg())
                .status(TaskStatus.OPEN)
                .merchant(store)
                .build();
        return taskRepository.save(task);
    }

    public List<MerchantStore> getStoresByOwner(String username) {
        SystemUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return storeRepository.findByOwnerId(owner.getId());
    }

    public List<DeliveryTask> getTasksByStore(Long storeId) {
        return taskRepository.findByMerchantId(storeId);
    }

    public List<DeliveryTask> getTasksByOwner(String username) {
        SystemUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return taskRepository.findByMerchantOwnerId(owner.getId());
    }
}
