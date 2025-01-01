import { useState } from "react";
import CurrentPowerUsage from "./energy/CurrentPowerUsage";
import PowerTrend from "./energy/PowerTrend";
import CostOverview from "./energy/CostOverview";
import DeviceDistribution from "./energy/DeviceDistribution";

// 模擬數據
const mockData = {
  current: {
    usage: 42.5, // 當前用電量(kW)
    trend: -5.2, // 與上小時相比的變化百分比
    status: "normal" as const, // 用電狀態: normal, high, low
  },
  daily: [
    { date: "2024-01-01", usage: 980, lastMonth: 1020 },
    { date: "2024-01-02", usage: 1050, lastMonth: 990 },
    { date: "2024-01-03", usage: 920, lastMonth: 950 },
    // ... 更多日期數據
  ],
  costs: {
    estimated: 12500, // 本月預估
    lastMonth: 13200, // 上月實際
    saved: 700, // 節省金額
    targetPercentage: 85, // 目標達成率
  },
  devices: [
    { name: "空調系統", usage: 450, percentage: 45 },
    { name: "照明設備", usage: 250, percentage: 25 },
    { name: "電腦設備", usage: 180, percentage: 18 },
    { name: "其他設備", usage: 120, percentage: 12 },
  ],
};

export default function EnergyManager() {
  return (
    <div className="flex-1 bg-gray-50">
      {/* 頂部標題 */}
      <div className="bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium">節能管家</h2>
        <p className="text-sm text-gray-500 mt-1">路易莎咖啡(台中1店)</p>
      </div>

      {/* 內容區域 */}
      <div className="p-4 space-y-4">
        {/* 即時用電監控 */}
        <CurrentPowerUsage usage={mockData.current.usage} trend={mockData.current.trend} status={mockData.current.status} />

        {/* 本月用電趨勢 */}
        <PowerTrend data={mockData.daily} />

        {/* 費用統計 */}
        <CostOverview costs={mockData.costs} />

        {/* 設備用電分布 */}
        <DeviceDistribution devices={mockData.devices} />
      </div>
    </div>
  );
}
