package service

import (
	"errors"
	"time"

	"ecoshare/internal/model"
	"ecoshare/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

// UserService 用戶服務
type UserService struct{}

// CreateUser 創建用戶
func (s *UserService) CreateUser(user *model.User) error {
	// 檢查用戶名是否已存在
	var existingUser model.User
	if err := repository.GetDB().Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
		return errors.New("用戶名已存在")
	}

	// 加密密碼
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// 創建用戶
	return repository.GetDB().Create(user).Error
}

// GetUserByID 根據ID獲取用戶
func (s *UserService) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	if err := repository.GetDB().First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUser 更新用戶信息
func (s *UserService) UpdateUser(user *model.User) error {
	return repository.GetDB().Save(user).Error
}

// DeleteUser 刪除用戶
func (s *UserService) DeleteUser(id uint) error {
	return repository.GetDB().Delete(&model.User{}, id).Error
}

// ValidateUser 驗證用戶憑證
func (s *UserService) ValidateUser(username, password string) (*model.User, error) {
	var user model.User
	if err := repository.GetDB().Where("username = ?", username).First(&user).Error; err != nil {
		return nil, errors.New("用戶不存在")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("密碼錯誤")
	}

	// 更新最後登入時間
	user.LastLoginAt = time.Now()
	if err := repository.GetDB().Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// ListUsers 獲取用戶列表
func (s *UserService) ListUsers(page, pageSize int) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	db := repository.GetDB()

	// 獲取總數
	if err := db.Model(&model.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 獲取分頁數據
	offset := (page - 1) * pageSize
	if err := db.Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// UpdatePassword 更新用戶密碼
func (s *UserService) UpdatePassword(userID uint, oldPassword, newPassword string) error {
	var user model.User
	if err := repository.GetDB().First(&user, userID).Error; err != nil {
		return errors.New("用戶不存在")
	}

	// 驗證舊密碼
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword)); err != nil {
		return errors.New("舊密碼錯誤")
	}

	// 加密新密碼
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// 更新密碼
	user.Password = string(hashedPassword)
	return repository.GetDB().Save(&user).Error
}