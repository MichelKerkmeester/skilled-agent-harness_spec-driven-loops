#!/usr/bin/env node
/**
 * Carry a hub router's declared vocabulary into the stage the advisor reads.
 *
 * usage: generate-router-intent-signals.cjs --check|--write [--hub <id>] [--json]
 *
 * Routing runs in two stages. The advisor scores a hub's graph-metadata.json
 * intent_signals to choose a hub; that hub's ROUTER.md then chooses a mode. The
 * two vocabularies are not meant to be identical, because a bare common word
 * belongs in the second and would over-trigger in the first.
 *
 * They are not meant to be disjoint either. Exact membership in intent_signals
 * is what fires the explicit_author lane, and that lane both raises the score and
 * emits the evidence entries that pull uncertainty under the surfacing gate. A
 * phrase a router advertises while the advisor has never heard of it is a
 * capability the fleet has and cannot be asked for.
 *
 * So every multi-word phrase a router declares is carried up. Each phrase this
 * writer adds is also recorded in `intent_signals_generated`, the provenance
 * list: an entry there that no router declares any more is an orphan, meaning
 * the router renamed or dropped a phrase the advisor still advertises. `--check`
 * names and counts orphans and fails, and `--write` removes them from both
 * lists. `intent_signals_keep` pins a generated phrase that should outlive its
 * router entry. An `intent_signals` entry the generator never added is
 * hand-curated, so it is never treated as an orphan. Single words are left
 * behind deliberately, since they are the ones that would over-trigger.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS = path.join(REPO_ROOT, '.skilled', 'skills');

function hubs() {
  return fs.readdirSync(SKILLS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    // A private skill belongs to one checkout, so this writer must never open or rewrite it.
    .filter((name) => !name.startsWith('local-'))
    .filter((name) => fs.existsSync(path.join(SKILLS, name, 'ROUTER.md'))
      && fs.existsSync(path.join(SKILLS, name, 'hub-router.json'))
      && fs.existsSync(path.join(SKILLS, name, 'graph-metadata.json')))
    .sort();
}

// The same extraction the reach check probes with. Keeping one definition means
// the gate and the generator can never disagree about what a router declared.
function declaredPhrases(hub) {
  const text = fs.readFileSync(path.join(SKILLS, hub, 'ROUTER.md'), 'utf8');
  const block = /INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/.exec(text);
  if (!block) return [];
  const found = [...block[1].matchAll(/"([^"]{3,60})"/g)].map((m) => m[1]);
  return [...new Set(found.filter((k) => (
    k.includes(' ')
    && /^[a-z0-9]/i.test(k)
    && !/[{}[\]]/.test(k)
    && !/^(weight|keywords)$/i.test(k)
  )))];
}

/**
 * Plan one hub's vocabulary change.
 *
 * `missing` is a phrase the router declares that `intent_signals` lacks.
 * `orphans` is the reverse defect that provenance makes visible: a phrase an
 * earlier `--write` recorded in `intent_signals_generated` that the router no
 * longer declares, unless `intent_signals_keep` pins it. Hand-curated entries
 * never appear in `intent_signals_generated`, so they can never be orphans.
 */
function plan(hub) {
  const metaPath = path.join(SKILLS, hub, 'graph-metadata.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const existing = Array.isArray(meta.intent_signals) ? meta.intent_signals : [];
  const have = new Set(existing.map((s) => String(s).toLowerCase()));
  const declared = declaredPhrases(hub);
  const missing = declared.filter((p) => !have.has(p.toLowerCase()));
  const generated = Array.isArray(meta.intent_signals_generated) ? meta.intent_signals_generated : [];
  const keep = new Set((Array.isArray(meta.intent_signals_keep) ? meta.intent_signals_keep : [])
    .map((s) => String(s).toLowerCase()));
  // Compare lower-cased for the same reason `missing` does: the advisor matches
  // phrases case-insensitively, so a case-only difference is not a defect.
  const declaredSet = new Set(declared.map((p) => p.toLowerCase()));
  const orphans = generated.filter((s) => (
    !declaredSet.has(String(s).toLowerCase()) && !keep.has(String(s).toLowerCase())
  ));
  const orphanSet = new Set(orphans.map((s) => String(s).toLowerCase()));
  const remaining = existing.filter((s) => !orphanSet.has(String(s).toLowerCase()));
  return {
    hub, metaPath, meta, existing, declared, missing, orphans, remaining,
  };
}

function write(p) {
  const generated = Array.isArray(p.meta.intent_signals_generated) ? p.meta.intent_signals_generated : [];
  // Seeding from the declared phrases already present lets a later router rename read as an orphan.
  const declaredSet = new Set(p.declared.map((s) => String(s).toLowerCase()));
  const seed = Array.isArray(p.meta.intent_signals_generated)
    ? []
    : p.existing.filter((s) => declaredSet.has(String(s).toLowerCase()));
  if (!p.missing.length && !p.orphans.length && !seed.length) return false;
  const orphanSet = new Set(p.orphans.map((s) => String(s).toLowerCase()));
  // Appended rather than merged and re-sorted: the authored order carries intent
  // a rewrite would flatten, and a stable tail keeps the diff readable. The prune
  // keeps every surviving entry where it was, for the same reason.
  p.meta.intent_signals = [...p.remaining, ...p.missing];
  const generatedHave = new Set(generated.map((s) => String(s).toLowerCase()));
  p.meta.intent_signals_generated = [
    ...generated.filter((s) => !orphanSet.has(String(s).toLowerCase())),
    ...seed.filter((s) => !generatedHave.has(String(s).toLowerCase())),
    // A declared phrase this list already records is not added a second time.
    ...p.missing.filter((s) => !generatedHave.has(s.toLowerCase())),
  ];
  fs.writeFileSync(p.metaPath, `${JSON.stringify(p.meta, null, 2)}\n`);
  return true;
}

function main() {
  const args = process.argv.slice(2);
  // A misspelled flag must fail loudly rather than fall back to a default run.
  // Only a token in option position is checked: the token after --hub is its
  // value even when it begins with a dash, and --hub with no usable value is
  // itself a usage error.
  const valueOptions = new Set(['--hub']);
  const knownOptions = new Set(['--write', '--check', '--json', ...valueOptions]);
  for (let i = 0; i < args.length; i += 1) {
    if (valueOptions.has(args[i])) {
      const value = args[i + 1];
      if (value === undefined || value.startsWith('-')) {
        process.stderr.write('generate-router-intent-signals.cjs: --hub needs a hub id\n');
        process.exit(2);
      }
      i += 1;
      continue;
    }
    if (!knownOptions.has(args[i]) && args[i].startsWith('-')) {
      process.stderr.write(`generate-router-intent-signals.cjs: unknown option: ${args[i]}\n`);
      process.exit(2);
    }
  }
  const doWrite = args.includes('--write');
  const doCheck = args.includes('--check');
  const asJson = args.includes('--json');
  const only = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;

  if (doWrite === doCheck) {
    process.stderr.write('usage: generate-router-intent-signals.cjs --check|--write [--hub <id>] [--json]\n');
    process.exit(2);
  }

  const plans = hubs().filter((h) => !only || h === only).map(plan);
  if (only && plans.length === 0) {
    process.stderr.write(`no hub named "${only}" carries a ROUTER.md and graph-metadata.json\n`);
    process.exit(2);
  }

  if (doWrite) for (const p of plans) write(p);

  if (asJson) {
    process.stdout.write(`${JSON.stringify(plans.map(({
      hub, existing, missing, orphans, remaining,
    }) => ({
      hub,
      before: existing.length,
      added: missing.length,
      after: remaining.length + missing.length,
      phrases: missing,
      orphans,
      removed: orphans.length,
    })), null, 2)}\n`);
  } else {
    for (const p of plans) {
      const verb = doWrite ? 'added' : 'missing';
      const changed = p.missing.length > 0 || p.orphans.length > 0;
      const tag = changed ? (doWrite ? 'WROTE' : 'STALE') : 'OK   ';
      process.stdout.write(`${tag} ${p.hub.padEnd(28)} declared=${String(p.declared.length).padStart(3)} signals=${String(p.existing.length).padStart(3)} ${verb}=${String(p.missing.length).padStart(3)} orphans=${String(p.orphans.length).padStart(3)}\n`);
      for (const phrase of p.missing) process.stdout.write(`       + ${phrase}\n`);
      for (const phrase of p.orphans) process.stdout.write(`       - ${phrase}\n`);
    }
    const missingTotal = plans.reduce((n, p) => n + p.missing.length, 0);
    const orphanTotal = plans.reduce((n, p) => n + p.orphans.length, 0);
    process.stdout.write(`\nchecked=${plans.length} hub(s), ${doWrite ? 'added' : 'missing'}=${missingTotal}, orphans=${orphanTotal}\n`);
    process.stdout.write((missingTotal || orphanTotal) && doCheck ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  }
  // --check is a gate: a router phrase the advisor never heard of, or an advisor
  // phrase the router no longer declares, is a defect, so a stale hub fails.
  // --write is a repair and reports what it did.
  process.exit(doCheck && plans.some((p) => p.missing.length || p.orphans.length) ? 1 : 0);
}

main();
