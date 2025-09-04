export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalizeLocal(q) {
  return {
    id: q.id,
    prompt: q.question,
    options: shuffle(q.options),
    correct: q.correct,
  };
}
