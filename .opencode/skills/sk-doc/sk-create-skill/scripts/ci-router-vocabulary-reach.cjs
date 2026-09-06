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
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS = path.join(REPO_ROOT, '.opencode', 'skills');
const ADVISOR = path.join(REPO_ROOT, '.opencode', 'bin', 'skill-advisor.cjs');

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
  // a single token fails on length, not on vocabulary; reporting it buries the rest
  return [...new Set(found.filter((k) => k.includes(' ') && !/^(weight|keywords)$/i.test(k)))];
}

function reaches(phrase, hub) {
  let raw;
  try {
    raw = execFileSync('node', [ADVISOR, 'advisor_recommend', '--json',
      JSON.stringify({ prompt: phrase }), '--format', 'json'],
    { encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch { return null; }
  let data;
  try { data = JSON.parse(raw).data; } catch { return null; }
  const bar = data.effectiveThresholds ? data.effectiveThresholds.confidenceThreshold : 0.8;
  const above = (data.recommendations || []).filter((r) => r.confidence >= bar);
  return { hit: above.some((r) => r.skillId === hub), top: above.slice(0, 2) };
}

function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;
  const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
  const asJson = args.includes('--json');

  const report = [];
  for (const hub of hubs()) {
    if (only && hub !== only) continue;
    const phrases = declaredPhrases(hub).slice(0, limit);
    const unreachable = [];
    for (const phrase of phrases) {
      const r = reaches(phrase, hub);
      if (r && !r.hit) {
        // two different failures wearing the same symptom. A phrase that reaches
        // another hub is a routing defect: something else owns a word this hub
        // advertises. A phrase that reaches nobody is usually too short to clear
        // the bar at all, which no amount of vocabulary fixes.
        unreachable.push({
          phrase,
          kind: r.top.length ? 'wrong-hub' : 'no-reach',
          reaches: r.top.map((t) => `${t.skillId}=${t.confidence.toFixed(4)}`),
        });
      }
    }
    report.push({ hub, declared: phrases.length, unreachable });
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    for (const r of report) {
      const wrong = r.unreachable.filter((u) => u.kind === 'wrong-hub');
      const none = r.unreachable.filter((u) => u.kind === 'no-reach');
      process.stdout.write(`${wrong.length ? 'FAIL' : 'OK  '} ${r.hub.padEnd(28)} declared=${String(r.declared).padStart(3)} wrong-hub=${String(wrong.length).padStart(3)} no-reach=${String(none.length).padStart(3)}\n`);
      for (const u of wrong) {
        process.stdout.write(`       wrong-hub  ${u.phrase.padEnd(42)} ${u.reaches.join(', ')}\n`);
      }
      for (const u of none) {
        process.stdout.write(`       no-reach   ${u.phrase}\n`);
      }
    }
    const wrong = report.reduce((n, r) => n + r.unreachable.filter((u) => u.kind === 'wrong-hub').length, 0);
    const none = report.reduce((n, r) => n + r.unreachable.filter((u) => u.kind === 'no-reach').length, 0);
    process.stdout.write(`\nchecked=${report.length} hub(s), wrong-hub=${wrong}, no-reach=${none}\n`);
    // only a wrong-hub result fails the gate. A phrase that reaches nobody is
    // reported for a human to judge: it is usually a length limit, and failing
    // a build on it would make the check unrunnable.
    process.stdout.write(wrong ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  }
  process.exit(report.some((r) => r.unreachable.some((u) => u.kind === 'wrong-hub')) ? 1 : 0);
}

main();
