import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays } from "lucide-react";

interface PowerTrendProps {
  data: {
    date: string;
    usage: number;
    lastMonth: number;
  }[];
}

export default function PowerTrend({ data }: PowerTrendProps) {
  // 計算同比變化
  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
  const totalLastMonth = data.reduce((sum, item) => sum + item.lastMonth, 0);
  const changePercentage = ((totalUsage - totalLastMonth) / totalLastMonth) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium">本月用電趨勢</h3>
          <div className="flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              與上月同比
              <span className={`ml-1 font-medium ${changePercentage > 0 ? "text-red-500" : "text-green-500"}`}>
                {changePercentage > 0 ? "+" : ""}
                {changePercentage.toFixed(1)}%
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={value => value.split("-")[2]} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={value => `${value}kW`} />
            <Tooltip formatter={(value: number) => [`${value}kW`]} labelFormatter={label => `${label.split("-")[1]}月${label.split("-")[2]}日`} />
            <Line type="monotone" dataKey="lastMonth" stroke="#94a3b8" strokeDasharray="5 5" dot={false} name="上月用電" />
            <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} dot={false} name="本月用電" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-[#2563eb]" />
          <span className="text-sm text-gray-500">本月用電</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-[#94a3b8] stroke-dasharray-2" />
          <span className="text-sm text-gray-500">上月用電</span>
        </div>
      </div>
    </div>
  );
}
