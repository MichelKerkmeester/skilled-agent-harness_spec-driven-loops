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
// sk-code drift guards pass, the derived metadata is fresh, a probe prompt
// actually routes through the compiled router, and the quality gate is ready to
// run: its tools, its executables, its tables, its own tests and its route.
//
// Every leg except the provisioning precheck runs as a child process from the
// repository root, and the precheck resolves the shared package in-process, so
// the battery reports the tree a caller would see. Nothing in the repository is
// written: the quality tests build their throwaway repositories under the OS
// temp folder and remove them, and each failing leg prints the command that
// repairs it and the operator decides. The probe is the one leg whose exit code
// proves nothing, because the legacy stub exits 0 too, so it passes only on a
// parsed `action: "route"` decision.
//
// Usage: sk-code-setup-check.cjs [--prompt=<text>]
// Environment override, so the battery can be pointed at a fixture tree:
//   SK_CODE_SETUP_ROOT  repository root to run every leg from (default: the
//                       worktree root four levels above this script)

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
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
const DRIFT_GUARDS = '.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh';
const DERIVED_FRESHNESS = '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs';
const REGENERATE_DERIVED = '.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs';
const ROUTE_PROBE = '.skilled/bin/compiled-route.cjs';
const QUALITY_DIR = '.skilled/skills/sk-code/sk-code-quality';
const QUALITY_RUNNER = `${QUALITY_DIR}/scripts/quality-gate.cjs`;
const QUALITY_CHECKER = `${QUALITY_DIR}/scripts/check-comment-hygiene.sh`;
const QUALITY_TABLES = [`${QUALITY_DIR}/assets/comment-syntax.json`, `${QUALITY_DIR}/assets/quality-defaults.json`];
const QUALITY_TESTS = `${QUALITY_DIR}/scripts/tests`;
const QUALITY_MODE = 'sk-code-quality';
// The default probe prompt never reaches the quality mode, so the quality leg
// probes with a prompt of its own.
const QUALITY_PROMPT = 'run the quality gate on my changed files before I claim done';

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
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Prints the prompt the way a shell reads it back, so a pasted probe line reruns the same prompt.
function shellQuote(text) {
  return `"${text.replace(/[\\"$`]/g, '\\$&')}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LEGS
// ─────────────────────────────────────────────────────────────────────────────

// Every leg runs from the repository root so the battery reports the tree a
// caller would see; a missing binary is normalized to a failure, never a crash.
function spawnLeg(argv, env = process.env) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: ROOT,
    env,
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

function onPath(name) {
  for (const dir of String(process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    try {
      fs.accessSync(path.join(dir, name), fs.constants.X_OK);
      if (fs.statSync(path.join(dir, name)).isFile()) return true;
    } catch {
      // Not in this folder, so the next one is read.
    }
  }
  return false;
}

function isExecutable(rel) {
  try {
    fs.accessSync(path.join(ROOT, rel), fs.constants.X_OK);
    return fs.statSync(path.join(ROOT, rel)).isFile();
  } catch {
    return false;
  }
}

function unparsable(rel) {
  try {
    JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    return false;
  } catch {
    return true;
  }
}

function qualityTests() {
  try {
    return fs.readdirSync(path.join(ROOT, QUALITY_TESTS)).filter((name) => name.endsWith('.test.cjs')).sort()
      .map((name) => `${QUALITY_TESTS}/${name}`);
  } catch {
    return [];
  }
}

// Five checks in one leg, each with its own repair, so a broken quality setup names
// the one step to fix. The tests run last but one because they take the longest,
// and the route probe last because it reads the served manifest the other legs
// already checked.
function runQuality() {
  const checks = [];
  const add = (id, ok, detail, repair) => checks.push({ id, ok, detail, repair });
  add('tools', onPath('python3'), 'python3 is not on PATH, and the comment-hygiene check runs on it',
    'install python3 and put it on PATH');
  const closed = [QUALITY_RUNNER, QUALITY_CHECKER].filter((rel) => !isExecutable(rel));
  add('executables', closed.length === 0, `not an executable file: ${closed.join(', ')}`, `chmod +x ${closed.join(' ')}`);
  const broken = QUALITY_TABLES.filter(unparsable);
  add('tables', broken.length === 0, `does not parse as JSON: ${broken.join(', ')}`,
    `restore ${broken.join(' and ')} from version control`);
  const tests = qualityTests();
  // A battery started from inside a node test run inherits that run's context marker,
  // which turns a nested test run into a reporting child whose exit code is not its
  // verdict, so the marker is dropped.
  const { NODE_TEST_CONTEXT: omitted, ...testEnv } = process.env;
  const suite = tests.length > 0 ? spawnLeg([process.execPath, '--test', '--test-reporter=tap', ...tests], testEnv) : null;
  const failing = suite ? suite.stdout.split('\n').filter((line) => /^\s*not ok /.test(line)).map((line) => line.trim()) : [];
  add('tests', Boolean(suite) && suite.status === 0,
    suite ? `the quality tests failed${failing.length > 0 ? `: ${failing.slice(0, DETAIL_LIMIT).join(', ')}` : ''}` : `no *.test.cjs file in ${QUALITY_TESTS}`,
    `node --test ${QUALITY_TESTS}/*.test.cjs, then fix each failing test`);
  const decision = probeDecision(spawnLeg([process.execPath, ROUTE_PROBE, '--hub', HUB, '--prompt', QUALITY_PROMPT]));
  const routed = Boolean(decision) && decision.action === 'route' && Array.isArray(decision.targets)
    && decision.targets.some((target) => target && target.workflowMode === QUALITY_MODE);
  add('route', routed, `the quality prompt did not route to ${QUALITY_MODE}`,
    `rerun node ${ROUTE_PROBE} --hub ${HUB} --prompt ${shellQuote(QUALITY_PROMPT)} and read its decision`);
  return { status: checks.every((entry) => entry.ok) ? 0 : 1, stdout: '', stderr: '', output: '', checks };
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
    command: (ctx) => `node ${ROUTE_PROBE} --hub ${HUB} --prompt ${shellQuote(ctx.prompt)}`,
    run: (ctx) => spawnLeg([process.execPath, ROUTE_PROBE, '--hub', HUB, '--prompt', ctx.prompt]),
  },
  {
    id: 'quality',
    command: () => `python3, executables, tables, node --test ${QUALITY_TESTS}, quality route probe`,
    run: () => runQuality(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. VERDICTS AND REPAIRS
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
        `rerun node ${ROUTE_PROBE} --hub ${HUB} --prompt ${shellQuote(ctx.prompt)}`,
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

  quality: (result) => {
    if (result.status === 0) return pass();
    const failed = result.checks.filter((entry) => !entry.ok);
    return fail(failed.map((entry) => `${entry.id}: ${entry.detail}`), failed.map((entry) => entry.repair));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPORT
// ─────────────────────────────────────────────────────────────────────────────

const verdictLine = (verdict, id, command) => `${verdict}  ${id.padEnd(18)}  ${command}`;

function report(rows, ctx) {
  const lines = ['/doctor:sk-code setup (read-only; writes nothing)'];
  let failed = 0;
  let skipped = 0;
  for (const row of rows) {
    if (row.skip) {
      skipped += 1;
      lines.push(verdictLine('SKIP', row.leg.id, row.reason));
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
// 7. MAIN
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
  if (!fs.existsSync(path.join(ROOT, SKILL_DIR, 'SKILL.md'))) {
    // Without the v4 tree every leg's repair would name files this checkout does not have.
    rows.push({
      leg: LEGS.find((leg) => leg.id === 'provisioning'),
      ...fail(
        [`${SKILL_DIR}/SKILL.md is missing, so this checkout predates the v4 layout or never installed sk-code`],
        ['install the .skilled/ tree from a v4 release, run /doctor:update compat, then rerun this check'],
      ),
    });
    for (const leg of LEGS) {
      if (leg.id === 'provisioning') continue;
      rows.push({ leg, skip: true, reason: 'needs the v4 layout' });
    }
  } else {
    let provisioned = true;
    for (const leg of LEGS) {
      if (!provisioned && PROVISION_DEPENDENTS.has(leg.id)) {
        rows.push({ leg, skip: true, reason: 'needs the provision step' });
        continue;
      }
      const judged = JUDGES[leg.id](leg.run(ctx), ctx);
      if (leg.id === 'provisioning') provisioned = judged.ok;
      rows.push({ leg, ...judged });
    }
  }
  const { lines, failed } = report(rows, ctx);
  process.stdout.write(`${lines.join('\n')}\n`);
  return failed === 0 ? 0 : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DERIVED_FRESHNESS,
  DRIFT_GUARDS,
  LEGS,
  PARENT_SKILL_CHECK,
  QUALITY_CHECKER,
  QUALITY_DIR,
  QUALITY_RUNNER,
  QUALITY_TABLES,
  QUALITY_TESTS,
  ROOT_METADATA,
  ROUTE_GUARD,
  ROUTE_PROBE,
  ROUTE_SYNC,
  SKILL_DIR,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));
