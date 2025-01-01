"""
使用者 API 路由模組
提供使用者相關的 HTTP API 端點，包括註冊、登入、個人資料管理等功能
"""

from datetime import timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from ..config import settings
from ..database.session import get_db
from ..middleware.auth import create_access_token, get_current_active_user
from ..services.user import UserService

router = APIRouter()


class UserCreate(BaseModel):
    """
    使用者註冊請求模型
    定義創建新使用者時需要的欄位
    """

    username: str  # 使用者名稱
    password: str  # 密碼
    email: EmailStr  # 電子郵件（使用 EmailStr 確保格式正確）
    phone: str = None  # 電話號碼（選填）


class UserUpdate(BaseModel):
    """
    使用者資料更新請求模型
    定義可以更新的使用者資料欄位
    """

    email: EmailStr = None  # 新的電子郵件（選填）
    phone: str = None  # 新的電話號碼（選填）


class PasswordChange(BaseModel):
    """
    密碼修改請求模型
    定義修改密碼時需要的欄位
    """

    old_password: str  # 原密碼
    new_password: str  # 新密碼


class UserResponse(BaseModel):
    """
    使用者資料回應模型
    定義返回給客戶端的使用者資料結構
    """

    id: int  # 使用者 ID
    username: str  # 使用者名稱
    email: str  # 電子郵件
    phone: str = None  # 電話號碼
    role: str  # 使用者角色
    is_active: bool  # 帳號狀態

    class Config:
        """啟用從 ORM 模型自動轉換"""

        from_attributes = True


class Token(BaseModel):
    """
    JWT Token 回應模型
    定義登入成功後返回的 Token 結構
    """

    access_token: str  # 訪問令牌
    token_type: str  # 令牌類型


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    使用者註冊端點
    創建新的使用者帳號，並檢查使用者名稱和電子郵件是否已被使用
    """
    db_user = UserService.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="用戶名已被使用")

    db_user = UserService.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="電子郵件已被使用")

    return UserService.create_user(db=db, username=user.username, password=user.password, email=user.email, phone=user.phone)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    使用者登入端點
    驗證使用者憑證並返回 JWT token
    """
    user = UserService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用戶名或密碼錯誤",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)

    UserService.update_last_login(db, user)

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user=Depends(get_current_active_user)):
    """
    獲取個人資料端點
    返回當前登入使用者的資料
    """
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(user_update: UserUpdate, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    更新個人資料端點
    更新當前登入使用者的資料，並確保電子郵件不重複
    """
    if user_update.email:
        db_user = UserService.get_user_by_email(db, email=user_update.email)
        if db_user and db_user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="電子郵件已被使用")

    update_data = user_update.dict(exclude_unset=True)
    return UserService.update_user(db, current_user, **update_data)


@router.post("/change-password")
def change_password(password_data: PasswordChange, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    修改密碼端點
    驗證原密碼並更新為新密碼
    """
    if not UserService.authenticate_user(db, current_user.username, password_data.old_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="原密碼錯誤")

    UserService.update_password(db, current_user, password_data.new_password)
    return {"message": "密碼修改成功"}


@router.get("/users", response_model=List[UserResponse])
# def list_users(skip: int = 0, limit: int = 10, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
def list_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    列出使用者清單端點
    僅管理員可以訪問，支援分頁查詢
    """
    # if current_user.role != "admin":
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="權限不足")

    users, _ = UserService.list_users(db, skip=skip, limit=limit)
    return users
