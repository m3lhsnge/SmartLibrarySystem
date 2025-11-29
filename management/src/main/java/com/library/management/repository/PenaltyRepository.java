package com.library.management.repository;

import com.library.management.entity.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PenaltyRepository extends JpaRepository<Penalty,Long> {
    List<Penalty> findByUser_UserId(Long userId);
}
