// ───────────────────────────────────────────────────────────────────
// MODULE: Documentation claim checker tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives verify_doc_claims.cjs against a throwaway hub, so each check can be made to pass and to
// fail without touching the live tree. The known-bad inputs live in this file, one per check.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const CHECKER = path.resolve(__dirname, '..', '..', 'assets', 'scripts', 'verify_doc_claims.cjs');

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

const ROUTER = [
  '| Tier | When | Resources |',
  '| --- | --- | --- |',
  '| ALWAYS | Every invocation | Universal quality from `shared/references/universal/` |',
  '',
  '```python',
  'DEFAULT_RESOURCE = [',
  '    "shared/references/universal/alpha.md",',
  '    "shared/references/universal/beta.md",',
  ']',
  '```',
  '',
  '### Surface-aware loading (route-time)',
  '',
  '- the surface-agnostic `shared/references/universal/*` tier, plus',
  '- never the whole `shared/references/universal/` folder, plus',
  '',
].join('\n');

// A clean hub: every check passes. The changelog and the benchmark report carry retired wording on
// purpose, which proves the walk leaves both folders out, and the quality keyword comment proves an
// allowlisted line is not reported.
function buildHub(t) {
  const hub = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-claims-'));
  t.after(() => fs.rmSync(hub, { recursive: true, force: true }));
  write(path.join(hub, 'ROUTER.md'), ROUTER);
  write(path.join(hub, 'shared', 'references', 'universal', 'alpha.md'), '# alpha\n');
  write(path.join(hub, 'shared', 'references', 'universal', 'beta.md'), '# beta\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'local.md'), '# local\n');
  write(path.join(hub, 'sk-code-demo', 'SKILL.md'), [
    '# demo',
    'See [alpha](../shared/references/universal/alpha.md), `shared/references/universal/beta.md`',
    'and `references/local.md`. The sibling sk-code-webflow packet and `sk-code-review` stay valid.',
    '',
  ].join('\n'));
  write(path.join(hub, 'sk-code-quality', 'SKILL.md'), '<!-- Keywords: code-quality, code-webflow -->\n');
  write(path.join(hub, 'sk-code-demo', 'changelog', 'v1.0.0.0.md'), 'Renamed code-webflow, which had two surfaces.\n');
  write(path.join(hub, 'sk-code-demo', 'benchmark', 'reports', 'run.md'), 'Routed to code-opencode.\n');
  return hub;
}

function run(hub, checks) {
  const args = [CHECKER, '--root', hub, ...(checks ? ['--checks', checks] : [])];
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  return { status: result.status, out: result.stdout };
}

test('a clean hub passes all four checks, with changelog and benchmark reports left out', (t) => {
  const { status, out } = run(buildHub(t));
  assert.equal(status, 0, out);
  assert.match(out, /doc-claims: 4\/4 checks passed/);
});

test('known-bad paths: a dead link, a stale path label and a dead backticked path are reported', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'references', 'bad.md'), [
    '[missing](./missing.md)',
    '[`../../universal/alpha.md`](../../shared/references/universal/alpha.md)',
    '`shared/references/nope.md`',
    '',
  ].join('\n'));
  const { status, out } = run(hub, 'paths');
  assert.equal(status, 1, out);
  assert.match(out, /FAIL check paths/);
  assert.match(out, /bad\.md:1: link target does not resolve: \.\/missing\.md/);
  assert.match(out, /bad\.md:2: link label is a path that does not resolve: \.\.\/\.\.\/universal\/alpha\.md/);
  assert.match(out, /bad\.md:3: path does not resolve: shared\/references\/nope\.md/);
});

test('an allowlisted line only exempts its own file', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'references', 'bad.md'), '<!-- Keywords: code-webflow -->\n');
  const { status, out } = run(hub, 'names');
  assert.equal(status, 1, out);
  assert.match(out, /bad\.md:1: retired packet name code-webflow/);
  assert.doesNotMatch(out, /sk-code-quality\/SKILL\.md/);
});

test('known-bad names: a retired packet name is reported', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'references', 'bad.md'), 'The sibling code-webflow map and `code-review`.\n');
  const { status, out } = run(hub, 'names');
  assert.equal(status, 1, out);
  assert.match(out, /bad\.md:1: retired packet name code-webflow/);
  assert.match(out, /bad\.md:1: retired packet name `code-review`/);
});

test('known-bad surfaces: two-surface wording is reported', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'references', 'bad.md'), 'Both supported surfaces follow the same lifecycle.\n');
  const { status, out } = run(hub, 'surfaces');
  assert.equal(status, 1, out);
  assert.match(out, /bad\.md:1: two-surface wording "Both supported surfaces"/);
});

test('known-bad tiers: a file the prose says always loads but DEFAULT_RESOURCE omits is reported', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'ROUTER.md'), ROUTER.replace('    "shared/references/universal/beta.md",\n', ''));
  const { status, out } = run(hub, 'tiers');
  assert.equal(status, 1, out);
  assert.match(out, /ROUTER\.md:3: claims shared\/references\/universal\/beta\.md loads on every route/);
  assert.match(out, /ROUTER\.md:13: claims shared\/references\/universal\/beta\.md loads on every route/);
  assert.doesNotMatch(out, /ROUTER\.md:14:/);
});
