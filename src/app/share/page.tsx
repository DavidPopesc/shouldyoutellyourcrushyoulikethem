import Link from "next/link";

import { decodeSharePath } from "@/lib/quiz-share";
import { getPathRecap } from "@/lib/quiz-flow";

type SharePageProps = {
  searchParams: Promise<{
    path?: string;
  }>;
};

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  const rawPath = params.path;
  const selections = rawPath ? decodeSharePath(rawPath) : null;
  const recap = selections ? getPathRecap(selections) : null;

  return (
    <main className="page">
      <header className="masthead">
        <p className="masthead-kicker">should you tell your crush you like them?</p>
        <h1>behold: somebody else's situation</h1>
      </header>

      <section className="board">
        <div className="doodle doodle-arrow" aria-hidden="true" />
        <div className="doodle doodle-heart" aria-hidden="true" />

        <div className="quiz-card recap-card">
          {recap && recap.finalStep.kind === "result" ? (
            <>
              <div className={`result-card result-${recap.finalStep.endingStyle}`}>
                <p className="result-label">the website has rendered a verdict</p>
                <p className="result-copy">{recap.finalStep.prompt}</p>
                {recap.finalStep.note ? <p className="result-note">{recap.finalStep.note}</p> : null}
              </div>

              <div className="recap-list">
                {recap.entries.map((entry, index) => (
                  <article className="recap-item" key={`${entry.question.id}-${entry.answerId}-${index}`}>
                    <p className="recap-step">messy step {index + 1}</p>
                    <p className="recap-question">{entry.question.prompt}</p>
                    <p className="recap-answer">→ {entry.answerLabel}</p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="invalid-share">
              <p className="result-copy">this share link is busted. tragic</p>
            </div>
          )}

          <div className="recap-footer">
            <p>now go see if you should ask your crush out buddy boy</p>
            <Link className="share-link" href="/">
              go make your own mess
            </Link>
          </div>
        </div>

        <div className="creator-credit">
          <a href="https://ko-fi.com/s/be6f167cf6" rel="noreferrer" target="_blank">
            want the original flowchart? tiny magical link right here =D
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
