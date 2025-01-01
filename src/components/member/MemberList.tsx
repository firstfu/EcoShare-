import { useState } from "react";
import { Mail, Phone, Edit2, Trash2 } from "lucide-react";
import type { Member } from "../../types/member";
import { useMembers, useDeleteMember } from "../../hooks/useMember";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface MemberListProps {
  onEdit: (member: Member) => void;
}

export default function MemberList({ onEdit }: MemberListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const {
    data: membersData,
    isLoading,
    isError,
    error,
  } = useMembers({
    skip: (page - 1) * pageSize,
    limit: pageSize,
  });

  console.log("=====================");
  console.log(membersData);
  console.log("=====================");

  const deleteMutation = useDeleteMember();
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const handleDelete = async (member: Member) => {
    try {
      await deleteMutation.mutateAsync(member.id);
      setMemberToDelete(null);
    } catch (error) {
      console.error("刪除成員失敗:", error);
    }
  };

  const getRoleText = (role: Member["role"]) => {
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

  const getRoleColor = (role: Member["role"]) => {
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

  if (isLoading) {
    return <div className="flex justify-center p-8">載入中...</div>;
  }

  if (isError) {
    return <div className="flex justify-center p-8 text-red-600">載入失敗: {(error as Error)?.message || "未知錯誤"}</div>;
  }

  if (!membersData?.data || !Array.isArray(membersData.data)) {
    return <div className="flex justify-center p-8">沒有成員資料</div>;
  }

  return (
    <>
      <div className="grid gap-4">
        {membersData.data.map((member: Member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* 頭像 */}
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">{member.username.slice(0, 1)}</span>
                </div>

                {/* 基本資訊 */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{member.username}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(member.role)}`}>{getRoleText(member.role)}</span>
                    <span className={`flex items-center gap-1 text-sm ${member.is_active ? "text-green-600" : "text-gray-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {member.is_active ? "在線" : "離線"}
                    </span>
                  </div>
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
              {member.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分頁控制 */}
      {membersData && membersData.total > pageSize && (
        <div className="mt-4 flex justify-center">
          <nav className="flex gap-2">
            {Array.from({ length: Math.ceil(membersData.total / pageSize) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`px-3 py-1 rounded ${page === index + 1 ? "bg-[#B38B5F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* 刪除確認對話框 */}
      <DeleteConfirmModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => memberToDelete && handleDelete(memberToDelete)}
        title="刪除成員"
        message={`確定要刪除成員 ${memberToDelete?.username} 嗎？此操作無法復原。`}
      />
    </>
  );
}
