"""
主應用程式入口點
負責設定 FastAPI 應用程式、配置中間件、註冊路由
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import device, location, user  # 導入 API 路由模組
from .config import settings  # 導入應用程式設定

# 創建 FastAPI 應用程式實例
app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_PREFIX}/openapi.json")  # 設定 API 文檔標題  # 設定 OpenAPI 文檔路徑

# 配置 CORS（跨來源資源共用）中間件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # 允許的來源域名
    allow_credentials=True,  # 允許攜帶認證資訊
    allow_methods=["*"],  # 允許的 HTTP 方法
    allow_headers=["*"],  # 允許的 HTTP 標頭
)

# 註冊 API 路由
app.include_router(user.router, prefix=settings.API_V1_PREFIX)  # 使用者相關的路由  # 加入 API 版本前綴
app.include_router(device.router, prefix=settings.API_V1_PREFIX)  # 設備相關的路由  # 加入 API 版本前綴
app.include_router(location.router, prefix=settings.API_V1_PREFIX)  # 位置相關的路由


@app.get("/")
def read_root():
    """
    根路徑處理函數
    返回歡迎訊息，用於確認 API 服務正常運作
    """
    return {"message": "Welcome to EcoShare+ API"}
