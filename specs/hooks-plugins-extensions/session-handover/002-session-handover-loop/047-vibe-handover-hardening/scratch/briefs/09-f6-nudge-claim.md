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

TASK (one change): Vibe runs tool calls side by side, so two `post_tool` hooks can both decide to deliver the same hand-over nudge. Make delivery claim a file first, so only one hook delivers.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
T = Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

1. In P, in the import block from `'../lib/relaunch-core.cjs'`, add `ensureStateDir,` (alphabetical position, after `armableRecord,`) and `stateDir,` (after `readRelaunchFile,`).

2. In P, directly above the JSDoc of `async function buildHandoverContextPart(`, add:

```
// Vibe runs tool calls side by side, so two post_tool hooks can decide on the same nudge at
// once. Only the hook that creates the claim file delivers. A claim older than this was left
// by a hook that died, and is taken over.
const NUDGE_CLAIM_STALE_MS = 10000;

function claimNudge(sessionId, env) {
  let claimPath;
  try {
    ensureStateDir(env);
    claimPath = path.join(stateDir(env), `nudge-${sessionId}.claim`);
  } catch {
    // Without a state directory there is no stored level to race on either.
    return { release() {} };
  }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      fs.closeSync(fs.openSync(claimPath, 'wx', 0o600));
      return {
        release() {
          try {
            fs.rmSync(claimPath, { force: true });
          } catch {}
        },
      };
    } catch (error) {
      if (error.code !== 'EEXIST') return { release() {} };
      try {
        if (Date.now() - fs.statSync(claimPath).mtimeMs <= NUDGE_CLAIM_STALE_MS) return null;
        fs.rmSync(claimPath, { force: true });
      } catch {
        return null;
      }
    }
  }
  return null;
}

```

3. In P, inside `buildHandoverContextPart`, replace exactly this block:

```
  try {
    nudge.writeState(sessionId, decision.level, env);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message }, env);
  }
```

with:

```
  const claim = claimNudge(sessionId, env);
  if (claim === null) return '';
  try {
    // Decide again under the claim: a hook that delivered first has already written its level.
    const confirmed = nudge.nudgeDecision({
      ratio,
      threshold: nudge.relaunchThreshold(config, env),
      sessionId,
      env,
    });
    if (!confirmed.nudge) return '';
    nudge.writeState(sessionId, confirmed.level, env);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message }, env);
  } finally {
    claim.release();
  }
```

4. In T, add at the end of the file:

```

test('a nudge another hook is delivering stays quiet, and a stale claim is taken over', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  const claimPath = path.join(stateDir, `nudge-${SESSION_ID}.claim`);
  const { buildHandoverContextPart } = await loadParts();
  const postTool = () => buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool'),
    { env: sandbox.env },
  );

  fs.writeFileSync(claimPath, '');
  assert.equal(await postTool(), '');
  assert.equal(nudge.readState(SESSION_ID, sandbox.env), 0);

  const old = new Date(Date.now() - 60000);
  fs.utimesSync(claimPath, old, old);
  const text = await postTool();
  assert.ok(text.includes('prepare --handoff'), text);
  assert.equal(fs.existsSync(claimPath), false);
  assert.equal(await postTool(), '');
});
```

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If a test fails, read the failure, fix your edit (not the assertions), and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
