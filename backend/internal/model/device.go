package model

import (
	"time"

	"gorm.io/gorm"
)

// Device 設備模型
type Device struct {
	gorm.Model
	Name        string    `gorm:"type:varchar(100);not null" json:"name"`
	DeviceID    string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"device_id"`
	Type        string    `gorm:"type:varchar(50);not null" json:"type"`
	Status      string    `gorm:"type:varchar(20);default:'offline'" json:"status"`
	Location    string    `gorm:"type:varchar(100)" json:"location"`
	LastOnline  time.Time `json:"last_online"`
	UserID      uint      `json:"user_id"`
	User        User      `gorm:"foreignKey:UserID" json:"user"`
	PowerUsage  float64   `gorm:"type:decimal(10,2);default:0" json:"power_usage"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	Description string    `gorm:"type:text" json:"description"`
}

// TableName 指定表名
func (Device) TableName() string {
	return "devices"
}

// BeforeCreate 創建前的鉤子
func (d *Device) BeforeCreate(tx *gorm.DB) error {
	// TODO: 在這裡可以添加設備ID生成等邏輯
	return nil
}

// PowerUsageRecord 設備用電記錄
type PowerUsageRecord struct {
	gorm.Model
	DeviceID  uint    `json:"device_id"`
	Device    Device  `gorm:"foreignKey:DeviceID" json:"device"`
	Usage     float64 `gorm:"type:decimal(10,2)" json:"usage"`
	Timestamp time.Time `json:"timestamp"`
	Cost      float64 `gorm:"type:decimal(10,2)" json:"cost"`
}

// TableName 指定表名
func (PowerUsageRecord) TableName() string {
	return "power_usage_records"
}