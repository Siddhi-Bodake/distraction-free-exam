
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TestProvider } from "@/contexts/TestContext";
import TestEnvironment from "@/components/TestEnvironment";
import { toast } from "sonner";

const Test: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const testType = searchParams.get("type") as "mcq" | "coding" | null;

  useEffect(() => {
    // Validate test type
    if (!testType || (testType !== "mcq" && testType !== "coding")) {
      toast.error("Invalid test type. Redirecting to home page.");
      navigate("/");
      return;
    }

    // Handle beforeunload event to warn about closing/refreshing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave the test? Your progress will be lost.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [testType, navigate]);

  if (!testType) {
    return <div>Loading...</div>;
  }

  return (
    <TestProvider>
      <div className="min-h-screen bg-white">
        <TestEnvironment initialTestType={testType} />
      </div>
    </TestProvider>
  );
};

export default Test;
