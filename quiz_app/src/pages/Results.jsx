import { Link } from "react-router-dom";

export default function Results({ result, onRestart }) {
  if (!result) {
    return (
      <div className="container">
        <div className="card">
          No results to show. <Link to="/quiz">Start Quiz</Link>
        </div>
      </div>
    );
  }

  const { score, total, answers } = result;
  const best = Number(localStorage.getItem("bestScore") || 0);

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>
          You scored {score}/{total}
        </h2>
        <div className="meta" style={{ marginBottom: 12 }}>
          Personal best: {best}/{total}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className="btn btn-primary" onClick={onRestart}>
            Restart Quiz
          </button>
          <Link to="/quiz" className="btn btn-outline">
            Try Again
          </Link>
        </div>

        <div className="row" style={{ flexDirection: "column", gap: 12 }}>
          {answers.map((a, i) => {
            const isSkipped = a.selected === null;
            const isCorrect = a.isCorrect;
            return (
              <div
                key={a.id}
                className="card"
                style={{
                  padding: 12,
                  borderLeft: isSkipped
                    ? "6px solid #fbbf24"  // yellow for skipped
                    : isCorrect
                    ? "6px solid #22c55e"  // green for correct
                    : "6px solid #ef4444", // red for incorrect
                  background: isSkipped
                    ? "rgba(251, 191, 36, 0.1)"
                    : "#fff",
                }}
              >
                <div className="meta">
                  Q{i + 1}: {a.prompt}
                  {isSkipped && (
                    <span style={{ marginLeft: 8, color: "#b45309" }}>
                      (Skipped)
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 8 }}>
                  <div>
                    Correct: <strong style={{ color: "#22c55e" }}>{a.correct}</strong>
                  </div>
                  <div>
                    Your answer:{" "}
                    <strong
                      style={{
                        color: isSkipped
                          ? "#b45309"
                          : isCorrect
                          ? "#22c55e"
                          : "#ef4444",
                      }}
                    >
                      {a.selected ?? "—"}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
