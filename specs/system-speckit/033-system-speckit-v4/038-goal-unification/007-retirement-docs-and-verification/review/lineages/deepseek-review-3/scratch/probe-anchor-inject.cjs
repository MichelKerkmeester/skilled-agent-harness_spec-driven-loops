'use strict';
// Probe: anchor markup inside a log row against the sufficiency rule.
const { mkdirSync, writeFileSync, rmSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const CLI = join(REPO, '.opencode/hooks/goal/bin/goal.cjs');
const validator = require(`${REPO}/.opencode/skills/system-spec-kit/runtime/dist/lib/validation/spec-doc-structure.js`);
const ROOT = join(REPO, 'specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/anchor-inject');
const WS = join(ROOT, 'ws');
const STATE = join(ROOT, 'state');
const PACKET = join(WS, 'specs/t/001-fixture');

const doc = () => [
  '---',
  'title: "fixture"',
  '_memory:',
  '  continuity:',
  '    packet_pointer: "fixture"',
  '---',
  '<!-- ANCHOR:directive -->',
  '## 1. DIRECTIVE',
  '',
  'Body.',
  '',
  '<!-- /ANCHOR:directive -->',
  '',
  '<!-- ANCHOR:completion -->',
  '## 2. COMPLETION',
  '',
  '- [ ] done',
  '',
  '<!-- /ANCHOR:completion -->',
  '',
  '<!-- ANCHOR:log -->',
  '## 3. LOG',
  '',
  '| Item | State | Evidence |',
  '|------|-------|----------|',
  '',
  '<!-- /ANCHOR:log -->',
  '',
].join('\n');

rmSync(ROOT, { recursive: true, force: true });
mkdirSync(join(PACKET), { recursive: true });
mkdirSync(STATE, { recursive: true });
mkdirSync(join(WS, '.git'), { recursive: true });
writeFileSync(join(PACKET, 'goal.md'), doc(), 'utf8');

const env = { ...process.env, OPENCODE_GOAL_STATE_DIR: STATE };
const scope = ['--runtime', 'probe', '--session', 's1', '--workspace', WS];
const run = (...args) => `${spawnSync(process.execPath, [CLI, ...args], { env, encoding: 'utf8' }).stdout}`.trim();

const beforeRule = validator.runSpecDocStructureRule({ folder: PACKET, level: '1', rule: 'SPEC_DOC_SUFFICIENCY' });
console.log('BEFORE_RULE', beforeRule.status, (beforeRule.diagnostics || []).map((d) => d.code).join(',') || 'no diagnostics');
console.log('BIND', run('bind', 'specs/t/001-fixture', ...scope).split('\n')[0]);

// A row that mentions the anchor it lives under, the way a note about the document might.
const logOut = run('log', 'documented the <!-- ANCHOR:log --> section | Done | note', ...scope);
console.log('LOG', logOut.split('\n').slice(0, 3).join(' | '));
const after = readFileSync(join(PACKET, 'goal.md'), 'utf8');
console.log('ROW_WRITTEN', after.includes('documented the <!-- ANCHOR:log --> section'));
const afterRule = validator.runSpecDocStructureRule({ folder: PACKET, level: '1', rule: 'SPEC_DOC_SUFFICIENCY' });
console.log('AFTER_RULE', afterRule.status, (afterRule.diagnostics || []).map((d) => `${d.code}:${d.severity}`).join(',') || 'no diagnostics');
for (const diagnostic of (afterRule.diagnostics || [])) console.log('   ', diagnostic.code, diagnostic.severity, diagnostic.detail.slice(0, 120));
console.log('DURABLE_HASH_UNCHANGED', validator.extractGoalDurableSlice(after).length === validator.extractGoalDurableSlice(doc()).length);
