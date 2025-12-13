package com.library.management.repository;

import com.library.management.entity.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PenaltyRepository extends JpaRepository<Penalty, Long> {

    List<Penalty> findByUser_UserId(Long userId);

    // bu metod SQL'deki 'sp_CalculateFines' prosedürünü çalıştırır.
    @Modifying
    @Transactional
    @Query(value = "EXEC sp_CalculateFines", nativeQuery = true)
    void executeCalculateFinesProcedure();
}