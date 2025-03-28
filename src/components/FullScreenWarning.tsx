
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTest } from "@/contexts/TestContext";

interface FullScreenWarningProps {
  requestFullScreen: () => void;
}

const FullScreenWarning: React.FC<FullScreenWarningProps> = ({ requestFullScreen }) => {
  const { endTest } = useTest();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Alert className="max-w-md bg-white">
        <AlertTitle className="text-test-red text-xl font-bold">
          Full Screen Required
        </AlertTitle>
        <AlertDescription className="mt-4 space-y-4">
          <p>
            This test must be taken in full-screen mode. Please click the button below to continue in full-screen.
          </p>
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              className="border-test-red text-test-red hover:bg-test-red hover:text-white"
              onClick={endTest}
            >
              Exit Test
            </Button>
            <Button
              className="bg-test-blue hover:bg-test-blue/90 text-white"
              onClick={requestFullScreen}
            >
              Enter Full Screen
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FullScreenWarning;
