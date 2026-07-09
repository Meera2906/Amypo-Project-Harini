package com.example.demo.config;

import com.example.demo.entity.MerchantStore;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.UserRole;
import com.example.demo.repository.MerchantStoreRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final MerchantStoreRepository storeRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository,
                      MerchantStoreRepository storeRepository,
                      BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        userRepository.save(SystemUser.builder()
                .username("admin").password(passwordEncoder.encode("admin123"))
                .email("admin@lastmile.com").role(UserRole.PLATFORM_ADMIN).build());

        userRepository.save(SystemUser.builder()
                .username("manager1").password(passwordEncoder.encode("pass123"))
                .email("manager1@lastmile.com").role(UserRole.DISPATCH_MANAGER).build());

        SystemUser merchant = userRepository.save(SystemUser.builder()
                .username("merchant1").password(passwordEncoder.encode("pass123"))
                .email("merchant1@lastmile.com").role(UserRole.MERCHANT_PARTNER).build());

        userRepository.save(SystemUser.builder()
                .username("courier1").password(passwordEncoder.encode("pass123"))
                .email("courier1@lastmile.com").role(UserRole.FIELD_COURIER).build());

        storeRepository.save(MerchantStore.builder()
                .name("Merchant1 Store").address("123 Main St, City").owner(merchant).build());
    }
}
