import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearRangeSelectorProps {
  startYear: number;
  endYear: number;
  onRangeChange: (start: number, end: number) => void;
}

export default function YearRangeSelector({ startYear, endYear, onRangeChange }: YearRangeSelectorProps) {
  return (
    <div className="bg-[#F5F0F0] p-4 flex items-center justify-between">
      <span className="text-gray-700">區間選擇</span>
      <div className="flex items-center gap-2">
        <span>
          {startYear}年 - {endYear}年
        </span>
        <div className="flex">
          <button className="p-1" onClick={() => onRangeChange(startYear - 1, endYear - 1)}>
            <ChevronLeft size={20} />
          </button>
          <button className="p-1" onClick={() => onRangeChange(startYear + 1, endYear + 1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
