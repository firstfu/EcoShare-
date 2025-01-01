import { DollarSign, TrendingDown, Target } from "lucide-react";

interface CostOverviewProps {
  costs: {
    estimated: number;
    lastMonth: number;
    saved: number;
    targetPercentage: number;
  };
}

export default function CostOverview({ costs }: CostOverviewProps) {
  const { estimated, lastMonth, saved, targetPercentage } = costs;
  const changePercentage = ((estimated - lastMonth) / lastMonth) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">費用統計</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 本月預估 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">本月預估</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {estimated.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">元</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className={`w-4 h-4 ${changePercentage > 0 ? "text-red-500" : "text-green-500"}`} />
            <span className={`text-sm ${changePercentage > 0 ? "text-red-500" : "text-green-500"}`}>
              {changePercentage > 0 ? "+" : ""}
              {Math.abs(changePercentage).toFixed(1)}% 較上月
            </span>
          </div>
        </div>

        {/* 節省金額 */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">節省金額</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {saved.toLocaleString()}
            <span className="text-sm font-normal text-green-600 ml-1">元</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">目標達成率 {targetPercentage}%</span>
          </div>
        </div>
      </div>

      {/* 目標進度條 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">目標達成進度</span>
          <span className="font-medium">{targetPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${targetPercentage}%` }} />
        </div>
        <p className="text-xs text-gray-500">距離本月節能目標還差 {(100 - targetPercentage).toFixed(1)}%</p>
      </div>
    </div>
  );
}
