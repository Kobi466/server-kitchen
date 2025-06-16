package com.webkitchen.backend.mapper;

import com.webkitchen.backend.dto.UserResponseDTO;
import com.webkitchen.backend.entity.User;

public class UserMapper {
    public static UserResponseDTO toDto(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }
}

