#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// FIXTURE: zvec-grep Stub
// ───────────────────────────────────────────────────────────────
// Stands in for the zvec-grep CLI so the lane's exit mapping can be tested
// without an index, an embedding model or a network. The lane resolves it
// through SPECKIT_ZVEC_GREP_BIN; ZVEC_STUB_SCENARIO picks the behavior.
//
// The scenarios reproduce the two shapes that make the real tool's status
// unreadable on its own: a query that finds nothing still exits 0, and a
// genuine fault exits 1 exactly like a not-ready index does, separated only by
// the `Error:` line the tool prints to stderr.
// ───────────────────────────────────────────────────────────────

'use strict';

const scenario = process.env.ZVEC_STUB_SCENARIO || 'hits';
const [subcommand] = process.argv.slice(2);

if (subcommand === 'version') {
  process.stdout.write('0.2.1\n');
  process.exit(0);
}

if (subcommand === 'query') {
  if (scenario === 'fault') {
    process.stderr.write('Error: Workspace index is not configured\nCode: ZVEC_GREP.ENGINE.INDEX.MISSING\n');
    process.exit(1);
  }
  if (scenario === 'empty') {
    // A clean miss. The tool exits 0, which is why the lane counts hits.
    process.stdout.write('No matches.\n');
    process.exit(0);
  }
  process.stdout.write([
    'query groups (1):',
    'g1 [hybrid]: stub query',
    'hits: 2',
    '',
    '#1 matchedBy=fts+vector score=0.0328 docs/alpha.md:12-40',
    '#2 matchedBy=vector score=0.0164 docs/beta.md:3',
    '',
  ].join('\n'));
  process.exit(0);
}

if (subcommand === 'status') {
  if (scenario === 'fault') {
    process.stderr.write('Error: Workspace index manifest is invalid\nCode: ZVEC_GREP.ENGINE.MANIFEST.INVALID\n');
    process.exit(1);
  }
  if (scenario === 'unready') {
    // A not-ready verdict. It exits 1 and prints `Error:` exactly like a fault
    // does; only the sentence differs, and it carries no `Code:` line because
    // the tool throws a plain Error here rather than an EngineError.
    process.stdout.write('? Workspace index is not configured\n');
    process.stderr.write('Error: Workspace index is not ready (state: undecided)\n');
    process.exit(1);
  }
  // Transcribed from a real `zg status --check-ready` run at 0.2.1. The labels
  // precede their numbers on aligned rows, which is the shape the coverage
  // parser has to survive; a tidied-up fixture would hide that.
  process.stdout.write([
    '✓ Workspace index is ready',
    '  /tmp/stub-workspace',
    '',
    '  Coverage    ████ 100%  120 / 120 files',
    '  Entities    4,096',
    '  Truncated   0 fragments',
    '  Queue       0 pending · 0 failed',
    '',
    '  Embedding   local/nomic-embed-text-v1.5',
    '              768 dimensions · cosine',
    '',
    '  Storage     .zvec-grep/index.zvec',
    '',
  ].join('\n'));
  process.exit(0);
}

if (subcommand === 'index') {
  if (scenario === 'fault') {
    process.stderr.write('Error: Embedding model could not be loaded\nCode: ZVEC_GREP.ENGINE.EMBEDDING.LOAD\n');
    process.exit(1);
  }
  process.stdout.write('Indexed 120 files.\n');
  process.exit(0);
}

process.stderr.write(`Error: unknown stub subcommand: ${String(subcommand)}\n`);
process.exit(1);
