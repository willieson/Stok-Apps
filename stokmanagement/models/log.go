package models

import "gorm.io/gorm"

type Log struct {
	UserID   uint   `json:"user_id"`
	User     User   `gorm:"foreignKey:UserID"`
	Activity string `json:"activity"`
	gorm.Model
}
