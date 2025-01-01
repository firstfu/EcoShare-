import { useState } from "react";
import { Plus } from "lucide-react";
import type { Member } from "../../types/member";
import { useCreateMember, useUpdateProfile } from "../../hooks/useMember";
import MemberList from "./MemberList";
import MemberForm from "./MemberForm";

export default function MemberManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();

  const createMember = useCreateMember();
  const updateMember = useUpdateProfile();

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMember(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">成員管理</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#B38B5F] hover:bg-[#96714D] rounded-md"
        >
          <Plus className="w-4 h-4" />
          新增成員
        </button>
      </div>

      <MemberList onEdit={handleEdit} />

      {/* 成員表單對話框 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{selectedMember ? "編輯成員" : "新增成員"}</h2>
            <MemberForm
              member={selectedMember}
              onSubmit={async data => {
                if (selectedMember) {
                  await updateMember.mutateAsync(data);
                } else {
                  await createMember.mutateAsync(data);
                }
                handleCloseForm();
              }}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
