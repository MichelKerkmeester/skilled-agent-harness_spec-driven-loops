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

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): add one shared function to the nudge module that delivers a nudge decision once when two hooks race: it claims the session's nudge with a claim file, decides again under the claim, and writes the level. Nothing calls it yet; later briefs switch the callers.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
P = Root/.skilled/hooks/session-handover/lib/nudge.cjs
T = Root/.skilled/hooks/session-handover/tests/nudge.test.cjs

1. In P, directly after the closing `}` of `function writeState(sessionId, level, env = process.env) {`, add:

```

// Two hooks can decide on one nudge at once: Vibe runs tool calls side by side, and Claude and
// Codex run a hook per tool call in a parallel batch and a prompt hook beside a tool hook. Only
// the hook that creates the claim file delivers, and it decides again under the claim, because a
// hook that delivered first has already written its level. A claim older than this bound was
// left by a hook that died and is taken over. Two hooks that both find the same stale claim can,
// rarely, both hold one; the cost is one repeated nudge.
const NUDGE_CLAIM_STALE_MS = 10000;

function claimNudge(sessionId, env) {
  let claimPath;
  try {
    if (!validSessionId(sessionId)) return { release() {} };
    core.ensureStateDir(env);
    claimPath = path.join(core.stateDir(env), `nudge-${sessionId}.claim`);
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

/**
 * Deliver a nudge decision once when hooks race: claim the session's nudge, decide again under
 * the claim and write the level that second decision returns.
 *
 * @param {Object} options - The inputs `nudgeDecision` takes.
 * @returns {{nudge: boolean, level: number, reason: string}|null} The decision to deliver, or
 * null when another hook holds the claim or the second decision no longer nudges.
 */
function commitNudge(options = {}) {
  const env = options.env ?? process.env;
  const claim = claimNudge(options.sessionId, env);
  if (claim === null) return null;
  try {
    // Through the export, so a test can stand in for the decision a racing hook made.
    const confirmed = module.exports.nudgeDecision(options);
    if (!confirmed.nudge) return null;
    writeState(options.sessionId, confirmed.level, env);
    return confirmed;
  } finally {
    claim.release();
  }
}
```

2. In P, in the `module.exports = {` object, add `  commitNudge,` on its own line directly after `  writeState,`.

3. In T, add `commitNudge,` to the names destructured from `require('../lib/nudge.cjs')` near the top of the file (wherever `writeState` is destructured; if `writeState` is not in that list, use `nudgeModule.commitNudge` in the tests below instead).

4. In T, directly after the closing `});` of the test titled `'nudge state round-trips in the isolated runtime directory'`, add:

```

test('commitNudge stays quiet while another hook holds the claim and takes over a stale one', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-handover-nudge-'));
  const env = { ...withoutRelaunchSwitches(process.env), XDG_RUNTIME_DIR: root };
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const options = { ratio: 0.81, threshold: 0.8, sessionId: SESSION_ID, env };
  core.ensureStateDir(env);
  const claimPath = path.join(core.stateDir(env), `nudge-${SESSION_ID}.claim`);

  fs.writeFileSync(claimPath, '');
  assert.equal(commitNudge(options), null);
  assert.equal(readState(SESSION_ID, env), 0);

  const old = new Date(Date.now() - 60000);
  fs.utimesSync(claimPath, old, old);
  assert.equal(commitNudge(options)?.nudge, true);
  assert.equal(readState(SESSION_ID, env), 1);
  assert.equal(fs.existsSync(claimPath), false);
});

test('commitNudge delivers a level once when a second hook decided before the first wrote it', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-handover-nudge-'));
  const env = { ...withoutRelaunchSwitches(process.env), XDG_RUNTIME_DIR: root };
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const options = { ratio: 0.81, threshold: 0.8, sessionId: SESSION_ID, env };

  // Both hooks saw a nudge before either wrote its level, then each commits in turn.
  assert.equal(nudgeModule.nudgeDecision(options).nudge, true);
  assert.equal(nudgeModule.nudgeDecision(options).nudge, true);
  assert.equal(commitNudge(options)?.level, 1);
  assert.equal(commitNudge(options), null);
  assert.equal(readState(SESSION_ID, env), 1);
});
```

If `core` or `readState` is not already available in T under those names, use whatever name T already uses for `require('../lib/relaunch-core.cjs')` and for the nudge module's `readState`. Do not change any other test in T.

VERIFY: run `node --test .skilled/hooks/session-handover/tests/nudge.test.cjs` from Root and report the `tests`, `pass` and `fail` lines.
