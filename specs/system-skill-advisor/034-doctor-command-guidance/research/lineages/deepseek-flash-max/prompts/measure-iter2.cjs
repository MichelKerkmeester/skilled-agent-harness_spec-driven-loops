'use strict';
// Iteration 2 runner: measure the live advisor against plain-word setup/health prompts.
// Invokes the documented front door exactly: node .skilled/bin/skill-advisor.cjs
// advisor_recommend --json '{"prompt":"..."}' --format json
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const L = process.argv[2];
const prompts = [
  'help me set up skilled',
  'is my repo set up right',
  'check my git hooks',
  'why is this rule not enforced',
  'set up my repo correctly',
  'verify my repository health',
  'is the skill setup working',
  'my hooks are not running',
  'check if my environment is configured properly',
  'something is wrong with my setup',
  'help me get started with this repo',
  'are my rules being enforced'
];

const outDir = path.join(L, 'events');
fs.mkdirSync(outDir, { recursive: true });

const results = [];
prompts.forEach((prompt, index) => {
  const started = Date.now();
  const result = spawnSync(
    process.execPath,
    ['.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'],
    { cwd: process.cwd(), encoding: 'utf8', timeout: 30000 },
  );
  const record = {
    index: index + 1,
    prompt,
    exitCode: result.status,
    signal: result.signal || null,
    durationMs: Date.now() - started,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
  fs.writeFileSync(path.join(outDir, `measure-iter2-${String(index + 1).padStart(2, '0')}.json`), JSON.stringify(record, null, 2) + '\n');
  results.push({ index: record.index, prompt, exitCode: record.exitCode, ms: record.durationMs, bytes: record.stdout.length });
  console.log(`${record.index}. exit=${record.exitCode} ms=${record.durationMs} bytes=${record.stdout.length} :: ${prompt}`);
});

fs.writeFileSync(path.join(outDir, 'measure-iter2-index.json'), JSON.stringify(results, null, 2) + '\n');
console.log('done');
