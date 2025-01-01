import { useState } from "react";
import { X, Loader2, QrCode, Wifi } from "lucide-react";
import StepIndicator from "./StepIndicator";

interface DevicePairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPairingComplete: (deviceId: string) => void;
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

type PairingStep = "scan" | "connecting" | "complete";

export default function DevicePairingModal({ isOpen, onClose, onPairingComplete }: DevicePairingModalProps) {
  const [deviceId, setDeviceId] = useState("");
  const [step, setStep] = useState<PairingStep>("scan");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceId(e.target.value);
    setError(null);
  };

  const handleScanQRCode = () => {
    // 這裡實作掃描 QR Code 的邏輯
    // 暫時模擬掃描結果
    setTimeout(() => {
      setDeviceId("DEVICE_123456");
      setError(null);
    }, 1000);
  };

  const handleStartPairing = async () => {
    if (!deviceId) {
      setError("請輸入或掃描設備ID");
      return;
    }

    setStep("connecting");
    setError(null);

    try {
      // 這裡實作實際的設備配對邏輯
      // 1. 檢查設備是否在線
      // 2. 驗證設備是否可用
      // 3. 建立連接
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模擬配對過程

      setStep("complete");
      onPairingComplete(deviceId);
    } catch (err) {
      setError("配對失敗，請確認設備是否在線或重試");
      setStep("scan");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">設備配對</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <StepIndicator currentStep={2} steps={steps} />

        <div className="p-6">
          {step === "scan" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium mb-2">掃描設備 QR Code</div>
                <div className="text-sm text-gray-500">請掃描設備上的 QR Code，或手動輸入設備 ID</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">設備 ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deviceId}
                    onChange={handleManualInput}
                    placeholder="輸入設備ID或掃描QR Code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                  />
                  <button onClick={handleScanQRCode} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <QrCode className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

              <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button
                  onClick={handleStartPairing}
                  disabled={!deviceId}
                  className={`px-4 py-2 rounded-lg ${
                    deviceId ? "bg-[#B38B5F] text-white hover:bg-[#8B6A47]" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                >
                  開始配對
                </button>
              </div>
            </div>
          )}

          {step === "connecting" && (
            <div className="py-12 flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-[#B38B5F] animate-spin mb-6" />
              <div className="text-xl font-medium mb-2">正在配對設備...</div>
              <div className="text-gray-500">請確保設備已開啟且在範圍內</div>
            </div>
          )}

          {step === "complete" && (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-xl font-medium mb-2">配對成功！</div>
              <div className="text-gray-500 mb-6">設備已成功連接</div>
              <button onClick={onClose} className="px-6 py-2 bg-[#B38B5F] text-white rounded-lg hover:bg-[#8B6A47] transition-colors">
                完成設定
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
