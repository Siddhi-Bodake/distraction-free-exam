
import React, { useEffect, useRef } from "react";
import { useTest } from "@/contexts/TestContext";
import McqTest from "./McqTest";
import CodingTest from "./CodingTest";
import TestTimer from "./TestTimer";
import FullScreenWarning from "./FullScreenWarning";

const TestEnvironment: React.FC = () => {
  const { state, handleTabSwitch, handleFullScreenChange, endTest } = useTest();
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
  }, [state.isTestActive]);

  // If not in full screen and test is active, show warning
  if (state.isTestActive && !state.isFullScreen) {
    return <FullScreenWarning requestFullScreen={requestFullScreen} />;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {state.isTestActive && <TestTimer />}
      
      <div className="flex-grow overflow-hidden">
        {state.testType === "mcq" && <McqTest />}
        {state.testType === "coding" && <CodingTest />}
      </div>
    </div>
  );
};

export default TestEnvironment;
