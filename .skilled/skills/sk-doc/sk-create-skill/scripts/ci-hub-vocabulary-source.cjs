#!/usr/bin/env node
/**
 * Check that a hub has one authored vocabulary for its modes.
 *
 * usage: ci-hub-vocabulary-source.cjs [--hub <id>] [--skills-root <dir>] [--json]
 *
 * A hub routes in two stages. Stage one picks a mode from hub-router.json; stage
 * two picks the leaves that mode loads from ROUTER.md. hub-router.json's
 * vocabularyClasses is the authored mode vocabulary, and every other copy of it
 * is a restatement that can drift from it silently:
 *
 *   - a term stage one routes to a mode that no stage-two intent of that mode
 *     carries leaves the hub with nothing to load;
 *   - a registry alias advertises a name the authored file never routes, so the
 *     mode is unreachable by the name the registry publishes;
 *   - a packet's `Keyword triggers:` line advertises a term the hub does not
 *     route at all, so the packet is named but never chosen.
 *
 * So this compares each restatement against the authored vocabulary and reports
 * every disagreement. It only reads: nothing here rewrites a router.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const DEFAULT_SKILLS_ROOT = path.join(REPO_ROOT, '.skilled', 'skills');

// Assembled at run time so this file never spells a private-skill name. A private
// skill belongs to one checkout, so this gate must never open or judge one.
const PRIVATE_PREFIX = ['local', ''].join('-');

// A hub listed here still routes in two stages, but its ROUTER.md is not a
// per-mode leaf router. sk-code's is a weight-1 surface and phase router: every
// route loads its DEFAULT_RESOURCE list, and its intents (JAVASCRIPT,
// CODE_QUALITY and so on) mix leaves from several packets, so there is no
// per-mode stage-two vocabulary to compare a mode against. Its mode-to-leaf
// agreement is verified by verify-router-sync.cjs instead. Only the stage-two
// leg is exempt; the alias and triggers legs still judge the hub.
const STAGE_TWO_EXEMPT = Object.freeze({
  'sk-code': 'a surface and phase router: every route loads DEFAULT_RESOURCE and its intents span packets; verify-router-sync.cjs owns its mode-to-leaf agreement',
});

const fold = (term) => String(term).toLowerCase();

function termSet() {
  return { seen: new Set(), terms: [] };
}

// Order is kept from the authored list: a report diffed against the previous run
// stays readable only if the vocabulary does not reshuffle between runs.
function addAll(target, terms) {
  for (const term of terms) {
    const key = fold(term);
    if (target.seen.has(key)) continue;
    target.seen.add(key);
    target.terms.push(term);
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function isHub(skillsRoot, name) {
  return ['mode-registry.json', 'hub-router.json', 'ROUTER.md']
    .every((file) => fs.existsSync(path.join(skillsRoot, name, file)));
}

function hubs(skillsRoot) {
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(PRIVATE_PREFIX))
    .filter((name) => isHub(skillsRoot, name))
    .sort();
}

// The authored vocabulary of one mode: the case-folded union of every class its
// router signal names. A mode with no signal has no authored vocabulary, and is
// skipped rather than reported as an empty one.
function authoredVocabulary(router, mode) {
  const signal = (router.routerSignals || {})[mode];
  if (!signal) return null;
  const classes = router.vocabularyClasses || {};
  const out = termSet();
  for (const name of signal.classes || []) {
    const cls = classes[name];
    if (cls && Array.isArray(cls.keywords)) addAll(out, cls.keywords);
  }
  return out;
}

// Both machine-readable blocks of a router, read with the same expressions the
// replay and generator use so the gate and the writers cannot disagree.
function parseRouter(text) {
  const intents = new Map();
  const signals = /INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/.exec(text);
  if (signals) {
    for (const m of signals[1].matchAll(/"([A-Z0-9_]+)"\s*:\s*\{[^}]*?"keywords"\s*:\s*\[([^\]]*)\]/g)) {
      const entry = intents.get(m[1]) || { keywords: [], paths: [] };
      entry.keywords.push(...[...m[2].matchAll(/"([^"]+)"/g)].map((k) => k[1]));
      intents.set(m[1], entry);
    }
  }
  const map = /RESOURCE_MAP\s*=\s*\{([\s\S]*?)\n\}/.exec(text);
  if (map) {
    for (const m of map[1].matchAll(/"([A-Z0-9_]+)"\s*:\s*\[([^\]]*)\]/g)) {
      const entry = intents.get(m[1]) || { keywords: [], paths: [] };
      entry.paths.push(...[...m[2].matchAll(/"([^"]+)"/g)].map((p) => p[1]));
      intents.set(m[1], entry);
    }
  }
  return intents;
}

// An intent belongs to a mode when one of its resource paths is rooted in that
// mode's packet. A path with no packet prefix belongs to no mode.
function stageTwoVocabulary(intents, packet) {
  const out = termSet();
  if (!packet) return out;
  for (const entry of intents.values()) {
    if (entry.paths.some((p) => String(p).split('/')[0] === packet)) addAll(out, entry.keywords);
  }
  return out;
}

// Two modes can share one packet, so a packet's vocabulary is the union over
// every mode that names it. Otherwise a term would be missing from the packet's
// own triggers line the moment the second mode joined.
function packetVocabulary(registry, router) {
  const out = new Map();
  for (const mode of registry.modes || []) {
    const vocab = authoredVocabulary(router, mode.workflowMode);
    if (!vocab || !mode.packet) continue;
    if (!out.has(mode.packet)) out.set(mode.packet, termSet());
    addAll(out.get(mode.packet), vocab.terms);
  }
  return out;
}

function triggersVocabulary(skillsRoot, hub, packet, vocab) {
  const items = [];
  const skill = path.join(skillsRoot, hub, packet, 'SKILL.md');
  if (!fs.existsSync(skill)) return items;
  const line = fs.readFileSync(skill, 'utf8').split('\n').find((l) => l.includes('Keyword triggers:'));
  if (!line) return items;
  for (const m of line.matchAll(/`([^`]+)`/g)) {
    if (!vocab.seen.has(fold(m[1]))) {
      items.push(`triggers ${packet}: "${m[1]}" is not in hub-router.json vocabulary`);
    }
  }
  return items;
}

function evaluateHub(skillsRoot, hub) {
  const dir = path.join(skillsRoot, hub);
  const registry = readJson(path.join(dir, 'mode-registry.json'));
  const router = readJson(path.join(dir, 'hub-router.json'));
  const intents = parseRouter(fs.readFileSync(path.join(dir, 'ROUTER.md'), 'utf8'));
  const report = { hub, alias: [], stageTwo: [], triggers: [], stageTwoExempt: STAGE_TWO_EXEMPT[hub] || null };

  for (const mode of registry.modes || []) {
    const vocab = authoredVocabulary(router, mode.workflowMode);
    if (!vocab) continue;
    for (const alias of mode.aliases || []) {
      if (!vocab.seen.has(fold(alias))) {
        report.alias.push(`alias ${mode.workflowMode}: "${alias}" is not in hub-router.json vocabulary`);
      }
    }
    if (report.stageTwoExempt) continue;
    const stageTwo = stageTwoVocabulary(intents, mode.packet);
    for (const term of vocab.terms) {
      if (!stageTwo.seen.has(fold(term))) {
        report.stageTwo.push(`stage-two ${mode.workflowMode}: "${term}" routes here in hub-router.json but no ROUTER.md intent for this mode carries it`);
      }
    }
  }

  for (const [packet, vocab] of packetVocabulary(registry, router)) {
    report.triggers.push(...triggersVocabulary(skillsRoot, hub, packet, vocab));
  }

  return report;
}

function evaluate(skillsRoot, only) {
  return hubs(skillsRoot)
    .filter((hub) => !only || hub === only)
    .map((hub) => evaluateHub(skillsRoot, hub));
}

function main() {
  const args = process.argv.slice(2);
  // A misspelled flag must fail loudly rather than fall back to a default run.
  // Only a token in option position is checked: the token after a value option
  // is its value even when it begins with a dash, and a value option with no
  // usable value is itself a usage error.
  const valueOptions = new Set(['--hub', '--skills-root']);
  const knownOptions = new Set(['--json', ...valueOptions]);
  for (let i = 0; i < args.length; i += 1) {
    if (valueOptions.has(args[i])) {
      const value = args[i + 1];
      if (value === undefined || value.startsWith('-')) {
        process.stderr.write(`ci-hub-vocabulary-source.cjs: ${args[i]} needs a value\n`);
        process.exit(2);
      }
      i += 1;
      continue;
    }
    if (!knownOptions.has(args[i]) && args[i].startsWith('-')) {
      process.stderr.write(`ci-hub-vocabulary-source.cjs: unknown option: ${args[i]}\n`);
      process.exit(2);
    }
  }

  const only = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;
  const skillsRoot = args.includes('--skills-root')
    ? path.resolve(args[args.indexOf('--skills-root') + 1])
    : DEFAULT_SKILLS_ROOT;
  const asJson = args.includes('--json');

  if (!fs.existsSync(skillsRoot) || !fs.statSync(skillsRoot).isDirectory()) {
    process.stderr.write(`ci-hub-vocabulary-source.cjs: no skills root at ${skillsRoot}\n`);
    process.exit(2);
  }
  if (only && !hubs(skillsRoot).includes(only)) {
    process.stderr.write(`ci-hub-vocabulary-source.cjs: no hub named "${only}" carries mode-registry.json, hub-router.json and ROUTER.md\n`);
    process.exit(2);
  }

  const report = evaluate(skillsRoot, only);
  const total = report.reduce((n, r) => n + r.alias.length + r.stageTwo.length + r.triggers.length, 0);

  if (asJson) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    for (const r of report) {
      const drift = r.alias.length + r.stageTwo.length + r.triggers.length;
      process.stdout.write(`${drift ? 'DRIFT' : 'OK   '} ${r.hub.padEnd(28)} alias=${r.alias.length} stage-two=${r.stageTwo.length} triggers=${r.triggers.length}\n`);
      if (r.stageTwoExempt) process.stdout.write(`  note: stage-two leg not applied (${r.stageTwoExempt})\n`);
      for (const item of [...r.alias, ...r.stageTwo, ...r.triggers]) process.stdout.write(`  ${item}\n`);
    }
    process.stdout.write(`\nchecked=${report.length} hub(s), drift=${total}\n`);
    process.stdout.write(total ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  }

  process.exit(total ? 1 : 0);
}

module.exports = {
  authoredVocabulary,
  evaluate,
  evaluateHub,
  hubs,
  packetVocabulary,
  parseRouter,
  stageTwoVocabulary,
};

if (require.main === module) main();
