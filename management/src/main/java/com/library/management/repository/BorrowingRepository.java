package com.library.management.repository;

import com.library.management.entity.Borrowing;
import com.library.management.entity.BorrowingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

    //kullanıcının aldığı tüm kitapları getir
    List<Borrowing> findByUser_UserId(Long userId);

    // oduncte olan kitapları bulmak için
    List<Borrowing> findByStatus(BorrowingStatus status);
    // ... yukarıdaki kodlar aynı ...

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query(value = "EXEC sp_CalculatePenaltyForReturn :borrowingId", nativeQuery = true)
    void calculatePenalty(@org.springframework.data.repository.query.Param("borrowingId") Long borrowingId);
}
