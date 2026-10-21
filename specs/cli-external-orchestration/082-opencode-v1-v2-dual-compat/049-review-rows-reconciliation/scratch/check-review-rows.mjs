// Checks review.md: one row per tracked path, and no P0/P1 left open.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [reviewPath, repo] = process.argv.slice(2);
const text = readFileSync(reviewPath, 'utf8');
const lines = text.split('\n');

const start = lines.findIndex((l) => l.startsWith('## 5.'));
const end = lines.findIndex((l, i) => i > start && l.startsWith('## 6.'));
const symStart = end;
const symEnd = lines.findIndex((l, i) => i > symStart && /^## 7\./.test(l));

const rowPaths = [];
const entries = [];
const scanRows = (from, to, withFindings) => {
  for (const line of lines.slice(from, to === -1 ? undefined : to)) {
    const m = line.match(/^\| `([^`]+)` \|/);
    if (!m) continue;
    rowPaths.push(m[1]);
    if (!withFindings) continue;
    const cells = line.split(' | ');
    const findings = cells[3] || '';
    for (const part of findings.split('<br>')) {
      const f = part.match(/^\s*([a-z0-9][a-z0-9-]*-[0-9NR][0-9a-zA-Z]*) (P[012]|—|N\/A)\b(.*)$/);
      if (f) entries.push({ path: m[1], id: f[1], sev: f[2], rest: f[3], status: cells[5] });
    }
  }
};
scanRows(start, end, true);
scanRows(symStart, symEnd, false);

const tracked = execFileSync('git', ['-C', repo, 'ls-files', '.opencode/plugins', '.skilled/hooks', '.opencode/hooks'], { encoding: 'utf8' })
  .split('\n').filter(Boolean);
const trackedSet = new Set(tracked);
const rowSet = new Set(rowPaths);
const missing = tracked.filter((p) => !rowSet.has(p));
const extra = rowPaths.filter((p) => !trackedSet.has(p));
const dupes = rowPaths.filter((p, i) => rowPaths.indexOf(p) !== i);

const outcome = (rest) => {
  if (/held: behaviour change/.test(rest)) return 'held';
  if (/rejected by verifier/.test(rest)) return 'rejected';
  if (/:\s*recorded/.test(rest)) return 'recorded';
  if (/:\s*(fixed|N\/A)/.test(rest)) return 'fixed';
  return 'unknown';
};
const counts = {};
const open = [];
const recordedHigh = [];
const s4 = lines.slice(lines.findIndex((l) => l.startsWith("## 4.")), start);
const s4Reason = (id) => s4.find((l) => l.startsWith(`| ${id} |`) && /\| recorded: .{20,}/.test(l));
for (const e of entries) {
  if (!/^P[012]$/.test(e.sev)) continue;
  const o = outcome(e.rest);
  counts[e.sev] ??= { confirmed: 0, fixed: 0, recorded: 0, held: 0, heldSinceFixed: 0, unknown: 0 };
  if (/fixed by 04[012]/.test(e.rest)) counts[e.sev].heldSinceFixed += 1;
  if (o === 'rejected') continue;
  counts[e.sev].confirmed += 1;
  counts[e.sev][o] += 1;
  if ((e.sev === "P0" || e.sev === "P1") && o === "recorded" && s4Reason(e.id)) recordedHigh.push(`${e.id} ${e.sev} ${e.path}`);
  else if ((e.sev === "P0" || e.sev === "P1") && o !== "fixed") open.push(`${e.id} ${e.sev} ${o} ${e.path}`);
}
const statusOpen = lines.slice(start, end).filter((l) => /open P0\/P1/.test(l)).length;

console.log(`tracked paths: ${tracked.length}; rows: ${rowPaths.length}; missing: ${missing.length}; extra: ${extra.length}; duplicates: ${dupes.length}`);
for (const p of [...missing, ...extra, ...dupes]) console.log(`  path issue: ${p}`);
for (const [sev, c] of Object.entries(counts).sort()) console.log(`${sev}: confirmed ${c.confirmed}, fixed ${c.fixed}, recorded ${c.recorded}, held ${c.held}, unparsed ${c.unknown}`);
console.log(`rows with status "open P0/P1": ${statusOpen}`);
console.log(`P0/P1 recorded with a reason in section 4: ${recordedHigh.length}`);
for (const r of recordedHigh) console.log(`  ${r}`);
console.log(`open P0/P1 findings: ${open.length}`);
for (const o of open) console.log(`  ${o}`);
const totalsBad = [];
const s2 = lines.slice(lines.findIndex((l) => l.startsWith("## 2.")), lines.findIndex((l) => l.startsWith("## 3.")));
for (const sev of ["P0", "P1", "P2"]) {
  const row = s2.find((l) => l.startsWith(`| ${sev} |`));
  const c = counts[sev] || { confirmed: 0, fixed: 0, recorded: 0, heldSinceFixed: 0 };
  const cells = row ? row.split("|").map((x) => x.trim()).filter(Boolean) : [];
  const want = [c.confirmed, c.fixed, c.heldSinceFixed, c.recorded].join("/");
  const got = [cells[1], cells[2], cells[3], cells[4]].join("/");
  console.log(`section 2 ${sev} confirmed/fixed/held/recorded: table ${got}, rows ${want}`);
  if (got !== want) totalsBad.push(sev);
}
process.exit(missing.length || extra.length || dupes.length || open.length || statusOpen || totalsBad.length ? 1 : 0);
