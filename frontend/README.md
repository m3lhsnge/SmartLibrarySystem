# Kütüphane Yönetim Sistemi - Frontend

React + Vite + Tailwind CSS ile geliştirilmiş koyu temalı kütüphane yönetim sistemi frontend uygulaması.

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

### 3. Tarayıcıda Açın
```
http://localhost:5173
```

## 📋 Gereksinimler

- Node.js v18 veya üzeri
- npm veya yarn
- Backend'in çalışır durumda olması (`https://localhost:8443`)

## 🎯 Özellikler

- 🌙 Koyu tema tasarımı
- 👨‍💼 Admin Paneli (CRUD işlemleri)
- 👨‍🎓 Öğrenci Paneli (Kitap ödünç alma, kitaplarım, cezalar)
- 📚 Ana sayfa: Son eklenen 5 kitap + Editör seçimi 10 kitap
- 🏷️ Kategori filtreleme (Trendyol mantığı)
- 📖 Kitap kartları ile görsel gösterim
- 🔐 Kullanıcı girişi ve yetkilendirme
- ✉️ Kayıt ol ve mail doğrulama
- 🔑 Şifre sıfırlama

## 📁 Proje Yapısı

```
src/
├── pages/          # Sayfa bileşenleri
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── VerifyAccount.jsx
│   ├── AdminDashboard.jsx
│   └── StudentDashboard.jsx
├── components/     # Yeniden kullanılabilir bileşenler
│   ├── BookCard.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── services/       # API servisleri
│   └── api.js
└── context/        # React Context
    └── AuthContext.jsx
```

## 🔧 Yapılandırma

Backend API URL'i `src/services/api.js` dosyasında tanımlı:
```javascript
const API_BASE_URL = 'https://localhost:8443/api'
```

## 📝 Scripts

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run preview` - Production build'i önizler

## 🐛 Sorun Giderme

### Backend'e bağlanamıyor
- Backend'in çalıştığından emin olun
- Tarayıcı console'unda (F12) hata mesajlarını kontrol edin
- HTTPS self-signed certificate uyarısını görmezden gelin

### Port 5173 kullanımda
- Vite otomatik olarak başka bir port seçecektir
- Console'da hangi portta çalıştığını kontrol edin

## 📚 Daha Fazla Bilgi

Detaylı kurulum ve çalıştırma talimatları için ana dizindeki `KURULUM_VE_CALISTIRMA.md` dosyasına bakın.
