// Schema survey over top-level transcript files: prints only type labels, key names and counts.
// Splits each stream on the newline byte (never readline). Prints no field value except enum-like
// labels it is told to tally (subtype, attachment.type, attachment.hookName, compactMetadata.trigger).
import { createReadStream, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const files = readdirSync(dir).filter((f) => f.endsWith('.jsonl')).map((f) => join(dir, f))
  .filter((f) => statSync(f).isFile());
const types = new Map(); const keysByType = new Map(); const tallies = new Map();
const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
const tally = (name, v) => { if (!tallies.has(name)) tallies.set(name, new Map()); bump(tallies.get(name), String(v)); };
let bad = 0; let files0 = 0; let lines = 0;
const label = (s) => (typeof s === 'string' && s.length < 60 && /^[A-Za-z_:.-]+$/.test(s) ? s : '(other)');
for (const f of files) {
  files0 += 1;
  let carry = Buffer.alloc(0);
  const handle = (buf) => {
    if (buf.length === 0) return;
    lines += 1;
    let r; try { r = JSON.parse(buf.toString('utf8')); } catch { bad += 1; return; }
    const t = label(r?.type);
    bump(types, t);
    if (!keysByType.has(t)) keysByType.set(t, new Map());
    for (const k of Object.keys(r ?? {})) bump(keysByType.get(t), k);
    if (t === 'system') tally('system.subtype', label(r.subtype));
    if (r?.subtype === 'compact_boundary') {
      tally('boundary.has_compactMetadata', Boolean(r.compactMetadata));
      if (r.compactMetadata) { for (const k of Object.keys(r.compactMetadata)) tally('compactMetadata.key', k); tally('compactMetadata.trigger', label(r.compactMetadata.trigger));
        const ps = r.compactMetadata.preservedSegment; if (ps && typeof ps === 'object') for (const k of Object.keys(ps)) tally('preservedSegment.key', k); else tally('preservedSegment.type', ps === undefined ? 'undefined' : typeof ps); }
    }
    if (t === 'attachment') { tally('attachment.type', label(r.attachment?.type)); if (r.attachment?.hookName) tally('attachment.hookName', label(r.attachment.hookName));
      if (r.attachment?.hookName === 'SessionStart:compact') for (const k of Object.keys(r.attachment)) tally('SessionStart:compact.attachment.key', k); }
    if (t === 'user' && r.isCompactSummary) { tally('user.isCompactSummary', true); tally('compactSummary.content.type', Array.isArray(r.message?.content) ? 'array' : typeof r.message?.content); }
    if ((t === 'user' || t === 'assistant') && Array.isArray(r.message?.content)) for (const b of r.message.content) tally(`${t}.block.type`, label(b?.type));
  };
  await new Promise((res, rej) => {
    const s = createReadStream(f);
    s.on('data', (chunk) => { let buf = carry.length ? Buffer.concat([carry, chunk]) : chunk; let i;
      while ((i = buf.indexOf(10)) !== -1) { handle(buf.subarray(0, i)); buf = buf.subarray(i + 1); } carry = Buffer.from(buf); });
    s.on('end', () => { handle(carry); res(); }); s.on('error', rej);
  });
}
console.log(JSON.stringify({ files: files0, lines, not_json: bad, types: Object.fromEntries([...types].sort((a, b) => b[1] - a[1])) }));
for (const [t, m] of keysByType) console.log('keys', t, JSON.stringify(Object.fromEntries(m)));
for (const [n, m] of tallies) console.log('tally', n, JSON.stringify(Object.fromEntries(m)));
