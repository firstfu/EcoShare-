import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import StepIndicator from "./StepIndicator";

interface Location {
  floor: string;
  spots: {
    id: string;
    name: string;
    status: "available" | "occupied";
  }[];
}

interface DeviceBindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (locationId: string) => void;
  availableLocations: Location[];
}

const steps = [
  {
    title: "基本資訊",
    description: "設定設備資訊",
  },
  {
    title: "位置綁定",
    description: "選擇安裝位置",
  },
  {
    title: "設備配對",
    description: "連接實體設備",
  },
];

export default function DeviceBindingModal({ isOpen, onClose, onConfirm, availableLocations }: DeviceBindingModalProps) {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedSpot(null);
  };

  const handleSpotSelect = (spotId: string) => {
    setSelectedSpot(spotId);
  };

  const selectedFloorData = availableLocations.find(loc => loc.floor === selectedFloor);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">選擇綁定位置</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <StepIndicator currentStep={1} steps={steps} />

        <div className="p-6">
          <div className="flex gap-6">
            {/* 樓層列表 */}
            <div className="w-1/3 border-r pr-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">選擇樓層</h4>
              <div className="space-y-2">
                {availableLocations.map(location => {
                  const availableCount = location.spots.filter(spot => spot.status === "available").length;
                  return (
                    <button
                      key={location.floor}
                      onClick={() => handleFloorSelect(location.floor)}
                      className={`w-full p-4 rounded-lg border text-left ${
                        selectedFloor === location.floor ? "border-[#B38B5F] bg-[#B38B5F] bg-opacity-10" : "border-gray-200 hover:border-[#B38B5F]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium">{location.floor}</div>
                          <div className="text-sm text-gray-500">
                            可用位置：{availableCount}/{location.spots.length}
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${selectedFloor === location.floor ? "text-[#B38B5F]" : "text-gray-400"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 位置列表 */}
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-500 mb-3">選擇位置</h4>
              {selectedFloorData ? (
                <div className="grid grid-cols-2 gap-3">
                  {selectedFloorData.spots.map(spot => (
                    <button
                      key={spot.id}
                      onClick={() => spot.status === "available" && handleSpotSelect(spot.id)}
                      disabled={spot.status === "occupied"}
                      className={`p-4 rounded-lg border ${
                        spot.status === "available"
                          ? selectedSpot === spot.id
                            ? "border-[#B38B5F] bg-[#B38B5F] bg-opacity-10"
                            : "border-gray-200 hover:border-[#B38B5F]"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-lg font-medium mb-1">{spot.name}</div>
                      <div className={`text-sm ${spot.status === "available" ? "text-green-600" : "text-gray-500"}`}>
                        {spot.status === "available" ? "可綁定" : "已綁定"}
                      </div>
                      {spot.status === "available" && selectedSpot === spot.id && <div className="mt-2 text-xs text-[#B38B5F]">點擊確認選擇此位置</div>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-400">請先選擇樓層</div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button
              onClick={() => selectedSpot && onConfirm(selectedSpot)}
              disabled={!selectedSpot}
              className={`px-4 py-2 rounded-lg ${
                selectedSpot ? "bg-[#B38B5F] text-white hover:bg-[#8B6A47]" : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-colors`}
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
