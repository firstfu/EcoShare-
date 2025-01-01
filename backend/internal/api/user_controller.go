package api

import (
	"net/http"
	"strconv"

	"ecoshare/internal/middleware"
	"ecoshare/internal/model"
	"ecoshare/internal/service"

	"github.com/gin-gonic/gin"
)

// UserController 用戶控制器
type UserController struct {
	userService *service.UserService
}

// NewUserController 創建用戶控制器實例
func NewUserController() *UserController {
	return &UserController{
		userService: &service.UserService{},
	}
}

// Register 用戶註冊
func (c *UserController) Register(ctx *gin.Context) {
	var user model.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的請求數據"})
		return
	}

	if err := c.userService.CreateUser(&user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "用戶註冊成功"})
}

// Login 用戶登入
func (c *UserController) Login(ctx *gin.Context) {
	var credentials struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&credentials); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的登入憑證"})
		return
	}

	user, err := c.userService.ValidateUser(credentials.Username, credentials.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// 生成 JWT token
	token, err := middleware.GenerateToken(user.ID, user.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "生成令牌失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		},
	})
}

// GetProfile 獲取用戶資料
func (c *UserController) GetProfile(ctx *gin.Context) {
	userID, _ := ctx.Get("user_id")
	user, err := c.userService.GetUserByID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "用戶不存在"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"phone":    user.Phone,
		"role":     user.Role,
	})
}

// UpdateProfile 更新用戶資料
func (c *UserController) UpdateProfile(ctx *gin.Context) {
	userID, _ := ctx.Get("user_id")
	user, err := c.userService.GetUserByID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "用戶不存在"})
		return
	}

	var updateData struct {
		Email string `json:"email"`
		Phone string `json:"phone"`
	}

	if err := ctx.ShouldBindJSON(&updateData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的請求數據"})
		return
	}

	user.Email = updateData.Email
	user.Phone = updateData.Phone

	if err := c.userService.UpdateUser(user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "更新成功"})
}

// ChangePassword 修改密碼
func (c *UserController) ChangePassword(ctx *gin.Context) {
	userID, _ := ctx.Get("user_id")
	var passwordData struct {
		OldPassword string `json:"old_password" binding:"required"`
		NewPassword string `json:"new_password" binding:"required,min=6"`
	}

	if err := ctx.ShouldBindJSON(&passwordData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "無效的請求數據"})
		return
	}

	if err := c.userService.UpdatePassword(userID.(uint), passwordData.OldPassword, passwordData.NewPassword); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "密碼修改成功"})
}

// ListUsers 獲取用戶列表（管理員功能）
func (c *UserController) ListUsers(ctx *gin.Context) {
	// 檢查是否為管理員
	role, _ := ctx.Get("role")
	if role != "admin" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "權限不足"})
		return
	}

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(ctx.DefaultQuery("page_size", "10"))

	users, total, err := c.userService.ListUsers(page, pageSize)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "獲取用戶列表失敗"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"total": total,
		"users": users,
	})
}

// RegisterRoutes 註冊路由
func (c *UserController) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/register", c.Register)
	router.POST("/login", c.Login)

	// 需要認證的路由
	authorized := router.Group("/")
	authorized.Use(middleware.JWTAuth())
	{
		authorized.GET("/profile", c.GetProfile)
		authorized.PUT("/profile", c.UpdateProfile)
		authorized.POST("/change-password", c.ChangePassword)
		authorized.GET("/users", c.ListUsers) // 管理員功能
	}
}