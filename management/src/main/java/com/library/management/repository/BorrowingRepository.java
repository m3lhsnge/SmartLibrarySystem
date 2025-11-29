package com.library.management.repository;

import com.library.management.entity.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing,Long> {
    List<Borrowing> findByUser_UserId(Long userId);

}
