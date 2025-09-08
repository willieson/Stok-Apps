package models

import "gorm.io/gorm"

type Product struct {
	Name         string `json:"name"`
	SKU          string `json:"sku"`
	CurrentStock int    `json:"current_stock"`
	gorm.Model
}
