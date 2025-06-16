package com.webkitchen.backend.controller;

import com.webkitchen.backend.dto.PostCreateDTO;
import com.webkitchen.backend.dto.PostResponseDTO;
import com.webkitchen.backend.entity.Post;
import com.webkitchen.backend.entity.PostStatus;
import com.webkitchen.backend.entity.User;
import com.webkitchen.backend.mapper.PostMapper;
import com.webkitchen.backend.service.PostService;
import com.webkitchen.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private UserService userService;

    // User đăng bài
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostCreateDTO dto, @RequestParam Long userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User không tồn tại");
        }
        Post post = new Post();
        post.setCaption(dto.getCaption());
        post.setImageUrl(dto.getImageUrl());
        post.setStatus(PostStatus.PENDING);
        post.setUser(userOpt.get());
        postService.save(post);
        return ResponseEntity.ok("Đăng bài thành công, chờ admin duyệt!");
    }

    // Lấy tất cả bài viết (admin hoặc public)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        List<Post> posts = postService.findAll();
        List<PostResponseDTO> result = posts.stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Lấy bài viết theo user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getPostsByUser(@PathVariable Long userId) {
        List<Post> posts = postService.findByUserId(userId);
        List<PostResponseDTO> result = posts.stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Lấy bài viết theo trạng thái (admin duyệt)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PostResponseDTO>> getPostsByStatus(@PathVariable PostStatus status) {
        List<Post> posts = postService.findByStatus(status);
        List<PostResponseDTO> result = posts.stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Admin duyệt bài
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(@PathVariable Long id) {
        Optional<Post> postOpt = postService.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Post post = postOpt.get();
        post.setStatus(PostStatus.APPROVED);
        postService.save(post);
        return ResponseEntity.ok("Đã duyệt bài viết");
    }

    // Admin từ chối bài
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectPost(@PathVariable Long id) {
        Optional<Post> postOpt = postService.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Post post = postOpt.get();
        post.setStatus(PostStatus.REJECTED);
        postService.save(post);
        return ResponseEntity.ok("Đã từ chối bài viết");
    }

    // Xóa bài viết
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Optional<Post> postOpt = postService.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        postService.deleteById(id);
        return ResponseEntity.ok("Đã xóa bài viết thành công");
    }

    // User đăng bài với hình ảnh và caption
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createPostWithImage(@RequestParam("caption") String caption,
                                                 @RequestParam("image") MultipartFile image,
                                                 @RequestParam("userId") Long userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User không tồn tại");
        }

        String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Post post = new Post();
            post.setCaption(caption);
            post.setImageUrl("/uploads/images/" + fileName);
            post.setStatus(PostStatus.PENDING);
            post.setUser(userOpt.get());
            post.setCreatedAt(java.time.LocalDateTime.now()); // Đảm bảo set thời gian tạo
            postService.save(post);

            return ResponseEntity.ok("Đăng bài thành công, chờ admin duyệt!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi lưu file hình ảnh: " + e.getMessage());
        }
    }
}