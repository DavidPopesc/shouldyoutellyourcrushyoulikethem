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
        <div className="creator-credit">
          <a href="https://ko-fi.com/s/be6f167cf6" rel="noreferrer" target="_blank">
            want the original flowchart? tiny magical link right here
          </a>
          <a href="https://www.youtube.com/@oddlyspecificcrystal" rel="noreferrer" target="_blank">
            go lurk on crystal&apos;s channel
          </a>
          <a href="https://www.youtube.com/watch?v=hpwyjcd3Ioc" rel="noreferrer" target="_blank">
            watch the exact video that started all this
          </a>
        </div>
      </section>
    </main>
  );
}
