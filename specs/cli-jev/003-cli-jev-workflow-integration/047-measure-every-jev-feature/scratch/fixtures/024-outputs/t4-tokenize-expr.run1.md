```js
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ' || ch === '\t') {
      i += 1;
      continue;
    }
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let j = i;
      let dotCount = 0;
      while (j < expr.length && ((expr[j] >= '0' && expr[j] <= '9') || expr[j] === '.')) {
        if (expr[j] === '.') dotCount += 1;
        j += 1;
      }
      const literal = expr.slice(i, j);
      if (dotCount > 1) return null;
      if (literal === '.') return null;
      tokens.push({ type: 'num', value: literal });
      i = j;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i += 1;
      continue;
    }
    return null;
  }
  return tokens;
}
```
