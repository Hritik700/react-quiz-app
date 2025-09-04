import { useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { normalizeLocal, shuffle } from "../utils";

const NUM_QUESTIONS = 10;
const TIMER_PER_Q = 30;

export default function Quiz({ onFinish }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_Q);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/questions.json");
        if (!res.ok) throw new Error("Failed to load questions");
        const json = await res.json();
        let data = json.map(normalizeLocal);

        if (data.length < NUM_QUESTIONS) {
          const extra = [];
          while (data.length + extra.length < NUM_QUESTIONS) {
            extra.push({
              ...data[(data.length + extra.length) % data.length],
              id: crypto.randomUUID(),
            });
          }
          data = shuffle([...data, ...extra]).slice(0, NUM_QUESTIONS);
        } else {
          data = shuffle(data).slice(0, NUM_QUESTIONS);
        }

        setQuestions(data);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!TIMER_PER_Q || locked || loading || error) return;

    setTimeLeft(TIMER_PER_Q);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleLock();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [idx, locked, loading, error]);

  const current = questions[idx];
  const total = questions.length;

  const progressText = useMemo(
    () => `Question ${Math.min(idx + 1, total)} of ${total}`,
    [idx, total]
  );

  function handleSelect(opt) {
    setSelected(opt);
  }

  function handleLock() {
    if (locked || !current) return;
    const chosen = selected ?? null;
    const correct = chosen === current.correct;
    const entry = {
      id: current.id,
      selected: chosen,
      correct: current.correct,
      isCorrect: !!correct,
      prompt: current.prompt,
    };
    setAnswers((a) => [...a, entry]);
    if (correct) setScore((s) => s + 1);
    setLocked(true);
  }

  function handleNext() {
    if (!locked) return;
    if (idx + 1 < total) {
      setIdx((i) => i + 1);
      setSelected(null);
      setLocked(false);
      setTimeLeft(TIMER_PER_Q);
    } else {
      const final = { score, total, answers };
      const best = Number(localStorage.getItem("bestScore") || 0);
      if (score > best) localStorage.setItem("bestScore", String(score));
      onFinish(final);
    }
  }

  function handlePrev() {
    if (idx === 0) return;
    setIdx((i) => i - 1);
  }

  function handleSkip() {
  if (locked) return;
  const entry = { 
    id: current.id, 
    selected: null, 
    correct: current.correct, 
    isCorrect: false, 
    prompt: current.prompt 
  };
  setAnswers((a) => [...a, entry]);
  setLocked(true); 
}


  if (loading)
    return (
      <div className="container">
        <div className="card">Loading questions…</div>
      </div>
    );

  if (error)
    return (
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: 8, color: "red" }}>Error: {error}</div>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!total)
    return (
      <div className="container">
        <div className="card">No questions available.</div>
      </div>
    );

  return (
    <div className="container">
      <div className="header">
        <div className="meta">{progressText}</div>
        <div className="score">
          Score: {score}/{total}
        </div>
      </div>

      <ProgressBar value={idx} max={total - 1} />

      {TIMER_PER_Q && (
        <div className="meta timer" style={{ marginTop: 8 }}>
          ⏱ Time left: {String(timeLeft).padStart(2, "0")}s
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <QuestionCard
          q={current}
          selected={selected}
          locked={locked}
          onSelect={handleSelect}
        />
      </div>

     <div className="footer">
  <button
    className="btn btn-outline"
    onClick={handlePrev}
    disabled={idx === 0}
  >
    ← Previous
  </button>

  <div style={{ display: "flex", gap: 8 }}>
    <button
      className="btn btn-primary"
      onClick={handleLock}
      disabled={locked || selected === null}
    >
      {locked ? "Locked" : "Lock Answer"}
    </button>

    <button
      className="btn btn-accent"
      onClick={handleNext}
      disabled={!locked}
    >
      {idx + 1 < total ? "Next →" : "Finish ✅"}
    </button>

    <button
      className="btn btn-outline"
      onClick={handleSkip}
      disabled={locked}
    >
      Skip ⏭
    </button>
  </div>
</div>

    </div>
  );
}
