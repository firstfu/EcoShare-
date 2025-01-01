import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Settings, DEFAULT_SETTINGS } from "../types/settings";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateGeneralSettings: (settings: Partial<Settings["general"]>) => void;
  updateDeviceSettings: (settings: Partial<Settings["device"]>) => void;
  updateNotificationSettings: (settings: Partial<Settings["notification"]>) => void;
  updateThemeSettings: (settings: Partial<Settings["theme"]>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem("app_settings");
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const updateGeneralSettings = (generalSettings: Partial<Settings["general"]>) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        ...generalSettings,
      },
    }));
  };

  const updateDeviceSettings = (deviceSettings: Partial<Settings["device"]>) => {
    setSettings(prev => ({
      ...prev,
      device: {
        ...prev.device,
        ...deviceSettings,
      },
    }));
  };

  const updateNotificationSettings = (notificationSettings: Partial<Settings["notification"]>) => {
    setSettings(prev => ({
      ...prev,
      notification: {
        ...prev.notification,
        ...notificationSettings,
      },
    }));
  };

  const updateThemeSettings = (themeSettings: Partial<Settings["theme"]>) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...themeSettings,
      },
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateGeneralSettings,
        updateDeviceSettings,
        updateNotificationSettings,
        updateThemeSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
