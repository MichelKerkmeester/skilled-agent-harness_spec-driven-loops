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

function buildRunStep(registry, deriveModeSurfaceSet) {
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

    // The compare-and-swap that moves a mode to ledger authority accepts only
    // a cutover_ready record, so a mode still sitting in its default legacy
    // state cannot be flipped. Reporting the actual state and the required one
    // makes the gap a fact the operator can act on, not an opaque refusal.
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

  // An option that quietly accepts the wrong shape turns a typo into a different
  // command: a missing value becomes a boolean used as a path, and a flag that
  // swallowed the next token turns "change nothing" into a real run. Validating
  // the shape up front makes a mistyped invocation fail instead of doing something
  // unintended.
  const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const valueArgs = ['state', 'authorityRoot'];
  const flagArgs = ['dryRun', 'resume'];
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
  const runStep = buildRunStep(registry, deriveModeSurfaceSet);

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

module.exports = { parseArgs, buildRunStep, main };