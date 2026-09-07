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
 * So every multi-word phrase a router declares is carried up, and nothing is
 * carried away: the authored list is curated and this only ever adds to it.
 * Single words are left behind deliberately, since they are the ones that would
 * over-trigger.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS = path.join(REPO_ROOT, '.opencode', 'skills');

function hubs() {
  return fs.readdirSync(SKILLS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
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

function plan(hub) {
  const metaPath = path.join(SKILLS, hub, 'graph-metadata.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const existing = Array.isArray(meta.intent_signals) ? meta.intent_signals : [];
  const have = new Set(existing.map((s) => String(s).toLowerCase()));
  const missing = declaredPhrases(hub).filter((p) => !have.has(p.toLowerCase()));
  return { hub, metaPath, meta, existing, missing };
}

function write(p) {
  // Appended rather than merged and re-sorted: the authored order carries intent
  // a rewrite would flatten, and a stable tail keeps the diff readable.
  p.meta.intent_signals = [...p.existing, ...p.missing];
  fs.writeFileSync(p.metaPath, `${JSON.stringify(p.meta, null, 2)}\n`);
}

function main() {
  const args = process.argv.slice(2);
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

  if (doWrite) for (const p of plans) if (p.missing.length) write(p);

  if (asJson) {
    process.stdout.write(`${JSON.stringify(plans.map(({ hub, existing, missing }) => ({
      hub, before: existing.length, added: missing.length, after: existing.length + missing.length, phrases: missing,
    })), null, 2)}\n`);
  } else {
    for (const p of plans) {
      const verb = doWrite ? 'added' : 'missing';
      process.stdout.write(`${p.missing.length ? (doWrite ? 'WROTE' : 'STALE') : 'OK   '} ${p.hub.padEnd(28)} declared=${String(declaredPhrases(p.hub).length).padStart(3)} signals=${String(p.existing.length).padStart(3)} ${verb}=${String(p.missing.length).padStart(3)}\n`);
      for (const phrase of p.missing) process.stdout.write(`       + ${phrase}\n`);
    }
    const total = plans.reduce((n, p) => n + p.missing.length, 0);
    process.stdout.write(`\nchecked=${plans.length} hub(s), ${doWrite ? 'added' : 'missing'}=${total}\n`);
    process.stdout.write(total && doCheck ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  }
  // --check is a gate: a router phrase the advisor never heard of is a defect, so
  // a stale hub fails. --write is a repair and reports what it did.
  process.exit(doCheck && plans.some((p) => p.missing.length) ? 1 : 0);
}

main();
