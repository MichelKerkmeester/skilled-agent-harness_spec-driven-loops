REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/002-failed-arm-deferred-mark

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): when the Codex Stop hook finds this session's pending record but cannot arm it, mark the record deferred and tell the operator why, so the next prompt withdraws it. Claude's Stop hook already does exactly this.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
P = Root/.skilled/hooks/session-handover/codex/stop-arm.mjs
T = Root/.skilled/hooks/session-handover/tests/codex-adapters.test.cjs

1. In P, in the import block from `'../lib/relaunch-core.cjs'`, add `markDeferred,` on its own line after `isEntrypoint,`.

2. In P, directly after the closing `}` of `function logEvent(event, fields, env) {`, add:

```

// A Stop that cannot arm this session's pending record marks it, so the operator's next prompt
// withdraws it. Left unmarked, the record would wait for a later Stop and relaunch from a note
// that predates the work done since.
function markParked(loopId, env) {
  try {
    markDeferred({ loopId, env });
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'defer', loopId, message: error.message }, env);
  }
}

// Codex shows a Stop hook's `systemMessage` and still ends the turn. The cause is known only
// here, because the prompt that withdraws the record cannot tell one failure from another.
function writeNotice(text, loopId, env, write) {
  try {
    const writeLine = write || ((line) => process.stdout.write(line));
    writeLine(`${JSON.stringify({ systemMessage: text })}\n`);
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'notice', loopId, message: error.message }, env);
  }
}
```

3. In P, add this line to the JSDoc of `armPendingRecord`, directly after the line that documents `dependencies.spawn`:

```
 * @param {Function} [dependencies.write] - Writes an operator notice; process.stdout.write when omitted.
```

4. In P, inside `armPendingRecord`, make three replacements.

4a. Replace

```
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId }, env);
    return null;
```

with

```
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId }, env);
    markParked(loopId, env);
    writeNotice(
      'Session handover could not arm the hop because this Stop carried no transcript path. '
        + 'Your next prompt withdraws the hand-over, and a later Stop that carries the path '
        + 'arms it instead.',
      loopId,
      env,
      dependencies.write,
    );
    return null;
```

4b. Replace

```
    logEvent('stop-arm-error', { stage: 'target-pid', loopId }, env);
    return null;
```

with

```
    logEvent('stop-arm-error', { stage: 'target-pid', loopId }, env);
    markParked(loopId, env);
    writeNotice(
      'Session handover could not arm the hop because this Stop found no session process '
        + 'below the loop. Your next prompt withdraws the hand-over, and a later Stop tries again.',
      loopId,
      env,
      dependencies.write,
    );
    return null;
```

4c. Replace

```
    logEvent('stop-arm-error', { stage: 'arm', loopId, message: error.message }, env);
    return null;
```

with

```
    logEvent('stop-arm-error', { stage: 'arm', loopId, message: error.message }, env);
    markParked(loopId, env);
    writeNotice(
      'Session handover could not arm the hop because arming the record failed. '
        + 'Your next prompt withdraws the hand-over, and a later Stop tries again.',
      loopId,
      env,
      dependencies.write,
    );
    return null;
```

5. In T, in the test titled `'Stop leaves the record pending when no ancestor matches the loop'`, replace these two lines

```
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
```

with

```
  assert.match(JSON.parse(result.stdout.trim()).systemMessage, /no session process below the loop/);
  const { deferredAt, ...stored } = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(typeof deferredAt, 'string');
  assert.deepEqual(stored, record);
```

6. In T, in the test titled `'Stop signals the loop child it finds above a transient shell, and arms nothing without one'`, replace

```
  const unmatched = await armPendingRecord(payload, {
    env: sandbox.env,
    pid: 41,
    processTable: '41 50\n50 1\n',
    spawn: spawnKiller,
  });
  assert.equal(unmatched, null);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
```

with

```
  const notices = [];
  const unmatched = await armPendingRecord(payload, {
    env: sandbox.env,
    pid: 41,
    processTable: '41 50\n50 1\n',
    spawn: spawnKiller,
    write: (line) => notices.push(line),
  });
  assert.equal(unmatched, null);
  const { deferredAt, ...stored } = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(typeof deferredAt, 'string');
  assert.deepEqual(stored, record);
  assert.equal(notices.length, 1);
```

7. In T, directly after the closing `});` of the test changed in step 6, add these two tests:

```

test('Stop marks the record deferred and says why when the payload has no transcript path', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = '100';
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID);
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const { armPendingRecord } = await import(pathToFileURL(STOP_ARM_PATH).href);
  const notices = [];

  const armed = await armPendingRecord({ ...STOP_PAYLOAD, session_id: SESSION_ID }, {
    env: sandbox.env,
    pid: 41,
    processTable: '41 60\n60 100\n100 1\n',
    spawn: () => assert.fail('no killer may start'),
    write: (line) => notices.push(line),
  });

  assert.equal(armed, null);
  const { deferredAt, ...stored } = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(typeof deferredAt, 'string');
  assert.deepEqual(stored, record);
  assert.equal(notices.length, 1);
  assert.match(JSON.parse(notices[0]).systemMessage, /carried no transcript path/);
});

test('Stop marks the record deferred and says why when arming throws', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = '100';
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID);
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const { armPendingRecord } = await import(pathToFileURL(STOP_ARM_PATH).href);
  const notices = [];

  // A cwd that cannot be written as JSON makes the arm throw after the target resolved.
  const armed = await armPendingRecord({
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
    cwd: 1n,
  }, {
    env: sandbox.env,
    pid: 41,
    processTable: '41 60\n60 100\n100 1\n',
    spawn: () => assert.fail('no killer may start'),
    write: (line) => notices.push(line),
  });

  assert.equal(armed, null);
  const { deferredAt, ...stored } = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(typeof deferredAt, 'string');
  assert.deepEqual(stored, record);
  assert.match(JSON.parse(notices[0]).systemMessage, /arming the record failed/);
});
```


VERIFY: run `node --test .skilled/hooks/session-handover/tests/codex-adapters.test.cjs` from Root and report the `tests`, `pass` and `fail` lines.
