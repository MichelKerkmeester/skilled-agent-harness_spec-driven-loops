#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fleet Mode Enablement CLI                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--dry-run, --state, --resume, --authority-root).       ║
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

// A reader contract over an empty projectable surface passes without checking
// anything, so that fact has to reach the report instead of vanishing into a
// success with no evidence.
function extractSurfaces(deriveModeSurfaceSet, mode) {
  const surface = deriveModeSurfaceSet(mode);
  return {
    mode,
    surfaceIds: surface.surfaceIds,
    projectableSurfaceIds: surface.projectableSurfaceIds,
    readers: surface.readers,
    hasProjectableSurface: surface.hasProjectableSurface,
    sharedWith: surface.sharedWith,
  };
}

// A classification manifest's own digest commits its structure, not its
// verdict. Reading the manifest without checking each row's verdict lets a
// manifest whose every row reports a failed verifier bind and pass exactly
// like one that reports success — the observation gate then collapses to
// "did reading throw," and a ledger whose evidence is ambiguous reads as
// clean. The verdict is reconstructible from fields the snapshot already
// retains (order/identity/receipt coverage and lease state), so this helper
// rejects when any row fails the reconstructed verdict. A null field means
// the classifier had nothing to assert, and an unasserted verdict must never
// read as a passing one. The reconstructed four-field conjunction IS the
// derived verifier verdict (verified = orderCoverage && identityCoverage &&
// receiptCoverage && leaseState !== 'uncertain').
function enforceObservedClassificationVerdict(built) {
  const rows = built && built.manifest ? built.manifest.rows : [];
  for (const row of rows) {
    const evidence = row && row.evidence ? row.evidence : {};
    if (evidence.orderCoverage !== true) {
      return {
        ok: false,
        reason: `row '${row.rowId}' failed parity: orderCoverage is ${JSON.stringify(evidence.orderCoverage)}, expected true`,
      };
    }
    if (evidence.identityCoverage !== true) {
      return {
        ok: false,
        reason: `row '${row.rowId}' failed parity: identityCoverage is ${JSON.stringify(evidence.identityCoverage)}, expected true`,
      };
    }
    if (evidence.receiptCoverage !== true) {
      return {
        ok: false,
        reason: `row '${row.rowId}' failed parity: receiptCoverage is ${JSON.stringify(evidence.receiptCoverage)}, expected true`,
      };
    }
    if (evidence.leaseState === null || evidence.leaseState === 'uncertain') {
      return {
        ok: false,
        reason: `row '${row.rowId}' failed parity: leaseState is ${JSON.stringify(evidence.leaseState)}, expected a non-uncertain state`,
      };
    }
  }
  return { ok: true };
}

function buildRunStep(registry, deriveModeSurfaceSet, runDirectory, censusPath) {
  // Refusing on the read path means a failed step touches no authority record
  // at all: no compare-and-swap, no transaction, nothing to roll back.
  return async (mode) => {
    let surfaces = null;
    try {
      surfaces = deriveModeSurfaceSet(mode);
    } catch (error) {
      // A derivation failure must stop cleanly at the named mode rather than
      // aborting the whole run as an uncaught exception.
      return {
        mode,
        ok: false,
        failedCheck: 'reader-contract',
        reason: error instanceof Error ? error.message : String(error),
        surfaces: null,
      };
    }

    // A mode with no manifest entry is not a mode with nothing to project; it
    // is a mode whose legacy consumers would silently stop being maintained.
    // Treat it as a failure to investigate, never as a skip.
    if (surfaces.surfaceIds.length === 0) {
      return {
        mode,
        ok: false,
        failedCheck: 'reader-contract',
        reason: `Mode '${mode}' has no projection-manifest entry`,
        surfaces,
      };
    }

    // A mode whose record cannot be read is a failure of that mode, not of the
    // run — letting it escape would abort every remaining mode and lose the
    // record of where the run actually stopped.
    let record;
    try {
      record = registry.read(mode);
    } catch (error) {
      return {
        mode,
        ok: false,
        failedCheck: 'flip',
        reason: error instanceof Error ? error.message : String(error),
        surfaces: null,
      };
    }

    // Observe classification evidence before checking the state, but only if
    // a runDirectory is provided. The parity gate depends on this evidence;
    // if it cannot be observed, the step must fail with the observation error
    // rather than proceeding to the state check. The effect ledger id is
    // distinct from the audit ledger: the audit ledger exists today, so
    // passing it would satisfy the guard and produce a vacuous pass. Using a
    // non-existent effect ledger id ensures the correct result is a refusal
    // until the effect subsystem is wired.
    if (runDirectory) {
      try {
        const { buildObservedClassificationManifest } = await import(
          '../lib/restart-observation/observed-classification.js'
        );
        const { readFileSync } = await import('node:fs');
        const { join, resolve } = await import('node:path');
        const { fileURLToPath } = await import('node:url');

        const CENSUS_BYTES = readFileSync(censusPath);
        const census = JSON.parse(CENSUS_BYTES.toString('utf8'));

        const modeLedgerId = `${mode}-ledger`;
        const effectLedgerId = `${mode}-effect-ledger`;

        // Construct real ledger read ports lazily from AppendOnlyLedger.
        // The factories must remain lazy because constructing a ledger creates
        // its directory, and the existence checks must observe the pre-construction
        // state to refuse when the producer is absent.
        const { AppendOnlyLedger } = await import('../lib/authorized-ledger/index.ts');
        const { resolveAuthorityRoot } = await import('../lib/authority-root/index.ts');

        const authorityRoot = resolveAuthorityRoot();
        const registryInner = await import('../lib/per-mode-authority-flip/index.ts')
          .then((m) => new m.AuthorityRegistry(authorityRoot));

        const modeLedgerFactory = () => {
          const ledger = new AppendOnlyLedger({
            rootDirectory: runDirectory,
            ledgerId: modeLedgerId,
            auditLedgerId: `${mode}-audit-ledger`,
            authorityProvider: () => registryInner.read(mode),
          }, registryInner);
          return ledger;
        };
        const effectLedgerFactory = () => {
          const ledger = new AppendOnlyLedger({
            rootDirectory: runDirectory,
            ledgerId: effectLedgerId,
            auditLedgerId: `${mode}-audit-ledger`,
            authorityProvider: () => registryInner.read(mode),
          }, registryInner);
          return ledger;
        };

        const observedManifest = await buildObservedClassificationManifest({
          observation: {
            runDirectory,
            modeLedgerId,
            effectLedgerId,
            modeLedger: modeLedgerFactory,
            effectLedger: effectLedgerFactory,
            leases: [],
            continuityId: null,
          },
          rows: census.rows.map((row) => ({
            rowId: row.id,
            lifecycle: row.lifecycle,
            mutability: row.mutability,
          })),
          classificationId: `enablement-${mode}`,
          classifiedAt: new Date().toISOString(),
          classifierBuildId: 'enablement-check',
          censusBytes: CENSUS_BYTES,
        });

        // The manifest was built, but building it only proves the ledger
        // could be read and the rows classified — it says nothing about
        // whether the evidence is unambiguous. Enforce the reconstructed
        // verdict on every row so a ledger whose evidence is ambiguous
        // (for example, an intent recorded with no confirmation) fails the
        // step instead of reading as clean. Failing here, on the read path,
        // means no authority record is touched.
        const verdict = enforceObservedClassificationVerdict(observedManifest);
        if (!verdict.ok) {
          return {
            mode,
            ok: false,
            failedCheck: 'parity',
            reason: verdict.reason,
            surfaces: null,
          };
        }
      } catch (error) {
        // A RestartObservationError carries a reasonCode and detail; surface
        // them verbatim so the operator sees exactly why observation failed.
        if (error && error.reasonCode) {
          return {
            mode,
            ok: false,
            failedCheck: 'parity',
            reason: `${error.reasonCode}: ${error.detail}`,
            surfaces: null,
          };
        }
        // Any other error must surface as a failed step, never as ok.
        return {
          mode,
          ok: false,
          failedCheck: 'parity',
          reason: error instanceof Error ? error.message : String(error),
          surfaces: null,
        };
      }
    }

    // The compare-and-swap that moves a mode to ledger authority accepts only
    // a cutover_ready record. This check remains correct as a precondition,
    // but it was misleading as the first thing reported: a promotion path can
    // now move a record to cutover_ready, so a mode that passes this check is
    // not necessarily safe to flip — its effects may never have been recorded.
    // Reporting the state mismatch before observing evidence would hide the
    // real obstacle behind a condition that might not even fail.
    if (record.state !== 'cutover_ready') {
      return {
        mode,
        ok: false,
        failedCheck: 'flip',
        reason: `Mode '${mode}' is '${record.state}', but authority compare-and-swap requires 'cutover_ready'`,
        surfaces,
      };
    }

    return {
      mode,
      ok: true,
      failedCheck: null,
      reason: null,
      surfaces,
    };
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
Deep-Loop Runtime — Fleet Mode Enablement CLI

USAGE:
  node scripts/enable-modes.cjs [OPTIONS]

OPTIONS:
  --state <path>              (required) Path to the enablement state file
  --authority-root <path>     Path to the authority-state directory (resolved automatically if not provided)
  --run-directory <path>      Path to the run directory containing ledgers (required for non-dry runs)
  --census <path>              Path to the state backend census JSON file (required for non-dry runs)
  --dry-run                    Plan the enablement without making any changes
  --resume                    Resume a previously stopped enablement run
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
  // the shape up front makes a mistyped invocation fail instead of doing something
  // unintended.
  const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const valueArgs = ['state', 'authorityRoot', 'runDirectory', 'census'];
  const flagArgs = ['dryRun', 'resume', 'help'];
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

  if (!args.state) {
    jsonOut({
      ok: false,
      phase: 'args',
      code: 'STATE_PATH_REQUIRED',
      reason: 'A --state path is required',
    });
    process.exit(1);
  }
  const statePath = args.state;
  const dryRun = args.dryRun === true;
  const resume = args.resume === true;
  const runDirectory = args.runDirectory;
  const censusPath = args.census;

  // A non-dry run observes on-disk restart state before flipping authority,
  // so it must know where the run's ledgers live. A dry run touches nothing
  // and never reads ledgers, so it does not need a run directory.
  if (!dryRun && !runDirectory) {
    jsonOut({
      ok: false,
      phase: 'args',
      code: 'RUN_DIRECTORY_REQUIRED',
      reason: 'A --run-directory path is required for a non-dry run',
    });
    process.exit(1);
  }

  // A non-dry run needs the census file to build the classification manifest.
  if (!dryRun && !censusPath) {
    jsonOut({
      ok: false,
      phase: 'args',
      code: 'CENSUS_PATH_REQUIRED',
      reason: 'A --census path is required for a non-dry run',
    });
    process.exit(1);
  }

  let authorityRoot = args.authorityRoot;
  if (!dryRun && !authorityRoot) {
    const { resolveAuthorityRoot } = await import(
      '../lib/authority-root/resolve-authority-root.ts'
    );
    authorityRoot = resolveAuthorityRoot();
  }

  const { readEnablementState, runFleetEnablement, deriveModeSurfaceSet, FLEET_MODE_ORDER } =
    await import('../lib/fleet-enablement/index.ts');

  if (!dryRun) {
    const prior = readEnablementState(statePath);

    if (prior) {
      const completedCount = Array.isArray(prior.completedModes)
        ? prior.completedModes.length
        : 0;
      const failureNote =
        prior.failure && typeof prior.failure === 'object'
          ? `; an earlier run failed at mode '${prior.failure.mode}' on check '${prior.failure.check}'`
          : '';

      // A prior state file means an earlier run stopped part-way with authority
      // already moved for some modes. Continuing automatically would let the
      // operator miss that a failure ever happened. Resuming must be a decision.
      if (!resume) {
        jsonOut({
          ok: false,
          phase: 'resume',
          code: 'RESUME_NOT_REQUESTED',
          reason: `Prior enablement run found with ${completedCount} mode(s) already completed${failureNote}. Pass --resume to continue.`,
        });
        process.exit(1);
      }
    } else if (resume) {
      // Asking to resume a run that never happened means the operator has the
      // wrong state path, and silently starting a fresh run under a resume flag
      // would move authority they did not intend to move.
      jsonOut({
        ok: false,
        phase: 'resume',
        code: 'NOTHING_TO_RESUME',
        reason: `No prior enablement state exists at '${statePath}', so there is nothing to resume`,
      });
      process.exit(1);
    }
  }

  if (dryRun) {
    // A dry run changes nothing, so it never constructs the registry: the
    // authority-state directory must be left exactly as it was found.
    const runStep = async () => {
      throw new Error('runStep must never be called during a dry run');
    };
    const result = await runFleetEnablement({
      statePath,
      dryRun: true,
      runStep,
    });
    const plan = [];
    for (const mode of result.plannedModes) {
      try {
        plan.push(extractSurfaces(deriveModeSurfaceSet, mode));
      } catch (error) {
        plan.push({
          mode,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    jsonOut({
      ok: true,
      dryRun: true,
      plannedModes: result.plannedModes,
      skippedModes: result.skippedModes,
      plan,
    });
    return;
  }

  const { AuthorityRegistry } = await import(
    '../lib/per-mode-authority-flip/index.ts'
  );
  const registry = new AuthorityRegistry(authorityRoot);
  const runStep = buildRunStep(registry, deriveModeSurfaceSet, runDirectory, censusPath);

  const result = await runFleetEnablement({
    statePath,
    dryRun: false,
    runStep,
  });

  if (result.failure === null) {
    jsonOut({
      ok: true,
      dryRun: false,
      plannedModes: result.plannedModes,
      skippedModes: result.skippedModes,
      completedModes: result.completedModes,
    });
    return;
  }

  jsonOut({
    ok: false,
    phase: 'enablement',
    code: 'MODE_STEP_FAILED',
    failure: result.failure,
    completedModes: result.completedModes,
    untouchedModes: result.untouchedModes,
    statePath,
  });
  process.exit(2);
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

module.exports = { parseArgs, buildRunStep, main, enforceObservedClassificationVerdict };