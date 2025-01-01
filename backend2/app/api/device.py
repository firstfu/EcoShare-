"""
設備 API 路由模組
提供設備相關的 HTTP API 端點，包括設備管理、狀態更新和用電量記錄等功能
"""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..middleware.auth import get_current_active_user
from ..models.user import User
from ..services.device import DeviceService

router = APIRouter()


class DeviceCreate(BaseModel):
    """
    設備創建請求模型
    定義創建新設備時需要的欄位
    """

    name: str  # 設備名稱
    device_id: str  # 設備唯一識別碼
    type: str  # 設備類型
    location: Optional[str] = None  # 設備位置（選填）
    description: Optional[str] = None  # 設備描述（選填）


class DeviceUpdate(BaseModel):
    """
    設備更新請求模型
    定義可以更新的設備資料欄位
    """

    name: Optional[str] = None  # 新的設備名稱（選填）
    location: Optional[str] = None  # 新的設備位置（選填）
    description: Optional[str] = None  # 新的設備描述（選填）


class DeviceStatus(BaseModel):
    """
    設備狀態更新請求模型
    定義更新設備狀態時需要的欄位
    """

    status: str  # 設備狀態（例如：online, offline）


class PowerUsageRecord(BaseModel):
    """
    用電量記錄請求模型
    定義記錄設備用電量時需要的欄位
    """

    usage: float  # 用電量數值
    timestamp: datetime  # 記錄時間點
    cost: float  # 用電成本


class DeviceResponse(BaseModel):
    """
    設備資料回應模型
    定義返回給客戶端的設備資料結構
    """

    id: int  # 設備 ID
    name: str  # 設備名稱
    device_id: str  # 設備唯一識別碼
    type: str  # 設備類型
    status: str  # 設備狀態
    location: Optional[str]  # 設備位置
    last_online: Optional[datetime]  # 最後在線時間
    power_usage: float  # 總用電量
    description: Optional[str]  # 設備描述
    is_active: bool  # 設備啟用狀態
    created_at: datetime  # 創建時間
    updated_at: datetime  # 更新時間

    class Config:
        """啟用從 ORM 模型自動轉換"""

        from_attributes = True


@router.post("/devices", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(device: DeviceCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    創建設備端點
    為當前使用者創建新的設備，並確保設備 ID 不重複
    """
    db_device = DeviceService.get_device_by_device_id(db, device_id=device.device_id)
    if db_device:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="設備ID已被使用")

    return DeviceService.create_device(db=db, user_id=current_user.id, name=device.name, device_id=device.device_id, type=device.type, location=device.location, description=device.description)


@router.get("/devices", response_model=List[DeviceResponse])
def list_devices(skip: int = 0, limit: int = 10, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    列出設備清單端點
    返回當前使用者的所有設備，支援分頁查詢
    """
    devices, _ = DeviceService.list_devices(db, user_id=current_user.id, skip=skip, limit=limit)
    return devices


@router.get("/devices/{device_id}", response_model=DeviceResponse)
def get_device(device_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    獲取設備詳情端點
    返回指定設備的詳細資訊，需要確認設備所有權
    """
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權訪問此設備")
    return device


@router.put("/devices/{device_id}", response_model=DeviceResponse)
def update_device(device_id: int, device_update: DeviceUpdate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    更新設備資訊端點
    更新指定設備的基本資訊，需要確認設備所有權
    """
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權修改此設備")

    update_data = device_update.dict(exclude_unset=True)
    return DeviceService.update_device(db, device, **update_data)


@router.delete("/devices/{device_id}")
def delete_device(device_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    刪除設備端點
    刪除指定的設備（軟刪除），需要確認設備所有權
    """
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權刪除此設備")

    DeviceService.delete_device(db, device)
    return {"message": "設備已刪除"}


@router.put("/devices/{device_id}/status", response_model=DeviceResponse)
def update_device_status(device_id: int, status_update: DeviceStatus, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    更新設備狀態端點
    更新設備的在線狀態，需要確認設備所有權
    """
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權修改此設備狀態")

    return DeviceService.update_device_status(db, device, status_update.status)


@router.post("/devices/{device_id}/usage")
def record_power_usage(device_id: int, usage_record: PowerUsageRecord, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    記錄用電量端點
    為指定設備記錄用電量和成本，需要確認設備所有權
    """
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權記錄此設備用電量")

    DeviceService.record_power_usage(db, device_id=device_id, usage=usage_record.usage, timestamp=usage_record.timestamp, cost=usage_record.cost)
    return {"message": "用電量記錄成功"}


@router.get("/devices/{device_id}/usage")
def get_device_power_usage(device_id: int, start_time: datetime, end_time: datetime, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    查詢設備用電量端點
    查詢指定時間範圍內的設備用電量記錄，需要確認設備所有權
    """
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權查看此設備用電量")

    records = DeviceService.get_device_power_usage(db, device_id=device_id, start_time=start_time, end_time=end_time)
    return records


@router.get("/devices/total-usage")
def get_total_power_usage(start_time: datetime, end_time: datetime, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """
    查詢總用電量端點
    計算指定時間範圍內所有設備的總用電量
    """
    total = DeviceService.get_total_power_usage(db, user_id=current_user.id, start_time=start_time, end_time=end_time)
    return {"total_usage": total}
