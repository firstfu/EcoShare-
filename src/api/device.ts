import axios from "axios";

export interface DeviceCreateDTO {
  name: string;
  type: "socket" | "sensor" | "controller";
  location: string;
  status: "active" | "inactive" | "maintenance";
  lastMaintenance: string;
  nextMaintenance: string;
  powerUsage: number;
  installDate: string;
}

export interface Device extends DeviceCreateDTO {
  id: string;
}

export interface DeviceUpdateDTO extends Partial<DeviceCreateDTO> {}

const API_BASE_URL = "http://localhost:8000/api/v1/devices";

export const deviceApi = {
  // 獲取設備列表
  list: async (): Promise<Device[]> => {
    const response = await axios.get<Device[]>(API_BASE_URL);
    return response.data;
  },

  // 創建新設備
  create: async (data: DeviceCreateDTO): Promise<Device> => {
    const response = await axios.post<Device>(API_BASE_URL, data);
    return response.data;
  },

  // 更新設備
  update: async (id: string, data: DeviceUpdateDTO): Promise<Device> => {
    const response = await axios.put<Device>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  // 刪除設備
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  // 獲取單個設備
  getById: async (id: string): Promise<Device> => {
    const response = await axios.get<Device>(`${API_BASE_URL}/${id}`);
    return response.data;
  },
};
