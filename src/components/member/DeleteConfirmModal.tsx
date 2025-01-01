import { AlertTriangle } from "lucide-react";
import type { Member } from "./MemberManager";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  member: Member;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, member }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-medium">確認刪除</h3>
        </div>

        <p className="text-gray-600 mb-6">
          確定要刪除成員「<span className="font-medium">{member.name}</span>」嗎？此操作無法復原。
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
}
