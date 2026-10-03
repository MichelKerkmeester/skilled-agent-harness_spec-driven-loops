```js
function evalExpr(expr) {
  if (typeof expr !== 'string') return null;

  const raw = [];
  for (let i = 0; i < expr.length; ) {
    const ch = expr[i];
    if (ch === ' ') {
      i += 1;
    } else if (ch >= '0' && ch <= '9') {
      let j = i + 1;
      while (j < expr.length && expr[j] >= '0' && expr[j] <= '9') j += 1;
      raw.push({ type: 'num', text: expr.slice(i, j) });
      i = j;
    } else if ('+-*/()'.indexOf(ch) !== -1) {
      raw.push({ type: 'sym', text: ch });
      i += 1;
    } else {
      return null;
    }
  }
  if (raw.length === 0) return null;

  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, u: 3 };
  const output = [];
  const operators = [];
  let previous = null;

  for (const token of raw) {
    if (token.type === 'num') {
      output.push(token);
      previous = token;
      continue;
    }
    const symbol = token.text;
    if (symbol === '(') {
      operators.push('(');
    } else if (symbol === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push({ type: 'op', text: operators.pop() });
      }
      if (operators.length === 0) return null;
      operators.pop();
    } else if (symbol === '-' && (previous === null || previous.type === 'sym')) {
      operators.push('u');
    } else {
      while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[symbol]) {
        output.push({ type: 'op', text: operators.pop() });
      }
      operators.push(symbol);
    }
    previous = token;
  }

  while (operators.length > 0) {
    const operator = operators.pop();
    if (operator === '(') return null;
    output.push({ type: 'op', text: operator });
  }

  const stack = [];
  for (const token of output) {
    if (token.type === 'num') {
      stack.push(Number(token.text));
      continue;
    }
    if (token.text === 'u') {
      if (stack.length < 1) return null;
      stack.push(-stack.pop());
      continue;
    }
    if (stack.length < 2) return null;
    const right = stack.pop();
    const left = stack.pop();
    if (token.text === '+') {
      stack.push(left + right);
    } else if (token.text === '-') {
      stack.push(left - right);
    } else if (token.text === '*') {
      stack.push(left * right);
    } else {
      if (right === 0) return null;
      stack.push(Math.trunc(left / right));
    }
  }

  return stack.length === 1 ? stack[0] : null;
}
```
