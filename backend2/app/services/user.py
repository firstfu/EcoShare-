"""
使用者服務層模組
提供使用者相關的業務邏輯處理，包括帳號管理、認證和查詢功能
"""

from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from ..middleware.auth import get_password_hash, verify_password
from ..models.user import User


class UserService:
    """
    使用者服務類別
    處理所有與使用者相關的業務邏輯，提供完整的使用者管理功能
    所有方法都是靜態方法，不需要實例化即可使用
    """

    @staticmethod
    def create_user(db: Session, username: str, password: str, email: str, phone: Optional[str] = None) -> User:
        """
        創建新使用者
        將密碼進行雜湊處理後儲存到資料庫
        """
        hashed_password = get_password_hash(password)
        db_user = User(username=username, password=hashed_password, email=email, phone=phone)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """根據使用者 ID 查詢使用者資訊"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """根據使用者名稱查詢使用者資訊"""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """根據電子郵件查詢使用者資訊"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        """
        驗證使用者身份
        檢查使用者名稱和密碼是否正確，返回使用者資訊或 None
        """
        user = UserService.get_user_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user

    @staticmethod
    def update_user(db: Session, user: User, **kwargs) -> User:
        """
        更新使用者資訊
        可以更新使用者的任何欄位，除了密碼（應使用 update_password 方法）
        """
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_password(db: Session, user: User, new_password: str) -> User:
        """
        更新使用者密碼
        將新密碼進行雜湊處理後更新到資料庫
        """
        user.password = get_password_hash(new_password)
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def list_users(db: Session, skip: int = 0, limit: int = 10) -> Tuple[List[User], int]:
        """
        列出使用者清單
        支援分頁查詢，返回使用者列表和總數
        """
        total = db.query(User).count()
        users = db.query(User).offset(skip).limit(limit).all()
        return users, total

    @staticmethod
    def update_last_login(db: Session, user: User) -> User:
        """更新使用者最後登入時間"""
        user.last_login_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
