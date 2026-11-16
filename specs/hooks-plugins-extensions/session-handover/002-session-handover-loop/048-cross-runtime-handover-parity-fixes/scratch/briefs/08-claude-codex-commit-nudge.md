REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/003-nudge-parity-and-hop-scoring

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the four files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): make the Claude and Codex nudge hooks deliver through the shared `nudge.commitNudge`, which already exists in `lib/nudge.cjs`, so two hooks that run at once deliver one nudge. Today each hook writes the level with no claim.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
C = Root/.skilled/hooks/session-handover/claude/context-nudge.mjs
X = Root/.skilled/hooks/session-handover/codex/shared.mjs
CT = Root/.skilled/hooks/session-handover/tests/claude-adapters.test.cjs
XT = Root/.skilled/hooks/session-handover/tests/codex-adapters.test.cjs

1. In C and in X, replace exactly this block (it appears once in each file):

```
  const notePath = nudge.plannedNotePath({ cwd: payload.cwd, sessionId });
  try {
    nudge.writeState(sessionId, decision.level);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message });
  }
```

with:

```
  const notePath = nudge.plannedNotePath({ cwd: payload.cwd, sessionId });
  // A hook running beside this one may be delivering the same nudge, so only the hook that
  // holds the session's nudge claim delivers it, after deciding again under that claim.
  let committed;
  try {
    committed = nudge.commitNudge({
      ratio,
      threshold: nudge.relaunchThreshold(config),
      sessionId,
    });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message });
    committed = decision;
  }
  if (committed === null) return quiet();
```

2. In CT, directly after the closing `});` of the test titled `'context-nudge fires at 0.80, suppresses the same level, and fires again at +0.05'`, add:

```

test('context-nudge stays quiet while another hook holds the session nudge claim', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  const payload = {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: writeTranscript(sandbox, 800),
    cwd: sandbox.repoRoot,
  };
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  const claimPath = path.join(stateDir, `nudge-${SESSION_ID}.claim`);
  fs.writeFileSync(claimPath, '');

  const held = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(held.code, 0, held.stderr);
  assert.equal(held.stdout, '');

  fs.rmSync(claimPath);
  const delivered = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(delivered.code, 0, delivered.stderr);
  assert.match(
    JSON.parse(delivered.stdout.trim()).hookSpecificOutput.additionalContext,
    /prepare --handoff/,
  );
});
```

3. In XT, directly after the closing `});` of the test titled `'context-nudge fires at threshold once and again at threshold plus 0.05'`, add:

```

test('context-nudge stays quiet while another hook holds the session nudge claim', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'codex-nudge-loop-0001';
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = '1000';
  const payload = {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 800),
    cwd: sandbox.repoRoot,
  };
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  const claimPath = path.join(stateDir, `nudge-${SESSION_ID}.claim`);
  fs.writeFileSync(claimPath, '');

  const held = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(held.code, 0, held.stderr);
  assert.equal(held.stdout, '');

  fs.rmSync(claimPath);
  const delivered = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(delivered.code, 0, delivered.stderr);
  assert.match(
    JSON.parse(delivered.stdout.trim()).hookSpecificOutput.additionalContext,
    /prepare --handoff/,
  );
});
```

Do not change any other test in CT or XT.

VERIFY: your own environment carries `AI_SESSION_CHILD=1`, which makes every nudge stay quiet, so run the suites without it. From Root run
`env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/claude-adapters.test.cjs .skilled/hooks/session-handover/tests/codex-adapters.test.cjs`
and report the `tests`, `pass` and `fail` lines.
