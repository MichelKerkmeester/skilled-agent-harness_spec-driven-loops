// Seed one session's hook state the way PreCompact does, then run the built
// SessionStart(source=compact) hook and print what it injects.
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
const RT = process.argv[2];
const SPEC = process.argv[3];
const sid = 'measure-purpose-' + process.pid;
const { buildMergedCompactResult, persistCompactResult } = await import(`${RT}/dist/hooks/claude/compact-inject.js`);
const { ensureStateDir, updateState, getStatePath } = await import(`${RT}/dist/hooks/claude/hook-state.js`);
ensureStateDir();
const transcript = [
  `Reading ${SPEC}/spec.md and ${SPEC}/research/research.md`,
  'Edited buildCompactContext( and buildCompactContext( in the hook',
  `Working in ${SPEC}/004-compaction-purpose-line/plan.md`,
];
const result = await buildMergedCompactResult(transcript, process.cwd());
persistCompactResult(sid, result, new Date().toISOString(), null);
updateState(sid, { lastSpecFolder: SPEC });
const run = spawnSync(process.execPath, [`${RT}/dist/hooks/claude/session-prime.js`], {
  input: JSON.stringify({ source: 'compact', session_id: sid }), encoding: 'utf8', cwd: process.cwd(),
});
process.stdout.write(run.stdout);
process.stdout.write(`\n--- exit=${run.status} purpose_heading=${(run.stdout.match(/^## Packet Purpose/gm) ?? []).length} purpose_text=${run.stdout.includes("Find where a packet") ? 1 : 0}\n`);
rmSync(getStatePath(sid), { force: true });
