package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用戶模型
type User struct {
	gorm.Model
	Username     string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"username"`
	Password     string    `gorm:"type:varchar(255);not null" json:"-"`
	Email        string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Phone        string    `gorm:"type:varchar(20)" json:"phone"`
	LastLoginAt  time.Time `json:"last_login_at"`
	IsActive     bool      `gorm:"default:true" json:"is_active"`
	Role         string    `gorm:"type:varchar(20);default:'user'" json:"role"`
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}

// BeforeCreate 創建前的鉤子
func (u *User) BeforeCreate(tx *gorm.DB) error {
	// TODO: 在這裡可以添加密碼加密等邏輯
	return nil
}

// BeforeUpdate 更新前的鉤子
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	// TODO: 在這裡可以添加更新前的驗證邏輯
	return nil
}