#!/usr/bin/env node
/**
 * Check that a phrase a hub's router advertises actually reaches that hub.
 *
 * usage: ci-router-vocabulary-reach.cjs [--hub <id>] [--json] [--limit N]
 *
 * A router's INTENT_SIGNALS resolves an intent inside a hub that has already been
 * chosen. A hub's graph-metadata.json intent_signals is what decides which hub
 * gets chosen. The two are not meant to match, so diffing them reports hundreds
 * of differences that are not defects: a bare common word belongs in the first and
 * would over-trigger in the second.
 *
 * The only thing that settles it is asking the advisor. This probes every
 * multi-word phrase a router declares and reports the ones that do not reach the
 * hub declaring them, which is the failure a diff cannot distinguish from design.
 *
 * Single words are skipped: they fail on length rather than on vocabulary, and
 * reporting them buries the real cases.
 */
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

// Probing is the whole cost of this check, and it is spent waiting rather than
// working: an uncached prompt takes about six seconds inside the advisor whichever
// entry point asks, so the process spawn is noise. Sequentially that is over forty
// minutes for the fleet, which is long enough that the check gets sampled instead
// of run, and a sampled inventory is how phrases stayed broken across green runs.
// The daemon serves concurrent callers, so the wait overlaps.
const DEFAULT_CONCURRENCY = 8;

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (let i = next++; i < items.length; i = next++) {
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS = path.join(REPO_ROOT, '.opencode', 'skills');
// Overridable so the fail-closed path can be exercised against an advisor that is
// not there. A gate nobody can watch fail is a gate nobody knows the shape of.
const ADVISOR = process.env.ROUTER_REACH_ADVISOR
  || path.join(REPO_ROOT, '.opencode', 'bin', 'skill-advisor.cjs');

function hubs() {
  return fs.readdirSync(SKILLS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => fs.existsSync(path.join(SKILLS, n, 'mode-registry.json'))
      && fs.existsSync(path.join(SKILLS, n, 'ROUTER.md')))
    .sort();
}

function declaredPhrases(hub) {
  const text = fs.readFileSync(path.join(SKILLS, hub, 'ROUTER.md'), 'utf8');
  const block = /INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/.exec(text);
  if (!block) return [];
  const found = [...block[1].matchAll(/"([^"]{3,60})"/g)].map((m) => m[1]);
  return [...new Set(found.filter((k) => (
    // a single token fails on length, not on vocabulary; reporting it buries the rest
    k.includes(' ')
    // a quote-delimited match is not always a phrase. Where a router formats its
    // block across lines, the text between two quoted keywords is punctuation and
    // structure, and probing it wastes a call and prints a row nobody can act on.
    && /^[a-z0-9]/i.test(k)
    && !/[{}[\]]/.test(k)
    && !/^(weight|keywords)$/i.test(k)
  )))];
}

// A probe that could not run is not a phrase that reached nobody. Collapsing the
// two lets a missing binary, a non-zero exit, a timeout or a cold daemon print a
// clean pass over an advisor that never answered, so every failure to ask is
// returned as its own result and fails the run.
async function reaches(phrase, hub) {
  let raw;
  try {
    ({ stdout: raw } = await execFileAsync('node', [ADVISOR, 'advisor_recommend', '--json',
      JSON.stringify({ prompt: phrase }), '--format', 'json'],
    { encoding: 'utf8', timeout: 60000 }));
  } catch (err) {
    const detail = err.stderr ? String(err.stderr).trim().split('\n')[0] : '';
    return { error: `probe failed: ${err.code || err.message}${detail ? ` (${detail})` : ''}` };
  }
  let data;
  try { data = JSON.parse(raw).data; } catch {
    return { error: 'probe returned unparseable JSON' };
  }
  if (!data) return { error: 'probe returned no data envelope' };
  const bar = data.effectiveThresholds ? data.effectiveThresholds.confidenceThreshold : 0.8;
  const above = (data.recommendations || []).filter((r) => r.confidence >= bar);
  const generation = data.trustState ? data.trustState.generation : null;
  // Presence above the bar is not routing. A hub sitting second behind a higher
  // scorer never answers the request, so the declaring hub has to rank first for
  // the phrase to count as reaching it.
  return {
    hit: above.length > 0 && above[0].skillId === hub,
    present: above.some((r) => r.skillId === hub),
    top: above.slice(0, 2),
    generation,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;
  const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
  const asJson = args.includes('--json');

  // A truncated inventory proves only what it sampled, which is how phrases stay
  // broken across green runs. Sampling stays available by hand and is refused
  // wherever the result is read as a gate.
  if (limit !== Infinity && process.env.CI) {
    process.stderr.write('--limit is refused under CI: a sampled run cannot gate a build\n');
    process.exit(2);
  }

  const concurrency = args.includes('--concurrency')
    ? Math.max(1, Number(args[args.indexOf('--concurrency') + 1]) || DEFAULT_CONCURRENCY)
    : DEFAULT_CONCURRENCY;

  const report = [];
  let generation = null;
  for (const hub of hubs()) {
    if (only && hub !== only) continue;
    const phrases = declaredPhrases(hub).slice(0, limit);
    const unreachable = [];
    // Probes overlap, but the report is emitted in declaration order, so a run is
    // diffable against the previous one.
    const probed = await pool(phrases, concurrency, (phrase) => reaches(phrase, hub));
    for (let i = 0; i < phrases.length; i += 1) {
      const phrase = phrases[i];
      const r = probed[i];
      if (r.generation != null) generation = r.generation;
      if (r.error) {
        unreachable.push({ phrase, kind: 'probe-error', reaches: [r.error] });
        continue;
      }
      if (!r.hit) {
        // Three failures wearing one symptom. Another hub ranked first while this
        // one never surfaced is a routing defect. This hub surfaced but lost the
        // top slot is the same defect wearing a passing score. Nothing above the
        // bar at all is usually length, which vocabulary does not fix.
        unreachable.push({
          phrase,
          kind: r.top.length ? (r.present ? 'outranked' : 'wrong-hub') : 'no-reach',
          reaches: r.top.map((t) => `${t.skillId}=${t.confidence.toFixed(4)}`),
        });
      }
    }
    // A hub whose router parsed to nothing is a broken extractor reading as a
    // clean hub, so an empty inventory is a failure rather than a quiet zero.
    if (phrases.length === 0) {
      unreachable.push({ phrase: '(inventory)', kind: 'probe-error', reaches: ['router declared no multi-word phrases'] });
    }
    report.push({ hub, declared: phrases.length, unreachable });
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    for (const r of report) {
      const errs = r.unreachable.filter((u) => u.kind === 'probe-error');
      const wrong = r.unreachable.filter((u) => u.kind === 'wrong-hub');
      const lost = r.unreachable.filter((u) => u.kind === 'outranked');
      const none = r.unreachable.filter((u) => u.kind === 'no-reach');
      const bad = errs.length + wrong.length + lost.length;
      process.stdout.write(`${bad ? 'FAIL' : 'OK  '} ${r.hub.padEnd(28)} declared=${String(r.declared).padStart(3)} wrong-hub=${String(wrong.length).padStart(3)} outranked=${String(lost.length).padStart(3)} no-reach=${String(none.length).padStart(3)} probe-error=${String(errs.length).padStart(3)}\n`);
      for (const u of errs) {
        process.stdout.write(`       probe-error ${u.phrase.padEnd(41)} ${u.reaches.join(', ')}\n`);
      }
      for (const u of wrong) {
        process.stdout.write(`       wrong-hub  ${u.phrase.padEnd(42)} ${u.reaches.join(', ')}\n`);
      }
      for (const u of lost) {
        process.stdout.write(`       outranked  ${u.phrase.padEnd(42)} ${u.reaches.join(', ')}\n`);
      }
      for (const u of none) {
        process.stdout.write(`       no-reach   ${u.phrase}\n`);
      }
    }
    const tally = (kind) => report.reduce((n, r) => n + r.unreachable.filter((u) => u.kind === kind).length, 0);
    const errs = tally('probe-error');
    const wrong = tally('wrong-hub');
    const lost = tally('outranked');
    const none = tally('no-reach');
    process.stdout.write(`\nchecked=${report.length} hub(s), wrong-hub=${wrong}, outranked=${lost}, no-reach=${none}, probe-error=${errs}\n`);
    process.stdout.write(`advisor generation: ${generation == null ? 'unknown' : generation}\n`);
    // A phrase that reaches nobody is reported rather than failed: it is usually a
    // length limit, and failing on it would make the check unrunnable. Everything
    // else is a real defect, and a probe that never ran is the worst of them,
    // because it is the one that would otherwise print a pass.
    process.stdout.write(errs + wrong + lost ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  }
  const failed = report.some((r) => r.unreachable.some((u) => u.kind !== 'no-reach'));
  process.exit(failed ? 1 : 0);
}

main();
