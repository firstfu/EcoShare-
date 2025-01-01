"""
設備和用電紀錄模型定義
包含設備基本資訊、狀態追蹤和用電量紀錄的資料結構
"""

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database.session import Base


class Device(Base):
    """
    設備資料模型
    用於管理智慧設備的基本資訊、狀態和用電量
    """

    __tablename__ = "devices"  # 資料表名稱

    # 基本資訊欄位
    id = Column(Integer, primary_key=True, index=True)  # 主鍵，自動遞增
    name = Column(String(100), nullable=False)  # 設備名稱，必填
    device_id = Column(String(50), unique=True, nullable=False)  # 設備唯一識別碼，必填
    type = Column(String(50), nullable=False)  # 設備類型，必填
    description = Column(Text)  # 設備描述，選填
    location = Column(String(100))  # 設備位置，選填

    # 狀態追蹤欄位
    status = Column(String(20), default="offline")  # 設備狀態，預設離線
    last_online = Column(DateTime)  # 最後在線時間
    is_active = Column(Boolean, default=True)  # 設備啟用狀態

    # 用電量相關欄位
    power_usage = Column(Numeric(10, 2), default=0)  # 當前用電量，預設為 0
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # 所屬使用者 ID

    # 時間戳記欄位
    created_at = Column(DateTime, server_default=func.now())  # 建立時間
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  # 更新時間
    deleted_at = Column(DateTime)  # 刪除時間，用於軟刪除

    # 關聯
    power_usage_records = relationship("PowerUsageRecord", back_populates="device")  # 用電紀錄關聯


class PowerUsageRecord(Base):
    """
    用電紀錄資料模型
    記錄設備的用電量歷史資料和相關成本
    """

    __tablename__ = "power_usage_records"  # 資料表名稱

    # 基本資訊欄位
    id = Column(Integer, primary_key=True, index=True)  # 主鍵，自動遞增
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)  # 關聯設備 ID

    # 用電量相關欄位
    usage = Column(Numeric(10, 2), nullable=False)  # 用電量數值，必填
    timestamp = Column(DateTime, nullable=False)  # 紀錄時間點，必填
    cost = Column(Numeric(10, 2), nullable=False)  # 用電成本，必填

    # 時間戳記欄位
    created_at = Column(DateTime, server_default=func.now())  # 建立時間
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  # 更新時間
    deleted_at = Column(DateTime)  # 刪除時間，用於軟刪除

    # 關聯
    device = relationship("Device", back_populates="power_usage_records")  # 設備關聯
