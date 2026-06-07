import { QuizSelection } from "@/lib/quiz-types";

export function encodeSharePath(selections: QuizSelection[]) {
  return encodeURIComponent(JSON.stringify(selections));
}

export function decodeSharePath(raw: string) {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as QuizSelection[];

    if (!Array.isArray(parsed)) {
      return null;
    }

    for (const item of parsed) {
      if (!item || typeof item.stepId !== "string" || typeof item.answerId !== "string") {
        return null;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}
