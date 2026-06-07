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
      </section>
    </main>
  );
}
