#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: cli-opencode OpenCode 2 Models Form Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// OpenCode 2 `models` takes no positional argument: on 2.3.2, `opencode models
// opencode-go` exits 1 with `Unexpected positional argument: "opencode-go"`, so a
// provider check written that way always reports the provider missing. Without
// `--standalone` (or `--server <url>`) the command talks to the shared background
// service, while `--standalone` runs a private server instead. A documented models
// command must therefore carry `--standalone` or `--server <url>` and no positional
// argument; a provider check filters the listing, for example
// `opencode models --standalone 2>/dev/null | grep '^opencode-go/' >/dev/null`.
// The scan reads every `opencode models` command that carries a server form.

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

// Offenders are reported from the repository root, since the scan spans sibling skills.
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..', '..');

const CLI_REFERENCE = path.join(SKILL_ROOT, 'references', 'cli-reference.md');

// History is what these trees are for, and rewriting it would falsify the record.
const SKIPPED_DIRECTORIES = new Set(['changelog', 'benchmark', 'node_modules']);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

// A hyphen or word character before the binary makes a different command, so the
// lookbehind keeps a longer token from being read as this one.
const COMMAND_PATTERN = /(?<![\w-])opencode\s+models\b/g;
const SERVER_FORM_PATTERN = /(?:^|\s)--(?:standalone|server)\b/;

// The remainder ends at the first shell metacharacter, so a pipeline, redirect,
// separator or closing parenthesis is left out of the quoted command. A redirect's
// file-descriptor number belongs to the redirect, not to the command, so `2>` is
// consumed whole instead of leaving a bare `2` behind as a positional argument.
const REMAINDER_END_PATTERN = /[`|&;)]|(?:^|\s)\d*>/;

function commandsIn(markdown) {
  // A bare `opencode models` with no server form is left alone, so prose that names the
  // subcommand is not read as a command to check.
  return [...markdown.matchAll(COMMAND_PATTERN)].flatMap((match) => {
    const lineEnd = markdown.indexOf('\n', match.index + match[0].length);
    const restOfLine = markdown.slice(
      match.index + match[0].length,
      lineEnd === -1 ? markdown.length : lineEnd,
    );
    const remainder = restOfLine.split(REMAINDER_END_PATTERN)[0];
    // A continued line leaves a run of spaces where the line break was, so the quoted
    // command collapses every run to one space and the binary and subcommand read as the
    // single command they are.
    if (!SERVER_FORM_PATTERN.test(remainder)) return [];
    return [{
      text: `opencode models${remainder}`.replace(/\s+/g, ' ').trim(),
      args: remainder.split(/\s+/).filter(Boolean),
    }];
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

// A prose command lives in an inline code span, and a clause boundary is where one
// sentence or table cell ends and the next begins.
const INLINE_CODE_SPAN_PATTERN = /`([^`]*)`/g;

// A prose line can hold more than one clause, so a boundary is measured on the line
// itself. The line is masked before the split, because a `.` or `|` inside backticks
// belongs to the command rather than to the sentence or table around it.
const CLAUSE_BOUNDARY_PATTERN = /\||;|[.!?](?=\s|$)|, or | — /g;

// Clause ranges are measured on a copy whose inline code spans are replaced by
// boundary-free placeholders of the same length, so a command is never cut in two.
function clauseRanges(line) {
  const masked = line.replace(INLINE_CODE_SPAN_PATTERN, (span) => 'x'.repeat(span.length));
  const ranges = [];
  let start = 0;

  for (const boundary of masked.matchAll(CLAUSE_BOUNDARY_PATTERN)) {
    ranges.push({ start, end: boundary.index });
    start = boundary.index + boundary[0].length;
  }

  ranges.push({ start, end: line.length });
  return ranges;
}


// A listing command written as prose reads like a command but is never checked by the
// fenced-block scan, so it must be quoted like every runnable example. The match is
// case-sensitive, because the capitalised "OpenCode models" is the product name rather
// than a command.
const UNQUOTED_LISTING_PATTERN = /(?<![\w-])opencode\s+models\b/g;

function unquotedListingCommands(markdown) {
  const offenders = [];
  let inFence = false;

  for (const { text: line, lineNumber } of joinContinuations(markdown.split('\n'))) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // The span is replaced by a space so its removal cannot join two words into a token
    // the lookbehind would then read as part of a longer name.
    const prose = line.replace(INLINE_CODE_SPAN_PATTERN, ' ');
    for (const match of prose.matchAll(UNQUOTED_LISTING_PATTERN)) {
      offenders.push({ lineNumber, text: line.trim(), command: match[0] });
    }
  }

  return offenders;
}

// A note that sends a reader to the standalone listing is only useful when it says what
// to look for. OpenCode 2 prints ids as `<provider>/<model>`, so the note has to name
// the prefix, filter or grep for it, or quote a span ending in `/`.
const LISTING_NOTE_PATTERN = /opencode models --standalone\b/;
const CHECK_WORD_PATTERN = /\b(check|checks|checking|confirm|confirms|confirmed|confirming)\b/i;
const PREFIX_WORD_PATTERN = /\bprefix(?:es)?\b/i;
const FILTER_WORD_PATTERN = /\bfilter(?:ed)?\b/i;
const GREP_WORD_PATTERN = /\bgrep\b/i;

function unprefixedListingNotes(markdown) {
  const offenders = [];
  let inFence = false;

  for (const { text: line, lineNumber } of joinContinuations(markdown.split('\n'))) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    for (const { start, end } of clauseRanges(line)) {
      const clause = line.slice(start, end);
      if (!LISTING_NOTE_PATTERN.test(clause)) continue;
      if (!CHECK_WORD_PATTERN.test(clause)) continue;

      // A code span is not prose, so a word inside one cannot explain what the note asks
      // the reader to look for. Only the prose is searched for the prefix, filter or grep.
      const prose = clause.replace(INLINE_CODE_SPAN_PATTERN, ' ');
      if (PREFIX_WORD_PATTERN.test(prose)) continue;
      if (FILTER_WORD_PATTERN.test(prose)) continue;
      if (GREP_WORD_PATTERN.test(prose)) continue;

      const spans = [...clause.matchAll(INLINE_CODE_SPAN_PATTERN)].map((match) => match[1]);
      if (spans.some((span) => span.endsWith('/'))) continue;
      // A span carrying both the listing and its grep is the filtered command itself.
      if (spans.some((span) => /opencode models --standalone/.test(span) && GREP_WORD_PATTERN.test(span))) {
        continue;
      }

      offenders.push({ lineNumber, text: clause.trim() });
    }
  }

  return offenders;
}

// A trailing backslash continues the same shell command on the next physical line, and
// bash removes the backslash-newline pair without inserting anything, so two words split
// across it join into one. The scan joins those lines and carries the first line's number,
// which is where a reader has to go to fix the offender.
function joinContinuations(lines) {
  const joined = [];

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    let text = lines[index];
    while (/\\\s*$/.test(text) && index + 1 < lines.length) {
      index += 1;
      text = `${text.replace(/\\\s*$/, '')}${lines[index]}`;
    }
    joined.push({ text, lineNumber });
  }

  return joined;
}

// A shell comment names and explains a step without running it, so it is not part of
// what the block does. A `#` starts a comment only at the start of a line or after
// whitespace or a separator, and never inside a quote, so a `#` in a URL or a quoted
// argument survives. A `)` that closes a `$(` belongs to the word, so a `#` after it
// does too.
function activeShellLines(lines) {
  return lines
    .map((line) => {
      let quote = null;
      const parentheses = [];
      let closedSubstitution = false;

      for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const previousClosedSubstitution = closedSubstitution;
        closedSubstitution = false;

        if (quote === "'") {
          if (char === "'") quote = null;
          continue;
        }
        if (quote === '"') {
          if (char === '\\') {
            index += 1;
          } else if (char === '"') {
            quote = null;
          } else if (char === '$' && line[index + 1] === '(') {
            parentheses.push(true);
            index += 1;
          } else if (char === ')' && parentheses[parentheses.length - 1] === true) {
            parentheses.pop();
            closedSubstitution = true;
          }
          continue;
        }

        if (char === '\\') {
          index += 1;
        } else if (char === "'" || char === '"') {
          quote = char;
        } else if (char === '$' && line[index + 1] === '(') {
          parentheses.push(true);
          index += 1;
        } else if (char === '(') {
          parentheses.push(false);
        } else if (char === ')') {
          closedSubstitution = parentheses.pop() === true;
        } else if (
          char === '#' &&
          (index === 0 ||
            /[\s;|&(]/.test(line[index - 1]) ||
            (line[index - 1] === ')' && !previousClosedSubstitution))
        ) {
          return line.slice(0, index).trimEnd();
        }
      }

      return line;
    })
    .filter((line) => line.trim() !== '');
}

// Continuations are joined before comments are stripped, so a continued line is read as
// the single shell line it is instead of a physical line that starts with `#`.
function activeBlockLines(block) {
  return activeShellLines(joinContinuations(block).map((entry) => entry.text));
}

// Top-level shell segments split only where `|`, `||`, `&&` or `;` is an operator, so
// a separator inside a quote or `$(...)` stays in its segment.
function shellSegments(line) {
  const segments = [];
  const parentheses = [];
  let quote = null;
  let start = 0;
  let operator = null;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (quote === "'") {
      if (char === "'") quote = null;
      continue;
    }
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
      } else if (char === '"') {
        quote = null;
      } else if (char === '$' && line[index + 1] === '(') {
        parentheses.push(true);
        index += 1;
      } else if (char === ')' && parentheses[parentheses.length - 1] === true) {
        parentheses.pop();
      }
      continue;
    }

    if (char === '\\') {
      index += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === '$' && line[index + 1] === '(') {
      parentheses.push(true);
      index += 1;
      continue;
    }
    if (char === '(') {
      parentheses.push(false);
      continue;
    }
    if (char === ')') {
      parentheses.pop();
      continue;
    }
    if (parentheses.some(Boolean)) continue;

    let separator = null;
    if (char === ';') {
      separator = ';';
    } else if (char === '|') {
      separator = line[index + 1] === '|' ? '||' : '|';
    } else if (char === '&' && line[index + 1] === '&') {
      separator = '&&';
    }
    if (separator === null) continue;

    const text = line.slice(start, index).trim();
    if (text !== '') segments.push({ text, operator });
    operator = separator;
    index += separator.length - 1;
    start = index + 1;
  }

  const text = line.slice(start).trim();
  if (text !== '') segments.push({ text, operator });
  return segments;
}

// Quotes and braces are shell spelling, so `$NAME`, `"$NAME"` and `"${NAME}"` all reduce
// to the name a source command has to name.
function shellWords(text) {
  const words = [];
  let word = '';
  let quote = null;
  let substitutionDepth = 0;

  const flush = () => {
    if (word !== '') words.push(word);
    word = '';
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (quote === "'") {
      if (char === "'") quote = null;
      else word += char;
      continue;
    }
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
        if (index < text.length) word += text[index];
      } else if (char === '"') {
        quote = null;
      } else {
        word += char;
      }
      continue;
    }

    if (char === '\\') {
      index += 1;
      if (index < text.length) word += text[index];
    } else if (char === "'" || char === '"') {
      quote = char;
    } else if (char === '$' && text[index + 1] === '(') {
      substitutionDepth += 1;
      word += '$(';
      index += 1;
    } else if (char === ')' && substitutionDepth > 0) {
      substitutionDepth -= 1;
      word += char;
    } else if (/\s/.test(char) && substitutionDepth === 0) {
      flush();
    } else {
      word += char;
    }
  }

  flush();
  return words;
}

const VARIABLE_ARGUMENT_PATTERN = /^\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))$/;
const GREP_PATTERN = /^grep(?:\s+-[^\s]+)*\s+(['"])\^([^/'"\s]+)\/\1(?:\s*\d*(?:>>?|<)\s*\S+)*\s*$/;
const OK_VARIABLE_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*_OK)=1$/;

function listingSource(text) {
  if (/^opencode\s+models\s+--standalone(?:\s|$)/.test(text)) return { direct: true };
  if (!/^(?:printf|echo)\b/.test(text)) return null;

  const words = shellWords(text)
    .slice(1)
    .filter((word) => !/^\d*(?:>>?|<)/.test(word));
  const last = words[words.length - 1];
  const variable = last === undefined ? null : last.match(VARIABLE_ARGUMENT_PATTERN);
  return variable === null ? null : { name: variable[1] ?? variable[2] };
}

function grepListing(text) {
  const match = text.match(GREP_PATTERN);
  return match === null ? null : { provider: match[2] };
}

// A provider check counts only when a source segment feeds a grep segment, and an
// `_OK=1` assignment follows that grep through `&&`.
function providerCheck(line) {
  const [source, grep, assignment] = shellSegments(line);
  if (
    source === undefined ||
    grep === undefined ||
    assignment === undefined ||
    source.operator !== null ||
    grep.operator !== '|' ||
    assignment.operator !== '&&'
  ) {
    return null;
  }

  const listing = grepListing(grep.text);
  const ok = assignment.text.match(OK_VARIABLE_PATTERN);
  if (listing === null || ok === null) return null;
  return { source: source.text, provider: listing.provider, variable: ok[1] };
}

function providerCheckIndex(lines, provider, variable) {
  return lines.findIndex((line) => {
    const check = providerCheck(line);
    return (
      check !== null &&
      check.provider === provider &&
      (variable === undefined || check.variable === variable)
    );
  });
}

// The last assignment before the grep wins, so a later line that fills the variable
// from another command invalidates the check even if an earlier line used the listing.
function lastAssignedValue(lines, beforeIndex, name) {
  let value = null;

  for (const line of lines.slice(0, beforeIndex)) {
    for (const segment of shellSegments(line)) {
      const assignment = segment.text.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (assignment !== null && assignment[1] === name) value = assignment[2].trim();
    }
  }

  return value;
}

// The variable has to hold the listing and nothing else, so the value is one command
// substitution of the standalone listing with only redirects inside, optionally quoted.
// A second command or pipeline in the substitution changes what the grep reads.
const STANDALONE_LISTING_VALUE_PATTERN =
  /^\$\(\s*opencode\s+models\s+--standalone(?:\s+\d*(?:>>?|<)\s*\S+)*\s*\)$/;
const QUOTED_VALUE_PATTERN = /^"([^"]*)"$/;

function holdsStandaloneListing(value) {
  const quoted = value.match(QUOTED_VALUE_PATTERN);
  return STANDALONE_LISTING_VALUE_PATTERN.test(quoted === null ? value : quoted[1]);
}

// A provider check is only meaningful against the standalone listing. The matching grep
// can pipe that listing in directly, or pipe a variable whose last assignment came from
// `opencode models --standalone`. Returns null when it does, or the reason it does not,
// naming the variable that has to hold the listing.
function standaloneListingProblem(lines, grepIndex) {
  const check = providerCheck(lines[grepIndex]);
  if (check === null) {
    return 'the grep must filter output piped from "opencode models --standalone"';
  }

  const source = listingSource(check.source);
  if (source === null) {
    return 'the grep must filter output piped from "opencode models --standalone"';
  }
  if (source.direct) return null;

  const value = lastAssignedValue(lines, grepIndex, source.name);
  return value !== null && holdsStandaloneListing(value)
    ? null
    : `"$${source.name}" must come from "opencode models --standalone" earlier in the block`;
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

test("commandsIn keeps a redirect's file descriptor out of the arguments", () => {
  const filtered = commandsIn(
    "opencode models --standalone 2>/dev/null | grep '^opencode-go/' >/dev/null",
  );
  assert.equal(filtered.length, 1, 'the filtered listing must read as one command');
  assert.deepEqual(filtered[0].args, ['--standalone']);

  const positional = commandsIn('opencode models --standalone opencode-go');
  assert.equal(positional.length, 1, 'the positional form must read as one command');
  assert.deepEqual(positional[0].args, ['--standalone', 'opencode-go']);

  assert.deepEqual(commandsIn('opencode models opencode-go'), [], 'a bare form with no server form is not read');
});

test('a command continued with a backslash is read as one command', () => {
  const joined = joinContinuations(['opencode models --standalone \\', '  opencode-go']);
  assert.equal(joined.length, 1, 'the continuation must read as one line');
  assert.equal(joined[0].lineNumber, 1, 'the joined line reports its first physical line');

  const commands = commandsIn(joined[0].text);
  assert.equal(commands.length, 1, 'the continued command must read as one command');
  assert.deepEqual(commands[0].args, ['--standalone', 'opencode-go']);

  assert.ok(
    problemsWith(commands[0].args).some((problem) => problem.startsWith('positional argument')),
    'a provider passed as a continued argument must still report a problem',
  );
});

test('a continuation between the binary and models is still one command', () => {
  const joined = joinContinuations(['opencode \\', '  models --standalone opencode-go']);
  assert.equal(joined.length, 1, 'the split binary and subcommand must read as one line');

  const commands = commandsIn(joined[0].text);
  assert.equal(commands.length, 1, 'the split binary and subcommand must read as one command');
  assert.equal(commands[0].text, 'opencode models --standalone opencode-go', 'the gap collapses to one space');
  assert.deepEqual(commands[0].args, ['--standalone', 'opencode-go']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NO DOCUMENT QUOTES A FORM THE V2 BINARY REJECTS
// ─────────────────────────────────────────────────────────────────────────────

test('no doc quotes a models form that OpenCode 2 rejects or that reaches the shared service', () => {
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

  assert.equal(
    offenders.join('\n'),
    '',
    `every documented models command needs --standalone or --server <url> and no positional argument, but these do not:\n${offenders.join('\n')}`,
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

  const standalone = blocks
    .map(activeBlockLines)
    .find((fenced) => fenced.some((line) => /opencode models --standalone\b/.test(line)));
  assert.ok(
    standalone !== undefined,
    'the provider pre-flight section has no fenced bash block with an "opencode models --standalone" command',
  );

  // Each provider is checked against its own anchored prefix into its own variable, so a check
  // on one provider can never report another one present. LLM Gateway hosts the default model
  // on both versions and DEFAULT_OK is copied from LLMGATEWAY_OK, so that check gates the
  // default. opencode-go is the other provider OpenCode 2 can list, and it keeps its own variable.
  const goIndex = providerCheckIndex(standalone, 'opencode-go', 'OPENCODE_GO_OK');
  assert.notEqual(
    goIndex,
    -1,
    `the OpenCode 2 pre-flight block must set OPENCODE_GO_OK from a listing filtered for the anchored ^opencode-go/ prefix, but it does not:\n${standalone.join('\n')}`,
  );
  const goProblem = standaloneListingProblem(standalone, goIndex);
  assert.equal(
    goProblem,
    null,
    `the OpenCode 2 pre-flight block must set OPENCODE_GO_OK from the standalone "opencode models --standalone" listing filtered for the anchored ^opencode-go/ prefix; ${goProblem}:\n${standalone[goIndex]}`,
  );

  const llmIndex = providerCheckIndex(standalone, 'llmgateway', 'LLMGATEWAY_OK');
  assert.notEqual(
    llmIndex,
    -1,
    `the OpenCode 2 pre-flight block must set LLMGATEWAY_OK from a listing filtered for the anchored ^llmgateway/ prefix, but it does not:\n${standalone.join('\n')}`,
  );
  const llmProblem = standaloneListingProblem(standalone, llmIndex);
  assert.equal(
    llmProblem,
    null,
    `the OpenCode 2 pre-flight block must set LLMGATEWAY_OK from the standalone "opencode models --standalone" listing filtered for the anchored ^llmgateway/ prefix; ${llmProblem}:\n${standalone[llmIndex]}`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. THE COMMENT STRIPPER AND THE LISTING IT LEAVES ACTIVE
// ─────────────────────────────────────────────────────────────────────────────

test('the shell comment stripper is quote-aware', () => {
  const stripped = (line) => activeShellLines([line]);

  assert.deepEqual(
    stripped('echo "a # b"'),
    ['echo "a # b"'],
    'a # inside double quotes is not a comment',
  );
  assert.deepEqual(
    stripped("echo 'a # b'"),
    ["echo 'a # b'"],
    'a # inside single quotes is not a comment',
  );
  assert.deepEqual(stripped('echo a # comment'), ['echo a'], 'a # after whitespace starts a comment');
  assert.deepEqual(
    stripped('echo "x" # it\'s fine\' && grep \'^opencode-go/\' >/dev/null && OPENCODE_GO_OK=1'),
    ['echo "x"'],
    'a quote inside the comment must not hide the comment start',
  );
  assert.deepEqual(
    stripped('echo a\\#b # c'),
    ['echo a\\#b'],
    'an escaped # is not a comment start',
  );
  assert.deepEqual(stripped('# whole line'), [], 'a whole-line comment leaves no active line');
  assert.deepEqual(stripped('x=1;# c'), ['x=1;'], 'a # after a separator starts a comment');
  assert.deepEqual(
    stripped('url=http://h/#frag'),
    ['url=http://h/#frag'],
    'a # inside a word is not a comment',
  );

  const substitution = 'V2=$(opencode models --standalone)#x; printf \'%s\\n\' "$V2" | grep \'^llmgateway/\' >/dev/null && LLMGATEWAY_OK=1';
  assert.deepEqual(
    stripped(substitution),
    [substitution],
    'a # after a ) that closes a $(...) belongs to the word, so the grep stays active',
  );
  assert.deepEqual(
    stripped('(echo hi)# comment'),
    ['(echo hi)'],
    'a # after a plain subshell close still starts a comment',
  );
});

test('a prefix grep that reads another listing does not count', () => {
  const fromStandalone = [
    'V2_MODELS=$(opencode models --standalone 2>/dev/null)',
    "printf '%s\\n' \"$V2_MODELS\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  assert.equal(
    standaloneListingProblem(fromStandalone, 1),
    null,
    'a grep over a variable filled from the standalone listing must count',
  );

  const fromProviders = [
    'OTHER=$(opencode providers list)',
    "printf '%s\\n' \"$OTHER\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  assert.match(
    standaloneListingProblem(fromProviders, 1),
    /"\$OTHER" must come from "opencode models --standalone"/,
    'a grep over another listing must name the variable that has to hold the standalone listing',
  );

  const direct = [
    "opencode models --standalone 2>/dev/null | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  assert.equal(
    standaloneListingProblem(direct, 0),
    null,
    'a grep piped directly from the standalone listing must count',
  );

  const quotedPipe = [
    'V2=$(opencode models --standalone 2>/dev/null)',
    "printf '%s|\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  assert.equal(
    standaloneListingProblem(quotedPipe, 1),
    null,
    'a | inside a quoted printf format must not split the source segment',
  );

  const directDoubleQuotedPattern = [
    'opencode models --standalone 2>/dev/null | grep "^opencode-go/" >/dev/null && OPENCODE_GO_OK=1',
  ];
  assert.equal(
    standaloneListingProblem(directDoubleQuotedPattern, 0),
    null,
    'a grep pattern in double quotes piped from the standalone listing must count',
  );

  const quotedEcho = [
    'V2_MODELS=$(opencode models --standalone 2>/dev/null)',
    'echo "printf x | grep \'^llmgateway/\' >/dev/null && LLMGATEWAY_OK=1"',
  ];
  assert.notEqual(
    standaloneListingProblem(quotedEcho, 1),
    null,
    'a provider check quoted inside an echo argument must not count',
  );

  const reassigned = [
    'V2_MODELS=$(opencode models --standalone 2>/dev/null)',
    'V2_MODELS=$(opencode providers list)',
    'printf \'%s\\n\' "$V2_MODELS" | grep \'^llmgateway/\' >/dev/null && LLMGATEWAY_OK=1',
  ];
  assert.match(
    standaloneListingProblem(reassigned, 2),
    /"\$V2_MODELS" must come from "opencode models --standalone"/,
    'a later reassignment from another listing must fail and name the variable',
  );

  const fakeListing = [
    "V2=$(opencode models --standalone 2>/dev/null; printf 'opencode-go/fake\\n')",
    "printf '%s\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  assert.match(
    standaloneListingProblem(fakeListing, 1),
    /"\$V2" must come from "opencode models --standalone"/,
    'a listing value carrying a second command must fail and name the variable',
  );

  const quotedListing = [
    'V2="$(opencode models --standalone 2>/dev/null)"',
    "printf '%s\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  assert.equal(
    standaloneListingProblem(quotedListing, 1),
    null,
    'a quoted command substitution of the standalone listing must count',
  );
});

test('a backslash-newline pair joins two words with nothing in between', () => {
  const continued = [
    'V2=$(opencode models --standalone 2>/dev/null)',
    'echo x\\',
    "#y; printf '%s\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  const active = activeBlockLines(continued);

  assert.deepEqual(
    active,
    [
      'V2=$(opencode models --standalone 2>/dev/null)',
      "echo x#y; printf '%s\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
    ],
    'a `#` joined onto the previous word is not a comment, so its line stays active',
  );
  assert.ok(
    active.some((line) => line.includes("grep '^llmgateway/'")),
    'the listing check after the joined word must remain an active line',
  );
});

test('a continued assignment is stripped after its lines are joined', () => {
  const continued = [
    'V2=$(opencode models --standalone 2>/dev/null) \\',
    '#suffix',
    "printf '%s\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
  ];
  const active = activeBlockLines(continued);

  assert.deepEqual(
    active,
    [
      'V2=$(opencode models --standalone 2>/dev/null)',
      "printf '%s\\n' \"$V2\" | grep '^llmgateway/' >/dev/null && LLMGATEWAY_OK=1",
    ],
    'a comment on the continued line must not be read as the start of a physical line',
  );
  assert.equal(
    standaloneListingProblem(active, 1),
    null,
    'the continued assignment must count as the standalone listing check',
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROSE COMMANDS ARE QUOTED AND LISTING NOTES SAY WHAT TO LOOK FOR
// ─────────────────────────────────────────────────────────────────────────────

test('unquotedListingCommands flags prose forms and accepts quoted or fenced ones', () => {
  assert.deepEqual(
    unquotedListingCommands('Run opencode models --standalone first.').map((hit) => hit.lineNumber),
    [1],
    'a prose listing command must be flagged',
  );
  assert.deepEqual(
    unquotedListingCommands('Run `opencode models --standalone` first.'),
    [],
    'an inline code span is the place for a prose command',
  );
  assert.deepEqual(
    unquotedListingCommands(['```bash', 'opencode models llmgateway', '```'].join('\n')),
    [],
    'a fenced block is a transcript, not prose',
  );
  assert.deepEqual(
    unquotedListingCommands('OpenCode models is the product name.'),
    [],
    'the capitalised product name is not a command',
  );
});

test('unprefixedListingNotes flags a note that omits what to look for', () => {
  assert.deepEqual(
    unprefixedListingNotes('Confirm the provider in `opencode models --standalone` first.').map(
      (hit) => hit.lineNumber,
    ),
    [1],
    'a note that names no prefix must be flagged',
  );
  assert.deepEqual(
    unprefixedListingNotes(
      'Confirm that `opencode models --standalone` lists ids under the `<provider>/` prefix first.',
    ),
    [],
    'a note naming the prefix must pass',
  );
  assert.deepEqual(
    unprefixedListingNotes('Once the provider is confirmed in `opencode models --standalone`.'),
    [{ lineNumber: 1, text: 'Once the provider is confirmed in `opencode models --standalone`' }],
    'the clause text is reported so the reader can find it',
  );
  assert.deepEqual(
    unprefixedListingNotes('Confirming the provider in `opencode models --standalone` first.').map(
      (hit) => hit.lineNumber,
    ),
    [1],
    'a confirming note that names no prefix must be flagged',
  );
  assert.deepEqual(
    unprefixedListingNotes(
      '`jq -r .x | grep y` once the provider is confirmed in `opencode models --standalone`.',
    ).map((hit) => hit.lineNumber),
    [1],
    'a grep in an unrelated span must not clear the note',
  );
  assert.deepEqual(
    unprefixedListingNotes("`opencode models --standalone | grep '^llmgateway/'` confirms it."),
    [],
    'a span holding the filtered listing is the check itself',
  );
});

test('no prose line carries an unquoted listing command', () => {
  const offenders = [];

  const scan = (file) => {
    for (const offender of unquotedListingCommands(read(file))) {
      offenders.push(`${relativeToRepoRoot(file)}:${offender.lineNumber}: ${offender.text}`);
    }
  };

  for (const file of documents(CLI_ROOT)) scan(file);

  assert.equal(
    offenders.join('\n'),
    '',
    `a listing command in prose is never run as written, so it must sit in an inline code span, but these do not:\n${offenders.join('\n')}`,
  );
});

test('a note that sends a reader to the standalone listing names the prefix', () => {
  const offenders = [];

  const scan = (file) => {
    for (const offender of unprefixedListingNotes(read(file))) {
      offenders.push(`${relativeToRepoRoot(file)}:${offender.lineNumber}: ${offender.text}`);
    }
  };

  for (const file of documents(CLI_ROOT)) scan(file);

  assert.equal(
    offenders.join('\n'),
    '',
    `a note that sends a reader to "opencode models --standalone" must name the <provider>/ prefix the listing prints, but these do not:\n${offenders.join('\n')}`,
  );
});
