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

TASK (one change): when the OpenCode plugin finds this session's pending record at `session.idle` but arming it throws, mark the record deferred and log it, and let the next user message withdraw a deferred record as well as an armed one. Claude already behaves this way.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
P = Root/.opencode/plugins/session-handover.js
T = Root/.opencode/plugins/tests/session-handover.test.cjs

1. In P, directly after the closing `}` of `function logSpawnError(loopId, error) {`, add:

```

// An idle that cannot arm this session's pending record marks it, so the next user message
// withdraws it. Left unmarked, the record would wait for a later idle and relaunch from a note
// that predates the work done since.
function markParked(loopId, error) {
  logEvent('session-idle-arm-error', {
    stage: 'arm',
    loopId,
    message: error?.message || 'arm failed',
  });
  try {
    core.markDeferred({ loopId, env: process.env });
  } catch (deferError) {
    logEvent('session-idle-arm-error', {
      stage: 'defer',
      loopId,
      message: deferError?.message || 'defer failed',
    });
  }
}
```

2. In P, inside `function armOnIdle(sessionID) {`, replace

```
    const armed = core.arm({ loopId, cwd: directory, env: process.env });
    if (armed?.status !== 'armed') return;
```

with

```
    let armed;
    try {
      armed = core.arm({ loopId, cwd: directory, env: process.env });
    } catch (error) {
      markParked(loopId, error);
      return;
    }
    if (armed?.status !== 'armed') return;
```

3. In P, inside `function withdrawArmForUserMessage(loopId, sessionID) {`, delete the one line `      pending: 'none',`. Leave the other arguments as they are. The helper's default policy then withdraws a pending record only when a failed arm marked it deferred, so a prepared record that has not reached its idle yet is still left alone.

4. In P, in the comment directly above `function withdrawArmForUserMessage(loopId, sessionID) {`, replace the line

```
// the arm is withdrawn here, before its fixed idle wait ends and it signals a relaunch.
```

with

```
// the arm is withdrawn here, before its fixed idle wait ends and it signals a relaunch. A
// record an idle could not arm is withdrawn here too, rather than armed by a later idle.
```

5. In T, find the test titled `'a user message before the arm does not disarm'`. Directly after its closing `});`, add:

```

test('session.idle marks the pending record deferred when arming throws', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  const loopId = 'opencode-arm-throws-0001';
  const sessionID = 'ses-arm-throws-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  t.mock.method(core, 'arm', () => {
    throw new Error('arm failed on purpose');
  });

  await hooks.event({ event: { type: 'session.idle', properties: { sessionID } } });

  const record = core.readRelaunchFile(loopId, process.env);
  assert.equal(record.status, 'pending');
  assert.equal(typeof record.deferredAt, 'string');
  const log = fs.readFileSync(path.join(root, 'skilled-relaunch', 'relaunch.log'), 'utf8');
  assert.match(log, /session-idle-arm-error stage=arm/);
});

test('a new user message withdraws a pending record a failed arm deferred', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  const loopId = 'opencode-loop-deferred-0001';
  const sessionID = 'ses-deferred-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  core.markDeferred({ loopId, env: process.env });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-after-failed-arm', role: 'user' } },
  } });

  const record = core.readRelaunchFile(loopId, process.env);
  assert.equal(record.status, 'disarmed');
  assert.equal(record.disarmReason, 'user-message');
});
```

If the first new test still sees `status: 'armed'` because the plugin holds its own copy of the core module, do not change P to work around it: report that exactly.

Do not change any other test in T.

VERIFY: run `node --test .opencode/plugins/tests/session-handover.test.cjs` from Root and report the `tests`, `pass` and `fail` lines. The suite had 73 passing tests before this change.
