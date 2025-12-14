package com.library.management.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
public class ImageProxyController {

    @GetMapping("/proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            // URL decode
            String decodedUrl = URLDecoder.decode(url, StandardCharsets.UTF_8);
            
            // Güvenlik kontrolü - sadece HTTP(S) URL'lerine izin ver
            if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
                return ResponseEntity.badRequest().build();
            }
            
            // URL'yi aç ve resmi oku
            URL imageUrl = new URL(decodedUrl);
            URLConnection connection = imageUrl.openConnection();
            connection.setConnectTimeout(5000); // 5 saniye timeout
            connection.setReadTimeout(5000);
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            connection.setRequestProperty("Referer", decodedUrl);
            connection.setRequestProperty("Accept", "image/*,*/*");
            
            InputStream inputStream = connection.getInputStream();
            byte[] imageBytes = inputStream.readAllBytes();
            inputStream.close();

            // Content type'ı belirle
            String contentType = connection.getContentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = determineContentType(decodedUrl);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.set("Access-Control-Allow-Origin", "*");
            headers.setCacheControl("public, max-age=31536000"); // 1 yıl cache

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            // Hata durumunda 404 döndür
            System.err.println("Image proxy error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private String determineContentType(String url) {
        String lower = url.toLowerCase();
        if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".gif")) {
            return "image/gif";
        } else if (lower.endsWith(".webp")) {
            return "image/webp";
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lower.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "image/jpeg"; // Varsayılan
    }
}

