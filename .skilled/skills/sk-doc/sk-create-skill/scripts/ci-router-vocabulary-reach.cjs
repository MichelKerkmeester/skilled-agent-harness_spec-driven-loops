#!/usr/bin/env node
/**
 * Check that a phrase a hub's router advertises actually reaches that hub.
 *
 * usage: ci-router-vocabulary-reach.cjs [--hub <id>] [--json] [--limit N]
 *        [--concurrency N] [--skill <name-or-path>]
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
'use strict';
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
const SKILLS = path.join(REPO_ROOT, '.skilled', 'skills');
// Overridable so the fail-closed path can be exercised against an advisor that is
// not there. A gate nobody can watch fail is a gate nobody knows the shape of.
const ADVISOR = process.env.ROUTER_REACH_ADVISOR
  || path.join(REPO_ROOT, '.skilled', 'bin', 'skill-advisor.cjs');

// Known ownership disputes the check may pass over. An entry pins the winner as
// well as the phrase, so an allowed phrase that starts losing to somebody NEW still
// fails: a blanket pass on the phrase would reintroduce the exact blindness this
// check was written to remove.
const ALLOWLIST_PATH = path.join(__dirname, 'router-reach-allowlist.json');

function allowlist() {
  if (!fs.existsSync(ALLOWLIST_PATH)) return new Map();
  const raw = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, 'utf8'));
  return new Map((raw.entries || []).map((e) => [`${e.declaredBy}\u0000${e.phrase}`, e]));
}

const ALLOWED = allowlist();

function allowedFor(hub, phrase, winner) {
  const e = ALLOWED.get(`${hub}\u0000${phrase}`);
  return e && e.wonBy === winner ? e : null;
}

// An operator can link private skills into the skills root under this prefix, and
// the advisor scores one whenever its link resolves inside a trusted root
// (system-skill-advisor/runtime/lib/private-skill-target.cjs). The tracked tree
// ignores every such entry, so CI never has one. This check gates the shipped
// fleet: a verdict that flips with what one machine happens to link cannot be
// fixed in the tracked tree, and the allowlist could not name the winner without
// leaking a private name. A private surface that ranks ahead of the shipped
// leader is still reported, as a note that never fails the run, because on that
// machine it really does take the phrase.
const PRIVATE_SKILL_PREFIX = 'local-';

function isOperatorLocal(skillId) {
  return typeof skillId === 'string' && skillId.startsWith(PRIVATE_SKILL_PREFIX);
}

// Ranks the shipped fleet out of one passing-recommendation list, and keeps the
// confidence of every private surface that sat ahead of the shipped leader.
function rankShippedFleet(above, hub) {
  const shipped = above.filter((r) => !isOperatorLocal(r.skillId));
  const leaderAt = shipped.length ? above.indexOf(shipped[0]) : above.length;
  return {
    hit: shipped.length > 0 && shipped[0].skillId === hub,
    present: shipped.some((r) => r.skillId === hub),
    top: shipped.slice(0, 2),
    localAhead: above.slice(0, leaderAt).filter((r) => isOperatorLocal(r.skillId)),
  };
}

// Kinds reported for a human and never failed: a length limit, a pinned dispute,
// and a private surface the tracked tree does not own.
const NON_FAILING = new Set(['no-reach', 'allowed', 'operator-local']);

function hubs() {
  return fs.readdirSync(SKILLS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => fs.existsSync(path.join(SKILLS, n, 'mode-registry.json'))
      && fs.existsSync(path.join(SKILLS, n, 'ROUTER.md')))
    .sort();
}

function declaredPhrases(directory) {
  const text = fs.readFileSync(path.join(directory, 'ROUTER.md'), 'utf8');
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
// The advisor exits 75 to say "temporary, ask again", and overlapping probes
// provoke it: the same phrases that fail in a concurrent sweep answer correctly one
// at a time. Reporting that as a defect would trade the old false green for a false
// red, so a retryable exit is retried before it is believed. Anything else is a
// real failure and is returned on the first try.
const RETRYABLE_EXIT = 75;
const PROBE_ATTEMPTS = 3;

const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });

async function probeOnce(phrase) {
  const { stdout } = await execFileAsync('node', [ADVISOR, 'advisor_recommend', '--json',
    JSON.stringify({ prompt: phrase }), '--format', 'json'],
  { encoding: 'utf8', timeout: 60000 });
  return stdout;
}

async function reaches(phrase, hub) {
  let raw;
  let lastErr;
  for (let attempt = 1; attempt <= PROBE_ATTEMPTS; attempt += 1) {
    try {
      raw = await probeOnce(phrase);
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
      if (err.code !== RETRYABLE_EXIT) break;
      // Back off enough for the contention that caused it to clear.
      await sleep(250 * attempt);
    }
  }
  if (lastErr) {
    const detail = lastErr.stderr ? String(lastErr.stderr).trim().split('\n')[0] : '';
    const retried = lastErr.code === RETRYABLE_EXIT ? ` after ${PROBE_ATTEMPTS} attempts` : '';
    return { error: `probe failed: ${lastErr.code || lastErr.message}${retried}${detail ? ` (${detail})` : ''}` };
  }
  let envelope;
  try { envelope = JSON.parse(raw); } catch {
    return { error: 'probe returned unparseable JSON' };
  }
  const data = envelope && typeof envelope === 'object' ? envelope.data : null;
  if (!data) return { error: 'probe returned no data envelope' };
  const trust = data.trustState;
  if (envelope.degraded || trust?.state !== 'live' || !Number.isInteger(trust.generation)) {
    return { error: 'advisor response is degraded, not live, or lacks generation' };
  }
  const bar = data.effectiveThresholds ? data.effectiveThresholds.confidenceThreshold : 0.8;
  const above = (data.recommendations || []).filter((r) => r.confidence >= bar);
  const generation = trust.generation;
  // Presence above the bar is not routing. A hub sitting second behind a higher
  // scorer never answers the request, so the declaring hub has to rank first in
  // the shipped fleet for the phrase to count as reaching it.
  return { ...rankShippedFleet(above, hub), generation };
}

// A standalone skill declares its phrases in its own ROUTER.md and has no hub
// registry to list, so the fleet scan cannot see it at all. Naming it directly is
// the only way its reach can be reported, and the folder name is the id the
// advisor's recommendation list carries.
function skillTarget(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    process.stderr.write('ci-router-vocabulary-reach.cjs: --skill needs a skill name or path\n');
    process.exit(2);
  }
  const named = value.trim();
  const directory = named.includes('/') || named.includes('\\')
    ? path.resolve(named)
    : path.join(SKILLS, named);
  if (!fs.existsSync(path.join(directory, 'ROUTER.md'))) {
    process.stderr.write(`ci-router-vocabulary-reach.cjs: no ROUTER.md under ${directory}\n`);
    process.exit(2);
  }
  return { hub: path.basename(directory), directory };
}

async function main() {
  const args = process.argv.slice(2);
  // A misspelled flag must fail loudly rather than fall back to a default run.
  // Only a token in option position is checked: the token after a value-taking
  // option is its value even when it begins with a dash.
  const valueOptions = new Set(['--hub', '--limit', '--concurrency', '--skill']);
  const knownOptions = new Set(['--json', ...valueOptions]);
  for (let i = 0; i < args.length; i += 1) {
    if (valueOptions.has(args[i])) {
      i += 1;
      continue;
    }
    if (!knownOptions.has(args[i]) && args[i].startsWith('-')) {
      process.stderr.write(`ci-router-vocabulary-reach.cjs: unknown option: ${args[i]}\n`);
      process.exit(2);
    }
  }
  const only = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;
  const skill = args.includes('--skill') ? args[args.indexOf('--skill') + 1] : null;
  const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
  const asJson = args.includes('--json');

  // The fleet path answers "which hub answers this", the named path answers "does
  // this one root answer its own phrases", so mixing them would print a row whose
  // verdict nobody can read.
  if (skill !== null && only) {
    process.stderr.write('ci-router-vocabulary-reach.cjs: --hub and --skill probe different sets: pass one of them\n');
    process.exit(2);
  }

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
  const targets = skill === null
    ? hubs().map((hub) => ({ hub, directory: path.join(SKILLS, hub) }))
    : [skillTarget(skill)];
  for (const { hub, directory } of targets) {
    if (only && hub !== only) continue;
    const phrases = declaredPhrases(directory).slice(0, limit);
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
      // The private surface is never named: its folder name stays on the machine
      // that links it, so the row carries only its confidence.
      if (r.hit && r.localAhead.length) {
        unreachable.push({
          phrase,
          kind: 'operator-local',
          reaches: [
            ...r.localAhead.map((t) => `operator-local=${t.confidence.toFixed(4)}`),
            ...r.top.slice(0, 1).map((t) => `${t.skillId}=${t.confidence.toFixed(4)}`),
          ],
        });
        continue;
      }
      if (!r.hit) {
        const winner = r.top.length ? r.top[0].skillId : null;
        const allowed = winner ? allowedFor(hub, phrase, winner) : null;
        // Three failures wearing one symptom. Another hub ranked first while this
        // one never surfaced is a routing defect. This hub surfaced but lost the
        // top slot is the same defect wearing a passing score. Nothing above the
        // bar at all is usually length, which vocabulary does not fix.
        unreachable.push({
          phrase,
          kind: allowed ? 'allowed' : (r.top.length ? (r.present ? 'outranked' : 'wrong-hub') : 'no-reach'),
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
      const ok = r.unreachable.filter((u) => u.kind === 'allowed');
      const local = r.unreachable.filter((u) => u.kind === 'operator-local');
      const bad = errs.length + wrong.length + lost.length;
      process.stdout.write(`${bad ? 'FAIL' : 'OK  '} ${r.hub.padEnd(28)} declared=${String(r.declared).padStart(3)} wrong-hub=${String(wrong.length).padStart(3)} outranked=${String(lost.length).padStart(3)} no-reach=${String(none.length).padStart(3)} allowed=${String(ok.length).padStart(3)} probe-error=${String(errs.length).padStart(3)} operator-local=${String(local.length).padStart(3)}\n`);
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
      for (const u of local) {
        process.stdout.write(`       note       ${u.phrase.padEnd(42)} ${u.reaches.join(', ')} (ranks first on this machine only)\n`);
      }
    }
    const tally = (kind) => report.reduce((n, r) => n + r.unreachable.filter((u) => u.kind === kind).length, 0);
    const errs = tally('probe-error');
    const wrong = tally('wrong-hub');
    const lost = tally('outranked');
    const none = tally('no-reach');
    const allowed = tally('allowed');
    const local = tally('operator-local');
    process.stdout.write(`\nchecked=${report.length} hub(s), wrong-hub=${wrong}, outranked=${lost}, no-reach=${none}, allowed=${allowed}, probe-error=${errs}, operator-local=${local}\n`);
    process.stdout.write(`advisor generation: ${generation == null ? 'unknown' : generation}\n`);
    // A phrase that reaches nobody is reported rather than failed: it is usually a
    // length limit, and failing on it would make the check unrunnable. Everything
    // else is a real defect, and a probe that never ran is the worst of them,
    // because it is the one that would otherwise print a pass.
    process.stdout.write(errs + wrong + lost ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  }
  const failed = report.some((r) => r.unreachable.some((u) => !NON_FAILING.has(u.kind)));
  process.exit(failed ? 1 : 0);
}

main();
