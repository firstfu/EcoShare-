import { useSettings } from "../contexts/SettingsContext";
import { Sun, Moon, Palette, Type } from "lucide-react";

export default function ThemeSettings() {
  const { settings, updateThemeSettings } = useSettings();

  const colorOptions = [
    { value: "#B38B5F", label: "經典棕" },
    { value: "#4A90E2", label: "科技藍" },
    { value: "#50C878", label: "自然綠" },
    { value: "#9B59B6", label: "優雅紫" },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium mb-6">主題設定</h2>

      <div className="bg-white rounded-lg shadow-sm">
        {/* 主題模式 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.theme.mode === "light" ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
              <div>
                <h3 className="font-medium">主題模式</h3>
                <p className="text-sm text-gray-500 mt-1">選擇深色或淺色主題</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateThemeSettings({ mode: "light" })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  settings.theme.mode === "light" ? "border-[#B38B5F] bg-[#B38B5F] text-white" : "border-gray-200 text-gray-600"
                }`}
              >
                淺色
              </button>
              <button
                onClick={() => updateThemeSettings({ mode: "dark" })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  settings.theme.mode === "dark" ? "border-[#B38B5F] bg-[#B38B5F] text-white" : "border-gray-200 text-gray-600"
                }`}
              >
                深色
              </button>
            </div>
          </div>
        </div>

        {/* 主色調 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">主色調</h3>
                <p className="text-sm text-gray-500 mt-1">選擇系統主要顏色</p>
              </div>
            </div>
            <div className="flex gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateThemeSettings({ primaryColor: color.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    settings.theme.primaryColor === color.value ? "border-gray-400" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 字體大小 */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium">字體大小</h3>
                <p className="text-sm text-gray-500 mt-1">調整系統字體大小</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateThemeSettings({ fontSize: "small" })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  settings.theme.fontSize === "small" ? "border-[#B38B5F] bg-[#B38B5F] text-white" : "border-gray-200 text-gray-600"
                }`}
              >
                小
              </button>
              <button
                onClick={() => updateThemeSettings({ fontSize: "medium" })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  settings.theme.fontSize === "medium" ? "border-[#B38B5F] bg-[#B38B5F] text-white" : "border-gray-200 text-gray-600"
                }`}
              >
                中
              </button>
              <button
                onClick={() => updateThemeSettings({ fontSize: "large" })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  settings.theme.fontSize === "large" ? "border-[#B38B5F] bg-[#B38B5F] text-white" : "border-gray-200 text-gray-600"
                }`}
              >
                大
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
