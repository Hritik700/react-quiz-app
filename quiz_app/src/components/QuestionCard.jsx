export default function QuestionCard({ q, selected, locked, onSelect }) {
  return (
    <div className="card" role="group" aria-label="question">
      <div className="meta">
        {q.category} • {q.difficulty}
      </div>
      <h2 style={{ marginTop: 4, marginBottom: 12 }}>{q.prompt}</h2>
      <div className="row">
        {q.options.map((opt) => {
          const isSelected = selected === opt;
          let extra = "";
          if (locked && isSelected) {
            extra = opt === q.correct ? " correct" : " incorrect";
          }
          return (
            <button
              key={opt}
              className={`option${isSelected ? " selected" : ""}${extra}`}
              onClick={() => !locked && onSelect(opt)}
              aria-pressed={isSelected}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
