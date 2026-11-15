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

RULES: Edit only the three files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file.

TASK (one change): after `prepare`, a Vibe session that the turn-end hook can arm must be told to stop, not that nothing ends it.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening

1. In `Root/.skilled/hooks/session-handover/lib/relaunch-core.cjs`, add `vibeSessionFolder,` to the `module.exports = {` object, on the line before `mintHandoverLocator,`.

2. In `Root/.skilled/hooks/session-handover/bin/session-handover.cjs`, near line 609, replace these lines:

```
  // left. Cursor, Devin and Vibe have no relaunch hook, so their session ends by hand.
  const prepared = runtime === 'cursor' || runtime === 'devin' || runtime === 'vibe'
```

with:

```
  // left. Cursor and Devin have no relaunch hook, so their session ends by hand. A Vibe
  // session is armed at turn end only when its id names a real Vibe session folder; a
  // made-up id, such as one from a typed hand-over, still ends by hand.
  const manualVibe = runtime === 'vibe' && core.vibeSessionFolder(sessionId, process.env) === null;
  const prepared = runtime === 'cursor' || runtime === 'devin' || manualVibe
```

Keep the rest of that statement unchanged. If `sessionId` is not the variable name in scope there, use the name the `appendLog('prepare', ...)` call above it uses.

3. In `Root/.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`, directly after the test named `manual route for a cursor or devin session`, add this test:

```
test('a vibe session with a session folder is told to stop, a made-up id is told to end by hand', (t) => {
  const outputs = [];

  for (const withFolder of [true, false]) {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
    sandbox.env.SKILLED_LOOP_RUNTIME = 'vibe';
    sandbox.env.CLAUDE_PID = String(process.pid);
    if (withFolder) writeVibeSession(sandbox, SESSION_ID, { cwd: sandbox.root });
    else sandbox.env.VIBE_HOME = path.join(sandbox.root, 'vibe-home');
    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--session', SESSION_ID]);

    assert.equal(result.status, 0, result.stderr);
    outputs.push(result.stdout);
  }

  assert.match(outputs[0], /stop now and end this turn/);
  assert.equal(
    outputs[1],
    '[session-handover] handoff prepared; nothing ends this session. '
      + 'Exit it and run the claim command the wrapper prints.\n',
  );
});
```

`writeVibeSession` is a function declaration later in the same file, so it is in scope.

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test --test-name-pattern="vibe session with a session folder|manual route for a cursor" .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs

If it fails, read the failure, fix your edit, and run it again (at most three times).

HANDBACK: list the files you changed, the verify command output tail with its exit status, and anything you could not do. Do not claim success without the command output.
