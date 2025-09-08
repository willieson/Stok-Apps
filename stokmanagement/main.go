package main

import (
	"log"

	"stokmanagement/database"
	"stokmanagement/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Koneksi ke database
	database.ConnectDB()

	// Inisialisasi Fiber
	app := fiber.New()

	// Middleware CORS agar frontend bisa mengakses API
	app.Use(cors.New())

	// Setup routes
	routes.SetupRoutes(app)

	// Jalankan server
	log.Fatal(app.Listen(":3000"))
}
