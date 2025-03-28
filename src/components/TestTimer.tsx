
import React, { useMemo } from "react";
import { useTest } from "@/contexts/TestContext";
import { Clock } from "lucide-react";

const TestTimer: React.FC = () => {
  const { state } = useTest();

  // Format seconds into HH:MM:SS
  const formattedTime = useMemo(() => {
    const hours = Math.floor(state.timeRemaining / 3600);
    const minutes = Math.floor((state.timeRemaining % 3600) / 60);
    const seconds = state.timeRemaining % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [state.timeRemaining]);

  // Determine timer color based on time remaining
  const timerColor = useMemo(() => {
    if (state.timeRemaining <= 300) return "text-test-red"; // 5 min or less
    if (state.timeRemaining <= 900) return "text-test-yellow"; // 15 min or less
    return "text-test-blue";
  }, [state.timeRemaining]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-full shadow-md px-4 py-2 flex items-center gap-2 border border-gray-200">
      <Clock className={`h-4 w-4 ${timerColor}`} />
      <span className={`font-mono font-bold ${timerColor}`}>{formattedTime}</span>
    </div>
  );
};

export default TestTimer;
