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
    name: str
    device_id: str
    type: str
    location: Optional[str] = None
    description: Optional[str] = None


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class DeviceStatus(BaseModel):
    status: str


class PowerUsageRecord(BaseModel):
    usage: float
    timestamp: datetime
    cost: float


class DeviceResponse(BaseModel):
    id: int
    name: str
    device_id: str
    type: str
    status: str
    location: Optional[str]
    last_online: Optional[datetime]
    power_usage: float
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.post("/devices", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(device: DeviceCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    db_device = DeviceService.get_device_by_device_id(db, device_id=device.device_id)
    if db_device:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="設備ID已被使用")

    return DeviceService.create_device(db=db, user_id=current_user.id, name=device.name, device_id=device.device_id, type=device.type, location=device.location, description=device.description)


@router.get("/devices", response_model=List[DeviceResponse])
def list_devices(skip: int = 0, limit: int = 10, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    devices, _ = DeviceService.list_devices(db, user_id=current_user.id, skip=skip, limit=limit)
    return devices


@router.get("/devices/{device_id}", response_model=DeviceResponse)
def get_device(device_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權訪問此設備")
    return device


@router.put("/devices/{device_id}", response_model=DeviceResponse)
def update_device(device_id: int, device_update: DeviceUpdate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權修改此設備")

    update_data = device_update.dict(exclude_unset=True)
    return DeviceService.update_device(db, device, **update_data)


@router.delete("/devices/{device_id}")
def delete_device(device_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權刪除此設備")

    DeviceService.delete_device(db, device)
    return {"message": "設備已刪除"}


@router.put("/devices/{device_id}/status", response_model=DeviceResponse)
def update_device_status(device_id: int, status_update: DeviceStatus, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權修改此設備狀態")

    return DeviceService.update_device_status(db, device, status_update.status)


@router.post("/devices/{device_id}/usage")
def record_power_usage(device_id: int, usage_record: PowerUsageRecord, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權記錄此設備用電量")

    DeviceService.record_power_usage(db, device_id=device_id, usage=usage_record.usage, timestamp=usage_record.timestamp, cost=usage_record.cost)
    return {"message": "用電量記錄成功"}


@router.get("/devices/{device_id}/usage")
def get_device_power_usage(device_id: int, start_time: datetime, end_time: datetime, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    device = DeviceService.get_device_by_id(db, device_id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="設備不存在")
    if device.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="無權查看此設備用電量")

    records = DeviceService.get_device_power_usage(db, device_id=device_id, start_time=start_time, end_time=end_time)
    return records


@router.get("/devices/total-usage")
def get_total_power_usage(start_time: datetime, end_time: datetime, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    total = DeviceService.get_total_power_usage(db, user_id=current_user.id, start_time=start_time, end_time=end_time)
    return {"total_usage": total}
