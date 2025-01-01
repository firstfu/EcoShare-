import { useState, useEffect } from "react";
import { Timer, Battery, MapPin, ArrowLeft, DollarSign } from "lucide-react";

interface UsingStatusProps {
  startTime: Date;
  endTime: Date;
  location: string;
  battery: number;
  pricePerHour: number;
  onReturn: () => void;
}

export default function UsingStatus({ startTime, endTime, location, battery, pricePerHour, onReturn }: UsingStatusProps) {
  const [remainingTime, setRemainingTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const [currentCost, setCurrentCost] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime({ hours, minutes, seconds });

      // 計算已使用時間（分鐘）
      const usedTimeInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
      const cost = Math.ceil((usedTimeInMinutes / 60) * pricePerHour);
      setCurrentCost(cost);
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(timer);
  }, [startTime, endTime, pricePerHour]);

  return (
    <div className="flex-1 bg-gray-50">
      {/* 頂部狀態卡片 */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">使用中</h2>
          <button onClick={onReturn} className="flex items-center gap-2 text-sm text-[#B38B5F]">
            <ArrowLeft className="w-4 h-4" />
            提前歸還
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 剩餘時間 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm">剩餘時間</span>
            </div>
            <div className="text-2xl font-bold text-[#B38B5F]">
              {String(remainingTime.hours).padStart(2, "0")}:{String(remainingTime.minutes).padStart(2, "0")}:{String(remainingTime.seconds).padStart(2, "0")}
            </div>
          </div>

          {/* 目前費用 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">目前費用</span>
            </div>
            <div className="text-2xl font-bold text-[#B38B5F]">{currentCost}元</div>
          </div>
        </div>
      </div>

      {/* 設備資訊 */}
      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-4">設備資訊</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Battery className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium">電量</div>
                <div className="text-xs text-gray-500">剩餘可用時間約 {Math.floor(battery / 10)} 小時</div>
              </div>
            </div>
            <div className="text-lg font-medium text-green-600">{battery}%</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium">租借地點</div>
                <div className="text-xs text-gray-500">{location}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 歸還說明 */}
        <div className="mt-6 bg-yellow-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">歸還說明</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• 可在任一路易莎門市歸還</li>
            <li>• 歸還時請確保充電寶完好</li>
            <li>• 超時將額外收取費用</li>
            <li>• 押金將在歸還後自動退回</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
