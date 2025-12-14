package com.library.management.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@Data // Lombok bu anotasyon sayesinde setFeatured, getFeatured metodlarını otomatik oluşturur
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "isbn", unique = true, length = 20)
    private String isbn;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(name = "publisher", length = 100)
    private String publisher;

    @Column(name = "language", length = 50)
    private String language = "Türkçe";

    @Column(name = "page_count")
    private Integer pageCount;

    // EKSİK OLAN ALANLAR BUNLARDI:
    @Column(name = "total_copies")
    private Integer totalCopies = 10;

    @Column(name = "available_copies")
    private Integer availableCopies = 10;

    // DataSeeder'ın aradığı alan tam olarak bu:
    @Column(name = "is_featured")
    private boolean isFeatured = false;

    @Column(name = "shelf_location", length = 50)
    private String shelfLocation;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToMany
    @JoinTable(
            name = "book_authors",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<Author> authors = new HashSet<>();

    @Column(name = "image_url")
    @JsonProperty("imageUrl")
    private String imageUrl;
}