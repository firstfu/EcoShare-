"""
位置模型模組
定義位置相關的資料庫模型
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SQLAEnum
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class LocationType:
    """位置類型列舉"""

    BUILDING = "building"
    FLOOR = "floor"
    ROOM = "room"
    AREA = "area"


class Location(Base):
    """位置資料庫模型"""

    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(SQLAEnum(LocationType.BUILDING, LocationType.FLOOR, LocationType.ROOM, LocationType.AREA, name="location_type"), nullable=False)
    description = Column(String, nullable=True)
    parent_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 關聯
    parent = relationship("Location", remote_side=[id], back_populates="children")
    children = relationship("Location", back_populates="parent")
    devices = relationship("Device", back_populates="location")


# Pydantic 模型
class LocationBase(BaseModel):
    """位置基礎模型"""

    name: str
    type: str = Field(..., pattern="^(building|floor|room|area)$")
    description: Optional[str] = None
    parent_id: Optional[int] = None


class LocationCreate(LocationBase):
    """位置創建模型"""

    pass


class LocationUpdate(BaseModel):
    """位置更新模型"""

    name: Optional[str] = None
    type: Optional[str] = Field(None, pattern="^(building|floor|room|area)$")
    description: Optional[str] = None
    parent_id: Optional[int] = None


class LocationResponse(LocationBase):
    """位置回應模型"""

    id: int
    created_at: datetime
    updated_at: datetime
    children: Optional[List["LocationResponse"]] = None

    class Config:
        """Pydantic 配置"""

        from_attributes = True


# 解決循環引用問題
LocationResponse.model_rebuild()
