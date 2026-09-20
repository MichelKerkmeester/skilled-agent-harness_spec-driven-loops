#!/usr/bin/env node
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Root farm integrity for the rule corpus
// ─────────────────────────────────────────────────────────────────────────────
// The corpus lives in one canonical directory, and the public path at the
// repository root is a per-entry symlink farm so every consumer that names the
// public path keeps resolving. A single whole-directory link was rejected: it
// degrades to one text file on a clone without symlink support, and it hides
// which files exist. That leaves exactly one failure to guard. A root entry can
// be deleted, retargeted or replaced by a real file, and a canonical file can be
// added with no entry reaching it -- in both cases the public path stops
// carrying what it claims to carry, silently. So: every canonical file has
// exactly one link pointing at it, every link resolves, and the farm holds
// nothing else.
//
// Usage: node check-farm.cjs [--root <dir>]
// Exit 0 when the farm matches the canonical directory, 1 on drift, 2 on error.

const fs = require('node:fs');
const path = require('node:path');

const CANONICAL = path.join('.skilled', 'repo-rules');
const FARM = 'repo-rules';
const TAG = '[farm-check]';

function parseArgs(argv) {
  let root = process.cwd();
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--root' && argv[index + 1]) {
      root = path.resolve(argv[index + 1]);
      index += 1;
    }
  }
  return { root };
}

function listCorpus(root) {
  const dir = path.join(root, CANONICAL);
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir).filter((name) => name.endsWith('.md')).sort();
}

function main() {
  const { root } = parseArgs(process.argv.slice(2));
  const corpus = listCorpus(root);
  if (corpus === null) {
    console.error(`${TAG} ERROR: no ${CANONICAL} under ${root}`);
    return 2;
  }

  const farmDir = path.join(root, FARM);
  if (!fs.existsSync(farmDir)) {
    console.error(`${TAG} ERROR: no ${FARM}/ under ${root}`);
    return 2;
  }

  const problems = [];
  let links = 0;
  const reached = new Set();

  for (const name of corpus) {
    const entry = path.join(farmDir, name);
    let stat;
    try {
      stat = fs.lstatSync(entry);
    } catch {
      problems.push(`${name}: no farm entry reaches it`);
      continue;
    }
    if (!stat.isSymbolicLink()) {
      problems.push(`${name}: farm entry is a real file, not a link`);
      continue;
    }
    const target = fs.readlinkSync(entry);
    const expected = path.join('..', CANONICAL, name);
    if (target !== expected) problems.push(`${name}: points at ${target}, not ${expected}`);
    if (!fs.existsSync(entry)) problems.push(`${name}: does not resolve`);
    links += 1;
    reached.add(name);
  }

  for (const name of fs.readdirSync(farmDir).sort()) {
    if (!corpus.includes(name)) problems.push(`${name}: farm entry reaches nothing in the corpus`);
  }

  if (problems.length > 0) {
    console.error(`${TAG} FAILED files=${corpus.length} links=${links}`);
    for (const problem of problems.slice(0, 8)) console.error(`${TAG}   ${problem}`);
    if (problems.length > 8) console.error(`${TAG}   (+${problems.length - 8} more)`);
    return 1;
  }

  console.log(`${TAG} PASSED files=${corpus.length} links=${links} every link resolves`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}
