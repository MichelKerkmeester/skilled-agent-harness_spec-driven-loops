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
const COMMAND_PATTERN = /(?<![\w-])opencode2\s+models\b/g;

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
    // A continued line leaves a run of spaces where the line break was, so the quoted
    // command collapses every run to one space and the binary and subcommand read as the
    // single command they are.
    return {
      text: `opencode2 models${remainder}`.replace(/\s+/g, ' ').trim(),
      args: remainder.split(/\s+/).filter(Boolean),
    };
  });
}

// `--server` consumes the next token as its URL, and every other bare token is a
// positional argument the v2 command rejects. A command with neither server form
// talks to the shared background service instead of a private one.
function problemsWith(args) {
  const problems = [];
  let serverForm = false;

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token.startsWith('-')) {
      if (token === '--server') {
        const url = args[index + 1];
        // A flag in the URL slot means the server was named without an address, so
        // the command cannot reach a private server at all.
        if (url === undefined || url.startsWith('-')) {
          problems.push('--server without a URL');
        } else {
          serverForm = true;
          index += 1;
        }
      }
      continue;
    }
    problems.push(`positional argument "${token}"`);
  }

  if (!args.includes('--standalone') && !serverForm) {
    problems.push('no --standalone or --server, so it reaches the shared service');
  }

  return problems;
}

// OpenCode 2 lists only these providers, so a `models <provider>` argument naming any
// other one is a v1 command by construction. Naming one of these leaves the reader
// unable to tell which version would run the command.
const V2_PROVIDERS = new Set(['llmgateway', 'llmgateway-providers', 'cline-pass', 'opencode']);

// In a v2-only layout the v2 binary is named `opencode`, where `opencode models
// <provider>` is rejected, so a command both binaries answer to needs its version named
// beside it. A prose command lives in an inline code span. A fenced block is a shell
// transcript, and its first non-empty line is the comment that names the version for
// every command below it.
const INLINE_CODE_SPAN_PATTERN = /`([^`]*)`/g;
const V1_COMMAND_PATTERN = /(?<![\w-])opencode\s+models\b/g;
const VERSION_LABEL_PATTERN = /OpenCode 1\b|\bv1\b|1\.19/;

// The remainder ends where `commandsIn` ends it, so a pipeline, redirect, separator or
// the closing backtick of an inline span is not read as part of the command. A flag
// narrows the listing rather than naming a provider, so the provider is the first token
// that does not start with a hyphen.
function v1CommandProblems(source, lineNumber, labelled) {
  const offenders = [];

  for (const match of source.matchAll(V1_COMMAND_PATTERN)) {
    const remainder = source
      .slice(match.index + match[0].length)
      .split(REMAINDER_END_PATTERN)[0];
    const provider = remainder
      .split(/\s+/)
      .filter(Boolean)
      .find((token) => !token.startsWith('-'));
    // A placeholder or a missing provider leaves the version open the same way a v2
    // provider does; one that v2 does not list pins the command to v1 instead.
    const ambiguous =
      provider === undefined ||
      provider.startsWith('<') ||
      provider.startsWith('[') ||
      V2_PROVIDERS.has(provider);
    if (ambiguous && !labelled) {
      offenders.push({ lineNumber, text: `${match[0]}${remainder}`.trim() });
    }
  }

  return offenders;
}

function unversionedV1Forms(markdown) {
  const offenders = [];
  let inFence = false;
  let fenceLead = null;

  for (const { text: line, lineNumber } of joinContinuations(markdown.split('\n'))) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      fenceLead = null;
      continue;
    }

    if (inFence) {
      if (fenceLead === null && line.trim() !== '') fenceLead = line;
      const labelled =
        VERSION_LABEL_PATTERN.test(line) || VERSION_LABEL_PATTERN.test(fenceLead ?? '');
      offenders.push(...v1CommandProblems(line, lineNumber, labelled));
      continue;
    }

    const labelled = VERSION_LABEL_PATTERN.test(line);
    for (const span of line.matchAll(INLINE_CODE_SPAN_PATTERN)) {
      offenders.push(...v1CommandProblems(span[1], lineNumber, labelled));
    }
  }

  return offenders;
}

// A trailing backslash continues the same shell command on the next physical line, so
// the scan joins those lines into one command and carries the first line's number,
// which is where a reader has to go to fix the offender.
function joinContinuations(lines) {
  const joined = [];

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    let text = lines[index];
    while (/\\\s*$/.test(text) && index + 1 < lines.length) {
      index += 1;
      text = `${text.replace(/\\\s*$/, ' ')}${lines[index]}`;
    }
    joined.push({ text, lineNumber });
  }

  return joined;
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

  assert.ok(
    problemsWith(['--server']).some((problem) => problem.includes('--server without a URL')),
    '--server must report a problem when no URL follows it',
  );
  assert.ok(
    problemsWith(['--server', '--standalone']).some((problem) =>
      problem.includes('--server without a URL'),
    ),
    '--server must report a problem when another flag takes the URL slot',
  );
});

test('unversionedV1Forms flags only unlabelled forms OpenCode 2 would also run', () => {
  const flagged = (line) => unversionedV1Forms(line).length;

  assert.equal(
    flagged('Run `opencode models <provider>` first.'),
    1,
    'a versionless placeholder must be flagged',
  );
  assert.equal(
    flagged('Run `opencode models llmgateway` on OpenCode 1.'),
    0,
    'a named version must clear the form',
  );
  assert.equal(
    flagged('Run `opencode models opencode-go` first.'),
    0,
    'a provider OpenCode 2 does not list is v1 by construction',
  );
  assert.equal(
    flagged(['```', 'opencode models llmgateway >/dev/null', '```'].join('\n')),
    1,
    'a fenced command with no version lead must be flagged',
  );
  assert.equal(
    flagged(
      ['```', '# OpenCode 1 pre-flight', 'opencode models llmgateway >/dev/null', '```'].join('\n'),
    ),
    0,
    'a version-named fence lead must label every command in the block',
  );
  assert.equal(
    flagged('Use `opencode models <provider>` or `opencode2 models --standalone`.'),
    1,
    'a v2 form beside the v1 form must not label it',
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

test('a command continued with a backslash is read as one command', () => {
  const joined = joinContinuations(['opencode2 models \\', '  opencode-go']);
  assert.equal(joined.length, 1, 'the continuation must read as one line');
  assert.equal(joined[0].lineNumber, 1, 'the joined line reports its first physical line');

  const commands = commandsIn(joined[0].text);
  assert.equal(commands.length, 1, 'the continued command must read as one command');
  assert.deepEqual(commands[0].args, ['opencode-go']);

  assert.ok(
    problemsWith(commands[0].args).some((problem) => problem.startsWith('positional argument')),
    'a provider passed as a continued argument must still report a problem',
  );
});

test('a continuation between the binary and models is still one command', () => {
  const joined = joinContinuations(['opencode2 \\', '  models opencode-go']);
  assert.equal(joined.length, 1, 'the split binary and subcommand must read as one line');

  const commands = commandsIn(joined[0].text);
  assert.equal(commands.length, 1, 'the split binary and subcommand must read as one command');
  assert.equal(commands[0].text, 'opencode2 models opencode-go', 'the gap collapses to one space');
  assert.deepEqual(commands[0].args, ['opencode-go']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NO DOCUMENT QUOTES A FORM THE V2 BINARY REJECTS
// ─────────────────────────────────────────────────────────────────────────────

test('no doc quotes an opencode2 models form that 2.0.32 rejects or that reaches the shared service', () => {
  const offenders = [];

  const scan = (file) => {
    for (const line of joinContinuations(read(file).split('\n'))) {
      for (const command of commandsIn(line.text)) {
        const problems = problemsWith(command.args);
        if (problems.length === 0) continue;
        offenders.push(
          `${relativeToRepoRoot(file)}:${line.lineNumber}: ${command.text} (${problems.join('; ')})`,
        );
      }
    }
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

test('a prose opencode models command OpenCode 2 would also run names its version', () => {
  const offenders = [];

  const scan = (file) => {
    for (const offender of unversionedV1Forms(read(file))) {
      offenders.push(`${relativeToRepoRoot(file)}:${offender.lineNumber}: ${offender.text}`);
    }
  };

  for (const file of documents(CLI_ROOT)) scan(file);

  // The Hermes runtime carries a generated copy of this skill, so the same unlabelled
  // form must not reappear there; a checkout that has not built it yet has nothing to scan.
  if (fs.existsSync(HERMES_SKILL)) scan(HERMES_SKILL);

  assert.equal(
    offenders.join('\n'),
    '',
    `in a v2-only layout the v2 binary is named "opencode", where "opencode models <provider>" is rejected, so a prose "opencode models" command that OpenCode 2 would also run must name its version, but these do not:\n${offenders.join('\n')}`,
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

  // The section holds one block per version, so the first block that lists through a
  // standalone call is the OpenCode 2 one.
  const blocks = [];
  let block = null;
  for (const line of lines.slice(start + 1)) {
    if (block === null) {
      if (line.startsWith('#')) break;
      if (/^```bash\s*$/.test(line)) block = [];
      continue;
    }
    if (/^```\s*$/.test(line)) {
      blocks.push(block);
      block = null;
      continue;
    }
    block.push(line);
  }

  const standalone = blocks.find((fenced) =>
    fenced.some((line) => line.includes('opencode2 models --standalone')),
  );
  assert.ok(
    standalone !== undefined,
    'the provider pre-flight section has no fenced bash block with an "opencode2 models --standalone" command',
  );

  // The variable gates the default model, so a check on any other provider would report
  // the default present when only that provider is configured. LLM Gateway is the only
  // MiMo route and the other provider OpenCode 2 lists, so its own variable gates MiMo.
  assert.ok(
    standalone.some((line) =>
      /grep\s+(['"])\^opencode-go\/\1.*&&\s*OPENCODE_GO_OK=1\b/.test(line),
    ),
    `the OpenCode 2 pre-flight block must set OPENCODE_GO_OK from a listing filtered for the anchored ^opencode-go/ prefix, but it does not:\n${standalone.join('\n')}`,
  );
  assert.ok(
    standalone.some((line) =>
      /grep\s+(['"])\^llmgateway\/\1.*&&\s*LLMGATEWAY_OK=1\b/.test(line),
    ),
    `the OpenCode 2 pre-flight block must set LLMGATEWAY_OK from a listing filtered for the anchored ^llmgateway/ prefix, but it does not:\n${standalone.join('\n')}`,
  );
});
