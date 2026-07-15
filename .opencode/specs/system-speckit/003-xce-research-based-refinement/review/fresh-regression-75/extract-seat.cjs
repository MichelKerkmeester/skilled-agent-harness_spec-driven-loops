#!/usr/bin/env node
'use strict';

// Parse one review seat's raw CLI log into canonical deep-review artifacts.
// Emits {type:"finding"} rows into deltas/iter-N.jsonl (reduce-state.cjs input),
// an iteration record into deep-review-state.jsonl, and a write-once iteration md.
// Prints ONE compact summary line so the orchestrator never ingests full transcripts.

const fs = require('node:fs');
const path = require('node:path');

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const logPath = arg('log');
const executor = arg('executor'); // 'opencode' | 'claude'
const label = arg('label');
const model = arg('model');
const angle = arg('angle', '');
const lineageDir = arg('lineage-dir');
const iter = parseInt(arg('iter', '1'), 10);
const globalSeat = parseInt(arg('global', String(iter)), 10);

if (!logPath || !executor || !label || !lineageDir) {
  console.error('usage: extract-seat.cjs --log P --executor opencode|claude --label L --model M --angle A --lineage-dir D --iter N --global G');
  process.exit(2);
}

let raw = '';
try { raw = fs.readFileSync(logPath, 'utf8'); } catch (e) { console.log(`SEAT ${label} iter${iter} STATUS=missing-log (${e.message})`); process.exit(0); }

// ── Reconstruct assistant text ──
let text = '';
if (executor === 'opencode') {
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    let obj; try { obj = JSON.parse(t); } catch { continue; }
    if (obj && obj.type === 'text' && obj.part && typeof obj.part.text === 'string') text += obj.part.text;
  }
  if (!text) text = raw; // fallback: opencode may have errored in plain text
} else {
  // claude --output-format text: raw stdout is the answer; drop the stdin warning line.
  text = raw.replace(/^Warning: no stdin data received.*$/m, '').trim();
}

// ── Extract the LAST ```json fenced block ──
let parsed = null; let parseErr = null;
const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)].map((m) => m[1].trim());
const candidate = blocks.length ? blocks[blocks.length - 1] : null;
if (candidate) { try { parsed = JSON.parse(candidate); } catch (e) { parseErr = e.message; } }
if (!parsed) {
  // last-resort: try to find a bare {...} with "findings"
  const m = text.match(/\{[\s\S]*"findings"[\s\S]*\}\s*$/);
  if (m) { try { parsed = JSON.parse(m[0]); parseErr = null; } catch (e) { parseErr = parseErr || e.message; } }
}

const SEV = new Set(['P0', 'P1', 'P2']);
const DIM = new Set(['correctness', 'security', 'traceability', 'maintainability']);
const findingsIn = parsed && Array.isArray(parsed.findings) ? parsed.findings : [];
const counts = { P0: 0, P1: 0, P2: 0 };
const findingRows = [];
findingsIn.forEach((f, idx) => {
  const sev = SEV.has(f.severity) ? f.severity : 'P2';
  counts[sev] += 1;
  const dim = DIM.has(f.dimension) ? f.dimension : 'maintainability';
  findingRows.push({
    type: 'finding',
    iteration: iter,
    run: iter,
    id: `${label}-i${iter}-f${idx + 1}`,
    severity: sev,
    status: 'open',
    title: String(f.title || 'untitled').slice(0, 200),
    file: String(f.file || '').slice(0, 300),
    dimension: dim,
    findingClass: angle || 'general',
    findingDetails: [{
      evidence: String(f.evidence || ''),
      why: String(f.why || ''),
      recommendation: String(f.recommendation || ''),
    }],
    seat: label,
    model,
    globalSeat,
  });
});

const verdict = parsed && parsed.verdict ? parsed.verdict : (parseErr ? 'ERROR' : 'PASS');
const summary = parsed && parsed.summary ? String(parsed.summary) : '';
const filesReviewed = parsed && Array.isArray(parsed.files_reviewed) ? parsed.files_reviewed : [];

// ── Write deltas/iter-N.jsonl (finding rows) ──
const deltaDir = path.join(lineageDir, 'deltas');
fs.mkdirSync(deltaDir, { recursive: true });
const deltaLines = findingRows.map((r) => JSON.stringify(r));
fs.writeFileSync(path.join(deltaDir, `iter-${iter}.jsonl`), deltaLines.length ? deltaLines.join('\n') + '\n' : '');

// ── Append iteration record to deep-review-state.jsonl ──
const stateRec = {
  type: 'iteration', mode: 'review', run: iter, iteration: iter,
  status: parseErr ? 'error' : 'complete',
  focus: angle, dimension: (findingRows[0] && findingRows[0].dimension) || 'correctness',
  findingsSummary: counts, verdict, summary,
  files_reviewed: filesReviewed, seat: label, model, globalSeat,
  parseError: parseErr || undefined,
};
fs.appendFileSync(path.join(lineageDir, 'deep-review-state.jsonl'), JSON.stringify(stateRec) + '\n');

// ── Write write-once iteration narrative md ──
const iterDir = path.join(lineageDir, 'iterations');
fs.mkdirSync(iterDir, { recursive: true });
const md = `# Seat ${label} — iteration ${iter} (global #${globalSeat})\n\n`
  + `- Model: \`${model}\` · Executor: ${executor} · Angle: ${angle}\n`
  + `- Verdict: **${verdict}** · Findings: P0=${counts.P0} P1=${counts.P1} P2=${counts.P2}`
  + `${parseErr ? ` · PARSE_ERROR: ${parseErr}` : ''}\n\n## Analysis\n\n${text.trim()}\n`;
fs.writeFileSync(path.join(iterDir, `iteration-${String(iter).padStart(3, '0')}.md`), md);

console.log(`SEAT ${label} iter${iter} g#${globalSeat} verdict=${verdict} P0=${counts.P0} P1=${counts.P1} P2=${counts.P2} findings=${findingRows.length}${parseErr ? ` PARSE_ERROR=${parseErr.slice(0, 60)}` : ''}`);

// Exit 3 when there was no parseable findings JSON, so the dispatcher can mark
// the seat for retry instead of treating a failed/empty seat as "done".
process.exit(parsed ? 0 : 3);
