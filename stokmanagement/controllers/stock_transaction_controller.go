package controllers

import (
	"log"
	"strconv"

	"stokmanagement/database"
	"stokmanagement/models"

	"github.com/gofiber/fiber/v2"
)

// TransactionInput adalah struct untuk input transaksi stok.
type TransactionInput struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

// TransactionIn menangani transaksi barang masuk.
func TransactionIn(c *fiber.Ctx) error {
	var input TransactionInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Quantity must be positive"})
	}

	var product models.Product
	tx := database.DB.Begin()

	if err := tx.First(&product, input.ProductID).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Perbarui stok produk.
	product.CurrentStock += input.Quantity
	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product stock"})
	}

	// Buat entri di KartuStok.
	kartuStok := models.KartuStok{
		ProductID:       input.ProductID,
		TransactionType: "in",
		Quantity:        input.Quantity,
	}
	if err := tx.Create(&kartuStok).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to log stock transaction"})
	}

	// Dapatkan ID pengguna dari middleware.
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		log.Println("Error: User ID not found or invalid type")
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "User ID not found in context"})
	}
	userID := uint(userIDFloat)

	// Buat entri di Log.
	logEntry := models.Log{
		UserID:   userID,
		Activity: "Barang Masuk: " + strconv.Itoa(input.Quantity) + " unit " + product.Name,
	}
	if err := tx.Create(&logEntry).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create log"})
	}

	tx.Commit()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Stock updated successfully"})
}

// TransactionOut menangani transaksi barang keluar.
func TransactionOut(c *fiber.Ctx) error {
	var input TransactionInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Quantity must be positive"})
	}

	var product models.Product
	tx := database.DB.Begin()

	if err := tx.First(&product, input.ProductID).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	if product.CurrentStock < input.Quantity {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Insufficient stock"})
	}

	// Perbarui stok produk.
	product.CurrentStock -= input.Quantity
	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product stock"})
	}

	// Buat entri di KartuStok.
	kartuStok := models.KartuStok{
		ProductID:       input.ProductID,
		TransactionType: "out",
		Quantity:        input.Quantity,
	}
	if err := tx.Create(&kartuStok).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to log stock transaction"})
	}

	// Dapatkan ID pengguna dari middleware.
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		log.Println("Error: User ID not found or invalid type")
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "User ID not found in context"})
	}
	userID := uint(userIDFloat)

	// Buat entri di Log.
	logEntry := models.Log{
		UserID:   userID,
		Activity: "Barang Keluar: " + strconv.Itoa(input.Quantity) + " unit " + product.Name,
	}
	if err := tx.Create(&logEntry).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create log"})
	}

	tx.Commit()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Stock updated successfully"})
}

// GetKartuStokHistory mendapatkan riwayat pergerakan stok.
func GetKartuStokHistory(c *fiber.Ctx) error {
	var kartuStokHistory []models.KartuStok
	// Menggunakan Preload("Product") untuk memuat data produk yang berelasi
	database.DB.Preload("Product").Order("created_at desc").Find(&kartuStokHistory)
	return c.JSON(kartuStokHistory)
}

// GetActivityLogs mendapatkan semua log aktivitas.
func GetActivityLogs(c *fiber.Ctx) error {
	var logs []models.Log
	// Menggunakan Preload("User") untuk memuat data pengguna yang berelasi
	database.DB.Preload("User").Order("created_at desc").Find(&logs)
	return c.JSON(logs)
}
