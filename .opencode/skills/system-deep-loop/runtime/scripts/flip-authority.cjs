#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Durable Registry-Direct Authority Flip Runner        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--authority-root, --dry-run, --commit).                ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=success, 1=script error, 2=run stopped at a failing mode.      ║
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

// Honest 40-hex identifier for the code state being flipped. Falls back to
// a zero hash only when git is unavailable, never to a fabricated value.
const { execSync: _execSync } = require('node:child_process');
let CANDIDATE_SHA;
try {
  CANDIDATE_SHA = _execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  if (!/^[0-9a-f]{40}$/.test(CANDIDATE_SHA)) CANDIDATE_SHA = '0'.repeat(40);
} catch {
  CANDIDATE_SHA = '0'.repeat(40);
}

// Stable policy version for the registry-direct flip path. The registry
// records it on every transition; bumping it is an operator decision that
// must be coordinated with any reader that asserts on the value.
const POLICY_VERSION = 1;

// Single-condition gate for the compare-and-swap call. Always true in
// production; setting to false disables only the CAS so a proof test can
// show the runner stops with records stuck at cutover_ready when the flip
// does not land.
let COMMIT_CAS = true;
// Test-only seam to toggle the CAS gate. Production code never calls this;
// it exists so a negative-control proof can disable the CAS and then
// restore it with a process-trap guarantee.
function __setCommitCas(value) {
  COMMIT_CAS = value;
}

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

// The flip step for one mode. Reads the current record first; a record
// already at the target state is skipped idempotently so a resumed run
// does not re-flip modes that already landed. Any failure returns the
// reasonCode and stops the run; later modes are never touched.
async function flipOneMode(registry, mode) {
  let record;
  try {
    record = registry.read(mode);
  } catch (error) {
    const reasonCode = error && error.reasonCode ? error.reasonCode : 'RECORD_MALFORMED';
    const detail = error instanceof Error ? error.message : String(error);
    return {
      mode,
      from: null,
      to: null,
      result: 'failed',
      reasonCode,
      reason: `read failed: ${detail}`,
    };
  }

  const fromState = record.state;
  const fromEpoch = record.epoch;

  // Idempotent skip: a record already at the target state and writer is
  // not re-flipped. The runner reports already-flipped so an operator can
  // tell a no-op resume from a fresh flip.
  if (
    record.state === 'new_authoritative_reversible'
    && record.selectedWriter === 'dark'
  ) {
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: { state: record.state, epoch: record.epoch, selectedWriter: record.selectedWriter },
      result: 'already-flipped',
    };
  }

  const at = new Date().toISOString();
  const { canonicalBytes, sha256Bytes } = await import('../lib/event-envelope/index.js');
  const transitionFacts = {
    mode,
    flipPath: 'registry-direct',
    fromState: record.state,
    toState: 'new_authoritative_reversible',
    fromEpoch,
    toEpoch: fromEpoch + 1,
    selectedWriter: 'dark',
    candidateSha: CANDIDATE_SHA,
    policyVersion: POLICY_VERSION,
  };
  // Honest sha256 over the actual transition facts. These are content
  // digests, not certificate digests — this flip bypasses the certificate
  // by operator decision, and the digests transparently record that.
  const cutoverCertificateDigest = sha256Bytes(canonicalBytes(transitionFacts));
  const lastTransitionDigest = sha256Bytes(canonicalBytes({ ...transitionFacts, at }));

  try {
    registry.prepareCutover({
      mode,
      expectedEpoch: fromEpoch,
      candidateSha: CANDIDATE_SHA,
      policyVersion: POLICY_VERSION,
      at,
    });
    if (COMMIT_CAS) {
      registry.compareAndSwap({
        mode,
        expectedState: 'cutover_ready',
        expectedEpoch: fromEpoch,
        nextSelectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: POLICY_VERSION,
        cutoverCertificateDigest,
        lastTransitionDigest,
        at,
      });
    } else {
      // Negative-control path: the CAS is intentionally disabled, so the
      // record is left at cutover_ready. The runner reports this as a
      // controlled failure so the proof can observe records stuck mid-flip.
      return {
        mode,
        from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
        to: { state: 'cutover_ready', epoch: fromEpoch, selectedWriter: 'legacy' },
        result: 'cas-disabled',
        reasonCode: 'CAS_DISABLED',
        reason: 'compare-and-swap disabled by negative-control toggle; record left at cutover_ready',
      };
    }
  } catch (error) {
    const reasonCode = error && error.reasonCode ? error.reasonCode : 'CAS_CONFLICT';
    const detail = error instanceof Error ? error.message : String(error);
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: null,
      result: 'failed',
      reasonCode,
      reason: `${reasonCode}: ${detail}`,
    };
  }

  // Re-read the record FROM DISK and confirm the flip actually landed.
  // A reported success without a written record matching the expected
  // final state is impossible — the step must fail if the flip did not
  // persist.
  let flippedRecord;
  try {
    flippedRecord = registry.read(mode);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: null,
      result: 'failed',
      reasonCode: 'RECORD_MALFORMED',
      reason: `post-flip read failed: ${detail}`,
    };
  }

  if (
    flippedRecord.state !== 'new_authoritative_reversible'
    || flippedRecord.epoch !== fromEpoch + 1
    || flippedRecord.selectedWriter !== 'dark'
  ) {
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: {
        state: flippedRecord.state,
        epoch: flippedRecord.epoch,
        selectedWriter: flippedRecord.selectedWriter,
      },
      result: 'failed',
      reasonCode: 'CAS_CONFLICT',
      reason: `post-flip record is state='${flippedRecord.state}', epoch=${flippedRecord.epoch}, selectedWriter='${flippedRecord.selectedWriter}', expected state='new_authoritative_reversible', epoch=${fromEpoch + 1}, selectedWriter='dark'`,
    };
  }

  return {
    mode,
    from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
    to: {
      state: flippedRecord.state,
      epoch: flippedRecord.epoch,
      selectedWriter: flippedRecord.selectedWriter,
    },
    result: 'flipped',
  };
}

// The finalize step for one mode. Reads the current record first; a record
// already at the final state is skipped idempotently so a resumed run does
// not re-finalize modes that already landed. Only a reversible/dark record
// is eligible; any other state is a controlled failure that stops the run
// before later modes are touched. Finalize is window-free by operator
// decision — no rollback window, drill, or certificate precondition is
// required or simulated; the digests are content bindings over the actual
// transition facts, not gate receipts.
async function finalizeOneMode(registry, mode) {
  let record;
  try {
    record = registry.read(mode);
  } catch (error) {
    const reasonCode = error && error.reasonCode ? error.reasonCode : 'RECORD_MALFORMED';
    const detail = error instanceof Error ? error.message : String(error);
    return {
      mode,
      from: null,
      to: null,
      result: 'failed',
      reasonCode,
      reason: `read failed: ${detail}`,
    };
  }

  const fromState = record.state;
  const fromEpoch = record.epoch;

  // Idempotent skip: a record already finalized is not re-finalized.
  if (
    record.state === 'new_authoritative_final'
    && record.selectedWriter === 'dark'
  ) {
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: { state: record.state, epoch: record.epoch, selectedWriter: record.selectedWriter },
      result: 'already-final',
    };
  }

  // Finalize only applies to a reversible/dark record. Any other state is
  // a controlled failure so the run stops without touching later modes.
  if (
    record.state !== 'new_authoritative_reversible'
    || record.selectedWriter !== 'dark'
  ) {
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: null,
      result: 'failed',
      reasonCode: 'CAS_CONFLICT',
      reason: `record is state='${record.state}', selectedWriter='${record.selectedWriter}', expected new_authoritative_reversible/dark to finalize`,
    };
  }

  const at = new Date().toISOString();
  const { canonicalBytes, sha256Bytes } = await import('../lib/event-envelope/index.js');
  const transitionFacts = {
    mode,
    finalizePath: 'registry-direct',
    fromState: record.state,
    toState: 'new_authoritative_final',
    fromEpoch,
    toEpoch: fromEpoch + 1,
    selectedWriter: 'dark',
    candidateSha: CANDIDATE_SHA,
    policyVersion: POLICY_VERSION,
    rollbackWindowRequired: false,
  };
  // Honest sha256 over the actual transition facts. These are content
  // digests, not certificate digests — finalize is window-free by
  // operator decision, and the digests transparently record that.
  const cutoverCertificateDigest = sha256Bytes(canonicalBytes(transitionFacts));
  const lastTransitionDigest = sha256Bytes(canonicalBytes({ ...transitionFacts, at }));

  try {
    if (COMMIT_CAS) {
      registry.compareAndSwapFinalize({
        mode,
        expectedState: 'new_authoritative_reversible',
        expectedEpoch: fromEpoch,
        candidateSha: CANDIDATE_SHA,
        policyVersion: POLICY_VERSION,
        cutoverCertificateDigest,
        lastTransitionDigest,
        at,
      });
    } else {
      // Negative-control path: the CAS is intentionally disabled, so the
      // record is left at new_authoritative_reversible. The runner reports
      // this as a controlled failure so the proof can observe records that
      // did not finalize.
      return {
        mode,
        from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
        to: { state: 'new_authoritative_reversible', epoch: fromEpoch, selectedWriter: 'dark' },
        result: 'cas-disabled',
        reasonCode: 'CAS_DISABLED',
        reason: 'compare-and-swap disabled by negative-control toggle; record left at new_authoritative_reversible',
      };
    }
  } catch (error) {
    const reasonCode = error && error.reasonCode ? error.reasonCode : 'CAS_CONFLICT';
    const detail = error instanceof Error ? error.message : String(error);
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: null,
      result: 'failed',
      reasonCode,
      reason: `${reasonCode}: ${detail}`,
    };
  }

  // Re-read the record FROM DISK and confirm the finalize actually landed.
  // A reported success without a written record matching the expected
  // final state is impossible — the step must fail if the finalize did
  // not persist.
  let finalizedRecord;
  try {
    finalizedRecord = registry.read(mode);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: null,
      result: 'failed',
      reasonCode: 'RECORD_MALFORMED',
      reason: `post-finalize read failed: ${detail}`,
    };
  }

  if (
    finalizedRecord.state !== 'new_authoritative_final'
    || finalizedRecord.epoch !== fromEpoch + 1
    || finalizedRecord.selectedWriter !== 'dark'
  ) {
    return {
      mode,
      from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
      to: {
        state: finalizedRecord.state,
        epoch: finalizedRecord.epoch,
        selectedWriter: finalizedRecord.selectedWriter,
      },
      result: 'failed',
      reasonCode: 'CAS_CONFLICT',
      reason: `post-finalize record is state='${finalizedRecord.state}', epoch=${finalizedRecord.epoch}, selectedWriter='${finalizedRecord.selectedWriter}', expected state='new_authoritative_final', epoch=${fromEpoch + 1}, selectedWriter='dark'`,
    };
  }

  return {
    mode,
    from: { state: fromState, epoch: fromEpoch, selectedWriter: record.selectedWriter },
    to: {
      state: finalizedRecord.state,
      epoch: finalizedRecord.epoch,
      selectedWriter: finalizedRecord.selectedWriter,
    },
    result: 'finalized',
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
Deep-Loop Runtime — Durable Registry-Direct Authority Flip Runner

USAGE:
  node scripts/flip-authority.cjs [OPTIONS]

OPTIONS:
  --authority-root <path>     Path to the authority-state directory (resolved automatically if not provided)
  --dry-run                   Plan the flips without making any changes (default)
  --commit                    Actually perform the flips
  --finalize                  Finalize reversible/dark records to new_authoritative_final (window-free)
  --help                      Show this help message

EXIT CODES:
  0 = success
  1 = script error
  2 = run stopped at a failing mode
`);
    process.exit(0);
  }

  // An option that quietly accepts the wrong shape turns a typo into a different
  // command: a missing value becomes a boolean used as a path, and a flag that
  // swallowed the next token turns "change nothing" into a real run. Validating
  // the shape up front makes a mistyped invocation fail instead of doing
  // something unintended.
  const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const valueArgs = ['authorityRoot'];
  const flagArgs = ['dryRun', 'commit', 'finalize', 'help'];
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

  // Default is the safe dry-run; --commit is required to perform any flip.
  // Passing both is rejected so an operator cannot accidentally request a
  // commit and a dry-run in the same invocation.
  const commit = args.commit === true;
  const dryRun = !commit;
  const finalize = args.finalize === true;
  if (args.dryRun === true && commit) {
    jsonOut({
      ok: false,
      phase: 'args',
      code: 'CONFLICTING_FLAGS',
      reason: '--dry-run and --commit are mutually exclusive',
    });
    process.exit(1);
  }
  const mode = commit ? (finalize ? 'finalize-commit' : 'commit') : (finalize ? 'finalize-dry-run' : 'dry-run');

  const { resolveAuthorityRoot } = await import(
    '../lib/authority-root/resolve-authority-root.ts'
  );
  const { AuthorityRegistry, AUTHORITY_FLIP_MODE_ORDER } = await import(
    '../lib/per-mode-authority-flip/index.ts'
  );

  let authorityRoot = args.authorityRoot;
  if (!authorityRoot) {
    authorityRoot = resolveAuthorityRoot();
  }

  // A dry run changes nothing, so it never constructs the registry: the
  // authority-state directory must be left exactly as it was found, and
  // constructing an AuthorityRegistry creates the root directory as a
  // side effect. Reading the current state for the plan goes through a
  // fresh registry bound to the resolved root only when one already
  // exists, so a dry run over a non-existent root reports every mode as
  // a fresh flip without creating the directory.
  if (dryRun) {
    const plan = [];
    for (const modeName of AUTHORITY_FLIP_MODE_ORDER) {
      // Read the current record without constructing a registry that
      // would create the root. If the root does not exist, the mode
      // reads as a default legacy record.
      const recordPath = require('node:path').join(authorityRoot, `authority-${modeName}.json`);
      let current = null;
      if (require('node:fs').existsSync(recordPath)) {
        try {
          current = JSON.parse(require('node:fs').readFileSync(recordPath, 'utf8'));
        } catch {
          current = null;
        }
      }
      const fromState = current ? current.state : 'legacy_authoritative';
      const fromEpoch = current ? current.epoch : 1;
      const fromWriter = current ? current.selectedWriter : 'legacy';
      if (finalize) {
        // A finalize dry-run plans the reversible->final edge. Only a
        // reversible/dark record is eligible; an already-final record is
        // a no-op; anything else cannot be finalized and is reported as
        // such so the operator sees the plan honestly.
        const alreadyFinal = fromState === 'new_authoritative_final' && fromWriter === 'dark';
        const canFinalize = fromState === 'new_authoritative_reversible' && fromWriter === 'dark';
        plan.push({
          mode: modeName,
          from: { state: fromState, epoch: fromEpoch, selectedWriter: fromWriter },
          to: alreadyFinal || canFinalize
            ? { state: 'new_authoritative_final', epoch: fromEpoch + 1, selectedWriter: 'dark' }
            : { state: fromState, epoch: fromEpoch, selectedWriter: fromWriter },
          result: alreadyFinal ? 'already-final' : canFinalize ? 'would-finalize' : 'not-reversible',
        });
      } else {
        const alreadyFlipped = fromState === 'new_authoritative_reversible' && fromWriter === 'dark';
        plan.push({
          mode: modeName,
          from: { state: fromState, epoch: fromEpoch, selectedWriter: fromWriter },
          to: alreadyFlipped
            ? { state: fromState, epoch: fromEpoch, selectedWriter: fromWriter }
            : { state: 'new_authoritative_reversible', epoch: fromEpoch + 1, selectedWriter: 'dark' },
          result: alreadyFlipped ? 'already-flipped' : 'would-flip',
        });
      }
    }
    const allDone = finalize
      ? plan.every((entry) => entry.result === 'already-final')
      : plan.every((entry) => entry.result === 'already-flipped');
    jsonOut({
      ok: true,
      mode,
      authorityRoot,
      plan,
      allFlipped: allDone,
    });
    return;
  }

  // --commit path: construct the registry and transition every mode in
  // order. --finalize selects the finalize edge; otherwise the forward
  // flip edge runs.
  const registry = new AuthorityRegistry(authorityRoot);
  const results = [];
  let stoppedAt = null;
  for (const modeName of AUTHORITY_FLIP_MODE_ORDER) {
    const outcome = finalize
      ? await finalizeOneMode(registry, modeName)
      : await flipOneMode(registry, modeName);
    results.push(outcome);
    if (outcome.result === 'failed' || outcome.result === 'cas-disabled') {
      // Stop at the first failure: later modes must not be touched. The
      // run reports which mode stopped it and leaves the rest untouched.
      stoppedAt = modeName;
      break;
    }
  }

  const successResults = finalize
    ? ['finalized', 'already-final']
    : ['flipped', 'already-flipped'];
  const allFlipped = results.every((r) => successResults.includes(r.result))
    && results.length === AUTHORITY_FLIP_MODE_ORDER.length
    && stoppedAt === null;

  if (stoppedAt !== null) {
    jsonOut({
      ok: false,
      mode,
      authorityRoot,
      results,
      stoppedAt,
      allFlipped: false,
    });
    process.exit(2);
  }

  jsonOut({
    ok: true,
    mode,
    authorityRoot,
    results,
    allFlipped,
  });
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

module.exports = { parseArgs, flipOneMode, finalizeOneMode, main, __setCommitCas };
