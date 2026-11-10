// Spawns every hook entry registered with a 3 second host timeout, writes its
// payload and then holds stdin open without ending it, the way a host that
// never closes stdin behaves. Runs each entry RUNS times and prints its median
// exit time and whether that median leaves at least MARGIN_MS to spare inside
// the 3000 ms host timeout. A run killed by the safety timer marks the entry
// LATE. Run from the repository root.
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const RUNTIME = '.skilled/skills/system-spec-kit/runtime';
const HOST_TIMEOUT_MS = 3000;
const MARGIN_MS = Number(process.env.MARGIN_MS ?? 1000);
const KILL_AFTER_MS = 12000;
const RUNS = Number(process.env.RUNS ?? 3);
const sid = `open-stdin-${process.pid}`;
const cwd = process.cwd();
const prompt = 'refactor the hook stdin reader and add a test';

const ENTRIES = [
  { id: 'claude/compact-inject.js', args: [`${RUNTIME}/dist/hooks/claude/compact-inject.js`], input: JSON.stringify({ session_id: `${sid}-pc`, trigger: 'manual', hook_event_name: 'PreCompact' }) },
  { id: 'claude/session-prime.js', args: [`${RUNTIME}/dist/hooks/claude/session-prime.js`], input: JSON.stringify({ session_id: `${sid}-ss`, source: 'startup', hook_event_name: 'SessionStart' }) },
  { id: 'claude/user-prompt-submit.js', args: [`${RUNTIME}/dist/hooks/claude/user-prompt-submit.js`], input: JSON.stringify({ session_id: `${sid}-up`, prompt, hook_event_name: 'UserPromptSubmit', cwd }) },
  { id: 'claude/spec-gate-classify.mjs', args: [`${RUNTIME}/hooks/claude/spec-gate-classify.mjs`], input: JSON.stringify({ session_id: `${sid}-cl`, prompt, hook_event_name: 'UserPromptSubmit', cwd }) },
  { id: 'codex/session-start.js', args: [`${RUNTIME}/dist/hooks/codex/session-start.js`], input: JSON.stringify({ hook_event_name: 'SessionStart', session_id: `${sid}-cs`, cwd, source: 'startup' }) },
  { id: 'codex/user-prompt-submit.js', args: [`${RUNTIME}/dist/hooks/codex/user-prompt-submit.js`], input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', session_id: `${sid}-cu`, cwd, prompt }) },
  { id: 'codex/spec-gate-classify.mjs', args: [`${RUNTIME}/hooks/codex/spec-gate-classify.mjs`], input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', session_id: `${sid}-cc`, cwd, prompt }) },
];

function once(entry) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, entry.args, { cwd, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'open-stdin-absent.env') } });
    let stdout = '';
    child.stdout.on('data', (c) => { stdout += c; });
    child.stderr.resume();
    child.stdin.on('error', () => {});
    child.stdin.write(entry.input);
    const killer = setTimeout(() => child.kill('SIGKILL'), KILL_AFTER_MS);
    child.on('close', (code, signal) => { clearTimeout(killer); resolve({ code, signal, ms: Date.now() - started, bytes: stdout.trim().length }); });
  });
}

let late = 0;
for (const entry of ENTRIES) {
  const runs = [];
  for (let i = 0; i < RUNS; i += 1) runs.push(await once(entry));
  const killed = runs.some((r) => r.signal !== null);
  const sorted = runs.map((r) => r.ms).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const last = runs[runs.length - 1];
  const ok = !killed && median <= HOST_TIMEOUT_MS - MARGIN_MS;
  if (!ok) late += 1;
  console.log(`${ok ? 'OK  ' : 'LATE'} ${entry.id}: exit=${last.code} signal=${last.signal} median=${median}ms max=${sorted[sorted.length - 1]}ms stdout_bytes=${last.bytes}`);
}
console.log(`entries=${ENTRIES.length} late=${late} margin_ms=${MARGIN_MS} runs=${RUNS}`);
process.exitCode = late === 0 ? 0 : 1;
