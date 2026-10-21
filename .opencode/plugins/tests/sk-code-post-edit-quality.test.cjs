// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: sk-code-post-edit-quality Regression Tests                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the shared post-edit-router core's dispatch table + fail-   ║
// ║          open behavior, the OpenCode plugin's export shape and          ║
// ║          before/after callID correlation, and the Claude .cjs adapter's ║
// ║          warn-only/always-exit-0 contract -- against hermetic fixtures, ║
// ║          no live OpenCode session or real checker install required.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const ROUTER_PATH = path.join(
  __dirname, '..', '..', 'hooks', 'post-edit-quality', 'lib', 'post-edit-router.cjs',
);
const CLAUDE_HOOK_PATH = path.join(
  __dirname, '..', '..', 'hooks', 'post-edit-quality', 'claude', 'claude-posttooluse.cjs',
);
const CODEX_HOOK_PATH = path.join(
  __dirname, '..', '..', 'hooks', 'post-edit-quality', 'codex', 'post-edit-quality.cjs',
);
const REPO_ROOT = path.join(__dirname, '..', '..', '..');
const LOG_RELATIVE = ['.skilled', 'logs', 'post-edit-quality.log'];

const router = require(ROUTER_PATH);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A project is a toolchain checkout when its source root carries this file, and
// the plugin writes its log under that root.
function temporaryDirectory(t, prefix, sourceRoot = '.skilled') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const sentinel = path.join(dir, sourceRoot, 'skills', 'system-spec-kit', 'SKILL.md');
  fs.mkdirSync(path.dirname(sentinel), { recursive: true });
  fs.writeFileSync(sentinel, '---\nname: system-spec-kit\n---\n');
  return dir;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
}

function writeExecutable(filePath, content) {
  writeFile(filePath, content);
  fs.chmodSync(filePath, 0o755);
  return filePath;
}

function checkerFixturePath(tmpDir, relKey) {
  return path.join(tmpDir, router.CHECKER_RELATIVE_PATHS[relKey]);
}

async function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'sk-code-post-edit-quality.js')).href;
  return import(pluginUrl);
}

async function runTrapped(callback) {
  const consoleCalls = [];
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  const originalStdoutWrite = process.stdout.write;
  const originalStderrWrite = process.stderr.write;
  console.warn = (message) => consoleCalls.push(`warn:${message}`);
  console.error = (message) => consoleCalls.push(`error:${message}`);
  console.log = (message) => consoleCalls.push(`log:${message}`);
  process.stdout.write = (chunk) => { consoleCalls.push(`stdout:${chunk}`); return true; };
  process.stderr.write = (chunk) => { consoleCalls.push(`stderr:${chunk}`); return true; };
  try {
    await callback();
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
    console.log = originalLog;
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
  }
  return consoleCalls;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CORE -- resolveDispatch table (five classes + no-match + adversarial)
// ─────────────────────────────────────────────────────────────────────────────

test('resolveDispatch: comment-hygiene fires for a plain source-file edit', () => {
  const entries = router.resolveDispatch('x/foo.ts', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'comment-hygiene');
  assert.equal(entries[0].args[0], path.join('/tmp/proj', 'x/foo.ts'));
});

test('resolveDispatch: frontmatter-versions fires for a skill SKILL.md with --skill scope', () => {
  const entries = router.resolveDispatch('.opencode/skills/sk-doc/SKILL.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'frontmatter-versions');
  assert.deepEqual(entries[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: frontmatter-versions fires for a skill SKILL.md under a .skilled source root', () => {
  const entries = router.resolveDispatch('.skilled/skills/sk-doc/SKILL.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'frontmatter-versions');
  assert.deepEqual(entries[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: wikilinks scopes to the skill directory under the source root the edit names', () => {
  const entries = router.resolveDispatch('.skilled/skills/sk-doc/notes.md', '/tmp/proj', {
    env: { SPECKIT_VALIDATE_LINKS: 'true' },
  });
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'wikilinks');
  assert.equal(entries[0].args[0], path.join('/tmp/proj', '.skilled/skills/sk-doc'));
});

test('resolveDispatch: placeholders fires for a spec-folder doc, scoped to the folder', () => {
  const entries = router.resolveDispatch('.opencode/specs/NNN-x/spec.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'placeholders');
  assert.equal(entries[0].args[0], path.join('/tmp/proj', '.opencode/specs/NNN-x'));
});

test('resolveDispatch: legacy top-level specs/ folder also matches placeholders', () => {
  const entries = router.resolveDispatch('specs/042-feature/plan.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'placeholders');
});

test('resolveDispatch: flowchart fires for a create-flowchart asset by path', () => {
  const entries = router.resolveDispatch('create-flowchart/assets/x-flowchart.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'flowchart');
});

test('resolveDispatch: flowchart fires for any filename containing "flowchart"', () => {
  const entries = router.resolveDispatch('.opencode/specs/042-x/flowchart.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'flowchart');
});

test('resolveDispatch: repo-root README.md matches nothing', () => {
  assert.deepEqual(router.resolveDispatch('README.md', '/tmp/proj'), []);
});

test('resolveDispatch: wikilinks stays off by default and turns on only via its env flag', () => {
  const offEntries = router.resolveDispatch('.opencode/skills/sk-doc/notes.md', '/tmp/proj', { env: {} });
  assert.equal(offEntries.length, 1);
  assert.equal(offEntries[0].label, 'frontmatter-versions', 'with the flag off the doc gets the version check, not wikilinks');

  const onEntries = router.resolveDispatch('.opencode/skills/sk-doc/notes.md', '/tmp/proj', {
    env: { SPECKIT_VALIDATE_LINKS: 'true' },
  });
  assert.equal(onEntries.length, 1);
  assert.equal(onEntries[0].label, 'wikilinks');
  assert.equal(onEntries[0].args[0], path.join('/tmp/proj', '.opencode/skills/sk-doc'));
});

test('resolveDispatch: a SKILL.md never fires wikilinks even when the env flag is on (frontmatter wins priority)', () => {
  const entries = router.resolveDispatch('.opencode/skills/sk-doc/SKILL.md', '/tmp/proj', {
    env: { SPECKIT_VALIDATE_LINKS: 'true' },
  });
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'frontmatter-versions');
});

test('resolveDispatch: adversarial -- a doc under a skill\'s references/ dir named spec.md resolves to frontmatter, not placeholders', () => {
  const entries = router.resolveDispatch('.opencode/skills/sk-doc/references/spec.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'frontmatter-versions');
  assert.deepEqual(entries[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: frontmatter-versions fires for every in-scope skill doc, never for test input or generated output', () => {
  for (const child of [
    '.skilled/skills/sk-doc/references/guide.md',
    '.skilled/skills/sk-doc/assets/template.md',
    '.skilled/skills/sk-doc/feature-catalog/routing/route.md',
    '.skilled/skills/sk-doc/manual-testing-playbook/routing/route.md',
    '.skilled/skills/sk-doc/sk-create-skill/references/guide.md',
    '.skilled/skills/sk-doc/scripts/README.md',
    '.skilled/skills/system-deep-loop/runtime/feature-catalog/entry.md',
  ]) {
    const entries = router.resolveDispatch(child, '/tmp/proj');
    assert.equal(entries.length, 1, `${child} must fire the version gate`);
    assert.equal(entries[0].label, 'frontmatter-versions');
  }
  for (const out of [
    '.skilled/skills/sk-doc/changelog/v1.0.0.0.md',
    '.skilled/skills/sk-doc/scripts/tests/fixtures/references/a.md',
    '.skilled/skills/sk-doc/benchmark/README.md',
    '.skilled/skills/system-deep-loop/runtime/lib/README.md',
    '.skilled/skills/system-spec-kit/templates/examples/level-1/plan.md',
  ]) {
    assert.deepEqual(router.resolveDispatch(out, '/tmp/proj'), [], `${out} must not fire the version gate`);
  }
  const packet = router.resolveDispatch('.skilled/skills/sk-doc/sk-create-skill/SKILL.md', '/tmp/proj');
  assert.equal(packet.length, 1);
  assert.equal(packet[0].label, 'frontmatter-versions');
  assert.deepEqual(packet[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: a runtime state concern README keeps the version gate, deeper state stays out', () => {
  const concernReadme = '.skilled/skills/.state/goal/README.md';
  const readmeEntries = router.resolveDispatch(concernReadme, '/tmp/proj');
  assert.equal(readmeEntries.length, 1, 'the tracked state concern README is a versioned doc');
  assert.equal(readmeEntries[0].label, 'frontmatter-versions');
  assert.deepEqual(readmeEntries[0].args, ['--skill', '.state']);
  assert.equal(
    router.resolveDispatch(concernReadme, '/tmp/proj', { env: { SPECKIT_VALIDATE_LINKS: 'true' } })[0].label,
    'frontmatter-versions',
    'a state dir is no skill, so the opt-in links row never takes the state README over',
  );
  assert.equal(
    router.resolveDispatch('.opencode/skills/.state/goal/README.md', '/tmp/proj')[0].label,
    'frontmatter-versions',
    'the same state dir read through the linked source root',
  );

  const handoff = '.skilled/skills/.state/session-relaunch/handoffs/20261019T000000Z-abcd1234.md';
  for (const out of [
    handoff,
    '.opencode/skills/.state/session-relaunch/handoffs/20261019T000000Z-abcd1234.md',
    '.skilled/skills/.state/goal/notes.md',
    '.skilled/skills/.state/goal/nested/README.md',
    '.skilled/skills/sk-doc/.state/notes.md',
  ]) {
    assert.deepEqual(router.resolveDispatch(out, '/tmp/proj'), [], `${out} is not a versioned skill doc`);
  }
  assert.deepEqual(
    router.resolveDispatch(handoff, '/tmp/proj', { env: { SPECKIT_VALIDATE_LINKS: 'true' } }),
    [],
    'the opt-in wikilinks row must not scope a whole-tree scan to runtime state',
  );
  assert.equal(
    router.resolveDispatch('.skilled/skills/sk-doc/references/x.md', '/tmp/proj')[0].label,
    'frontmatter-versions',
    'a real skill reference doc still fires the version gate',
  );
});

test('resolveDispatch: adversarial -- box-drawing glyphs in a non-flowchart doc do not trigger the flowchart checker', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-boxdraw-');
  const docPath = writeFile(
    path.join(tmpDir, '.opencode', 'skills', 'sk-doc', 'references', 'architecture.md'),
    '```text\n┌─────┐\n│ box │\n└─────┘\n```\n',
  );
  const entries = router.resolveDispatch(docPath, tmpDir);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'frontmatter-versions', 'a references/ doc must resolve to frontmatter, never flowchart, regardless of embedded box glyphs');
});

test('resolveDispatch: adversarial -- a path outside the project root resolves to no match', () => {
  assert.deepEqual(router.resolveDispatch('/etc/passwd', '/tmp/proj'), []);
});

test('resolveDispatch: README.md matches frontmatter-versions with or without a sibling SKILL.md', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-readme-');
  const readme = writeFile(path.join(tmpDir, '.opencode', 'skills', 'sk-doc', 'sub', 'README.md'), '# x\n');
  assert.equal(router.resolveDispatch(readme, tmpDir)[0].label, 'frontmatter-versions');

  writeFile(path.join(tmpDir, '.opencode', 'skills', 'sk-doc', 'sub', 'SKILL.md'), '---\nversion: 1.0.0.0\n---\n');
  assert.equal(router.resolveDispatch(readme, tmpDir)[0].label, 'frontmatter-versions');
});

test('resolveDispatch: dist/node_modules/.git segments are excluded from comment-hygiene', () => {
  assert.deepEqual(router.resolveDispatch('pkg/dist/out.js', '/tmp/proj'), []);
  assert.deepEqual(router.resolveDispatch('pkg/node_modules/x/out.js', '/tmp/proj'), []);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE -- runChecks fail-open + surface rules + deadline exhaustion
// ─────────────────────────────────────────────────────────────────────────────

test('runChecks: a missing checker path yields no finding (fail-open)', () => {
  const findings = router.runChecks([{
    label: 'ghost', checkerPath: '/does/not/exist.sh', args: [], surfaceRule: 'exit1',
  }], 5000);
  assert.deepEqual(findings, []);
});

test('runChecks: an exit-2 (unavailable) checker yields no finding, only exit 0/1 are meaningful', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-exit2-');
  const checker = writeExecutable(path.join(tmpDir, 'checker.sh'), '#!/usr/bin/env bash\nexit 2\n');
  const findings = router.runChecks([{
    label: 'unavailable', checkerPath: checker, args: [], surfaceRule: 'exit1',
  }], 5000);
  assert.deepEqual(findings, []);
});

test('runChecks: spawn throwing synchronously yields no finding (fail-open)', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'post-edit-router-spawn-throw-'));
  try {
    // A directory in place of an executable makes spawnSync raise EISDIR.
    const findings = router.runChecks([{
      label: 'throws', checkerPath: tmpDir, args: [], surfaceRule: 'exit1',
    }], 5000);
    assert.deepEqual(findings, []);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('runChecks: comment-hygiene surfaceRule requires exit 1 AND non-empty stdout', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-surfacerule-');
  const violatingChecker = writeExecutable(
    path.join(tmpDir, 'violating.sh'),
    '#!/usr/bin/env bash\necho "file.ts:1: violation"\nexit 1\n',
  );
  const silentFailChecker = writeExecutable(
    path.join(tmpDir, 'silent.sh'),
    '#!/usr/bin/env bash\nexit 1\n',
  );

  const withStdout = router.runChecks([{
    label: 'comment-hygiene', checkerPath: violatingChecker, args: [], surfaceRule: 'exit1-with-stdout',
  }], 5000);
  assert.equal(withStdout.length, 1);
  assert.match(withStdout[0].stdout, /violation/);

  const withoutStdout = router.runChecks([{
    label: 'comment-hygiene', checkerPath: silentFailChecker, args: [], surfaceRule: 'exit1-with-stdout',
  }], 5000);
  assert.deepEqual(withoutStdout, []);
});

test('runChecks: exit1 surfaceRule surfaces even with empty stdout', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-exit1-');
  const checker = writeExecutable(path.join(tmpDir, 'fails.sh'), '#!/usr/bin/env bash\nexit 1\n');
  const findings = router.runChecks([{
    label: 'placeholders', checkerPath: checker, args: [], surfaceRule: 'exit1',
  }], 5000);
  assert.equal(findings.length, 1);
});

test('runChecks: a clean exit-0 checker never surfaces', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-clean-');
  const checker = writeExecutable(path.join(tmpDir, 'clean.sh'), '#!/usr/bin/env bash\necho "all good"\nexit 0\n');
  const findings = router.runChecks([{
    label: 'flowchart', checkerPath: checker, args: [], surfaceRule: 'exit1',
  }], 5000);
  assert.deepEqual(findings, []);
});

test('runChecks: skips remaining entries once the shared deadline is exhausted', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-deadline-');
  const slowMarker = path.join(tmpDir, 'slow-ran.marker');
  const fastMarker = path.join(tmpDir, 'fast-ran.marker');
  // Wide margins on both sides deliberately avoid flakiness under CI/system
  // jitter: entry 1 gets a per-child timeout (5000ms) far above its actual
  // ~500ms of work, so it always completes rather than being killed, while
  // minCheckerMs (1100ms) sits comfortably above the worst-case remaining
  // budget after entry 1 finishes, so entry 2 is always skipped.
  const slowChecker = writeExecutable(
    path.join(tmpDir, 'slow.sh'),
    `#!/usr/bin/env bash\ntouch "${slowMarker}"\nsleep 0.5\necho "slow violation"\nexit 1\n`,
  );
  const fastChecker = writeExecutable(
    path.join(tmpDir, 'fast.sh'),
    `#!/usr/bin/env bash\ntouch "${fastMarker}"\necho "fast violation"\nexit 1\n`,
  );

  const findings = router.runChecks([
    { label: 'slow', checkerPath: slowChecker, args: [], surfaceRule: 'exit1' },
    { label: 'fast', checkerPath: fastChecker, args: [], surfaceRule: 'exit1' },
  ], 1500, { perChildTimeoutMs: 5000, minCheckerMs: 1100 });

  assert.equal(findings.length, 1);
  assert.equal(findings[0].label, 'slow');
  assert.ok(fs.existsSync(slowMarker), 'the slow entry must have actually run');
  assert.ok(!fs.existsSync(fastMarker), 'the fast entry must be skipped once the deadline is exhausted, not merely unsurfaced');
});

test('runChecks: a non-positive deadlineMs (exhausted budget) returns no findings without spawning any checker', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-exhausted-');
  const marker = path.join(tmpDir, 'ran.marker');
  const checker = writeExecutable(
    path.join(tmpDir, 'checker.sh'),
    `#!/usr/bin/env bash\ntouch "${marker}"\necho "should not run"\nexit 1\n`,
  );
  const entry = { label: 'x', checkerPath: checker, args: [], surfaceRule: 'exit1' };

  assert.deepEqual(router.runChecks([entry], 0), []);
  assert.ok(!fs.existsSync(marker), 'deadlineMs=0 must skip the checker entirely, not fall back to the default timeout');

  assert.deepEqual(router.runChecks([entry], -50), []);
  assert.ok(!fs.existsSync(marker), 'a negative deadlineMs must also be treated as zero budget, not the default timeout');
});

test('runChecks: dedupeTracker suppresses a repeat dedupeKey without re-running the checker', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-dedupe-');
  const ranMarkerA = path.join(tmpDir, 'ran-a.marker');
  const checker = writeExecutable(
    path.join(tmpDir, 'frontmatter.sh'),
    `#!/usr/bin/env bash\ntouch "${ranMarkerA}.$$"\necho "violation"\nexit 1\n`,
  );
  const tracker = router.createDedupeTracker();
  const entry = { label: 'frontmatter-versions', checkerPath: checker, args: [], surfaceRule: 'exit1', dedupeKey: 'frontmatter:sk-doc' };

  const first = router.runChecks([entry], 5000, { dedupeTracker: tracker });
  assert.equal(first.length, 1);
  const second = router.runChecks([entry], 5000, { dedupeTracker: tracker });
  assert.deepEqual(second, []);
});

test('runChecks: redacts keyworded secret-shaped assignments in finding stdout', (t) => {
  const tmpDir = temporaryDirectory(t, 'post-edit-router-redact-');
  const checker = writeExecutable(
    path.join(tmpDir, 'leaky.sh'),
    '#!/usr/bin/env bash\necho "api_key: sk-thisisalonglivetoken123456"\nexit 1\n',
  );
  const findings = router.runChecks([{
    label: 'x', checkerPath: checker, args: [], surfaceRule: 'exit1',
  }], 5000);
  assert.equal(findings.length, 1);
  assert.doesNotMatch(findings[0].stdout, /sk-thisisalonglivetoken123456/);
  assert.match(findings[0].stdout, /\[REDACTED\]/);
});

test('redactSecrets: redacts the token carried by an Authorization bearer scheme', () => {
  const redacted = router.redactSecrets('request failed: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.abc');
  assert.equal(redacted, 'request failed: Authorization: Bearer [REDACTED]');
});

test('redactSecrets: redacts the token after a bare bearer scheme, keeps the scheme word, and leaves a short word alone', () => {
  assert.equal(router.redactSecrets('Bearer sk-live-abc123456789'), 'Bearer [REDACTED]');
  assert.equal(router.redactSecrets('bearer abc123456789'), 'bearer [REDACTED]', 'the scheme word is case-insensitive');
  assert.equal(router.redactSecrets('Bearer token'), 'Bearer token', 'a word shorter than 8 characters after the scheme is not a token');
});

test('redactSecrets: still redacts a keyworded secret-shaped assignment', () => {
  assert.equal(router.redactSecrets('api_key: sk-thisisalonglivetoken123456'), 'api_key: [REDACTED]');
});

test('runChecks: real check-comment-hygiene.sh flags a live ADR reference (repo-root integration)', () => {
  // Must live inside REPO_ROOT: resolveDispatch treats an outside-root path as
  // no-match by design, and the real checker install this test targets only
  // exists at repo-relative canonical paths.
  const tmpFile = fs.mkdtempSync(path.join(REPO_ROOT, '.skilled', 'plugins', 'tests', '.tmp-real-checker-'));
  try {
    const editedFile = writeFile(path.join(tmpFile, 'edited.ts'), '// See ADR-042 for details\nexport const x = 1;\n');
    const entries = router.resolveDispatch(editedFile, REPO_ROOT);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].label, 'comment-hygiene');
    assert.ok(fs.existsSync(entries[0].checkerPath), 'the canonical comment-hygiene checker must exist on disk');

    const findings = router.runChecks(entries, 8000, { perChildTimeoutMs: 8000, minCheckerMs: 500 });
    assert.equal(findings.length, 1);
    assert.match(findings[0].stdout, /ADR reference|ADR-042/);
  } finally {
    fs.rmSync(tmpFile, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. OPENCODE PLUGIN -- export shape + correlation + full-hook integration
// ─────────────────────────────────────────────────────────────────────────────

test('OpenCode plugin exports only the default plugin factory', async () => {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default.server, 'function');
});

test('OpenCode plugin correlation map: stash -> retrieve+evict, unmatched take is a no-op', async () => {
  const { createCorrelationMap } = await import('../lib/sk-code-post-edit-quality-core.js');
  const map = createCorrelationMap(2);
  assert.equal(map.take('missing'), null);

  map.stash('call-1', '/tmp/a.ts');
  map.stash('call-2', '/tmp/b.ts');
  assert.equal(map.size(), 2);

  assert.equal(map.take('call-1'), '/tmp/a.ts');
  assert.equal(map.size(), 1, 'take must evict the entry it retrieves');
  assert.equal(map.take('call-1'), null, 'a second take for the same callID is a no-op');

  map.stash('call-3', '/tmp/c.ts');
  map.stash('call-4', '/tmp/d.ts');
  assert.ok(map.size() <= 2, 'the map must stay bounded, evicting the oldest entry');
});

test('OpenCode plugin: before/after correlation runs the dispatch table and surfaces via chat.system.transform, with zero terminal writes', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-e2e-');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const ok = 1;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    `#!/usr/bin/env bash\necho "${editedFile}:1: fake violation"\nexit 1\n`,
  );

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });

  const consoleCalls = await runTrapped(async () => {
    await hooks['tool.execute.before']({ tool: 'write', callID: 'call-1' }, { args: { filePath: editedFile } });
    await hooks['tool.execute.after']({ tool: 'write', callID: 'call-1' }, { title: 'x', output: '', metadata: {} });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({}, output);
    assert.equal(output.system.length, 1);
    assert.match(output.system[0], /comment-hygiene/);
    assert.match(output.system[0], /fake violation/);

    // Draining is one-shot: a second transform call with nothing pending must not re-surface.
    const drained = { system: [] };
    await hooks['experimental.chat.system.transform']({}, drained);
    assert.deepEqual(drained.system, []);
  });

  assert.deepEqual(consoleCalls, [], 'the OpenCode plugin must never write to stdout/stderr');
  const logPath = path.join(tmpDir, ...LOG_RELATIVE);
  assert.ok(fs.existsSync(logPath), 'a finding must be recorded to the bounded append-only log');
  assert.match(fs.readFileSync(logPath, 'utf8'), /comment-hygiene/);
});

test('OpenCode plugin: logs under .opencode when that is the only source root', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-legacy-root-', '.opencode');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const ok = 1;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    `#!/usr/bin/env bash\necho "${editedFile}:1: fake violation"\nexit 1\n`,
  );

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });
  await runTrapped(async () => {
    await hooks['tool.execute.before']({ tool: 'write', callID: 'call-1' }, { args: { filePath: editedFile } });
    await hooks['tool.execute.after']({ tool: 'write', callID: 'call-1' }, { title: 'x', output: '', metadata: {} });
  });

  assert.match(fs.readFileSync(path.join(tmpDir, '.opencode', 'logs', 'post-edit-quality.log'), 'utf8'), /comment-hygiene/);
  assert.equal(fs.existsSync(path.join(tmpDir, '.skilled', 'logs')), false);
});

test('OpenCode plugin: tool.execute.after resolves a relative stashed filePath against projectDir before existsSync/resolveDispatch', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-relpath-');
  const relativeEditedFile = path.join('nested', 'edited.ts');
  writeFile(path.join(tmpDir, relativeEditedFile), 'export const ok = 1;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    '#!/usr/bin/env bash\necho "relative-path violation"\nexit 1\n',
  );

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });

  const consoleCalls = await runTrapped(async () => {
    // Simulate a tool handing over a path relative to projectDir rather than
    // to the plugin host's own process.cwd() (the repo root during this test
    // run, where no such relative file exists). Before the fix this resolved
    // existsSync/resolveDispatch against the wrong root and silently no-opped.
    await hooks['tool.execute.before']({ tool: 'write', callID: 'call-1' }, { args: { filePath: relativeEditedFile } });
    await hooks['tool.execute.after']({ tool: 'write', callID: 'call-1' }, { title: 'x', output: '', metadata: {} });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({}, output);
    assert.equal(output.system.length, 1, 'a relative filePath must resolve against projectDir, not the host cwd');
    assert.match(output.system[0], /relative-path violation/);
  });
  assert.deepEqual(consoleCalls, []);
});

test('OpenCode plugin: tool.execute.after threads cwd:projectDir through to runChecks/spawnSync for cwd-sensitive checkers', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-cwd-');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const ok = 1;\n');
  writeFile(path.join(tmpDir, 'sentinel.txt'), 'present\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    '#!/usr/bin/env bash\nif [ -f "./sentinel.txt" ]; then\n  echo "cwd-correct"\nelse\n  echo "cwd-wrong: $(pwd)"\nfi\nexit 1\n',
  );

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });

  const consoleCalls = await runTrapped(async () => {
    await hooks['tool.execute.before']({ tool: 'write', callID: 'call-1' }, { args: { filePath: editedFile } });
    await hooks['tool.execute.after']({ tool: 'write', callID: 'call-1' }, { title: 'x', output: '', metadata: {} });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({}, output);
    assert.equal(output.system.length, 1);
    assert.match(output.system[0], /cwd-correct/, 'spawnSync must run the checker with cwd:projectDir, not the plugin host cwd');
  });
  assert.deepEqual(consoleCalls, []);
});

test('OpenCode plugin: an after-hook with no matching callID is a no-op', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-nomatch-');
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });

  const consoleCalls = await runTrapped(async () => {
    await hooks['tool.execute.after']({ tool: 'write', callID: 'never-stashed' }, { title: 'x', output: '', metadata: {} });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({}, output);
    assert.deepEqual(output.system, []);
  });
  assert.deepEqual(consoleCalls, []);
});

test('OpenCode plugin: non-mutating tools are ignored by tool.execute.before', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-nonmutating-');
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });

  await hooks['tool.execute.before']({ tool: 'bash', callID: 'call-x' }, { args: { command: 'ls' } });
  const output = { system: [] };
  await hooks['tool.execute.after']({ tool: 'bash', callID: 'call-x' }, { title: 'x', output: '', metadata: {} });
  await hooks['experimental.chat.system.transform']({}, output);
  assert.deepEqual(output.system, []);
});

test('OpenCode plugin: kill-switch env makes every hook a full no-op', async (t) => {
  const tmpDir = temporaryDirectory(t, 'sk-code-post-edit-quality-killswitch-');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const ok = 1;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    `#!/usr/bin/env bash\necho "${editedFile}:1: fake violation"\nexit 1\n`,
  );
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default.server({ directory: tmpDir });

  const previousDisabled = process.env.SK_CODE_POST_EDIT_QUALITY_DISABLED;
  process.env.SK_CODE_POST_EDIT_QUALITY_DISABLED = '1';
  try {
    await hooks['tool.execute.before']({ tool: 'write', callID: 'call-1' }, { args: { filePath: editedFile } });
    await hooks['tool.execute.after']({ tool: 'write', callID: 'call-1' }, { title: 'x', output: '', metadata: {} });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({}, output);
    assert.deepEqual(output.system, [], 'the kill-switch must suppress every hook, including surfacing');
  } finally {
    if (previousDisabled === undefined) delete process.env.SK_CODE_POST_EDIT_QUALITY_DISABLED;
    else process.env.SK_CODE_POST_EDIT_QUALITY_DISABLED = previousDisabled;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLAUDE ADAPTER -- warn-only, always exit 0
// ─────────────────────────────────────────────────────────────────────────────

test('Claude hook rejects malformed envelopes without a traceback and always exits 0', () => {
  const malformed = [
    'not-json',
    '[]',
    'null',
    '"scalar"',
    '{"tool_name":"Write","tool_input":null}',
    '{"tool_name":"Write","tool_input":{"file_path":42}}',
    '{"tool_name":"Write","tool_input":{"file_path":"/missing"},"cwd":null}',
    '{"tool_name":"Bash","tool_input":{"file_path":"/etc/hosts"}}',
  ];
  for (const input of malformed) {
    const result = spawnSync(CLAUDE_HOOK_PATH, [], { input, encoding: 'utf8' });
    assert.equal(result.status, 0, input);
    assert.equal(result.stdout, '', input);
    assert.doesNotMatch(result.stderr, /Traceback/, input);
  }
});

test('Claude hook prints a bounded comment-hygiene advisory and preserves dist-staleness coverage', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-post-edit-hook-');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const edited = true;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    `#!/usr/bin/env bash\necho "${editedFile}:1: fake violation"\nexit 1\n`,
  );
  writeExecutable(
    checkerFixturePath(tmpDir, 'distStaleness'),
    '#!/usr/bin/env bash\necho "STALE DIST WARNING: @fixture/pkg"\nexit 0\n',
  );

  const result = spawnSync(CLAUDE_HOOK_PATH, [], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: editedFile }, cwd: tmpDir }),
    encoding: 'utf8',
    timeout: 11_000,
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /COMMENT HYGIENE WARNING/);
  assert.match(result.stdout, /fake violation/);
  assert.match(result.stdout, /STALE DIST WARNING: @fixture\/pkg/);
});

test('Claude hook is a full no-op under its kill-switch env', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-post-edit-hook-killswitch-');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const edited = true;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    `#!/usr/bin/env bash\necho "${editedFile}:1: fake violation"\nexit 1\n`,
  );

  const result = spawnSync(CLAUDE_HOOK_PATH, [], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: editedFile }, cwd: tmpDir }),
    encoding: 'utf8',
    env: { ...process.env, SK_CODE_POST_EDIT_QUALITY_DISABLED: '1' },
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4b. CODEX ADAPTER -- multi-file apply_patch coverage (regression for the
//     single-match firstPatchPath() bug: a multi-file patch previously only
//     ever got its first named file checked)
// ─────────────────────────────────────────────────────────────────────────────

test('Codex hook checks every file named in a multi-file apply_patch, not only the first', (t) => {
  const tmpDir = temporaryDirectory(t, 'codex-post-edit-hook-multi-');
  const fileA = writeFile(path.join(tmpDir, 'a.ts'), 'export const a = true;\n');
  const fileB = writeFile(path.join(tmpDir, 'b.ts'), 'export const b = true;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    '#!/usr/bin/env bash\necho "$1:1: fake violation in $1"\nexit 1\n',
  );

  const patch = [
    '*** Begin Patch',
    '*** Update File: a.ts',
    '@@',
    '-export const a = true;',
    '+export const a = false;',
    '*** Update File: b.ts',
    '@@',
    '-export const b = true;',
    '+export const b = false;',
    '*** End Patch',
    '',
  ].join('\n');

  const result = spawnSync(process.execPath, [CODEX_HOOK_PATH], {
    input: JSON.stringify({ tool_name: 'apply_patch', tool_input: { command: patch }, cwd: tmpDir }),
    encoding: 'utf8',
    timeout: 11_000,
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, new RegExp(`fake violation in ${fileA.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), 'the first patched file must be checked');
  assert.match(result.stdout, new RegExp(`fake violation in ${fileB.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), 'the second patched file must ALSO be checked -- this is the regression this test pins');
});

test('Claude hook is a no-op for a missing file (never crashes on a stale path)', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-post-edit-hook-missing-');
  const result = spawnSync(CLAUDE_HOOK_PATH, [], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: path.join(tmpDir, 'ghost.ts') }, cwd: tmpDir }),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
});

test('Claude hook honors its shared budget across sequential checks', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-post-edit-hook-budget-');
  const editedFile = writeFile(path.join(tmpDir, 'edited.ts'), 'export const edited = true;\n');
  writeExecutable(
    checkerFixturePath(tmpDir, 'commentHygiene'),
    '#!/usr/bin/env python3\nimport time\ntime.sleep(8.2)\n',
  );
  writeExecutable(
    checkerFixturePath(tmpDir, 'distStaleness'),
    '#!/usr/bin/env bash\necho "DIST CHECK REACHED"\nexit 0\n',
  );

  const startedAt = Date.now();
  const result = spawnSync(CLAUDE_HOOK_PATH, [], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: editedFile }, cwd: tmpDir }),
    encoding: 'utf8',
    timeout: 11_000,
  });
  const elapsedMs = Date.now() - startedAt;
  assert.equal(result.status, 0);
  assert.ok(elapsedMs < 10_000, `hook exceeded host budget: ${elapsedMs}ms`);
  assert.ok(result.stdout.includes('DIST CHECK REACHED'), 'the dist-staleness check must still run after the slow checker is cut off by the shared budget');
});
