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
    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bu mail adresiyle kayıtlı kullanıcı bulunamadı."));

        // Rastgele token üret ve kaydet (VerificationToken alanını tekrar kullanabiliriz)
        String token = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);

        // Mail at
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Geçersiz veya süresi dolmuş link!"));

        // yeni şifreyi hashle ve kaydet
        user.setPasswordHash(passwordEncoder.encode(newPassword));

        // token'ı temizle
        user.setVerificationToken(null);

        // kullanıcı pasifse (mail onayı yapmadıysa bile) şifre değiştirdiği için aktif edebiliriz (Opsiyonel)
        user.setActive(true);

        userRepository.save(user);
    }

    @Override
    public User login(String username, String password) {
        // kullanıcıyı bulma
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı adı veya şifre hatalı!"));

        // şifreyi kontrol etme
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı!");
        }

        // hesap aktifliğini kontrol etme
        if (!user.isActive()) {
            throw new RuntimeException("Hesabınız aktif değil! Lütfen mailinizi kontrol edin.");
        }

        return user; // giriş başarılıysa kullanıcı doner
    }
}