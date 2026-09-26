function generator(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state;
  };
}

const literals = [
  "false",
  "true",
  "0",
  "1",
  "-0",
  "null",
  "undefined",
  '""',
  '"value"',
  "NaN",
] as const;

/** Deterministic nested expression shared by the TS and Rust differential gates. */
export function generatedExpression(seed: number): string {
  const next = generator(seed);
  let marker = 0;
  const expression = (depth: number): string => {
    const id = marker++;
    if (depth === 0) {
      if (next() % 13 === 0) return `fail("throw-${id}")`;
      return `mark("atom-${id}", ${literals[next() % literals.length]})`;
    }
    const kind = next() % 5;
    if (kind <= 2) {
      const operator = (["&&", "||", "??"] as const)[next() % 3];
      return `(${expression(depth - 1)} ${operator} ${expression(depth - 1)})`;
    }
    if (kind === 3)
      return `(${expression(depth - 1)} ? ${expression(depth - 1)} : ${expression(depth - 1)})`;
    return `!(${expression(depth - 1)})`;
  };
  return expression(3);
}
