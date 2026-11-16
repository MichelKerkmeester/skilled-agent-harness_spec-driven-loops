import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
const out = process.env.TRACE_READS_OUT;
const seen = new Set();
function log(kind, p) {
  if (typeof p !== 'string' && !(p instanceof URL)) return;
  const key = `${kind}\t${String(p)}`;
  if (seen.has(key)) return;
  seen.add(key);
  fs.appendFileSync(out, `${process.pid}\t${key}\n`);
}
for (const name of ['readFileSync', 'readdirSync', 'existsSync', 'statSync']) {
  const orig = fs[name];
  fs[name] = function (p, ...rest) { log(name, p); return orig.call(this, p, ...rest); };
}
syncBuiltinESMExports();
