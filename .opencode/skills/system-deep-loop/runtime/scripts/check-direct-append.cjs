#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Direct-Append Detection                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--mode, --artifact-root, --artifact-id, --legacy-file).║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=ok or not enforced, 1=script error, 2=direct append detected.   ║
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

// Convert a camelCase arg key back to its --kebab-case flag form for messages.
function flagName(key) {
  return `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

async function main() {
  const fs = require('node:fs');
  const path = require('node:path');
  const crypto = require('node:crypto');

  const args = parseArgs();

  const requiredKeys = ['mode', 'artifactRoot', 'artifactId', 'legacyFile'];
  const knownKeys = new Set([...requiredKeys, 'authorityRoot']);

  // Reject unknown flags before shape checks: an option that quietly accepts the
  // wrong shape turns a typo into a different command than the one that was typed.
  for (const key of Object.keys(args)) {
    if (!knownKeys.has(key)) {
      jsonOut({
        ok: false,
        status: 'error',
        mode: typeof args.mode === 'string' ? args.mode : undefined,
        reason: `Unknown argument: ${flagName(key)}`,
        code: 'UNKNOWN_ARGUMENT',
      });
      process.exit(1);
    }
  }

  // A flag that needs a value and parsed as the boolean `true` (because the next
  // token was missing or another flag) would then be used as a path; reject it so
  // the typo is not silently reinterpreted as an empty/boolean path.
  for (const key of requiredKeys) {
    const value = args[key];
    if (value === undefined || value === true || value === '') {
      jsonOut({
        ok: false,
        status: 'error',
        mode: typeof args.mode === 'string' ? args.mode : undefined,
        reason: `Argument ${flagName(key)} requires a non-empty string value`,
        code: 'ARG_VALUE_REQUIRED',
      });
      process.exit(1);
    }
  }

  const { resolveAuthorityRoot } = await import(
    '../lib/authority-root/resolve-authority-root.ts'
  );
  const { AuthorityRegistry } = await import(
    '../lib/per-mode-authority-flip/index.ts'
  );

  let authorityRoot = args.authorityRoot;
  if (authorityRoot === undefined || authorityRoot === true || authorityRoot === '') {
    authorityRoot = resolveAuthorityRoot();
  }

  const registry = new AuthorityRegistry(authorityRoot);

  // registry.read is a pure read (returns a default legacy_authoritative record
  // when no file exists, writes nothing) but THROWS on a malformed on-disk record.
  // Letting that throw propagate is intentional: an unreadable authority record is
  // a failure of this check, not a reason to pass — a guard that treats a broken
  // record as "nothing to see" is worse than no guard. The top-level catch reports
  // status 'error' and exits 1 with the thrown message.
  const record = registry.read(args.mode);

  // The guard is inert before authority moves to the ledger. While the mode is on
  // legacy authority the direct writer is the sanctioned one, so a divergence here
  // is expected rather than a violation. Flagging it would be a false alarm that
  // trains people to ignore the guard. Both ledger authority states enforce: the
  // reversible state runs the legacy file as a shadow projection, and the final
  // state drops the legacy shadow writer entirely, so an out-of-band append under
  // either is a real finding — the final state most of all, since nothing else is
  // meant to be touching that file.
  const onLedgerAuthority =
    record.state === 'new_authoritative_reversible'
    || record.state === 'new_authoritative_final';
  if (!onLedgerAuthority) {
    jsonOut({
      ok: true,
      status: 'not-enforced',
      mode: args.mode,
      reason:
        `Authority state is '${record.state}'; the legacy writer is still the ` +
        'sanctioned one, so a divergence here is expected rather than a violation.',
      authorityState: record.state,
      epoch: record.epoch,
      selectedWriter: record.selectedWriter,
    });
    process.exit(0);
  }

  // Under ledger authority the gateway is supposed to be publishing the legacy
  // file, so its absence is a real finding rather than a neutral condition.
  let legacyBytes;
  try {
    legacyBytes = fs.readFileSync(args.legacyFile);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      jsonOut({
        ok: false,
        status: 'violation',
        mode: args.mode,
        reason: `Legacy file not found under ledger authority: ${args.legacyFile}`,
        code: 'LEGACY_FILE_MISSING',
        path: args.legacyFile,
      });
      process.exit(2);
    }
    throw error;
  }

  const watermarkPath = path.join(
    args.artifactRoot,
    '.legacy-projection-watermarks',
    `${args.artifactId}.json`,
  );

  // With no record of what the gateway published, nothing can vouch for the
  // file's contents — a missing or unparseable watermark is a violation, not a
  // neutral condition.
  let watermark;
  try {
    const raw = fs.readFileSync(watermarkPath, 'utf8');
    watermark = JSON.parse(raw);
  } catch (error) {
    jsonOut({
      ok: false,
      status: 'violation',
      mode: args.mode,
      reason:
        `Watermark missing or not valid JSON: ${watermarkPath} ` +
        `(${error instanceof Error ? error.message : String(error)})`,
      code: 'WATERMARK_UNREADABLE',
      path: watermarkPath,
    });
    process.exit(2);
  }

  const expectedDigest = watermark.output_digest;
  const expectedByteLength = watermark.output_byte_length;
  const actualDigest = crypto
    .createHash('sha256')
    .update(legacyBytes)
    .digest('hex');
  const actualByteLength = legacyBytes.length;

  if (actualDigest === expectedDigest) {
    jsonOut({
      ok: true,
      status: 'ok',
      mode: args.mode,
      reason: 'Legacy file bytes match the gateway watermark.',
      digest: actualDigest,
      byteLength: actualByteLength,
      expectedDigest,
      expectedByteLength,
    });
    process.exit(0);
  }

  jsonOut({
    ok: false,
    status: 'violation',
    mode: args.mode,
    reason:
      'Legacy file bytes do not match the gateway watermark; a write bypassed ' +
      'the sanctioned gateway path.',
    code: 'DIRECT_APPEND_DETECTED',
    expectedDigest,
    actualDigest,
    expectedByteLength,
    actualByteLength,
    refreshedAt: watermark.refreshed_at,
    watermarkPath,
    legacyFile: args.legacyFile,
  });
  process.exit(2);
}

if (require.main === module && isTsxLoaded) {
  main().catch((error) => {
    jsonOut({
      ok: false,
      status: 'error',
      reason: error instanceof Error ? error.message : String(error),
      code: 'RUNTIME_ERROR',
    });
    process.exit(1);
  });
}

module.exports = { parseArgs, main };
