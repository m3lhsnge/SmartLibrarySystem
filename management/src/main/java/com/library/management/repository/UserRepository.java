package com.library.management.repository;

import com.library.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // kullanıcı adına göre bulma (login için)
    Optional<User> findByUsername(String username);

    // mail adresine göre bulma (sifre sıfırlama için)
    Optional<User> findByEmail(String email);

    // doğrulama tokenına göre bul (mail aktivasyonu için)
    Optional<User> findByVerificationToken(String token);

    // kullanıcı adı veya mail daha önce alınmış mı kontrol(kayıt olurken)
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}