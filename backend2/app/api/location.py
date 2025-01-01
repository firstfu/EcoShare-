"""
位置 API 路由模組
處理所有與位置相關的 HTTP 請求
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.location import LocationCreate, LocationResponse, LocationUpdate
from ..services.location import LocationService

router = APIRouter(prefix="/locations", tags=["locations"])


@router.post("", response_model=LocationResponse)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    """
    創建新位置
    """
    # 如果指定了父位置，檢查父位置是否存在
    if location.parent_id:
        parent = LocationService.get_location(db, location.parent_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent location not found")

    return LocationService.create_location(db, location)


@router.get("", response_model=List[LocationResponse])
def get_locations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    獲取位置列表（樹狀結構）
    只返回頂層位置，子位置通過 children 屬性獲取
    """
    return LocationService.get_locations(db, skip=skip, limit=limit)


@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    """
    獲取單個位置
    """
    db_location = LocationService.get_location(db, location_id)
    if not db_location:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location


@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, location: LocationUpdate, db: Session = Depends(get_db)):
    """
    更新位置資訊
    """
    # 檢查位置是否存在
    if not LocationService.get_location(db, location_id):
        raise HTTPException(status_code=404, detail="Location not found")

    # 如果要更改父位置，檢查新的父位置是否存在
    if location.parent_id is not None:
        parent = LocationService.get_location(db, location.parent_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent location not found")

        # 檢查是否會造成循環引用
        if LocationService.check_circular_reference(db, location_id, location.parent_id):
            raise HTTPException(status_code=400, detail="Circular reference detected")

    db_location = LocationService.update_location(db, location_id, location)
    return db_location


@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    """
    刪除位置
    """
    # 檢查位置是否存在
    location = LocationService.get_location(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # 檢查是否有子位置
    children = LocationService.get_children(db, location_id)
    if children:
        raise HTTPException(status_code=400, detail="Cannot delete location with children")

    success = LocationService.delete_location(db, location_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete location")

    return {"message": "Location deleted successfully"}


@router.get("/{location_id}/children", response_model=List[LocationResponse])
def get_location_children(location_id: int, db: Session = Depends(get_db)):
    """
    獲取位置的子位置列表
    """
    # 檢查位置是否存在
    if not LocationService.get_location(db, location_id):
        raise HTTPException(status_code=404, detail="Location not found")

    return LocationService.get_children(db, location_id)


@router.patch("/{location_id}/move", response_model=LocationResponse)
def move_location(location_id: int, new_parent_id: int, db: Session = Depends(get_db)):
    """
    移動位置（更改父位置）
    """
    # 檢查位置是否存在
    location = LocationService.get_location(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # 檢查新的父位置是否存在
    if new_parent_id is not None:
        parent = LocationService.get_location(db, new_parent_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent location not found")

        # 檢查是否會造成循環引用
        if LocationService.check_circular_reference(db, location_id, new_parent_id):
            raise HTTPException(status_code=400, detail="Circular reference detected")

    db_location = LocationService.move_location(db, location_id, new_parent_id)
    return db_location
