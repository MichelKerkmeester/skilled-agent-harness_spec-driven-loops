#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Wiring Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor diagnostic for the prompt hook entry each runtime loads.
//
// WHY THIS EXISTS: the skill advisor reaches a first prompt only through the hook
// entry a runtime fires before the model sees that prompt. A runtime folder can be
// installed while its hook file is missing, its JSON is unreadable, or the entry
// was never added, and then the advisor is silent with no error at session start.
// This check names the runtime and the file to repair.
//
// Never writes. Exit 0 when every installed runtime carries its entry, 1 when one
// is missing, 2 on a bad argument or a missing root.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = [
  'Usage: hook-wiring-check.cjs --root <dir> [--json]',
  '  --root  check the checkout under <dir>.',
  '  --json  print one JSON object instead of one line per runtime.',
].join('\n');

// Each entry names the runtime folder that decides whether the check applies,
// the hook file inside it, the event that carries the prompt entry, and the path
// fragment whose presence proves the entry is wired. A runtime folder that is
// absent is skipped, because that runtime was never installed in this checkout.
const RUNTIMES = [
  {
    id: 'claude',
    dir: '.claude',
    file: '.claude/settings.json',
    event: 'UserPromptSubmit',
    marker: 'hooks/claude/user-prompt-submit.js',
  },
  {
    id: 'codex',
    dir: '.codex',
    file: '.codex/hooks.json',
    event: 'UserPromptSubmit',
    marker: 'hooks/codex/user-prompt-submit.js',
  },
  {
    id: 'cursor',
    dir: '.cursor',
    file: '.cursor/hooks.json',
    event: 'beforeSubmitPrompt',
    marker: 'hooks/cursor/user-prompt-submit.js',
  },
  {
    id: 'devin',
    dir: '.devin',
    file: '.devin/hooks.v1.json',
    event: 'UserPromptSubmit',
    marker: 'hooks/devin/user-prompt-submit.js',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(message) {
  process.stderr.write(`hook-wiring-check: ${message}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { root: null, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--root') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) fail(`--root needs a directory\n${USAGE}`);
      opts.root = path.resolve(value);
      i += 1;
    } else {
      fail(`unknown argument: ${arg}\n${USAGE}`);
    }
  }
  if (!opts.root) fail(`--root is required\n${USAGE}`);
  if (!fs.existsSync(opts.root) || !fs.statSync(opts.root).isDirectory()) {
    fail(`root not found: ${opts.root}`);
  }
  return opts;
}

// Hook files either wrap their events in a `hooks` object or place them at the
// top level, and the cursor file omits the nested hook array the others carry.
// Searching the event payload's JSON text covers all three shapes without
// teaching this check each dialect.
function eventPayload(document, event) {
  if (!document || typeof document !== 'object') return undefined;
  if (document.hooks && typeof document.hooks === 'object' && event in document.hooks) {
    return document.hooks[event];
  }
  if (event in document) return document[event];
  return undefined;
}

function inspect(runtime, root) {
  const file = path.join(root, runtime.file);
  let document;
  try {
    document = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { runtime: runtime.id, file: runtime.file, status: 'hook-missing' };
  }
  const payload = eventPayload(document, runtime.event);
  const wired = payload !== undefined && JSON.stringify(payload).includes(runtime.marker);
  return { runtime: runtime.id, file: runtime.file, status: wired ? 'ok' : 'hook-missing' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const opts = parseArgs(argv);
  const checks = RUNTIMES.map((runtime) => {
    if (!fs.existsSync(path.join(opts.root, runtime.dir))) {
      return { runtime: runtime.id, file: runtime.file, status: 'skipped' };
    }
    return inspect(runtime, opts.root);
  });

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ root: opts.root, checks }, null, 2)}\n`);
  } else {
    for (const check of checks) {
      if (check.status === 'ok') process.stdout.write(`ok ${check.runtime}\n`);
      else if (check.status === 'hook-missing') process.stdout.write(`hook-missing ${check.runtime} ${check.file}\n`);
    }
  }

  return checks.some((check) => check.status === 'hook-missing') ? 1 : 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`hook-wiring-check: ${err && err.message ? err.message : String(err)}\n`);
    process.exitCode = 2;
  }
}

module.exports = { main, eventPayload };
