REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/413-vibe-history-locator
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/046-vibe-history-locator

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when the file is changed on disk and the verification command has run.

ROLE
You are the code agent. Change one file: `.skilled/hooks/session-handover/lib/relaunch-core.cjs`.

CONTEXT
`mintHandoverLocator` (about line 907) picks the sender's transcript with
`runtime === 'claude'` or `runtime === 'codex'` and returns null for Vibe. The lookup CLI already
redeems a Vibe locator: in `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts`,
`storeRootFor` builds `join(VIBE_HOME.trim() || join(home, '.vibe'), 'logs', 'session', 'unified')`
and `vibeSessionCandidates` takes `join(root, sessionId)` when it is a directory. The handle digests
that exact path string, so the mint must build the same string.

ACTION
1. Add `vibeSessionFolder(sessionId, env)` next to `codexRolloutPath`. Return null unless
   `sessionId` matches `/^[A-Za-z0-9._-]+$/`. Build
   `path.join(env?.VIBE_HOME?.trim() || path.join(os.homedir(), '.vibe'), 'logs', 'session', 'unified', sessionId)`.
   Return it only when `fs.statSync(folder).isDirectory()` is true, otherwise null. Catch errors as null.
2. Add `vibeWorkingFolder(sessionFolder)` next to `transcriptWorkingFolder`. Read
   `path.join(sessionFolder, 'meta.json')` as JSON. Return `meta.environment.working_directory`
   when it is a non-empty string, else `meta.origin_directory` when it is a non-empty string, else
   null. Any read or parse error returns null.
3. In `mintHandoverLocator`, add a `runtime === 'vibe'` arm to the transcript choice that calls
   `vibeSessionFolder(sessionId, process.env)`. Where it calls
   `transcriptWorkingFolder(transcriptPath)`, call `vibeWorkingFolder(transcriptPath)` instead when
   `runtime === 'vibe'`. Change nothing else in the function.
4. Give each new function a short comment that says WHY: the path must match the lookup CLI's, and
   Vibe records the session's folder in `meta.json`, not in its journal.

Rules: no comment may name a spec folder, phase, packet or task id. Do not edit any other file.

FORMAT
Run `node --check .skilled/hooks/session-handover/lib/relaunch-core.cjs` and then
`node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`. End your reply
with the check's exit code, the test `pass` and `fail` lines and the diff of the file.
