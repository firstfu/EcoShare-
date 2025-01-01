import { Zap, TrendingUp, TrendingDown } from "lucide-react";

interface CurrentPowerUsageProps {
  usage: number;
  trend: number;
  status: "normal" | "high" | "low";
}

export default function CurrentPowerUsage({ usage, trend, status }: CurrentPowerUsageProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600";
      case "low":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "high":
        return "bg-red-100";
      case "low":
        return "bg-green-100";
      default:
        return "bg-blue-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "high":
        return "用電量偏高";
      case "low":
        return "用電量良好";
      default:
        return "用電量正常";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">即時用電監控</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusBg(status)} ${getStatusColor(status)}`}>
          <Zap className="w-4 h-4" />
          <span className="text-sm">{getStatusText(status)}</span>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <div className="text-4xl font-bold tracking-tight">
            {usage}
            <span className="text-xl font-normal text-gray-500 ml-1">kW</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {trend > 0 ? <TrendingUp className="w-4 h-4 text-red-500" /> : <TrendingDown className="w-4 h-4 text-green-500" />}
            <span className={`text-sm ${trend > 0 ? "text-red-500" : "text-green-500"}`}>{Math.abs(trend)}% 較上小時</span>
          </div>
        </div>

        {/* 用電量指示器 */}
        <div className="flex-1 h-24 relative">
          <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${getStatusBg(status)}`}
              style={{
                height: `${Math.min(100, (usage / 100) * 100)}%`,
                opacity: 0.3,
              }}
            />
          </div>
        </div>
      </div>

      {status === "high" && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">建議：請檢查空調設定溫度，並關閉不必要的用電設備。</p>
        </div>
      )}
    </div>
  );
}
