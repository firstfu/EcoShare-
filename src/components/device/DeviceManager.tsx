import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import DeviceList from "./DeviceList";
import DeviceModal from "./DeviceModal";

type DeviceStatus = "active" | "inactive" | "maintenance";
type DeviceType = "socket" | "sensor" | "controller";

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  powerUsage: number;
  installDate: string;
}

// 模擬設備數據
const mockDevices: Device[] = [
  {
    id: "1",
    name: "智慧插座 A-101",
    type: "socket",
    location: "1F-前廳",
    status: "active",
    lastMaintenance: "2024-01-01",
    nextMaintenance: "2024-04-01",
    powerUsage: 120,
    installDate: "2023-06-15",
  },
  {
    id: "2",
    name: "溫度感測器 B-201",
    type: "sensor",
    location: "2F-會議室",
    status: "maintenance",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    powerUsage: 5,
    installDate: "2023-07-01",
  },
  {
    id: "3",
    name: "電源控制器 C-301",
    type: "controller",
    location: "3F-辦公區",
    status: "active",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10",
    powerUsage: 50,
    installDate: "2023-08-01",
  },
];

export type { Device, DeviceStatus, DeviceType };

export default function DeviceManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>(mockDevices);

  const filteredDevices = devices.filter(
    device =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDevice = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleDeleteDevice = (device: Device) => {
    setDevices(prev => prev.filter(d => d.id !== device.id));
  };

  const handleSubmit = (formData: Omit<Device, "id">) => {
    if (selectedDevice) {
      // 更新現有設備
      setDevices(prev =>
        prev.map(device =>
          device.id === selectedDevice.id
            ? {
                ...device,
                ...formData,
              }
            : device
        )
      );
    } else {
      // 新增設備
      const newDevice: Device = {
        id: Date.now().toString(),
        ...formData,
      };
      setDevices(prev => [...prev, newDevice]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* 頂部搜尋和操作區 */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">設備管理</h2>
          <button
            onClick={handleAddDevice}
            className="flex items-center gap-1 px-3 py-2 bg-[#B38B5F] text-white rounded-lg hover:bg-[#8B6A47] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新增設備</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋設備名稱、位置或類型..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">篩選</span>
          </button>
        </div>
      </div>

      {/* 設備列表 */}
      <div className="p-4">
        <DeviceList devices={filteredDevices} onEdit={handleEditDevice} onDelete={handleDeleteDevice} />
      </div>

      {/* 新增/編輯設備彈窗 */}
      <DeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} device={selectedDevice} onSubmit={handleSubmit} />
    </div>
  );
}
