package com.library.management.service;

import com.library.management.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserByUsername(String username);
}
