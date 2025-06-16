package com.webkitchen.backend.repository;

import com.webkitchen.backend.entity.Post;
import com.webkitchen.backend.entity.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);

    List<Post> findByStatus(PostStatus status);
}

