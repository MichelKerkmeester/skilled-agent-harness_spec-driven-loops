```js
function normalizePath(path) {
  const isAbsolute = path.startsWith('/');
  const segments = path.split('/');
  const stack = [];

  for (const segment of segments) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop();
      } else if (!isAbsolute) {
        stack.push('..');
      }
      continue;
    }
    stack.push(segment);
  }

  if (isAbsolute) return '/' + stack.join('/');
  return stack.length === 0 ? '.' : stack.join('/');
}
```
