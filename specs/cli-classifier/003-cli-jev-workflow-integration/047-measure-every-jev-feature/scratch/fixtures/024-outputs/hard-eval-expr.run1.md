```js
function evalExpr(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ') {
      i += 1;
    } else if (ch >= '0' && ch <= '9') {
      let j = i;
      while (j < expr.length && expr[j] >= '0' && expr[j] <= '9') j += 1;
      tokens.push(expr.slice(i, j));
      i = j;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '(' || ch === ')') {
      tokens.push(ch);
      i += 1;
    } else {
      return null;
    }
  }
  if (tokens.length === 0) return null;

  let pos = 0;
  let failed = false;

  function peek() {
    return pos < tokens.length ? tokens[pos] : null;
  }

  function parseExpr() {
    let value = parseTerm();
    while (!failed && (peek() === '+' || peek() === '-')) {
      const op = tokens[pos];
      pos += 1;
      const right = parseTerm();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  function parseTerm() {
    let value = parseFactor();
    while (!failed && (peek() === '*' || peek() === '/')) {
      const op = tokens[pos];
      pos += 1;
      const right = parseFactor();
      if (op === '*') {
        value = value * right;
      } else if (right === 0) {
        failed = true;
        return null;
      } else {
        value = Math.trunc(value / right);
      }
    }
    return value;
  }

  function parseFactor() {
    if (peek() === '-') {
      pos += 1;
      return -parseFactor();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();
    if (token === null) {
      failed = true;
      return null;
    }
    if (token === '(') {
      pos += 1;
      const inner = parseExpr();
      if (failed || peek() !== ')') {
        failed = true;
        return null;
      }
      pos += 1;
      return inner;
    }
    if (token === '+' || token === '*' || token === '/' || token === ')') {
      failed = true;
      return null;
    }
    pos += 1;
    return Number(token);
  }

  const result = parseExpr();
  if (failed || pos !== tokens.length) return null;
  return result;
}
```
