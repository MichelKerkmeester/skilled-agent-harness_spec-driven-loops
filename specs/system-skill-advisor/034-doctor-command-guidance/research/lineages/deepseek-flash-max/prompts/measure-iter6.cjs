'use strict';
// Iteration 6 runner: collision analysis.
// Set A: skill-shaped control prompts that must keep their incumbent skill.
// Set B: candidate doctor phrases taken from .skilled/commands/doctor/_routes.yaml.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const L = process.argv[2];
const controls = [
  'commit my changes',
  'rebase my branch onto main',
  'write a readme for the parser module',
  'create a spec folder for the new feature',
  'improve my prompt',
  'debug the failing test',
  'run a deep review of this spec',
  'save context',
  'set up a new git worktree',
  'update the changelog'
];
const doctorPhrases = [
  'check my git hooks setup',
  'is my sk-git setup working',
  'which git rules are live',
  'pre-commit gate keeps blocking',
  'disable comment hygiene gate',
  'verify my sk-code surface',
  'does my sk-code surface route',
  'skill advisor recommends the wrong skill',
  'new skill not appearing in advisor results',
  'trigger index drift',
  'runtime mirror drift',
  'Code Mode broken',
  'skill graph freshness',
  'skill budget audit'
];

const outDir = path.join(L, 'events');
function run(prompt, file) {
  const started = Date.now();
  const result = spawnSync(
    process.execPath,
    ['.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'],
    { cwd: process.cwd(), encoding: 'utf8', timeout: 30000 },
  );
  const record = { prompt, exitCode: result.status, durationMs: Date.now() - started, stdout: result.stdout || '', stderr: result.stderr || '' };
  fs.writeFileSync(path.join(outDir, file), JSON.stringify(record, null, 2) + '\n');
  let summary = 'EMPTY';
  try {
    const payload = JSON.parse(record.stdout);
    const recs = payload?.data?.recommendations || [];
    summary = recs.map((r) => `${r.skillId} c=${r.confidence} s=${Number(r.score).toFixed(4)} ${r.dominantLane}`).join(' | ') || 'EMPTY';
  } catch (error) {
    summary = 'PARSE-ERROR';
  }
  console.log(`${prompt} -> ${summary}`);
}

console.log('--- SET A: skill-shaped controls ---');
controls.forEach((prompt, index) => run(prompt, `measure-iter6-control-${String(index + 1).padStart(2, '0')}.json`));
console.log('--- SET B: candidate doctor phrases ---');
doctorPhrases.forEach((prompt, index) => run(prompt, `measure-iter6-doctor-${String(index + 1).padStart(2, '0')}.json`));
console.log('done');
