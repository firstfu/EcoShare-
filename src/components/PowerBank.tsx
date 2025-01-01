import { useState } from "react";
import { Battery, MapPin, Clock } from "lucide-react";
import RentModal from "./powerbank/RentModal";
import PickupModal from "./powerbank/PickupModal";
import UsingStatus from "./powerbank/UsingStatus";
import ReturnModal from "./powerbank/ReturnModal";

interface PowerBankItemProps {
  location: string;
  distance: string;
  battery: number;
  price: number;
  status: "available" | "charging";
  onRent: () => void;
}

function PowerBankItem({ location, distance, battery, price, status, onRent }: PowerBankItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${status === "available" ? "bg-green-100" : "bg-yellow-100"}`}>
          <Battery className={`w-6 h-6 ${status === "available" ? "text-green-600" : "text-yellow-600"}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{location}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm text-gray-500">電量：{battery}%</div>
            {status === "charging" && (
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Clock className="w-4 h-4" />
                <span>充電中</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-medium text-[#B38B5F]">{price}元/小時</div>
        <button
          className={`mt-2 px-4 py-1.5 rounded-full text-sm
            ${status === "available" ? "bg-[#B38B5F] text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          disabled={status === "charging"}
          onClick={status === "available" ? onRent : undefined}
        >
          {status === "available" ? "租借" : "使用中"}
        </button>
      </div>
    </div>
  );
}

export default function PowerBank() {
  const [selectedBank, setSelectedBank] = useState<null | {
    location: string;
    price: number;
  }>(null);

  const [pickupInfo, setPickupInfo] = useState<null | {
    location: string;
    cabinetNumber: string;
    pickupCode: string;
  }>(null);

  const [usingInfo, setUsingInfo] = useState<null | {
    startTime: Date;
    endTime: Date;
    location: string;
    battery: number;
    pricePerHour: number;
  }>(null);

  const [returnInfo, setReturnInfo] = useState<null | {
    usageCost: number;
  }>(null);

  const powerBanks = [
    {
      location: "路易莎咖啡(台中1店)",
      distance: "目前位置",
      battery: 100,
      price: 30,
      status: "available" as const,
    },
    {
      location: "路易莎咖啡(台中2店)",
      distance: "350公尺",
      battery: 85,
      price: 30,
      status: "charging" as const,
    },
    {
      location: "路易莎咖啡(台中3店)",
      distance: "500公尺",
      battery: 90,
      price: 30,
      status: "available" as const,
    },
    {
      location: "路易莎咖啡(台中4店)",
      distance: "750公尺",
      battery: 95,
      price: 30,
      status: "available" as const,
    },
  ];

  const handleRentConfirm = (hours: number) => {
    if (selectedBank) {
      // 生成隨機取件碼和櫃門號
      const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const cabinetNumber = Math.floor(Math.random() * 20 + 1)
        .toString()
        .padStart(2, "0");

      setPickupInfo({
        location: selectedBank.location,
        cabinetNumber,
        pickupCode,
      });

      // 設置使用資訊，但暫時不顯示
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

      setUsingInfo({
        startTime,
        endTime,
        location: selectedBank.location,
        battery: 100,
        pricePerHour: selectedBank.price,
      });

      setSelectedBank(null);
    }
  };

  const handlePickupComplete = () => {
    setPickupInfo(null);
  };

  const handleReturn = () => {
    if (usingInfo) {
      const now = new Date();
      const usedTimeInMinutes = Math.floor((now.getTime() - usingInfo.startTime.getTime()) / (1000 * 60));
      const usageCost = Math.ceil((usedTimeInMinutes / 60) * usingInfo.pricePerHour);

      setReturnInfo({
        usageCost,
      });
    }
  };

  const handleReturnComplete = () => {
    setUsingInfo(null);
    setReturnInfo(null);
  };

  // 如果正在使用中，顯示使用狀態頁面
  if (usingInfo) {
    return (
      <>
        <UsingStatus {...usingInfo} onReturn={handleReturn} />
        {returnInfo && (
          <ReturnModal isOpen={true} onClose={() => setReturnInfo(null)} onConfirm={handleReturnComplete} usageCost={returnInfo.usageCost} deposit={500} />
        )}
      </>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="space-y-4">
        {powerBanks.map((bank, index) => (
          <PowerBankItem key={index} {...bank} onRent={() => setSelectedBank({ location: bank.location, price: bank.price })} />
        ))}
      </div>

      <RentModal isOpen={selectedBank !== null} onClose={() => setSelectedBank(null)} onConfirm={handleRentConfirm} price={selectedBank?.price ?? 0} />

      {pickupInfo && (
        <PickupModal
          isOpen={true}
          onClose={handlePickupComplete}
          location={pickupInfo.location}
          cabinetNumber={pickupInfo.cabinetNumber}
          pickupCode={pickupInfo.pickupCode}
        />
      )}
    </div>
  );
}
