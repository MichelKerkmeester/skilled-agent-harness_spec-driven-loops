REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/001-pi-opencode-history-lookup

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the one file named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Touch nothing else.

TASK (one change): let the hand-over locator mint cover Pi and OpenCode senders. Those runtimes keep no transcript file, so the mint asks the same shared reader the lookup command uses, with the same folder, and mints only when that reader finds the session.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
P = Root/.skilled/hooks/session-handover/lib/relaunch-core.cjs

1. In P, directly above the line `const HISTORY_RUNTIME_DIST = path.resolve(`, add:

```
// Pi and OpenCode keep no transcript file a handle could name. The lookup reads each through its
// shared reader with the folder the session ran in and digests the session identity alone, so
// the mint asks that same reader with that same folder and mints only when it finds the session.
const SESSION_READERS_DIR = path.resolve(__dirname, '..', '..', 'shared', 'session-readers');

function readerFindsSession(runtime, sessionId, projectDir) {
  const load = runtime === 'pi'
    ? require(path.join(SESSION_READERS_DIR, 'pi.mjs')).loadPiSession
    : require(path.join(SESSION_READERS_DIR, 'opencode.mjs')).loadOpenCodeSession;
  const result = load({ sessionId, projectDir, home: os.homedir(), env: process.env });
  return result?.ok === true && result.source?.sessionId === sessionId;
}

```

2. In P, inside `function mintHandoverLocator(`, replace exactly this block:

```
    const transcriptPath = runtime === 'claude'
      ? claudeSessionLogPath(sessionId, process.env)
      : runtime === 'codex'
        ? codexRolloutPath(sessionId, process.env)
        : runtime === 'vibe'
          ? vibeSessionFolder(sessionId, process.env)
          : null;
    if (transcriptPath === null) return null;
    const placement = offer.placeLookup(cwd);
    if (placement === null) return null;
    // The transcript is found by session id across every project, so a note could name
    // another project's session. The folder the transcript itself records must sit in the
    // same checkout as the folder the note names.
    const recordedFolder = runtime === 'vibe'
      ? vibeWorkingFolder(transcriptPath, sessionId)
      : transcriptWorkingFolder(transcriptPath);
    if (recordedFolder === null) return null;
    const recordedPlacement = offer.placeLookup(recordedFolder);
    if (
      recordedPlacement === null
      || !sameCheckout(recordedPlacement.workspace, placement.workspace)
    ) {
      return null;
    }
```

with:

```
    const readsBySession = runtime === 'pi' || runtime === 'opencode';
    const transcriptPath = runtime === 'claude'
      ? claudeSessionLogPath(sessionId, process.env)
      : runtime === 'codex'
        ? codexRolloutPath(sessionId, process.env)
        : runtime === 'vibe'
          ? vibeSessionFolder(sessionId, process.env)
          : null;
    if (!readsBySession && transcriptPath === null) return null;
    const placement = offer.placeLookup(cwd);
    if (placement === null) return null;
    if (readsBySession) {
      // The reader only finds a session whose recorded folder is the one it is given, so a
      // session from another checkout is refused here as the lookup would refuse it.
      const projectDir = placement.sessionDirectory ?? placement.workspace;
      if (!readerFindsSession(runtime, sessionId, projectDir)) return null;
    } else {
      // The transcript is found by session id across every project, so a note could name
      // another project's session. The folder the transcript itself records must sit in the
      // same checkout as the folder the note names.
      const recordedFolder = runtime === 'vibe'
        ? vibeWorkingFolder(transcriptPath, sessionId)
        : transcriptWorkingFolder(transcriptPath);
      if (recordedFolder === null) return null;
      const recordedPlacement = offer.placeLookup(recordedFolder);
      if (
        recordedPlacement === null
        || !sameCheckout(recordedPlacement.workspace, placement.workspace)
      ) {
        return null;
      }
    }
```

Leave every other line of P unchanged. The later line `handle: digest.historyHandle(identity, transcriptPath),` stays as it is: for Pi and OpenCode `transcriptPath` is null, which is the digest the lookup recomputes.

VERIFY: run `node -e "require('./.skilled/hooks/session-handover/lib/relaunch-core.cjs')"` from Root (it must print nothing and exit 0), then run `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` from Root and report the `tests`, `pass` and `fail` lines.
