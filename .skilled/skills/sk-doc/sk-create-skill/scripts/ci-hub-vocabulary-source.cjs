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
 *     route at all, so the packet is named but never chosen;
 *   - a packet carries a triggers line while no registry mode names it, so the
 *     line advertises a leaf the hub can never select.
 *
 * The reverse of the stage-two leg is reported but never failed. A ROUTER.md
 * intent also carries the leaf keywords that pick a file once the mode is already
 * chosen, and a bare common word there would over-trigger hub selection, so the
 * intent list is deliberately broader than stage one (ci-router-vocabulary-reach
 * skips single words for the same reason). The inventory is printed so the
 * asymmetry stays visible without turning design into a failure.
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
// router signal names. A mode with no signal has no authored vocabulary, and
// returns null so the caller can report the missing signal rather than read an
// empty list as a mode that simply routes nothing.
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

const TRIGGER_PREFIX = 'Keyword triggers:';

// The triggers line is hand-written, so a term can be added to it without ever
// reaching the router, and an unbackticked item counts the same as a backticked
// one: both are advertised. Every line counts, not just the first, because a
// packet that grew a second line is still advertising what the second line says.
// Items split on both separators the corpus uses, and only outside backticks, so a
// separator inside one term cannot cut it in half.
function triggerItems(text) {
  const items = [];
  const push = (raw) => {
    // A list ends in a sentence period, which is punctuation rather than part of
    // the last term.
    const term = raw.trim().replace(/\.+$/, '').trim();
    if (term) items.push(term);
  };
  for (const line of text.split('\n')) {
    const at = line.indexOf(TRIGGER_PREFIX);
    if (at === -1) continue;
    let item = '';
    let quoted = false;
    for (const ch of line.slice(at + TRIGGER_PREFIX.length)) {
      if (ch === '`') { quoted = !quoted; continue; }
      if (!quoted && (ch === ',' || ch === ';')) { push(item); item = ''; continue; }
      item += ch;
    }
    push(item);
  }
  return items;
}

function triggersVocabulary(skillsRoot, hub, packet, vocab) {
  const items = [];
  const skill = path.join(skillsRoot, hub, packet, 'SKILL.md');
  if (!fs.existsSync(skill)) return items;
  for (const term of triggerItems(fs.readFileSync(skill, 'utf8'))) {
    if (!vocab.seen.has(fold(term))) {
      items.push(`triggers ${packet}: "${term}" is not in hub-router.json vocabulary`);
    }
  }
  return items;
}

// A packet that advertises triggers while no registry mode names it is a leaf the
// hub can never select, so the line is dead. The registry is the only place a
// packet becomes reachable, and nothing else checks the directory listing against
// it.
function orphanPackets(skillsRoot, hub, registry) {
  const items = [];
  const named = new Set((registry.modes || []).map((mode) => mode.packet).filter(Boolean));
  for (const entry of fs.readdirSync(path.join(skillsRoot, hub), { withFileTypes: true })) {
    if (!entry.isDirectory() || named.has(entry.name)) continue;
    const skill = path.join(skillsRoot, hub, entry.name, 'SKILL.md');
    if (!fs.existsSync(skill)) continue;
    if (!fs.readFileSync(skill, 'utf8').includes(TRIGGER_PREFIX)) continue;
    items.push(`packets ${entry.name}: has a "${TRIGGER_PREFIX}" line but no registry mode names it as a packet`);
  }
  return items;
}

// The reverse of the stage-two leg: an intent keyword whose packet belongs to a
// mode but that the mode's authored vocabulary never routes. Two modes can share a
// packet, and an intent cannot say which of them it serves, so the comparison is
// against the union over every mode naming the packet, the same union the
// triggers leg uses.
function stageTwoReverse(registry, router, intents) {
  const authored = new Map();
  for (const mode of registry.modes || []) {
    if (!mode.packet) continue;
    if (!authored.has(mode.packet)) authored.set(mode.packet, termSet());
    const vocab = authoredVocabulary(router, mode.workflowMode);
    if (vocab) addAll(authored.get(mode.packet), vocab.terms);
  }
  const out = new Map();
  for (const [packet, vocab] of authored) {
    const stageTwo = stageTwoVocabulary(intents, packet);
    out.set(packet, stageTwo.terms.filter((term) => !vocab.seen.has(fold(term))));
  }
  return out;
}

function evaluateHub(skillsRoot, hub) {
  const dir = path.join(skillsRoot, hub);
  const registry = readJson(path.join(dir, 'mode-registry.json'));
  const router = readJson(path.join(dir, 'hub-router.json'));
  const intents = parseRouter(fs.readFileSync(path.join(dir, 'ROUTER.md'), 'utf8'));
  const report = {
    hub,
    alias: [],
    stageTwo: [],
    stageTwoReverse: [],
    triggers: [],
    packets: [],
    stageTwoExempt: STAGE_TWO_EXEMPT[hub] || null,
  };

  for (const mode of registry.modes || []) {
    const vocab = authoredVocabulary(router, mode.workflowMode);
    // A mode with no router signal has no authored vocabulary to compare against,
    // which is itself the defect: stage one can only pick a mode a signal names,
    // so this one is unreachable however it is registered.
    if (!vocab) {
      report.alias.push(`alias ${mode.workflowMode}: no routerSignals entry, so stage one can never reach this mode`);
      continue;
    }
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

  if (!report.stageTwoExempt) {
    for (const [packet, terms] of stageTwoReverse(registry, router, intents)) {
      for (const term of terms) {
        report.stageTwoReverse.push(`stage-two-reverse ${packet}: "${term}" is an intent keyword in ROUTER.md that hub-router.json vocabulary does not route`);
      }
    }
  }

  for (const [packet, vocab] of packetVocabulary(registry, router)) {
    report.triggers.push(...triggersVocabulary(skillsRoot, hub, packet, vocab));
  }
  report.packets.push(...orphanPackets(skillsRoot, hub, registry));

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
  // A gate over no input proves nothing, and a misconfigured checkout would read
  // as a clean run: an empty fleet is a usage error, not a pass.
  if (report.length === 0) {
    process.stderr.write(`ci-hub-vocabulary-source.cjs: no hubs found under ${skillsRoot}\n`);
    process.exit(2);
  }
  const total = report.reduce((n, r) => n + r.alias.length + r.stageTwo.length + r.triggers.length + r.packets.length, 0);
  const reverse = report.reduce((n, r) => n + r.stageTwoReverse.length, 0);

  if (asJson) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    for (const r of report) {
      const drift = r.alias.length + r.stageTwo.length + r.triggers.length + r.packets.length;
      process.stdout.write(`${drift ? 'DRIFT' : 'OK   '} ${r.hub.padEnd(28)} alias=${r.alias.length} stage-two=${r.stageTwo.length} triggers=${r.triggers.length} packets=${r.packets.length} stage-two-reverse=${r.stageTwoReverse.length}\n`);
      if (r.stageTwoExempt) process.stdout.write(`  note: stage-two leg not applied (${r.stageTwoExempt})\n`);
      for (const item of [...r.alias, ...r.stageTwo, ...r.triggers, ...r.packets, ...r.stageTwoReverse]) process.stdout.write(`  ${item}\n`);
    }
    // Stage two is deliberately broader than stage one, so the reverse inventory
    // is printed for a reader and never counted as drift.
    if (reverse) {
      process.stdout.write(`\nnote: stage-two-reverse=${reverse} term(s) are ROUTER.md intent keywords hub-router.json does not route. Stage two also carries the leaf keywords that pick a file once the mode is chosen, so this leg reports and never fails.\n`);
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
  orphanPackets,
  packetVocabulary,
  parseRouter,
  stageTwoReverse,
  stageTwoVocabulary,
  triggerItems,
};

if (require.main === module) main();
