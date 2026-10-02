```js
function parseCsvLine(line) {
  if (typeof line !== 'string') return null;

  const fields = [];
  let field = '';
  let i = 0;
  let inQuotes = false;

  while (i <= line.length) {
    if (i === line.length) {
      if (inQuotes) return null;
      fields.push(field);
      return fields;
    }

    const ch = line[i];

    if (!inQuotes) {
      if (ch === ',') {
        fields.push(field);
        field = '';
        i += 1;
      } else if (ch === '"' && field === '') {
        inQuotes = true;
        i += 1;
      } else {
        field += ch;
        i += 1;
      }
      continue;
    }

    if (ch === '"') {
      if (line[i + 1] === '"') {
        field += '"';
        i += 2;
        continue;
      }
      inQuotes = false;
      i += 1;
      if (i < line.length && line[i] !== ',') return null;
      continue;
    }

    field += ch;
    i += 1;
  }

  return fields;
}
```
