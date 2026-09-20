#!/usr/bin/env node
// Replay a task list through router-replay.cjs against the sk-doc hub and emit
// a compact table plus the raw JSON, so a before/after comparison is byte-diffable.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = process.env.REPO_ROOT || process.cwd();
const REPLAY = path.join(REPO, '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs');
const SKILL = path.join(REPO, '.opencode/skills/sk-doc');

const tasksFile = process.argv[2];
const outPrefix = process.argv[3];
const tasks = fs.readFileSync(tasksFile, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

const rows = [];
const raw = {};
for (const task of tasks) {
  const out = execFileSync('node', [REPLAY, '--skill', SKILL, '--task', task], { encoding: 'utf8' });
  const r = JSON.parse(out);
  raw[task] = r;
  const modes = (r.intents || []).join('+') || '(none)';
  const surf = (r.surfaceIntents || []).join('+') || '(none)';
  const scores = (r.scores || []).map((s) => `${s.intent}:${s.score}`).join(' ');
  rows.push([task, modes, surf, String((r.resources || []).length), String((r.missingResources || []).length), scores]);
}

const header = ['TASK', 'STAGE1_MODES', 'STAGE2_INTENTS', 'RES', 'MISSING', 'SCORES'];
const lines = [header.join(' | '), header.map(() => '---').join(' | ')];
for (const row of rows) lines.push(row.join(' | '));
fs.writeFileSync(`${outPrefix}.md`, lines.join('\n') + '\n');
fs.writeFileSync(`${outPrefix}.json`, JSON.stringify(raw, null, 2) + '\n');
process.stdout.write(lines.join('\n') + '\n');
