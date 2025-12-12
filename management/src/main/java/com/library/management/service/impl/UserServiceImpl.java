package com.library.management.service.impl;

import com.library.management.entity.User;
import com.library.management.repository.UserRepository;
import com.library.management.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public User createUser(User user) {
        //  Şifreyi Hashle
        String encodedPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(encodedPassword);

        //  Hesabı Pasif Yap (Mail onayı bekliyor)
        user.setActive(false);

        // Rastgele Doğrulama Kodu Üret
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        //  Veritabanına Kaydet
        User savedUser = userRepository.save(user);

        // Mail Gönder
        try {
            emailService.sendVerificationEmail(user.getEmail(), token);
        } catch (Exception e) {
            System.out.println("Mail Hatası: " + e.getMessage());
        }

        return savedUser;
    }

    @Override
    public String verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token).orElse(null);

        if (user == null) {
            return "HATA: Geçersiz veya hatalı doğrulama linki!";
        }

        if (user.isActive()) {
            return "BİLGİ: Bu hesap zaten doğrulanmış. Giriş yapabilirsiniz.";
        }

        user.setActive(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "BAŞARILI: Hesabınız doğrulandı! Artık giriş yapabilirsiniz.";
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + username));
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Kullanıcı ID bulunamadı: " + id));
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        User existingUser = getUserById(id);
        existingUser.setFullName(userDetails.getFullName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setRole(userDetails.getRole());
        existingUser.setActive(userDetails.isActive());
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        // SOFT DELETE
        User user = getUserById(id);

        // kullaniciyi silmek yerine pasife çekiyoruz
        user.setActive(false);
        // token'ı siliyoruz mail ile tekrar aktif edemesin
        user.setVerificationToken(null);

        userRepository.save(user);
    }
}