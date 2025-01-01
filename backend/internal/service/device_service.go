package service

import (
	"errors"
	"time"

	"ecoshare/internal/model"
	"ecoshare/internal/repository"
)

// DeviceService 設備服務
type DeviceService struct{}

// CreateDevice 創建設備
func (s *DeviceService) CreateDevice(device *model.Device) error {
	// 檢查設備ID是否已存在
	var existingDevice model.Device
	if err := repository.GetDB().Where("device_id = ?", device.DeviceID).First(&existingDevice).Error; err == nil {
		return errors.New("設備ID已存在")
	}

	// 設置初始狀態
	device.Status = "offline"
	device.LastOnline = time.Now()

	// 創建設備
	return repository.GetDB().Create(device).Error
}

// GetDeviceByID 根據ID獲取設備
func (s *DeviceService) GetDeviceByID(id uint) (*model.Device, error) {
	var device model.Device
	if err := repository.GetDB().First(&device, id).Error; err != nil {
		return nil, err
	}
	return &device, nil
}

// UpdateDevice 更新設備信息
func (s *DeviceService) UpdateDevice(device *model.Device) error {
	return repository.GetDB().Save(device).Error
}

// DeleteDevice 刪除設備
func (s *DeviceService) DeleteDevice(id uint) error {
	return repository.GetDB().Delete(&model.Device{}, id).Error
}

// ListDevices 獲取設備列表
func (s *DeviceService) ListDevices(userID uint, page, pageSize int) ([]model.Device, int64, error) {
	var devices []model.Device
	var total int64

	db := repository.GetDB().Where("user_id = ?", userID)

	// 獲取總數
	if err := db.Model(&model.Device{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 獲取分頁數據
	offset := (page - 1) * pageSize
	if err := db.Offset(offset).Limit(pageSize).Find(&devices).Error; err != nil {
		return nil, 0, err
	}

	return devices, total, nil
}

// UpdateDeviceStatus 更新設備狀態
func (s *DeviceService) UpdateDeviceStatus(deviceID uint, status string) error {
	return repository.GetDB().Model(&model.Device{}).
		Where("id = ?", deviceID).
		Updates(map[string]interface{}{
			"status":      status,
			"last_online": time.Now(),
		}).Error
}

// RecordPowerUsage 記錄設備用電量
func (s *DeviceService) RecordPowerUsage(record *model.PowerUsageRecord) error {
	return repository.GetDB().Create(record).Error
}

// GetDevicePowerUsage 獲取設備用電量統計
func (s *DeviceService) GetDevicePowerUsage(deviceID uint, startTime, endTime time.Time) ([]model.PowerUsageRecord, error) {
	var records []model.PowerUsageRecord
	err := repository.GetDB().
		Where("device_id = ? AND timestamp BETWEEN ? AND ?", deviceID, startTime, endTime).
		Order("timestamp ASC").
		Find(&records).Error
	return records, err
}

// GetTotalPowerUsage 獲取用戶所有設備的總用電量
func (s *DeviceService) GetTotalPowerUsage(userID uint, startTime, endTime time.Time) (float64, error) {
	var total float64
	err := repository.GetDB().Model(&model.PowerUsageRecord{}).
		Joins("JOIN devices ON devices.id = power_usage_records.device_id").
		Where("devices.user_id = ? AND power_usage_records.timestamp BETWEEN ? AND ?", userID, startTime, endTime).
		Select("SUM(power_usage_records.usage)").
		Scan(&total).Error
	return total, err
}

// GetDevicesByLocation 根據位置獲取設備
func (s *DeviceService) GetDevicesByLocation(userID uint, location string) ([]model.Device, error) {
	var devices []model.Device
	err := repository.GetDB().
		Where("user_id = ? AND location = ?", userID, location).
		Find(&devices).Error
	return devices, err
}

// GetActiveDevices 獲取在線設備
func (s *DeviceService) GetActiveDevices(userID uint) ([]model.Device, error) {
	var devices []model.Device
	err := repository.GetDB().
		Where("user_id = ? AND status = ?", userID, "online").
		Find(&devices).Error
	return devices, err
}