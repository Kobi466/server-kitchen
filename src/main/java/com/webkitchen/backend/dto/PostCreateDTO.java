package com.webkitchen.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostCreateDTO {
    @NotBlank
    private String caption;
    private String imageUrl;
}
