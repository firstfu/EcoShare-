export interface Member {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: "admin" | "manager" | "user";
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberCreate {
  username: string;
  password: string;
  email: string;
  phone?: string;
}

export interface MemberUpdate {
  email?: string;
  phone?: string;
}

export interface MemberResponse {
  data: Member[];
  total: number;
}

export interface PasswordChange {
  old_password: string;
  new_password: string;
}
