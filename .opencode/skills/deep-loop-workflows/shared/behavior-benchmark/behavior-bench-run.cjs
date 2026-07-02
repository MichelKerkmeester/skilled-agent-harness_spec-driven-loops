// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: behavior-bench-run                                             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Execute ONE benchmark scenario against ONE executor leg, observe ║
// ║          the live process, and emit a scored result JSON. A scored record ║
// ║          of a failure (crash, kill, refusal) is a SUCCESS of the runner --║
// ║          only usage/contract mistakes and runner-internal faults fail.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawn, execFileSync } = require('node:child_process');

// ── Exit codes ───────────────────────────────────────────────────────────────
const EXIT_OK = 0; // result JSON written (even for failed/killed runs)
const EXIT_CONTRACT = 2; // bad flags, unparseable scenario, unknown leg
const EXIT_INTERNAL = 3; // runner blew up

const DEFAULT_WATCHDOG_MS = 120000;
const DEFAULT_BUDGET_MS = 900000;
const WATCHDOG_TICK_MS = 5000;

// Checkpoint / evidence regexes. Case-insensitive across observed streams.
const SETUP_RE = /PRE-BOUND SETUP|execution_mode|consolidated setup|Setup Phase/i;
// Dispatch detection matches only STRUCTURED tool-call signals: a claude
// stream-json subagent tool_use block (tool name "Agent"; older hosts used
// "Task"), or an opencode task tool event. The unescaped-quote form is the
// structural discriminator: file contents the model merely reads appear
// backslash-escaped inside tool_result strings, so loose keyword matching
// false-positives on them while this form cannot.
const DISPATCH_RE = /"name"\s*:\s*"(Agent|Task)"|"tool"\s*:\s*"task"/;
const REFUSAL_RE = /refus|declin|cannot comply|not permitted|not allowed/i;

// ── Leg spawn table (command parts WITHOUT the trailing prompt argument) ─────
// Every leg skips permission prompts: a permission stall in a non-interactive
// run would misclassify as stuck and corrupt the cell — permission UX is not
// what this benchmark measures.
const LEG_TABLE = {
  'glm-max': ['opencode', 'run', '--model', 'zai-coding-plan/glm-5.2', '--variant', 'max', '--dangerously-skip-permissions'],
  'gpt-fast-med': ['opencode', 'run', '--model', 'openai/gpt-5.5-fast', '--variant', 'medium', '--dangerously-skip-permissions'],
  'gpt-fast-high': ['opencode', 'run', '--model', 'openai/gpt-5.5-fast', '--variant', 'high', '--dangerously-skip-permissions'],
  'claude-cli': ['claude', '-p', '--output-format', 'stream-json', '--verbose', '--dangerously-skip-permissions'],
};

function buildSpawnArgs(legName, contract) {
  const base = LEG_TABLE[legName];
  if (!base) return null;
  const inv = contract.invocation || {};
  const isCommandKind = inv.kind === 'command';
  const commandStr = isCommandKind ? (inv.command || '') : '';
  let promptText = contract.prompt;

  if (legName === 'claude-cli') {
    // claude has no --command flag; it invokes slash commands from prompt
    // text, so the host command path ("deep/review") becomes the slash form
    // ("/deep:review") on the prompt's first line.
    if (isCommandKind) {
      const slashForm = '/' + commandStr.replace(/\//g, ':');
      promptText = slashForm + ' ' + promptText;
    }
    return [...base, promptText];
  }

  // opencode legs take --command before --format.
  const args = [...base];
  if (isCommandKind) args.push('--command', commandStr);
  args.push('--format', 'json');
  return [...args, promptText];
}

// ── Scenario parsing: first fenced ```json block is the contract ─────────────
function parseScenario(filePath) {
  let md;
  try {
    md = fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
  const fence = md.match(/```json\s*([\s\S]*?)```/);
  if (!fence) return null;
  let obj;
  try {
    obj = JSON.parse(fence[1]);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== 'object') return null;
  return obj;
}

// ── Presentation markers: /regex/ or /regex/flags (always case-insensitive),
//    otherwise a literal substring ────────────────────────────────────────────
function matchMarkers(markers, text) {
  const hits = [];
  for (const m of markers) {
    let matched;
    const re = /^\/(.+)\/([a-z]*)$/.exec(m);
    if (re) {
      try {
        const flags = re[2].includes('i') ? re[2] : re[2] + 'i';
        matched = new RegExp(re[1], flags).test(text);
      } catch {
        matched = false;
      }
    } else {
      matched = text.includes(m);
    }
    if (matched) hits.push(m);
  }
  return hits;
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ SCORING -- pure functions, exported for direct unit testing.              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

function scoreD1(contract, obs) {
  const ei = contract.expected_interaction;
  const deleg = contract.expected_delegation || {};
  const minTask = deleg.min_task_events || 0;
  const taskEvents = obs.taskEvents || [];
  const dispatched = taskEvents.length > 0;
  const markerMatched = (obs.markerHits || []).length > 0;
  const naturalTerminal = obs.killedBy === 'none' && !obs.spawnError;

  if (ei === 'question_halt') {
    if (!dispatched && markerMatched) return 2;
    if (dispatched) return 1;
    return 0;
  }
  if (ei === 'fail_fast') {
    if (!dispatched && markerMatched) return 2;
    if (dispatched) return 1;
    return 0;
  }
  // autonomous
  const enoughWork = taskEvents.length >= minTask || obs.fixtureGained;
  if (naturalTerminal && enoughWork) return 2;
  if (dispatched || obs.fixtureGained) return 1;
  return 0;
}

function scoreD2(contract, obs) {
  const markers = contract.expected_presentation_markers || [];
  if (markers.length === 0) return null;
  const hits = obs.markerHits || [];
  if (hits.length >= markers.length) return 2;
  if (hits.length * 2 >= markers.length) return 1;
  return 0;
}

function scoreD3(contract, obs) {
  const deleg = contract.expected_delegation || {};
  const routeRequired = !!deleg.route_proof_required;
  const minTask = deleg.min_task_events || 0;
  // No delegation expectations at all -> dimension is not applicable.
  if (!routeRequired && minTask === 0 && !deleg.role_absorption_forbidden) return null;

  const taskEvents = obs.taskEvents || [];
  const proofs = obs.routeProofRecords || [];
  let ok = true;
  if (routeRequired) {
    const leaf = deleg.leaf_agent;
    ok = ok && proofs.some((r) => r && r.target_agent === leaf);
  }
  if (minTask > 0) {
    ok = ok && taskEvents.length >= minTask;
  }
  if (ok) return 2;
  if (taskEvents.length > 0 || proofs.length > 0) return 1;
  return 0;
}

function scoreD4(contract, obs) {
  const ei = contract.expected_interaction;
  const naturalTerminal = obs.killedBy === 'none' && !obs.spawnError;
  if (!naturalTerminal) return 0;
  if (ei === 'autonomous') {
    // Artifacts are only owed when the scenario expects delegated work; a
    // no-delegation autonomous scenario completes by terminating cleanly.
    const deleg = contract.expected_delegation || {};
    const artifactsExpected = (deleg.min_task_events || 0) > 0;
    if (!artifactsExpected) return 2;
    return obs.fixtureGained ? 2 : 1;
  }
  // question_halt / fail_fast: a clean natural terminal is enough.
  return 2;
}

function scoreD5(obs, baseline) {
  if (!baseline) return null;
  const baseTerminal = baseline.checkpoints && baseline.checkpoints.tTerminalMs;
  const ourTerminal = obs.checkpoints && obs.checkpoints.tTerminalMs;
  if (!baseTerminal || !ourTerminal) return null;
  const ratio = ourTerminal / baseTerminal;
  if (ratio <= 1.5) return 2;
  if (ratio <= 3) return 1;
  return 0;
}

function score(contract, obs, baseline) {
  return {
    d1: scoreD1(contract, obs),
    d2: scoreD2(contract, obs),
    d3: scoreD3(contract, obs),
    d4: scoreD4(contract, obs),
    d5: scoreD5(obs, baseline),
  };
}

function applicableAllTwo(dims) {
  for (const k of ['d1', 'd2', 'd3', 'd4', 'd5']) {
    const v = dims[k];
    if (v === null || v === undefined) continue;
    if (v !== 2) return false;
  }
  return true;
}

// First matching bucket wins, in this exact order.
function classify(contract, obs) {
  const ei = contract.expected_interaction;
  const deleg = contract.expected_delegation || {};
  const taskEvents = obs.taskEvents || [];
  const stdoutText = obs.stdoutText || '';
  const nonzeroNoOutput = obs.exitCode != null && obs.exitCode !== 0 && (obs.stdoutNonEmptyLines || 0) === 0;

  if (obs.spawnError || nonzeroNoOutput) return 'crash';
  if (obs.killedBy === 'watchdog') return 'stuck_no_progress';
  if (obs.killedBy === 'hard_timeout') return 'timeout_latency';
  if (REFUSAL_RE.test(stdoutText) && taskEvents.length === 0 && ei === 'autonomous') return 'refused';
  if ((ei === 'question_halt' || ei === 'fail_fast') && taskEvents.length > 0) return 'setup_misbind';
  if (deleg.role_absorption_forbidden && (deleg.min_task_events || 0) > 0 && taskEvents.length === 0 && obs.fixtureGained) {
    return 'role_absorption';
  }
  if (deleg.route_proof_required && (obs.routeProofRecords || []).length > 0) {
    const leaf = deleg.leaf_agent;
    const noneMatch = !obs.routeProofRecords.some((r) => r && r.target_agent === leaf);
    if (noneMatch) return 'route_mismatch';
  }
  if (ei === 'autonomous' && obs.killedBy === 'none' && !obs.fixtureGained && (deleg.min_task_events || 0) > 0) {
    return 'missing_artifact';
  }
  if (applicableAllTwo(score(contract, obs, null))) return 'pass';
  return 'partial';
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ POST-RUN EVIDENCE HELPERS.                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

function scanNewestMtime(dir) {
  let newest = 0;
  if (!dir) return newest;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return newest;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    let st;
    try {
      st = fs.statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      const sub = scanNewestMtime(full);
      if (sub > newest) newest = sub;
    } else if (st.isFile() && st.mtimeMs > newest) {
      newest = st.mtimeMs;
    }
  }
  return newest;
}

function collectRouteProof(fixtureDir) {
  const records = [];
  if (!fixtureDir) return records;
  const files = [];
  const walk = (d) => {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name.endsWith('state.jsonl')) files.push(full);
    }
  };
  walk(fixtureDir);
  for (const f of files) {
    let content;
    try {
      content = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    for (const lineRaw of content.split('\n')) {
      if (!lineRaw.trim()) continue;
      let obj;
      try {
        obj = JSON.parse(lineRaw);
      } catch {
        continue; // malformed lines are skipped, never fatal
      }
      if (!obj || typeof obj !== 'object') continue;
      const hasAny = ['mode', 'target_agent', 'agent_definition_loaded', 'resolved_route'].some((k) => k in obj);
      if (!hasAny) continue;
      const rec = {};
      for (const k of ['mode', 'target_agent', 'agent_definition_loaded', 'resolved_route']) {
        if (k in obj) rec[k] = obj[k];
      }
      records.push(rec);
      if (records.length >= 20) return records;
    }
  }
  return records;
}

function snapshotFixtureFiles(dir) {
  const set = new Set();
  if (!dir) return set;
  const walk = (d, base) => {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const rel = base ? base + '/' + e.name : e.name;
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full, rel);
      else if (e.isFile()) set.add(rel);
    }
  };
  walk(dir, '');
  return set;
}

function extractPorcelainPath(line) {
  if (line.length < 3) return '';
  let p = line.slice(3);
  if (p.startsWith('"') && p.endsWith('"')) {
    p = p.slice(1, -1).replace(/\\(.)/g, '$1');
  }
  return p;
}

function gitStatusPaths(repoRoot) {
  let out;
  try {
    out = execFileSync('git', ['-C', repoRoot, 'status', '--porcelain'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    return [];
  }
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(extractPorcelainPath)
    .filter(Boolean);
}

function isolationViolations(beforeSet, afterPaths, fixtureDir, outDir, repoRoot) {
  const violations = [];
  const fixAbs = fixtureDir ? path.resolve(fixtureDir) : null;
  const outAbs = outDir ? path.resolve(outDir) : null;
  for (const p of afterPaths) {
    if (beforeSet.has(p)) continue;
    const abs = path.isAbsolute(p) ? p : path.resolve(repoRoot, p);
    if (fixAbs && (abs === fixAbs || abs.startsWith(fixAbs + path.sep))) continue;
    if (outAbs && (abs === outAbs || abs.startsWith(outAbs + path.sep))) continue;
    violations.push(p);
    if (violations.length >= 50) break;
  }
  return violations;
}

function killTree(child) {
  try {
    if (process.platform !== 'win32' && child.pid) {
      process.kill(-child.pid, 'SIGKILL');
      return;
    }
  } catch {
    // group kill may miss; fall through to direct kill
  }
  try {
    child.kill('SIGKILL');
  } catch {
    // already gone
  }
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CLI parsing + main.                                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

function parseArgs(argv) {
  const out = { timeoutMs: undefined, watchdogMs: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === '--scenario') { out.scenario = next; i += 1; }
    else if (a === '--leg') { out.leg = next; i += 1; }
    else if (a === '--out-dir') { out.outDir = next; i += 1; }
    else if (a === '--timeout-ms') { const n = parseInt(next, 10); out.timeoutMs = Number.isNaN(n) ? undefined : n; i += 1; }
    else if (a === '--watchdog-ms') { const n = parseInt(next, 10); out.watchdogMs = Number.isNaN(n) ? undefined : n; i += 1; }
    else if (a === '--baseline') { out.baseline = next; i += 1; }
    else if (a === '--repo-root') { out.repoRoot = next; i += 1; }
    else { return { error: 'unknown flag: ' + a }; }
  }
  return out;
}

async function runOnce(args) {
  const contract = parseScenario(args.scenario);
  if (!contract) {
    console.error('behavior-bench-run: unparseable scenario: ' + args.scenario);
    return EXIT_CONTRACT;
  }

  const repoRoot = path.resolve(args.repoRoot || process.cwd());
  const outDir = path.resolve(args.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const fixtureDir = contract.fixture
    ? (path.isAbsolute(contract.fixture) ? contract.fixture : path.resolve(repoRoot, contract.fixture))
    : null;

  // Build spawn argv. The env seam overrides the leg table entirely (prompt appended last).
  let spawnArray;
  if (process.env.BEHAVIOR_BENCH_SPAWN_JSON) {
    let parsed;
    try {
      parsed = JSON.parse(process.env.BEHAVIOR_BENCH_SPAWN_JSON);
    } catch {
      console.error('behavior-bench-run: unparseable BEHAVIOR_BENCH_SPAWN_JSON');
      return EXIT_CONTRACT;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.error('behavior-bench-run: BEHAVIOR_BENCH_SPAWN_JSON must be a non-empty array');
      return EXIT_CONTRACT;
    }
    spawnArray = [...parsed, contract.prompt];
  } else {
    spawnArray = buildSpawnArgs(args.leg, contract);
    if (!spawnArray) {
      console.error('behavior-bench-run: unknown leg: ' + args.leg);
      return EXIT_CONTRACT;
    }
  }

  let baseline = null;
  if (args.baseline) {
    try {
      baseline = JSON.parse(fs.readFileSync(args.baseline, 'utf8'));
    } catch {
      console.error('behavior-bench-run: unparseable baseline: ' + args.baseline);
      return EXIT_CONTRACT;
    }
  }

  // Watchdog precedence: CLI flag, then scenario contract, then default.
  // Cells that delegate to subagents legitimately go quiet for minutes while
  // the LEAF works, so their contracts carry a wider window than the default.
  const watchdogMs = args.watchdogMs != null
    ? args.watchdogMs
    : (contract.watchdog_ms != null ? contract.watchdog_ms : DEFAULT_WATCHDOG_MS);
  const budgetMs = args.timeoutMs != null
    ? args.timeoutMs
    : (contract.budget_ms != null ? contract.budget_ms : DEFAULT_BUDGET_MS);

  const startedAt = new Date();
  const spawnTime = Date.now();

  // Observation state.
  let stdoutBuf = '';
  let stderrBuf = '';
  let stdoutNonEmptyLines = 0;
  let stdoutText = '';
  let tFirstOutputMs = null;
  let tSetupMs = null;
  let tFirstDispatchMs = null;
  let tTerminalMs = null;
  let lastDataActivityMs = spawnTime;
  const taskEvents = [];
  const guardWarnings = [];

  let exitCode = null;
  let killedBy = 'none';
  let spawnError = null;
  let terminated = false;

  const transcriptPath = path.join(outDir, contract.id + '-' + args.leg + '.transcript.jsonl');
  const stream = fs.createWriteStream(transcriptPath);

  const beforeFixture = snapshotFixtureFiles(fixtureDir);
  const gitBefore = new Set(gitStatusPaths(repoRoot));

  const [cmd, ...rest] = spawnArray;
  const child = spawn(cmd, rest, {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: process.platform !== 'win32',
    shell: false,
  });

  const emitLine = (src, line, t) => {
    stream.write(JSON.stringify({ t, src, line }) + '\n');
    if (line.length === 0) return;
    if (src === 'out') {
      stdoutNonEmptyLines += 1;
      stdoutText += line + '\n';
      if (tFirstOutputMs === null) tFirstOutputMs = t;
    }
    if (tSetupMs === null && SETUP_RE.test(line)) tSetupMs = t;
    if (DISPATCH_RE.test(line)) {
      if (tFirstDispatchMs === null) tFirstDispatchMs = t;
      if (taskEvents.length < 50) taskEvents.push({ t, line });
    }
    if (line.includes('mk-deep-loop-guard')) guardWarnings.push(line);
  };

  const onData = (src, chunk) => {
    lastDataActivityMs = Date.now();
    const t = Date.now() - spawnTime;
    let buf = src === 'out' ? stdoutBuf : stderrBuf;
    buf += chunk.toString();
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      emitLine(src, line, t);
    }
    if (src === 'out') stdoutBuf = buf;
    else stderrBuf = buf;
  };

  const flushRemainder = (src) => {
    const rem = src === 'out' ? stdoutBuf : stderrBuf;
    if (rem && rem.length > 0) {
      if (src === 'out') stdoutBuf = '';
      else stderrBuf = '';
      emitLine(src, rem, Date.now() - spawnTime);
    }
  };

  child.stdout.on('data', (chunk) => onData('out', chunk));
  child.stderr.on('data', (chunk) => onData('err', chunk));

  const terminate = (reason) => {
    if (terminated) return;
    terminated = true;
    killedBy = reason;
    killTree(child);
    // Guarantee resolution even if close never arrives.
    setTimeout(done, 5000);
  };

  let resolved = false;
  let runResolve;
  const done = () => {
    if (resolved) return;
    resolved = true;
    runResolve();
  };
  const runDone = new Promise((resolve) => { runResolve = resolve; });

  child.on('exit', (code, signal) => {
    exitCode = code == null ? null : code;
  });
  child.on('error', (err) => {
    spawnError = err;
    if (child.pid === undefined) done(); // process never started
    else setTimeout(done, 3000);
  });
  child.on('close', (code, signal) => {
    exitCode = code == null ? null : code;
    flushRemainder('out');
    flushRemainder('err');
    done();
  });

  // Watchdog: every 5s, stale-on-activity (data or fixture mtime) -> kill the tree.
  const watchdogTimer = setInterval(() => {
    const newestMtime = scanNewestMtime(fixtureDir);
    const activity = newestMtime > 0 ? Math.max(lastDataActivityMs, newestMtime) : lastDataActivityMs;
    if (Date.now() - activity > watchdogMs) terminate('watchdog');
  }, WATCHDOG_TICK_MS);

  // Hard timeout: budget exceeded -> kill the tree.
  const hardTimer = setTimeout(() => terminate('hard_timeout'), budgetMs);

  await runDone;

  clearInterval(watchdogTimer);
  clearTimeout(hardTimer);

  tTerminalMs = Date.now() - spawnTime;
  const endedAt = new Date();

  // Flush + close transcript before writing the result.
  stream.end();
  await new Promise((res) => stream.on('finish', res));

  const afterFixture = snapshotFixtureFiles(fixtureDir);
  const newFixtureFiles = [...afterFixture].filter((x) => !beforeFixture.has(x));
  const fixtureGained = newFixtureFiles.length > 0;

  const routeProofRecords = collectRouteProof(fixtureDir);

  const gitAfter = gitStatusPaths(repoRoot);
  const violations = isolationViolations(gitBefore, gitAfter, fixtureDir, outDir, repoRoot);

  const checkpoints = { tFirstOutputMs, tSetupMs, tFirstDispatchMs, tTerminalMs };
  const markerHits = matchMarkers(contract.expected_presentation_markers || [], stdoutText);

  const obs = {
    spawnError,
    exitCode,
    killedBy,
    stdoutNonEmptyLines,
    stdoutText,
    taskEvents,
    routeProofRecords,
    markerHits,
    fixtureGained,
    checkpoints,
  };

  const dimensions = score(contract, obs, baseline);
  const bucket = classify(contract, obs);

  const result = {
    schemaVersion: 1,
    scenarioId: contract.id,
    leg: args.leg,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    checkpoints,
    delegation: { taskEvents, routeProofRecords, guardWarnings },
    isolation: { clean: violations.length === 0, violations },
    terminal: { exitCode, killedBy },
    classification: bucket,
    dimensions,
    singleSample: true,
    transcriptPath,
  };

  const resultPath = path.join(outDir, contract.id + '-' + args.leg + '.result.json');
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n');

  console.log('behavior-bench-run: ' + contract.id + ' / ' + args.leg + ' -> ' + bucket);
  return EXIT_OK;
}

async function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  if (args.error) {
    console.error('behavior-bench-run: ' + args.error);
    process.exit(EXIT_CONTRACT);
  }
  if (!args.scenario || !args.leg || !args.outDir) {
    console.error('behavior-bench-run: --scenario, --leg and --out-dir are required');
    process.exit(EXIT_CONTRACT);
  }
  try {
    const code = await runOnce(args);
    process.exit(code);
  } catch (err) {
    console.error('behavior-bench-run: internal failure:', err);
    process.exit(EXIT_INTERNAL);
  }
}

module.exports = {
  classify,
  score,
  scoreD1,
  scoreD2,
  scoreD3,
  scoreD4,
  scoreD5,
  buildSpawnArgs,
  parseScenario,
  matchMarkers,
  LEG_TABLE,
};

if (require.main === module) {
  main();
}
