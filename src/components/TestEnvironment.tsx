
import React, { useEffect, useRef } from "react";
import { useTest } from "@/contexts/TestContext";
import McqTest from "./McqTest";
import CodingTest from "./CodingTest";
import TestTimer from "./TestTimer";
import FullScreenWarning from "./FullScreenWarning";
import { AlertCircle } from "lucide-react";

interface TestEnvironmentProps {
  initialTestType?: "mcq" | "coding";
}

const TestEnvironment: React.FC<TestEnvironmentProps> = ({ initialTestType }) => {
  const { state, handleTabSwitch, handleFullScreenChange, startTest, endTest } = useTest();
  const hasMounted = useRef(false);

  // Handle full screen
  const requestFullScreen = () => {
    document.documentElement.requestFullscreen().catch((e) => {
      console.error("Error attempting to enable full-screen mode:", e);
    });
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((e) => {
        console.error("Error attempting to exit full-screen mode:", e);
      });
    }
  };

  // Handle full screen change events
  useEffect(() => {
    const handleFullScreenEvent = () => {
      handleFullScreenChange(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenEvent);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenEvent);
    };
  }, [handleFullScreenChange]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" && 
        state.isTestActive && 
        hasMounted.current
      ) {
        handleTabSwitch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    hasMounted.current = true;

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleTabSwitch, state.isTestActive]);

  // Handle window blur event (another way to detect tab switching)
  useEffect(() => {
    const handleWindowBlur = () => {
      if (state.isTestActive && hasMounted.current) {
        handleTabSwitch();
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [handleTabSwitch, state.isTestActive]);

  // Handle beforeunload event (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.isTestActive) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [state.isTestActive]);

  // Auto start test if initialTestType is provided
  useEffect(() => {
    if (initialTestType && !state.isTestActive) {
      startTest(initialTestType);
    }
  }, [initialTestType, startTest, state.isTestActive]);

  // Request full screen on mount
  useEffect(() => {
    if (state.isTestActive && !state.isFullScreen) {
      requestFullScreen();
    }
    
    return () => {
      if (document.fullscreenElement) {
        exitFullScreen();
      }
    };
  }, [state.isTestActive, state.isFullScreen]);

  // If not in full screen and test is active, show warning
  if (state.isTestActive && !state.isFullScreen) {
    return <FullScreenWarning requestFullScreen={requestFullScreen} />;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {state.isTestActive && (
        <>
          <TestTimer />
          
          {/* Tab switch warning counter */}
          {state.tabSwitchCount > 0 && (
            <div className="fixed top-4 left-4 z-50 bg-white rounded-full shadow-md px-4 py-2 flex items-center gap-2 border border-test-red/50">
              <AlertCircle className="h-4 w-4 text-test-red" />
              <span className="font-mono font-bold text-test-red">
                Warning: {state.tabSwitchCount}/3 tab switches
              </span>
            </div>
          )}
        </>
      )}
      
      <div className="flex-grow overflow-hidden">
        {state.testType === "mcq" && <McqTest />}
        {state.testType === "coding" && <CodingTest />}
      </div>
    </div>
  );
};

export default TestEnvironment;
