#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Setup Battery Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the setup battery as a process against throwaway repo-shaped roots, so
// every verdict is observed through its exit code and STATUS line, the two
// things the /doctor route reads, while stubs stand in for the nine legs.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'sk-code-setup-check.cjs');

const SKILL_FILE = '.skilled/skills/sk-code/SKILL.md';
const PARENT_SKILL_CHECK = '.skilled/commands/doctor/scripts/parent-skill-check.cjs';
const ROOT_METADATA = '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs';
const ROUTE_GUARD = '.skilled/bin/compiled-route-guard.cjs';
const ROUTE_SYNC = '.skilled/bin/compiled-route-sync.cjs';
const DRIFT_GUARDS = '.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh';
const DERIVED_FRESHNESS = '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs';
const ROUTE_PROBE = '.skilled/bin/compiled-route.cjs';
const SHARED_FRONTMATTER = 'node_modules/@spec-kit/shared/frontmatter/parse-frontmatter.js';
const QUALITY_DIR = '.skilled/skills/sk-code/sk-code-quality';
const QUALITY_RUNNER = `${QUALITY_DIR}/scripts/quality-gate.cjs`;
const QUALITY_CHECKER = `${QUALITY_DIR}/scripts/check-comment-hygiene.sh`;
const QUALITY_TABLES = [`${QUALITY_DIR}/assets/comment-syntax.json`, `${QUALITY_DIR}/assets/quality-defaults.json`];
const QUALITY_TEST = `${QUALITY_DIR}/scripts/tests/stub.test.cjs`;
const PASSING_TEST = "require('node:test')('stub passes', () => {});\n";

// The quality leg probes with its own prompt and reads the routed mode, and the stub
// answers every prompt the same way, so one decision serves both probes.
const ROUTE_DECISION = '{"hubId":"sk-code","action":"route","targets":[{"workflowMode":"sk-code-quality"}]}\n';

const fixtures = [];

function writeFile(root, rel, body) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
}

// A leg stub that prints the given streams and exits with the given code. The
// code goes through exitCode so a piped write is never truncated by an early exit.
function nodeStub(root, rel, { out = '', err = '', code = 0 } = {}) {
  writeFile(root, rel, [
    `process.stdout.write(${JSON.stringify(out)});`,
    `process.stderr.write(${JSON.stringify(err)});`,
    `process.exitCode = ${code};`,
    '',
  ].join('\n'));
}

// The bash leg is stubbed the same way, through a quoted heredoc so the stub
// output reaches the battery byte for byte.
function bashStub(root, rel, { out = '', code = 0 } = {}) {
  const body = out === '' || out.endsWith('\n') ? out : `${out}\n`;
  writeFile(root, rel, `#!/usr/bin/env bash\ncat <<'STUB_OUTPUT'\n${body}STUB_OUTPUT\nexit ${code}\n`);
}

function buildRoot({
  provisioned = true,
  parentSkill = null,
  rootMetadata = null,
  guard = null,
  sync = null,
  driftGuards = null,
  derived = null,
  probe = null,
  quality = {},
} = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-code-setup-check-'));
  fixtures.push(root);
  // The battery's v4-layout gate reads this file, so the default fixture ships it.
  writeFile(root, SKILL_FILE, '# sk-code\n');
  if (provisioned) {
    writeFile(root, SHARED_FRONTMATTER, 'module.exports = { parseFrontmatter: () => ({}) };\n');
  }
  nodeStub(root, PARENT_SKILL_CHECK, parentSkill || {});
  nodeStub(root, ROOT_METADATA, rootMetadata || {});
  nodeStub(root, ROUTE_GUARD, guard || { out: '{"results":[],"failures":0}\n' });
  nodeStub(root, ROUTE_SYNC, sync || {});
  bashStub(root, DRIFT_GUARDS, driftGuards || {});
  nodeStub(root, DERIVED_FRESHNESS, derived || { out: '{"staleRoots":[],"erroredRoots":[]}\n' });
  nodeStub(root, ROUTE_PROBE, probe || { out: ROUTE_DECISION });
  for (const rel of [QUALITY_RUNNER, QUALITY_CHECKER]) {
    writeFile(root, rel, '#!/usr/bin/env node\n');
    fs.chmodSync(path.join(root, rel), rel === QUALITY_CHECKER && quality.checkerMode !== undefined ? quality.checkerMode : 0o755);
  }
  for (const rel of QUALITY_TABLES) writeFile(root, rel, '{}\n');
  writeFile(root, QUALITY_TEST, quality.testBody || PASSING_TEST);
  return root;
}

function run(root, args = [], env = {}) {
  const inherited = { ...process.env };
  // Strip the routing flag so a caller's shell cannot change what these tests assert.
  delete inherited.SPECKIT_COMPILED_ROUTING;
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    env: { ...inherited, SK_CODE_SETUP_ROOT: root, ...env },
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    out: `${result.stdout}${result.stderr}`,
  };
}

test.afterEach(() => {
  for (const root of fixtures.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. HAPPY PATH AND THE PROMPT OPTION
// ─────────────────────────────────────────────────────────────────────────────

test('a provisioned tree whose legs all pass reports nine PASS lines and exit 0', () => {
  const { status, out } = run(buildRoot());
  assert.equal(status, 0, out);
  assert.match(out, /^\/doctor:sk-code setup \(read-only; writes nothing\)$/m);
  assert.equal((out.match(/^PASS {2}/gm) || []).length, 9);
  assert.match(out, /^PASS {2}probe +node \S+ --hub sk-code --prompt "fix a typescript bug in the opencode plugin"$/m);
  assert.match(out, /^PASS {2}quality +python3, executables, tables, node --test \S+, quality route probe$/m);
  assert.match(out, /^STATUS=OK legs=9$/m);
});

test('a custom prompt replaces the default on the probe command line', () => {
  const { status, out } = run(buildRoot(), ['--prompt=wire a new mcp tool']);
  assert.equal(status, 0, out);
  assert.match(out, /^PASS {2}probe +node \S+ --hub sk-code --prompt "wire a new mcp tool"$/m);
});

test('a custom prompt with shell characters prints as a pasteable probe line', () => {
  const { status, out } = run(buildRoot(), ['--prompt=say "hi" to $HOME']);
  assert.equal(status, 0, out);
  assert.match(out, /^PASS {2}probe +node \S+ --hub sk-code --prompt "say \\"hi\\" to \\\$HOME"$/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE PROBE PASSES ONLY ON A PARSED ROUTE DECISION
// ─────────────────────────────────────────────────────────────────────────────

test('the legacy stub exits 0 but fails the probe with the guard repair', () => {
  const probe = { out: '{"servingAuthority":"legacy","hubId":"sk-code"}\n' };
  const { status, out } = run(buildRoot({ probe }));
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}probe +node /m);
  assert.match(out, /^ {6}served the legacy stub, so sk-code serves no compiled route$/m);
  assert.match(out, /^ {6}repair: .*compiled-route-manifest\.cjs refresh --hub sk-code.*$/m);
  // The quality leg probes the same stub, so its route check fails beside the probe.
  assert.match(out, /^ {6}route: the quality prompt did not route to sk-code-quality$/m);
  assert.match(out, /^STATUS=FAIL failed=2 skipped=0$/m);
});

test('the legacy stub under SPECKIT_COMPILED_ROUTING=0 fails the probe with the unset repair', () => {
  const probe = { out: '{"servingAuthority":"legacy","hubId":"sk-code"}\n' };
  const { status, out } = run(buildRoot({ probe }), [], { SPECKIT_COMPILED_ROUTING: '0' });
  assert.equal(status, 1, out);
  assert.match(out, /^ {6}served the legacy stub because SPECKIT_COMPILED_ROUTING="0" switches compiled routing off$/m);
  assert.match(out, /^ {6}repair: unset SPECKIT_COMPILED_ROUTING, then rerun /m);
  assert.doesNotMatch(out, /compiled-route-manifest\.cjs refresh/);
});

test('a probe that exits non-zero is reported by its exit status', () => {
  const probe = { out: '', code: 3 };
  const { status, out } = run(buildRoot({ probe }));
  assert.equal(status, 1, out);
  assert.match(out, /^ {6}the probe exited 3$/m);
  assert.doesNotMatch(out, /the probe printed no route decision/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. A FAILING LEG PRINTS ITS FILTERED DETAIL AND ITS REPAIR
// ─────────────────────────────────────────────────────────────────────────────

test('a stale hub in the guard report becomes one repair line per hub', () => {
  const guard = {
    code: 1,
    out: `${JSON.stringify({
      results: [{
        hubId: 'sk-code',
        ok: false,
        reason: 'stale-manifest',
        fix: 'run node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code',
      }],
      failures: 1,
    })}\n`,
  };
  const { status, out } = run(buildRoot({ guard }));
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}guard +node /m);
  assert.match(out, /^ {6}repair: sk-code: run node \.skilled\/bin\/compiled-route-manifest\.cjs refresh --hub sk-code$/m);
});

test('a stale derived root becomes its regeneration repair', () => {
  const derived = { code: 1, out: '{"staleRoots":[{"name":"sk-code"}],"erroredRoots":[]}\n' };
  const { status, out } = run(buildRoot({ derived }));
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}derived-freshness +node /m);
  assert.match(out, /^ {6}repair: node \.skilled\/skills\/sk-doc\/sk-create-skill\/scripts\/regenerate-skill-derived\.cjs --root \.skilled\/skills\/sk-code --write$/m);
});

test('an errored derived root is reported by name and error', () => {
  const derived = { code: 1, out: '{"staleRoots":[],"erroredRoots":[{"name":"sk-doc","errors":["boom","bang"]}]}\n' };
  const { status, out } = run(buildRoot({ derived }));
  assert.equal(status, 1, out);
  assert.match(out, /^ {6}sk-doc: boom; bang$/m);
});

test('a failing drift guard shows only its FAIL lines, never the raw output', () => {
  const driftGuards = { code: 1, out: 'noise line\nFAIL: 1a: router path missing\n' };
  const { status, out } = run(buildRoot({ driftGuards }));
  assert.equal(status, 1, out);
  assert.match(out, /^ {6}FAIL: 1a: router path missing$/m);
  assert.match(out, /^ {6}repair: fix each FAIL guard above, then rerun bash \.skilled\/skills\/sk-code\/sk-code-skilled\/scripts\/run-all-drift-guards\.sh$/m);
  assert.doesNotMatch(out, /^ {6}noise line$/m);
});

test('more than ten FAIL lines are cut with a count of the rest', () => {
  const lines = Array.from({ length: 12 }, (_, index) => `FAIL: guard ${index + 1}`);
  const driftGuards = { code: 1, out: `${lines.join('\n')}\n` };
  const { status, out } = run(buildRoot({ driftGuards }));
  assert.equal(status, 1, out);
  assert.match(out, /^ {6}FAIL: guard 1$/m);
  assert.match(out, /^ {6}FAIL: guard 10$/m);
  assert.doesNotMatch(out, /^ {6}FAIL: guard 11$/m);
  assert.match(out, /^ {6}\.\.\. 2 more FAIL lines; rerun the command above for the full list$/m);
});

test('an unbuilt shared package in the root metadata leg names the provision command', () => {
  const rootMetadata = {
    code: 1,
    err: '@spec-kit/shared/frontmatter/parse-frontmatter.js is not built here; '
      + 'run bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision . '
      + 'from the repository root\n',
  };
  const { status, out } = run(buildRoot({ rootMetadata }));
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}root-metadata +node /m);
  assert.match(out, /^ {6}repair: bash \.skilled\/skills\/sk-git\/scripts\/worktree-naming\.sh provision \.$/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE PROVISION STEP GATES ITS TWO DEPENDENT LEGS
// ─────────────────────────────────────────────────────────────────────────────

test('an unprovisioned tree fails provisioning, skips its two dependents, and leaks no stack', () => {
  const { status, out } = run(buildRoot({ provisioned: false }));
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}provisioning +require\.resolve\('@spec-kit\/shared\/frontmatter\/parse-frontmatter\.js'\)$/m);
  assert.match(out, /^ {6}repair: bash \.skilled\/skills\/sk-git\/scripts\/worktree-naming\.sh provision \.$/m);
  assert.match(out, /^SKIP {2}parent-skill +needs the provision step$/m);
  assert.match(out, /^SKIP {2}root-metadata +needs the provision step$/m);
  assert.match(out, /^PASS {2}guard +node /m);
  assert.match(out, /^STATUS=FAIL failed=1 skipped=2$/m);
  assert.doesNotMatch(out, /^\s+at /m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. A CHECKOUT WITHOUT THE V4 TREE FAILS FAST
// ─────────────────────────────────────────────────────────────────────────────

test('a checkout missing the sk-code SKILL.md fails provisioning and skips the other eight legs', () => {
  const root = buildRoot();
  fs.rmSync(path.join(root, SKILL_FILE));
  const { status, out } = run(root);
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}provisioning /m);
  assert.match(out, /^ {6}\.skilled\/skills\/sk-code\/SKILL\.md is missing, so this checkout predates the v4 layout or never installed sk-code$/m);
  assert.match(out, /^ {6}repair: install the \.skilled\/ tree from a v4 release, run \/doctor:update compat, then rerun this check$/m);
  assert.equal((out.match(/^SKIP .*needs the v4 layout$/gm) || []).length, 8);
  const lines = out.trimEnd().split('\n');
  assert.equal(lines[lines.length - 1], 'STATUS=FAIL failed=1 skipped=8');
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. THE QUALITY LEG NAMES EACH FAILING CHECK
// ─────────────────────────────────────────────────────────────────────────────

test('a quality checker that is not executable fails the quality leg with its chmod repair', () => {
  const { status, out } = run(buildRoot({ quality: { checkerMode: 0o644 } }));
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL {2}quality +/m);
  assert.match(out, /^ {6}executables: not an executable file: \.skilled\/skills\/sk-code\/sk-code-quality\/scripts\/check-comment-hygiene\.sh$/m);
  assert.match(out, /^ {6}repair: chmod \+x \.skilled\/skills\/sk-code\/sk-code-quality\/scripts\/check-comment-hygiene\.sh$/m);
  assert.match(out, /^STATUS=FAIL failed=1 skipped=0$/m);
});

test('a failing quality test and a quality prompt that routes elsewhere are each named', () => {
  const testBody = "require('node:test')('stub fails', () => { throw new Error('seeded'); });\n";
  const probe = { out: '{"hubId":"sk-code","action":"route","targets":[{"workflowMode":"sk-code-skilled"}]}\n' };
  const { status, out } = run(buildRoot({ quality: { testBody }, probe }));
  assert.equal(status, 1, out);
  assert.match(out, /^PASS {2}probe +/m);
  assert.match(out, /^ {6}tests: the quality tests failed: not ok 1 - stub fails$/m);
  assert.match(out, /^ {6}route: the quality prompt did not route to sk-code-quality$/m);
  assert.match(out, /^ {6}repair: node --test \.skilled\/skills\/sk-code\/sk-code-quality\/scripts\/tests\/\*\.test\.cjs, then fix each failing test$/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. BAD ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

test('an unknown argument prints usage on stderr and exits 2', () => {
  const { status, stdout, stderr } = run(buildRoot(), ['--nope']);
  assert.equal(status, 2, stderr);
  assert.equal(stdout, '');
  assert.match(stderr, /^Usage: node \.skilled\/commands\/doctor\/scripts\/sk-code-setup-check\.cjs \[--prompt=<text>\]$/m);
});
