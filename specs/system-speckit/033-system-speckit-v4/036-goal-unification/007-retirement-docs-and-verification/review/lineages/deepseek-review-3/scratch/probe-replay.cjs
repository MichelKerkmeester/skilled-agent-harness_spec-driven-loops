'use strict';
// Probe: rebind archiving, packet_state missing + hint, and the text-set truncation report.
const { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, readdirSync, unlinkSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const CLI = join(REPO, '.opencode/hooks/goal/bin/goal.cjs');
const ROOT = join(REPO, 'specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/replay');
const WS = join(ROOT, 'ws');
const STATE = join(ROOT, 'state');

function doc(label) {
  return [
    '---',
    `title: "${label}"`,
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${label}"`,
    '---',
    '<!-- ANCHOR:directive -->',
    '## 1. DIRECTIVE',
    '',
    `Directive body for ${label}.`,
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
  ].join('\n');
}

rmSync(ROOT, { recursive: true, force: true });
mkdirSync(join(WS, '.git'), { recursive: true });
mkdirSync(join(WS, 'specs/t/001-alpha'), { recursive: true });
mkdirSync(join(WS, 'specs/t/002-beta'), { recursive: true });
writeFileSync(join(WS, 'specs/t/001-alpha/goal.md'), doc('alpha'), 'utf8');
writeFileSync(join(WS, 'specs/t/002-beta/goal.md'), doc('beta'), 'utf8');
mkdirSync(STATE, { recursive: true });

const env = { ...process.env, OPENCODE_GOAL_STATE_DIR: STATE };
const scope = ['--runtime', 'probe', '--session', 's1', '--workspace', WS];
const run = (...args) => {
  const out = spawnSync(process.execPath, [CLI, ...args], { env, encoding: 'utf8' });
  return `${out.stdout}${out.stderr}`.trim();
};

console.log('BIND_ALPHA', run('bind', 'specs/t/001-alpha', ...scope).split('\n')[0]);
console.log('REBIND_BETA', run('bind', 'specs/t/002-beta', ...scope).split('\n').slice(0, 2).join(' | '));
const history = run('history', ...scope);
console.log('HISTORY_AFTER_REBIND', history.split('\n').filter((line) => /archive_count|archive_0_file|archive_0_objective/.test(line)).join(' | '));
const archiveRoot = join(STATE, '.archive');
console.log('ARCHIVE_TREE', existsSync(archiveRoot) ? readdirSync(archiveRoot, { recursive: true }).filter((p) => String(p).endsWith('.json')).length + ' file(s)' : 'absent');
const archived = existsSync(archiveRoot)
  ? readdirSync(archiveRoot, { recursive: true }).filter((p) => String(p).endsWith('.json')).map((p) => {
    try { return JSON.parse(readFileSync(join(archiveRoot, String(p)), 'utf8')).packetPath; } catch { return 'unreadable'; }
  })
  : [];
console.log('ARCHIVED_PACKETS', JSON.stringify(archived));

// packet_state=missing plus the hint, and what a text set reports past the cap.
unlinkSync(join(WS, 'specs/t/002-beta/goal.md'));
const show = run('show', ...scope);
console.log('SHOW_MISSING', show.split('\n').filter((line) => /packet_state|packet_bound|hint=|injection_preview/.test(line)).map((l) => l.slice(0, 80)).join(' | '));
const long = 'z'.repeat(4500);
const setOut = run('set', long, ...scope);
console.log('SET_TRUNCATION', setOut.split('\n').filter((line) => /STATUS|warning=/.test(line)).map((l) => l.slice(0, 120)).join(' | '));
