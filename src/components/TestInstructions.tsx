
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TestInstructions: React.FC = () => {
  const handleStartTest = (testType: "mcq" | "coding") => {
    // Create a URL with query parameters
    const testURL = `${window.location.origin}/test?type=${testType}`;
    // Open in a new tab
    window.open(testURL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container max-w-4xl py-10 animate-fade-in">
      <Card className="border-2 border-test-blue/20">
        <CardHeader className="bg-test-blue text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Exam Instructions</CardTitle>
          <CardDescription className="text-white/80">
            Please read all instructions carefully before starting
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-test-lightBlue">
            <TabsTrigger value="general">General Guidelines</TabsTrigger>
            <TabsTrigger value="mcq">MCQ Test Format</TabsTrigger>
            <TabsTrigger value="coding">Coding Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="p-6">
            <h3 className="text-lg font-bold mb-4">Important Rules</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>This is a secure, distraction-free testing environment.</li>
              <li>The test will open in a new tab and automatically enter full-screen mode.</li>
              <li>You may not exit full-screen mode during the test.</li>
              <li>Switching tabs or windows is not allowed and will be monitored.</li>
              <li>You will receive 3 warnings for rule violations before automatic termination.</li>
              <li>The timer will continue to run even if you close the browser.</li>
              <li>Ensure you have a stable internet connection before beginning.</li>
              <li>Do not refresh the page during the test.</li>
            </ul>
          </TabsContent>

          <TabsContent value="mcq" className="p-6">
            <h3 className="text-lg font-bold mb-4">MCQ Test Information</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>The test consists of multiple-choice questions with single correct answers.</li>
              <li>Use the navigation panel to move between questions.</li>
              <li>You can mark questions for review and return to them later.</li>
              <li>All questions carry equal marks.</li>
              <li>There is no negative marking for wrong answers.</li>
              <li>You can change your answers at any time before submission.</li>
            </ul>
          </TabsContent>

          <TabsContent value="coding" className="p-6">
            <h3 className="text-lg font-bold mb-4">Coding Assessment Information</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Read the problem statement carefully before writing code.</li>
              <li>You can run your code against test cases before final submission.</li>
              <li>Your code should pass all test cases for maximum points.</li>
              <li>Focus on correctness first, then optimize for performance.</li>
              <li>The editor supports JavaScript syntax.</li>
              <li>Use the console output to debug your solution.</li>
            </ul>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-between bg-gray-50 py-6 px-6 rounded-b-lg">
          <div className="space-x-4">
            <Button 
              variant="outline" 
              className="border-test-blue text-test-blue hover:bg-test-blue hover:text-white"
              onClick={() => handleStartTest("mcq")}
            >
              Start MCQ Test
            </Button>
            <Button 
              variant="outline" 
              className="border-test-blue text-test-blue hover:bg-test-blue hover:text-white"
              onClick={() => handleStartTest("coding")}
            >
              Start Coding Test
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Time Limit: 60 Minutes
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestInstructions;
