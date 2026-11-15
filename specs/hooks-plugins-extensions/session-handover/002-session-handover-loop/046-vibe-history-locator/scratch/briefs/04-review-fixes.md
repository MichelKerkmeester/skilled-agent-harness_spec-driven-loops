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
Your task is complete only when the files are changed on disk and the verification command has run.

ROLE
You are the code agent. Change `.skilled/hooks/session-handover/lib/relaunch-core.cjs` and add tests
to `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`.

ACTION
1. In `vibeSessionFolder(sessionId, env)`: return null when `env.VIBE_HOME` is set, non-blank after
   trim, and not an absolute path (`path.isAbsolute`). Also return null unless the folder holds a
   `journal` directory. Reason for both: the lookup command runs from the checkout root and reads
   the journal, so a relative home or a folder with no journal gives a command that always fails.
2. Change `vibeWorkingFolder(sessionFolder)` to `vibeWorkingFolder(sessionFolder, sessionId)` and
   return null when `meta.session_id` is a non-empty string that differs from `sessionId`, because
   the reader refuses that session at redeem. Update its one caller in `mintHandoverLocator`.
3. Tests, after the existing Vibe tests, each with `runtime: vibe` on the note and the
   `writeVibeSession` helper: (a) `meta.json` whose `session_id` is `other-session` gives no section,
   (b) a session folder with its `journal` folder removed gives no section, (c) `VIBE_HOME` set to a
   relative path gives no section, (d) a `meta.json` with no `environment` and an `origin_directory`
   of this checkout prints the section.

Rules: no comment may name a spec folder, phase, packet or task id. Keep each comment a short WHY.
Do not edit any other file.

FORMAT
Run `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` and end your
reply with its `pass` and `fail` lines and the names of the tests you added.
