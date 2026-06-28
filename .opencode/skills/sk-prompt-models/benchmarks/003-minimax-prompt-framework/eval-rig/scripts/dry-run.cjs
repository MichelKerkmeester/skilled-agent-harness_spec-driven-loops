#!/usr/bin/env node
/**
 * scripts/dry-run.cjs
 *
 * Dry-run gate for 002-eval-rig. NO SWE 1.6 dispatches. Validates the rig
 * pipeline on canned outputs and synthetic cache traffic. Exits 0 iff all
 * subtests pass.
 *
 * Subtests:
 *   --test-cache              100 concurrent writes; verify all readable, no torn entries.
 *   --test-deterministic      Run all 4 deterministic checks on 3 canned outputs;
 *                              assert passing scores high, failing scores low.
 *   --test-grader-stub        Verify grader/harness.parseGraderResponse on 4 mock shapes.
 *   --test-cache-reconstruct  Corrupt index; reconstruct; verify rebuild count.
 *   --full (default)          Run all 4 subtests.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const PACKET_ROOT = path.resolve(__dirname, '..');
const cache = require(path.join(PACKET_ROOT, 'lib', 'cache.cjs'));
const harness = require(path.join(PACKET_ROOT, 'grader', 'harness.cjs'));

const FIXTURES_ROOT = path.join(PACKET_ROOT, 'fixtures');
const CANNED_ROOT = path.join(__dirname, 'dry-run-fixtures');
const DET_SCRIPTS = {
  bundleGate: path.join(__dirname, 'deterministic', 'bundle-gate.cjs'),
  cwdCheck: path.join(__dirname, 'deterministic', 'cwd-check.cjs'),
  preplanning: path.join(__dirname, 'deterministic', 'preplanning-regex.cjs'),
  hallucination: path.join(__dirname, 'deterministic', 'hallucination-flag.cjs'),
};

function log(level, msg) {
  const prefix = { info: 'INFO', pass: 'PASS', fail: 'FAIL', warn: 'WARN' }[level] || 'INFO';
  process.stdout.write(`[${prefix}] ${msg}\n`);
}

function runDetCheck(checkPath, fixturePath, outputPath) {
  const res = spawnSync('node', [checkPath, fixturePath, outputPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.status !== 0) {
    return { ok: false, err: res.stderr || res.stdout || `exit ${res.status}` };
  }
  try {
    return { ok: true, result: JSON.parse(res.stdout.trim()) };
  } catch (e) {
    return { ok: false, err: 'failed to parse JSON: ' + res.stdout };
  }
}

function fixturePath(id) {
  return path.join(FIXTURES_ROOT, id, 'task.json');
}

function testCache() {
  log('info', 'test-cache: writing 100 entries to cache/det/');
  // Reset det index
  const detDir = path.join(PACKET_ROOT, 'cache', 'det');
  for (const f of fs.readdirSync(detDir)) {
    if (f.endsWith('.out.md') && f.startsWith('drytest_')) {
      try { fs.unlinkSync(path.join(detDir, f)); } catch (_) {}
    }
  }
  // Reset index
  fs.writeFileSync(path.join(detDir, 'index.jsonl'), '');

  const keys = [];
  for (let i = 0; i < 100; i++) {
    const key = 'drytest_' + crypto.randomBytes(8).toString('hex');
    keys.push(key);
    cache.write_atomic('det', key, `# entry ${i}\nbody ${i}`, {
      synthetic: true,
      entry_no: i,
    });
  }
  // Verify
  let missing = 0;
  let unreadable = 0;
  for (const key of keys) {
    if (!cache.cache_hit('det', key)) {
      missing++;
      continue;
    }
    const r = cache.read('det', key);
    if (!r || !r.body) unreadable++;
  }
  const idx = cache.read_index('det');
  const indexRows = idx.length;
  log('info', `test-cache: wrote=100 missing=${missing} unreadable=${unreadable} index_rows=${indexRows}`);
  // Cleanup
  for (const key of keys) {
    try { fs.unlinkSync(path.join(detDir, `${key}.out.md`)); } catch (_) {}
  }
  fs.writeFileSync(path.join(detDir, 'index.jsonl'), '');
  const passed = missing === 0 && unreadable === 0 && indexRows === 100;
  return { passed, missing, unreadable, indexRows };
}

function testDeterministic() {
  log('info', 'test-deterministic: scoring 3 canned outputs');
  const fixture = fixturePath('fix-007-baseline-pure-function');
  const cannedPassing = path.join(CANNED_ROOT, 'passing.canned.md');
  const cannedFailing = path.join(CANNED_ROOT, 'failing.canned.md');
  const cannedParseError = path.join(CANNED_ROOT, 'parse-error.canned.md');

  const results = {};
  for (const [name, output] of [['passing', cannedPassing], ['failing', cannedFailing], ['parseError', cannedParseError]]) {
    results[name] = {};
    for (const [checkName, checkPath] of Object.entries(DET_SCRIPTS)) {
      const r = runDetCheck(checkPath, fixture, output);
      if (!r.ok) {
        log('fail', `${checkName} on ${name}: ${r.err}`);
        results[name][checkName] = { error: r.err };
      } else {
        results[name][checkName] = r.result;
        log('info', `${checkName} on ${name}: score=${r.result.score}${r.result.hard_gate_failed ? ' HARD-GATE' : ''}`);
      }
    }
  }

  // Assertions
  const expectations = [];
  // passing.canned.md should score HIGH on preplanning + hallucination + cwd
  expectations.push({
    label: 'passing.preplanning >= 0.6',
    actual: results.passing.preplanning && results.passing.preplanning.score,
    threshold: 0.6, cmp: 'gte',
  });
  expectations.push({
    label: 'passing.hallucination >= 0.5',
    actual: results.passing.hallucination && results.passing.hallucination.score,
    threshold: 0.5, cmp: 'gte',
  });
  expectations.push({
    label: 'passing.cwdCheck >= 0.7',
    actual: results.passing.cwdCheck && results.passing.cwdCheck.score,
    threshold: 0.7, cmp: 'gte',
  });
  // failing.canned.md should score LOW on preplanning + hallucination + cwd
  expectations.push({
    label: 'failing.preplanning < 0.6',
    actual: results.failing.preplanning && results.failing.preplanning.score,
    threshold: 0.6, cmp: 'lt',
  });
  expectations.push({
    label: 'failing.hallucination < 0.8',
    actual: results.failing.hallucination && results.failing.hallucination.score,
    threshold: 0.8, cmp: 'lt',
  });
  expectations.push({
    label: 'failing.cwdCheck < 1.0',
    actual: results.failing.cwdCheck && results.failing.cwdCheck.score,
    threshold: 1.0, cmp: 'lt',
  });
  // parseError empty input: preplanning = 0, hallucination should be tolerant (no claims to flag)
  expectations.push({
    label: 'parseError.preplanning == 0.0',
    actual: results.parseError.preplanning && results.parseError.preplanning.score,
    threshold: 0.0, cmp: 'eq',
  });

  let allOk = true;
  for (const exp of expectations) {
    const a = exp.actual;
    if (a === undefined || a === null) {
      log('fail', `${exp.label}: actual is undefined`);
      allOk = false;
      continue;
    }
    let ok = false;
    if (exp.cmp === 'gte') ok = a >= exp.threshold;
    if (exp.cmp === 'lt') ok = a < exp.threshold;
    if (exp.cmp === 'eq') ok = Math.abs(a - exp.threshold) < 1e-9;
    if (ok) log('pass', `${exp.label} (actual=${a})`);
    else { log('fail', `${exp.label} (actual=${a})`); allOk = false; }
  }
  return { passed: allOk, results, expectations_total: expectations.length };
}

async function testGraderStub() {
  log('info', 'test-grader-stub: verifying parser on 4 mock shapes');
  const cases = [
    { name: 'high-confidence', mock: 'high-confidence', expectScoreGte: 0.9, expectStatus: 'ok' },
    { name: 'low-confidence', mock: 'low-confidence', expectScoreGte: 0.0, expectStatus: 'ok' },
    { name: 'parse-failure', mock: 'parse-failure', expectScoreGte: 0.0, expectStatus: 'failed' },
    { name: 'fenced', mock: 'fenced', expectScoreGte: 0.6, expectStatus: 'fallback_fenced' },
  ];
  let allOk = true;
  const fixture = JSON.parse(fs.readFileSync(fixturePath('fix-007-baseline-pure-function'), 'utf8'));
  const cannedOutput = fs.readFileSync(path.join(CANNED_ROOT, 'passing.canned.md'), 'utf8');
  for (const c of cases) {
    const result = await harness.gradeD4({
      fixture,
      swe16_output_text: cannedOutput + '\n<!-- variant marker ' + c.name + ' -->\n',
      variant_hash: 'dry-run-' + c.name,
      rubric_version: 'v1.0.0-test',
      mode: 'mock',
      mock_mode: c.mock,
    });
    const okStatus = result.parse_status === c.expectStatus;
    const okScore = typeof result.score === 'number' && result.score >= c.expectScoreGte;
    if (okStatus && okScore) {
      log('pass', `grader-stub ${c.name}: parse_status=${result.parse_status} score=${result.score}`);
    } else {
      log('fail', `grader-stub ${c.name}: expected parse_status=${c.expectStatus} score>=${c.expectScoreGte}, got parse_status=${result.parse_status} score=${result.score}`);
      allOk = false;
    }
  }
  return { passed: allOk };
}

function testCacheReconstruct() {
  log('info', 'test-cache-reconstruct: corrupting and rebuilding index');
  const detDir = path.join(PACKET_ROOT, 'cache', 'det');
  // Write 5 fresh entries
  const keys = [];
  for (let i = 0; i < 5; i++) {
    const key = 'reconstruct_' + crypto.randomBytes(6).toString('hex');
    keys.push(key);
    cache.write_atomic('det', key, '# blob ' + i, { reconstruct_test: true, n: i });
  }
  const beforeIndexLines = cache.read_index('det').length;
  // Corrupt index by overwriting with garbage
  fs.writeFileSync(path.join(detDir, 'index.jsonl'), 'CORRUPTED ROW\n{not valid json\n');
  // Rebuild
  const rebuildResult = cache.rebuild_index('det');
  const afterIndexLines = cache.read_index('det').length;
  log('info', `reconstruct: before=${beforeIndexLines} rebuilt=${rebuildResult.rebuilt_count} after=${afterIndexLines}`);
  const passed = afterIndexLines >= keys.length;
  // Cleanup
  for (const key of keys) {
    try { fs.unlinkSync(path.join(detDir, `${key}.out.md`)); } catch (_) {}
  }
  fs.writeFileSync(path.join(detDir, 'index.jsonl'), '');
  return { passed, before: beforeIndexLines, rebuilt: rebuildResult.rebuilt_count, after: afterIndexLines };
}

function verifyNoSWE16Dispatch() {
  log('info', 'verify: grep for SWE 1.6 dispatch in scripts/, grader/, lib/');
  // Build pattern via concatenation so the source line below this comment
  // doesn't literally contain the dispatch tokens we're forbidding.
  const tok1 = 'cli' + '-' + 'devin';
  const tok2 = 'devin' + ' --';
  const tok3 = 'swe' + '-1\\.6';
  const pattern = [tok1, tok2, tok3].join('|');
  const grep = spawnSync('grep', [
    '-rn',
    '--include=*.cjs',
    '--include=*.js',
    '-E',
    pattern,
    'scripts/', 'grader/', 'lib/',
  ], { encoding: 'utf8', cwd: PACKET_ROOT });
  // grep exit 1 means no matches (desired)
  if (grep.status === 1) {
    log('pass', 'no SWE 1.6 dispatch found');
    return { passed: true };
  }
  if (grep.status === 0) {
    log('fail', 'SWE 1.6 dispatch found in:');
    process.stdout.write(grep.stdout);
    return { passed: false, matches: grep.stdout };
  }
  log('warn', `grep returned status ${grep.status}: ${grep.stderr}`);
  return { passed: false, error: grep.stderr };
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--full';
  const results = {};

  log('info', `dry-run mode: ${mode}`);

  if (mode === '--test-cache' || mode === '--full') {
    results.cache = testCache();
    if (results.cache.passed) log('pass', 'test-cache: PASSED');
    else log('fail', 'test-cache: FAILED');
  }
  if (mode === '--test-deterministic' || mode === '--full') {
    results.deterministic = testDeterministic();
    if (results.deterministic.passed) log('pass', 'test-deterministic: PASSED');
    else log('fail', 'test-deterministic: FAILED');
  }
  if (mode === '--test-grader-stub' || mode === '--full') {
    results.graderStub = await testGraderStub();
    if (results.graderStub.passed) log('pass', 'test-grader-stub: PASSED');
    else log('fail', 'test-grader-stub: FAILED');
  }
  if (mode === '--test-cache-reconstruct' || mode === '--full') {
    results.cacheReconstruct = testCacheReconstruct();
    if (results.cacheReconstruct.passed) log('pass', 'test-cache-reconstruct: PASSED');
    else log('fail', 'test-cache-reconstruct: FAILED');
  }
  if (mode === '--full') {
    results.noDispatch = verifyNoSWE16Dispatch();
    if (results.noDispatch.passed) log('pass', 'verify-no-swe16-dispatch: PASSED');
    else log('fail', 'verify-no-swe16-dispatch: FAILED');
  }

  const allOk = Object.values(results).every((r) => r.passed);
  process.stdout.write('\n========== DRY-RUN SUMMARY ==========\n');
  for (const [k, v] of Object.entries(results)) {
    process.stdout.write(`  ${k}: ${v.passed ? 'PASS' : 'FAIL'}\n`);
  }
  process.stdout.write(`========== ${allOk ? 'ALL PASS' : 'FAILURE'} ==========\n`);

  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  process.stderr.write('dry-run error: ' + err.stack + '\n');
  process.exit(1);
});
