import { useSettings } from "../contexts/SettingsContext";
import { Globe, Clock, Calendar } from "lucide-react";

export default function GeneralSettings() {
  const { settings, updateGeneralSettings } = useSettings();

  const timeZones = [
    { value: "Asia/Taipei", label: "台北 (GMT+8)" },
    { value: "Asia/Tokyo", label: "東京 (GMT+9)" },
    { value: "America/New_York", label: "紐約 (GMT-5)" },
    { value: "Europe/London", label: "倫敦 (GMT+0)" },
  ];

  const dateFormats = [
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium mb-6">一般設定</h2>

      <div className="bg-white rounded-lg shadow-sm">
        {/* 語言設定 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">語言設定</h3>
                <p className="text-sm text-gray-500 mt-1">選擇系統顯示語言</p>
              </div>
            </div>
            <select
              value={settings.general.language}
              onChange={e => updateGeneralSettings({ language: e.target.value as "zh-TW" | "en" })}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* 時區設定 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">時區設定</h3>
                <p className="text-sm text-gray-500 mt-1">選擇您所在的時區</p>
              </div>
            </div>
            <select
              value={settings.general.timeZone}
              onChange={e => updateGeneralSettings({ timeZone: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              {timeZones.map(zone => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 日期格式設定 */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">日期格式</h3>
                <p className="text-sm text-gray-500 mt-1">選擇日期顯示格式</p>
              </div>
            </div>
            <select
              value={settings.general.dateFormat}
              onChange={e => updateGeneralSettings({ dateFormat: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              {dateFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
