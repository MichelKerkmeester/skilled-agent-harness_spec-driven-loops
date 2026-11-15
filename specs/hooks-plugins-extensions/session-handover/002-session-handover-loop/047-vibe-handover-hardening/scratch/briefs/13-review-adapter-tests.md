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

RULES: Edit only the three files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change, test coverage and two comments): add the adapter tests a reviewer found missing, and state two known limits in comments. Do not change any code behavior.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
B = Root/.skilled/hooks/session-handover/bin/session-handover.cjs
T = Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

1. In P, in the comment directly above `const NUDGE_CLAIM_STALE_MS = 10000;`, append these lines at the end of that comment:

```
// Two hooks that both find the same stale claim can, rarely, both end up holding one; the
// cost is one repeated nudge, which is what this claim exists to prevent in the common case.
```

2. In B, in the comment directly above `const manualVibe = runtime === 'vibe' && core.vibeSessionFolder(sessionId, process.env) === null;`, append:

```
  // The folder check reads Vibe's default session log location, so a setup that moves
  // session_logging.save_dir is still armed at turn end but is told here to end by hand.
```

3. In T, add at the end of the file these three tests:

```

test('a hook whose decision predates another hook\'s nudge decides again under the claim', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(820)]);
  const { buildHandoverContextPart } = await loadParts();
  const postTool = () => buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool'),
    { env: sandbox.env },
  );

  assert.ok((await postTool()).includes('prepare --handoff'));
  assert.equal(nudge.readState(SESSION_ID, sandbox.env), 1);

  // The second hook made its first decision before the first hook wrote its level.
  const realDecision = nudge.nudgeDecision;
  let calls = 0;
  nudge.nudgeDecision = (options) => {
    calls += 1;
    return calls === 1 ? { nudge: true, level: 1, reason: 'threshold' } : realDecision(options);
  };
  t.after(() => { nudge.nudgeDecision = realDecision; });

  assert.equal(await postTool(), '');
  assert.equal(calls, 2);
});

test('a turn end with no transcript path marks the record deferred', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  const { armHandoverTurnEnd } = await loadParts();

  await armHandoverTurnEnd(
    payloadFor(sandbox, sessionRoot, 'post_agent', { transcript_path: '' }),
    { env: sandbox.env, pid: HOOK_PID, processTable: PROCESS_TABLE, spawn: recordSpawns([]) },
  );
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'pending');
  assert.ok(stored.deferredAt, 'the record carries a deferred mark');
});

test('a turn end whose session has no journal segment marks the record deferred', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const emptyRoot = path.join(sandbox.root, 'empty-vibe-session');
  fs.mkdirSync(path.join(emptyRoot, 'journal'), { recursive: true });
  const { armHandoverTurnEnd } = await loadParts();

  await armHandoverTurnEnd(
    payloadFor(sandbox, emptyRoot, 'post_agent'),
    { env: sandbox.env, pid: HOOK_PID, processTable: PROCESS_TABLE, spawn: recordSpawns([]) },
  );
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'pending');
  assert.ok(stored.deferredAt, 'the record carries a deferred mark');
});
```

If `sandbox.root` is not a property the test file's `createSandbox` returns, read `createSandbox` and use the temp root it does return.

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If a test fails, read the failure, fix the test setup (not the assertions or the code under test), and run it again (at most three times). If an assertion itself cannot hold, stop and report why.

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
