package com.haribhakthi.config;

import com.haribhakthi.user.Role;
import com.haribhakthi.user.User;
import com.haribhakthi.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Optional<User> adminOpt = userRepository.findByEmail("admin@haribhakthi.com");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            userRepository.save(admin);
        } else {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@haribhakthi.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setPreferredLanguage("kn");
            userRepository.save(admin);
        }
    }
}
