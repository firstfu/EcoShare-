import { useSettings } from "../contexts/SettingsContext";
import { Mail, Bell, Wrench, AlertTriangle } from "lucide-react";

export default function NotificationSettings() {
  const { settings, updateNotificationSettings } = useSettings();

  const NotificationToggle = ({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
    isLast = false,
  }: {
    icon: typeof Mail;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    isLast?: boolean;
  }) => (
    <div className={`p-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B38B5F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B5F]"></div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium mb-6">通知設定</h2>

      <div className="bg-white rounded-lg shadow-sm">
        {/* 郵件通知 */}
        <NotificationToggle
          icon={Mail}
          title="郵件通知"
          description="接收系統相關的郵件通知"
          checked={settings.notification.email}
          onChange={checked => updateNotificationSettings({ email: checked })}
        />

        {/* 推送通知 */}
        <NotificationToggle
          icon={Bell}
          title="推送通知"
          description="接收即時的系統推送通知"
          checked={settings.notification.push}
          onChange={checked => updateNotificationSettings({ push: checked })}
        />

        {/* 維護提醒 */}
        <NotificationToggle
          icon={Wrench}
          title="維護提醒"
          description="接收設備維護相關的提醒"
          checked={settings.notification.maintenance}
          onChange={checked => updateNotificationSettings({ maintenance: checked })}
        />

        {/* 用電警告 */}
        <NotificationToggle
          icon={AlertTriangle}
          title="用電警告"
          description="當設備用電量超過閾值時接收警告"
          checked={settings.notification.powerAlert}
          onChange={checked => updateNotificationSettings({ powerAlert: checked })}
          isLast
        />
      </div>
    </div>
  );
}
