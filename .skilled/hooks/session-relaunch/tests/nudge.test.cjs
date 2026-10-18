// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Nudge Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  handoffText,
  seedText,
  isSeedPrompt,
  specFolderFromSeed,
  nextLevel,
  validSessionId,
  readState,
  writeState,
} = require('../lib/nudge.cjs');

const NOTE_PATH = '/tmp/session-relaunch/handoff-01a14869.md';
const SESSION_ID = '01a14869-0b90-74a9-8231-4d14477ec215';
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters';
const SKIP_SPEC_FOLDER_SUFFIX = ' (Gate 3 answered D) Skip in the sending session)';
const SKIP_GATE_LINE = '3. Gate 3 is already answered Skip for this session, '
  + 'carried from the handoff.';
const CLI_PATH = '/repo/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const HANDOFF_GUIDANCE = [
  '   Under ## Remaining work list only the task\'s own unfinished work.',
  'Never list these handoff steps (the note, the continuity save, prepare) there;',
  'this session does them now.',
].join(' ');
const OPERATOR_EXCEPTION_LINE = [
  'Exception: skip these steps only when the operator has told this session not to hand off;',
  'then keep working, and auto-compaction stays the fallback.',
].join(' ');
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
const CONTINUITY_WRITER = 'node .skilled/skills/system-spec-kit/runtime/cli/'
  + 'dist/continuity/generate-context.js';
const SEED_STEP_THREE = [
  '3. Continue the work under "Remaining work". Do not run prepare for this note;',
  'its handoff is already done. If Remaining work names only handoff steps,',
  'treat it as empty.',
].join(' ');

test('handoff text includes the note, complete frontmatter, four sections, save step, and quoted prepare command', () => {
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

  const unbound = handoffText({ notePath: NOTE_PATH, sessionId: SESSION_ID, specFolder: '', runtime: 'opencode', cliPath: CLI_PATH });
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
    '[session-relaunch] Context is about 25% full. Do these steps now, before any other work, '
      + 'so a fresh session continues before auto-compaction has to:',
  );
  assert.match(lines[1], /^1\. /);
  assert.equal(lines[lines.length - 1], OPERATOR_EXCEPTION_LINE);
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

  assert.equal(specFolderFromSeed(prompt), SPEC_FOLDER);
  assert.equal(specFolderFromSeed(skippedPrompt), 'none');
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
