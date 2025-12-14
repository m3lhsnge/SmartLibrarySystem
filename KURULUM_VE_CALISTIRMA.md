# 🚀 Kütüphane Yönetim Sistemi - Kurulum ve Çalıştırma Kılavuzu

## 📋 Gereksinimler

- Java 21
- Maven
- Node.js (v18 veya üzeri)
- npm veya yarn
- SQL Server (SQLEXPRESS)
- Veritabanı: `Kutuphane` (otomatik oluşturulacak)

---

## 🔧 1. BACKEND KURULUMU VE ÇALIŞTIRMA

### Adım 1: Backend Klasörüne Gidin
```bash
cd management
```

### Adım 2: Maven Bağımlılıklarını Yükleyin (İlk Kurulum)
```bash
mvn clean install
```

### Adım 3: Backend'i Çalıştırın
```bash
mvn spring-boot:run
```

**VEYA** IDE'de (IntelliJ IDEA, Eclipse, VS Code):
- `ManagementApplication.java` dosyasını açın
- Run butonuna tıklayın

### ✅ Backend Başarıyla Çalışıyorsa:
- Backend `https://localhost:8443` adresinde çalışacak
- Tarayıcıda self-signed certificate uyarısı çıkabilir (geliştirme için normal)
- Console'da "Started ManagementApplication" mesajını göreceksiniz

### 🔍 Backend Kontrol:
Tarayıcıda şu adresi açın (uyarıyı görmezden gelin):
```
https://localhost:8443/api/books
```

Boş array `[]` dönerse backend çalışıyor demektir.

---

## 🎨 2. FRONTEND KURULUMU VE ÇALIŞTIRMA

### Adım 1: Frontend Klasörüne Gidin
```bash
cd ../frontend
```

### Adım 2: Node.js Bağımlılıklarını Yükleyin (İlk Kurulum)
```bash
npm install
```

**Not:** İlk kurulum 2-3 dakika sürebilir.

### Adım 3: Frontend'i Çalıştırın
```bash
npm run dev
```

### ✅ Frontend Başarıyla Çalışıyorsa:
- Frontend `http://localhost:5173` adresinde çalışacak
- Tarayıcı otomatik açılacak
- Console'da "Local: http://localhost:5173" mesajını göreceksiniz

---

## 🧪 3. TEST ETME

### Test Senaryosu 1: Kayıt Ol ve Giriş Yap

1. **Ana Sayfa:** `http://localhost:5173`
   - "Kayıt Ol" butonuna tıklayın

2. **Kayıt Formu:**
   - Ad Soyad: `Test Kullanıcı`
   - Kullanıcı Adı: `testuser`
   - Email: `test@example.com` (gerçek email kullanın, doğrulama maili gelecek)
   - Şifre: `123456`
   - Şifre Tekrar: `123456`
   - Rol: `Öğrenci`
   - "Kayıt Ol" butonuna tıklayın

3. **Mail Doğrulama:**
   - Email kutunuzu kontrol edin
   - Mail'deki doğrulama linkine tıklayın
   - Hesap aktif olacak

4. **Giriş Yap:**
   - Login sayfasına gidin: `http://localhost:5173/login`
   - Kullanıcı adı: `testuser`
   - Şifre: `123456`
   - "Giriş Yap" butonuna tıklayın

5. **Öğrenci Paneli:**
   - Otomatik olarak `/student` sayfasına yönlendirileceksiniz
   - Kitapları görüntüleyebilir, ödünç alabilirsiniz

### Test Senaryosu 2: Admin Paneli

1. **Admin Kullanıcısı Oluşturma:**
   - Backend'de direkt veritabanına admin kullanıcısı ekleyin VEYA
   - Kayıt olurken rolü "Personel" seçin (admin yetkisi için backend'de değişiklik gerekebilir)

2. **Admin Paneline Giriş:**
   - Admin kullanıcısı ile giriş yapın
   - Otomatik olarak `/admin` sayfasına yönlendirileceksiniz
   - Kitapları, kategorileri, kullanıcıları yönetebilirsiniz

### Test Senaryosu 3: Şifre Sıfırlama

1. **Şifremi Unuttum:**
   - Login sayfasında "Şifremi Unuttum" linkine tıklayın
   - Email adresinizi girin
   - "Şifre Sıfırlama Linki Gönder" butonuna tıklayın

2. **Mail'den Link:**
   - Email kutunuzu kontrol edin
   - Mail'deki şifre sıfırlama linkine tıklayın
   - Yeni şifre belirleyin

3. **Yeni Şifre ile Giriş:**
   - Yeni şifrenizle giriş yapın

---

## 🐛 SORUN GİDERME

### Backend Çalışmıyor

**Sorun 1: Port 8443 kullanımda**
```bash
# Windows'ta portu kullanan process'i bulun
netstat -ano | findstr :8443
# PID'yi not edin ve process'i sonlandırın
taskkill /PID <PID> /F
```

**Sorun 2: Veritabanı bağlantı hatası**
- SQL Server'ın çalıştığından emin olun
- `application.properties` dosyasındaki veritabanı bilgilerini kontrol edin
- Veritabanı kullanıcısının (`app_user`) yetkilerini kontrol edin

**Sorun 3: Keystore hatası**
- `src/main/resources/keystore.p12` dosyasının var olduğundan emin olun
- Yoksa SSL'i devre dışı bırakabilirsiniz (sadece geliştirme için)

### Frontend Çalışmıyor

**Sorun 1: npm install hatası**
```bash
# Node.js versiyonunu kontrol edin
node --version  # v18 veya üzeri olmalı

# npm cache'i temizleyin
npm cache clean --force

# node_modules'ı silip tekrar yükleyin
rm -rf node_modules
npm install
```

**Sorun 2: Port 5173 kullanımda**
- Vite otomatik olarak başka bir port seçecektir
- Console'da hangi portta çalıştığını kontrol edin

**Sorun 3: Backend'e bağlanamıyor**
- Backend'in çalıştığından emin olun
- Tarayıcı console'unda (F12) hata mesajlarını kontrol edin
- HTTPS self-signed certificate uyarısını görmezden gelin

### CORS Hatası

Backend'de CORS ayarları zaten yapılmış. Eğer hala sorun varsa:
- `WebConfig.java` dosyasını kontrol edin
- `allowedOrigins` kısmında `http://localhost:5173` olduğundan emin olun

---

## 📝 NOTLAR

1. **HTTPS Self-Signed Certificate:**
   - Backend HTTPS kullanıyor (geliştirme için self-signed certificate)
   - Tarayıcıda "Gelişmiş" → "localhost'a devam et" seçeneğini kullanın
   - Bu sadece geliştirme ortamı için normaldir

2. **Mail Ayarları:**
   - Gmail kullanılıyor
   - `application.properties` dosyasındaki mail bilgilerini kendi Gmail hesabınızla değiştirin
   - Gmail'de "Uygulama Şifreleri" oluşturmanız gerekebilir

3. **Veritabanı:**
   - İlk çalıştırmada tablolar otomatik oluşturulacak
   - `DataSeeder` otomatik olarak 50 kitap, 5 kategori yükleyecek

4. **Hot Reload:**
   - Frontend: Değişiklikler otomatik yenilenir
   - Backend: Spring Boot DevTools ile otomatik yeniden başlar

---

## ✅ BAŞARILI KURULUM KONTROLÜ

Her şey çalışıyorsa:
- ✅ Backend: `https://localhost:8443/api/books` → JSON döner
- ✅ Frontend: `http://localhost:5173` → Ana sayfa açılır
- ✅ Kayıt ol: Form çalışır, mail gelir
- ✅ Giriş yap: Kullanıcı girişi çalışır
- ✅ Ana sayfa: Kitaplar görünür
- ✅ Kategori filtreleme: Çalışır
- ✅ Öğrenci paneli: Kitap ödünç alma çalışır

---

## 🎉 HAZIRSINIZ!

Artık kütüphane yönetim sisteminiz çalışıyor. Test edebilirsiniz!

