export type QuizAnswer = {
  id: string;
  label: string;
  description?: string;
  nextStepId: string;
};

type QuizStepBase = {
  id: string;
  prompt: string;
  eyebrow?: string;
  note?: string;
};

export type QuizQuestionStep = QuizStepBase & {
  kind: "question";
  answers: QuizAnswer[];
};

export type QuizResultStep = QuizStepBase & {
  kind: "result";
  endingStyle: "tell" | "dont-tell" | "depends" | "chaos";
};

export type QuizStep = QuizQuestionStep | QuizResultStep;

export type QuizSelection = {
  stepId: string;
  answerId: string;
};
