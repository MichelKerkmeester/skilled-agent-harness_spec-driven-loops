// ───────────────────────────────────────────────────────────────────
// MODULE: Stage-two restraint routing
// ───────────────────────────────────────────────────────────────────
// This hub routes in two stages. Stage one scores the whole skill against its index
// vocabulary and decides whether the request belongs here at all. Stage two reads the
// intent table in ROUTER.md and decides which resources the request loads. A restraint
// request has to clear both stages, and the two stages deliberately hold different
// wording. The intent table carries the wide vocabulary, including "simplify", because
// a code request can ask for exactly that. The index carries only "comment hygiene",
// which has no meaning outside code. It routes by subject, so a word with an everyday
// sense there ("simplify", "yagni", "over-engineering") would send a request about prose
// or a recipe to a hub that answers code questions.
//
// This file pins both halves of that split, so a later vocabulary edit cannot widen the
// index while the intent table quietly stops matching the phrases the index still keeps.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPLAY_LIB = path.resolve(__dirname, '..', '..', 'assets', 'scripts', 'router-replay-lib.cjs');
const { routeSkillResources } = require(REPLAY_LIB);

const SKILL_ROOT = path.resolve(__dirname, '..', '..', '..');

// The stage-one vocabulary is an ordered list of phrases the router index scores the skill
// against. Reading it from the live index is the point: a copied list would keep asserting
// yesterday's vocabulary.
function indexedPhrases() {
  const meta = JSON.parse(fs.readFileSync(path.join(SKILL_ROOT, 'graph-metadata.json'), 'utf8'));
  return Array.isArray(meta.intent_signals) ? meta.intent_signals : [];
}

test('a restraint request selects the code-quality intent at stage two', () => {
  const route = routeSkillResources({ skillRoot: SKILL_ROOT, taskText: 'apply yagni to this change' });
  assert.ok(
    Array.isArray(route.surfaceIntents),
    'the replay reported no stage-two intents, so the hub has no intent table to route through',
  );
  assert.ok(
    route.surfaceIntents.includes('CODE_QUALITY'),
    `expected CODE_QUALITY in ${JSON.stringify(route.surfaceIntents)} for "apply yagni to this change", scored ${JSON.stringify(route.scores)}`,
  );
});

test('stage one keeps only the code-only restraint term', () => {
  const phrases = indexedPhrases();

  // The known term proves the list was read. Without it the absence assertion below would
  // pass on an empty or renamed file.
  assert.ok(phrases.includes('comment hygiene'), 'stage one no longer carries "comment hygiene"');

  const everyday = phrases.filter((phrase) => /simplif|yagni|over-engineer/i.test(phrase));
  assert.deepEqual(
    everyday,
    [],
    'a restraint word with an everyday sense at stage one routes prose requests to this hub, which answers code questions',
  );
});
