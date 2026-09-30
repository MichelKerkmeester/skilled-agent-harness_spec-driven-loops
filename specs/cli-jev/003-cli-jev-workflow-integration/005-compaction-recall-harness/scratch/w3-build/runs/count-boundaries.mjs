// Independent boundary count, written apart from the census: splits each file on the newline byte
// (never readline), parses every line as JSON and counts records with type system, subtype
// compact_boundary and compactMetadata present. Prints basenames, sizes and counts only.
// usage: node count-boundaries.mjs <dir> <basename>...
import { createReadStream, statSync } from 'node:fs';
import { join } from 'node:path';

const [dir, ...names] = process.argv.slice(2);
let total = 0;
for (const name of names) {
  const file = join(dir, name);
  const size = statSync(file).size;
  let count = 0; let bad = 0; let carry = Buffer.alloc(0);
  const take = (buf) => {
    if (buf.length === 0) return;
    let r; try { r = JSON.parse(buf.toString('utf8')); } catch { bad += 1; return; }
    if (r && r.type === 'system' && r.subtype === 'compact_boundary' && r.compactMetadata && typeof r.compactMetadata === 'object') count += 1;
  };
  if (size > 0) await new Promise((res, rej) => {
    const s = createReadStream(file, { start: 0, end: size - 1 });
    s.on('data', (c) => { let b = carry.length ? Buffer.concat([carry, c]) : c; let i; while ((i = b.indexOf(10)) !== -1) { take(b.subarray(0, i)); b = b.subarray(i + 1); } carry = Buffer.from(b); });
    s.on('end', () => { take(carry); res(); }); s.on('error', rej);
  });
  total += count;
  console.log(`${name} bytes=${size} boundaries=${count} unparsed=${bad}`);
}
console.log(`total files=${names.length} boundaries=${total}`);
