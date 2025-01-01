import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export default function Header({ title, onBack }: HeaderProps) {
  return (
    <header className="bg-[#B38B5F] px-4 py-3 flex items-center text-white">
      <button onClick={onBack} className="p-1">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-xl font-medium flex-1 text-center mr-8">{title}</h1>
    </header>
  )
}