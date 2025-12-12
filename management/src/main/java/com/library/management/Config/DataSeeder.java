package com.library.management.config;

import com.library.management.entity.Author;
import com.library.management.entity.Book;
import com.library.management.entity.Category;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

//kitaplar otomatik olusturulsun diye bu sınıfı yazdık

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(BookRepository bookRepository, AuthorRepository authorRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // veritabanı doluysa işlem yapma (KİTAPLAR 1 KERE DATABASEDE OLUŞTURULDU TEKRARA ÜST ÜSTE BİNME DURUMLARI YOK)
        if (categoryRepository.count() > 0) {
            return;
        }

        System.out.println("--- 📚 Dev Kütüphane Verisi Yükleniyor (5 Kategori, 50 Kitap)... ---");

        //kategori
        Category c1 = createCategory("Dünya Klasikleri", "Dünya edebiyatının en seçkin eserleri");
        Category c2 = createCategory("Bilim Kurgu", "Gelecek, uzay ve teknoloji temalı eserler");
        Category c3 = createCategory("Psikoloji", "İnsan zihni ve davranışları üzerine incelemeler");
        Category c4 = createCategory("Tarih", "Geçmiş olayları ve dönemleri anlatan eserler");
        Category c5 = createCategory("Kişisel Gelişim", "Kendini geliştirme ve başarı odaklı kitaplar");

        // yazar olusturma
        List<Author> authors = createAuthors();

        // kitaplari olusturma

        // --- Kategori 1: Dünya Klasikleri ---
        createBook("Suç ve Ceza", "978-1", 1866, "İş Bankası", 687, "A-1", c1, authors.get(0)); // Dostoyevski
        createBook("Sefiller", "978-2", 1862, "Can Yayınları", 1500, "A-2", c1, authors.get(1)); // Victor Hugo
        createBook("Anna Karenina", "978-3", 1877, "İletişim", 850, "A-3", c1, authors.get(2)); // Tolstoy
        createBook("Vadideki Zambak", "978-4", 1835, "Can Yayınları", 320, "A-4", c1, authors.get(3)); // Balzac
        createBook("Kırmızı ve Siyah", "978-5", 1830, "İş Bankası", 540, "A-5", c1, authors.get(0));
        createBook("Babalar ve Oğullar", "978-6", 1862, "İletişim", 240, "A-6", c1, authors.get(2));
        createBook("İki Şehrin Hikayesi", "978-7", 1859, "Can Yayınları", 460, "A-7", c1, authors.get(4)); // Dickens
        createBook("Monte Kristo Kontu", "978-8", 1844, "İş Bankası", 1200, "A-8", c1, authors.get(1));
        createBook("Gurur ve Önyargı", "978-9", 1813, "Can Yayınları", 380, "A-9", c1, authors.get(4));
        createBook("Madam Bovary", "978-10", 1856, "İletişim", 400, "A-10", c1, authors.get(3));

        // --- Kategori 2: Bilim Kurgu ---
        createBook("Dune", "978-11", 1965, "İthaki", 700, "B-1", c2, authors.get(5)); // Frank Herbert
        createBook("1984", "978-12", 1949, "Can Yayınları", 350, "B-2", c2, authors.get(6)); // Orwell
        createBook("Fahrenheit 451", "978-13", 1953, "İthaki", 200, "B-3", c2, authors.get(7)); // Bradbury
        createBook("Cesur Yeni Dünya", "978-14", 1932, "İthaki", 310, "B-4", c2, authors.get(8)); // Huxley
        createBook("Ben, Robot", "978-15", 1950, "İthaki", 250, "B-5", c2, authors.get(9)); // Asimov
        createBook("Vakıf", "978-16", 1951, "İthaki", 280, "B-6", c2, authors.get(9));
        createBook("Marslı", "978-17", 2011, "İthaki", 420, "B-7", c2, authors.get(5));
        createBook("Otostopçunun Galaksi Rehberi", "978-18", 1979, "Alfa", 220, "B-8", c2, authors.get(7));
        createBook("Zaman Makinesi", "978-19", 1895, "İş Bankası", 150, "B-9", c2, authors.get(6));
        createBook("Androidler Elektrikli Koyun Düşler mi?", "978-20", 1968, "Altıkırkbeş", 260, "B-10", c2, authors.get(8));

        // --- Kategori 3: Psikoloji ---
        createBook("İnsanın Anlam Arayışı", "978-21", 1946, "Okuyan Us", 180, "C-1", c3, authors.get(10)); // Frankl
        createBook("Kitleler Psikolojisi", "978-22", 1895, "İş Bankası", 210, "C-2", c3, authors.get(11)); // Freud
        createBook("Düşünce Gücüyle Tedavi", "978-23", 1984, "Altın", 280, "C-3", c3, authors.get(10));
        createBook("Bilinçaltı", "978-24", 1915, "Say", 300, "C-4", c3, authors.get(11));
        createBook("Duygusal Zeka", "978-25", 1995, "Varlık", 450, "C-5", c3, authors.get(10));
        createBook("Akış: Mutluluk Bilimi", "978-26", 1990, "Hyb", 320, "C-6", c3, authors.get(11));
        createBook("Kendini Arayan İnsan", "978-27", 1953, "Okuyan Us", 240, "C-7", c3, authors.get(10));
        createBook("Psikanaliz Üzerine", "978-28", 1910, "Say", 150, "C-8", c3, authors.get(11));
        createBook("Sevme Sanatı", "978-29", 1956, "Payel", 190, "C-9", c3, authors.get(10));
        createBook("Totem ve Tabu", "978-30", 1913, "Say", 270, "C-10", c3, authors.get(11));

        // --- Kategori 4: Tarih ---
        createBook("Sapiens", "978-31", 2011, "Kolektif", 450, "D-1", c4, authors.get(12)); // Harari
        createBook("Homo Deus", "978-32", 2015, "Kolektif", 480, "D-2", c4, authors.get(12));
        createBook("Nutuk", "978-33", 1927, "Alpha", 600, "D-3", c4, authors.get(13)); // Atatürk
        createBook("İlber Ortaylı Seyahatnamesi", "978-34", 2010, "Kronik", 250, "D-4", c4, authors.get(14)); // İlber Ortaylı
        createBook("İmparatorluğun En Uzun Yüzyılı", "978-35", 1983, "Timaş", 320, "D-5", c4, authors.get(14));
        createBook("Osmanlı Tarihi", "978-36", 1999, "TTK", 800, "D-6", c4, authors.get(13));
        createBook("Türklerin Tarihi", "978-37", 2015, "Timaş", 400, "D-7", c4, authors.get(14));
        createBook("Çöküş", "978-38", 2005, "Kolektif", 550, "D-8", c4, authors.get(12));
        createBook("21. Yüzyıl İçin 21 Ders", "978-39", 2018, "Kolektif", 380, "D-9", c4, authors.get(12));
        createBook("Yakın Tarih Gerçekleri", "978-40", 2012, "Timaş", 290, "D-10", c4, authors.get(14));

        // --- Kategori 5: Kişisel Gelişim ---
        createBook("Atomik Alışkanlıklar", "978-41", 2018, "Pegasus", 320, "E-1", c5, authors.get(15)); // James Clear
        createBook("Etkili İnsanların 7 Alışkanlığı", "978-42", 1989, "Varlık", 400, "E-2", c5, authors.get(15));
        createBook("Zengin Baba Yoksul Baba", "978-43", 1997, "Alfa", 250, "E-3", c5, authors.get(16)); // Kiyosaki
        createBook("Dost Kazanma Sanatı", "978-44", 1936, "Epsilon", 300, "E-4", c5, authors.get(15));
        createBook("Simyacı", "978-45", 1988, "Can", 188, "E-5", c5, authors.get(16));
        createBook("Büyük Düşünmenin Büyüsü", "978-46", 1959, "Remzi", 340, "E-6", c5, authors.get(15));
        createBook("İrade Terbiyesi", "978-47", 1893, "Ediz", 210, "E-7", c5, authors.get(16));
        createBook("Outliers", "978-48", 2008, "MediaCat", 280, "E-8", c5, authors.get(15));
        createBook("Her Şey Seninle Başlar", "978-49", 2005, "Alfa", 240, "E-9", c5, authors.get(16));
        createBook("Şu Hortumlu Dünyada Fil Yalnız Bir Hayvandır", "978-50", 2010, "İletişim", 350, "E-10", c5, authors.get(15));

        System.out.println("--- ✅ 50 Kitap Başarıyla Yüklendi! ---");
    }

    private Category createCategory(String name, String desc) {
        Category c = new Category();
        c.setCategoryName(name);
        c.setDescription(desc);
        return categoryRepository.save(c);
    }

    private List<Author> createAuthors() {
        return authorRepository.saveAll(Arrays.asList(
                new Author(null, "Fyodor Dostoyevski", 1821, "Rus", "Rus edebiyatı", null), // 0
                new Author(null, "Victor Hugo", 1802, "Fransız", "Romantizm", null), // 1
                new Author(null, "Lev Tolstoy", 1828, "Rus", "Realizm", null), // 2
                new Author(null, "Honore de Balzac", 1799, "Fransız", "Realizm", null), // 3
                new Author(null, "Charles Dickens", 1812, "İngiliz", "Viktorya Dönemi", null), // 4
                new Author(null, "Frank Herbert", 1920, "Amerikalı", "Bilim Kurgu", null), // 5
                new Author(null, "George Orwell", 1903, "İngiliz", "Distopya", null), // 6
                new Author(null, "Ray Bradbury", 1920, "Amerikalı", "Bilim Kurgu", null), // 7
                new Author(null, "Aldous Huxley", 1894, "İngiliz", "Distopya", null), // 8
                new Author(null, "Isaac Asimov", 1920, "Rus/Amerikalı", "Bilim Kurgu", null), // 9
                new Author(null, "Viktor E. Frankl", 1905, "Avusturyalı", "Psikiyatri", null), // 10
                new Author(null, "Sigmund Freud", 1856, "Avusturyalı", "Psikanaliz", null), // 11
                new Author(null, "Yuval Noah Harari", 1976, "İsrailli", "Tarihçi", null), // 12
                new Author(null, "Mustafa Kemal Atatürk", 1881, "Türk", "Kurucu Lider", null), // 13
                new Author(null, "İlber Ortaylı", 1947, "Türk", "Tarihçi", null), // 14
                new Author(null, "James Clear", 1986, "Amerikalı", "Yazar", null), // 15
                new Author(null, "Robert Kiyosaki", 1947, "Amerikalı", "Yatırımcı", null) // 16
        ));
    }

    private void createBook(String title, String isbn, int year, String publisher, int pages, String shelf, Category cat, Author author) {
        Book b = new Book();
        b.setTitle(title);
        b.setIsbn(isbn);
        b.setPublicationYear(year);
        b.setPublisher(publisher);
        b.setPageCount(pages);
        b.setShelfLocation(shelf);
        b.setCategory(cat);
        b.setAuthors(new HashSet<>(Collections.singletonList(author)));

      //her kitaptan 10 adet olacak sekilde ayarladim
        b.setTotalCopies(10);
        b.setAvailableCopies(10);

        bookRepository.save(b);
    }
}