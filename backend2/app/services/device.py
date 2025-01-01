"""
設備服務層模組
提供設備管理和用電量記錄的業務邏輯處理
包括設備的 CRUD 操作、狀態管理和用電量統計功能
"""

from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from ..models.device import Device, PowerUsageRecord


class DeviceService:
    """
    設備服務類別
    處理所有與設備相關的業務邏輯，包括設備管理和用電量記錄
    所有方法都是靜態方法，不需要實例化即可使用
    """

    @staticmethod
    def create_device(db: Session, user_id: int, name: str, device_id: str, type: str, location: Optional[str] = None, description: Optional[str] = None) -> Device:
        """
        創建新設備
        為指定使用者創建一個新的智慧設備記錄
        """
        db_device = Device(user_id=user_id, name=name, device_id=device_id, type=type, location=location, description=description)
        db.add(db_device)
        db.commit()
        db.refresh(db_device)
        return db_device

    @staticmethod
    def get_device_by_id(db: Session, device_id: int) -> Optional[Device]:
        """根據設備 ID 查詢設備資訊"""
        return db.query(Device).filter(Device.id == device_id).first()

    @staticmethod
    def get_device_by_device_id(db: Session, device_id: str) -> Optional[Device]:
        """根據設備唯一識別碼查詢設備資訊"""
        return db.query(Device).filter(Device.device_id == device_id).first()

    @staticmethod
    def list_devices(db: Session, user_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Device], int]:
        """
        列出使用者的設備清單
        支援分頁查詢，返回設備列表和總數
        """
        total = db.query(Device).filter(Device.user_id == user_id).count()
        devices = db.query(Device).filter(Device.user_id == user_id).offset(skip).limit(limit).all()
        return devices, total

    @staticmethod
    def update_device(db: Session, device: Device, **kwargs) -> Device:
        """
        更新設備資訊
        可以更新設備的任何欄位，包括名稱、位置、描述等
        """
        for key, value in kwargs.items():
            if hasattr(device, key):
                setattr(device, key, value)
        device.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    def delete_device(db: Session, device: Device) -> None:
        """
        刪除設備（軟刪除）
        將設備標記為已刪除，但保留資料庫記錄
        """
        device.deleted_at = datetime.utcnow()
        device.is_active = False
        db.commit()

    @staticmethod
    def update_device_status(db: Session, device: Device, status: str) -> Device:
        """
        更新設備狀態
        更新設備的在線狀態，並記錄最後在線時間
        """
        device.status = status
        device.last_online = datetime.utcnow() if status == "online" else device.last_online
        device.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    def record_power_usage(db: Session, device_id: int, usage: float, timestamp: datetime, cost: float) -> PowerUsageRecord:
        """
        記錄設備用電量
        創建新的用電量記錄，並更新設備的總用電量
        """
        record = PowerUsageRecord(device_id=device_id, usage=usage, timestamp=timestamp, cost=cost)
        db.add(record)

        # 更新設備的總用電量
        device = db.query(Device).filter(Device.id == device_id).first()
        if device:
            device.power_usage += usage
            device.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def get_device_power_usage(db: Session, device_id: int, start_time: datetime, end_time: datetime) -> List[PowerUsageRecord]:
        """
        獲取設備用電量記錄
        查詢指定時間範圍內的設備用電量記錄
        """
        return db.query(PowerUsageRecord).filter(PowerUsageRecord.device_id == device_id, PowerUsageRecord.timestamp >= start_time, PowerUsageRecord.timestamp <= end_time).all()

    @staticmethod
    def get_total_power_usage(db: Session, user_id: int, start_time: datetime, end_time: datetime) -> float:
        """
        計算使用者所有設備的總用電量
        統計指定時間範圍內所有設備的用電量總和
        """
        devices = db.query(Device).filter(Device.user_id == user_id).all()
        device_ids = [device.id for device in devices]

        total = db.query(func.sum(PowerUsageRecord.usage)).filter(PowerUsageRecord.device_id.in_(device_ids), PowerUsageRecord.timestamp >= start_time, PowerUsageRecord.timestamp <= end_time).scalar()

        return float(total or 0)
