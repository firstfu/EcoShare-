from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from ..models.device import Device, PowerUsageRecord


class DeviceService:
    @staticmethod
    def create_device(db: Session, user_id: int, name: str, device_id: str, type: str, location: Optional[str] = None, description: Optional[str] = None) -> Device:
        db_device = Device(user_id=user_id, name=name, device_id=device_id, type=type, location=location, description=description)
        db.add(db_device)
        db.commit()
        db.refresh(db_device)
        return db_device

    @staticmethod
    def get_device_by_id(db: Session, device_id: int) -> Optional[Device]:
        return db.query(Device).filter(Device.id == device_id).first()

    @staticmethod
    def get_device_by_device_id(db: Session, device_id: str) -> Optional[Device]:
        return db.query(Device).filter(Device.device_id == device_id).first()

    @staticmethod
    def list_devices(db: Session, user_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Device], int]:
        total = db.query(Device).filter(Device.user_id == user_id).count()
        devices = db.query(Device).filter(Device.user_id == user_id).offset(skip).limit(limit).all()
        return devices, total

    @staticmethod
    def update_device(db: Session, device: Device, **kwargs) -> Device:
        for key, value in kwargs.items():
            if hasattr(device, key):
                setattr(device, key, value)
        device.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    def delete_device(db: Session, device: Device) -> None:
        device.deleted_at = datetime.utcnow()
        device.is_active = False
        db.commit()

    @staticmethod
    def update_device_status(db: Session, device: Device, status: str) -> Device:
        device.status = status
        device.last_online = datetime.utcnow() if status == "online" else device.last_online
        device.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    def record_power_usage(db: Session, device_id: int, usage: float, timestamp: datetime, cost: float) -> PowerUsageRecord:
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
        return db.query(PowerUsageRecord).filter(PowerUsageRecord.device_id == device_id, PowerUsageRecord.timestamp >= start_time, PowerUsageRecord.timestamp <= end_time).all()

    @staticmethod
    def get_total_power_usage(db: Session, user_id: int, start_time: datetime, end_time: datetime) -> float:
        devices = db.query(Device).filter(Device.user_id == user_id).all()
        device_ids = [device.id for device in devices]

        total = db.query(func.sum(PowerUsageRecord.usage)).filter(PowerUsageRecord.device_id.in_(device_ids), PowerUsageRecord.timestamp >= start_time, PowerUsageRecord.timestamp <= end_time).scalar()

        return float(total or 0)
