// ───────────────────────────────────────────────────────────────────
// MODULE: Hub Router Phrase Coverage Tests
// ───────────────────────────────────────────────────────────────────
// A hub advertises the phrases that reach it in two stage-two router
// documents, and the compiled router serves stage one from hub-router.json's
// vocabularyClasses. The prose and the vocabulary are authored separately, so
// a phrase can be advertised while nothing in the compiled vocabulary matches
// it: a reader believes the capability exists, the router defers, and no check
// fails. This suite probes every advertised phrase through the runtime front
// door, so that drift becomes a named assertion instead of a quiet defer.
//
// The probe is the real front door, run from the repository root, exactly as a
// caller routes. Nothing is minted, compiled or written here.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ───────────────────────────────────────────────────────────────────

const runFile = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));

const HUB = 'cli-classifier';
const MODE = 'cli-jev';
// A short trailing clause reproduces how a phrase reaches the router: inside a
// sentence, never as a bare token the vocabulary could match by accident.
const PROBE_SUFFIX = ' for this';
// Probes spawn one child each. A handful at a time keeps the suite quick without
// stampeding the runtime, and every probe stays an independent routing call.
const PROBE_CONCURRENCY = 8;

// The compiled closure locates the live skill tree by walking up to the
// repository root, so the probe must inherit that directory as its working
// directory rather than the test file's own location.
function findRepoRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, '.skilled', 'bin', 'compiled-route.cjs'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('repository root was not found');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(HERE);
const ROUTE_CLI = path.join(REPO_ROOT, '.skilled', 'bin', 'compiled-route.cjs');
const SKILL_ROOT = path.join(REPO_ROOT, '.skilled', 'skills', HUB);

// Both documents carry the same intent model at two stages: the hub root router
// declares what selects this mode, the transport router declares what it loads.
// Either one can advertise a phrase, so both are read.
const ADVERTISING_ROUTERS = [
  { block: 'INTENT_SIGNALS', file: path.join(SKILL_ROOT, 'ROUTER.md') },
  { block: 'INTENT_MODEL', file: path.join(SKILL_ROOT, 'cli-jev', 'ROUTER.md') },
];

// One intent per line in both blocks, so a line-anchored read keeps each phrase
// tied to the intent that declares it instead of sweeping every string in the
// file. Only the array body is read, and both spellings in use reduce to the
// same phrase: the list form `"phrase"` and the tuple form `("phrase", 4)`.
const INTENT_LINE = /^\s*"(JEV_[A-Z_]+)"\s*:\s*\{.*?"keywords"\s*:\s*\[(.*)\]\s*\}?\s*,?\s*$/;
const INTENT_KEY = /^\s*"JEV_[A-Z_]+"\s*:/gm;
const QUOTED = /"([^"]+)"/g;

const LEGACY_HINT = [
  'The compiled front door returned its legacy sentinel, so no phrase can route',
  'through it. Two causes produce that sentinel, and they need different fixes:',
  `SPECKIT_COMPILED_ROUTING=0 disables compiled serving fleet-wide, while the hub's`,
  'activation manifest pins a policy hash that no longer matches what the hub inputs',
  'compile to. Run `node .skilled/bin/compiled-route-guard.cjs --json` to tell which,',
  'then re-mint the manifest when it reports a stale-manifest.',
].join(' ');

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

// Read one intent block into intent -> advertised phrases. The declared-key
// count is compared against the parsed count so a line this reader cannot parse
// fails loudly instead of silently shrinking the vocabulary it checks.
function readIntents(file, blockName) {
  const text = fs.readFileSync(file, 'utf8');
  const block = new RegExp(`${blockName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}`).exec(text);
  assert.ok(block, `${path.relative(REPO_ROOT, file)} declares no ${blockName} block`);

  const body = block[1];
  const declaredKeys = body.match(INTENT_KEY) || [];
  assert.ok(declaredKeys.length > 0, `${blockName} declares no intent`);

  const intents = new Map();
  for (const line of body.split('\n')) {
    const row = INTENT_LINE.exec(line);
    if (!row) continue;
    const phrases = [...row[2].matchAll(QUOTED)].map((match) => match[1]);
    assert.ok(phrases.length > 0, `${blockName}: ${row[1]} advertises no phrase`);
    intents.set(row[1], phrases);
  }
  assert.equal(
    intents.size,
    declaredKeys.length,
    `${blockName}: ${declaredKeys.length} intent(s) are declared but only ${intents.size} parsed`,
  );
  return intents;
}

// Every phrase either router advertises, with the block that declares it kept
// alongside so a failure names the document a reader would have trusted.
function advertisedPhrases() {
  const routers = ADVERTISING_ROUTERS.map((router) => ({
    ...router,
    intents: readIntents(router.file, router.block),
  }));
  const byPhrase = new Map();
  for (const router of routers) {
    const label = `${path.relative(REPO_ROOT, router.file)} ${router.block}`;
    for (const phrases of router.intents.values()) {
      for (const phrase of phrases) {
        if (!byPhrase.has(phrase)) byPhrase.set(phrase, []);
        if (!byPhrase.get(phrase).includes(label)) byPhrase.get(phrase).push(label);
      }
    }
  }
  return { routers, byPhrase };
}

function modesOf(decision) {
  return (decision.targets || []).map((target) => target.workflowMode).filter(Boolean);
}

// Route one phrase through the real front door. A front door that cannot answer
// becomes a failed decision carrying the child's own words, never a pass.
async function routeDecision(phrase) {
  try {
    const { stdout } = await runFile(
      process.execPath,
      [ROUTE_CLI, '--hub', HUB, '--prompt', `${phrase}${PROBE_SUFFIX}`],
      { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 60_000 },
    );
    return JSON.parse(stdout);
  } catch (error) {
    const detail = (error && (error.stderr || error.message)) || String(error);
    return { action: 'front-door-error', detail: String(detail).trim() };
  }
}

async function routeAll(phrases, work) {
  const results = new Array(phrases.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(PROBE_CONCURRENCY, phrases.length) },
    async () => {
      for (;;) {
        const index = cursor;
        cursor += 1;
        if (index >= phrases.length) return;
        results[index] = await work(phrases[index]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

function describeDecision(decision) {
  if (decision.servingAuthority === 'legacy') return 'legacy sentinel';
  if (decision.action !== 'route') {
    return `${decision.action}${decision.detail ? ` (${decision.detail})` : ''}`;
  }
  const modes = modesOf(decision);
  return `route -> [${modes.length > 0 ? modes.join(', ') : 'no workflow mode'}]`;
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

test('the compiled router serves this hub before any phrase is probed', async () => {
  const decision = await routeDecision('jev score');
  if (decision.servingAuthority === 'legacy') assert.fail(LEGACY_HINT);
  assert.equal(decision.action, 'route', `a documented phrase did not route: ${describeDecision(decision)}`);
  assert.deepEqual(modesOf(decision), [MODE]);
});

test('every phrase the routers advertise routes to the transport', async () => {
  const { routers, byPhrase } = advertisedPhrases();
  const phrases = [...byPhrase.keys()].sort();
  assert.ok(phrases.length > 0, 'no advertised phrase was parsed, so this check would pass vacuously');

  const coverage = routers
    .map((router) => {
      const count = [...router.intents.values()].reduce((total, list) => total + list.length, 0);
      return `${path.relative(REPO_ROOT, router.file)} ${router.block}: ${count} phrase(s) across ${router.intents.size} intent(s)`;
    })
    .join('\n');

  const results = await routeAll(phrases, async (phrase) => ({
    phrase,
    decision: await routeDecision(phrase),
  }));

  const broken = results.filter(({ decision }) => (
    decision.action !== 'route' || !modesOf(decision).includes(MODE)
  ));
  if (broken.length > 0) {
    // One cause produces every failure when the front door is not serving this
    // hub: repeating that sentinel per phrase would bury the cause in noise.
    const serving = broken.every(({ decision }) => decision.servingAuthority === 'legacy');
    const detail = serving
      ? 'every probe returned the legacy sentinel, so no phrase reached the compiled policy'
      : broken.map(({ phrase, decision }) => (
        `  "${phrase}" advertised by ${byPhrase.get(phrase).join(' + ')}`
        + ` -> ${describeDecision(decision)}`
      )).join('\n');
    assert.fail(
      `${broken.length} of ${phrases.length} advertised phrase(s) do not route to ${MODE}.`
      + `\n${coverage}\n${detail}${serving ? `\n${LEGACY_HINT}` : ''}`,
    );
  }
});
