
import React from "react";
import { TestProvider } from "@/contexts/TestContext";
import TestInstructions from "@/components/TestInstructions";
import TestEnvironment from "@/components/TestEnvironment";

const Index = () => {
  return (
    <TestProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-8">
          <TestInstructions />
          <TestEnvironment />
        </main>
      </div>
    </TestProvider>
  );
};

export default Index;
