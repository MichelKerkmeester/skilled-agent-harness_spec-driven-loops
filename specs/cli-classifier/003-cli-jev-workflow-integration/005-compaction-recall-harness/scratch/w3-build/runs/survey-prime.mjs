// Counts only: per boundary, the session-prime SessionStart:compact attachment's status and marker.
import { createReadStream, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2];
const files = readdirSync(dir).filter((f) => f.endsWith('.jsonl')).map((f) => join(dir, f)).filter((f) => statSync(f).isFile());
const MARK = 'Recovered Context (Post-Compaction)';
const t = new Map(); const bump = (k) => t.set(k, (t.get(k) ?? 0) + 1);
for (const f of files) {
  const recs = []; let carry = Buffer.alloc(0);
  await new Promise((res) => { const s = createReadStream(f);
    s.on('data', (c) => { let b = carry.length ? Buffer.concat([carry, c]) : c; let i; while ((i = b.indexOf(10)) !== -1) { const l = b.subarray(0, i); b = b.subarray(i + 1); if (l.length) { try { const r = JSON.parse(l.toString('utf8')); const a = r.attachment; recs.push({ type: r.type, subtype: r.subtype, cm: !!r.compactMetadata, at: a?.type, hn: a?.hookName, prime: typeof a?.command === 'string' && a.command.includes('session-prime'), mk: (typeof a?.content === 'string' && a.content.includes(MARK)), mks: (typeof a?.stdout === 'string' && a.stdout.includes(MARK)), clen: typeof a?.content === 'string' ? 'str' : typeof a?.content }); } catch { recs.push({}); } } } carry = Buffer.from(b); });
    s.on('end', res); });
  recs.forEach((r, i) => {
    if (!(r.type === 'system' && r.subtype === 'compact_boundary' && r.cm)) return;
    const win = recs.slice(i + 1, i + 31).filter((w) => w.type === 'attachment' && w.hn === 'SessionStart:compact');
    const primes = win.filter((w) => w.prime);
    bump(`prime_count=${primes.length}`);
    const p = primes[0];
    bump(`prime_status=${p ? p.at : 'none'}_marker_content=${p ? p.mk : '-'}_stdout=${p ? p.mks : '-'}_content=${p ? p.clen : '-'}`);
    const nonPrimeMarker = win.some((w) => !w.prime && (w.mk || w.mks)); bump(`marker_outside_prime=${nonPrimeMarker}`);
  });
}
console.log(JSON.stringify(Object.fromEntries([...t].sort())));
