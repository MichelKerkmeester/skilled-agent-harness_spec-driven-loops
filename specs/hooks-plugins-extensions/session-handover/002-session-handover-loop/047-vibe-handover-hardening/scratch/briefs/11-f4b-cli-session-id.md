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

TASK (one change): a Vibe session in `skilled-loop` can learn its own session id from the CLI, and `prepare` and `claim` fall back to that id when `--session` is omitted. The turn-start hook already records the id; `core.readVibeSessionId({ loopId, env })` in `lib/relaunch-core.cjs` reads it and returns null when there is none.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
B = Root/.skilled/hooks/session-handover/bin/session-handover.cjs
T = Root/.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs
D = Root/.skilled/commands/speckit/handoff.md

1. In B, replace the whole function

```
function sessionIdFor(options, runtime) {
  const sessionId = options['--session']
    || (runtime === 'claude' ? process.env.CLAUDE_CODE_SESSION_ID : undefined);
  if (!sessionId) {
    const sessionSource = runtime === 'claude'
      ? '--session or CLAUDE_CODE_SESSION_ID'
      : '--session';
    throw new Error(`session id is required through ${sessionSource}`);
  }
  return sessionId;
}
```

with

```
// Vibe gives its tools no session id, so inside the loop the id comes from what the turn-start
// hook last recorded for this loop.
function loopVibeSessionId() {
  const loopId = process.env.SKILLED_LOOP_ID;
  if (!loopId) return undefined;
  return core.readVibeSessionId({ loopId, env: process.env }) ?? undefined;
}

function sessionIdFor(options, runtime) {
  const sessionId = options['--session']
    || (runtime === 'claude' ? process.env.CLAUDE_CODE_SESSION_ID : undefined)
    || (runtime === 'vibe' ? loopVibeSessionId() : undefined);
  if (!sessionId) {
    let sessionSource = '--session';
    if (runtime === 'claude') sessionSource = '--session or CLAUDE_CODE_SESSION_ID';
    if (runtime === 'vibe') sessionSource = '--session, or a Vibe session started by skilled-loop';
    throw new Error(`session id is required through ${sessionSource}`);
  }
  return sessionId;
}
```

2. In B, in the `SUBCOMMANDS` object, directly before the `window: {` entry, add:

```
  'session-id': {
    syntax: 'session-id [--runtime <runtime>]',
    summary: 'Print the session id prepare and claim use when --session is omitted: the Claude Code'
      + ' session, or the Vibe session skilled-loop last saw.',
  },
```

3. In B, directly above `function window(args) {`, add:

```
function sessionId(args) {
  const { options } = parseArgs(args, { flags: ['--runtime'] });
  const runtime = options['--runtime'] ?? (process.env.SKILLED_LOOP_RUNTIME || 'claude');
  process.stdout.write(`${sessionIdFor({}, runtime)}\n`);
  return 0;
}

```

4. In B, in the `switch` inside `main`, directly before `case 'window': return window(commandArgs);`, add:

```
      case 'session-id': return sessionId(commandArgs);
```

5. In D, replace the sentence

`If a runtime has no session-id variable, such as Devin, Cursor or Vibe, run `uuidgen` once and reuse that id for the session.`

with

`A Vibe session started through `skilled-loop` gets its id from `node .skilled/hooks/session-handover/bin/session-handover.cjs session-id --runtime vibe`. If a runtime has no session-id variable, such as Devin, Cursor or a Vibe session outside the loop, run `uuidgen` once and reuse that id for the session.`

and in D replace

`If a runtime exposes no session-id variable, such as Devin, Cursor or Vibe, run `uuidgen` once and reuse that value for the rest of the session.`

with

`A Vibe session started through `skilled-loop` prints its id with `node .skilled/hooks/session-handover/bin/session-handover.cjs session-id --runtime vibe`. If a runtime exposes no session-id variable, such as Devin, Cursor or a Vibe session outside the loop, run `uuidgen` once and reuse that value for the rest of the session.`

6. In T, add at the end of the file:

```

test('session-id prints the Vibe session the loop recorded and refuses when there is none', (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'vibe';

  const missing = runCli(sandbox, ['session-id']);
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /a Vibe session started by skilled-loop/);

  core.recordVibeSessionId({ loopId: LOOP_ID, sessionId: SESSION_ID, env: sandbox.env });
  const found = runCli(sandbox, ['session-id']);
  assert.equal(found.status, 0, found.stderr);
  assert.equal(found.stdout, `${SESSION_ID}\n`);
});

test('prepare on Vibe without --session uses the id the loop recorded', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'vibe';
  sandbox.env.CLAUDE_PID = String(process.pid);

  const refused = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  assert.notEqual(refused.status, 0);

  core.recordVibeSessionId({ loopId: LOOP_ID, sessionId: SESSION_ID, env: sandbox.env });
  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  assert.equal(result.status, 0, result.stderr);
  const record = JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8'));
  assert.equal(record.sessionId, SESSION_ID);
});
```

VERIFY: run both from Root and paste the last 12 lines of each output with its exit status:

  node --test --test-name-pattern="session-id|without --session|session id is required|manual route" .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs
  node .skilled/hooks/session-handover/bin/session-handover.cjs --help

If a test fails, read the failure, fix your edit (not the assertions), and run it again (at most three times).

HANDBACK: list the files you changed, both verify output tails with exit status, and anything you could not do. Do not claim success without the command output.
