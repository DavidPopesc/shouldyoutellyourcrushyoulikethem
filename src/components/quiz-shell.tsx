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

      {current.kind === "question" ? (
        <>
          {current.eyebrow ? <p className="quiz-kicker">{current.eyebrow}</p> : null}
          <h2 className="quiz-prompt">{current.prompt}</h2>
          {current.note ? <p className="quiz-note">{current.note}</p> : null}
        </>
      ) : null}

      {current.kind === "question" ? (
        <>
          {current.id === "friends-ex-moral" ? <CadysLawCard /> : null}

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
                <span className="answer-label">{answer.label}</span>
                {answer.description ? <span className="answer-description">{answer.description}</span> : null}
              </button>
            ))}
          </div>
        </>
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

function CadysLawCard() {
  const [datedMonths, setDatedMonths] = useState("12");
  const [friendshipLevel, setFriendshipLevel] = useState("6");
  const [monthsSinceBreakup, setMonthsSinceBreakup] = useState("6");

  const d = Number(datedMonths);
  const f = Number(friendshipLevel);
  const g = Number(monthsSinceBreakup);
  const recommendedWait = Number.isFinite(d) && Number.isFinite(f) && Number.isFinite(g) && g > 0 ? (d * f) / g : null;
  const verdict =
    recommendedWait === null
      ? "put some numbers in first"
      : recommendedWait > g
        ? "danger zone. maybe sit down and breathe for a bit."
        : "might be survivable. proceed with extreme caution."
  ;

  return (
    <div className="calc-card">
      <p className="calc-kicker">cady&apos;s law</p>
      <p className="calc-copy">a deeply unscientific calculator for whether asking out your friend&apos;s ex is about to ruin the group chat.</p>

      <div className="calc-grid">
        <label className="calc-field">
          <span>D</span>
          <small>months they dated</small>
          <input onChange={(event) => setDatedMonths(event.target.value)} type="number" value={datedMonths} />
        </label>

        <label className="calc-field">
          <span>F</span>
          <small>friendship level with your friend, 1-10</small>
          <input onChange={(event) => setFriendshipLevel(event.target.value)} type="number" value={friendshipLevel} />
        </label>

        <label className="calc-field">
          <span>G</span>
          <small>months since they broke up</small>
          <input onChange={(event) => setMonthsSinceBreakup(event.target.value)} type="number" value={monthsSinceBreakup} />
        </label>
      </div>

      <div className="calc-result">
        <p>
          recommended wait: <strong>{recommendedWait === null ? "?" : `${recommendedWait.toFixed(1)} months`}</strong>
        </p>
        <p>{verdict}</p>
      </div>
    </div>
  );
}
