import { Clock, Info, AlertCircle } from "lucide-react";

interface RentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hours: number) => void;
  price: number;
}

export default function RentModal({ isOpen, onClose, onConfirm, price }: RentModalProps) {
  if (!isOpen) return null;

  const timeOptions = [
    { hours: 1, label: "1小時" },
    { hours: 2, label: "2小時" },
    { hours: 3, label: "3小時" },
    { hours: 4, label: "4小時" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-900">租借確認</h3>

          {/* 租借時間選擇 */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">選擇租借時間</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {timeOptions.map(({ hours, label }) => (
                <button
                  key={hours}
                  onClick={() => onConfirm(hours)}
                  className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:border-[#B38B5F] hover:text-[#B38B5F] transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 費用說明 */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">租借費用</span>
              </div>
              <span className="text-sm font-medium">{price}元/小時</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">押金</span>
              </div>
              <span className="text-sm font-medium">500元</span>
            </div>
          </div>

          {/* 使用須知 */}
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800">租借須知</h4>
                <ul className="mt-2 text-xs text-yellow-700 space-y-1">
                  <li>• 超時將額外收取費用</li>
                  <li>• 歸還時請確保充電寶完好</li>
                  <li>• 押金將在歸還後自動退回</li>
                  <li>• 若有損壞將扣除相應費用</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 按鈕 */}
          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">
              取消
            </button>
            <button onClick={() => onConfirm(1)} className="flex-1 px-4 py-2 bg-[#B38B5F] rounded-full text-sm font-medium text-white hover:bg-[#96724D]">
              確認租借
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
