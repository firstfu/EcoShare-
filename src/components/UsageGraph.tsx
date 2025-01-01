import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
  date: string | number;
  value: number;
}

interface UsageGraphProps {
  data: DataPoint[];
  timeUnit: "year" | "month" | "day";
}

export default function UsageGraph({ data, timeUnit }: UsageGraphProps) {
  const formatXAxis = (value: string | number) => {
    if (timeUnit === "year") return `${value}年`;
    if (timeUnit === "month") return `${value}月`;
    return `${value}日`;
  };

  const formatTooltip = (value: number) => [`${value}元`];

  return (
    <div className="w-full h-[300px] px-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={formatXAxis} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={value => `${value}元`} />
          <Tooltip formatter={formatTooltip} labelFormatter={formatXAxis} />
          <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
