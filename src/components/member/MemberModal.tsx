import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Member } from "./MemberManager";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onSubmit: (formData: Omit<Member, "id" | "status" | "lastActive">) => void;
}

type FormData = {
  name: string;
  role: "admin" | "manager" | "user";
  email: string;
  phone: string;
  department: string;
};

export default function MemberModal({ isOpen, onClose, member, onSubmit }: MemberModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    role: "user",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
        department: member.department,
      });
    } else {
      setFormData({
        name: "",
        role: "user",
        email: "",
        phone: "",
        department: "",
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* 標題列 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{member ? "編輯成員" : "新增成員"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 角色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
              <select
                value={formData.role}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    role: e.target.value as FormData["role"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
              >
                <option value="user">一般用戶</option>
                <option value="manager">主管</option>
                <option value="admin">管理員</option>
              </select>
            </div>

            {/* 電子郵件 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 電話 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>

            {/* 部門 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">部門</label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B5F] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 按鈕列 */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              取消
            </button>
            <button type="submit" className="px-4 py-2 text-white bg-[#B38B5F] rounded-lg hover:bg-[#8B6A47] transition-colors">
              {member ? "更新" : "新增"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
