"use client";

import { useMemo, useState, useTransition } from "react";

import { encodeSharePath } from "@/lib/quiz-share";
import { QuizSelection, QuizStep } from "@/lib/quiz-types";

type QuizShellProps = {
  initialStep: QuizStep;
};

export function QuizShell({ initialStep }: QuizShellProps) {
  const [history, setHistory] = useState<QuizStep[]>([initialStep]);
  const [selections, setSelections] = useState<QuizSelection[]>([]);
  const [isPending, startTransition] = useTransition();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const current = history[history.length - 1];
  const shareUrl = useMemo(() => {
    if (current.kind !== "result" || typeof window === "undefined") {
      return null;
    }

    const token = encodeSharePath(selections);
    return `${window.location.origin}/share?path=${token}`;
  }, [current.kind, selections]);

  const handleAnswer = (answerId: string) => {
    if (current.kind !== "question") {
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: current.id, answerId })
      });

      if (!response.ok) {
        return;
      }

      const nextStep = (await response.json()) as QuizStep;
      setSelections((existing) => [...existing, { stepId: current.id, answerId }]);
      setHistory((existing) => [...existing, nextStep]);
      setShareStatus(null);
    });
  };

  const restart = () => {
    setHistory([initialStep]);
    setSelections([]);
    setShareStatus(null);
  };

  const goBack = () => {
    setHistory((existing) => (existing.length > 1 ? existing.slice(0, -1) : existing));
    setSelections((existing) => (existing.length > 0 ? existing.slice(0, -1) : existing));
    setShareStatus(null);
  };

  const shareResult = async () => {
    if (!shareUrl || current.kind !== "result") {
      return;
    }

    const text = `i asked this random website if i should tell my crush i liked them and this is what it told me`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "should you tell your crush you like them?",
          text,
          url: shareUrl
        });
        setShareStatus("shared");
        return;
      } catch {
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}: ${shareUrl}`);
      setShareStatus("copied link");
    } catch {
      setShareStatus("couldnt copy link");
    }
  };

  return (
    <div className="quiz-card">
      <div className="quiz-toolbar">
        <button className="nav-button" disabled={history.length === 1 || isPending} onClick={goBack} type="button">
          ← wait no go back
        </button>
        <button className="nav-button" disabled={history.length === 1} onClick={restart} type="button">
          wipe the slate
        </button>
      </div>

      {current.eyebrow ? <p className="quiz-kicker">{current.eyebrow}</p> : null}
      <h2 className="quiz-prompt">{current.prompt}</h2>
      {current.note ? <p className="quiz-note">{current.note}</p> : null}

      {current.kind === "question" ? (
        <div className="answer-grid">
          {current.answers.map((answer, index) => (
            <button
              key={answer.id}
              className="answer-button"
              data-tilt={index % 4}
              disabled={isPending}
              onClick={() => handleAnswer(answer.id)}
              type="button"
            >
              {answer.label}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className={`result-card result-${current.endingStyle}`}>
            <p className="result-label">the council has spoken</p>
            <p className="result-copy">{current.prompt}</p>
            {current.note ? <p className="result-note">{current.note}</p> : null}
          </div>

          <div className="share-card">
            <p className="share-copy">send this to the friend who is about to hear all of this anyway</p>
            <div className="share-actions">
              <button className="share-button" onClick={shareResult} type="button">
                spread the news
              </button>
              {shareUrl ? (
                <a className="share-link" href={shareUrl}>
                  inspect the mess
                </a>
              ) : null}
            </div>
            {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
          </div>
        </>
      )}

      <div className="quiz-footer">
        <p>{isPending ? "consulting the notebook margins..." : `you are ${history.length} bad decisions deep`}</p>
      </div>
    </div>
  );
}
