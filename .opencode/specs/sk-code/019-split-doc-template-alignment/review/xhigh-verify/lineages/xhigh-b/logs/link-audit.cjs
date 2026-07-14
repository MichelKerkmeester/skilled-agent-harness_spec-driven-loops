'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = process.cwd();
const files = execFileSync(
  'git',
  ['ls-files', '--', '.opencode/skills/sk-code'],
  { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
)
  .trim()
  .split('\n')
  .filter((file) => file.endsWith('.md'));

const unresolved = [];
let linksChecked = 0;

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let inFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
    let match;
    while ((match = linkPattern.exec(line)) !== null) {
      const rawTarget = match[1].trim().replace(/^<|>$/g, '');
      if (!rawTarget
          || rawTarget.startsWith('#')
          || /^[a-z][a-z0-9+.-]*:/i.test(rawTarget)
          || rawTarget.startsWith('//')) {
        continue;
      }

      const pathOnly = rawTarget.split('#')[0].split('?')[0];
      if (!pathOnly.toLowerCase().endsWith('.md')) {
        continue;
      }

      linksChecked += 1;
      const decoded = decodeURIComponent(pathOnly);
      const resolved = decoded.startsWith('/')
        ? path.resolve(repoRoot, decoded.slice(1))
        : path.resolve(path.dirname(path.resolve(repoRoot, file)), decoded);
      if (!fs.existsSync(resolved)) {
        const before = line.slice(0, match.index);
        const through = line.slice(0, match.index + match[0].length);
        const inlineCode = (before.match(/`/g) || []).length % 2 === 1
          && (through.match(/`/g) || []).length % 2 === 1;
        unresolved.push({
          source: file,
          line: index + 1,
          target: rawTarget,
          resolved: path.relative(repoRoot, resolved),
          inlineCode,
        });
      }
    }
  }
}

process.stdout.write(`${JSON.stringify({
  markdownFiles: files.length,
  linksChecked,
  unresolvedCount: unresolved.length,
  unresolved,
}, null, 2)}\n`);
