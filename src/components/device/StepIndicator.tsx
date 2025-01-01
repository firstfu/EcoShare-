import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.title} className="flex-1 relative">
            {/* 連接線 */}
            {index < steps.length - 1 && <div className={`absolute top-4 left-1/2 w-full h-0.5 ${index < currentStep ? "bg-[#B38B5F]" : "bg-gray-200"}`} />}

            {/* 步驟圓圈 */}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? "bg-[#B38B5F] text-white"
                    : index === currentStep
                    ? "bg-[#B38B5F] bg-opacity-10 border-2 border-[#B38B5F] text-[#B38B5F]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${index <= currentStep ? "text-[#B38B5F]" : "text-gray-400"}`}>{step.title}</div>
                <div className={`text-xs ${index <= currentStep ? "text-gray-600" : "text-gray-400"}`}>{step.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
