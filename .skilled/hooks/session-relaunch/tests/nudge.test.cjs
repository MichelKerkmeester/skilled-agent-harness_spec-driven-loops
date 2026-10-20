// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Nudge Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nudgeModule = require('../lib/nudge.cjs');
const {
  handoffText,
  seedText,
  completeCommandFor,
  isSeedPrompt,
  specFolderFromSeed,
  notePathFromSeed,
  resolveRepoRoot,
  plannedNotePath,
  relaunchThreshold,
  nextLevel,
  validSessionId,
  readState,
  writeState,
  handoffPending,
  hopLimitReached,
} = nudgeModule;
const core = require('../lib/relaunch-core.cjs');

const NOTE_PATH = '/tmp/session-relaunch/handoff-01a14869.md';
const SESSION_ID = '01a14869-0b90-74a9-8231-4d14477ec215';
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters';
const SKIP_SPEC_FOLDER_SUFFIX = ' (Gate 3 answered D, Skip, in the sending session)';
const SKIP_SPEC_FOLDER_SUFFIX_LEGACY = ' (Gate 3 answered D) Skip in the sending session)';
const SKIP_GATE_LINE = '3. Gate 3 is already answered Skip for this session, '
  + 'carried from the handoff.';
const CLI_PATH = '/repo/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
// The repository that holds this hook: four levels up from the tests dir beside `lib/`,
// and the root a note path must land in whatever directory a session starts from.
const HOOK_REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const HANDOFF_GUIDANCE = [
  '   Under ## Remaining work list only the task\'s own unfinished work.',
  'Never list these handoff steps (the note, the continuity save, prepare) there;',
  'this session does them now.',
].join(' ');
const OPERATOR_EXCEPTION_LINE = [
  'Exception: skip these steps only when the operator has told this session not to hand off;',
  'then keep working, and auto-compaction stays the fallback.',
].join(' ');
const RELAUNCH_INSTRUCTION = ' If the remaining work fits in a few more steps, finish it instead'
  + ' and skip these steps.'
  + ' Otherwise do these steps now, before any other work,'
  + ' so a fresh session continues before auto-compaction has to:';
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
const CONTINUITY_WRITER = 'node .skilled/skills/system-spec-kit/runtime/cli/'
  + 'dist/continuity/generate-context.js';
const SEED_STEP_THREE = [
  '3. Continue the work under "Remaining work". Do not run prepare for this note;',
  'its handoff is already done. If Remaining work names only handoff steps,',
  'treat it as empty.',
].join(' ');

test('handoff text includes the note, frontmatter, all four sections and prepare command', () => {
  const text = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: SPEC_FOLDER,
    runtime: 'pi',
    cliPath: CLI_PATH,
  });

  assert.ok(text.includes(NOTE_PATH));
  const handoffLines = text.split('\n');
  assert.equal(handoffLines[0], '[session-relaunch] Write a handoff note before auto-compaction.');
  assert.match(handoffLines[1], /^1\. /);
  assert.equal(text.split(OPERATOR_EXCEPTION_LINE).length - 1, 1);
  assert.equal(handoffLines[handoffLines.length - 1], OPERATOR_EXCEPTION_LINE);
  for (const key of [
    'status',
    'session_id',
    'loop_id',
    'runtime',
    'cwd',
    'spec_folder',
    'created_at',
  ]) assert.match(text, new RegExp(`^\\s*${key}:`, 'm'), `missing frontmatter ${key}`);
  assert.ok(text.includes(`session_id: ${SESSION_ID}`));
  assert.ok(text.includes('runtime: pi'));
  assert.ok(text.includes(`spec_folder: ${SPEC_FOLDER}`));
  for (const section of ['Goal', 'Done', 'Remaining work', 'In-flight state']) {
    assert.ok(text.includes(`## ${section}`), `missing ${section} section`);
  }
  const sectionLine = handoffLines.findIndex((line) => line.startsWith('   followed by '));
  assert.notEqual(sectionLine, -1);
  assert.equal(handoffLines[sectionLine + 1], HANDOFF_GUIDANCE);
  assert.equal(handoffLines[sectionLine + 2], SPEC_FOLDER_GUIDANCE);

  const handoffSteps = handoffLines.filter((line) => /^\d+\./.test(line));
  assert.deepEqual(
    handoffSteps.map((line) => Number.parseInt(line, 10)),
    [1, 2, 3, 4],
  );
  assert.ok(handoffSteps[1].includes(CONTINUITY_WRITER));
  assert.ok(handoffSteps[1].includes(`--stdin --full-auto '${SPEC_FOLDER}'`));
  assert.equal(handoffSteps[1].includes('/speckit:save'), false);
  assert.ok(handoffSteps[2].includes('prepare --handoff'));
  assert.ok(handoffSteps[3].startsWith('4. Stop once it exits 0;'));
  assert.equal(text.includes('/speckit:save'), false);
  assert.ok(
    text.includes(
      `prepare --handoff '${NOTE_PATH}' --session '${SESSION_ID}' --runtime 'pi'`,
    ),
  );

  const unbound = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: '',
    runtime: 'opencode',
    cliPath: CLI_PATH,
  });
  const unboundSteps = unbound.split('\n').filter((line) => /^\d+\./.test(line));
  assert.deepEqual(
    unboundSteps.map((line) => Number.parseInt(line, 10)),
    [1, 2, 3],
  );
  assert.equal(unboundSteps.some((line) => line.includes('/speckit:save')), false);
  assert.equal(unbound.includes('generate-context.js'), false);
  assert.match(unbound, /^   spec_folder: $/m);
  assert.ok(unboundSteps[1].includes('prepare --handoff'));
  assert.ok(unboundSteps[1].includes("--runtime 'opencode'"));

  const skipped = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: 'none',
    runtime: 'opencode',
    cliPath: CLI_PATH,
  });
  const skippedSteps = skipped.split('\n').filter((line) => /^\d+\./.test(line));
  assert.deepEqual(
    skippedSteps.map((line) => Number.parseInt(line, 10)),
    [1, 2, 3],
  );
  assert.match(skipped, /^   spec_folder: none$/m);
  assert.equal(skipped.includes('generate-context.js'), false);

  const unspecified = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: undefined,
    runtime: 'opencode',
    cliPath: CLI_PATH,
  });
  const unspecifiedSteps = unspecified.split('\n').filter((line) => /^\d+\./.test(line));
  assert.deepEqual(
    unspecifiedSteps.map((line) => Number.parseInt(line, 10)),
    [1, 2, 3, 4],
  );
});

test('handoff text opens the ratio nudge imperatively and keeps the exception last', () => {
  const text = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: SPEC_FOLDER,
    runtime: 'pi',
    cliPath: CLI_PATH,
    ratio: 0.25,
  });
  const lines = text.split('\n');
  assert.equal(text.split(OPERATOR_EXCEPTION_LINE).length - 1, 1);
  assert.equal(
    lines[0],
    '[session-relaunch] Context is about 25% full.' + RELAUNCH_INSTRUCTION,
  );
  assert.match(lines[1], /^1\. /);
  assert.equal(lines[lines.length - 1], OPERATOR_EXCEPTION_LINE);
});

test('handoff text names a ratio past the configured window instead of the raw percentage', () => {
  const pastWindow = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: SPEC_FOLDER,
    runtime: 'pi',
    cliPath: CLI_PATH,
    ratio: 668.24,
  });
  assert.equal(
    pastWindow.split('\n')[0],
    '[session-relaunch] Context is past the configured window (over 100% full).'
      + RELAUNCH_INSTRUCTION,
  );
  assert.equal(pastWindow.includes('66824%'), false);

  const nearLimit = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: SPEC_FOLDER,
    runtime: 'pi',
    cliPath: CLI_PATH,
    ratio: 0.83,
  });
  assert.equal(
    nearLimit.split('\n')[0],
    '[session-relaunch] Context is about 83% full.' + RELAUNCH_INSTRUCTION,
  );

  for (const text of [pastWindow, nearLimit]) {
    assert.ok(text.includes('If the remaining work fits in a few more steps, finish it instead'));
  }
});

test('handoff text leaves the complete instruction to the seed text', () => {
  // A sending session may have claimed no note, so naming complete in the opening points it at
  // a planned path that does not exist. The seed text owns that instruction instead, for the
  // session that actually holds the note.
  const text = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: SPEC_FOLDER,
    runtime: 'pi',
    cliPath: CLI_PATH,
    ratio: 0.83,
  });
  const opening = text.split('\n')[0];

  assert.equal(opening.includes('complete'), false);
  assert.equal(text.includes('run complete'), false);

  const seed = seedText({
    notePath: NOTE_PATH,
    specFolder: SPEC_FOLDER,
    sessionId: SESSION_ID,
    cliPath: CLI_PATH,
  });
  assert.ok(seed.includes(`complete '${NOTE_PATH}'`));
});

test('handoff text keeps /speckit:save for the claude runtime only', () => {
  const claude = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: SPEC_FOLDER,
    runtime: 'claude',
    cliPath: CLI_PATH,
  });
  assert.ok(claude.includes('`/speckit:save`'));
  assert.equal(claude.includes('generate-context.js'), false);

  for (const runtime of ['pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin']) {
    const text = handoffText({
      notePath: NOTE_PATH,
      sessionId: SESSION_ID,
      specFolder: SPEC_FOLDER,
      runtime,
      cliPath: CLI_PATH,
    });
    assert.equal(text.includes('/speckit:save'), false, `${runtime} named a slash command`);
    assert.ok(
      text.includes(`${CONTINUITY_WRITER} --stdin --full-auto '${SPEC_FOLDER}'`),
      `${runtime} missing the continuity writer command`,
    );
    assert.ok(
      text.includes(`--runtime '${runtime}'`),
      `${runtime} prepare line missing --runtime`,
    );
  }

  const placeholder = handoffText({ notePath: NOTE_PATH, sessionId: SESSION_ID, runtime: 'pi' });
  assert.ok(placeholder.includes("--stdin --full-auto '<spec-folder>'"));
});

test('seed text claims the note, resumes only a bound spec folder, and completes the handoff', () => {
  const withSpec = seedText({ notePath: NOTE_PATH, specFolder: SPEC_FOLDER, sessionId: SESSION_ID, cliPath: CLI_PATH });
  assert.ok(withSpec.includes('claim'));
  const seedSteps = withSpec.split('\n').filter((line) => /^\d+\./.test(line));
  assert.deepEqual(
    seedSteps.map((line) => Number.parseInt(line, 10)),
    [1, 2, 3, 4],
  );
  assert.ok(seedSteps[1].includes(`/speckit:resume ${SPEC_FOLDER}`));
  assert.equal(seedSteps[2], SEED_STEP_THREE);
  assert.ok(seedSteps[3].includes('complete'));

  const withoutSpec = seedText({ notePath: NOTE_PATH, specFolder: '', sessionId: SESSION_ID, cliPath: CLI_PATH });
  assert.equal(withoutSpec.includes('/speckit:resume'), false);

  const skipped = seedText({
    notePath: NOTE_PATH,
    specFolder: 'none',
    sessionId: SESSION_ID,
    cliPath: CLI_PATH,
  });
  const skipSteps = skipped.split('\n').filter((line) => /^\d+\./.test(line));
  assert.deepEqual(
    skipSteps.map((line) => Number.parseInt(line, 10)),
    [1, 2, 3, 4, 5],
  );
  assert.equal(skipSteps.some((line) => line.includes('/speckit:resume')), false);
  assert.equal(skipSteps[2], SKIP_GATE_LINE);
});

test('seed text runs the real claim command with no placeholder explanation', () => {
  const seed = seedText({
    notePath: NOTE_PATH,
    specFolder: SPEC_FOLDER,
    sessionId: SESSION_ID,
    cliPath: CLI_PATH,
  });
  const claimLine = seed.split('\n').find((line) => line.startsWith('1. '));

  // A real path leaves no placeholder for step 1 to explain, so the stale clause is
  // asserted by its own words: the sweep for the old phrasing stays grep-clean.
  assert.equal(seed.includes('<handoff-path>'), false);
  assert.equal(seed.includes('is the path the seed prompt'), false);
  assert.ok(claimLine.includes(`claim '${NOTE_PATH}' --session '${SESSION_ID}'`), claimLine);
  assert.ok(claimLine.endsWith('; it prints the note body.'), claimLine);
});

test('seed text carries the complete command the reminder builder returns', () => {
  assert.equal(typeof completeCommandFor, 'function');

  const command = completeCommandFor(NOTE_PATH, CLI_PATH);
  const seed = seedText({
    notePath: NOTE_PATH,
    specFolder: SPEC_FOLDER,
    sessionId: SESSION_ID,
    cliPath: CLI_PATH,
  });

  assert.ok(seed.includes(`\`${command}\``), command);
  assert.ok(command.endsWith(`complete '${NOTE_PATH}'`), command);
  assert.equal(
    seedText({ notePath: NOTE_PATH }).includes(completeCommandFor(NOTE_PATH)),
    true,
  );
});

test('isSeedPrompt recognizes the relaunch seed prefix only', () => {
  assert.equal(isSeedPrompt('[session-relaunch] continue the handoff'), true);
  assert.equal(isSeedPrompt('continue the handoff'), false);
});

test('specFolderFromSeed reads only a valid carried folder and accepts suffixed seeds', () => {
  const prompt = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
    + ` | Spec folder: ${SPEC_FOLDER}`
    + ' (carried from the handoff; Gate 3 answered in the sending session)';
  const skippedPrompt = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
    + ` | Spec folder: none${SKIP_SPEC_FOLDER_SUFFIX}`;
  const legacySkippedPrompt = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
    + ` | Spec folder: none${SKIP_SPEC_FOLDER_SUFFIX_LEGACY}`;

  assert.equal(specFolderFromSeed(prompt), SPEC_FOLDER);
  assert.equal(specFolderFromSeed(skippedPrompt), 'none');
  assert.equal(specFolderFromSeed(legacySkippedPrompt), 'none');
  assert.equal(isSeedPrompt(skippedPrompt), true);
  assert.equal(specFolderFromSeed(`[session-relaunch] claim ${NOTE_PATH}`), '');
  assert.equal(specFolderFromSeed(`${prompt} extra`), '');
  for (const invalidFolder of [
    '',
    '../x',
    'specs/../x',
    'specs/a/..',
    '/absolute',
    'specs/hooks\r/invalid',
    'specs/hooks\n/invalid',
  ]) {
    const invalidPrompt = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
      + ` | Spec folder: ${invalidFolder}`
      + ' (carried from the handoff; Gate 3 answered in the sending session)';
    assert.equal(specFolderFromSeed(invalidPrompt), '');
  }
  assert.equal(isSeedPrompt(prompt), true);
  assert.equal(isSeedPrompt('[session-relaunch] continue the handoff'), true);
  assert.equal(isSeedPrompt('continue the handoff'), false);

  for (const validSpecFolder of [
    'specs/hooks/023-session-relaunch-loop',
    'specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop',
  ]) {
    const validPrompt = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
      + ` | Spec folder: ${validSpecFolder}`
      + ' (carried from the handoff; Gate 3 answered in the sending session)';
    assert.equal(specFolderFromSeed(validPrompt), validSpecFolder);
  }
});

for (const invalidSpecFolder of [
  'specs/hooks/session-relaunch',
  'specs/hooks',
  'specs/hooks/23-x',
]) {
  test(`specFolderFromSeed rejects ${invalidSpecFolder}`, () => {
    const prompt = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
      + ` | Spec folder: ${invalidSpecFolder}`
      + ' (carried from the handoff; Gate 3 answered in the sending session)';
    assert.equal(specFolderFromSeed(prompt), '');
  });
}

test('plannedNotePath resolves the repo root and stamps the session id', (t) => {
  assert.strictEqual(typeof plannedNotePath, 'function');
  // Planning creates the handoffs directory, so the relative root lands in a temp cwd.
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-cwd-'));
  const previousCwd = process.cwd();
  process.chdir(scratch);
  t.after(() => {
    process.chdir(previousCwd);
    fs.rmSync(scratch, { recursive: true, force: true });
  });
  const now = new Date('2026-10-18T01:02:03.456Z');
  const resolved = plannedNotePath({
    cwd: '/unrelated/cwd',
    sessionId: SESSION_ID,
    env: { SESSION_RELAUNCH_REPO_ROOT: 'relative-root' },
    now,
  });
  assert.equal(
    resolved,
    path.join(
      path.resolve('relative-root'),
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
      `20261018T010203Z-${SESSION_ID.slice(0, 8)}.md`,
    ),
  );
  assert.equal(path.isAbsolute(resolved), true);

  const fromOtherCwd = plannedNotePath({
    cwd: '/some/cwd',
    sessionId: SESSION_ID,
    env: {},
    now,
  });
  assert.equal(
    fromOtherCwd,
    path.join(
      HOOK_REPO_ROOT,
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
      `20261018T010203Z-${SESSION_ID.slice(0, 8)}.md`,
    ),
  );
});

function noteText(sessionId, status) {
  return `---\nstatus: ${status}\nsession_id: ${sessionId}\n---\n`;
}

function handoffFixture(t, notes) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(
    root,
    '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
  );
  fs.mkdirSync(directory, { recursive: true });
  for (const [filename, contents] of Object.entries(notes)) {
    fs.writeFileSync(path.join(directory, filename), contents);
  }
  return { directory, env: { SESSION_RELAUNCH_REPO_ROOT: root } };
}

test('plannedNotePath reuses the open note of the session for every later nudge', (t) => {
  const suffix = `${SESSION_ID.slice(0, 8)}.md`;
  const { directory, env } = handoffFixture(t, {
    [`20261017T000000Z-${suffix}`]: noteText(SESSION_ID, 'open'),
    [`20261016T000000Z-${suffix}`]: noteText(SESSION_ID, 'done'),
  });
  const openNote = path.join(directory, `20261017T000000Z-${suffix}`);

  const first = plannedNotePath({
    sessionId: SESSION_ID,
    env,
    now: new Date('2026-10-18T01:02:03.456Z'),
  });
  const later = plannedNotePath({
    sessionId: SESSION_ID,
    env,
    now: new Date('2026-10-18T05:06:07.890Z'),
  });

  assert.equal(first, openNote);
  assert.equal(later, openNote);
});

test('plannedNotePath reuses the newest open note when the session holds two', (t) => {
  const suffix = `${SESSION_ID.slice(0, 8)}.md`;
  const { directory, env } = handoffFixture(t, {
    [`20261017T000000Z-${suffix}`]: noteText(SESSION_ID, 'open'),
    [`20261017T090000Z-${suffix}`]: noteText(SESSION_ID, 'open'),
  });

  assert.equal(
    plannedNotePath({ sessionId: SESSION_ID, env, now: new Date('2026-10-18T01:02:03.456Z') }),
    path.join(directory, `20261017T090000Z-${suffix}`),
  );
});

test('plannedNotePath creates a private handoffs directory before naming a note in it', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const planned = plannedNotePath({
    sessionId: SESSION_ID,
    env: { SESSION_RELAUNCH_REPO_ROOT: root },
    now: new Date('2026-10-18T01:02:03.456Z'),
  });
  const directory = path.dirname(planned);
  assert.equal(fs.statSync(directory).isDirectory(), true);
  assert.equal(fs.statSync(directory).mode & 0o777, 0o700);
});

const SESSION_NOTE_NAME = `20261017T000000Z-${SESSION_ID.slice(0, 8)}.md`;
const FOREIGN_SESSION_ID = `${SESSION_ID.slice(0, 8)}-ffff-0000-0000-000000000000`;

for (const [label, notes] of [
  ['a claimed note', { [SESSION_NOTE_NAME]: noteText(SESSION_ID, 'claimed') }],
  ['a done note', { [SESSION_NOTE_NAME]: noteText(SESSION_ID, 'done') }],
  ['a note of another session sharing the same eight-character prefix', {
    [SESSION_NOTE_NAME]: noteText(FOREIGN_SESSION_ID, 'open'),
  }],
  ['an unparseable note', { [SESSION_NOTE_NAME]: 'status: open\n' }],
]) {
  test(`plannedNotePath stamps a new path when the handoffs hold ${label}`, (t) => {
    const { env } = handoffFixture(t, notes);
    const now = new Date('2026-10-18T01:02:03.456Z');

    assert.equal(
      plannedNotePath({ sessionId: SESSION_ID, env, now }),
      path.join(
        path.resolve(env.SESSION_RELAUNCH_REPO_ROOT),
        '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
        `20261018T010203Z-${SESSION_ID.slice(0, 8)}.md`,
      ),
    );
  });
}

test('resolveRepoRoot anchors the note path on the repository that holds the hook', () => {
  assert.strictEqual(typeof resolveRepoRoot, 'function');
  const now = new Date('2026-10-18T01:02:03.456Z');
  const subdirectory = path.join(HOOK_REPO_ROOT, '.skilled', 'hooks', 'session-relaunch');
  const handoffDirectory = path.join(
    HOOK_REPO_ROOT,
    '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
  );

  assert.equal(resolveRepoRoot({}), HOOK_REPO_ROOT);
  assert.equal(resolveRepoRoot({ SESSION_RELAUNCH_REPO_ROOT: 'rel' }), path.resolve('rel'));

  const planned = plannedNotePath({
    cwd: subdirectory,
    sessionId: SESSION_ID,
    env: {},
    now,
  });
  assert.equal(path.dirname(planned), handoffDirectory);
  assert.equal(planned.startsWith(`${subdirectory}${path.sep}`), false);
});

// Other tooling sets the generic REPO_ROOT to whatever project the caller is in, and an
// empty override is a caller that set nothing, so neither may move the note out of the
// repository that holds the hook.
test('resolveRepoRoot ignores the generic REPO_ROOT and an empty override', (t) => {
  assert.strictEqual(typeof resolveRepoRoot, 'function');
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-root-'));
  t.after(() => fs.rmSync(temporaryDirectory, { recursive: true, force: true }));

  for (const [env, expected] of [
    [{ REPO_ROOT: '/some/other/project' }, HOOK_REPO_ROOT],
    [{ SESSION_RELAUNCH_REPO_ROOT: '' }, HOOK_REPO_ROOT],
    [{ SESSION_RELAUNCH_REPO_ROOT: '', REPO_ROOT: '/some/other/project' }, HOOK_REPO_ROOT],
    [
      { SESSION_RELAUNCH_REPO_ROOT: '/abs/root', REPO_ROOT: '/some/other/project' },
      path.resolve('/abs/root'),
    ],
  ]) {
    assert.equal(
      resolveRepoRoot(env),
      expected,
      `resolveRepoRoot(${JSON.stringify(env)})`,
    );
  }

  const planned = plannedNotePath({
    cwd: temporaryDirectory,
    sessionId: SESSION_ID,
    env: { REPO_ROOT: temporaryDirectory },
    now: new Date('2026-10-18T01:02:03.456Z'),
  });
  assert.equal(
    path.dirname(planned),
    path.join(
      HOOK_REPO_ROOT,
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
  assert.equal(planned.startsWith(`${temporaryDirectory}${path.sep}`), false);
});

test('relaunchThreshold honors env over config, accepts (0, 1], else 0.8', () => {
  assert.strictEqual(typeof relaunchThreshold, 'function');
  assert.equal(relaunchThreshold({}, {}), 0.8);
  assert.equal(relaunchThreshold({ SESSION_RELAUNCH_THRESHOLD: '0.5' }, {}), 0.5);
  assert.equal(
    relaunchThreshold(
      { SESSION_RELAUNCH_THRESHOLD: '0.5' },
      { SESSION_RELAUNCH_THRESHOLD: '0.9' },
    ),
    0.9,
  );
  assert.equal(
    relaunchThreshold(
      { SESSION_RELAUNCH_THRESHOLD: '0.5' },
      { SESSION_RELAUNCH_THRESHOLD: 'bogus' },
    ),
    0.8,
  );
  assert.equal(relaunchThreshold({}, { SESSION_RELAUNCH_THRESHOLD: '0' }), 0.8);
  assert.equal(relaunchThreshold({}, { SESSION_RELAUNCH_THRESHOLD: '1' }), 1);
  assert.equal(relaunchThreshold({}, { SESSION_RELAUNCH_THRESHOLD: '1.5' }), 0.8);
  assert.equal(relaunchThreshold({ SESSION_RELAUNCH_THRESHOLD: 0.7 }, {}), 0.7);
});

test('notePathFromSeed returns the raw absolute path or null', () => {
  assert.strictEqual(typeof notePathFromSeed, 'function');
  const withSuffix = '[session-relaunch] claim and continue handoff ' + NOTE_PATH
    + ` | Spec folder: ${SPEC_FOLDER}`
    + ' (carried from the handoff; Gate 3 answered in the sending session)';

  assert.equal(
    notePathFromSeed('[session-relaunch] claim and continue handoff ' + NOTE_PATH),
    NOTE_PATH,
  );
  assert.equal(notePathFromSeed(withSuffix), NOTE_PATH);

  const escaped = '/tmp/we\\"ird-handoff.md';
  assert.equal(
    notePathFromSeed('[session-relaunch] claim and continue handoff ' + escaped),
    escaped,
  );

  for (const malformed of [
    'relative/handoff.md',
    ' /tmp/leading-space.md',
    '/tmp/trailing-space.md ',
    '/tmp/line\nbreak.md',
    '',
  ]) {
    assert.equal(
      notePathFromSeed('[session-relaunch] claim and continue handoff ' + malformed),
      null,
      `expected null for ${JSON.stringify(malformed)}`,
    );
  }
  assert.equal(notePathFromSeed('[session-relaunch] continue the handoff'), null);
  assert.equal(notePathFromSeed('not a seed'), null);
});

test('nextLevel nudges at the threshold and once more at threshold plus 0.05, then stays quiet', () => {
  assert.deepEqual(nextLevel({ ratio: 0.8, threshold: 0.8, state: 0 }), { level: 1, nudge: true });
  assert.deepEqual(nextLevel({ ratio: 0.8 + 0.05, threshold: 0.8, state: 1 }), { level: 2, nudge: true });
  assert.deepEqual(nextLevel({ ratio: 0.9, threshold: 0.8, state: 2 }), { level: 2, nudge: false });
});

test('validSessionId rejects shell metacharacters and accepts a safe session id', () => {
  assert.equal(validSessionId(SESSION_ID), true);
  assert.equal(validSessionId('abc; echo x'), false);
});

test('nudge state round-trips in the isolated runtime directory', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  const env = { ...process.env, XDG_RUNTIME_DIR: root };
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  writeState(SESSION_ID, 2, env);
  assert.equal(readState(SESSION_ID, env), 2);
});

test('writeState repairs a permissive state directory back to private mode', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  const env = { ...process.env, XDG_RUNTIME_DIR: root };
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const stateDirectory = path.join(root, 'skilled-relaunch');
  fs.mkdirSync(stateDirectory, { recursive: true });
  fs.chmodSync(stateDirectory, 0o755);

  writeState(SESSION_ID, 2, env);

  assert.equal(fs.statSync(stateDirectory).mode & 0o777, 0o700);
  assert.equal(readState(SESSION_ID, env), 2);
});

function recordSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const previousConfigFile = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = path.join(root, 'hook-flags.env');
  t.after(() => {
    if (previousConfigFile === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previousConfigFile;
  });
  const env = { ...process.env, XDG_RUNTIME_DIR: root };
  delete env.SESSION_RELAUNCH_MAX_AGE_MIN;
  return env;
}

function envForLoop(env, loopId) {
  return { ...env, SKILLED_LOOP_ID: loopId };
}

test('handoffPending is true for a pending record owned by this session', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-pending';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), true);
});

test('handoffPending is true for an armed record owned by this session', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-armed';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  assert.equal(core.arm({ loopId, cwd: '/repo', env }).status, 'armed');

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), true);
});

test('handoffPending is false for an armed record past the max age', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-armed-stale';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  const armedAt = new Date(Date.now() - 11 * 60 * 1000);
  assert.equal(core.arm({ loopId, cwd: '/repo', env, now: armedAt }).status, 'armed');

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), false);
});

test('handoffPending is true for an armed record inside the max age', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-armed-fresh';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  const armedAt = new Date(Date.now() - 60 * 1000);
  assert.equal(core.arm({ loopId, cwd: '/repo', env, now: armedAt }).status, 'armed');

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), true);
});

test('handoffPending follows an overridden max age for an armed record', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-armed-max-age';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  const armedAt = new Date(Date.now() - 11 * 60 * 1000);
  assert.equal(core.arm({ loopId, cwd: '/repo', env, now: armedAt }).status, 'armed');

  const raised = { ...env, SESSION_RELAUNCH_MAX_AGE_MIN: '60' };
  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(raised, loopId) }), true);
  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), false);
});

// The wrapper resolves this switch from the operator config file under the live
// environment, so the staleness check has to read that same pair: a value saved
// in the file otherwise binds the wrapper and never this check.
test('handoffPending honors a max age saved in the hook config file, with the environment winning', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-config-max-age';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  const armedAt = new Date(Date.now() - 2 * 60 * 1000);
  assert.equal(core.arm({ loopId, cwd: '/repo', env, now: armedAt }).status, 'armed');

  const configDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-config-'));
  const configFile = path.join(configDirectory, 'hook-flags.env');
  fs.writeFileSync(configFile, 'SESSION_RELAUNCH_MAX_AGE_MIN=1\n');
  const previousConfigFile = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = configFile;
  t.after(() => {
    if (previousConfigFile === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previousConfigFile;
    fs.rmSync(configDirectory, { recursive: true, force: true });
  });

  const fromFile = envForLoop({ ...env }, loopId);
  delete fromFile.SESSION_RELAUNCH_MAX_AGE_MIN;
  assert.equal(handoffPending({ sessionId: SESSION_ID, env: fromFile }), false);
  assert.equal(
    handoffPending({ sessionId: SESSION_ID, env: { ...fromFile, SESSION_RELAUNCH_MAX_AGE_MIN: '60' } }),
    true,
  );
  // A switch set to an empty value still answers, so the saved value underneath
  // never applies and the wrapper's default age decides instead.
  assert.equal(
    handoffPending({ sessionId: SESSION_ID, env: { ...fromFile, SESSION_RELAUNCH_MAX_AGE_MIN: '' } }),
    true,
  );
});

// The wrapper declines a relaunch once the hop count reaches the cap, so a nudge there
// would spend a turn on a handoff whose prepare can only decline.
// The hop count comes from the live environment and the cap from the config file under
// that environment, which is the pair the wrapper itself reads.
test('hopLimitReached compares the environment hop count with the wrapper hop cap', () => {
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '1', SESSION_RELAUNCH_MAX_HOPS: '1' }), true);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '3', SESSION_RELAUNCH_MAX_HOPS: '2' }), true);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '0', SESSION_RELAUNCH_MAX_HOPS: '1' }), false);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '2', SESSION_RELAUNCH_MAX_HOPS: '10' }), false);
});

test('hopLimitReached falls back to the wrapper defaults for a missing or unusable switch', () => {
  assert.equal(hopLimitReached({}), false);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '9' }), false);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '10' }), true);
  // An unusable hop count reads as zero hops, and an unusable cap as the wrapper's ten.
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: 'many', SESSION_RELAUNCH_MAX_HOPS: '0' }), true);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '1', SESSION_RELAUNCH_MAX_HOPS: '1.5' }), false);
});

test('hopLimitReached honors a cap saved in the hook config file, with the environment winning', (t) => {
  const configDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-config-'));
  const configFile = path.join(configDirectory, 'hook-flags.env');
  fs.writeFileSync(configFile, 'SESSION_RELAUNCH_MAX_HOPS=1\n');
  const previousConfigFile = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = configFile;
  t.after(() => {
    if (previousConfigFile === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previousConfigFile;
    fs.rmSync(configDirectory, { recursive: true, force: true });
  });

  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '1' }), true);
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '0' }), false);
  // An environment switch outranks the saved value, so the same hop count no longer caps.
  assert.equal(hopLimitReached({ SKILLED_LOOP_HOPS: '1', SESSION_RELAUNCH_MAX_HOPS: '5' }), false);
});

test('handoffPending is true for a pending record whatever its age', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-pending-old';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
    now: new Date(Date.now() - 11 * 60 * 1000),
  });

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), true);
});

test('handoffPending is false for a record owned by another session', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-other-session';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: 'another-session',
    runtime: 'pi',
    cwd: '/repo',
    env,
  });

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), false);
});

test('handoffPending is false without a loop id in the environment', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-no-id';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });

  assert.equal(handoffPending({ sessionId: SESSION_ID, env }), false);
  assert.equal(handoffPending({ sessionId: SESSION_ID, env: { ...env, SKILLED_LOOP_ID: '' } }), false);
});

test('handoffPending is false when the record cannot be read', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-unreadable';
  // A directory where the record file belongs makes the read itself fail, which
  // is the shape a permission or I/O failure takes at this boundary.
  fs.mkdirSync(
    path.join(env.XDG_RUNTIME_DIR, 'skilled-relaunch', `relaunch-${loopId}.json`),
    { recursive: true },
  );

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), false);
});

test('the nudge module exports the one CLI command every adapter prints', () => {
  assert.equal(
    nudgeModule.CLI_COMMAND,
    'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs',
  );
});

test('handoff text leaves an unknown spec folder empty instead of a placeholder prepare rejects', () => {
  const text = handoffText({ notePath: NOTE_PATH, sessionId: SESSION_ID, runtime: 'claude' });
  assert.match(text, /^   spec_folder: $/m);
  assert.equal(text.includes('<repo-relative packet path'), false);
  // An unknown folder still keeps the save step, which the model skips when nothing is bound.
  assert.ok(text.includes('/speckit:save'));
});

test('handoff text never writes an invalid spec folder into the note frontmatter', () => {
  const text = handoffText({
    notePath: NOTE_PATH,
    sessionId: SESSION_ID,
    specFolder: `${SPEC_FOLDER}\nstatus: done`,
    runtime: 'pi',
  });
  assert.match(text, /^   spec_folder: $/m);
  assert.equal(/^\s*status: done$/m.test(text), false);
  assert.equal(text.includes(SPEC_FOLDER), false);
});

test('normalizeSpecFolder keeps empty, none and a valid packet path, and drops the rest', () => {
  const { normalizeSpecFolder } = nudgeModule;
  assert.equal(normalizeSpecFolder(''), '');
  assert.equal(normalizeSpecFolder('none'), 'none');
  assert.equal(normalizeSpecFolder(SPEC_FOLDER), SPEC_FOLDER);
  for (const value of [undefined, null, 42, 'specs/../etc', `${SPEC_FOLDER}\n`, 'not-a-packet']) {
    assert.equal(normalizeSpecFolder(value), undefined, String(value));
  }
});

test('specFolderInput prefers the payload and falls back to SYSTEM_SPEC_FOLDER', () => {
  const { specFolderInput } = nudgeModule;
  const env = { SYSTEM_SPEC_FOLDER: SPEC_FOLDER };
  assert.equal(specFolderInput({ payload: { spec_folder: 'none' }, env }), 'none');
  assert.equal(specFolderInput({ payload: {}, env }), SPEC_FOLDER);
  assert.equal(specFolderInput({ payload: { spec_folder: 'bad value' }, env }), SPEC_FOLDER);
  assert.equal(specFolderInput({ payload: {}, env: { SYSTEM_SPEC_FOLDER: '' } }), undefined);
  assert.equal(specFolderInput({ payload: {}, env: { SYSTEM_SPEC_FOLDER: 'specs/x' } }), undefined);
  assert.equal(specFolderInput({ env: {} }), undefined);
});

test('seedInstructions returns the seed text for a well-formed seed and null otherwise', () => {
  const { seedInstructions } = nudgeModule;
  const seed = `[session-relaunch] claim and continue handoff ${NOTE_PATH}`
    + ` | Spec folder: ${SPEC_FOLDER} (carried from the handoff; Gate 3 answered in the sending session)`;
  const text = seedInstructions({ prompt: seed, sessionId: SESSION_ID });
  assert.ok(text.includes(`claim '${NOTE_PATH}'`), text);
  assert.ok(text.includes(`/speckit:resume ${SPEC_FOLDER}`), text);
  assert.ok(text.includes(nudgeModule.CLI_COMMAND), text);

  assert.equal(seedInstructions({
    prompt: '[session-relaunch] claim and continue handoff relative/note.md',
    sessionId: SESSION_ID,
  }), null);
  assert.equal(seedInstructions({ prompt: 'an ordinary prompt', sessionId: SESSION_ID }), null);
  assert.equal(seedInstructions({ prompt: undefined, sessionId: SESSION_ID }), null);
});

test('nudgeDecision folds the threshold, the wrapper, a live handoff, the hop cap and the level', (t) => {
  const { nudgeDecision } = nudgeModule;
  const outsideLoop = { XDG_RUNTIME_DIR: recordSandbox(t).XDG_RUNTIME_DIR };
  const env = { ...outsideLoop, SKILLED_LOOP_ID: 'nudge-decision-loop' };

  assert.deepEqual(
    nudgeDecision({ ratio: 0.5, threshold: 0.8, sessionId: SESSION_ID, env }),
    { nudge: false, level: 0, reason: 'below-threshold' },
  );
  assert.deepEqual(
    nudgeDecision({ ratio: 0.81, threshold: 0.8, sessionId: SESSION_ID, env: outsideLoop }),
    { nudge: false, level: 0, reason: 'outside-loop' },
  );
  assert.deepEqual(
    nudgeDecision({
      ratio: 0.81,
      threshold: 0.8,
      sessionId: SESSION_ID,
      env: { ...outsideLoop, SKILLED_LOOP_ID: '' },
    }),
    { nudge: false, level: 0, reason: 'outside-loop' },
  );
  assert.deepEqual(
    nudgeDecision({ ratio: 0.81, threshold: 0.8, sessionId: SESSION_ID, env }),
    { nudge: true, level: 1, reason: 'threshold' },
  );
  assert.deepEqual(
    nudgeDecision({ ratio: 0.81, threshold: 0.8, sessionId: SESSION_ID, env, level: 1 }),
    { nudge: false, level: 1, reason: 'level-spent' },
  );
  assert.deepEqual(
    nudgeDecision({ ratio: 0.81, threshold: 0.8, sessionId: SESSION_ID, env, level: 1, resume: true }),
    { nudge: true, level: 1, reason: 'resume' },
  );
  assert.deepEqual(
    nudgeDecision({
      ratio: 0.81,
      threshold: 0.8,
      sessionId: SESSION_ID,
      env: { ...env, SKILLED_LOOP_HOPS: '3', SESSION_RELAUNCH_MAX_HOPS: '3' },
    }),
    { nudge: false, level: 0, reason: 'hop-limit' },
  );

  const loopId = 'nudge-decision-pending';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  assert.deepEqual(
    nudgeDecision({ ratio: 0.9, threshold: 0.8, sessionId: SESSION_ID, env: envForLoop(env, loopId) }),
    { nudge: false, level: 0, reason: 'handoff-pending' },
  );
});

test('nudgeDecision reads the persisted level when the caller passes none', (t) => {
  const { nudgeDecision } = nudgeModule;
  const env = {
    XDG_RUNTIME_DIR: recordSandbox(t).XDG_RUNTIME_DIR,
    SKILLED_LOOP_ID: 'nudge-decision-loop',
  };
  writeState(SESSION_ID, 1, env);
  assert.deepEqual(
    nudgeDecision({ ratio: 0.82, threshold: 0.8, sessionId: SESSION_ID, env }),
    { nudge: false, level: 1, reason: 'level-spent' },
  );
  assert.deepEqual(
    nudgeDecision({ ratio: 0.86, threshold: 0.8, sessionId: SESSION_ID, env }),
    { nudge: true, level: 2, reason: 'threshold' },
  );
});

test('plannedNotePath leaves the target of a symlinked handoffs directory untouched', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const elsewhere = path.join(root, 'elsewhere');
  fs.mkdirSync(elsewhere, { mode: 0o755 });
  fs.chmodSync(elsewhere, 0o755);
  const stateParent = path.join(root, 'repo', '.skilled', 'skills', '.state', 'session-relaunch');
  fs.mkdirSync(stateParent, { recursive: true });
  fs.symlinkSync(elsewhere, path.join(stateParent, 'handoffs'));

  plannedNotePath({
    sessionId: SESSION_ID,
    env: { SESSION_RELAUNCH_REPO_ROOT: path.join(root, 'repo') },
    now: new Date('2026-10-18T01:02:03.456Z'),
  });
  assert.equal(fs.statSync(elsewhere).mode & 0o777, 0o755);
});

test('handoffDir is the handoffs directory every reader shares, the one notes are planned in', (t) => {
  const { handoffDir } = nudgeModule;
  assert.equal(typeof handoffDir, 'function');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nudge-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.equal(
    handoffDir(root),
    path.join(root, '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs'),
  );
  const planned = plannedNotePath({
    sessionId: SESSION_ID,
    env: { SESSION_RELAUNCH_REPO_ROOT: root },
    now: new Date('2026-10-18T01:02:03.456Z'),
  });
  assert.equal(path.dirname(planned), handoffDir(root));
});

test('handoff text asks for exactly the sections the core validates', () => {
  const text = handoffText({ notePath: NOTE_PATH, sessionId: SESSION_ID, runtime: 'pi' });
  const listed = text.match(/followed by (.+), each non-empty\./)[1];
  assert.equal(listed, core.HANDOFF_SECTIONS.map((name) => `## ${name}`).join(', '));
});

test('handoffPending is false for a record that names another loop', (t) => {
  const env = recordSandbox(t);
  const loopId = 'nudge-loop-renamed';
  core.preparePending({
    loopId,
    handoffPath: '/tmp/session-relaunch/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'pi',
    cwd: '/repo',
    env,
  });
  const filePath = core.relaunchFilePath(loopId, env);
  const record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, JSON.stringify({ ...record, loopId: 'nudge-loop-other' }));

  assert.equal(handoffPending({ sessionId: SESSION_ID, env: envForLoop(env, loopId) }), false);
});
