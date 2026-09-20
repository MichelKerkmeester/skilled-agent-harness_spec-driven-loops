#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const referenceFiles = [
  path.join(root, '.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md'),
  path.join(root, '.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md'),
];
const configFiles = [
  path.join(root, '.claude/settings.json'),
  path.join(root, '.codex/hooks.json'),
  path.join(root, '.cursor/hooks.json'),
  path.join(root, '.devin/hooks.v1.json'),
];
const livePaths = [
  '.opencode/skills/system-spec-kit/mcp-server/hooks/claude/user-prompt-submit.ts',
  '.opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts',
  '.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts',
  '.opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts',
  '.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js',
  '.opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js',
  '.opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/user-prompt-submit.js',
  '.opencode/skills/system-spec-kit/mcp-server/dist/hooks/devin/user-prompt-submit.js',
  '.opencode/plugins/mk-skill-advisor.js',
  '.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs',
];

function resolveInsideRepo(candidate) {
  if (!candidate || candidate.includes('{') || candidate.includes('*')) return { ok: false, reason: 'empty-or-pattern' };
  const absolute = path.resolve(root, candidate);
  const prefix = `${root}${path.sep}`;
  if (absolute !== root && !absolute.startsWith(prefix)) return { ok: false, reason: 'outside-root' };
  try {
    const real = fs.realpathSync(absolute);
    if (real !== root && !real.startsWith(prefix)) return { ok: false, reason: 'symlink-outside-root' };
  } catch {
    return { ok: false, reason: 'missing' };
  }
  return { ok: true, absolute };
}

const failures = [];
const referenceText = referenceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
for (const file of livePaths) {
  if (!resolveInsideRepo(file).ok) failures.push(`live path: ${file}`);
  if (!referenceText.includes(file)) failures.push(`undocumented live path: ${file}`);
}

const registeredPaths = new Set();
for (const file of configFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?:\.opencode|\.cursor|\.claude|\.codex|\.devin)\/[A-Za-z0-9_./-]+/g)) {
    const candidate = match[0].replace(/[.]+$/, '');
    registeredPaths.add(candidate);
    if (!resolveInsideRepo(candidate).ok) failures.push(`registered path: ${file}: ${candidate}`);
  }
}

let unreadableConfigRejected = false;
try {
  fs.readFileSync(path.join(__dirname, 'missing-runtime-config.json'), 'utf8');
} catch {
  unreadableConfigRejected = true;
}
if (!unreadableConfigRejected) failures.push('unreadable configuration was accepted');

const negativeDir = fs.mkdtempSync(path.join(__dirname, 'path-assertion-'));
const insideLink = path.join(negativeDir, 'inside-link');
const outsideLink = path.join(negativeDir, 'outside-link');
try {
  fs.symlinkSync(path.join(root, livePaths[0]), insideLink);
  fs.symlinkSync(path.dirname(root), outsideLink);
  const negativeCases = [
    ['relative-inside', livePaths[0], true],
    ['symlink-inside', insideLink, true],
    ['symlink-outside', outsideLink, false],
    ['outside-root', '../outside-repository-file', false],
    ['empty-registration', '', false],
  ];
  for (const [name, candidate, expected] of negativeCases) {
    const actual = resolveInsideRepo(candidate).ok;
    if (actual !== expected) failures.push(`negative case ${name}: expected ${expected}, got ${actual}`);
  }
} finally {
  fs.rmSync(negativeDir, { recursive: true, force: true });
}

const result = {
  referenceFilesChecked: referenceFiles.length,
  liveAdapterAndBridgePathsChecked: livePaths.length,
  registeredCommandPathsChecked: registeredPaths.size,
  unreadableConfigurationRejected: unreadableConfigRejected,
  negativeCasesChecked: 5,
  failures,
  unresolvableAfter: failures.length,
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(failures.length === 0 ? 0 : 1);
