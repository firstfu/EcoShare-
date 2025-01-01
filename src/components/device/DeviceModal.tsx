import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Device } from "./DeviceManager";
import StepIndicator from "./StepIndicator";

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSubmit: (formData: Omit<Device, "id">) => void;
  currentStep?: number;
  isSubmitting?: boolean;
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

type FormData = Omit<Device, "id">;

export default function DeviceModal({ isOpen, onClose, device, onSubmit, currentStep = 0, isSubmitting }: DeviceModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "socket",
    location: "",
    status: "active",
    lastMaintenance: new Date().toISOString().split("T")[0],
    nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    powerUsage: 0,
    installDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        type: device.type,
        location: device.location,
        status: device.status,
        lastMaintenance: device.lastMaintenance,
        nextMaintenance: device.nextMaintenance,
        powerUsage: device.powerUsage,
        installDate: device.installDate,
      });
    } else {
      setFormData({
        name: "",
        type: "socket",
        location: "",
        status: "active",
        lastMaintenance: new Date().toISOString().split("T")[0],
        nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        powerUsage: 0,
        installDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [device]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{device ? "編輯設備" : "新增設備"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 設備名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">設備名稱</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 設備類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">設備類型</label>
              <select
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as FormData["type"] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
              >
                <option value="socket">智慧插座</option>
                <option value="sensor">感測器</option>
                <option value="controller">控制器</option>
              </select>
            </div>

            {/* 用電量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用電量 (kW)</label>
              <input
                type="number"
                value={formData.powerUsage}
                onChange={e => setFormData(prev => ({ ...prev, powerUsage: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
                min="0"
                step="0.1"
              />
            </div>

            {/* 安裝日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">安裝日期</label>
              <input
                type="date"
                value={formData.installDate}
                onChange={e => setFormData(prev => ({ ...prev, installDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 上次維護日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">上次維護日期</label>
              <input
                type="date"
                value={formData.lastMaintenance}
                onChange={e => setFormData(prev => ({ ...prev, lastMaintenance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 下次維護日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">下次維護日期</label>
              <input
                type="date"
                value={formData.nextMaintenance}
                onChange={e => setFormData(prev => ({ ...prev, nextMaintenance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-[#B38B5F] text-white rounded-lg hover:bg-[#8B6A47] transition-colors flex items-center gap-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  處理中...
                </>
              ) : (
                "下一步"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
