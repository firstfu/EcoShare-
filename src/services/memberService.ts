import axios from "axios";
import type { Member, MemberCreate, MemberUpdate, MemberResponse, PasswordChange } from "../types/member";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// 請求攔截器：添加認證標頭
// axios.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// // 回應攔截器：處理錯誤
// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       console.log("=====================");
//       console.log("回應攔截器：處理錯誤:", error);
//       console.log("=====================");

//       // 處理未授權：清除 token 並重新導向到登入頁面
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export const memberService = {
  // 獲取成員列表
  async getMembers(params: { skip?: number; limit?: number } = {}): Promise<MemberResponse> {
    const { data } = await axios.get<Member[]>(`${API_BASE_URL}/users`, { params });
    return {
      data,
      total: data.length,
    };
  },

  // 獲取當前用戶資料
  async getCurrentUser(): Promise<Member> {
    const { data } = await axios.get<Member>(`${API_BASE_URL}/profile`);
    return data;
  },

  // 更新用戶資料
  async updateProfile(updateData: MemberUpdate): Promise<Member> {
    const { data } = await axios.put<Member>(`${API_BASE_URL}/profile`, updateData);
    return data;
  },

  // 創建新成員
  async createMember(memberData: MemberCreate): Promise<Member> {
    const { data } = await axios.post<Member>(`${API_BASE_URL}/register`, memberData);
    return data;
  },

  // 修改密碼
  async changePassword(passwordData: PasswordChange): Promise<{ message: string }> {
    const { data } = await axios.post<{ message: string }>(`${API_BASE_URL}/change-password`, passwordData);
    return data;
  },

  // 刪除成員
  async deleteMember(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  },
};
