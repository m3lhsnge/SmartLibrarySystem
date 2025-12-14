package com.library.management.service.impl;

import com.library.management.entity.Book;
import com.library.management.entity.Borrowing;
import com.library.management.entity.BorrowingStatus;
import com.library.management.entity.User;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowingRepository;
import com.library.management.repository.UserRepository;
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
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

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
    @Transactional
    public Borrowing returnBook(Long borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId).orElseThrow(() -> new RuntimeException("Borrowing not found"));

        if (borrowing.getReturnDate() != null) {
            throw new RuntimeException("Book already returned");
        }

        // 1. İade Tarihini Gir
        borrowing.setReturnDate(LocalDateTime.now());
        borrowing.setStatus(BorrowingStatus.RETURNED);
        borrowingRepository.save(borrowing);

        // 2. Stok artışı - Kitabın mevcut kopya sayısını artır
        Book book = borrowing.getBook();
        if (book != null && book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }

        // 3. KRİTİK NOKTA: SQL Prosedürünü Çağır ve Cezayı Hesaplat!
        borrowingRepository.calculatePenalty(borrowingId);

        // 4. Güncellenmiş borrowing'i tekrar yükle (book bilgisiyle birlikte)
        return borrowingRepository.findById(borrowingId).orElse(borrowing);
    }

    @Override
    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }

    @Override
    public List<Borrowing> getBorrowingsByUserId(Long userId) {
        return borrowingRepository.findByUser_UserId(userId);
    }
}