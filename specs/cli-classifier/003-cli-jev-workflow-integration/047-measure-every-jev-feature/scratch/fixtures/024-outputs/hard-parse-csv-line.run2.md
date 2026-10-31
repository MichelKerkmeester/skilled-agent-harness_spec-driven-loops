```js
function parseCsvLine(line) {
  if (typeof line !== 'string') return null;
  if (line.length === 0) return [''];

  const fields = [];
  let i = 0;

  while (i <= line.length) {
    let field = '';
    if (line[i] === '"') {
      i += 1;
      let closed = false;
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          i += 1;
          closed = true;
          break;
        }
        field += line[i];
        i += 1;
      }
      if (!closed) return null;
      if (i < line.length && line[i] !== ',') return null;
    } else {
      while (i < line.length && line[i] !== ',') {
        field += line[i];
        i += 1;
      }
    }

    fields.push(field);
    if (i >= line.length) return fields;
    i += 1;
    if (i === line.length) {
      fields.push('');
      return fields;
    }
  }

  return fields;
}
```
