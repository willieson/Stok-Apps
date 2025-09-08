package controllers

import (
	"log" // Menambahkan impor log
	"stokmanagement/database"
	"stokmanagement/models"

	"github.com/gofiber/fiber/v2"
)

// CreateProduct membuat produk baru
func CreateProduct(c *fiber.Ctx) error {
	var product models.Product
	if err := c.BodyParser(&product); err != nil {
		// Log error di konsol untuk debug
		log.Printf("Failed to parse request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	// Inisialisasi CurrentStock
	product.CurrentStock = 0

	database.DB.Create(&product)

	// Dapatkan ID pengguna dari middleware
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "User ID not found in context"})
	}
	userID := uint(userIDFloat)

	// Catat ke tabel logs
	logEntry := models.Log{
		UserID:   userID,
		Activity: "Membuat produk baru: " + product.Name,
	}
	database.DB.Create(&logEntry)

	return c.Status(fiber.StatusCreated).JSON(product)
}

// GetAllProducts mendapatkan semua produk yang terlihat
func GetAllProducts(c *fiber.Ctx) error {
	var products []models.Product
	database.DB.Find(&products) // GORM otomatis mengabaikan yang terhapus
	return c.JSON(products)
}

// GetProductByID mendapatkan produk berdasarkan ID
func GetProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product

	if result := database.DB.First(&product, id); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}
	return c.JSON(product)
}

// UpdateProduct memperbarui detail produk
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product

	if result := database.DB.First(&product, id); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	var updatedProduct models.Product
	if err := c.BodyParser(&updatedProduct); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	product.Name = updatedProduct.Name
	product.SKU = updatedProduct.SKU

	database.DB.Save(&product)
	// Dapatkan ID pengguna dan catat aktivitas
	// Mendapatkan user_id dari context
	// Lakukan konversi yang aman
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		// Tangani error jika user_id tidak ditemukan atau bukan float64
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "User ID not found in context"})
	}
	userID := uint(userIDFloat)

	// Catat ke tabel logs
	logEntry := models.Log{
		UserID:   userID,
		Activity: "Memperbarui produk: " + product.Name,
	}
	database.DB.Create(&logEntry)
	return c.JSON(product)
}

// SoftDeleteProduct menghapus produk secara soft delete
func SoftDeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product

	if result := database.DB.First(&product, id); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	database.DB.Delete(&product) // Ini akan mengisi kolom deleted_at
	// Dapatkan ID pengguna dari middleware
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "User ID not found in context"})
	}
	userID := uint(userIDFloat)

	// Catat ke tabel logs
	logEntry := models.Log{
		UserID:   userID,
		Activity: "Menghapus produk : " + product.Name,
	}
	database.DB.Create(&logEntry)
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{"message": "Product soft-deleted successfully"})
}

// GetAllDeletedProducts mendapatkan semua produk yang sudah dihapus
func GetAllDeletedProducts(c *fiber.Ctx) error {
	var products []models.Product
	// Unscoped() mengembalikan semua data, termasuk yang soft-deleted
	database.DB.Unscoped().Where("deleted_at IS NOT NULL").Find(&products)
	return c.JSON(products)
}
