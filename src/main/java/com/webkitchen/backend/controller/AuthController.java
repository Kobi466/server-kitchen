package com.webkitchen.backend.controller;

import com.webkitchen.backend.dto.UserLoginDTO;
import com.webkitchen.backend.dto.UserRegisterDTO;
import com.webkitchen.backend.dto.UserResponseDTO;
import com.webkitchen.backend.entity.Role;
import com.webkitchen.backend.entity.User;
import com.webkitchen.backend.mapper.UserMapper;
import com.webkitchen.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterDTO dto) {
        if (userService.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }
        if (userService.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tên người dùng đã tồn tại");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);
        userService.save(user);
        return ResponseEntity.ok("Đăng ký thành công");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO dto) {
        Optional<User> userOpt = userService.findByEmail(dto.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu");
        }
        UserResponseDTO responseDTO = UserMapper.toDto(user);
        // Thực tế nên trả về JWT token, ở đây trả về thông tin user đơn giản
        return ResponseEntity.ok(responseDTO);
    }
}
