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

TASK (one change): a forked or rewound Vibe main session carries a `parent_session_id`, so the adapter mistakes it for a subagent and goes silent. The `pre_agent` and `post_agent` hooks are registered with `match = "main"`, which Vibe applies to root sessions and forks and never to subagents, so only the unscoped `post_tool` path still needs the parent check.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
T = Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

1. In P, directly above `function isSubagent(payload) {`, add this comment line:

```
// Only the unscoped post_tool hook needs this check: pre_agent and post_agent are registered
// for the main alias, which Vibe gives root sessions and forks, so there a parent id marks a
// fork or a rewind of the operator's own session, not a subagent.
```

2. In P, inside `buildHandoverContextPart`, change `if (isSubagent(payload)) return '';` to:

```
  if (eventName === 'post_tool' && isSubagent(payload)) return '';
```

3. In P, inside `withdrawBeforeTurnStart`, delete the line `if (isSubagent(payload)) return false;`.

4. In P, inside `armHandoverTurnEnd`, delete the line `if (isSubagent(payload)) return null;`.

5. In T, replace the whole test named `a subagent payload neither nudges nor arms` (from its `test(` line through its closing `});`) with:

```
test('a subagent post_tool payload never nudges', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart } = await loadParts();

  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool', { parent_session_id: 'parent-session' }),
    { env: sandbox.env },
  );
  assert.equal(text, '');
});

test('a forked main session still nudges at turn start and arms at turn end', async (t) => {
  const nudgeBox = createSandbox(t);
  nudgeBox.env.SKILLED_LOOP_ID = LOOP_ID;
  nudgeBox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  nudgeBox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const nudgeRoot = createVibeSession(t, nudgeBox);
  writeVibeSegment(nudgeRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart, armHandoverTurnEnd } = await loadParts();

  const text = await buildHandoverContextPart(
    payloadFor(nudgeBox, nudgeRoot, 'pre_agent', {
      prompt: 'Continue the current task',
      parent_session_id: 'parent-session',
    }),
    { env: nudgeBox.env },
  );
  assert.ok(text.includes('prepare --handoff'), text);

  const armBox = createSandbox(t);
  armBox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(armBox, LOOP_ID, SESSION_ID);
  const armRoot = createVibeSession(t, armBox);
  writeVibeSegment(armRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);
  const spawns = [];
  await armHandoverTurnEnd(
    payloadFor(armBox, armRoot, 'post_agent', { parent_session_id: 'parent-session' }),
    { env: armBox.env, pid: HOOK_PID, processTable: PROCESS_TABLE, spawn: recordSpawns(spawns) },
  );
  assert.equal(spawns.length, 1);
  assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'armed');
});
```

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If a test fails, read the failure, fix your edit (not the assertions), and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
