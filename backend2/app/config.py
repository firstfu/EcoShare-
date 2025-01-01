"""
配置文件：管理應用程式的所有配置設定
包含資料庫連接、JWT 認證、CORS 和 API 相關的設定
"""

from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    應用程式設定類別
    使用 pydantic_settings 進行設定值的驗證和管理
    支援從環境變數或 .env 文件讀取配置
    """

    # 資料庫設定
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ecoshare"
    """PostgreSQL 資料庫連接字串，格式：postgresql://<使用者>:<密碼>@<主機>:<埠>/<資料庫名>"""

    # JWT設定
    SECRET_KEY: str = "your-secret-key-here"  # 在生產環境中應該使用環境變數
    """JWT 加密金鑰，用於生成和驗證 JWT token"""

    ALGORITHM: str = "HS256"
    """JWT 加密演算法，預設使用 HS256"""

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    """JWT token 的有效期限（分鐘）"""

    # CORS設定
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    """允許跨域請求的來源清單，預設允許前端開發伺服器的請求"""

    # API設定
    API_V1_PREFIX: str = "/api/v1"
    """API 的版本前綴，用於 API 路由管理"""

    PROJECT_NAME: str = "EcoShare+ API"
    """專案名稱，用於 API 文檔和其他識別用途"""

    class Config:
        """
        pydantic 設定類別
        指定從 .env 文件讀取環境變數
        """

        env_file = ".env"


settings = Settings()
"""全域設定實例，可在其他模組中直接導入使用"""
