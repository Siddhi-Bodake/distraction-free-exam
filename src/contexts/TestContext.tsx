import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type QuestionStatus = "unanswered" | "answered" | "review";

export interface MCQQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: number;
}

export interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  testCases: Array<{ input: string; output: string }>;
  sampleSolution?: string;
}

export interface TestState {
  testType: "mcq" | "coding" | null;
  isFullScreen: boolean;
  timeRemaining: number;
  tabSwitchCount: number;
  currentQuestionIndex: number;
  mcqAnswers: Record<number, number | null>;
  mcqQuestions: MCQQuestion[];
  mcqStatus: Record<number, QuestionStatus>;
  codingQuestions: CodingQuestion[];
  currentCode: string;
  testResults: Record<string, boolean>;
  isSubmitting: boolean;
  isTestActive: boolean;
}

interface TestContextType {
  state: TestState;
  startTest: (testType: "mcq" | "coding") => void;
  endTest: () => void;
  goToQuestion: (index: number) => void;
  answerMCQ: (questionId: number, optionIndex: number) => void;
  markForReview: (questionId: number) => void;
  updateCode: (code: string) => void;
  runTests: () => void;
  submitTest: () => void;
  handleTabSwitch: () => void;
  handleFullScreenChange: (isFullScreen: boolean) => void;
}

const initialState: TestState = {
  testType: null,
  isFullScreen: false,
  timeRemaining: 3600,
  tabSwitchCount: 0,
  currentQuestionIndex: 0,
  mcqAnswers: {},
  mcqQuestions: [],
  mcqStatus: {},
  codingQuestions: [],
  currentCode: "",
  testResults: {},
  isSubmitting: false,
  isTestActive: false,
};

const sampleMCQQuestions: MCQQuestion[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
  },
  {
    id: 2,
    text: "Which of the following is NOT a JavaScript framework?",
    options: ["React", "Angular", "Vue", "Jakarta"],
  },
  {
    id: 3,
    text: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Method Language",
      "Hyperlink Text Management Logic",
    ],
  },
  {
    id: 4,
    text: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
  },
  {
    id: 5,
    text: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
  },
];

const sampleCodingQuestions: CodingQuestion[] = [
  {
    id: 1,
    title: "Two Sum",
    description: 
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\n" +
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n" +
      "Example:\n" +
      "Input: nums = [2,7,11,15], target = 9\n" +
      "Output: [0,1]\n" +
      "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" }
    ],
  }
];

const defaultCode = `function twoSum(nums, target) {
  // Write your solution here
  
}`;

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TestState>({
    ...initialState,
    mcqQuestions: sampleMCQQuestions,
    mcqStatus: sampleMCQQuestions.reduce((acc, q) => {
      acc[q.id] = "unanswered";
      return acc;
    }, {} as Record<number, QuestionStatus>),
    codingQuestions: sampleCodingQuestions,
    currentCode: defaultCode,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state.isTestActive && state.timeRemaining > 0) {
      timer = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (state.timeRemaining <= 0 && state.isTestActive) {
      endTest();
      toast.error("Time's up! Your test has been submitted automatically.");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isTestActive, state.timeRemaining]);

  const startTest = (testType: "mcq" | "coding") => {
    setState((prev) => ({
      ...prev,
      testType,
      isTestActive: true,
      isFullScreen: true,
      currentQuestionIndex: 0,
      currentCode: testType === "coding" ? defaultCode : prev.currentCode,
    }));
  };

  const endTest = () => {
    setState((prev) => ({
      ...prev,
      isTestActive: false,
      isFullScreen: false,
    }));
    
    if (state.isTestActive) {
      navigate("/submitted");
    }
  };

  const goToQuestion = (index: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  };

  const answerMCQ = (questionId: number, optionIndex: number) => {
    setState((prev) => ({
      ...prev,
      mcqAnswers: {
        ...prev.mcqAnswers,
        [questionId]: optionIndex,
      },
      mcqStatus: {
        ...prev.mcqStatus,
        [questionId]: "answered",
      },
    }));
  };

  const markForReview = (questionId: number) => {
    setState((prev) => ({
      ...prev,
      mcqStatus: {
        ...prev.mcqStatus,
        [questionId]: prev.mcqStatus[questionId] === "review" ? "unanswered" : "review",
      },
    }));
  };

  const updateCode = (code: string) => {
    setState((prev) => ({
      ...prev,
      currentCode: code,
    }));
  };

  const runTests = () => {
    const results = state.codingQuestions[state.currentQuestionIndex].testCases.reduce(
      (acc, _, index) => {
        acc[`test${index + 1}`] = Math.random() > 0.5;
        return acc;
      },
      {} as Record<string, boolean>
    );

    setState((prev) => ({
      ...prev,
      testResults: results,
    }));

    const passedCount = Object.values(results).filter(Boolean).length;
    const totalTests = Object.values(results).length;
    
    toast.info(`${passedCount} of ${totalTests} tests passed!`, {
      duration: 3000,
    });
  };

  const submitTest = () => {
    setState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    setTimeout(() => {
      toast.success("Test submitted successfully!", {
        duration: 2000,
      });

      endTest();
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }, 1500);
  };

  const handleTabSwitch = () => {
    const newCount = state.tabSwitchCount + 1;
    
    setState((prev) => ({
      ...prev,
      tabSwitchCount: newCount,
    }));

    if (newCount <= 2) {
      toast.warning(`Warning ${newCount}/3: Switching tabs is not allowed during the test.`, {
        duration: 4000,
      });
    } else {
      toast.error("You have been warned 3 times. The test will now end.", {
        duration: 5000,
      });
      setTimeout(() => {
        endTest();
      }, 2000);
    }
  };

  const handleFullScreenChange = (isFullScreen: boolean) => {
    setState((prev) => ({
      ...prev,
      isFullScreen,
    }));
    
    if (!isFullScreen && state.isTestActive) {
      toast.warning("Please remain in full-screen mode during the test.", {
        duration: 3000,
      });
    }
  };

  return (
    <TestContext.Provider
      value={{
        state,
        startTest,
        endTest,
        goToQuestion,
        answerMCQ,
        markForReview,
        updateCode,
        runTests,
        submitTest,
        handleTabSwitch,
        handleFullScreenChange,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
};
