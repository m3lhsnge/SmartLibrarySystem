package com.library.management.service;

import com.library.management.entity.Borrowing;
import java.util.List;

public interface BorrowingService {
    Borrowing borrowBook(Long userId, Long bookId, String notes);
    Borrowing returnBook(Long borrowingId);
    List<Borrowing> getAllBorrowings();
    List<Borrowing> getBorrowingsByUserId(Long userId);
}