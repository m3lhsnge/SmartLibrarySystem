package com.library.management.service.impl;

import com.library.management.entity.Author;
import com.library.management.entity.Book;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.service.BookService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository; // yazarları bulmak için lazım

    // Constructor Injection ile ikisini de alıyoruz
    public BookServiceImpl(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @Override
    public Book addBook(Book book) {
        if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
            Set<Author> managedAuthors = new HashSet<>();

            for (Author author : book.getAuthors()) {
                if (author.getAuthorId() != null) {
                    Author existingAuthor = authorRepository.findById(author.getAuthorId()).orElseThrow(() -> new RuntimeException("author not found ID: " + author.getAuthorId()));
                    managedAuthors.add(existingAuthor);
                }
            }
            book.setAuthors(managedAuthors);
        }

        return bookRepository.save(book);
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn).orElseThrow(() -> new RuntimeException("Book not found ISBN: " + isbn));
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found ID: " + id));
    }

    @Override
    public Book updateBook(Long id, Book bookDetails) {
        Book existingBook = getBookById(id);

        existingBook.setTitle(bookDetails.getTitle());
        existingBook.setIsbn(bookDetails.getIsbn());
        existingBook.setPageCount(bookDetails.getPageCount());
        existingBook.setPublisher(bookDetails.getPublisher());
        existingBook.setPublicationYear(bookDetails.getPublicationYear());
        existingBook.setDescription(bookDetails.getDescription());
        existingBook.setShelfLocation(bookDetails.getShelfLocation());
        existingBook.setLanguage(bookDetails.getLanguage());
        existingBook.setImageUrl(bookDetails.getImageUrl());
        existingBook.setTotalCopies(bookDetails.getTotalCopies());
        existingBook.setAvailableCopies(bookDetails.getAvailableCopies());
        existingBook.setFeatured(bookDetails.isFeatured());

        if (bookDetails.getCategory() != null) {
            existingBook.setCategory(bookDetails.getCategory());
        }

        if (bookDetails.getAuthors() != null) {
            Set<Author> managedAuthors = new HashSet<>();
            for (Author author : bookDetails.getAuthors()) {
                if (author.getAuthorId() != null) {
                    Author existingAuthor = authorRepository.findById(author.getAuthorId()).orElseThrow(() -> new RuntimeException("Author not found ID: " + author.getAuthorId()));
                    managedAuthors.add(existingAuthor);
                }
            }
            existingBook.setAuthors(managedAuthors);
        }

        return bookRepository.save(existingBook);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}