// Planning probe, not a build target: the same child as probe-advisor-child.mjs,
// but under the caller's own env (the live advisor database and warm daemon),
// for comparison with the capture env's cold temp database.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const HOOK = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js');
const CORPUS = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl');
const n = Number(process.argv[2] ?? 5);
const rows = readFileSync(CORPUS, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.prompt && String(r.skill_top_1 ?? 'none') !== 'none');
const childCode = `
import { performance } from 'node:perf_hooks';
const t0 = performance.now();
const mod = await import(${JSON.stringify(HOOK)});
const t1 = performance.now();
const out = await mod.handleClaudeUserPromptSubmit({ prompt: process.env.PROBE_PROMPT, cwd: process.cwd() });
const t2 = performance.now();
process.stdout.write(JSON.stringify({ importMs: Math.round(t1 - t0), advisorMs: Math.round(t2 - t1), head: JSON.stringify(out).slice(0, 110) }) + '\\n');
`;
for (const row of rows.slice(0, n)) {
  const start = Date.now();
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', childCode], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, SPECKIT_CLAUDE_HOOK_TIMEOUT_MS: '2200', PROBE_PROMPT: row.prompt },
    timeout: 2500, killSignal: 'SIGKILL',
  });
  console.log(`row=${row.id} wall=${Date.now() - start} status=${r.status} signal=${r.signal} out=${(r.stdout ?? '').trim()}`);
}
