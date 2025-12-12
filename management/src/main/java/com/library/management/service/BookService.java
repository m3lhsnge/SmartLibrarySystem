package com.library.management.service;

import com.library.management.entity.Book;
import java.util.List;

public interface BookService {

    Book addBook(Book book);
    List<Book> getAllBooks();
    Book getBookByIsbn(String isbn);
    Book getBookById(Long id);
    Book updateBook(Long id, Book book);
    void deleteBook(Long id);
}

//service interface i serviceimpl dosyasına implements edilecek