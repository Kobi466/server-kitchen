package com.webkitchen.backend.mapper;

import com.webkitchen.backend.dto.PostResponseDTO;
import com.webkitchen.backend.entity.Post;

public class PostMapper {
    public static PostResponseDTO toDto(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setCaption(post.getCaption());
        dto.setImageUrl(post.getImageUrl());
        dto.setStatus(post.getStatus().name());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUsername(post.getUser().getUsername());
        return dto;
    }
}

