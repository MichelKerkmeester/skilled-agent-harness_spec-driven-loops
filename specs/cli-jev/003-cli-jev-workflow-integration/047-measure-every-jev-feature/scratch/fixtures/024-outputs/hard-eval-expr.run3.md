```js
const { tokenizeExpression } = require('../../lib/expression/tokenizer');

function evalExpr(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = tokenizeExpression(expr);
  if (tokens === null || tokens.length === 0) return null;

  let pos = 0;
  let failed = false;

  function peek() {
    return pos < tokens.length ? tokens[pos] : null;
  }

  function next() {
    return tokens[pos++];
  }

  function parseExpression() {
    let value = parseTerm();
    while (!failed && (peek() === '+' || peek() === '-')) {
      const op = next();
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm() {
    let value = parseFactor();
    while (!failed && (peek() === '*' || peek() === '/')) {
      const op = next();
      const rhs = parseFactor();
      if (op === '*') {
        value = value * rhs;
      } else if (rhs === 0) {
        failed = true;
        return null;
      } else {
        value = Math.trunc(value / rhs);
      }
    }
    return value;
  }

  function parseFactor() {
    if (peek() === '-') {
      next();
      return -parseFactor();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();
    if (token === '(') {
      next();
      const value = parseExpression();
      if (failed || peek() !== ')') {
        failed = true;
        return null;
      }
      next();
      return value;
    }
    if (token !== null && /^\d+$/.test(token)) {
      next();
      return Number(token);
    }
    failed = true;
    return null;
  }

  const result = parseExpression();
  if (failed || pos !== tokens.length) return null;
  return result;
}
```

Verify with `node scripts/bench/check-expr.cjs --strict`.
