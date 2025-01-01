import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import MemberList from "./MemberList";
import MemberModal from "./MemberModal";

type Role = "admin" | "manager" | "user";
type Status = "active" | "inactive";

interface Member {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  department: string;
  status: Status;
  lastActive: string;
}

// 模擬成員數據
const mockMembers: Member[] = [
  {
    id: "1",
    name: "王小明",
    role: "admin",
    email: "wang@example.com",
    phone: "0912-345-678",
    department: "管理部",
    status: "active",
    lastActive: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    name: "李小華",
    role: "manager",
    email: "lee@example.com",
    phone: "0923-456-789",
    department: "營運部",
    status: "active",
    lastActive: "2024-01-15T09:15:00",
  },
  {
    id: "3",
    name: "張小美",
    role: "user",
    email: "chang@example.com",
    phone: "0934-567-890",
    department: "業務部",
    status: "inactive",
    lastActive: "2024-01-14T16:45:00",
  },
];

export type { Member, Role, Status };

export default function MemberManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>(mockMembers);

  const filteredMembers = members.filter(
    member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (member: Member) => {
    setMembers(prev => prev.filter(m => m.id !== member.id));
  };

  const handleSubmit = (formData: Omit<Member, "id" | "status" | "lastActive">) => {
    if (selectedMember) {
      // 更新現有成員
      setMembers(prev =>
        prev.map(member =>
          member.id === selectedMember.id
            ? {
                ...member,
                ...formData,
              }
            : member
        )
      );
    } else {
      // 新增成員
      const newMember: Member = {
        id: Date.now().toString(),
        status: "active",
        lastActive: new Date().toISOString(),
        ...formData,
      };
      setMembers(prev => [...prev, newMember]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* 頂部搜尋和操作區 */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">成員管理</h2>
          <button
            onClick={handleAddMember}
            className="flex items-center gap-1 px-3 py-2 bg-[#B38B5F] text-white rounded-lg hover:bg-[#8B6A47] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新增成員</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋成員姓名、信箱或部門..."
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

      {/* 成員列表 */}
      <div className="p-4">
        <MemberList members={filteredMembers} onEdit={handleEditMember} onDelete={handleDeleteMember} />
      </div>

      {/* 新增/編輯成員彈窗 */}
      <MemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} member={selectedMember} onSubmit={handleSubmit} />
    </div>
  );
}
