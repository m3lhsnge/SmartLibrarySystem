package com.library.management.service.impl;

import com.library.management.entity.*;
import com.library.management.repository.*;
import com.library.management.service.BorrowingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowingServiceImpl implements BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BorrowingServiceImpl(BorrowingRepository borrowingRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.borrowingRepository = borrowingRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    // ödünç verme işlemleri
    @Override
    @Transactional
    public Borrowing borrowBook(Long userId, Long bookId, String notes) {
        //kullanıcıyı bul
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        //eğer kullanıcı silinmişse (pasifse) kitap alamaz
        if (!user.isActive()) {
            throw new RuntimeException("Bu kullanıcı hesabı pasif/silinmiş durumda! İşlem yapılamaz.");
        }

        //kitabı bul
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Kitap bulunamadı!"));

        //stok kontrol
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Bu kitaptan stokta kalmadı!");
        }

        //ödünç nesnesini oluştur
        Borrowing borrowing = new Borrowing();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setBorrowDate(LocalDateTime.now());
        borrowing.setDueDate(LocalDateTime.now().plusDays(15)); // 15 gün süre
        borrowing.setStatus(BorrowingStatus.BORROWED);
        borrowing.setNotes(notes);

        //kaydet (trigger stok düşümünü veritabanında yapacak)
        return borrowingRepository.save(borrowing);
    }

    // iade alma işlemleri
    @Override
    public Borrowing returnBook(Long borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId).orElseThrow(() -> new RuntimeException("Kayıt bulunamadı!"));

        if (borrowing.getStatus() == BorrowingStatus.RETURNED) {
            throw new RuntimeException("Bu kitap zaten iade edilmiş!");
        }

        borrowing.setReturnDate(LocalDateTime.now());
        borrowing.setStatus(BorrowingStatus.RETURNED);

        // trigger stock artışını veritabanında yapacak
        return borrowingRepository.save(borrowing);
    }

    @Override
    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }
}