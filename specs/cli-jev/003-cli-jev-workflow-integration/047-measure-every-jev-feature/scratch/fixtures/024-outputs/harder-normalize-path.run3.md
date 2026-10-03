```js
const { splitOnSlashes } = require('../../lib/path/split');

function normalizePath(path) {
  if (typeof path !== 'string') return path;
  if (path === '') return '.';

  const absolute = path.startsWith('/');
  const parts = splitOnSlashes(path);
  const out = [];

  for (const part of parts) {
    if (part === '' || part === '.') continue;

    if (part === '..') {
      if (out.length > 0 && out[out.length - 1] !== '..') {
        out.pop();
      } else if (!absolute) {
        out.push('..');
      }
      continue;
    }

    out.push(part);
  }

  if (absolute) return '/' + out.join('/');
  return out.length === 0 ? '.' : out.join('/');
}
```
