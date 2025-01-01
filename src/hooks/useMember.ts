import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "../services/memberService";
import type { MemberCreate, MemberUpdate, PasswordChange } from "../types/member";

// 查詢 keys
const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...memberKeys.lists(), filters] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: number) => [...memberKeys.details(), id] as const,
};

// 獲取成員列表
export function useMembers(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => memberService.getMembers(params),
  });
}

// 獲取當前用戶資料
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => memberService.getCurrentUser(),
  });
}

// 創建成員
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreate) => memberService.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries(memberKeys.lists());
    },
  });
}

// 更新用戶資料
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberUpdate) => memberService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
  });
}

// 修改密碼
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChange) => memberService.changePassword(data),
  });
}

// 刪除成員
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => memberService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries(memberKeys.lists());
    },
  });
}
