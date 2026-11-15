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

TASK (one change): Vibe gives its tools no session id, so a hand-over the operator types cannot name the session. The turn-start hook sees the real id on every prompt. Make it record that id for its loop in the relaunch state folder, and add the core helpers that write and read it.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
C = Root/.skilled/hooks/session-handover/lib/relaunch-core.cjs
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
T = Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

1. In C, directly above the line `module.exports = {`, add:

```
function vibeSessionIdPath(loopId, env) {
  if (!validLoopId(loopId)) {
    throw new Error(
      'loopId must contain only letters, numbers, dots, underscores, or hyphens',
    );
  }
  return path.join(stateDir(env), `vibe-session-${loopId}`);
}

/**
 * Record the Vibe session id the loop's turn-start hook last saw. Vibe gives its tools no
 * session id, so this is how a hand-over typed by the operator learns it.
 *
 * @param {Object} options - Inputs.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {string} options.sessionId - The Vibe session id from the hook payload.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 */
function recordVibeSessionId({ loopId, sessionId, env = process.env }) {
  const filePath = vibeSessionIdPath(loopId, env);
  ensureStateDir(env);
  atomicWriteFile(filePath, `${sessionId}\n`);
}

/**
 * Read the Vibe session id the loop's turn-start hook last recorded.
 *
 * @param {Object} options - Inputs.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @returns {string|null} The id, or null when none is recorded or it is malformed.
 */
function readVibeSessionId({ loopId, env = process.env }) {
  try {
    const value = fs.readFileSync(vibeSessionIdPath(loopId, env), 'utf8').trim();
    return /^[A-Za-z0-9._-]+$/.test(value) ? value : null;
  } catch {
    return null;
  }
}

```

2. In C, inside `module.exports = {`, add `recordVibeSessionId,` and `readVibeSessionId,` on two lines directly after `vibeSessionFolder,`.

3. In P, in the import block from `'../lib/relaunch-core.cjs'`, add `recordVibeSessionId,` after `readRelaunchFile,` (keep any other names already there).

4. In P, directly above the line `const earlyWithdrawn = new Set();` and its comment, add:

```
// Vibe gives its tools no session id, so a hand-over the operator types cannot name the
// session. The turn-start hook sees it on every prompt and leaves it where the CLI reads it.
function rememberSessionId(sessionId, env) {
  const loopId = env.SKILLED_LOOP_ID;
  if (!loopId) return;
  try {
    recordVibeSessionId({ loopId, sessionId, env });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'session-id', message: error.message }, env);
  }
}

```

5. In P, inside `function withdrawBeforeTurnStart(payload, dependencies = {})`, directly after the line `if (!nudge.validSessionId(sessionId)) return false;`, add:

```
  rememberSessionId(sessionId, env);
```

6. In T, add at the end of the file:

```

test('the turn-start step records the session id for its loop', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);
  const { withdrawBeforeTurnStart } = await loadParts();

  assert.equal(core.readVibeSessionId({ loopId: LOOP_ID, env: sandbox.env }), null);
  withdrawBeforeTurnStart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  assert.equal(core.readVibeSessionId({ loopId: LOOP_ID, env: sandbox.env }), SESSION_ID);
  assert.equal(core.readVibeSessionId({ loopId: 'another-loop', env: sandbox.env }), null);
});
```

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If a test fails, read the failure, fix your edit (not the assertions), and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
