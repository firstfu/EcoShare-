package api

import (
	"net/http"
	"strconv"
	"time"

	"ecoshare/internal/model"
	"ecoshare/internal/service"

	"github.com/gin-gonic/gin"
)

// DeviceController 設備控制器
type DeviceController struct {
	deviceService *service.DeviceService
}

// NewDeviceController 創建設備控制器實例
func NewDeviceController() *DeviceController {
	return &DeviceController{
		deviceService: &service.DeviceService{},
	}
}

// CreateDevice 創建設備
func (c *DeviceController) CreateDevice(ctx *gin.Context) {
	userID, _ := ctx.Get("user_id")
	var device model.Device
	if err := ctx.ShouldBindJSON(&device); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的請求數據"})
		return
	}

	device.UserID = userID.(uint)
	if err := c.deviceService.CreateDevice(&device); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "設備創建成功",
		"device":  device,
	})
}

// GetDevice 獲取設備詳情
func (c *DeviceController) GetDevice(ctx *gin.Context) {
	deviceID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的設備ID"})
		return
	}

	device, err := c.deviceService.GetDeviceByID(uint(deviceID))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "設備不存在"})
		return
	}

	// 檢查設備所有權
	userID, _ := ctx.Get("user_id")
	if device.UserID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "無權訪問此設備"})
		return
	}

	ctx.JSON(http.StatusOK, device)
}

// UpdateDevice 更新設備信息
func (c *DeviceController) UpdateDevice(ctx *gin.Context) {
	deviceID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的設備ID"})
		return
	}

	device, err := c.deviceService.GetDeviceByID(uint(deviceID))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "設備不存在"})
		return
	}

	// 檢查設備所有權
	userID, _ := ctx.Get("user_id")
	if device.UserID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "無權修改此設備"})
		return
	}

	var updateData struct {
		Name        string `json:"name"`
		Location    string `json:"location"`
		Description string `json:"description"`
	}

	if err := ctx.ShouldBindJSON(&updateData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的請求數據"})
		return
	}

	device.Name = updateData.Name
	device.Location = updateData.Location
	device.Description = updateData.Description

	if err := c.deviceService.UpdateDevice(device); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "更新成功",
		"device":  device,
	})
}

// DeleteDevice 刪除設備
func (c *DeviceController) DeleteDevice(ctx *gin.Context) {
	deviceID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的設備ID"})
		return
	}

	device, err := c.deviceService.GetDeviceByID(uint(deviceID))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "設備不存在"})
		return
	}

	// 檢查設備所有權
	userID, _ := ctx.Get("user_id")
	if device.UserID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "無權刪除此設備"})
		return
	}

	if err := c.deviceService.DeleteDevice(uint(deviceID)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "刪除失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "設備已刪除"})
}

// ListDevices 獲取設備列表
func (c *DeviceController) ListDevices(ctx *gin.Context) {
	userID, _ := ctx.Get("user_id")
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(ctx.DefaultQuery("page_size", "10"))

	devices, total, err := c.deviceService.ListDevices(userID.(uint), page, pageSize)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "獲取設備列表失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"total":   total,
		"devices": devices,
	})
}

// UpdateDeviceStatus 更新設備狀態
func (c *DeviceController) UpdateDeviceStatus(ctx *gin.Context) {
	deviceID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的設備ID"})
		return
	}

	var statusData struct {
		Status string `json:"status" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&statusData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的狀態數據"})
		return
	}

	if err := c.deviceService.UpdateDeviceStatus(uint(deviceID), statusData.Status); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新狀態失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "狀態更新成功"})
}

// RecordPowerUsage 記錄設備用電量
func (c *DeviceController) RecordPowerUsage(ctx *gin.Context) {
	deviceID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的設備ID"})
		return
	}

	var usageData struct {
		Usage     float64   `json:"usage" binding:"required"`
		Timestamp time.Time `json:"timestamp" binding:"required"`
		Cost      float64   `json:"cost" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&usageData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的用電數據"})
		return
	}

	record := &model.PowerUsageRecord{
		DeviceID:  uint(deviceID),
		Usage:     usageData.Usage,
		Timestamp: usageData.Timestamp,
		Cost:      usageData.Cost,
	}

	if err := c.deviceService.RecordPowerUsage(record); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "記錄用電量失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "用電量記錄成功"})
}

// GetDevicePowerUsage 獲取設備用電量統計
func (c *DeviceController) GetDevicePowerUsage(ctx *gin.Context) {
	deviceID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的設備ID"})
		return
	}

	startTime, _ := time.Parse(time.RFC3339, ctx.Query("start_time"))
	endTime, _ := time.Parse(time.RFC3339, ctx.Query("end_time"))

	records, err := c.deviceService.GetDevicePowerUsage(uint(deviceID), startTime, endTime)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "獲取用電量統計失敗"})
		return
	}

	ctx.JSON(http.StatusOK, records)
}

// GetTotalPowerUsage 獲取用戶所有設備的總用電量
func (c *DeviceController) GetTotalPowerUsage(ctx *gin.Context) {
	userID, _ := ctx.Get("user_id")
	startTime, _ := time.Parse(time.RFC3339, ctx.Query("start_time"))
	endTime, _ := time.Parse(time.RFC3339, ctx.Query("end_time"))

	total, err := c.deviceService.GetTotalPowerUsage(userID.(uint), startTime, endTime)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "獲取總用電量失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"total_usage": total})
}

// RegisterRoutes 註冊路由
func (c *DeviceController) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/devices", c.CreateDevice)
	router.GET("/devices", c.ListDevices)
	router.GET("/devices/:id", c.GetDevice)
	router.PUT("/devices/:id", c.UpdateDevice)
	router.DELETE("/devices/:id", c.DeleteDevice)
	router.PUT("/devices/:id/status", c.UpdateDeviceStatus)
	router.POST("/devices/:id/usage", c.RecordPowerUsage)
	router.GET("/devices/:id/usage", c.GetDevicePowerUsage)
	router.GET("/devices/total-usage", c.GetTotalPowerUsage)
}