#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Phrase Reach Probe
// ───────────────────────────────────────────────────────────────────

// Read-only /doctor diagnostic. Every doctor command bridge that is active in the
// TypeScript scorer declares diagnostic phrases in the doctor route manifest, and
// the bridge promises the advisor serves them: each declared phrase, plus the
// runnable command string itself, must reach that bridge either as the top pick or
// as the first doctor bridge among the passing recommendations behind the top pick.
// A phrase that reaches neither is wording the manifest advertises and the advisor
// cannot serve, which no diff can tell apart from a deliberate wording choice.
//
// The probe scores in process under the same pinned force-local regime the doctor
// routing slice uses, so its verdict is reproducible and matches that gate instead
// of drifting with the calendar, the local SQLite index or lane overrides.
//
// It is strictly REPORT-ONLY. It writes nothing in the repository; its only
// filesystem touch is the empty temporary database directory the pinned regime
// needs, which it removes before exiting. The freshness check may also refresh
// its cached build record inside the ignored dist folder.
//
// Exit codes:
//   0  every admitted phrase and runnable string reaches its bridge
//   1  at least one admitted phrase reaches neither the top pick nor the second line
//   2  bad argument, missing or stale build output, or an unreadable input
//
// Usage: doctor-phrase-reach.cjs [--json]
//   --json  print one JSON object instead of the per-phrase text report

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { checkPackageFreshness } = require(path.join(__dirname, '../../../skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../../../..');
const ROUTES = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', '_routes.yaml');
const RUNTIME = path.join(REPO_ROOT, '.skilled', 'skills', 'system-skill-advisor', 'runtime');
const COMPAT = path.join(RUNTIME, 'scripts', 'command-bridges', 'scoring-compatibility.json');
const BASELINE = path.join(RUNTIME, 'scripts', 'routing-accuracy', 'scorer-eval-baseline.json');
const DIST = path.join(RUNTIME, 'dist', 'runtime');
const BUILT_SCORER = path.join(DIST, 'lib', 'scorer', 'fusion.js');
const BUILT_WORKSPACE_ROOT = path.join(DIST, 'lib', 'utils', 'workspace-root.js');
const DOCTOR_PREFIX = 'command-doctor-';
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A misspelled flag must fail loudly rather than fall back to a default run.
function parseArgs(argv) {
  const options = { asJson: false };
  for (const arg of argv) {
    if (arg === '--json') {
      options.asJson = true;
      continue;
    }
    return null;
  }
  return options;
}

function doctorName(command) {
  const match = /^\/doctor:([a-z0-9-]+)$/.exec(command);
  return match ? match[1] : null;
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter((entry) => typeof entry === 'string' && entry) : [];
}

// The admitted set is the compatibility document's TypeScript inventory: a bridge
// admitted in only one scorer cannot be probed through the TypeScript scorer.
function admittedBridgeIds() {
  const doc = JSON.parse(fs.readFileSync(COMPAT, 'utf8'));
  return new Set(doc.typescript.map((entry) => entry.inventoryId));
}

// Recomputes the bridge ids, runnable strings and phrases the deriver produces from
// the manifest, so the probe reads the same contract the scorer was generated from
// rather than the generated copy that could have fallen behind it.
function manifestBridges() {
  const YAML = require('yaml');
  const manifest = YAML.parse(fs.readFileSync(ROUTES, 'utf8'));
  const admitted = admittedBridgeIds();
  const routes = manifest.routes;

  const routeCounts = new Map();
  for (const route of routes) {
    const name = doctorName(route.command);
    if (name) routeCounts.set(name, (routeCounts.get(name) || 0) + 1);
  }

  const bridges = [];
  for (const route of routes) {
    const name = doctorName(route.command);
    if (!name || typeof route.target !== 'string' || !route.target) continue;
    // A command with several targets needs one bridge per target; a single-target
    // command takes the command's own id.
    const multiTarget = routeCounts.get(name) > 1;
    const id = multiTarget
      ? `${DOCTOR_PREFIX}${name}-${route.target}`
      : `${DOCTOR_PREFIX}${name}`;
    if (!admitted.has(id)) continue;
    bridges.push({
      id,
      runnable: multiTarget ? `${route.command} ${route.target}` : route.command,
      phrases: stringArray(route.trigger_phrases),
    });
  }

  const standalone = Array.isArray(manifest.standalone) ? manifest.standalone : [];
  for (const item of standalone) {
    if (!item || typeof item.command !== 'string') continue;
    const name = doctorName(item.command);
    if (!name) continue;
    const id = `${DOCTOR_PREFIX}${name}`;
    if (!admitted.has(id)) continue;
    bridges.push({
      id,
      runnable: typeof item.runnable === 'string' && item.runnable ? item.runnable : item.command,
      phrases: stringArray(item.trigger_phrases),
    });
  }
  return bridges;
}

// Read only the capturedAt stamp, which is the instant the accuracy baseline
// attests the scorer's behavior at.
function baselineInstant() {
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  return `${baseline.capturedAt}T00:00:00Z`;
}

let tempDbDir = null;

// Freeze scoring to the reproducible filesystem projection: an empty database
// directory makes the SQLite loader return null, semantic embeddings are disabled,
// and the native lane-ranking overrides are cleared so the top-1 decision is
// deterministic.
function freezeRegime(instant) {
  tempDbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-phrase-reach-'));
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = tempDbDir;
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

  // The derived lane discounts each skill by its age at scoring time, so score at
  // the instant the accuracy baseline was captured; a later calendar day must not
  // move a phrase that no change touched. Only the no-argument constructor and the
  // static clock are pinned, so an explicit timestamp still constructs normally.
  const RealDate = Date;
  const fixedNow = new RealDate(instant).getTime();
  class FixedDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(fixedNow);
      else super(...args);
    }

    static now() {
      return fixedNow;
    }
  }
  globalThis.Date = FixedDate;
}

function removeTempDbDir() {
  if (tempDbDir) {
    fs.rmSync(tempDbDir, { recursive: true, force: true });
    tempDbDir = null;
  }
}

function errorText(error) {
  if (error instanceof Error) return error.stack ?? error.message;
  return String(error);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// Only the first three recommendations render. A doctor bridge can be second only
// under a non-doctor top pick, and a runnable command must rank first.
function probeBridge(scoreAdvisorPrompt, workspaceRoot, bridge) {
  const rows = [];
  for (const [index, phrase] of [...bridge.phrases, bridge.runnable].entries()) {
    const isRunnable = index === bridge.phrases.length;
    if (!isRunnable && phrase.trim().split(/\s+/).filter(Boolean).length < 3) {
      rows.push({ id: bridge.id, phrase, reached: null, top: null, second: null, short: true });
      continue;
    }

    const result = scoreAdvisorPrompt(phrase, { workspaceRoot });
    const recommendations = result.recommendations.slice(0, 3);
    const top = recommendations[0]?.skill ?? null;
    let second = null;
    if (top !== null && !top.startsWith(DOCTOR_PREFIX)) {
      for (const recommendation of recommendations.slice(1)) {
        if (recommendation.skill.startsWith(DOCTOR_PREFIX)) {
          second = recommendation.skill;
          break;
        }
      }
    }
    let reached = null;
    if (top === bridge.id) {
      reached = 'top';
    } else if (!isRunnable && second === bridge.id) {
      reached = 'second';
    }
    rows.push({ id: bridge.id, phrase, reached, top, second });
  }
  return rows;
}

async function main(bridges, options) {
  const fusion = await import(pathToFileURL(BUILT_SCORER).href);
  const workspace = await import(pathToFileURL(BUILT_WORKSPACE_ROOT).href);
  const workspaceRoot = workspace.findAdvisorWorkspaceRoot(RUNTIME, { maxDepth: 14, sentinel: SENTINEL });

  const rows = [];
  for (const bridge of bridges) {
    rows.push(...probeBridge(fusion.scoreAdvisorPrompt, workspaceRoot, bridge));
  }

  const missed = rows.filter((row) => row.reached === null).length;

  if (options.asJson) {
    process.stdout.write(`${JSON.stringify({
      status: missed === 0 ? 'ok' : 'fail',
      bridges: bridges.length,
      phrases: rows.length,
      missed,
      rows,
    }, null, 2)}\n`);
  } else {
    for (const row of rows) {
      if (row.short) {
        process.stdout.write([
          'FAIL',
          row.id,
          JSON.stringify(row.phrase),
          'phrase has fewer than three words',
        ].join(' ') + '\n');
        continue;
      }
      if (row.reached) {
        process.stdout.write(`PASS ${row.id} ${row.reached} ${JSON.stringify(row.phrase)}\n`);
      } else {
        process.stdout.write(`FAIL ${row.id} ${JSON.stringify(row.phrase)} top=${row.top} second=${row.second}\n`);
      }
    }
    process.stdout.write(missed === 0
      ? `STATUS=OK phrases=${rows.length} bridges=${bridges.length}\n`
      : `STATUS=FAIL missed=${missed} phrases=${rows.length}\n`);
  }

  return missed === 0 ? 0 : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

const options = parseArgs(process.argv.slice(2));
if (options === null) {
  process.stderr.write('Usage: doctor-phrase-reach.cjs [--json]\n');
  process.exit(2);
}

// A missing build is a setup problem, not a probe verdict: nothing can be scored,
// so the run must not print a reach result either way.
if (!fs.existsSync(BUILT_SCORER)) {
  process.stderr.write('doctor-phrase-reach: advisor runtime is not built; run npm --prefix .skilled/skills/system-skill-advisor/runtime run build\n');
  process.exit(2);
}

// A build older than its source scores code that no longer exists, so its
// verdict could pass a phrase the current source would miss. Refuse it too,
// and likewise a build whose freshness cannot be assessed.
const freshness = checkPackageFreshness('system-skill-advisor/runtime', { workspaceRoot: REPO_ROOT });
if (freshness.status !== 'fresh') {
  process.stderr.write(`doctor-phrase-reach: ${freshness.message}\n`);
  process.exit(2);
}

let bridges;
try {
  bridges = manifestBridges();
  freezeRegime(baselineInstant());
} catch (error) {
  removeTempDbDir();
  process.stderr.write(`doctor-phrase-reach: ${errorText(error)}\n`);
  process.exit(2);
}

main(bridges, options)
  .then((code) => {
    removeTempDbDir();
    process.exit(code);
  })
  .catch((error) => {
    removeTempDbDir();
    process.stderr.write(`doctor-phrase-reach: ${errorText(error)}\n`);
    process.exit(2);
  });
