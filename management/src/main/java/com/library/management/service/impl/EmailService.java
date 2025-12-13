package com.library.management.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();

        // Mailin kimden gittiği (Gmail kendi adresini basar ama burada görünür isim olsun)
        message.setFrom("kutuphane.sistemi@gmail.com");

        message.setTo(toEmail);
        message.setSubject("Kütüphane Üyelik Doğrulama");
        message.setText("Merhaba,\n\n" +
                "Üyeliğinizi aktif etmek için lütfen aşağıdaki linke tıklayın:\n\n" +
                "https://localhost:8443/api/users/verify?token=" + token);

        mailSender.send(message);
        System.out.println("✅ Mail servisi çalıştı, gönderilen: " + toEmail);
    }
    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("kutuphane.sistemi@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Şifre Sıfırlama Talebi");
        message.setText("Merhaba,\n\n" +
                "Şifrenizi sıfırlamak için lütfen aşağıdaki linke tıklayın:\n\n" +
                "http://localhost:5173/reset-password?token=" + token + "\n\n" +
                "(Not: Linkteki 5173 portu React uygulamanız içindir)");

        mailSender.send(message);
        System.out.println("🔑 Şifre sıfırlama maili gönderildi: " + toEmail);
    }
}