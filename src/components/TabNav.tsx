interface TabNavProps {
  activeTab: "year" | "month" | "day";
  onTabChange: (tab: "year" | "month" | "day") => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex w-full border-b">
      {["year", "month", "day"].map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab as "year" | "month" | "day")}
          className={`flex-1 py-3 text-center ${activeTab === tab ? "bg-[#B38B5F] text-white" : "text-gray-600"}`}
        >
          {tab === "year" && "每年"}
          {tab === "month" && "每月"}
          {tab === "day" && "每日"}
        </button>
      ))}
    </div>
  );
}
