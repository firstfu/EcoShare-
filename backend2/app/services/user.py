from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from ..middleware.auth import get_password_hash, verify_password
from ..models.user import User


class UserService:
    @staticmethod
    def create_user(db: Session, username: str, password: str, email: str, phone: Optional[str] = None) -> User:
        hashed_password = get_password_hash(password)
        db_user = User(username=username, password=hashed_password, email=email, phone=phone)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        user = UserService.get_user_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user

    @staticmethod
    def update_user(db: Session, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_password(db: Session, user: User, new_password: str) -> User:
        user.password = get_password_hash(new_password)
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def list_users(db: Session, skip: int = 0, limit: int = 10) -> Tuple[List[User], int]:
        total = db.query(User).count()
        users = db.query(User).offset(skip).limit(limit).all()
        return users, total

    @staticmethod
    def update_last_login(db: Session, user: User) -> User:
        user.last_login_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
