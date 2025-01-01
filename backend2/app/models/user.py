"""
使用者模型定義
定義使用者資料表結構，包含使用者基本資訊、認證資訊和時間戳記
"""

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from ..database.session import Base


class User(Base):
    """
    使用者資料模型
    繼承自 SQLAlchemy 的 Base 類別，用於管理使用者資料
    """

    __tablename__ = "users"  # 資料表名稱

    # 基本資訊欄位
    id = Column(Integer, primary_key=True, index=True)  # 主鍵，自動遞增
    username = Column(String(50), unique=True, nullable=False)  # 使用者名稱，唯一且必填
    password = Column(String(255), nullable=False)  # 密碼雜湊值，必填
    email = Column(String(100), unique=True, nullable=False)  # 電子郵件，唯一且必填
    phone = Column(String(20))  # 電話號碼，選填

    # 狀態相關欄位
    last_login_at = Column(DateTime)  # 最後登入時間
    is_active = Column(Boolean, default=True)  # 帳號狀態，預設為啟用
    role = Column(String(20), default="user")  # 使用者角色，預設為一般使用者

    # 時間戳記欄位
    created_at = Column(DateTime, server_default=func.now())  # 建立時間，自動設定為當前時間
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  # 更新時間，自動更新
    deleted_at = Column(DateTime)  # 刪除時間，用於軟刪除功能
