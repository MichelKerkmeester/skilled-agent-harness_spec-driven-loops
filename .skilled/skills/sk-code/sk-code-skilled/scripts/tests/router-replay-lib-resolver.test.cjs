// ───────────────────────────────────────────────────────────────────
// MODULE: Router replay resolver wiring tests
// ───────────────────────────────────────────────────────────────────
// parseRouter keeps its signature while the resolver decides which document declares the
// router, so these cases pin the two verdicts that reach it: a router that lives only in
// ROUTER.md is parsed from that file, and a skill that declares in both documents is reported
// instead of routed from whichever side the parser happened to read first.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-replay-lib-resolver.test.cjs

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPLAY_LIB = path.resolve(__dirname, '..', '..', 'assets', 'scripts', 'router-replay-lib.cjs');
const { parseRouter } = require(REPLAY_LIB);

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function skillRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'router-replay-resolver-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test('a router that lives only in ROUTER.md parses from that file', (t) => {
  const root = skillRoot(t);
  const routerText = [
    '## 4. MACHINE ROUTER',
    '',
    'INTENT_SIGNALS = {',
    '  "IMPLEMENT": {"weight": 3, "keywords": ["build", "implement"]},',
    '}',
    'RESOURCE_MAP = {',
    '  "IMPLEMENT": ["references/implement.md"],',
    '}',
    '',
  ].join('\n');
  // SKILL.md still points at the router and declares nothing of its own, so a parser that read
  // only that file would find no router at all.
  write(path.join(root, 'SKILL.md'), '# demo\n\nThe router lives in ROUTER.md.\n');
  write(path.join(root, 'ROUTER.md'), routerText);

  const router = parseRouter(null, root);
  assert.equal(router.routerSource, 'ROUTER.md');
  assert.equal(router.parseable, true);
  assert.deepEqual(Object.keys(router.intentSignals), ['IMPLEMENT']);
  assert.deepEqual(router.resourceMap, { IMPLEMENT: ['references/implement.md'] });
});

test('a skill that declares in both documents is refused, not routed from one side', (t) => {
  const root = skillRoot(t);
  write(path.join(root, 'SKILL.md'), '## MACHINE ROUTER\n\nRESOURCE_MAP = {\n  "IMPLEMENT": ["references/skill.md"],\n}\n');
  write(path.join(root, 'ROUTER.md'), '## MACHINE ROUTER\n\nRESOURCE_MAP = {\n  "IMPLEMENT": ["references/file.md"],\n}\n');

  const router = parseRouter(null, root);
  assert.equal(router.routerSource, 'dual-declaration');
  assert.equal(router.parseable, false);
  assert.deepEqual(router.intentSignals, {}, 'no side may supply the intents');
  assert.deepEqual(router.resourceMap, {}, 'no side may supply the resources');
  assert.deepEqual(router.defaultResource, []);
});
