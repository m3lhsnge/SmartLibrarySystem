package com.library.management.service.impl;

import com.library.management.entity.Author;
import com.library.management.repository.AuthorRepository;
import com.library.management.service.AuthorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorServiceImpl(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Override
    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @Override
    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found ID: " + id));
    }

    @Override
    public Author updateAuthor(Long id, Author authorDetails) {
        // Önce veritabanındaki mevcut yazarı buluyoruz
        Author existingAuthor = getAuthorById(id);

        // Şimdi gelen yeni bilgilerle güncelliyoruz
        existingAuthor.setName(authorDetails.getName());
        existingAuthor.setBirthYear(authorDetails.getBirthYear());
        existingAuthor.setNationality(authorDetails.getNationality());
        existingAuthor.setBiography(authorDetails.getBiography());

        return authorRepository.save(existingAuthor);
    }

    @Override
    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }
}