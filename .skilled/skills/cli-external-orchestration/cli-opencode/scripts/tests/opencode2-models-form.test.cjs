#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: cli-opencode OpenCode 2 Models Form Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// OpenCode 2 (2.0.32) `models` takes no positional argument: `opencode2 models
// opencode-go` exits 1 with `Unexpected positional argument: "opencode-go"`, so a
// provider check written that way always reports the provider missing. Without
// `--standalone` (or `--server <url>`) the command talks to the shared background
// service, while `--standalone` runs a private server instead. Every documented
// `opencode2 models` command must therefore carry `--standalone` or `--server <url>`
// and no positional argument; a provider check filters the listing, for example
// `opencode2 models --standalone 2>/dev/null | grep '^opencode-go/' >/dev/null`.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SKILL_ROOT = path.resolve(__dirname, '..', '..');

// Sibling skills quote the command too, so the scan starts at their common parent
// rather than at this skill alone.
const CLI_ROOT = path.resolve(SKILL_ROOT, '..');

// The generated runtime copies ship outside the skill root, so they are found and
// reported from the repository root instead.
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..', '..');
const HERMES_SKILL = path.join(REPO_ROOT, '.hermes', 'skills', 'cli-opencode', 'SKILL.md');

const CLI_REFERENCE = path.join(SKILL_ROOT, 'references', 'cli-reference.md');

// History is what these trees are for, and rewriting it would falsify the record.
const SKIPPED_DIRECTORIES = new Set(['changelog', 'benchmark', 'node_modules']);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

// A hyphen or word character before `opencode2` makes a different command, so the
// lookbehind keeps a longer token from being read as this one.
const COMMAND_PATTERN = /(?<![\w-])opencode2 models\b/g;

// The remainder ends at the first shell metacharacter, so a pipeline, redirect,
// separator or closing parenthesis is left out of the quoted command. A redirect's
// file-descriptor number belongs to the redirect, not to the command, so `2>` is
// consumed whole instead of leaving a bare `2` behind as a positional argument.
const REMAINDER_END_PATTERN = /[`|&;)]|(?:^|\s)\d*>/;

function commandsIn(markdown) {
  return [...markdown.matchAll(COMMAND_PATTERN)].map((match) => {
    const lineEnd = markdown.indexOf('\n', match.index + match[0].length);
    const restOfLine = markdown.slice(
      match.index + match[0].length,
      lineEnd === -1 ? markdown.length : lineEnd,
    );
    const remainder = restOfLine.split(REMAINDER_END_PATTERN)[0];
    return {
      text: `${match[0]}${remainder}`.trim(),
      args: remainder.split(/\s+/).filter(Boolean),
    };
  });
}

// `--server` consumes the next token as its URL, and every other bare token is a
// positional argument the v2 command rejects. A command with neither server form
// talks to the shared background service instead of a private one.
function problemsWith(args) {
  const problems = [];

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token.startsWith('-')) {
      if (token === '--server') index += 1;
      continue;
    }
    problems.push(`positional argument "${token}"`);
  }

  if (!args.includes('--standalone') && !args.includes('--server')) {
    problems.push('no --standalone or --server, so it reaches the shared service');
  }

  return problems;
}

// Every document the skill tree ships, minus the historical and installed trees.
function documents(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) found.push(...documents(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      found.push(full);
    }
  }
  return found;
}

function relativeToRepoRoot(file) {
  return path.relative(REPO_ROOT, file).split(path.sep).join('/');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE ACCEPTED AND REJECTED FORMS
// ─────────────────────────────────────────────────────────────────────────────

test('problemsWith classifies the forms OpenCode 2 accepts and rejects', () => {
  assert.deepEqual(problemsWith(['--standalone']), []);
  assert.deepEqual(problemsWith(['--server', 'http://127.0.0.1:4096']), []);

  assert.ok(problemsWith([]).length > 0, 'a bare listing must report a problem');
  assert.ok(problemsWith(['opencode-go']).length > 0, 'a positional provider must report a problem');
  assert.ok(
    problemsWith(['--standalone', 'opencode-go']).length > 0,
    'a positional provider must report a problem even beside --standalone',
  );
});

test("commandsIn keeps a redirect's file descriptor out of the arguments", () => {
  const filtered = commandsIn(
    "opencode2 models --standalone 2>/dev/null | grep '^opencode-go/' >/dev/null",
  );
  assert.equal(filtered.length, 1, 'the filtered listing must read as one command');
  assert.deepEqual(filtered[0].args, ['--standalone']);

  const positional = commandsIn('opencode2 models opencode-go');
  assert.equal(positional.length, 1, 'the bare form must read as one command');
  assert.deepEqual(positional[0].args, ['opencode-go']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NO DOCUMENT QUOTES A FORM THE V2 BINARY REJECTS
// ─────────────────────────────────────────────────────────────────────────────

test('no doc quotes an opencode2 models form that 2.0.32 rejects or that reaches the shared service', () => {
  const offenders = [];

  const scan = (file) => {
    read(file)
      .split('\n')
      .forEach((line, index) => {
        for (const command of commandsIn(line)) {
          const problems = problemsWith(command.args);
          if (problems.length === 0) continue;
          offenders.push(
            `${relativeToRepoRoot(file)}:${index + 1}: ${command.text} (${problems.join('; ')})`,
          );
        }
      });
  };

  for (const file of documents(CLI_ROOT)) scan(file);

  // The Hermes runtime carries a generated copy of this skill, so the same form must
  // not reappear there; a checkout that has not built it yet has nothing to scan.
  if (fs.existsSync(HERMES_SKILL)) scan(HERMES_SKILL);

  assert.equal(
    offenders.join('\n'),
    '',
    `every documented "opencode2 models" command needs --standalone or --server <url> and no positional argument, but these do not:\n${offenders.join('\n')}`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE PROVIDER PRE-FLIGHT CHECK USES A STANDALONE LISTING
// ─────────────────────────────────────────────────────────────────────────────

test('the provider pre-flight block checks OpenCode 2 through a standalone listing', () => {
  const lines = read(CLI_REFERENCE).split('\n');
  const heading = '### Provider Auth Pre-Flight (smart fallback)';
  const start = lines.findIndex((line) => line.trim() === heading);
  assert.notEqual(start, -1, `cli-reference.md has no "${heading}" heading`);

  const block = [];
  let inFence = false;
  for (const line of lines.slice(start + 1)) {
    if (!inFence) {
      if (/^```bash\s*$/.test(line)) inFence = true;
      continue;
    }
    if (/^```\s*$/.test(line)) break;
    block.push(line);
  }

  assert.ok(block.length > 0, 'the provider pre-flight section has no fenced bash block');

  const standaloneListing = block.some((line) =>
    /opencode2 models --standalone\b.*\|\s*grep\b/.test(line),
  );
  assert.ok(
    standaloneListing,
    `the provider pre-flight block must filter a standalone listing, but it does not:\n${block.join('\n')}`,
  );
});
