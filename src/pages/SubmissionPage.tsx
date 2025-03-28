
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const SubmissionPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="bg-test-green text-white pb-6 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-2">
              <Check className="h-8 w-8 text-test-green" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Test Submitted</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="mb-4">
            Your test has been successfully submitted for evaluation.
          </p>
          <p className="text-gray-600 text-sm">
            You will receive your results after the evaluation is complete.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Link to="/">
            <Button className="bg-test-blue hover:bg-test-blue/90 text-white">
              Return to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmissionPage;
