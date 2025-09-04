import { useState, useCallback } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Quiz from "./pages/Quiz.jsx";
import Results from "./pages/Results.jsx";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFinish = useCallback(
    (r) => {
      setResult(r);
      navigate("/results");
    },
    [navigate]
  );

  const handleRestart = useCallback(() => {
    setResult(null);
    navigate("/quiz");
    setTimeout(() => window.location.reload(), 0);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/quiz" element={<Quiz onFinish={handleFinish} />} />
      <Route
        path="/results"
        element={<Results result={result} onRestart={handleRestart} />}
      />
      <Route
        path="*"
        element={
          <div className="container">
            <div className="card">
              <h2 style={{ marginTop: 0 }}>React Quiz</h2>
              <p className="meta">
                Clean UI, scoring, results, restart, mobile-friendly.
              </p>
              <Link to="/quiz" className="btn btn-primary">
                Start Quiz
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
