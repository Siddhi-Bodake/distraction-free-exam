
import React, { useState } from "react";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Code, Check } from "lucide-react";

const CodingTest: React.FC = () => {
  const { state, updateCode, runTests, submitTest } = useTest();
  const [activeTab, setActiveTab] = useState<"description" | "output">("description");
  
  const currentQuestion = state.codingQuestions[state.currentQuestionIndex];

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCode(e.target.value);
  };

  const handleRunTests = () => {
    runTests();
    setActiveTab("output");
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 p-4 flex flex-col h-full">
        <Card className="flex-grow flex flex-col">
          <CardHeader className="bg-test-lightBlue pb-4">
            <CardTitle>{currentQuestion.title}</CardTitle>
          </CardHeader>
          <Tabs defaultValue="description" className="flex-grow flex flex-col">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger 
                value="description" 
                onClick={() => setActiveTab("description")}
                className={activeTab === "description" ? "bg-test-blue text-white" : ""}
              >
                <div className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  Problem
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="output" 
                onClick={() => setActiveTab("output")}
                className={activeTab === "output" ? "bg-test-blue text-white" : ""}
              >
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  Test Results
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 flex-grow overflow-y-auto">
              <div className="whitespace-pre-line">{currentQuestion.description}</div>
              
              <div className="mt-6">
                <h3 className="font-bold mb-2">Test Cases:</h3>
                <div className="space-y-2">
                  {currentQuestion.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="font-mono text-sm mb-1">
                        <strong>Input:</strong> {testCase.input}
                      </div>
                      <div className="font-mono text-sm">
                        <strong>Expected Output:</strong> {testCase.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="output" className="p-4 flex-grow overflow-y-auto">
              {Object.keys(state.testResults).length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-bold">Test Results:</h3>
                  {Object.entries(state.testResults).map(([testName, passed], index) => (
                    <div 
                      key={testName} 
                      className={`p-3 rounded-md ${passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            passed ? 'bg-green-500' : 'bg-red-500'
                          } text-white`}
                        >
                          {passed ? <Check className="w-3 h-3" /> : '✗'}
                        </div>
                        <span className="font-medium">
                          Test Case {index + 1}: {passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-mono">
                        <strong>Input:</strong> {currentQuestion.testCases[index].input}
                      </div>
                      <div className="text-sm font-mono">
                        <strong>Expected:</strong> {currentQuestion.testCases[index].output}
                      </div>
                      <div className="text-sm font-mono">
                        <strong>Result:</strong> {passed ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <div className="mb-2">No test results yet</div>
                  <div className="text-sm">Click "Run Tests" to see results</div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <div className="w-1/2 p-4 flex flex-col h-full">
        <Card className="flex-grow flex flex-col">
          <CardHeader className="bg-test-blue text-white pb-4">
            <CardTitle>Code Editor</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <textarea
              className="w-full h-full p-4 font-mono text-sm resize-none border-none focus:outline-none focus:ring-0"
              value={state.currentCode}
              onChange={handleCodeChange}
              spellCheck={false}
            />
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between bg-gray-50">
            <Button
              onClick={handleRunTests}
              className="flex items-center gap-1 bg-test-green hover:bg-test-green/90 text-white"
            >
              <Play className="h-4 w-4" /> Run Tests
            </Button>
            <Button
              onClick={submitTest}
              className="bg-test-blue hover:bg-test-blue/90 text-white"
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Submit Solution"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CodingTest;
