import { useState } from "react";
import "./index.css";
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import YearRangeSelector from "./components/YearRangeSelector";
import UsageGraph from "./components/UsageGraph";
import SmartSocket from "./components/SmartSocket";
import PowerBank from "./components/PowerBank";
import EnergyManager from "./components/EnergyManager";
import MemberManager from "./components/member/MemberManager";
import { FileText, Users, MonitorSmartphone, Zap, Battery, Settings, Plus } from "lucide-react";
import { SettingsProvider } from "./settings/contexts/SettingsContext";
import SettingsManager from "./settings/components/SettingsManager";
import DeviceModal from "./components/device/DeviceModal";
import DeviceBindingModal from "./components/device/DeviceBindingModal";
import DevicePairingModal from "./components/device/DevicePairingModal";

const yearData = [
  { date: 2012, value: 0 },
  { date: 2013, value: 400 },
  { date: 2014, value: 300 },
  { date: 2015, value: 700 },
  { date: 2016, value: 600 },
  { date: 2017, value: 800 },
  { date: 2018, value: 400 },
  { date: 2019, value: 500 },
  { date: 2020, value: 300 },
  { date: 2021, value: 600 },
  { date: 2022, value: 100 },
  { date: 2023, value: 750 },
];

const monthData = [
  { date: 1, value: 300 },
  { date: 2, value: 400 },
  { date: 3, value: 350 },
  { date: 4, value: 500 },
  { date: 5, value: 450 },
  { date: 6, value: 600 },
  { date: 7, value: 550 },
  { date: 8, value: 700 },
  { date: 9, value: 650 },
  { date: 10, value: 800 },
  { date: 11, value: 750 },
  { date: 12, value: 900 },
];

const dayData = Array.from({ length: 31 }, (_, i) => ({
  date: i + 1,
  value: Math.floor(Math.random() * 500) + 100,
}));

function App() {
  const [activeTab, setActiveTab] = useState<"year" | "month" | "day">("year");
  const [startYear, setStartYear] = useState(2012);
  const [endYear, setEndYear] = useState(2023);
  const [activePage, setActivePage] = useState<"ems" | "powerBank" | "energyManager" | "members" | "devices">("devices");
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isBindingModalOpen, setIsBindingModalOpen] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [pendingDeviceData, setPendingDeviceData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // 模擬可用位置數據
  const availableLocations = [
    {
      floor: "1F",
      spots: [
        { id: "1F-A", name: "櫃台區", status: "occupied" as const },
        { id: "1F-B", name: "用餐區A", status: "occupied" as const },
        { id: "1F-C", name: "用餐區B", status: "available" as const },
        { id: "1F-D", name: "廚房", status: "occupied" as const },
      ],
    },
    {
      floor: "2F",
      spots: [
        { id: "2F-A", name: "會議室A", status: "occupied" as const },
        { id: "2F-B", name: "會議室B", status: "available" as const },
        { id: "2F-C", name: "辦公區", status: "available" as const },
      ],
    },
    {
      floor: "3F",
      spots: [
        { id: "3F-A", name: "休息區", status: "available" as const },
        { id: "3F-B", name: "儲藏室", status: "available" as const },
      ],
    },
  ];

  const handleRangeChange = (start: number, end: number) => {
    setStartYear(start);
    setEndYear(end);
  };

  const getFilteredData = () => {
    switch (activeTab) {
      case "year":
        return yearData.filter(item => item.date >= startYear && item.date <= endYear);
      case "month":
        return monthData;
      case "day":
        return dayData;
      default:
        return yearData;
    }
  };

  const handleAddDevice = () => {
    setIsDeviceModalOpen(true);
  };

  const handleDeviceSubmit = (formData: any) => {
    setPendingDeviceData(formData);
    setIsDeviceModalOpen(false);
    setIsBindingModalOpen(true);
  };

  const handleBindingConfirm = (location: string) => {
    setSelectedLocation(location);
    setIsBindingModalOpen(false);
    setIsPairingModalOpen(true);
  };

  const handlePairingComplete = async (deviceId: string) => {
    try {
      // 這裡實作完整的設備註冊流程
      // 1. 驗證設備ID
      // 2. 建立設備連接
      // 3. 更新設備狀態
      // 4. 寫入資料庫
      console.log("Registering device:", {
        ...pendingDeviceData,
        location: selectedLocation,
        deviceId,
        status: "active",
      });

      // 重置所有狀態
      setIsPairingModalOpen(false);
      setPendingDeviceData(null);
      setSelectedLocation(null);

      // 可以在這裡加入成功提示
    } catch (error) {
      // 處理錯誤情況
      console.error("Device registration failed:", error);
      // 可以在這裡加入錯誤提示
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "powerBank":
        return <PowerBank />;
      case "energyManager":
        return <EnergyManager />;
      case "members":
        return <MemberManager />;
      case "ems":
        return <SettingsManager />;
      case "devices":
        return (
          <>
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg">路易莎咖啡(台中1店)</h2>
                <button
                  onClick={handleAddDevice}
                  className="flex items-center gap-1 px-3 py-2 bg-[#B38B5F] text-white rounded-lg hover:bg-[#8B6A47] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增設備</span>
                </button>
              </div>
            </div>

            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === "year" && <YearRangeSelector startYear={startYear} endYear={endYear} onRangeChange={handleRangeChange} />}

            <UsageGraph data={getFilteredData()} timeUnit={activeTab} />

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl">
                  {activeTab === "year" && "2023年"}
                  {activeTab === "month" && "12月"}
                  {activeTab === "day" && "31日"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">3000元</span>
                  <FileText className="text-[#B38B5F]" />
                </div>
              </div>

              <div className="space-y-4">
                <SmartSocket floor="1F" revenue={1000} status="rented" onClick={() => {}} />
                <SmartSocket floor="2F" revenue={1000} status="reserved" onClick={() => {}} />
                <SmartSocket floor="3F" revenue={500} status="disconnected" onClick={() => {}} />
                <SmartSocket floor="4F" revenue={500} status="error" onClick={() => {}} />
              </div>
            </div>

            {/* 新增設備的 Modal */}
            <DeviceModal isOpen={isDeviceModalOpen} onClose={() => setIsDeviceModalOpen(false)} device={null} onSubmit={handleDeviceSubmit} />

            {/* 設備綁定的 Modal */}
            <DeviceBindingModal
              isOpen={isBindingModalOpen}
              onClose={() => {
                setIsBindingModalOpen(false);
                setPendingDeviceData(null);
              }}
              onConfirm={handleBindingConfirm}
              availableLocations={availableLocations}
            />

            {/* 設備配對的 Modal */}
            <DevicePairingModal
              isOpen={isPairingModalOpen}
              onClose={() => {
                setIsPairingModalOpen(false);
                setPendingDeviceData(null);
                setSelectedLocation(null);
              }}
              onPairingComplete={handlePairingComplete}
            />
          </>
        );
      default:
        return <div className="flex-1 bg-gray-50">{/* 空白頁面 */}</div>;
    }
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-white">
        {activePage !== "ems" && (
          <Header
            title={activePage === "powerBank" ? "共享充電寶" : activePage === "energyManager" ? "節能管家" : activePage === "members" ? "成員管理" : "設備管理"}
            onBack={() => setActivePage("ems")}
          />
        )}

        {renderContent()}

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
          {[
            { name: "成員管理", icon: Users, page: "members" as const },
            { name: "設備管理", icon: MonitorSmartphone, page: "devices" as const },
            { name: "節能管家", icon: Zap, page: "energyManager" as const },
            { name: "共享充電寶", icon: Battery, page: "powerBank" as const },
            { name: "設定", icon: Settings, page: "ems" as const },
          ].map(({ name, icon: Icon, page }) => (
            <button
              key={name}
              className={`flex flex-col items-center p-2 ${activePage === page ? "text-[#B38B5F]" : "text-gray-600"}`}
              onClick={() => setActivePage(page)}
            >
              <Icon className={`w-6 h-6 mb-1 ${activePage === page ? "text-[#B38B5F]" : "text-gray-600"}`} />
              <span className={`text-xs ${activePage === page ? "text-[#B38B5F]" : "text-gray-600"}`}>{name}</span>
            </button>
          ))}
        </nav>
      </div>
    </SettingsProvider>
  );
}

export default App;
