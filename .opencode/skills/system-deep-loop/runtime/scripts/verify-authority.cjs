#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Independent Authority Verifier (read-only)           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--authority-root).                                      ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=all on ledger, 1=script error, 2=not all on ledger.            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');
const isTsxLoaded = process.env.DEEP_LOOP_TSX_LOADED === '1';

function runTsxBootstrap() {
  const { spawn } = require('node:child_process');
  const child = spawn(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      stdio: [process.stdin.isTTY ? 'ignore' : 'pipe', 'pipe', 'pipe'],
    },
  );

  if (!process.stdin.isTTY && child.stdin) {
    child.stdin.on('error', () => {});
    process.stdin.pipe(child.stdin);
  }

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      child.kill(signal);
    });
  }

  child.on('close', (status, signal) => {
    if (status !== null) {
      process.exit(status);
    }
    process.exit(signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1);
  });
}

if (require.main === module && !isTsxLoaded) {
  runTsxBootstrap();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MAIN IMPLEMENTATION (under tsx)
// ─────────────────────────────────────────────────────────────────────────────

// This verifier is deliberately independent of the flip runner: it reads
// each authority record straight from disk with readFileSync + JSON.parse
// and reports what it finds. It does not import or reuse flip-authority.cjs
// logic, so a bug in the runner cannot also fool the verifier.

const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// Read one mode's record directly from disk. A missing file is a
// synthesized default, not an error: the verifier reports it as
// source 'default' so an operator can see the mode was never written.
// A malformed file is reported as source 'malformed' with the parse
// error, so corruption is visible rather than silently treated as
// legacy.
function readRecordFromDisk(authorityRoot, mode) {
  const recordPath = join(authorityRoot, `authority-${mode}.json`);
  if (!existsSync(recordPath)) {
    return {
      mode,
      state: 'legacy_authoritative',
      epoch: 1,
      selectedWriter: 'legacy',
      source: 'default',
    };
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(recordPath, 'utf8'));
  } catch (error) {
    return {
      mode,
      state: null,
      epoch: null,
      selectedWriter: null,
      source: 'malformed',
      error: error instanceof Error ? error.message : String(error),
    };
  }
  return {
    mode,
    state: typeof parsed.state === 'string' ? parsed.state : null,
    epoch: typeof parsed.epoch === 'number' ? parsed.epoch : null,
    selectedWriter: typeof parsed.selectedWriter === 'string' ? parsed.selectedWriter : null,
    source: 'stored',
  };
}

async function main() {
  let args;
  try {
    args = parseArgs();
  } catch (error) {
    jsonOut({
      ok: false,
      phase: 'args',
      code: 'ARG_PARSE_ERROR',
      reason: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }

  if (args.help === true) {
    console.log(`
Deep-Loop Runtime — Independent Authority Verifier (read-only)

USAGE:
  node scripts/verify-authority.cjs [OPTIONS]

OPTIONS:
  --authority-root <path>     Path to the authority-state directory (resolved automatically if not provided)
  --help                      Show this help message

EXIT CODES:
  0 = all modes on ledger (new_authoritative_reversible or new_authoritative_final / dark)
  1 = script error
  2 = not all modes on ledger
`);
    process.exit(0);
  }

  const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const valueArgs = ['authorityRoot'];
  const flagArgs = ['help'];
  const knownArgs = [...valueArgs, ...flagArgs];
  for (const key of Object.keys(args)) {
    if (!knownArgs.includes(key)) {
      jsonOut({
        ok: false,
        phase: 'args',
        code: 'UNKNOWN_ARGUMENT',
        argument: key,
        reason: `Unknown flag --${kebab(key)}`,
      });
      process.exit(1);
    }
    if (valueArgs.includes(key)) {
      if (typeof args[key] !== 'string' || args[key].trim() === '') {
        jsonOut({
          ok: false,
          phase: 'args',
          code: 'ARG_VALUE_REQUIRED',
          argument: key,
          reason: `--${kebab(key)} requires a value`,
        });
        process.exit(1);
      }
    } else if (args[key] !== true) {
      jsonOut({
        ok: false,
        phase: 'args',
        code: 'ARG_TAKES_NO_VALUE',
        argument: key,
        reason: `--${kebab(key)} takes no value and got '${args[key]}'`,
      });
      process.exit(1);
    }
  }

  const { resolveAuthorityRoot } = await import(
    '../lib/authority-root/resolve-authority-root.ts'
  );
  const { AUTHORITY_FLIP_MODE_ORDER } = await import(
    '../lib/per-mode-authority-flip/index.ts'
  );

  const authorityRoot = args.authorityRoot || resolveAuthorityRoot();

  const records = AUTHORITY_FLIP_MODE_ORDER.map((mode) => readRecordFromDisk(authorityRoot, mode));

  // allOnLedger is true ONLY if every mode's on-disk record is a
  // ledger-authoritative target state with the dark writer. Both the
  // reversible tier and the terminal final tier count as enabled — final
  // is strictly more enabled than reversible, not a regression. A
  // synthesized-default mode (no file) counts as NOT on ledger, as does
  // any malformed or partially-flipped record.
  const allOnLedger = records.every(
    (r) => r.source === 'stored'
      && (r.state === 'new_authoritative_reversible' || r.state === 'new_authoritative_final')
      && r.selectedWriter === 'dark',
  );

  jsonOut({
    ok: true,
    authorityRoot,
    records,
    allOnLedger,
  });

  if (!allOnLedger) {
    process.exit(2);
  }
}

if (require.main === module && isTsxLoaded) {
  main().catch((error) => {
    jsonOut({
      ok: false,
      phase: 'runtime',
      reason: error instanceof Error ? error.message : String(error),
      code: 'RUNTIME_ERROR',
    });
    process.exit(1);
  });
}

module.exports = { parseArgs, readRecordFromDisk, main };
