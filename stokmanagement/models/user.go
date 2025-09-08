package models

import "gorm.io/gorm"

type User struct {
	Username string `json:"username" gorm:"unique;not null"`
	Password string `json:"password" gorm:"not null"`
	gorm.Model
}
