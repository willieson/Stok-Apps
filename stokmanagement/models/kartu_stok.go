package models

import "gorm.io/gorm"

type KartuStok struct {
	ProductID       uint    `json:"product_id"`
	Product         Product `gorm:"foreignKey:ProductID"`
	TransactionType string  `json:"transaction_type"` // "in" or "out"
	Quantity        int     `json:"quantity"`
	gorm.Model
}
