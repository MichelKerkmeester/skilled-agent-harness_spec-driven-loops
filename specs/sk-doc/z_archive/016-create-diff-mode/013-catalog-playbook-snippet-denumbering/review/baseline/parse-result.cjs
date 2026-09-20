'use strict';

// Parse one DeepSeek dispatch's raw NDJSON event stream into the canonical review
// artifacts: deltas/iter-NNN.jsonl (type:"iteration" record) + iterations/iteration-NNN.md
// (narrative ending in the mandatory `Review verdict: X` final line).
// Usage: node parse-result.cjs <iteration-number>
const fs = require('fs');
const path = require('path');

const REVIEW = path.resolve(__dirname, '..');
const iterN = parseInt(process.argv[2], 10);
const NNN = String(iterN).padStart(3, '0');
const rawPath = path.join(REVIEW, 'raw', `iter-${NNN}.json`);

const raw = fs.readFileSync(rawPath, 'utf8');

// 1. Extract assistant text from NDJSON events (tolerant to field shape).
let text = '';
for (const line of raw.split('\n')) {
  const t = line.trim();
  if (!t.startsWith('{')) continue;
  let ev;
  try { ev = JSON.parse(t); } catch { continue; }
  if (ev.type !== 'text') continue;
  const piece = ev.part?.text ?? ev.part?.content ?? ev.text ?? '';
  if (typeof piece === 'string') text += piece;
}
if (!text) {
  // Fallback: maybe plain (non-NDJSON) output — use the whole thing.
  text = raw;
}

// 2. Pull the last fenced ```json block (the final answer).
const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)].map((m) => m[1]);
let parsed = null, parseErr = null;
for (let i = blocks.length - 1; i >= 0; i--) {
  try { parsed = JSON.parse(blocks[i].trim()); break; } catch (e) { parseErr = e.message; }
}
if (!parsed) {
  // last resort: try to find a bare top-level {...} containing "findings"
  const m = text.match(/\{[\s\S]*"findings"[\s\S]*\}/);
  if (m) { try { parsed = JSON.parse(m[0]); } catch (e) { parseErr = e.message; } }
}
if (!parsed) {
  console.error(`PARSE_FAIL iter ${iterN}: ${parseErr}. text length=${text.length}, json blocks=${blocks.length}`);
  process.exit(3);
}

const findings = Array.isArray(parsed.findings) ? parsed.findings : [];
const missed = Array.isArray(parsed.missed_by_regex) ? parsed.missed_by_regex : [];
const all = [...findings, ...missed];
const sev = { P0: 0, P1: 0, P2: 0 };
for (const f of all) { if (sev[f.severity] !== undefined) sev[f.severity]++; }
// Recompute verdict from severity counts (authoritative) — the model's own verdict
// field has been observed to disagree with its structured findings.
const verdict = sev.P0 ? 'FAIL' : sev.P1 ? 'CONDITIONAL' : 'PASS';

// 3. Write delta JSONL (one type:"iteration" record).
const delta = {
  type: 'iteration',
  iteration: iterN,
  slice: parsed.slice || `iteration-${iterN}`,
  verdict,
  findingsSummary: sev,
  findingCount: all.length,
  findingDetails: all,
  summary: parsed.summary || '',
  filesExamined: parsed.files_examined ?? null,
  timestamp: new Date(parseInt(process.env.NOW_MS || '0', 10) || Date.parse('2026-06-06T00:00:00Z')).toISOString(),
};
fs.writeFileSync(path.join(REVIEW, 'deltas', `iter-${NNN}.jsonl`), JSON.stringify(delta) + '\n');

// 4. Write iteration narrative md (final line MUST be the verdict).
const rows = all.length
  ? all.map((f) => `| ${f.severity || '?'} | ${f.classification || '-'} | \`${f.source_file || '?'}\` | \`${f.ref || '?'}\` | ${f.is_133_caused ? 'yes' : 'no'} | ${(f.recommendation || '').replace(/\|/g, '\\|')} |`).join('\n')
  : '| - | - | - | - | - | (no findings) |';
const md = `# Deep-Review Iteration ${NNN} — ${delta.slice}

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=${sev.P0} P1=${sev.P1} P2=${sev.P2} (total ${all.length})

## Summary
${delta.summary || '(none)'}

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
${rows}

Review verdict: ${verdict}`;
fs.writeFileSync(path.join(REVIEW, 'iterations', `iteration-${NNN}.md`), md);

console.log(`iter ${NNN}: verdict=${verdict} P0=${sev.P0} P1=${sev.P1} P2=${sev.P2} total=${all.length} (findings=${findings.length} missed=${missed.length})`);
