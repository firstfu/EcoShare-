from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 資料庫設定
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ecoshare"

    # JWT設定
    SECRET_KEY: str = "your-secret-key-here"  # 在生產環境中應該使用環境變數
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS設定
    CORS_ORIGINS: list = ["http://localhost:3000"]

    # API設定
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "EcoShare+ API"

    class Config:
        env_file = ".env"


settings = Settings()
