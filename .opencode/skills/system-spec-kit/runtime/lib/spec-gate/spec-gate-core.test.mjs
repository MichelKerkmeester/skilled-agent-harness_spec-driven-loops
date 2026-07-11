// Golden-loop + fail-open + answerParse() corpus test for the spec-gate core.
// Run with: node --test spec-gate-core.test.mjs
// A handful of tests (marked below) additionally exercise ESM module mocking
// via `t.mock.module()` and self-skip when the process was not started with
// --experimental-test-module-mocks; run with that flag for full coverage:
//   node --experimental-test-module-mocks --test spec-gate-core.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, chmodSync, symlinkSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as core from './spec-gate-core.mjs';

const CORE_SOURCE_PATH = fileURLToPath(new URL('./spec-gate-core.mjs', import.meta.url));
const CORE_MODULE_URL = new URL('./spec-gate-core.mjs', import.meta.url).href;
const CLASSIFIER_MODULE_PATH = fileURLToPath(new URL('../../../shared/dist/gate-3-classifier.js', import.meta.url));

function makeWorkspace() {
  const root = mkdtempSync(join(tmpdir(), 'spec-gate-test-'));
  const folderRel = '.opencode/specs/999-test-folder';
  const folderAbs = join(root, folderRel);
  mkdirSync(folderAbs, { recursive: true });
  writeFileSync(join(folderAbs, 'spec.md'), '# Test Spec\n\n| **Status** | Active |\n');
  writeFileSync(join(folderAbs, 'description.json'), '{}\n');
  writeFileSync(join(folderAbs, 'graph-metadata.json'), '{}\n');
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'src', 'login.ts'), '// placeholder\n');
  return { root, folderRel };
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

let sessionCounter = 0;
function nextSessionID() {
  sessionCounter += 1;
  return `test-session-${sessionCounter}-${Date.now()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Golden loop
// ─────────────────────────────────────────────────────────────────────────────

test('golden loop: open -> deny -> answer -> allow', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = nextSessionID();

    // 1. A mutating prompt opens the gate and returns the bounded question.
    const opened = core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
    assert.equal(opened.status, 'open');
    assert.ok(opened.question && opened.question.includes('SPEC FOLDER QUESTION'));

    // 2. A Write to a real in-repo source file denies while enforce is on.
    const denied = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(denied.decision, 'deny');
    assert.ok(denied.detail && denied.detail.includes('SPEC FOLDER QUESTION'));

    // 3. Answering with a real, validated folder satisfies the gate.
    const answered = core.classifyIntent({
      prompt: `B, use ${folderRel}`,
      sessionID,
      projectDir: root,
    });
    assert.equal(answered.status, 'satisfied');
    assert.equal(answered.question, null);

    // 4. The same Write now allows.
    const allowed = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(allowed.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('enforce-env unset returns advise, not deny', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the new endpoint', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: {},
    });
    assert.equal(result.decision, 'advise');
    assert.ok(result.detail);
  } finally {
    cleanup(root);
  }
});

test('D / skip closes the gate without a binding', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'refactor the parser module', sessionID, projectDir: root });

    const skipped = core.classifyIntent({ prompt: 'D, no spec folder needed', sessionID, projectDir: root });
    assert.equal(skipped.status, 'skipped');

    const allowed = core.evaluateMutation({
      tool: 'Edit',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(allowed.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('a letter with no named folder stays open (no guessed binding)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'update the config loader', sessionID, projectDir: root });

    const stillOpen = core.classifyIntent({ prompt: 'A', sessionID, projectDir: root });
    assert.equal(stillOpen.status, 'open');
    assert.ok(stillOpen.question);
  } finally {
    cleanup(root);
  }
});

test('an invalid/nonexistent folder answer stays open and re-asks', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'build the export pipeline', sessionID, projectDir: root });

    const stillOpen = core.classifyIntent({
      prompt: 'B, use .opencode/specs/does-not-exist',
      sessionID,
      projectDir: root,
    });
    assert.equal(stillOpen.status, 'open');
    assert.ok(stillOpen.question);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Read-only guard
// ─────────────────────────────────────────────────────────────────────────────

test('read-only prompts never open the gate', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({ prompt: 'review the auth module', sessionID, projectDir: root });
    assert.equal(result.status, 'closed');
    assert.equal(result.question, null);

    // Confirm no state file was written for a non-triggering prompt: a
    // subsequent Write is allowed with no gate ever having opened.
    const mutation = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('empty/whitespace-only prompt never triggers Gate 3', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({ prompt: '   ', sessionID, projectDir: root });
    assert.equal(result.status, 'closed');
    assert.equal(result.question, null);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Exempt-path
// ─────────────────────────────────────────────────────────────────────────────

test('exempt path: writing the spec folder itself is always allowed', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'create the migration script', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'Write',
      filePath: `${folderRel}/spec.md`,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('path traversal cannot masquerade a real source file as exempt', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the sync job', sessionID, projectDir: root });

    // "/tmp/../<real source file>" starts with the exempt "/tmp/" prefix as a
    // raw string, but resolves to a real in-repo file -- it must still deny.
    const traversal = `/tmp/../${join(root, 'src', 'login.ts').replace(/^\//, '')}`;
    const result = core.evaluateMutation({
      tool: 'write',
      filePath: traversal,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny');
  } finally {
    cleanup(root);
  }
});

test('exempt path: /tmp scratchpad, dist, node_modules, .git, out-of-repo', () => {
  const { root } = makeWorkspace();
  const sessionID = nextSessionID();
  core.classifyIntent({ prompt: 'implement the new handler', sessionID, projectDir: root });

  const cases = [
    '/tmp/some-scratch-file.md',
    join(root, 'dist', 'bundle.js'),
    join(root, 'node_modules', 'pkg', 'index.js'),
    join(root, '.git', 'HEAD'),
    '/completely/outside/the/repo.ts',
  ];

  try {
    for (const filePath of cases) {
      const result = core.evaluateMutation({
        tool: 'Write',
        filePath,
        sessionID,
        projectDir: root,
        env: { [core.ENFORCE_ENV]: '1' },
      });
      assert.equal(result.decision, 'allow', `expected allow for exempt path ${filePath}`);
    }
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Bash is always advise-only
// ─────────────────────────────────────────────────────────────────────────────

test('bash never denies even with enforce on and gate open', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'delete the stale cache', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'bash',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.notEqual(result.decision, 'deny');
    assert.equal(result.decision, 'advise');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// enforcement matrix: deny appears only for the single all-true row
// ─────────────────────────────────────────────────────────────────────────────

test('deny matrix: only enforce-on + write/edit + open + non-exempt denies', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const tools = ['write', 'edit', 'bash', 'patch'];
    const enforceValues = [undefined, '1'];
    const targets = [
      { label: 'source', filePath: 'src/login.ts', exempt: false },
      { label: 'exempt', filePath: `${folderRel}/spec.md`, exempt: true },
    ];

    let denyCount = 0;
    for (const tool of tools) {
      for (const enforceValue of enforceValues) {
        for (const target of targets) {
          const sessionID = nextSessionID();
          core.classifyIntent({ prompt: 'implement the sync job', sessionID, projectDir: root });
          const env = enforceValue ? { [core.ENFORCE_ENV]: enforceValue } : {};
          const result = core.evaluateMutation({
            tool,
            filePath: target.filePath,
            sessionID,
            projectDir: root,
            env,
          });

          const expectDeny = enforceValue === '1' && (tool === 'write' || tool === 'edit') && !target.exempt;
          if (expectDeny) {
            denyCount += 1;
            assert.equal(result.decision, 'deny', `expected deny for ${tool}/${enforceValue}/${target.label}`);
          } else {
            assert.notEqual(result.decision, 'deny', `expected non-deny for ${tool}/${enforceValue}/${target.label}`);
          }
        }
      }
    }
    // 4 tools x 2 enforce values x 2 targets = 16 rows; exactly 2 should deny
    // (write+enforce-on+non-exempt, edit+enforce-on+non-exempt).
    assert.equal(denyCount, 2);
  } finally {
    cleanup(root);
  }
});

test('gate never opened this session: satisfied/skipped/closed all allow', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Fail-open assertions
// ─────────────────────────────────────────────────────────────────────────────

test('fail-open: corrupt state file reads as never-opened', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    mkdirSync(stateDir, { recursive: true });
    const statePath = join(stateDir, `${core.sessionStateKey(sessionID)}.json`);
    writeFileSync(statePath, '{ not valid json');

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('fail-open: unwritable state directory never blocks classify or enforce', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    // Occupy the state-dir path with a plain file so mkdirSync(recursive) fails.
    mkdirSync(join(root, '.opencode', 'skills'), { recursive: true });
    writeFileSync(stateDir, 'not a directory');

    // Classify is advisory-only: even though the write fails (and the answer
    // cannot be remembered), it still surfaces the question this turn rather
    // than silently dropping it -- the load-bearing fail-open guarantee is
    // that evaluateMutation (the one surface that can actually block) never
    // denies on a persistence failure, asserted below.
    assert.doesNotThrow(() => {
      core.classifyIntent({ prompt: 'fix the auth bug', sessionID, projectDir: root });
    });

    const mutation = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    try { chmodSync(join(root, '.opencode', 'skills', '.spec-gate-state'), 0o644); } catch (_) { /* best-effort */ }
    cleanup(root);
  }
});

test('fail-open: unexpected argument shape never throws and always allows', () => {
  assert.doesNotThrow(() => {
    const classified = core.classifyIntent({ prompt: 'fix the bug', sessionID: 's', projectDir: 12345 });
    assert.equal(classified.status, 'closed');
  });
  assert.doesNotThrow(() => {
    const result = core.evaluateMutation({ tool: 'write', filePath: 'x.ts', sessionID: 's', projectDir: 12345, env: { [core.ENFORCE_ENV]: '1' } });
    assert.equal(result.decision, 'allow');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Kill switch
// ─────────────────────────────────────────────────────────────────────────────

test('MK_SPEC_GATE_DISABLED=1 makes both entrypoints a full no-op', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const classified = core.classifyIntent({
      prompt: 'fix the login bug',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1' },
    });
    assert.equal(classified.status, 'closed');
    assert.equal(classified.question, null);

    const mutation = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1', [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// no console output; enforce never walks the specs tree
// ─────────────────────────────────────────────────────────────────────────────

test('static shape: core never writes console output', () => {
  const source = readFileSync(CORE_SOURCE_PATH, 'utf8');
  assert.equal(/console\.(log|warn|error|info|debug)/.test(source), false);
});

test('static shape: evaluateMutation never calls validateSpecFolderBinding', () => {
  const source = readFileSync(CORE_SOURCE_PATH, 'utf8');
  const start = source.indexOf('export function evaluateMutation');
  assert.ok(start !== -1, 'evaluateMutation not found in source');
  const nextExport = source.indexOf('\nexport function', start + 1);
  const body = nextExport === -1 ? source.slice(start) : source.slice(start, nextExport);
  assert.equal(body.includes('validateSpecFolderBinding'), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// answerParse() corpus: false-positive / false-negative rate
// ─────────────────────────────────────────────────────────────────────────────

const POSITIVE_ANSWER_CORPUS = [
  { prompt: 'B, use .opencode/specs/059-login', expect: 'binding' },
  { prompt: 'C, .opencode/specs/track/042-foo', expect: 'binding' },
  { prompt: 'E - .opencode/specs/parent/003-phase', expect: 'binding' },
  { prompt: 'D', expect: 'skip' },
  { prompt: 'd', expect: 'skip' },
  { prompt: 'skip', expect: 'skip' },
  { prompt: 'Skip - handled elsewhere', expect: 'skip' },
  { prompt: 'A, 059-login-fix', expect: 'binding' },
  { prompt: 'C: specs/legacy-042-bar', expect: 'binding' },
];

const NEGATIVE_PROMPT_CORPUS = [
  'fix the login bug',
  'review the auth module',
  'can you explain how classifyPrompt works',
  'add a new endpoint for exports',
  'analyze the decomposition phase',
  'delete the abandoned branch',
  'the deploy failed at 2am, any idea why',
  'discuss the tradeoffs before deciding',
  'audit the recent commits',
  'run the test suite again',
  '404-not-found is the error page component',
  'A pretty big refactor is coming',
];

test('answerParse() corpus: recognized answers parse correctly (false-negative rate)', () => {
  let falseNegatives = 0;
  for (const { prompt, expect } of POSITIVE_ANSWER_CORPUS) {
    const parsed = core.answerParse(prompt);
    if (!parsed || parsed.type !== expect) {
      falseNegatives += 1;
    }
  }
  const rate = falseNegatives / POSITIVE_ANSWER_CORPUS.length;
  assert.equal(falseNegatives, 0, `answerParse() false-negative rate ${rate} on the answer corpus`);
});

test('answerParse() corpus: ordinary prompts are never misread as answers (false-positive rate)', () => {
  let falsePositives = 0;
  const misreads = [];
  for (const prompt of NEGATIVE_PROMPT_CORPUS) {
    const parsed = core.answerParse(prompt);
    if (parsed) {
      falsePositives += 1;
      misreads.push(prompt);
    }
  }
  const rate = falsePositives / NEGATIVE_PROMPT_CORPUS.length;
  assert.equal(falsePositives, 0, `answerParse() false-positive rate ${rate} on prompts: ${misreads.join(' | ')}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// State helpers: sweep / evict sanity
// ─────────────────────────────────────────────────────────────────────────────

test('state round-trip: write, read, evict', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    const wrote = core.writeGateStateAtomic(stateDir, sessionID, { status: 'open', askedAtMs: 1 });
    assert.equal(wrote, true);

    const read = core.readGateState(stateDir, sessionID);
    assert.equal(read.status, 'open');

    const evicted = core.evictGateState(stateDir, sessionID);
    assert.equal(evicted, true);

    const readAfterEvict = core.readGateState(stateDir, sessionID);
    assert.deepEqual(readAfterEvict, {});
  } finally {
    cleanup(root);
  }
});

test('sweepStaleGateStates never throws on an empty or missing state dir', () => {
  const { root } = makeWorkspace();
  try {
    const { stateDir } = core.resolveGuardPaths(root);
    assert.doesNotThrow(() => core.sweepStaleGateStates(stateDir, {}));
  } finally {
    cleanup(root);
  }
});

test('appendWarningLog never throws and is fail-open on an unwritable dir', () => {
  assert.doesNotThrow(() => {
    core.appendWarningLog('/definitely/not/writable/path/xyz', 'test detail');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// P1 fix: a classify-path exception must evict a previously persisted 'open'
// session state, never leave it stale for a later enforce hook to read.
// ─────────────────────────────────────────────────────────────────────────────

test('classify-path exception evicts a previously persisted open state (fail-open, not fail-stale)', async (t) => {
  if (typeof t.mock?.module !== 'function') {
    t.skip('requires --experimental-test-module-mocks (Node ESM module mocking)');
    return;
  }

  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();

    // 1. Genuinely open the gate with the real classifier.
    const opened = core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
    assert.equal(opened.status, 'open');
    const { stateDir } = core.resolveGuardPaths(root);
    assert.equal(core.readGateState(stateDir, sessionID).status, 'open');

    // 2. Force the classifier to throw on the NEXT turn, via a freshly
    // dynamically-imported core instance bound to the mocked dependency
    // (the top-level `core` import already resolved the real classifier).
    t.mock.module(CLASSIFIER_MODULE_PATH, {
      namedExports: {
        classifyPrompt: () => { throw new Error('forced classifier failure'); },
        validateSpecFolderBinding: () => ({ valid: false }),
      },
    });
    const mockedCore = await import(`${CORE_MODULE_URL}?mock-classifier-throw=${Date.now()}`);

    const result = mockedCore.classifyIntent({ prompt: 'still working on it', sessionID, projectDir: root });
    assert.equal(result.status, 'closed');

    // 3. The stale 'open' state must be GONE, not merely unreturned this
    // turn -- otherwise a later enforce hook reading the same session state
    // would still see 'open' and could deny despite this turn reporting closed.
    assert.deepEqual(core.readGateState(stateDir, sessionID), {});

    // 4. A subsequent Write/Edit for this session must allow, never deny,
    // proving the fail-open contract holds end-to-end after the exception.
    const mutation = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P1 fix: exemption/containment is decided on the REAL path (realpath), not
// the lexical one -- an in-repo symlink escaping the repo must be exempt.
// ─────────────────────────────────────────────────────────────────────────────

test('symlink escape: an in-repo symlink whose real target lands outside the repo is exempt', () => {
  const { root } = makeWorkspace();
  const outsideDir = mkdtempSync(join(tmpdir(), 'spec-gate-outside-'));
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the escape hatch', sessionID, projectDir: root });

    const outsideFile = join(outsideDir, 'real-target.ts');
    writeFileSync(outsideFile, '// outside the repo\n');
    const linkPath = join(root, 'src', 'escape-link.ts');
    symlinkSync(outsideFile, linkPath);

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: linkPath,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow', 'an in-repo symlink resolving outside the repo must be exempt, not enforceable');
  } finally {
    cleanup(root);
    cleanup(outsideDir);
  }
});

test('symlink sanity: an in-repo symlink whose real target stays in-repo is still enforceable', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the redirect', sessionID, projectDir: root });

    const linkPath = join(root, 'src', 'inside-link.ts');
    symlinkSync(join(root, 'src', 'login.ts'), linkPath);

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: linkPath,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny', 'an in-repo symlink resolving to another in-repo file must still be enforceable');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: answerParse() is state-gated structurally (isOpen), not merely by
// caller convention -- a direct call with isOpen:false must never parse.
// ─────────────────────────────────────────────────────────────────────────────

test('answerParse() never parses an answer when isOpen is explicitly false', () => {
  assert.equal(core.answerParse('B, .opencode/specs/059-login', false), null);
  assert.equal(core.answerParse('D', false), null);
  assert.equal(core.answerParse('skip', false), null);
  // Omitting isOpen preserves the raw-parser contract the answerParse()
  // corpus tests above rely on (default true).
  assert.notEqual(core.answerParse('D'), null);
  assert.notEqual(core.answerParse('B, .opencode/specs/059-login', true), null);
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: UNKNOWN_SESSION_ID is exported so every adapter can key a missing
// sessionID to the EXACT same state file the core's own internal fallback
// resolves to -- this is the anchor the OpenCode adapter's classify/enforce
// unification (mk-spec-gate.js sessionIdFrom()) depends on.
// ─────────────────────────────────────────────────────────────────────────────

test('sessionStateKey: an omitted/nullish sessionID resolves to the SAME key as the exported UNKNOWN_SESSION_ID constant', () => {
  assert.equal(core.sessionStateKey(undefined), core.sessionStateKey(core.UNKNOWN_SESSION_ID));
  assert.equal(core.sessionStateKey(null), core.sessionStateKey(core.UNKNOWN_SESSION_ID));
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: exemption/containment must canonicalize path CASING (via
// realpathSync.native), not just symlink targets -- a case-variant path
// pointing at a real in-repo file must never read as exempt.
// ─────────────────────────────────────────────────────────────────────────────

test('case-insensitive FS: a case-variant path to a real in-repo file is still enforceable, never falsely exempt', (t) => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the case check', sessionID, projectDir: root });

    const realPath = join(root, 'src', 'login.ts');
    const variantPath = join(root, 'SRC', 'LOGIN.ts');

    // Only meaningful on a case-insensitive-but-case-preserving filesystem
    // (default macOS APFS, Windows NTFS): confirm the variant path actually
    // resolves to the SAME on-disk file before asserting anything. On a
    // genuinely case-sensitive host, the variant is a different, nonexistent
    // path -- the vulnerability this test pins does not exist there.
    let isSameFile = false;
    try {
      isSameFile = realpathSync.native(variantPath) === realpathSync.native(realPath);
    } catch (_) {
      isSameFile = false;
    }
    if (!isSameFile) {
      t.skip('host filesystem is case-sensitive; case-variant path is a genuinely different file here');
      return;
    }

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: variantPath,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny', 'a case-variant path to a real in-repo file must still be enforceable, not exempt');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// HIGHEST BLAST proof: MK_SPEC_GATE_ENFORCE unset never denies, across the
// full tool/target/gate-state matrix; every known error path fails OPEN.
// ─────────────────────────────────────────────────────────────────────────────

test('HIGHEST BLAST proof: with MK_SPEC_GATE_ENFORCE unset, no tool/target/gate-state combination ever denies', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const tools = ['write', 'edit', 'Write', 'Edit', 'patch', 'multiedit', 'apply_patch', 'bash', 'read', 'glob', 'bogus-tool'];
    const targets = [
      'src/login.ts',
      `${folderRel}/spec.md`,
      '/tmp/scratch.md',
      join(root, 'dist', 'out.js'),
      '/completely/outside/the/repo.ts',
    ];
    const gateSetups = [
      (sessionID) => { core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root }); }, // -> open
      (sessionID) => {
        core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
        core.classifyIntent({ prompt: 'D', sessionID, projectDir: root });
      }, // -> skipped
      (sessionID) => {
        core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
        core.classifyIntent({ prompt: `B, use ${folderRel}`, sessionID, projectDir: root });
      }, // -> satisfied
      () => {}, // never opened
    ];

    let checked = 0;
    for (const tool of tools) {
      for (const target of targets) {
        for (const setup of gateSetups) {
          const sessionID = nextSessionID();
          setup(sessionID);
          // env has NO ENFORCE_ENV key at all -- the unset case.
          const result = core.evaluateMutation({ tool, filePath: target, sessionID, projectDir: root, env: {} });
          assert.notEqual(result.decision, 'deny', `enforce unset must never deny for ${tool}/${target}`);
          checked += 1;
        }
      }
    }
    assert.equal(checked, tools.length * targets.length * gateSetups.length);
  } finally {
    cleanup(root);
  }
});

test('HIGHEST BLAST proof: every known error path resolves to allow, even with enforce=1', () => {
  const enforceEnv = { [core.ENFORCE_ENV]: '1' };

  // 1. Corrupt/unreadable state file.
  {
    const { root } = makeWorkspace();
    try {
      const sessionID = nextSessionID();
      const { stateDir } = core.resolveGuardPaths(root);
      mkdirSync(stateDir, { recursive: true });
      writeFileSync(join(stateDir, `${core.sessionStateKey(sessionID)}.json`), '{ not valid json');
      const result = core.evaluateMutation({ tool: 'write', filePath: 'src/login.ts', sessionID, projectDir: root, env: enforceEnv });
      assert.notEqual(result.decision, 'deny');
    } finally {
      cleanup(root);
    }
  }

  // 2. Unwritable state directory.
  {
    const { root } = makeWorkspace();
    try {
      const sessionID = nextSessionID();
      const { stateDir } = core.resolveGuardPaths(root);
      mkdirSync(join(root, '.opencode', 'skills'), { recursive: true });
      writeFileSync(stateDir, 'not a directory');
      const result = core.evaluateMutation({ tool: 'write', filePath: 'src/login.ts', sessionID, projectDir: root, env: enforceEnv });
      assert.notEqual(result.decision, 'deny');
    } finally {
      try { chmodSync(join(root, '.opencode', 'skills', '.spec-gate-state'), 0o644); } catch (_) { /* best-effort */ }
      cleanup(root);
    }
  }

  // 3. Unexpected argument shape (non-string projectDir).
  {
    const result = core.evaluateMutation({ tool: 'write', filePath: 'x.ts', sessionID: 's', projectDir: 12345, env: enforceEnv });
    assert.notEqual(result.decision, 'deny');
  }
});
