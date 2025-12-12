package com.library.management.controller;

import com.library.management.entity.Penalty;
import com.library.management.service.impl.PenaltyServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalties")
public class PenaltyController {

    private final PenaltyServiceImpl penaltyService;

    public PenaltyController(PenaltyServiceImpl penaltyService) {
        this.penaltyService = penaltyService;
    }

    //hesapla butonuna basınca çalışır
    // URL: POST https://localhost:8443/api/penalties/calculate
    @PostMapping("/calculate")
    public String calculateFines() {
        penaltyService.calculateFines();
        return "✅ Gecikme cezaları başarıyla hesaplandı ve veritabanına işlendi!";
    }

    // listeleme
    @GetMapping
    public List<Penalty> getAllPenalties() {
        return penaltyService.getAllPenalties();
    }

    // öğrenciye göre
    @GetMapping("/user/{userId}")
    public List<Penalty> getUserPenalties(@PathVariable Long userId) {
        return penaltyService.getPenaltiesByUser(userId);
    }
}