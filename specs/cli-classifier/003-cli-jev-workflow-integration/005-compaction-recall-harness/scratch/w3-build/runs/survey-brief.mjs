// Counts only: per boundary, how the SessionStart:compact attachments in the 30 records after it look.
import { createReadStream, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2];
const files = readdirSync(dir).filter((f) => f.endsWith('.jsonl')).map((f) => join(dir, f)).filter((f) => statSync(f).isFile());
const MARK = 'Recovered Context (Post-Compaction)';
const t = new Map(); const bump = (k) => t.set(k, (t.get(k) ?? 0) + 1);
for (const f of files) {
  const recs = []; let carry = Buffer.alloc(0);
  await new Promise((res) => { const s = createReadStream(f);
    s.on('data', (c) => { let b = carry.length ? Buffer.concat([carry, c]) : c; let i; while ((i = b.indexOf(10)) !== -1) { const l = b.subarray(0, i); b = b.subarray(i + 1); if (l.length) { try { const r = JSON.parse(l.toString('utf8')); recs.push({ type: r.type, subtype: r.subtype, cm: !!r.compactMetadata, at: r.attachment?.type, hn: r.attachment?.hookName, mc: typeof r.attachment?.content === 'string' && r.attachment.content.includes(MARK), ms: typeof r.attachment?.stdout === 'string' && r.attachment.stdout.includes(MARK), ics: !!r.isCompactSummary }); } catch { recs.push({ bad: true }); } } } carry = Buffer.from(b); });
    s.on('end', res); });
  recs.forEach((r, i) => {
    if (!(r.type === 'system' && r.subtype === 'compact_boundary' && r.cm)) return;
    const win = recs.slice(i + 1, i + 31);
    const ss = win.filter((w) => w.type === 'attachment' && w.hn === 'SessionStart:compact');
    const ok = ss.filter((w) => w.at === 'hook_success');
    bump(`ss_compact_in_window=${ss.length}`); bump(`hook_success_in_window=${ok.length}`);
    const pos = ok.findIndex((w) => w.mc || w.ms);
    bump(`marker_at_success_ordinal=${pos}`);
    bump(`first_success_marker_content=${ok[0]?.mc ?? 'none'}_stdout=${ok[0]?.ms ?? 'none'}`);
    bump(`statuses=${[...new Set(ss.map((w) => w.at))].sort().join('+') || 'none'}`);
    const sumIdx = win.findIndex((w) => w.type === 'user' && w.ics); bump(`summary_offset=${sumIdx < 0 ? 'none' : sumIdx < 3 ? sumIdx : '3+'}`);
  });
}
console.log(JSON.stringify(Object.fromEntries([...t].sort()), null, 0));
