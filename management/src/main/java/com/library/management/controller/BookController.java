package com.library.management.controller;

import com.library.management.entity.Book;
import com.library.management.service.BookService;
import com.library.management.repository.BookRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final BookRepository bookRepository;

    public BookController(BookService bookService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/isbn/{isbn}")
    public Book getBookByIsbn(@PathVariable String isbn) {
        return bookService.getBookByIsbn(isbn);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(id, book);
    }

    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return "Book deleted ID: " + id;
    }

    // --- YENİ ENDPOINTLER ---

    // Editörün Seçimi
    @GetMapping("/featured")
    public List<Book> getFeaturedBooks() {
        return bookRepository.findByIsFeaturedTrue();
    }

    // Son Eklenenler
    @GetMapping("/latest")
    public List<Book> getLatestBooks() {
        return bookRepository.findTop10ByOrderByCreatedAtDesc();
    }
}

//book sınıfının postman uzerinden post get delete put methodlarını kullanılmasını sağlayan kod