#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Setup Battery
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor battery for the sk-code routing setup. Each leg is one step
// the surface needs before it can route: the shared frontmatter package is
// provisioned, the parent hub passes its structural invariants, the root
// metadata manifests are fresh, the compiled-route guard finds no stale or
// drifted hub, the served runtime copies match their authored closure, the
// sk-code drift guards pass, the derived metadata is fresh, and a probe prompt
// actually routes through the compiled router.
//
// Every leg except the provisioning precheck runs as a child process from the
// repository root, and the precheck resolves the shared package in-process, so
// the battery reports the tree a caller would see. Nothing is written: each
// failing leg prints the command that repairs it and the operator decides. The
// probe is the one leg whose exit code proves nothing, because the legacy stub
// exits 0 too, so it passes only on a parsed `action: "route"` decision.
//
// Usage: sk-code-setup-check.cjs [--prompt=<text>]
// Environment override, so the battery can be pointed at a fixture tree:
//   SK_CODE_SETUP_ROOT  repository root to run every leg from (default: the
//                       worktree root four levels above this script)

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND ROOT RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = process.env.SK_CODE_SETUP_ROOT
  ? path.resolve(process.env.SK_CODE_SETUP_ROOT)
  : path.resolve(__dirname, '..', '..', '..', '..');

const DEFAULT_PROMPT = 'fix a typescript bug in the opencode plugin';
const USAGE = 'Usage: node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs [--prompt=<text>]';

const HUB = 'sk-code';
const SKILL_DIR = '.skilled/skills/sk-code';
const SHARED_FRONTMATTER = '@spec-kit/shared/frontmatter/parse-frontmatter.js';
const PARENT_SKILL_CHECK = '.skilled/commands/doctor/scripts/parent-skill-check.cjs';
const ROOT_METADATA = '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs';
const ROUTE_GUARD = '.skilled/bin/compiled-route-guard.cjs';
const ROUTE_SYNC = '.skilled/bin/compiled-route-sync.cjs';
const DRIFT_GUARDS = '.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh';
const DERIVED_FRESHNESS = '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs';
const REGENERATE_DERIVED = '.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs';
const ROUTE_PROBE = '.skilled/bin/compiled-route.cjs';

const PROVISION = 'bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .';

// The two legs that read the shared frontmatter package: an unprovisioned tree
// cannot run them at all, so they are skipped rather than reported as failures
// the provision step already explains.
const PROVISION_DEPENDENTS = new Set(['parent-skill', 'root-metadata']);

// The guard and the drift guards both write PASS and FAIL lines to whichever
// stream suits them, so both are captured and the buffer is sized for the
// noisiest leg.
const MAX_BUFFER = 64 * 1024 * 1024;
const DETAIL_LIMIT = 10;

// ─────────────────────────────────────────────────────────────────────────────
// 3. LEGS
// ─────────────────────────────────────────────────────────────────────────────

// Every leg runs from the repository root so the battery reports the tree a
// caller would see; a missing binary is normalized to a failure, never a crash.
function spawnLeg(argv) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });
  return {
    status: typeof result.status === 'number' ? result.status : 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    output: `${result.stdout || ''}${result.stderr || ''}`,
  };
}

const LEGS = [
  {
    id: 'provisioning',
    command: () => `require.resolve('${SHARED_FRONTMATTER}')`,
    // No child process: the built shared package is resolved the way the skill
    // scripts resolve it, from their own lib directory.
    run: () => {
      try {
        require.resolve(SHARED_FRONTMATTER, {
          paths: [path.join(ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'lib')],
        });
        return { status: 0, stdout: '', stderr: '', output: '' };
      } catch {
        return { status: 1, stdout: '', stderr: '', output: '' };
      }
    },
  },
  {
    id: 'parent-skill',
    command: () => `node ${PARENT_SKILL_CHECK} ${SKILL_DIR}`,
    run: () => spawnLeg([process.execPath, PARENT_SKILL_CHECK, SKILL_DIR]),
  },
  {
    id: 'root-metadata',
    command: () => `node ${ROOT_METADATA}`,
    run: () => spawnLeg([process.execPath, ROOT_METADATA]),
  },
  {
    id: 'guard',
    command: () => `node ${ROUTE_GUARD} --json`,
    run: () => spawnLeg([process.execPath, ROUTE_GUARD, '--json']),
  },
  {
    id: 'sync',
    command: () => `node ${ROUTE_SYNC} --check`,
    run: () => spawnLeg([process.execPath, ROUTE_SYNC, '--check']),
  },
  {
    id: 'drift-guards',
    command: () => `bash ${DRIFT_GUARDS}`,
    run: () => spawnLeg(['bash', DRIFT_GUARDS]),
  },
  {
    id: 'derived-freshness',
    command: () => `node ${DERIVED_FRESHNESS} --format json`,
    run: () => spawnLeg([process.execPath, DERIVED_FRESHNESS, '--format', 'json']),
  },
  {
    id: 'probe',
    command: (ctx) => `node ${ROUTE_PROBE} --hub ${HUB} --prompt "${ctx.prompt}"`,
    run: (ctx) => spawnLeg([process.execPath, ROUTE_PROBE, '--hub', HUB, '--prompt', ctx.prompt]),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. VERDICTS AND REPAIRS
// ─────────────────────────────────────────────────────────────────────────────

const pass = () => ({ ok: true, details: [], repairs: [] });
const fail = (details, repairs) => ({ ok: false, details, repairs });

// Only the FAIL-prefixed lines are surfaced, plus a count when the cap drops
// the rest: a leg's other output is noise, and a crashing leg would otherwise
// print a stack trace into the report.
const failLines = (output) => {
  const lines = output.split('\n').filter((line) => line.startsWith('FAIL'));
  if (lines.length <= DETAIL_LIMIT) return lines;
  return [
    ...lines.slice(0, DETAIL_LIMIT),
    `... ${lines.length - DETAIL_LIMIT} more FAIL lines; rerun the command above for the full list`,
  ];
};

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// The legacy-stub repair is the guard's own staleFix text, loaded from THIS
// script's repository rather than the root under test: a fixture tree carries no
// guard to ask, and the live text names both writes a re-mint needs.
const GUARD_MODULE = path.resolve(__dirname, '..', '..', '..', '..', '.skilled', 'bin', 'compiled-route-guard.cjs');

function legacyStubRepair() {
  return require(GUARD_MODULE).staleFix(HUB);
}

// The probe's decision is the last non-empty stdout line: the front door prints
// exactly one JSON line, and a stray warning line above it is not a decision.
function probeDecision(result) {
  if (result.status !== 0) return null;
  const lines = result.stdout.split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) return null;
  const decision = parseJson(lines[lines.length - 1]);
  return decision && typeof decision === 'object' ? decision : null;
}

const JUDGES = {
  provisioning: (result) => (result.status === 0 ? pass() : fail([], [PROVISION])),

  'parent-skill': (result) => (result.status === 0
    ? pass()
    : fail(failLines(result.output), [
      `fix each FAIL line above, then rerun node ${PARENT_SKILL_CHECK} ${SKILL_DIR}`,
    ])),

  'root-metadata': (result) => {
    if (result.status === 0) return pass();
    // The unbuilt shared package is the one failure the provision step owns;
    // every other failure is a manifest the fix flag can regenerate.
    if (result.output.includes('is not built here')) return fail([], [PROVISION]);
    return fail(failLines(result.output), [
      `node ${ROOT_METADATA} --fix (regenerates missing or stale manifests; authored files it names are written by hand)`,
    ]);
  },

  guard: (result) => {
    if (result.status === 0) return pass();
    const report = parseJson(result.stdout);
    const results = report && Array.isArray(report.results) ? report.results : null;
    if (!results) return fail([], [`rerun node ${ROUTE_GUARD}`]);
    const repairs = results
      .filter((entry) => entry && entry.ok === false)
      .map((entry) => (entry.fix
        ? `${entry.hubId}: ${entry.fix}`
        : `${entry.hubId}: ${entry.reason}; run node ${ROUTE_GUARD} to read why`));
    return fail([], repairs.length > 0 ? repairs : [`rerun node ${ROUTE_GUARD}`]);
  },

  sync: (result) => (result.status === 0
    ? pass()
    : fail([], [`node ${ROUTE_SYNC} (rebuilds the served copies from the authored closure)`])),

  'drift-guards': (result) => (result.status === 0
    ? pass()
    : fail(failLines(result.output), [`fix each FAIL guard above, then rerun bash ${DRIFT_GUARDS}`])),

  'derived-freshness': (result) => {
    if (result.status === 0) return pass();
    const report = parseJson(result.stdout);
    const staleRoots = report && Array.isArray(report.staleRoots) ? report.staleRoots : [];
    const erroredRoots = report && Array.isArray(report.erroredRoots) ? report.erroredRoots : [];
    const details = erroredRoots
      .filter((root) => root && typeof root.name === 'string')
      .map((root) => `${root.name}: ${(Array.isArray(root.errors) ? root.errors : []).join('; ')}`);
    const repairs = staleRoots
      .filter((root) => root && typeof root.name === 'string')
      .map((root) => `node ${REGENERATE_DERIVED} --root .skilled/skills/${root.name} --write`);
    if (repairs.length === 0 && details.length === 0) repairs.push(`rerun node ${DERIVED_FRESHNESS} --format json`);
    return fail(details, repairs);
  },

  probe: (result, ctx) => {
    const decision = probeDecision(result);
    if (!decision) {
      const detail = result.status !== 0
        ? `the probe exited ${result.status}`
        : 'the probe printed no route decision';
      return fail([detail], [
        `rerun node ${ROUTE_PROBE} --hub ${HUB} --prompt "${ctx.prompt}"`,
      ]);
    }
    if (decision.action === 'route') return pass();
    if (decision.servingAuthority === 'legacy') {
      const flag = process.env.SPECKIT_COMPILED_ROUTING;
      // A flag other than '1' is the kill switch or fails closed, so legacy is
      // deliberate here and the manifest refresh would repair nothing.
      if (flag !== undefined && flag !== '' && flag !== '1') {
        return fail([
          `served the legacy stub because SPECKIT_COMPILED_ROUTING=${JSON.stringify(flag)} switches compiled routing off`,
        ], [
          'unset SPECKIT_COMPILED_ROUTING, then rerun node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs',
        ]);
      }
      return fail(['served the legacy stub, so sk-code serves no compiled route'], [legacyStubRepair()]);
    }
    return fail([`action: ${decision.action}`], [
      'rerun with --prompt="<a prompt that names your stack>"; if your surface still does not route, '
        + 'add its words to .skilled/skills/sk-code/hub-router.json and refresh the manifest',
    ]);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPORT
// ─────────────────────────────────────────────────────────────────────────────

const verdictLine = (verdict, id, command) => `${verdict}  ${id.padEnd(18)}  ${command}`;

function report(rows, ctx) {
  const lines = ['/doctor:sk-code setup (read-only; writes nothing)'];
  let failed = 0;
  let skipped = 0;
  for (const row of rows) {
    if (row.skip) {
      skipped += 1;
      lines.push(verdictLine('SKIP', row.leg.id, 'needs the provision step'));
      continue;
    }
    if (row.ok) {
      lines.push(verdictLine('PASS', row.leg.id, row.leg.command(ctx)));
      continue;
    }
    failed += 1;
    lines.push(verdictLine('FAIL', row.leg.id, row.leg.command(ctx)));
    for (const detail of row.details) lines.push(`      ${detail}`);
    for (const repair of row.repairs) lines.push(`      repair: ${repair}`);
  }
  lines.push(failed === 0
    ? `STATUS=OK legs=${LEGS.length}`
    : `STATUS=FAIL failed=${failed} skipped=${skipped}`);
  return { lines, failed, skipped };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

// An argument that is not the prompt option is a caller mistake, and an empty
// prompt would probe with nothing, so both print usage instead of running.
function parsePrompt(argv) {
  let prompt = DEFAULT_PROMPT;
  for (const arg of argv) {
    if (!arg.startsWith('--prompt=')) return null;
    const value = arg.slice('--prompt='.length);
    if (value === '') return null;
    prompt = value;
  }
  return prompt;
}

function main(argv) {
  const prompt = parsePrompt(argv);
  if (prompt === null) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const ctx = { prompt };
  const rows = [];
  let provisioned = true;
  for (const leg of LEGS) {
    if (!provisioned && PROVISION_DEPENDENTS.has(leg.id)) {
      rows.push({ leg, skip: true });
      continue;
    }
    const judged = JUDGES[leg.id](leg.run(ctx), ctx);
    if (leg.id === 'provisioning') provisioned = judged.ok;
    rows.push({ leg, ...judged });
  }
  const { lines, failed } = report(rows, ctx);
  process.stdout.write(`${lines.join('\n')}\n`);
  return failed === 0 ? 0 : 1;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
