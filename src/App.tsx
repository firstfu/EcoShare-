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
import DeviceManager from "./components/device/DeviceManager";
import { FileText, Users, MonitorSmartphone, Zap, Battery, Settings } from "lucide-react";

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
  const [activePage, setActivePage] = useState<"ems" | "powerBank" | "energyManager" | "members" | "devices">("ems");

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

  const renderContent = () => {
    switch (activePage) {
      case "powerBank":
        return <PowerBank />;
      case "energyManager":
        return <EnergyManager />;
      case "members":
        return <MemberManager />;
      case "devices":
        return <DeviceManager />;
      default:
        return (
          <>
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg">路易莎咖啡(台中1店)</h2>
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
                <SmartSocket floor="1F" revenue={1000} status="rented" />
                <SmartSocket floor="2F" revenue={1000} status="reserved" />
                <SmartSocket floor="3F" revenue={500} status="disconnected" />
                <SmartSocket floor="4F" revenue={500} status="error" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        title={
          activePage === "ems"
            ? "EMS能源監控管理系統"
            : activePage === "powerBank"
            ? "共享充電寶"
            : activePage === "energyManager"
            ? "節能管家"
            : activePage === "members"
            ? "成員管理"
            : "設備管理"
        }
        onBack={activePage !== "ems" ? () => setActivePage("ems") : undefined}
      />

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
  );
}

export default App;
