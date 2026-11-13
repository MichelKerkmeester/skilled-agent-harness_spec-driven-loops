// ───────────────────────────────────────────────────────────────────
// MODULE: BRIEF A/B — SANDBOX SOCKET VS LIVE DAEMON
// ───────────────────────────────────────────────────────────────────
//
// Runs the same typed-command prompts through the Claude prompt hook twice:
// once with the fresh socket directory measure-brief-cost.mjs uses, and once
// with the checkout's own daemon. The difference says whether the committed
// brief-cost number describes the live brief or the degraded fallback one.
//
// Only rows whose split is not holdout are read, by the same rule the cost
// script applies. Heads only, never the prompt text.
//
// Usage: node brief-ab.mjs
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..', '..', '..', '..', '..', '..', '..');
const CORPUS = join(REPO, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl');
const HOOK = join(REPO, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
const SANDBOX = join(HERE, 'tmp-ab');
mkdirSync(SANDBOX, { recursive: true });
process.env.TMPDIR = SANDBOX;

const WANTED = [
  'cmd-create-readme-typed-01',
  'cmd-deep-review-typed-01',
  'cmd-doctor-agents-md-typed-01',
  'cmd-speckit-plan-typed-01',
];

const rows = readFileSync(CORPUS, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const byId = new Map(rows.map((row) => [row.id, row]));
const selected = [];
for (const id of WANTED) {
  const row = byId.get(id);
  if (row === undefined) {
    console.log(JSON.stringify({ error: 'unknown_row', id }));
    process.exit(2);
  }
  if (row.split === 'holdout') {
    console.log(JSON.stringify({ error: 'holdout_row', id }));
    process.exit(2);
  }
  selected.push(row);
}

function headOf(stdout) {
  try {
    const context = JSON.parse(stdout)?.hookSpecificOutput?.additionalContext;
    return typeof context === 'string' ? context : '';
  } catch {
    return '';
  }
}

function run(row, socketDir) {
  const env = { ...process.env, SPECKIT_RUNTIME: 'claude' };
  delete env.AI_SESSION_CHILD;
  delete env.SKILL_ADVISOR_DEBUG;
  if (socketDir !== null) env.SPECKIT_IPC_SOCKET_DIR = socketDir;
  else delete env.SPECKIT_IPC_SOCKET_DIR;
  const payload = JSON.stringify({
    prompt: row.prompt,
    cwd: REPO,
    hook_event_name: 'UserPromptSubmit',
    session_id: `ab-${row.id}`,
  });
  const result = spawnSync(process.execPath, [HOOK], {
    input: payload,
    env,
    encoding: 'utf8',
    timeout: 30000,
  });
  const text = headOf(result.stdout);
  return {
    id: row.id,
    bytes: Buffer.byteLength(text, 'utf8'),
    head: text.split('\n')[0],
    hasCommand: text.includes(row.expected_command ?? ''),
    hasPolicy: /\((run|start|ask)\)/.test(text),
  };
}

const socketDir = mkdtempSync(join(tmpdir(), 'ssa-ab-'));
const out = [];
try {
  for (const row of selected) {
    const sandboxed = run(row, socketDir);
    const live = run(row, null);
    out.push({ id: row.id, sandboxed, live });
  }
} finally {
  rmSync(socketDir, { recursive: true, force: true });
}

console.log(JSON.stringify({ rows: out }, null, 2));
