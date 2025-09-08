Backend (Golang & Fiber)
Deskripsi Proyek
Proyek ini adalah backend dari aplikasi manajemen stok, yang dibangun menggunakan bahasa pemrograman Go. Backend ini menyediakan API yang aman dan efisien untuk mengelola data produk, transaksi stok, dan log aktivitas. Proyek ini menggunakan arsitektur API RESTful.
Teknologi yang Digunakan
• Go (Golang): Bahasa pemrograman utama yang digunakan untuk membangun server.
• Fiber: Framework web fast and lightweight untuk Go, digunakan untuk membangun rute API dan menangani permintaan HTTP.
• GORM: Library ORM (Object-Relational Mapping) untuk Go, digunakan untuk interaksi dengan database.
• GORM with PostgreSQL/MySQL: Database yang digunakan untuk menyimpan data. Relasi antar tabel seperti products, kartu_stok, users, dan logs dikelola menggunakan GORM.
• golang.org/x/crypto/bcrypt: Pustaka Go untuk mengenkripsi kata sandi secara aman sebelum disimpan di database.
• github.com/golang-jwt/jwt: Pustaka untuk menangani autentikasi pengguna menggunakan JSON Web Tokens (JWT).
• github.com/gofiber/fiber/v2/middleware/cors: Middleware Fiber untuk mengizinkan permintaan dari domain frontend (CORS).
Cara Menjalankan

1. Pastikan Go dan database (misal PostgreSQL atau MySQL) sudah terinstal.
2. Buka terminal di direktori proyek backend Anda.
3. Instal dependensi yang diperlukan: _go mod tidy_
4. Jalankan Server: _go run main.go_
5. Backend akan berjalan di http://localhost:3000
   Frontend (React.js & Tailwind CSS)
   Deskripsi Proyek
   Ini adalah frontend dari aplikasi manajemen stok, yang menyediakan antarmuka pengguna (UI) yang interaktif dan responsif. Aplikasi ini memungkinkan pengguna untuk melihat daftar produk, mengelola stok, melihat riwayat transaksi, dan log aktivitas.

Teknologi yang Digunakan
• React.js: Library JavaScript untuk membangun antarmuka pengguna yang dinamis.
• Vite: Build tool yang sangat cepat untuk pengembangan frontend.
• Tailwind CSS: Framework CSS yang berbasis utilitas, digunakan untuk merancang tampilan yang modern dan responsif dengan cepat.
• react-router-dom: Pustaka standar untuk navigasi dan routing di aplikasi React.
• axios: Klien HTTP berbasis Promise, digunakan untuk melakukan permintaan API ke server backend.
• react-toastify: Pustaka untuk menampilkan notifikasi pop-up yang interaktif dan informatif.
• prop-types: Digunakan untuk validasi tipe data dari props yang diterima oleh komponen
Cara Menjalankan

1. Buka terminal di direktori proyek frontend Anda.
2. Instal semua dependensi: _npm install_
3. Jalankan aplikasi di mode pengembangan: _npm run dev_
4. Aplikasi akan terbuka di browser Anda, biasanya di http://localhost:5173
