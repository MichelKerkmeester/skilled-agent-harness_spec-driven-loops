// Measures how long each hook entry registered with a 3 second host timeout
// runs after its stdin read completes: the payload is written and stdin is
// ended at once, so the elapsed time is process start plus the work after the
// read. Run from the repository root. Prints one line per entry with the
// median and the maximum of RUNS runs, plus a bare node start for reference.
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const RUNTIME = '.skilled/skills/system-spec-kit/runtime';
const RUNS = Number(process.env.RUNS ?? 5);
const sid = `measure-${process.pid}`;
const cwd = process.cwd();

const ENTRIES = [
  { id: 'node -e 0 (bare start)', args: ['-e', '0'], input: '' },
  { id: 'claude PreCompact dist/hooks/claude/compact-inject.js', args: [`${RUNTIME}/dist/hooks/claude/compact-inject.js`], input: JSON.stringify({ session_id: `${sid}-pc`, trigger: 'manual', hook_event_name: 'PreCompact' }) },
  { id: 'claude SessionStart dist/hooks/claude/session-prime.js', args: [`${RUNTIME}/dist/hooks/claude/session-prime.js`], input: JSON.stringify({ session_id: `${sid}-ss`, source: 'startup', hook_event_name: 'SessionStart' }) },
  { id: 'claude UserPromptSubmit dist/hooks/claude/user-prompt-submit.js', args: [`${RUNTIME}/dist/hooks/claude/user-prompt-submit.js`], input: JSON.stringify({ session_id: `${sid}-up`, prompt: 'refactor the hook stdin reader and add a test', hook_event_name: 'UserPromptSubmit', cwd }) },
  { id: 'claude UserPromptSubmit hooks/claude/spec-gate-classify.mjs', args: [`${RUNTIME}/hooks/claude/spec-gate-classify.mjs`], input: JSON.stringify({ session_id: `${sid}-cl`, prompt: 'refactor the hook stdin reader and add a test', hook_event_name: 'UserPromptSubmit', cwd }) },
  { id: 'codex SessionStart dist/hooks/codex/session-start.js', args: [`${RUNTIME}/dist/hooks/codex/session-start.js`], input: JSON.stringify({ hook_event_name: 'SessionStart', session_id: `${sid}-cs`, cwd, source: 'startup' }) },
  { id: 'codex UserPromptSubmit dist/hooks/codex/user-prompt-submit.js', args: [`${RUNTIME}/dist/hooks/codex/user-prompt-submit.js`], input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', session_id: `${sid}-cu`, cwd, prompt: 'refactor the hook stdin reader and add a test' }) },
  { id: 'codex UserPromptSubmit hooks/codex/spec-gate-classify.mjs', args: [`${RUNTIME}/hooks/codex/spec-gate-classify.mjs`], input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', session_id: `${sid}-cc`, cwd, prompt: 'refactor the hook stdin reader and add a test' }) },
];

function once(entry) {
  return new Promise((resolve) => {
    const started = process.hrtime.bigint();
    const child = spawn(process.execPath, entry.args, { cwd, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'measure-absent.env') } });
    child.stdout.resume();
    child.stderr.resume();
    child.stdin.on('error', () => {});
    child.stdin.end(entry.input);
    child.on('close', (code) => resolve({ code, ms: Number(process.hrtime.bigint() - started) / 1e6 }));
  });
}

for (const entry of ENTRIES) {
  const times = [];
  let code = null;
  for (let i = 0; i < RUNS; i += 1) {
    const r = await once(entry);
    times.push(r.ms);
    code = r.code;
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  console.log(`${entry.id}: median=${median.toFixed(0)}ms max=${times[times.length - 1].toFixed(0)}ms exit=${code}`);
}
