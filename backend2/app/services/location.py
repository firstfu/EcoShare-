"""
位置服務層模組
提供位置管理的業務邏輯處理
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import and_
from sqlalchemy.orm import Session

from ..models.location import Location, LocationCreate, LocationUpdate


class LocationService:
    """位置服務類別"""

    @staticmethod
    def create_location(db: Session, location: LocationCreate) -> Location:
        """
        創建新位置

        Args:
            db: 資料庫會話
            location: 位置創建資料

        Returns:
            新創建的位置
        """
        db_location = Location(
            name=location.name,
            type=location.type,
            description=location.description,
            parent_id=location.parent_id,
        )
        db.add(db_location)
        db.commit()
        db.refresh(db_location)
        return db_location

    @staticmethod
    def get_location(db: Session, location_id: int) -> Optional[Location]:
        """
        獲取單個位置

        Args:
            db: 資料庫會話
            location_id: 位置 ID

        Returns:
            位置資訊，如果不存在則返回 None
        """
        return db.query(Location).filter(Location.id == location_id).first()

    @staticmethod
    def get_locations(db: Session, skip: int = 0, limit: int = 100) -> List[Location]:
        """
        獲取位置列表

        Args:
            db: 資料庫會話
            skip: 跳過的記錄數
            limit: 返回的最大記錄數

        Returns:
            位置列表
        """
        return db.query(Location).filter(Location.parent_id.is_(None)).offset(skip).limit(limit).all()

    @staticmethod
    def update_location(db: Session, location_id: int, location_update: LocationUpdate) -> Optional[Location]:
        """
        更新位置資訊

        Args:
            db: 資料庫會話
            location_id: 位置 ID
            location_update: 更新的位置資料

        Returns:
            更新後的位置，如果位置不存在則返回 None
        """
        db_location = LocationService.get_location(db, location_id)
        if not db_location:
            return None

        update_data = location_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_location, key, value)

        db_location.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_location)
        return db_location

    @staticmethod
    def delete_location(db: Session, location_id: int) -> bool:
        """
        刪除位置

        Args:
            db: 資料庫會話
            location_id: 位置 ID

        Returns:
            是否刪除成功
        """
        db_location = LocationService.get_location(db, location_id)
        if not db_location:
            return False

        db.delete(db_location)
        db.commit()
        return True

    @staticmethod
    def get_children(db: Session, location_id: int) -> List[Location]:
        """
        獲取子位置列表

        Args:
            db: 資料庫會話
            location_id: 父位置 ID

        Returns:
            子位置列表
        """
        return db.query(Location).filter(Location.parent_id == location_id).all()

    @staticmethod
    def move_location(db: Session, location_id: int, new_parent_id: Optional[int]) -> Optional[Location]:
        """
        移動位置（更改父位置）

        Args:
            db: 資料庫會話
            location_id: 位置 ID
            new_parent_id: 新的父位置 ID

        Returns:
            更新後的位置，如果位置不存在則返回 None
        """
        db_location = LocationService.get_location(db, location_id)
        if not db_location:
            return None

        # 檢查新的父位置是否存在（如果有指定）
        if new_parent_id is not None:
            new_parent = LocationService.get_location(db, new_parent_id)
            if not new_parent:
                return None

        db_location.parent_id = new_parent_id
        db_location.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_location)
        return db_location

    @staticmethod
    def check_circular_reference(db: Session, location_id: int, new_parent_id: int) -> bool:
        """
        檢查是否存在循環引用

        Args:
            db: 資料庫會話
            location_id: 位置 ID
            new_parent_id: 新的父位置 ID

        Returns:
            是否存在循環引用
        """
        current = LocationService.get_location(db, new_parent_id)
        while current:
            if current.id == location_id:
                return True
            if not current.parent_id:
                break
            current = LocationService.get_location(db, current.parent_id)
        return False
