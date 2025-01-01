import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Palette, Menu, X, ChevronLeft } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import GeneralSettings from "./GeneralSettings";
import DeviceSettings from "./DeviceSettings";
import NotificationSettings from "./NotificationSettings";
import ThemeSettings from "./ThemeSettings";

type SettingTab = "general" | "device" | "notification" | "theme";

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState<SettingTab>("general");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  const tabs = [
    { id: "general", label: "一般設定", icon: SettingsIcon },
    { id: "device", label: "設備設定", icon: User },
    { id: "notification", label: "通知設定", icon: Bell },
    { id: "theme", label: "主題設定", icon: Palette },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "device":
        return <DeviceSettings />;
      case "notification":
        return <NotificationSettings />;
      case "theme":
        return <ThemeSettings />;
      default:
        return null;
    }
  };

  const handleTabClick = (tabId: SettingTab) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 頂部標題欄 */}
      <div className="bg-[#B38B5F] text-white h-12 flex items-center px-4">
        <div className="flex-1 flex items-center gap-4">
          <ChevronLeft className="w-6 h-6" />
          <h1 className="text-lg font-medium">系統設定</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* 側邊選單 */}
        <div
          className={`fixed lg:static inset-y-12 left-0 w-[240px] bg-white border-r border-gray-200 transform transition-transform duration-300 lg:transform-none z-40 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === tab.id ? "bg-[#B38B5F] text-white" : "text-gray-600"}`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 遮罩層 */}
        {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden" onClick={() => setIsMenuOpen(false)} />}

        {/* 主要內容區 */}
        <div className="flex-1 p-6 lg:p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
