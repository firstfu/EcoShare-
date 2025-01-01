import { useState, useEffect } from "react";
import { QrCode, DoorOpen, Timer, ArrowRight } from "lucide-react";

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  cabinetNumber: string;
  pickupCode: string;
}

export default function PickupModal({ isOpen, onClose, location, cabinetNumber, pickupCode }: PickupModalProps) {
  const [step, setStep] = useState(1);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setIsOpening(true);
      const timer = setTimeout(() => {
        setIsOpening(false);
        setStep(3);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          {/* 步驟指示器 */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? "bg-[#B38B5F] text-white" : "bg-gray-100 text-gray-400"}`}>
                  {i}
                </div>
                {i < 3 && <ArrowRight className={`w-4 h-4 mx-2 ${step > i ? "text-[#B38B5F]" : "text-gray-300"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">取件碼已生成</h3>
                <p className="text-sm text-gray-500 mb-6">{location}</p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="text-4xl font-bold text-[#B38B5F] tracking-wider mb-2">{pickupCode}</div>
                  <QrCode className="w-32 h-32 mx-auto text-gray-800" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full px-4 py-3 bg-[#B38B5F] rounded-full text-sm font-medium text-white hover:bg-[#96724D]">
                開啟櫃門
              </button>
            </>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className={`transition-transform duration-1000 ${isOpening ? "scale-110" : "scale-100"}`}>
                <DoorOpen className={`w-32 h-32 mx-auto ${isOpening ? "text-[#B38B5F]" : "text-gray-400"}`} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mt-4">櫃門開啟中...</h3>
              <p className="text-sm text-gray-500 mt-2">請稍候</p>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">請取出充電寶</h3>
                <p className="text-sm text-gray-500 mb-6">請從 {cabinetNumber} 號櫃門取出充電寶</p>
                <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">注意事項</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• 請確認充電寶型號是否正確</li>
                    <li>• 取出後櫃門將自動關閉</li>
                    <li>• 計時將在取出後開始</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center gap-2 text-[#B38B5F]">
                  <Timer className="w-5 h-5" />
                  <span className="text-sm font-medium">計時即將開始</span>
                </div>
              </div>
              <button onClick={onClose} className="w-full px-4 py-3 bg-[#B38B5F] rounded-full text-sm font-medium text-white hover:bg-[#96724D] mt-6">
                完成
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
