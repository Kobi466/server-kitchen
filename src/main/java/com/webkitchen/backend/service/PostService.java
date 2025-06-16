package com.webkitchen.backend.service;

import com.webkitchen.backend.entity.Post;
import com.webkitchen.backend.entity.PostStatus;
import com.webkitchen.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    public List<Post> findByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> findByStatus(PostStatus status) {
        return postRepository.findByStatus(status);
    }

    public void deleteById(Long id) {
        postRepository.deleteById(id);
    }
}

