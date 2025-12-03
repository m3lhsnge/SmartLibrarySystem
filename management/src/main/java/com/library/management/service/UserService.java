package com.library.management.service;

import com.library.management.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserByUsername(String username);

    User updateUser(Long id, User user);

    User getUserById(Long id); // ID ile bulmayı da ekleyelim, güncelleme için lazım
}
