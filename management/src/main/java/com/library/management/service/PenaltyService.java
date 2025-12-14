package com.library.management.service;

import com.library.management.entity.Penalty;

import java.util.List;

public interface PenaltyService {
    void calculateFines();
    List<Penalty> getAllPenalties();
    List<Penalty> getPenaltiesByUser(Long userId);
}

