from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database.session import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    device_id = Column(String(50), unique=True, nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(20), default="offline")
    location = Column(String(100))
    last_online = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    power_usage = Column(Numeric(10, 2), default=0)
    is_active = Column(Boolean, default=True)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # 關聯
    power_usage_records = relationship("PowerUsageRecord", back_populates="device")


class PowerUsageRecord(Base):
    __tablename__ = "power_usage_records"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    usage = Column(Numeric(10, 2), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    cost = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # 關聯
    device = relationship("Device", back_populates="power_usage_records")
