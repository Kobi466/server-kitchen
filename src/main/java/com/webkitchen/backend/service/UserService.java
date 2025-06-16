package com.webkitchen.backend.service;

import com.webkitchen.backend.entity.Role;
import com.webkitchen.backend.entity.User;
import com.webkitchen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @PostConstruct
    public void createDefaultAdmin() {
        if (userRepository.findByEmail("admin@webkitchen.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@webkitchen.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Encode password with BCrypt
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
    }
}
