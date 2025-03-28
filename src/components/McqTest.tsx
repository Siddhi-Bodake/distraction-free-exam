
import React, { useMemo } from "react";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import QuestionNavigation from "./QuestionNavigation";
import { Check, ArrowLeft, ArrowRight, Flag } from "lucide-react";

const McqTest: React.FC = () => {
  const { state, goToQuestion, answerMCQ, markForReview, submitTest } = useTest();

  const currentQuestion = useMemo(() => {
    return state.mcqQuestions[state.currentQuestionIndex];
  }, [state.mcqQuestions, state.currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.mcqQuestions.length - 1) {
      goToQuestion(state.currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      goToQuestion(state.currentQuestionIndex - 1);
    }
  };

  const handleMarkForReview = () => {
    markForReview(currentQuestion.id);
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 p-4 border-r overflow-y-auto">
        <QuestionNavigation />
      </div>
      <div className="w-3/4 p-6">
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-test-lightBlue pb-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle>
                Question {state.currentQuestionIndex + 1} of {state.mcqQuestions.length}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${
                  state.mcqStatus[currentQuestion.id] === "review"
                    ? "bg-test-yellow text-black border-test-yellow"
                    : "border-test-gray text-test-gray"
                }`}
                onClick={handleMarkForReview}
              >
                <Flag className="h-4 w-4" />
                {state.mcqStatus[currentQuestion.id] === "review" ? "Marked" : "Mark for Review"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow py-6">
            <div className="mb-6 text-lg font-medium">{currentQuestion.text}</div>
            <RadioGroup
              value={
                state.mcqAnswers[currentQuestion.id]?.toString() || ""
              }
              onValueChange={(value) =>
                answerMCQ(currentQuestion.id, parseInt(value))
              }
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    state.mcqAnswers[currentQuestion.id] === index
                      ? "border-test-green bg-test-green/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="text-test-green"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option}
                  </Label>
                  {state.mcqAnswers[currentQuestion.id] === index && (
                    <Check className="h-5 w-5 text-test-green" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between bg-gray-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={state.currentQuestionIndex === 0}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={submitTest}
              className="bg-test-blue hover:bg-test-blue/90 text-white"
            >
              Submit Test
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={state.currentQuestionIndex === state.mcqQuestions.length - 1}
              className="flex items-center gap-1"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default McqTest;
