package database

import (
	"fmt"
	"log"
	"os"

	"stokmanagement/models" // Import model kita

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL not found in .env file")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Database connection established!")

	// AutoMigrate sekarang akan membuat semua tabel baru
	db.AutoMigrate(&models.User{}, &models.Product{}, &models.KartuStok{}, &models.Log{})

	DB = db
}
