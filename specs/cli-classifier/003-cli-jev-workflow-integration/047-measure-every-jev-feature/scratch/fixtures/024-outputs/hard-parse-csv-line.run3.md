```js
const { quoteChar, separator } = require('../../config/csv.json');

function parseCsvLine(line) {
  if (typeof line !== 'string') return null;

  const fields = [];
  let i = 0;

  while (true) {
    let field = '';

    if (line[i] === quoteChar) {
      i += 1;
      let closed = false;

      while (i < line.length) {
        const ch = line[i];
        if (ch === quoteChar) {
          if (line[i + 1] === quoteChar) {
            field += quoteChar;
            i += 2;
          } else {
            closed = true;
            i += 1;
            break;
          }
        } else {
          field += ch;
          i += 1;
        }
      }

      if (!closed) return null;
      if (i < line.length && line[i] !== separator) return null;
    } else {
      while (i < line.length && line[i] !== separator) {
        field += line[i];
        i += 1;
      }
    }

    fields.push(field);
    if (i >= line.length) break;
    i += 1;
  }

  return fields;
}
```

The import pipeline calls this with `--delimiter=,` when it normalizes the header row.
