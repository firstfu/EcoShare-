export interface Settings {
  general: {
    language: "zh-TW" | "en";
    timeZone: string;
    dateFormat: string;
  };
  device: {
    defaultMaintenanceInterval: number; // 天數
    powerUsageThreshold: number;
    autoShutdownEnabled: boolean;
  };
  notification: {
    email: boolean;
    push: boolean;
    maintenance: boolean;
    powerAlert: boolean;
  };
  theme: {
    mode: "light" | "dark";
    primaryColor: string;
    fontSize: "small" | "medium" | "large";
  };
}

export const DEFAULT_SETTINGS: Settings = {
  general: {
    language: "zh-TW",
    timeZone: "Asia/Taipei",
    dateFormat: "YYYY-MM-DD",
  },
  device: {
    defaultMaintenanceInterval: 90,
    powerUsageThreshold: 1000,
    autoShutdownEnabled: false,
  },
  notification: {
    email: true,
    push: true,
    maintenance: true,
    powerAlert: true,
  },
  theme: {
    mode: "light",
    primaryColor: "#B38B5F",
    fontSize: "medium",
  },
};
