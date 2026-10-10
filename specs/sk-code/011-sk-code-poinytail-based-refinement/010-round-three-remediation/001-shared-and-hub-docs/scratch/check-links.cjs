#!/usr/bin/env node
// Resolve every path pointer in the sk-code shared tier and the hub front pages.
// Run from the repository root: node <folder>/scratch/check-links.cjs
// Checks two pointer kinds: a backticked repo-root path that starts with
// `.skilled/`, resolved from the repository root, and a markdown link target
// that starts with `./` or `../`, resolved from the linking file's folder.
// A trailing `*` or `/` is dropped so a folder pointer is tested as a folder.
// Paths holding a placeholder character (`<`, `{`, `[` or a space) are skipped.
// Prints one MISSING line per unresolved pointer, then `checked=N missing=M`.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const HUB = '.skilled/skills/sk-code';
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.md')) files.push(full);
  }
})(path.join(HUB, 'shared'));
files.push(path.join(HUB, 'SKILL.md'), path.join(HUB, 'README.md'));

// A detection test case names a hypothetical changed file as its input; it is
// an example, not a pointer, so it is not resolved.
const EXAMPLE_INPUTS = new Set(['.skilled/skills/sk-doc/scripts/preview-server.js']);
const SKIP = /[<{[\s]/;
let checked = 0;
let missing = 0;
for (const file of files.sort()) {
  const text = fs.readFileSync(file, 'utf8');
  const targets = [];
  for (const m of text.matchAll(/`(\.skilled\/[^`]+)`/g)) targets.push({ raw: m[1], base: '.' });
  for (const m of text.matchAll(/\]\((\.\.?\/[^)\s#]+)(?:#[^)]*)?\)/g)) targets.push({ raw: m[1], base: path.dirname(file) });
  for (const { raw, base } of targets) {
    const clean = raw.replace(/[*/]+$/, '').replace(/ §\d+$/, '');
    if (!clean || SKIP.test(clean) || EXAMPLE_INPUTS.has(clean)) continue;
    checked += 1;
    if (!fs.existsSync(path.join(base, clean))) {
      missing += 1;
      console.log(`MISSING ${file}: ${raw}`);
    }
  }
}
console.log(`checked=${checked} missing=${missing}`);
process.exit(missing === 0 ? 0 : 1);
