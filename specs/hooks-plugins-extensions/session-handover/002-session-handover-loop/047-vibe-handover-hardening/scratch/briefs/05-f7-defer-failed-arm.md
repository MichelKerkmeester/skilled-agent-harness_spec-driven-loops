REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/047-vibe-handover-hardening

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): when the Vibe turn-end arm fails after finding this session's pending record, mark that record deferred, so the operator's next prompt withdraws it instead of a later turn end arming a note that predates the newer work. Claude's stop hook already does this.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
T = Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

1. In P, in the import block from `'../lib/relaunch-core.cjs'`, add `markDeferred,` after `findLoopChildPid,`.

2. In P, directly above the JSDoc of `async function armHandoverTurnEnd(`, add:

```
// A turn end that finds this session's pending record but cannot arm it marks the record,
// so the operator's next prompt withdraws it. Left unmarked, the record would wait for a
// later turn end and relaunch from a note that predates the work done since.
function markParked(loopId, env) {
  try {
    markDeferred({ loopId, env });
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'defer', loopId, message: error.message }, env);
  }
}

```

3. In P, inside `armHandoverTurnEnd`, replace

```
    if (!armableRecord(record, { loopId, sessionId, runtime: 'vibe', env }).armable) {
      return null;
    }
```

with

```
    const verdict = armableRecord(record, { loopId, sessionId, runtime: 'vibe', env });
    if (!verdict.armable) {
      if (record && record.sessionId === sessionId) {
        logEvent('stop-arm-refused', { loopId, sessionId, reason: verdict.reason }, env);
      }
      return null;
    }
```

4. In P, inside `armHandoverTurnEnd`, after that check, every branch that logs and then does `return null;` (the two `missing-transcript-path` branches, the `stage: 'journal'` catch, the `stage: 'target-pid'` branch and the `stage: 'arm'` catch) gets `markParked(loopId, env);` on the line directly before its `return null;`. Do not add it anywhere else.

5. In P, in `function withdrawOnOperatorPrompt(sessionId, env)`, change `pending: 'none',` to `pending: 'deferred',`.

6. In T, directly after the test named `turn end arms the record and spawns the killer on the newest journal file`, add:

```

test('a turn end that cannot arm marks the record deferred and the next prompt withdraws it', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);

  const spawns = [];
  const { armHandoverTurnEnd, buildHandoverContextPart } = await loadParts();
  await armHandoverTurnEnd(
    payloadFor(sandbox, sessionRoot, 'post_agent'),
    {
      env: sandbox.env,
      pid: HOOK_PID,
      processTable: '41 50\n50 1\n',
      spawn: recordSpawns(spawns),
    },
  );

  assert.equal(spawns.length, 0);
  const parked = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(parked.status, 'pending');
  assert.ok(parked.deferredAt, 'the record carries a deferred mark');

  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  assert.equal(text, nudge.WITHDRAWN_NOTICE);
  const withdrawn = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(withdrawn.status, 'disarmed');
});

test('a pending record without a deferred mark survives the next prompt', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);

  const { buildHandoverContextPart } = await loadParts();
  await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'pending');
});
```

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If a test fails, read the failure, fix your edit (not the assertions), and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
