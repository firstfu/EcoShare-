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
    username: str
    password: str
    email: EmailStr
    phone: str = None


class UserUpdate(BaseModel):
    email: EmailStr = None
    phone: str = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    phone: str = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="用戶名已被使用")

    db_user = UserService.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="電子郵件已被使用")

    return UserService.create_user(db=db, username=user.username, password=user.password, email=user.email, phone=user.phone)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(user_update: UserUpdate, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if user_update.email:
        db_user = UserService.get_user_by_email(db, email=user_update.email)
        if db_user and db_user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="電子郵件已被使用")

    update_data = user_update.dict(exclude_unset=True)
    return UserService.update_user(db, current_user, **update_data)


@router.post("/change-password")
def change_password(password_data: PasswordChange, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if not UserService.authenticate_user(db, current_user.username, password_data.old_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="原密碼錯誤")

    UserService.update_password(db, current_user, password_data.new_password)
    return {"message": "密碼修改成功"}


@router.get("/users", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 10, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="權限不足")

    users, _ = UserService.list_users(db, skip=skip, limit=limit)
    return users
