import { useState } from "react";
import { X, Plus, Trash2, Edit2, Save, Building2 } from "lucide-react";

interface Location {
  floor: string;
  spots: {
    name: string;
    status: "available" | "occupied";
  }[];
}

interface LocationManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onSave: (locations: Location[]) => void;
}

export default function LocationManageModal({ isOpen, onClose, locations, onSave }: LocationManageModalProps) {
  const [editedLocations, setEditedLocations] = useState<Location[]>(
    locations || [
      {
        floor: "1F",
        spots: [
          { name: "櫃台區", status: "occupied" },
          { name: "用餐區", status: "occupied" },
          { name: "戶外座位", status: "available" },
          { name: "包廂1", status: "available" },
          { name: "包廂2", status: "occupied" },
        ],
      },
      {
        floor: "2F",
        spots: [
          { name: "會議室", status: "available" },
          { name: "休息區", status: "available" },
          { name: "辦公區", status: "occupied" },
        ],
      },
      {
        floor: "B1",
        spots: [
          { name: "倉庫", status: "available" },
          { name: "儲藏室", status: "occupied" },
          { name: "員工休息室", status: "available" },
        ],
      },
    ]
  );
  const [editingSpot, setEditingSpot] = useState<{ floor: string; name: string; newName: string } | null>(null);
  const [newSpotName, setNewSpotName] = useState("");
  const [newFloor, setNewFloor] = useState("");

  if (!isOpen) return null;

  const handleAddFloor = () => {
    if (!newFloor.trim()) return;
    setEditedLocations(prev => [...prev, { floor: newFloor, spots: [] }]);
    setNewFloor("");
  };

  const handleDeleteFloor = (floor: string) => {
    setEditedLocations(prev => prev.filter(loc => loc.floor !== floor));
  };

  const handleAddSpot = (floor: string) => {
    if (!newSpotName.trim()) return;
    setEditedLocations(prev =>
      prev.map(loc =>
        loc.floor === floor
          ? {
              ...loc,
              spots: [...loc.spots, { name: newSpotName, status: "available" }],
            }
          : loc
      )
    );
    setNewSpotName("");
  };

  const handleDeleteSpot = (floor: string, spotName: string) => {
    setEditedLocations(prev =>
      prev.map(loc =>
        loc.floor === floor
          ? {
              ...loc,
              spots: loc.spots.filter(spot => spot.name !== spotName),
            }
          : loc
      )
    );
  };

  const handleEditSpot = () => {
    if (!editingSpot) return;
    setEditedLocations(prev =>
      prev.map(loc =>
        loc.floor === editingSpot.floor
          ? {
              ...loc,
              spots: loc.spots.map(spot => (spot.name === editingSpot.name ? { ...spot, name: editingSpot.newName } : spot)),
            }
          : loc
      )
    );
    setEditingSpot(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full h-full md:rounded-2xl md:w-[560px] md:h-[720px] flex flex-col shadow-2xl animate-in fade-in duration-300">
        {/* 標題區 */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="p-2 bg-[#B38B5F]/10 text-[#B38B5F] rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-medium text-gray-800">場地位置管理</h3>
          <button onClick={onClose} className="p-2 ml-auto -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 主要內容區 */}
        <div className="flex-1 overflow-y-auto px-4">
          {editedLocations.map(location => (
            <div key={location.floor} className="mt-4 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-4 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#B38B5F] bg-opacity-10 text-[#B38B5F] text-sm font-medium rounded-lg">{location.floor}</span>
                  <div className="text-sm text-gray-500">{location.spots.length} 個位置</div>
                </div>
                <button
                  onClick={() => handleDeleteFloor(location.floor)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="新增位置名稱..."
                    value={newSpotName}
                    onChange={e => setNewSpotName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddSpot(location.floor)}
                    className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#B38B5F]/20 focus:border-[#B38B5F]/30 transition-all"
                  />
                  <button onClick={() => handleAddSpot(location.floor)} className="px-3 py-2 text-[#B38B5F] hover:bg-[#B38B5F]/5 rounded-xl transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {location.spots.map(spot => (
                    <div key={spot.name} className="group flex items-center px-3 py-2 hover:bg-gray-50/80 rounded-lg transition-colors">
                      {editingSpot?.floor === location.floor && editingSpot?.name === spot.name ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingSpot.newName}
                            onChange={e => setEditingSpot({ ...editingSpot, newName: e.target.value })}
                            onKeyDown={e => e.key === "Enter" && handleEditSpot()}
                            className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg
                                     focus:outline-none focus:ring-2 focus:ring-[#B38B5F]/20 focus:border-[#B38B5F]/30"
                            autoFocus
                          />
                          <button onClick={handleEditSpot} className="p-1.5 text-[#B38B5F] hover:bg-[#B38B5F]/10 rounded-lg transition-colors">
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 text-sm text-gray-600">{spot.name}</div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingSpot({ floor: location.floor, name: spot.name, newName: spot.name })}
                              className="p-1.5 text-gray-400 hover:text-[#B38B5F] hover:bg-[#B38B5F]/10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSpot(location.floor, spot.name)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部操作區 */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/30">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="輸入樓層名稱（如：1F、B1）..."
              value={newFloor}
              onChange={e => setNewFloor(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddFloor()}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#B38B5F]/20 focus:border-[#B38B5F]/30 transition-all"
            />
            <button onClick={handleAddFloor} className="px-4 py-2.5 text-[#B38B5F] hover:bg-[#B38B5F]/5 rounded-xl transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl
                       hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                onSave(editedLocations);
                onClose();
              }}
              className="flex-1 py-2.5 text-white bg-[#B38B5F] rounded-xl
                       hover:bg-[#8B6A47] shadow-sm hover:shadow-md transition-all"
            >
              儲存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
