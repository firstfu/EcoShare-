import { useState } from "react";
import { DollarSign, Receipt, CreditCard, ArrowRight } from "lucide-react";

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  usageCost: number;
  deposit: number;
}

export default function ReturnModal({ isOpen, onClose, onConfirm, usageCost, deposit }: ReturnModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onConfirm();
    }
  };

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
              <h3 className="text-xl font-medium text-gray-900 mb-6">費用確認</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">使用費用</span>
                  </div>
                  <span className="text-sm font-medium">{usageCost}元</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">押金退還</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+{deposit}元</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#B38B5F] bg-opacity-10 rounded-lg">
                  <span className="text-sm font-medium text-[#B38B5F]">應退金額</span>
                  <span className="text-lg font-medium text-[#B38B5F]">{deposit - usageCost}元</span>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-medium text-gray-900 mb-6">歸還確認</h3>
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">歸還前確認</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• 請確認充電寶外觀完好無損</li>
                  <li>• 請確認已取下所有連接線材</li>
                  <li>• 請將充電寶放入歸還櫃位</li>
                  <li>• 確認櫃門確實關閉</li>
                </ul>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <Receipt className="w-16 h-16 mx-auto text-[#B38B5F] mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">歸還完成</h3>
                <p className="text-sm text-gray-500">押金將在 1-3 個工作日內退還至您的支付帳戶</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#B38B5F] mb-1">{deposit - usageCost}元</div>
                  <div className="text-sm text-gray-500">應退金額</div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            {step < 3 && (
              <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                取消
              </button>
            )}
            <button onClick={handleConfirm} className="flex-1 px-4 py-2 bg-[#B38B5F] rounded-full text-sm font-medium text-white hover:bg-[#96724D]">
              {step === 3 ? "完成" : "下一步"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
