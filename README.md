__Backend (Golang & Fiber)__

__Deskripsi Proyek__

Proyek ini adalah backend dari aplikasi manajemen stok, yang dibangun menggunakan bahasa pemrograman Go. Backend ini menyediakan API yang aman dan efisien untuk mengelola data produk, transaksi stok, dan log aktivitas. Proyek ini menggunakan arsitektur API RESTful.

__Teknologi yang Digunakan__

1. `Go (Golang)`: Bahasa pemrograman utama yang digunakan untuk membangun server.

2. `Fiber`: Framework web fast and lightweight untuk Go, digunakan untuk membangun rute API dan menangani permintaan HTTP.

3. `GORM`: Library ORM (Object-Relational Mapping) untuk Go, digunakan untuk interaksi dengan database.

4. `GORM with PostgreSQL/MySQL`: Database yang digunakan untuk menyimpan data. Relasi antar tabel seperti products, kartu_stok, users, dan logs dikelola menggunakan GORM.

5. `golang.org/x/crypto/bcrypt`: Pustaka Go untuk mengenkripsi kata sandi secara aman sebelum disimpan di database.

6. `github.com/golang-jwt/jwt`: Pustaka untuk menangani autentikasi pengguna menggunakan JSON Web Tokens (JWT).

7. `github.com/gofiber/fiber/v2/middleware/cors`: Middleware Fiber untuk mengizinkan permintaan dari domain frontend (CORS).

       go get github.com/gofiber/fiber/v2 gorm.io/gorm gorm.io/driver/postgres github.com/joho/godotenv

       go get github.com/golang-jwt/jwt/v5

       go get golang.org/x/crypto/bcrypt

__Struktur Proyek__

1. `database`: Untuk logika koneksi ke database.

2. `models`: Untuk mendefinisikan struktur data (model).

3. `controllers`: Untuk logika bisnis dan handler API.

4. `routes`: Untuk mendaftarkan semua endpoint API.

5. `middleware`: Untuk validasi token JWT.

__.ENV__

      DATABASE_URL="..."
      JWT_SECRET="ini_adalah_secret_yang_sangat_aman_dan_rahasia"

__Frontend (Vite React.js & Tailwind CSS)__

__Deskripsi Proyek__

Ini adalah frontend dari aplikasi manajemen stok, yang menyediakan antarmuka pengguna (UI) yang interaktif dan responsif. Aplikasi ini memungkinkan pengguna untuk melihat daftar produk, mengelola stok, melihat riwayat transaksi, dan log aktivitas.

Teknologi yang Digunakan

1. `React.js`: Library JavaScript untuk membangun antarmuka pengguna yang dinamis.

2. `Vite`: Build tool yang sangat cepat untuk pengembangan frontend.

3. `Tailwind CSS`: Framework CSS yang berbasis utilitas, digunakan untuk merancang tampilan yang modern dan responsif dengan cepat.

4. `react-router-dom`: Pustaka standar untuk navigasi dan routing di aplikasi React.

5. `axios`: Klien HTTP berbasis Promise, digunakan untuk melakukan permintaan API ke server backend.

6. `react-toastify`: Pustaka untuk menampilkan notifikasi pop-up yang interaktif dan informatif.

7. `prop-types`: Digunakan untuk validasi tipe data dari props yang diterima oleh komponen

        npm create vite@latest
        npm install tailwindcss @tailwindcss/vite
        npm install axios react-router-dom react-toastify

__vite.config__

        import { defineConfig } from 'vite'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
        plugins: [
        tailwindcss(),
        ],
        })

__Global CSS__

        @import "tailwindcss"
