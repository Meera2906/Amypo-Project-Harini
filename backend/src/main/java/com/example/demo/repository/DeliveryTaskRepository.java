package com.example.demo.repository;

import com.example.demo.entity.DeliveryTask;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryTaskRepository extends JpaRepository<DeliveryTask, Long> {
    List<DeliveryTask> findByStatus(TaskStatus status);
    List<DeliveryTask> findByCourierIdAndStatusIn(Long courierId, List<TaskStatus> statuses);
    List<DeliveryTask> findByMerchantId(Long merchantId);
    List<DeliveryTask> findByMerchantOwnerId(Long ownerId);
}
