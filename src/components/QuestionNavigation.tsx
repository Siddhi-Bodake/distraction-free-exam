
import React from "react";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QuestionNavigation: React.FC = () => {
  const { state, goToQuestion } = useTest();

  // Map status to styling
  const getStatusClass = (questionId: number) => {
    const status = state.mcqStatus[questionId];
    
    switch(status) {
      case "answered":
        return "bg-test-green text-white hover:bg-test-green/90";
      case "review":
        return "bg-test-yellow text-black hover:bg-test-yellow/90";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Questions</h3>
      <div className="grid grid-cols-3 gap-2">
        {state.mcqQuestions.map((question, index) => (
          <Button
            key={question.id}
            onClick={() => goToQuestion(index)}
            className={cn(
              "h-10 w-10 p-0",
              getStatusClass(question.id),
              state.currentQuestionIndex === index && "ring-2 ring-test-blue"
            )}
            variant="ghost"
          >
            {index + 1}
          </Button>
        ))}
      </div>
      
      <div className="pt-4 space-y-2">
        <h4 className="font-medium text-sm">Legend:</h4>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-gray-100 rounded-sm"></div>
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-test-green rounded-sm"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-test-yellow rounded-sm"></div>
            <span>Marked</span>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <div className="text-sm font-medium mb-1">Statistics</div>
        <div className="flex justify-between text-sm">
          <div>
            Answered: {Object.values(state.mcqStatus).filter(s => s === "answered").length}
          </div>
          <div>
            Unanswered: {Object.values(state.mcqStatus).filter(s => s === "unanswered").length}
          </div>
          <div>
            Marked: {Object.values(state.mcqStatus).filter(s => s === "review").length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
