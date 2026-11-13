// ───────────────────────────────────────────────────────────────────
// MODULE: LIVE BRIEF COST
// ───────────────────────────────────────────────────────────────────
//
// Measures the brief the hook emits when the checkout's own daemon answers,
// for every typed corpus row whose split is not holdout. measure-brief-cost.mjs
// keeps its socket in a fresh directory, which cannot reach that daemon, so
// this script measures the other arm with the same payload shape.
//
// Usage: node live-brief-cost.mjs
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..', '..', '..', '..', '..', '..', '..');
const CORPUS = join(REPO, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl');
const HOOK = join(REPO, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
const SANDBOX = join(HERE, 'tmp-live');
mkdirSync(SANDBOX, { recursive: true });
process.env.TMPDIR = SANDBOX;

const rows = readFileSync(CORPUS, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const selected = rows.filter((row) => row.row_type === 'typed' && row.split === 'none');

function measure(row) {
  const env = { ...process.env, SPECKIT_RUNTIME: 'claude' };
  delete env.AI_SESSION_CHILD;
  delete env.SKILL_ADVISOR_DEBUG;
  delete env.SPECKIT_IPC_SOCKET_DIR;
  const payload = JSON.stringify({
    prompt: row.prompt,
    cwd: REPO,
    hook_event_name: 'UserPromptSubmit',
    session_id: `live-${row.id}`,
  });
  const started = process.hrtime.bigint();
  const result = spawnSync(process.execPath, [HOOK], { input: payload, env, encoding: 'utf8', timeout: 30000 });
  const ms = Number((Number(process.hrtime.bigint() - started) / 1e6).toFixed(2));
  let text = '';
  try {
    text = JSON.parse(result.stdout)?.hookSpecificOutput?.additionalContext ?? '';
  } catch {
    text = '';
  }
  return {
    id: row.id,
    bytes: Buffer.byteLength(text, 'utf8'),
    ms,
    state: text.startsWith('Advisor: live') ? 'live' : text.startsWith('Advisor: stale') ? 'stale' : 'other',
    hasCommand: typeof row.expected_command === 'string' && text.includes(row.expected_command),
    hasPolicy: /\((run|start|ask)\)/.test(text),
    headBytes: Buffer.byteLength(text.split('\n')[0], 'utf8'),
  };
}

const measured = [];
for (const row of selected) measured.push(measure(row));

const bytes = measured.map((row) => row.bytes).sort((a, b) => a - b);
const heads = measured.map((row) => row.headBytes).sort((a, b) => a - b);
const at = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
const times = measured.map((row) => row.ms).sort((a, b) => a - b);

console.log(JSON.stringify({
  rows: measured.length,
  liveRows: measured.filter((row) => row.state === 'live').length,
  withCommand: measured.filter((row) => row.hasCommand).length,
  withPolicy: measured.filter((row) => row.hasPolicy).length,
  totalBytes: bytes.reduce((sum, value) => sum + value, 0),
  medianBytes: at(bytes, 0.5),
  minBytes: bytes[0],
  maxBytes: bytes[bytes.length - 1],
  medianHeadBytes: at(heads, 0.5),
  maxHeadBytes: heads[heads.length - 1],
  hookMedianMs: at(times, 0.5),
  hookP95Ms: at(times, 0.95),
  rowsOut: measured,
}, null, 2));
