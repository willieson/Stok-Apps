package routes

import (
	"stokmanagement/controllers"
	"stokmanagement/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Rute Otentikasi
	api.Post("/register", controllers.Register)
	api.Post("/login", controllers.Login)

	// Grup rute yang dilindungi oleh middleware otentikasi
	protected := api.Group("/", middleware.AuthRequired)

	// Rute Produk
	protected.Get("/products", controllers.GetAllProducts)
	protected.Post("/products", controllers.CreateProduct)
	protected.Put("/products/:id", controllers.UpdateProduct)
	protected.Delete("/products/:id", controllers.SoftDeleteProduct)

	// Rute khusus untuk produk yang dihapus (harus di atas rute :id)
	protected.Get("/products/deleted", controllers.GetAllDeletedProducts)

	// Rute Transaksi Stok
	protected.Post("/stock/in", controllers.TransactionIn)
	protected.Post("/stock/out", controllers.TransactionOut)

	// Rute untuk melihat riwayat stok dan log
	protected.Get("/stock/history", controllers.GetKartuStokHistory)
	protected.Get("/logs", controllers.GetActivityLogs)
}
