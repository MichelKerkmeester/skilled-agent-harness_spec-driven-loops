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
You are the code agent. Add tests to one file and change no production code:
`.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`.

CONTEXT
The mint in `lib/relaunch-core.cjs` now finds a Vibe sender's session folder at
`$VIBE_HOME/logs/session/unified/<session_id>` and reads the folder the session ran in from that
folder's `meta.json` (`environment.working_directory`). Read the CLAIM HISTORY LOOKUP block of the
test file (from `const RECEIVER_SESSION_ID`): copy its helpers and its Codex test's shape.

ACTION
Add a helper `writeVibeSession(sandbox, sessionId, { cwd })` after the Codex claim test. It sets
`sandbox.env.VIBE_HOME` to `path.join(sandbox.root, 'vibe-home')`, creates
`<VIBE_HOME>/logs/session/unified/<sessionId>/`, copies the `journal/` folder of
`.skilled/hooks/shared/tests/session-readers/fixtures/vibe/post-agent` into it, and writes
`meta.json` as `{ "session_id": sessionId, "environment": { "working_directory": cwd } }`.
It returns the session folder path. Then add four tests, each with `runtime: vibe` set on the note
through `setNoteLine`:
1. A Vibe sender whose `meta.json` records this checkout: the claim prints `## History Lookup`
   and the output includes `--session '<SESSION_ID>'`.
2. The command the claim printed redeems: take the handle with the same regex the Claude redeem
   test uses, run `bin/history-lookup.mjs` the same way with
   `'search', JSON.stringify({ query: 'probe-ok' })`, `cwd: workspace` and
   `{ ...sandbox.env, SPECKIT_RUNTIME: 'vibe' }`, because the printed command for a Vibe sender
   starts with `SPECKIT_RUNTIME=vibe `. Assert the claim output includes `SPECKIT_RUNTIME=vibe `,
   the lookup exits 0 and its stdout includes `probe-ok`.
3. A Vibe `meta.json` that records another checkout, built the way the Claude other-checkout test
   builds one: no section, and `hookStatePath(sandbox, workspace, SESSION_ID)` does not exist.
4. A Vibe session folder whose `meta.json` is the text `not json`: no section.

Rules: no comment may name a spec folder, phase, packet or task id. Do not edit any other file.

FORMAT
Run `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` and end your
reply with its `pass` and `fail` lines and the names of the tests you added.
