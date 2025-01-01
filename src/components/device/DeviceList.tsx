import { useState } from "react";
import { Activity, Zap, MapPin, Calendar, Wrench, AlertTriangle, Edit2, Trash2, Timer } from "lucide-react";
import type { Device } from "./DeviceManager";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface DeviceListProps {
  devices: Device[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

export default function DeviceList({ devices, onEdit, onDelete }: DeviceListProps) {
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  //   const getTypeText = (type: "socket" | "sensor" | "controller") => {
  //     switch (type) {
  //       case "socket":
  //         return "智慧插座";
  //       case "sensor":
  //         return "感測器";
  //       case "controller":
  //         return "控制器";
  //       default:
  //         return "未知";
  //     }
  //   };

  const getTypeIcon = (type: "socket" | "sensor" | "controller") => {
    switch (type) {
      case "socket":
        return <Zap className="w-4 h-4" />;
      case "sensor":
        return <Activity className="w-4 h-4" />;
      case "controller":
        return <Wrench className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: "active" | "inactive" | "maintenance") => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "inactive":
        return "text-gray-600 bg-gray-50";
      case "maintenance":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: "active" | "inactive" | "maintenance") => {
    switch (status) {
      case "active":
        return "運作中";
      case "inactive":
        return "停用";
      case "maintenance":
        return "維護中";
      default:
        return "未知";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <div className="grid gap-4">
        {devices.map(device => (
          <div key={device.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* 設備圖示 */}
                <div className={`w-12 h-12 ${getStatusColor(device.status)} rounded-lg flex items-center justify-center`}>{getTypeIcon(device.type)}</div>

                {/* 基本資訊 */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{device.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(device.status)}`}>{getStatusText(device.status)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{device.location}</span>
                  </div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(device)} className="p-2 text-gray-400 hover:text-[#B38B5F] hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceToDelete(device)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 詳細資訊 */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>安裝日期：{formatDate(device.installDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Zap className="w-4 h-4" />
                <span>用電量：{device.powerUsage} kW</span>
              </div>
            </div>

            {/* 維護資訊 */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Timer className="w-3 h-3" />
                <span>上次維護：{formatDate(device.lastMaintenance)}</span>
              </div>
              {new Date(device.nextMaintenance) <= new Date() && (
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>需要維護</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 刪除確認對話框 */}
      {deviceToDelete && (
        <DeleteConfirmModal
          isOpen={!!deviceToDelete}
          onClose={() => setDeviceToDelete(null)}
          onConfirm={() => {
            onDelete(deviceToDelete);
            setDeviceToDelete(null);
          }}
          device={deviceToDelete}
        />
      )}
    </>
  );
}
