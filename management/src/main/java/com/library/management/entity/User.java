package com.library.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = " users")
@Data
@NoArgsConstructor


public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="user_id")
    private long userId;

    @Column(name = "username",unique = true,nullable = false,length = 50)
    private String username;

    @Column(name = "email",unique = true,nullable = false,length = 100)
    private String email;

    @Column(name = "password_hash",nullable = false,length = 250)
    private String passwordHash;

    @Column(name = "full_name",nullable = false,length = 100)
    private String fullName;

    @Column(name = "phone",length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false)
    private UserRole role = UserRole.STUDENT;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdArt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedArt = LocalDateTime.now();
















}
