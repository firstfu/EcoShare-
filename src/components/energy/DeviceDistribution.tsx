import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Laptop } from "lucide-react";

interface DeviceDistributionProps {
  devices: {
    name: string;
    usage: number;
    percentage: number;
  }[];
}

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

export default function DeviceDistribution({ devices }: DeviceDistributionProps) {
  const totalUsage = devices.reduce((sum, device) => sum + device.usage, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">設備用電分布</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
          <Laptop className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-600">總用電：{totalUsage}kW</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 圓餅圖 */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={devices} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="usage">
                {devices.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 圖例列表 */}
        <div className="space-y-3">
          {devices.map((device, index) => (
            <div key={device.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-600">{device.name}</span>
              </div>
              <div className="text-sm font-medium">{device.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* 節能建議 */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">建議：空調系統用電佔比較高，可考慮調整溫度設定或更新為節能設備。</p>
      </div>
    </div>
  );
}
