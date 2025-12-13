package com.library.management.service;

import com.library.management.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserByUsername(String username);

    User updateUser(Long id, User user);

    User getUserById(Long id);

    String verifyUser(String token);

    void deleteUser(Long id);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
}
