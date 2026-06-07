import { QuizShell } from "@/components/quiz-shell";
import { getInitialStep } from "@/lib/quiz-flow";

export default function Home() {
  const initialStep = getInitialStep();

  return (
    <main className="page">
      <header className="masthead">
        <p className="masthead-kicker">should you tell your crush you like them?</p>
        <h1>a flowchart for poor decisions</h1>
      </header>

      <section className="board">
        <div className="doodle doodle-arrow" aria-hidden="true" />
        <div className="doodle doodle-heart" aria-hidden="true" />
        <QuizShell initialStep={initialStep} />
        <p className="creator-credit">
          original flowchart by{" "}
          <a href="https://www.youtube.com/watch?v=hpwyjcd3Ioc" rel="noreferrer" target="_blank">
            888_Crystal
          </a>
        </p>
      </section>
    </main>
  );
}
