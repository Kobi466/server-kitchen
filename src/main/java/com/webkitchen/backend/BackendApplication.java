package com.webkitchen.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
// This is the main application class for the backend service.
// It uses Spring Boot to bootstrap the application.
// The @SpringBootApplication annotation enables auto-configuration, component scanning, and configuration properties scanning.