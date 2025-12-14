# 🚀 IDE'den Backend Çalıştırma Kılavuzu

## 📋 VS Code ile Çalıştırma

### Yöntem 1: Task Runner (Önerilen)

1. **Task'ı Çalıştır:**
   - `Ctrl + Shift + P` (veya `Cmd + Shift + P` Mac'te)
   - "Tasks: Run Task" yazın
   - **"Spring Boot: Run"** seçeneğini seçin

2. **Kısayol:**
   - `Ctrl + Shift + B` (Build Task) - Default task çalışır

3. **Terminal'de Görünüm:**
   - Task çalıştığında yeni bir terminal açılacak
   - Backend loglarını burada göreceksiniz
   - `https://localhost:8443` adresinde çalışacak

### Yöntem 2: Debug Mode

1. **Debug Konfigürasyonu:**
   - Sol taraftaki "Run and Debug" ikonuna tıklayın (veya `Ctrl + Shift + D`)
   - **"Spring Boot: ManagementApplication"** seçin
   - Yeşil play butonuna tıklayın

2. **Breakpoint Kullanımı:**
   - Kod satırının yanına tıklayarak breakpoint ekleyin
   - Debug modda çalıştırın
   - Adım adım kod çalıştırabilirsiniz

### Yöntem 3: Java Extension Pack

1. **Java Extension Pack Kurulu Olmalı:**
   - VS Code'da Extensions'dan "Extension Pack for Java" kurun
   - Otomatik olarak Spring Boot desteği gelir

2. **Main Class'tan Çalıştır:**
   - `ManagementApplication.java` dosyasını açın
   - Üstte "Run" veya "Debug" butonları görünecek
   - Tıklayarak direkt çalıştırabilirsiniz

---

## 📋 IntelliJ IDEA ile Çalıştırma

### Yöntem 1: Run Configuration (Önerilen)

1. **Run Configuration Oluştur:**
   - Sağ üstteki "Add Configuration" butonuna tıklayın
   - "+" → "Spring Boot" seçin
   - **Main class:** `com.library.management.ManagementApplication`
   - **Name:** `ManagementApplication`
   - "Apply" ve "OK" tıklayın

2. **Çalıştır:**
   - Sağ üstteki yeşil play butonuna tıklayın
   - VEYA `Shift + F10`

### Yöntem 2: Main Class'tan Direkt

1. **ManagementApplication.java** dosyasını açın
2. Sağ taraftaki yeşil play butonuna tıklayın
3. VEYA `Ctrl + Shift + F10`

### Yöntem 3: Maven Tool Window

1. Sağ tarafta "Maven" tool window'u açın
2. `management` → `Plugins` → `spring-boot` → `spring-boot:run`
3. Çift tıklayın

---

## 🎯 Kullanılabilir Task'lar (VS Code)

### 1. Spring Boot: Run
- Backend'i çalıştırır
- **Kısayol:** `Ctrl + Shift + B`

### 2. Spring Boot: Clean and Run
- Önce temizler, sonra çalıştırır
- Cache sorunlarında kullanın

### 3. Maven: Clean Install
- Projeyi temizler ve derler
- Bağımlılıkları yükler

### 4. Maven: Clean
- Sadece temizler (target klasörünü siler)

---

## 🔧 Sorun Giderme

### Task Bulunamıyor (VS Code)

1. `.vscode/tasks.json` dosyasının var olduğundan emin olun
2. VS Code'u yeniden başlatın
3. `Ctrl + Shift + P` → "Reload Window"

### Maven Komutu Bulunamıyor

1. Maven'in PATH'te olduğundan emin olun:
   ```bash
   mvn --version
   ```

2. VS Code'da Java Extension Pack kurulu olmalı

### Port 8443 Kullanımda

1. Task'ı durdurun (`Ctrl + C`)
2. Port'u kullanan process'i sonlandırın:
   ```bash
   # Windows
   netstat -ano | findstr :8443
   taskkill /PID <PID> /F
   ```

---

## ✅ Başarı Kontrolü

Backend başarıyla çalışıyorsa:
- Console'da "Started ManagementApplication" mesajını göreceksiniz
- `https://localhost:8443/api/books` adresine gidince JSON döner
- Terminal'de Spring Boot banner'ı görünür

---

## 💡 İpuçları

1. **Hot Reload:** Spring Boot DevTools ile kod değişikliklerinde otomatik yeniden başlar
2. **Logs:** Console'da tüm logları görebilirsiniz
3. **Stop:** Task'ı durdurmak için terminal'de `Ctrl + C`

---

## 🎉 Hazırsınız!

Artık IDE'den direkt backend'i çalıştırabilirsiniz. Task Runner kullanarak kolayca başlatabilirsiniz!

