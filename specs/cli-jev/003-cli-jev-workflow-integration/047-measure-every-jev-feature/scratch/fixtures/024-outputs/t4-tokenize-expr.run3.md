```js
function tokenize(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ' || ch === '\t') {
      i += 1;
    } else if (ch >= '0' && ch <= '9') {
      let j = i;
      let dots = 0;
      while (j < expr.length && ((expr[j] >= '0' && expr[j] <= '9') || expr[j] === '.')) {
        if (expr[j] === '.') dots += 1;
        j += 1;
      }
      if (dots > 1) return null;
      tokens.push({ type: 'num', value: expr.slice(i, j) });
      i = j;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch });
      i += 1;
    } else if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i += 1;
    } else {
      return null;
    }
  }

  return tokens;
}
```
