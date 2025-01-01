import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Device } from "./DeviceManager";

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSubmit: (formData: Omit<Device, "id">) => void;
}

type FormData = Omit<Device, "id">;

export default function DeviceModal({ isOpen, onClose, device, onSubmit }: DeviceModalProps) {
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
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* 標題列 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{device ? "編輯設備" : "新增設備"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
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

            {/* 位置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 狀態 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as FormData["status"] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
              >
                <option value="active">運作中</option>
                <option value="inactive">停用</option>
                <option value="maintenance">維護中</option>
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

          {/* 按鈕列 */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              取消
            </button>
            <button type="submit" className="px-4 py-2 text-white bg-[#B38B5F] rounded-lg hover:bg-[#8B6A47] transition-colors">
              {device ? "更新" : "新增"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
