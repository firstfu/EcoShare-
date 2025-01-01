import { useState } from "react";
import type { Member, MemberCreate, MemberUpdate } from "../../types/member";

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: MemberCreate | MemberUpdate) => Promise<void>;
  onCancel: () => void;
}

export default function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState({
    username: member?.username || "",
    email: member?.email || "",
    phone: member?.phone || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 驗證表單
    if (!member && formData.password !== formData.confirmPassword) {
      setError("密碼不一致");
      return;
    }

    try {
      if (member) {
        // 編輯模式
        const updateData: MemberUpdate = {
          email: formData.email !== member.email ? formData.email : undefined,
          phone: formData.phone !== member.phone ? formData.phone : undefined,
        };
        await onSubmit(updateData);
      } else {
        // 新增模式
        const createData: MemberCreate = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        };
        await onSubmit(createData);
      }
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">用戶名</label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
          disabled={!!member}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B38B5F] disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B38B5F]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B38B5F]"
        />
      </div>

      {!member && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B38B5F]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">確認密碼</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B38B5F]"
              required
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
          取消
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#B38B5F] hover:bg-[#96714D] rounded-md">
          {member ? "更新" : "創建"}
        </button>
      </div>
    </form>
  );
}
