package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/spf13/viper"
)

// JWTClaims 定義 JWT 的聲明結構
type JWTClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// GenerateToken 生成 JWT token
func GenerateToken(userID uint, username string) (string, error) {
	// 設置 JWT 聲明
	claims := JWTClaims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), // 24 小時後過期
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	// 創建 token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 簽名 token
	return token.SignedString([]byte(viper.GetString("jwt.secret")))
}

// JWTAuth JWT 認證中間件
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 從 Header 獲取 token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供認證令牌"})
			c.Abort()
			return
		}

		// 檢查 token 格式
		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認證令牌格式錯誤"})
			c.Abort()
			return
		}

		// 解析 token
		claims := &JWTClaims{}
		token, err := jwt.ParseWithClaims(parts[1], claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(viper.GetString("jwt.secret")), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "無效的認證令牌"})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認證令牌已過期"})
			c.Abort()
			return
		}

		// 將用戶信息存儲到上下文
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}