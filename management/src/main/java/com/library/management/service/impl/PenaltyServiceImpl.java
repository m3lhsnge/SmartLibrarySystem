package com.library.management.service.impl;

import com.library.management.entity.Penalty;
import com.library.management.repository.PenaltyRepository;
import com.library.management.service.PenaltyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PenaltyServiceImpl implements PenaltyService {

    private final PenaltyRepository penaltyRepository;

    public PenaltyServiceImpl(PenaltyRepository penaltyRepository) {
        this.penaltyRepository = penaltyRepository;
    }

    // 1. Robotu Tetikleyen Metot
    @Override
    public void calculateFines() {
        penaltyRepository.executeCalculateFinesProcedure();
    }

    // 2. Tüm Cezaları Listele
    @Override
    public List<Penalty> getAllPenalties() {
        return penaltyRepository.findAll();
    }

    // 3. Bir Öğrencinin Cezalarını Bul
    @Override
    public List<Penalty> getPenaltiesByUser(Long userId) {
        return penaltyRepository.findByUser_UserId(userId);
    }
}