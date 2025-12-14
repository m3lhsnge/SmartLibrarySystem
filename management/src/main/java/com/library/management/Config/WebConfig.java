package com.library.management.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Tüm adreslere izin ver
                        .allowedOrigins("http://localhost:5173") // Sadece React'ın çalıştığı porta izin ver
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // İzin verilen işlemler
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}