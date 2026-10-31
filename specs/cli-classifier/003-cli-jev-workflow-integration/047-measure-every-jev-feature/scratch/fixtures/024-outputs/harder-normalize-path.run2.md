```js
function normalizePath(path) {
  if (typeof path !== 'string') return null;

  const absolute = path.charAt(0) === '/';
  const parts = path.split('/');
  const resolved = [];

  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    }
    if (part === '..') {
      const top = resolved.length > 0 ? resolved[resolved.length - 1] : null;
      if (top !== null && top !== '..') {
        resolved.pop();
      } else if (!absolute) {
        resolved.push('..');
      }
      continue;
    }
    resolved.push(part);
  }

  if (absolute) {
    return '/' + resolved.join('/');
  }
  if (resolved.length === 0) {
    return '.';
  }
  return resolved.join('/');
}
```
