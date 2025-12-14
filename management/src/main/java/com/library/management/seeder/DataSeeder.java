package com.library.management.seeder;

import com.library.management.entity.Author;
import com.library.management.entity.Book;
import com.library.management.entity.Category;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

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
        if (categoryRepository.count() > 0) return;

        System.out.println("🌱 Veritabanı hazırlanıyor: 5 Kategori, 50 Kitap yükleniyor...");

        // --- 1. KATEGORİLER ---
        Category cSciFi = new Category(); cSciFi.setName("Bilim Kurgu"); cSciFi.setDescription("Uzay, gelecek ve teknoloji");
        Category cFantasy = new Category(); cFantasy.setName("Fantastik"); cFantasy.setDescription("Büyülü dünyalar");
        Category cClassics = new Category(); cClassics.setName("Dünya Klasikleri"); cClassics.setDescription("Eskimeyen eserler");
        Category cHistory = new Category(); cHistory.setName("Tarih"); cHistory.setDescription("Geçmişin izleri");
        Category cSelfHelp = new Category(); cSelfHelp.setName("Kişisel Gelişim"); cSelfHelp.setDescription("Kendini geliştir");

        categoryRepository.saveAll(Arrays.asList(cSciFi, cFantasy, cClassics, cHistory, cSelfHelp));

        // --- 2. YAZARLAR ---
        Author aOrwell = createAuthor("George Orwell");
        Author aRowling = createAuthor("J.K. Rowling");
        Author aTolkien = createAuthor("J.R.R. Tolkien");
        Author aDostoyevski = createAuthor("Fyodor Dostoyevski");
        Author aHugo = createAuthor("Victor Hugo");
        Author aHarari = createAuthor("Yuval Noah Harari");
        Author aAtaturk = createAuthor("Mustafa Kemal Atatürk");
        Author aOrtayli = createAuthor("İlber Ortaylı");
        Author aClear = createAuthor("James Clear");
        Author aCoelho = createAuthor("Paulo Coelho");
        Author aAsimov = createAuthor("Isaac Asimov");
        Author aHerbert = createAuthor("Frank Herbert");
        Author aBradbury = createAuthor("Ray Bradbury");
        Author aHuxley = createAuthor("Aldous Huxley");
        Author aAdams = createAuthor("Douglas Adams");
        Author aWeir = createAuthor("Andy Weir");
        Author aZweig = createAuthor("Stefan Zweig");
        Author aKafka = createAuthor("Franz Kafka");
        Author aTolstoy = createAuthor("Lev Tolstoy");
        Author aDiamond = createAuthor("Jared Diamond");
        Author aCovey = createAuthor("Stephen Covey");
        Author aCarnegie = createAuthor("Dale Carnegie");
        Author aMurphy = createAuthor("Joseph Murphy");
        Author aKiyosaki = createAuthor("Robert Kiyosaki");
        Author aGreene = createAuthor("Robert Greene");
        Author aHill = createAuthor("Napoleon Hill");

        // --- 3. KİTAPLAR (5 Kategori x 10 Kitap = 50 Adet) ---
        // Format: Başlık, ISBN, Yıl, Stok(10), Yazar, Kategori, Resim, Featured(true/false)
        // Not: Resim URL'leri daha sonra admin panelinden eklenebilir, şimdilik placeholder

        // A) BİLİM KURGU - Resimler elle eklenecek
        createBook("1984", "9789750718533", 1949, 10, aOrwell, cSciFi, "", true);
        createBook("Fahrenheit 451", "9789752732174", 1953, 10, aBradbury, cSciFi, "", false);
        createBook("Cesur Yeni Dünya", "9789750719387", 1932, 10, aHuxley, cSciFi, "", false);
        createBook("Vakıf", "9789754680889", 1951, 10, aAsimov, cSciFi, "", false);
        createBook("Vakıf ve İmparatorluk", "9789754680902", 1952, 10, aAsimov, cSciFi, "", false);
        createBook("İkinci Vakıf", "9789754680919", 1953, 10, aAsimov, cSciFi, "", false);
        createBook("Dune", "9786053754794", 1965, 10, aHerbert, cSciFi, "", true);
        createBook("Dune Mesihi", "9786053755258", 1969, 10, aHerbert, cSciFi, "", false);
        createBook("Otostopçunun Galaksi Rehberi", "9786053757658", 1979, 10, aAdams, cSciFi, "", false);
        createBook("Marslı", "9786053754367", 2011, 10, aWeir, cSciFi, "", false);

        // B) FANTASTİK - Resimler elle eklenecek
        createBook("Harry Potter ve Felsefe Taşı", "9789750802942", 1997, 10, aRowling, cFantasy, "", true);
        createBook("Harry Potter ve Sırlar Odası", "9789750802959", 1998, 10, aRowling, cFantasy, "", false);
        createBook("Harry Potter ve Azkaban Tutsağı", "9789750802966", 1999, 10, aRowling, cFantasy, "", false);
        createBook("Harry Potter ve Ateş Kadehi", "9789750802973", 2000, 10, aRowling, cFantasy, "", false);
        createBook("Harry Potter ve Zümrüdüanka Yoldaşlığı", "9789750802980", 2003, 10, aRowling, cFantasy, "", false);
        createBook("Harry Potter ve Melez Prens", "9789750802997", 2005, 10, aRowling, cFantasy, "", false);
        createBook("Harry Potter ve Ölüm Yadigarları", "9789750809989", 2007, 10, aRowling, cFantasy, "", false);
        createBook("Yüzüklerin Efendisi: Yüzük Kardeşliği", "9789753420342", 1954, 10, aTolkien, cFantasy, "", true);
        createBook("Yüzüklerin Efendisi: İki Kule", "9789753420359", 1954, 10, aTolkien, cFantasy, "", false);
        createBook("Hobbit", "9789752733737", 1937, 10, aTolkien, cFantasy, "", false);

        // C) DÜNYA KLASİKLERİ - Resimler elle eklenecek
        createBook("Suç ve Ceza", "9789750726439", 1866, 10, aDostoyevski, cClassics, "", true);
        createBook("Karamazov Kardeşler", "9789750719462", 1880, 10, aDostoyevski, cClassics, "", false);
        createBook("Budala", "9789750719424", 1869, 10, aDostoyevski, cClassics, "", false);
        createBook("Sefiller (2 Cilt)", "9789750730412", 1862, 10, aHugo, cClassics, "", false);
        createBook("Notre Dame'ın Kamburu", "9789750719929", 1831, 10, aHugo, cClassics, "", false);
        createBook("Satranç", "9786053606116", 1942, 10, aZweig, cClassics, "", false);
        createBook("Bilinmeyen Bir Kadının Mektubu", "9786053606604", 1922, 10, aZweig, cClassics, "", false);
        createBook("Dönüşüm", "9786053609421", 1915, 10, aKafka, cClassics, "", false);
        createBook("Anna Karenina", "9789750726545", 1877, 10, aTolstoy, cClassics, "", false);
        createBook("Savaş ve Barış", "9789750736995", 1869, 10, aTolstoy, cClassics, "", true);

        // D) TARİH - Resimler elle eklenecek
        createBook("Sapiens", "9786054729074", 2011, 10, aHarari, cHistory, "", true);
        createBook("Homo Deus", "9786054729845", 2015, 10, aHarari, cHistory, "", false);
        createBook("21. Yüzyıl İçin 21 Ders", "9786054729982", 2018, 10, aHarari, cHistory, "", false);
        createBook("Nutuk", "9789751026040", 1927, 10, aAtaturk, cHistory, "", true);
        createBook("Geometri", "9789751036810", 1937, 10, aAtaturk, cHistory, "", false);
        createBook("Bir Ömür Nasıl Yaşanır?", "9786057635112", 2019, 10, aOrtayli, cHistory, "", false);
        createBook("Türklerin Tarihi", "9786050819077", 2015, 10, aOrtayli, cHistory, "", false);
        createBook("Osmanlı'yı Yeniden Keşfetmek", "9789752633853", 2006, 10, aOrtayli, cHistory, "", false);
        createBook("Tüfek, Mikrop ve Çelik", "9780393317558", 1997, 10, aDiamond, cHistory, "", false);
        createBook("İnsanlığın Kısa Tarihi", "9786054729079", 2000, 10, aHarari, cHistory, "", false);

        // E) KİŞİSEL GELİŞİM - Resimler elle eklenecek
        createBook("Atomik Alışkanlıklar", "9786057245700", 2018, 10, aClear, cSelfHelp, "", true);
        createBook("Simyacı", "9789750726439", 1988, 10, aCoelho, cSelfHelp, "", false);
        createBook("Veronika Ölmek İstiyor", "9789750726514", 1998, 10, aCoelho, cSelfHelp, "", false);
        createBook("Etkili İnsanların 7 Alışkanlığı", "9789754346266", 1989, 10, aCovey, cSelfHelp, "", false);
        createBook("Dost Kazanma Sanatı", "9789751000941", 1936, 10, aCarnegie, cSelfHelp, "", false);
        createBook("Bilinçaltının Gücü", "9786054482610", 1963, 10, aMurphy, cSelfHelp, "", false);
        createBook("Zengin Baba Yoksul Baba", "9786051062083", 1997, 10, aKiyosaki, cSelfHelp, "", false);
        createBook("İktidar", "9789752100867", 1998, 10, aGreene, cSelfHelp, "", false);
        createBook("Ustalık", "9786055532857", 2012, 10, aGreene, cSelfHelp, "", false);
        createBook("Düşün ve Zengin Ol", "9789751025067", 1937, 10, aHill, cSelfHelp, "", false);

        System.out.println("✅ 50 Adet Kitap Başarıyla Yüklendi! (Editör Seçimleri İşaretlendi)");
    }

    private Author createAuthor(String name) {
        return authorRepository.findByName(name).orElseGet(() -> authorRepository.save(new Author(name)));
    }

    // YENİ METOT İMZASI: stock ve isFeatured parametreleri var
    private void createBook(String title, String isbn, int year, int stock, Author author, Category category, String imageUrl, boolean isFeatured) {
        if (bookRepository.findByIsbn(isbn).isPresent()) return;

        Book book = new Book();
        book.setTitle(title);
        book.setIsbn(isbn);
        book.setPublicationYear(year);
        // Hem toplam hem mevcut kopyayı 10 yapıyoruz
        book.setAvailableCopies(stock);
        book.setTotalCopies(stock);
        // Vitrin durumunu setliyoruz
        book.setFeatured(isFeatured);

        book.setAuthors(new HashSet<>(Arrays.asList(author)));
        book.setCategory(category);
        book.setImageUrl(imageUrl);
        book.setShelfLocation("A-1");
        book.setLanguage("Türkçe");

        bookRepository.save(book);
    }
}

