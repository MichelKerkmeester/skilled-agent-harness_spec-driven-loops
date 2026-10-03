```js
function tokenize(expr) {
  const tokens = [];
  let index = 0;

  while (index < expr.length) {
    const ch = expr[index];
    if (ch === ' ' || ch === '\t') {
      index += 1;
    } else if ((ch >= '0' && ch <= '9') || ch === '.') {
      let end = index;
      let dots = 0;
      while (end < expr.length && ((expr[end] >= '0' && expr[end] <= '9') || expr[end] === '.')) {
        if (expr[end] === '.') dots += 1;
        end += 1;
      }
      const text = expr.slice(index, end);
      if (dots > 1 || text === '.') return null;
      tokens.push({ type: 'num', value: text });
      index = end;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch });
      index += 1;
    } else if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      index += 1;
    } else {
      return null;
    }
  }

  return tokens;
}
```
