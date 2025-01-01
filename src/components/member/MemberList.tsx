import { useState } from "react";
import { Mail, Phone, MoreVertical, Edit2, Trash2, Clock } from "lucide-react";
import type { Member } from "./MemberManager";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export default function MemberList({ members, onEdit, onDelete }: MemberListProps) {
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const getRoleText = (role: "admin" | "manager" | "user") => {
    switch (role) {
      case "admin":
        return "管理員";
      case "manager":
        return "主管";
      case "user":
        return "一般用戶";
      default:
        return "未知";
    }
  };

  const getRoleColor = (role: "admin" | "manager" | "user") => {
    switch (role) {
      case "admin":
        return "text-purple-600 bg-purple-50";
      case "manager":
        return "text-blue-600 bg-blue-50";
      case "user":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: "active" | "inactive") => {
    return status === "active" ? "text-green-600" : "text-gray-400";
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="grid gap-4">
        {members.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* 頭像 */}
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">{member.name.slice(0, 1)}</span>
                </div>

                {/* 基本資訊 */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(member.role)}`}>{getRoleText(member.role)}</span>
                    <span className={`flex items-center gap-1 text-sm ${getStatusColor(member.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {member.status === "active" ? "在線" : "離線"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{member.department}</div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(member)} className="p-2 text-gray-400 hover:text-[#B38B5F] hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMemberToDelete(member)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4" />
                <span>{member.phone}</span>
              </div>
            </div>

            {/* 最後活動時間 */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>最後活動：{formatLastActive(member.lastActive)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 刪除確認對話框 */}
      {memberToDelete && (
        <DeleteConfirmModal
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={() => onDelete(memberToDelete)}
          member={memberToDelete}
        />
      )}
    </>
  );
}
