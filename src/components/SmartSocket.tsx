import { Plug, Clock, WifiOff, AlertTriangle } from "lucide-react";

interface SmartSocketProps {
  floor: string;
  revenue: number;
  status: "rented" | "reserved" | "disconnected" | "error";
  onClick?: () => void;
}

export default function SmartSocket({ floor, revenue, status, onClick }: SmartSocketProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "rented":
        return "設備已被租借";
      case "reserved":
        return "設備已被預訂";
      case "disconnected":
        return "設備離線";
      case "error":
        return "設備故障";
      default:
        return "";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "rented":
        return "bg-green-500";
      case "reserved":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "rented":
        return <Plug className="w-5 h-5" />;
      case "reserved":
        return <Clock className="w-5 h-5" />;
      case "disconnected":
        return <WifiOff className="w-5 h-5" />;
      case "error":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getSocketImage = (status: string) => {
    switch (status) {
      case "rented":
        return "https://i.imgur.com/1234567.jpg";
      case "reserved":
        return "https://i.imgur.com/2345678.jpg";
      case "disconnected":
        return "https://i.imgur.com/3456789.jpg";
      case "error":
        return "https://i.imgur.com/4567890.jpg";
      default:
        return "https://i.imgur.com/1234567.jpg";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b" onClick={onClick}>
      <div className="flex gap-4">
        <div className={`w-16 h-16 rounded-lg shadow-sm flex items-center justify-center ${getStatusClass(status)} bg-opacity-10`}>{getStatusIcon(status)}</div>
        <div>
          <h3 className="font-medium">計電型智慧插座({floor})</h3>
          <button className={`${getStatusClass(status)} text-white text-sm px-3 py-1 rounded-full mt-2 flex items-center gap-1`}>
            {getStatusIcon(status)}
            <span>{getStatusText(status)}</span>
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-gray-600">累計收益</div>
        <div className="font-medium">{revenue}元</div>
      </div>
    </div>
  );
}
