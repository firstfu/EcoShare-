import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import DeviceList from "./DeviceList";
import DeviceModal from "./DeviceModal";
import { deviceApi, Device, DeviceCreateDTO } from "../../api/device";

type DeviceStatus = "active" | "inactive" | "maintenance";
type DeviceType = "socket" | "sensor" | "controller";

export type { Device, DeviceStatus, DeviceType };

export default function DeviceManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const queryClient = useQueryClient();

  // 獲取設備列表
  const { data: devices = [], isLoading }: UseQueryResult<Device[], Error> = useQuery({
    queryKey: ["devices"],
    queryFn: deviceApi.list,
  });

  // 新增設備
  const createMutation = useMutation({
    mutationFn: (data: DeviceCreateDTO) => deviceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("設備新增成功");
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`新增設備失敗: ${error.message}`);
    },
  });

  // 更新設備
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeviceCreateDTO> }) => deviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("設備更新成功");
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`更新設備失敗: ${error.message}`);
    },
  });

  // 刪除設備
  const deleteMutation = useMutation({
    mutationFn: deviceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("設備刪除成功");
    },
    onError: (error: Error) => {
      toast.error(`刪除設備失敗: ${error.message}`);
    },
  });

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
    deleteMutation.mutate(device.id);
  };

  const handleSubmit = (formData: Omit<Device, "id">) => {
    if (selectedDevice) {
      // 更新現有設備
      updateMutation.mutate({
        id: selectedDevice.id,
        data: formData,
      });
    } else {
      // 新增設備
      createMutation.mutate(formData);
    }
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B5F]"></div>
          </div>
        ) : (
          <DeviceList devices={filteredDevices} onEdit={handleEditDevice} onDelete={handleDeleteDevice} />
        )}
      </div>

      {/* 新增/編輯設備彈窗 */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        device={selectedDevice}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
