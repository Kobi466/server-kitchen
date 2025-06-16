package com.webkitchen.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponseDTO {
    private Long id;
    private String caption;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
    private String username;
}
