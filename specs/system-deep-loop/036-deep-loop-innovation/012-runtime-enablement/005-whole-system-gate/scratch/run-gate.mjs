// Whole-system gate. Measures a frozen commit and writes a receipt.
// Changes nothing: no runtime code, no protocol document, no authority record.
// Verdict is PASS only if every check that ran passed; any failing check => FAIL.
// There is no advisory tier — a warning that lets a failure through would defeat
// the purpose, which is to be believed at the exact moment someone wants to ship.
// The receipt is written whether the gate passes or fails: a gate that only
// reports good news is not a gate.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

// Absolute runtime directory. The gate is invoked from here under
// `node --import tsx run-gate.mjs`, and the check-3 imports resolve .ts via tsx.
const RUNTIME =
  '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime';

// Suite logs from a real two-hour run. Re-running the suite here would burn
// >2h for a number we already captured; the gate reads the captured artifacts.
// Declared as constants so they are trivial to repoint when a run moves.
const BASELINE_LOG =
  '/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/3d8efc78-2cdf-42fa-9383-4eb62a229b9b/scratchpad/p003/baseline-raw.txt';
const CANDIDATE_LOG =
  '/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/3d8efc78-2cdf-42fa-9383-4eb62a229b9b/scratchpad/p003/after-raw.txt';

// The commit whose tree the suite was measured against. The candidate must be
// byte-identical to this tree on the runtime path, or the suite numbers are
// numbers about a different commit than the one we are shipping.
const SUITE_TREE_REF = '16e802c037';
const DEFAULT_BASELINE_REF = '8c9f0b6944';

// A nonexistent path used to force git commands to fail for --break falsifiability.
// The point is to prove the gate can actually turn red and still write its receipt.
const NONEXISTENT_DIR = '/dev/null/does-not-exist-gate-break';
const NONEXISTENT_REF = '0000000000000000000000000000000000000001';

// ---------------------------------------------------------------- argv parsing

function parseArgs(argv) {
  const out = { candidate: null, baseline: null, out: null, break: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--candidate') out.candidate = argv[++i];
    else if (a === '--baseline') out.baseline = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--break') out['break'] = argv[++i];
  }
  return out;
}

// Resolve a SHA by executing git, never by trusting a typed literal as the
// source of truth. A receipt that names a commit nobody verified is a receipt
// about nothing: the literal could be a typo, a stale ref, or a SHA that never
// existed in this repository. Only git's own resolution counts as evidence.
function resolveSha(ref) {
  return execFileSync('git', ['rev-parse', ref], { encoding: 'utf8' }).trim();
}

// ---------------------------------------------------------------- check helpers

function gitStatusPorcelain(cwd) {
  return execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8', cwd });
}

function gitDiffStat(candidate, treeRef, pathspec) {
  return execFileSync(
    'git',
    ['diff', '--stat', candidate, treeRef, '--', pathspec],
    { encoding: 'utf8' }
  );
}

// Parse a vitest-style summary file. Returns null if the file is missing or the
// summary lines cannot be found — a missing/unparseable log is a hard fail,
// never silently treated as a pass.
function parseSuiteLog(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  const testsRe = /Tests\s+(?:(\d+) failed \| )?(\d+) passed(?: \| (\d+) skipped)?\s+\((\d+)\)/;
  const filesRe = /Test Files\s+(?:(\d+) failed \| )?(\d+) passed\s+\((\d+)\)/;
  const testsMatch = text.match(testsRe);
  const filesMatch = text.match(filesRe);
  if (!testsMatch || !filesMatch) return null;
  return {
    testsFailed: testsMatch[1] ? parseInt(testsMatch[1], 10) : 0,
    testsPassed: parseInt(testsMatch[2], 10),
    testsSkipped: testsMatch[3] ? parseInt(testsMatch[3], 10) : 0,
    testsTotal: parseInt(testsMatch[4], 10),
    filesFailed: filesMatch[1] ? parseInt(filesMatch[1], 10) : 0,
    filesPassed: parseInt(filesMatch[2], 10),
    filesTotal: parseInt(filesMatch[3], 10),
  };
}

function deltaSuite(candidate, baseline) {
  return {
    failed: candidate.testsFailed - baseline.testsFailed,
    passed: candidate.testsPassed - baseline.testsPassed,
    skipped: candidate.testsSkipped - baseline.testsSkipped,
    total: candidate.testsTotal - baseline.testsTotal,
    files: candidate.filesTotal - baseline.filesTotal,
  };
}

// ---------------------------------------------------------------- the checks

// check 1 — the working tree must be clean. The gate must not measure a tree
// that is drifting under it: a dirty tree means the SHAs name one commit while
// the actual bytes on disk are something else.
function checkTreeClean(forcedBreak) {
  if (forcedBreak === 'tree-clean') {
    // Force the real evaluation to be impossible (run git in a nonexistent cwd)
    // rather than faking the output. Proves the gate can turn red honestly.
    let out;
    try {
      out = gitStatusPorcelain(NONEXISTENT_DIR);
    } catch (e) {
      return { id: 'tree-clean', description: 'Working tree is clean', status: 'fail', detail: `forced break: ${e.message}` };
    }
    return { id: 'tree-clean', description: 'Working tree is clean', status: 'fail', detail: `forced break: unexpected output: ${out}` };
  }
  // The gate writes its receipt (and the script itself lives) inside the very
  // tree it measures, so its own footprint would appear here and make the check
  // report the measuring instrument instead of the system being measured.
  // Exclude the gate's own output directory by exact repo-root-relative path
  // comparison, not a loose filename substring that could match elsewhere.
  const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const gateDirRel = relative(repoRoot, SCRIPT_DIR);
  const raw = gitStatusPorcelain(repoRoot);
  // Porcelain v1 lines are "XY <path>" (two status chars, one space, then the
  // repo-root-relative path). Run from repoRoot so the paths are guaranteed
  // repo-root-relative regardless of where the gate was invoked from.
  const remaining = [];
  for (const line of raw.split('\n')) {
    if (line.length === 0) continue;
    const entryPath = line.slice(3);
    const finalPath = entryPath.includes(' -> ') ? entryPath.split(' -> ')[1] : entryPath;
    const rel = relative(gateDirRel, finalPath);
    const insideGateDir = rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
    if (!insideGateDir) remaining.push(line);
  }
  const excludedName = gateDirRel;
  if (remaining.length === 0) {
    return {
      id: 'tree-clean',
      description: 'Working tree is clean',
      status: 'pass',
      detail: `tree clean apart from the gate's own artifacts; excluded ${excludedName} (gate output directory); nothing remained after exclusion`,
    };
  }
  return {
    id: 'tree-clean',
    description: 'Working tree is clean',
    status: 'fail',
    detail: `excluded ${excludedName} (gate output directory); remaining after exclusion:\n${remaining.join('\n').trim()}`,
  };
}

// check 2 — the candidate's runtime tree must be byte-identical to the tree the
// suite was measured against. If it differs, the suite numbers describe a
// different commit than the one being shipped.
function checkCandidateFrozen(candidateSha, forcedBreak) {
  if (forcedBreak === 'candidate-frozen') {
    let out;
    try {
      out = gitDiffStat(candidateSha, NONEXISTENT_REF, '.opencode/skills/system-deep-loop/runtime/');
    } catch (e) {
      return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: `forced break: ${e.message}` };
    }
    return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: `forced break: unexpected output: ${out}` };
  }
  const out = gitDiffStat(candidateSha, SUITE_TREE_REF, '.opencode/skills/system-deep-loop/runtime/');
  if (out.trim() === '') {
    return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'pass', detail: 'identical' };
  }
  return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: out.trim() };
}

// check 3 — every mode's durable authority record must show the authority has
// actually moved to the new reversible state. Any mode still on legacy is a
// FAIL; do not soften this. The whole point of the gate is that authority
// actually moved, not that the files exist.
async function checkAuthorityState() {
  const { AuthorityRegistry, AUTHORITY_FLIP_MODE_ORDER } = await import(
    `${RUNTIME}/lib/per-mode-authority-flip/index.ts`
  );
  const { resolveAuthorityRoot } = await import(
    `${RUNTIME}/lib/authority-root/resolve-authority-root.ts`
  );
  const registry = new AuthorityRegistry(resolveAuthorityRoot());
  const records = [];
  for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
    const rec = registry.read(mode); // pure read; writes nothing
    records.push({
      mode,
      state: rec.state,
      epoch: rec.epoch,
      selectedWriter: rec.selectedWriter,
    });
  }
  const count = records.length;
  const byState = {};
  for (const r of records) byState[r.state] = (byState[r.state] || 0) + 1;
  const allMoved = records.every((r) => r.state === 'new_authoritative_reversible');
  const stateSummary = Object.entries(byState)
    .map(([s, n]) => `${n} on ${s}`)
    .join(', ');
  const detail = `read ${count} modes; ${stateSummary}`;
  return {
    id: 'authority-state',
    description: 'Every mode authority has moved to new_authoritative_reversible',
    status: allMoved ? 'pass' : 'fail',
    detail,
    records,
  };
}

// check 4 — read the captured suite logs, do not re-run. Pass when the
// candidate's failed-test count is <= the baseline's. Reported as a delta,
// never as a bare number: a bare 'passed' hides whether anything regressed.
function checkRuntimeSuite() {
  const baseline = parseSuiteLog(BASELINE_LOG);
  const candidate = parseSuiteLog(CANDIDATE_LOG);
  if (!baseline) {
    return {
      id: 'runtime-suite',
      description: 'Candidate suite failures <= baseline (read from captured logs)',
      status: 'fail',
      detail: `baseline log missing or unparseable: ${BASELINE_LOG}`,
      suite: { baseline: null, candidate, delta: null },
    };
  }
  if (!candidate) {
    return {
      id: 'runtime-suite',
      description: 'Candidate suite failures <= baseline (read from captured logs)',
      status: 'fail',
      detail: `candidate log missing or unparseable: ${CANDIDATE_LOG}`,
      suite: { baseline, candidate: null, delta: null },
    };
  }
  const delta = deltaSuite(candidate, baseline);
  const passed = candidate.testsFailed <= baseline.testsFailed;
  const deltaDetail =
    `failed ${candidate.testsFailed} vs ${baseline.testsFailed} (Δ${delta.failed >= 0 ? '+' : ''}${delta.failed}); ` +
    `passed ${candidate.testsPassed} vs ${baseline.testsPassed} (Δ${delta.passed >= 0 ? '+' : ''}${delta.passed}); ` +
    `skipped ${candidate.testsSkipped} vs ${baseline.testsSkipped} (Δ${delta.skipped >= 0 ? '+' : ''}${delta.skipped}); ` +
    `total ${candidate.testsTotal} vs ${baseline.testsTotal} (Δ${delta.total >= 0 ? '+' : ''}${delta.total}); ` +
    `files ${candidate.filesTotal} vs ${baseline.filesTotal} (Δ${delta.files >= 0 ? '+' : ''}${delta.files})`;
  return {
    id: 'runtime-suite',
    description: 'Candidate suite failures <= baseline (read from captured logs)',
    status: passed ? 'pass' : 'fail',
    detail: deltaDetail,
    suite: { baseline, candidate, delta },
  };
}

// check 5 — each listed consumer script must exist on disk and be startable.
// A check that is structurally incapable of turning red is worse than no
// check at all: it prints a green that lulls an operator into believing a
// property was verified when nothing was. The previous shape only looked at
// whether spawn returned a numeric status, but node returns a numeric status
// even for a script that does not exist on disk — so the guard could never
// fire and the green was meaningless. This version fails on either a missing
// file or a spawn that could not start, which are the two things it can
// actually prove. A non-zero exit from a script invoked without its required
// arguments is expected and is NOT a failure here. This proves reachability
// only; it is not proof the consumers work end to end.
function checkConsumerReachability() {
  const scripts = [
    'scripts/reduce-state.cjs',
    'scripts/reduce-alignment-state.cjs',
    'scripts/verify-iteration.cjs',
    'scripts/fanout-merge.cjs',
    'scripts/fanout-salvage.cjs',
    'scripts/query.cjs',
    'scripts/status.cjs',
  ];
  const results = [];
  for (const rel of scripts) {
    const scriptPath = join(RUNTIME, rel);
    const exists = existsSync(scriptPath);
    const res = spawnSync(process.execPath, [scriptPath], { encoding: 'utf8', cwd: RUNTIME });
    const stdoutFirst = (res.stdout || '').split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
    const stderrFirst = (res.stderr || '').split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
    const firstLine = (stdoutFirst || stderrFirst || '').slice(0, 200);
    results.push({ script: rel, exists, exitCode: res.status, firstLine });
  }
  const missing = results.filter((r) => !r.exists);
  const notSpawned = results.filter((r) => r.exitCode === null || r.exitCode === undefined);
  const ok = missing.length === 0 && notSpawned.length === 0;
  return {
    id: 'consumer-reachability',
    description: 'Every listed consumer script exists on disk and can be started',
    status: ok ? 'pass' : 'fail',
    detail: ok
      ? `all ${results.length} scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability only, not end-to-end correctness`
      : `${missing.length} script(s) missing on disk; ${notSpawned.length} script(s) could not be spawned`,
    results,
  };
}

// check — not run. An end-to-end reader contract requires files projected by
// an enabled mode; no mode is currently enabled, so running one now would
// pass vacuously. Recorded as not-run rather than skipped silently so the
// receipt stays honest about what was and was not measured.
function checkReaderContracts() {
  return {
    id: 'reader-contracts',
    description: 'End-to-end reader contract (not run)',
    status: 'not-run',
    detail:
      'An end-to-end reader contract requires files projected by an enabled mode. No mode is currently enabled, so running one now would pass vacuously. Recorded as not-run rather than skipped silently.',
  };
}

// check 6 — not run. A not-run check is an unanswered question, not a satisfied
// one, so it can never count toward a pass; it forces the verdict to INCOMPLETE
// at best. Recording it explicitly (rather than silently skipping) keeps the
// receipt honest about what was and was not measured.
function checkFanoutRealRun() {
  return {
    id: 'fanout-real-run',
    description: 'Real fan-out dispatch (not run)',
    status: 'not-run',
    detail:
      'Requires a real fan-out dispatching external CLI subprocesses. Not run: the authority check already fails, so the verdict is determined, and a real fan-out spends model budget to confirm a foregone conclusion. Recorded as not-run rather than skipped silently.',
  };
}

// ---------------------------------------------------------------- verdict

function computeVerdict(checks) {
  const anyFail = checks.some((c) => c.status === 'fail');
  if (anyFail) return 'FAIL';
  const anyNotRun = checks.some((c) => c.status === 'not-run');
  if (anyNotRun) return 'INCOMPLETE';
  return 'PASS';
}

// ---------------------------------------------------------------- receipt writers

function truncate(s, n) {
  if (s === null || s === undefined) return '';
  const str = String(s);
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function writeReceipts(outDir, receipt) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', 'utf8');

  const lines = [];
  lines.push('# Whole-System Gate Receipt');
  lines.push('');
  lines.push(`- Candidate SHA: \`${receipt.candidateSha}\``);
  lines.push(`- Baseline SHA: \`${receipt.baselineSha}\``);
  lines.push(`- Generated: ${receipt.generatedAt}`);
  if (receipt.forcedBreak) lines.push(`- Forced break: \`${receipt.forcedBreak}\``);
  lines.push('');
  lines.push('| Check | Status | Detail |');
  lines.push('| --- | --- | --- |');
  for (const c of receipt.checks) {
    lines.push(`| ${c.id} | ${c.status} | ${truncate(c.detail, 120).replace(/\|/g, '\\|')} |`);
  }
  lines.push('');
  if (receipt.suite && receipt.suite.delta) {
    const d = receipt.suite.delta;
    lines.push('## Suite delta (candidate − baseline)');
    lines.push('');
    lines.push(`- failed: ${d.failed >= 0 ? '+' : ''}${d.failed}`);
    lines.push(`- passed: ${d.passed >= 0 ? '+' : ''}${d.passed}`);
    lines.push(`- skipped: ${d.skipped >= 0 ? '+' : ''}${d.skipped}`);
    lines.push(`- total: ${d.total >= 0 ? '+' : ''}${d.total}`);
    lines.push(`- files: ${d.files >= 0 ? '+' : ''}${d.files}`);
    lines.push('');
  } else {
    lines.push('## Suite delta');
    lines.push('');
    lines.push('Suite logs unavailable; no delta computed.');
    lines.push('');
  }
  lines.push(`## Verdict: **${receipt.verdict}**`);
  lines.push('');
  writeFileSync(join(outDir, 'receipt.md'), lines.join('\n') + '\n', 'utf8');
}

// ---------------------------------------------------------------- main

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = args.out ? resolve(args.out) : SCRIPT_DIR;
  const forcedBreak = args['break'] || null;

  // SHAs are resolved by executing git even when a flag is supplied, so the
  // receipt always names a commit git itself verified exists in this repo.
  const candidateSha = resolveSha(args.candidate || 'HEAD');
  const baselineSha = resolveSha(args.baseline || DEFAULT_BASELINE_REF);

  const checks = [];
  let suite = { baseline: null, candidate: null, delta: null };

  // check 1
  try {
    checks.push(checkTreeClean(forcedBreak));
  } catch (e) {
    checks.push({ id: 'tree-clean', description: 'Working tree is clean', status: 'fail', detail: e.message });
  }

  // check 2
  try {
    checks.push(checkCandidateFrozen(candidateSha, forcedBreak));
  } catch (e) {
    checks.push({ id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: e.message });
  }

  // check 3
  try {
    const r = await checkAuthorityState();
    checks.push(r);
  } catch (e) {
    checks.push({ id: 'authority-state', description: 'Every mode authority has moved to new_authoritative_reversible', status: 'fail', detail: e.message });
  }

  // check 4
  try {
    const r = checkRuntimeSuite();
    checks.push(r);
    if (r.suite) suite = r.suite;
  } catch (e) {
    checks.push({ id: 'runtime-suite', description: 'Candidate suite failures <= baseline (read from captured logs)', status: 'fail', detail: e.message });
  }

  // check 5
  try {
    checks.push(checkConsumerReachability());
  } catch (e) {
    checks.push({ id: 'consumer-reachability', description: 'Every listed consumer script exists on disk and can be started', status: 'fail', detail: e.message });
  }

  // check — always not-run, immediately after consumer-reachability
  checks.push(checkReaderContracts());

  // check 6 — always not-run
  checks.push(checkFanoutRealRun());

  const verdict = computeVerdict(checks);

  const receipt = {
    generatedAt: new Date().toISOString(),
    candidateSha,
    baselineSha,
    forcedBreak,
    verdict,
    checks: checks.map((c) => ({
      id: c.id,
      description: c.description,
      status: c.status,
      detail: c.detail,
    })),
    suite,
  };

  // Always write the receipt before exiting, in every verdict branch. A gate
  // that only writes on success is not a gate.
  try {
    writeReceipts(outDir, receipt);
  } catch (e) {
    // Even the writer can fail (e.g. out dir unwritable). Print and exit non-zero
    // so the failure is never silent, but still attempt to report the verdict.
    console.error(`receipt write failed: ${e.message}`);
    process.exit(1);
  }

  console.log(`verdict: ${verdict}`);
  process.exit(verdict === 'PASS' ? 0 : verdict === 'FAIL' ? 1 : 2);
}

main().catch((e) => {
  // Last-resort: an unexpected throw outside any check's try/catch. Still try
  // to leave a receipt so the failure is legible rather than a bare stack.
  try {
    const receipt = {
      generatedAt: new Date().toISOString(),
      candidateSha: null,
      baselineSha: null,
      forcedBreak: null,
      verdict: 'FAIL',
      checks: [],
      suite: { baseline: null, candidate: null, delta: null },
      fatal: e.message,
    };
    const outDir = parseArgs(process.argv.slice(2)).out || SCRIPT_DIR;
    writeReceipts(resolve(outDir), receipt);
  } catch {
    /* nothing more we can do */
  }
  console.error(`gate fatal: ${e.message}`);
  process.exit(1);
});
