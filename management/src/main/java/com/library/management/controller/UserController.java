package com.library.management.controller;

import com.library.management.entity.User;
import com.library.management.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    // sifreyi unutunca degisim maili yollar
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        userService.forgotPassword(email);
        return "Şifre sıfırlama linki mail adresinize gönderildi.";
    }

    // sifreyi sıfırlayıp yeni sifreyi kaydetme
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return "Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.";
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/username/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "Kullanıcı başarıyla silindi. ID: " + id;
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @GetMapping("/verify")
    public String verifyAccount(@RequestParam String token) {
        return userService.verifyUser(token);
    }//mail doğrulama

    // giriş yapma (login ekranı için)
    @PostMapping("/login")
    public User login(@RequestParam String username, @RequestParam String password) {
        return userService.login(username, password);
    }

}


//user sınıfının postman uzerinden post get delete put methodlarını kullanılmasını sağlayan kod