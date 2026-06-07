import "server-only";

import { QuizAnswer, QuizQuestionStep, QuizSelection, QuizStep } from "@/lib/quiz-types";

function parseQuizFlow() {
  const raw = process.env.QUIZ_FLOW_JSON;

  if (!raw) {
    throw new Error("Missing QUIZ_FLOW_JSON environment variable");
  }

  const parsed = JSON.parse(raw) as Record<string, QuizStep>;

  if (!parsed.start || parsed.start.kind !== "question") {
    throw new Error("QUIZ_FLOW_JSON must include a valid start question");
  }

  return parsed;
}

const steps = parseQuizFlow();

export function getInitialStep() {
  return steps.start;
}

export function getStep(stepId: string) {
  return steps[stepId] ?? null;
}

export function getNextStep(stepId: string, answerId: string) {
  const current = steps[stepId];

  if (!current || current.kind !== "question") {
    return null;
  }

  const answer = current.answers.find((choice) => choice.id === answerId);
  if (!answer) {
    return null;
  }

  return steps[answer.nextStepId] ?? null;
}

export function getPathRecap(selections: QuizSelection[]) {
  const entries: Array<{
    question: QuizQuestionStep;
    answerLabel: string;
    answerId: string;
    nextStep: QuizStep;
  }> = [];

  let current = steps.start;
  if (!current || current.kind !== "question") {
    return null;
  }

  for (const selection of selections) {
    if (current.kind !== "question" || current.id !== selection.stepId) {
      return null;
    }

    const answer: QuizAnswer | undefined = current.answers.find((choice) => choice.id === selection.answerId);
    if (!answer) {
      return null;
    }

    const nextStep: QuizStep | undefined = steps[answer.nextStepId];
    if (!nextStep) {
      return null;
    }

    entries.push({
      question: current,
      answerLabel: answer.label,
      answerId: answer.id,
      nextStep
    });

    current = nextStep;
  }

  return {
    entries,
    finalStep: current
  };
}
