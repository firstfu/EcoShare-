package main

import (
	"fmt"
	"log"

	"ecoshare/internal/api"
	"ecoshare/internal/middleware"
	"ecoshare/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func init() {
	// 載入配置文件
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("../../config")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %s", err)
	}

	// 初始化資料庫連接
	repository.InitDB()

	// 初始化 Redis 連接
	repository.InitRedis()
}

func main() {
	// 設置 Gin 模式
	gin.SetMode(viper.GetString("server.mode"))

	// 創建 Gin 路由器
	r := gin.Default()

	// 設置 CORS
	setupCORS(r)


	// 設置路由
	setupRoutes(r)

	// 啟動服務器
	port := viper.GetString("server.port")
	log.Printf("Server starting on port %s", port)
	if err := r.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func setupCORS(r *gin.Engine) {
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", viper.GetString("cors.allowed_origins[0]"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})
}

func setupRoutes(r *gin.Engine) {
	// 健康檢查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API 版本 v1
	v1 := r.Group("/api/v1")

	// 用戶控制器
	userController := api.NewUserController()
	userController.RegisterRoutes(v1)

	// 設備相關路由（需要認證）
	deviceGroup := v1.Group("/")
	deviceGroup.Use(middleware.JWTAuth())
	deviceController := api.NewDeviceController()
	deviceController.RegisterRoutes(deviceGroup)
}
