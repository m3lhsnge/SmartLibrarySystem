package com.library.management.controller;

import com.library.management.entity.Borrowing;
import com.library.management.service.BorrowingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    // odunc alma
    @PostMapping
    public Borrowing borrowBook(
            @RequestParam Long userId,
            @RequestParam Long bookId,
            @RequestParam(required = false) String notes) { // not zorunlu değil
        return borrowingService.borrowBook(userId, bookId, notes);
    }

    // iade etme
    // URL: https://localhost:8443/api/borrowings/return/1
    @PutMapping("/return/{id}")
    public Borrowing returnBook(@PathVariable Long id) {
        return borrowingService.returnBook(id);
    }

    // listeleme
    @GetMapping
    public List<Borrowing> getAll() {
        return borrowingService.getAllBorrowings();
    }
}