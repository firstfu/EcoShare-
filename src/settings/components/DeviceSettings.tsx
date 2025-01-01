import { useSettings } from "../contexts/SettingsContext";
import { Timer, Zap, Power } from "lucide-react";

export default function DeviceSettings() {
  const { settings, updateDeviceSettings } = useSettings();

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium mb-6">設備設定</h2>

      <div className="bg-white rounded-lg shadow-sm">
        {/* 預設維護間隔 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">預設維護間隔</h3>
                <p className="text-sm text-gray-500 mt-1">設定設備的預設維護檢查間隔時間</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.device.defaultMaintenanceInterval}
                onChange={e => updateDeviceSettings({ defaultMaintenanceInterval: Number(e.target.value) })}
                min="1"
                max="365"
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-right"
              />
              <span className="text-gray-500">天</span>
            </div>
          </div>
        </div>

        {/* 用電閾值 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">用電閾值</h3>
                <p className="text-sm text-gray-500 mt-1">當設備用電量超過此閾值時將發出警告</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.device.powerUsageThreshold}
                onChange={e => updateDeviceSettings({ powerUsageThreshold: Number(e.target.value) })}
                min="0"
                step="100"
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-right"
              />
              <span className="text-gray-500">kW</span>
            </div>
          </div>
        </div>

        {/* 自動關機設定 */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">自動關機</h3>
                <p className="text-sm text-gray-500 mt-1">當設備閒置時自動關閉電源</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.device.autoShutdownEnabled}
                onChange={e => updateDeviceSettings({ autoShutdownEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B38B5F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B5F]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
