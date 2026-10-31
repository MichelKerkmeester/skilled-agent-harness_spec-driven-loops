// Planning probe, not a build target: times the built hook's handler inside a
// child spawned like the prompt shim spawns the advisor, for the first N
// skill-firing prompts, under the census capture env.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const RA = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs');
const HOOK = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js');
const n = Number(process.argv[2] ?? 5);
const { loadCensus } = await import(RA);
const census = await loadCensus();
console.log(`census rows=${census.rows.length} dbdir=${process.env.SYSTEM_SKILL_ADVISOR_DB_DIR}`);
const childCode = `
import { performance } from 'node:perf_hooks';
const t0 = performance.now();
const mod = await import(${JSON.stringify(HOOK)});
const t1 = performance.now();
const out = await mod.handleClaudeUserPromptSubmit({ prompt: process.env.PROBE_PROMPT, cwd: process.cwd() });
const t2 = performance.now();
process.stdout.write(JSON.stringify({ importMs: Math.round(t1 - t0), advisorMs: Math.round(t2 - t1), bytes: JSON.stringify(out).length, head: JSON.stringify(out).slice(0, 160) }) + '\\n');
`;
for (const row of census.rows.slice(0, n)) {
  const start = Date.now();
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', childCode], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_CLAUDE_HOOK_TIMEOUT_MS: '2200', PROBE_PROMPT: row.prompt },
    timeout: 2500,
    killSignal: 'SIGKILL',
  });
  const wall = Date.now() - start;
  console.log(`row=${row.id} wall=${wall} status=${r.status} signal=${r.signal} err=${r.error?.code ?? ''} out=${(r.stdout ?? '').trim()} stderr=${(r.stderr ?? '').trim().slice(0, 300)}`);
}
