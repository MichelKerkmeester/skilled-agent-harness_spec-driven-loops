REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/406-vibe-automatic-handover
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/045-vibe-automatic-handover

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE
You are the code agent: a careful JavaScript implementer. Make exactly the change below and nothing else.

CONTEXT
Codex already hands over automatically. Read these two files first and copy their logic:
- `.skilled/hooks/session-handover/codex/shared.mjs` (seed, withdraw, nudge at a prompt)
- `.skilled/hooks/session-handover/codex/stop-arm.mjs` (`armPendingRecord`: arm and start the killer)
Mistral Vibe runs one turn-start hook (`pre_agent`) and one turn-end hook (`post_agent`). Each
receives one JSON payload with `hook_event_name`, `session_id`, `transcript_path` (the Vibe session
FOLDER, not a file), `cwd`, `parent_session_id` (non-null for a subagent) and, at `pre_agent`, `prompt`.
`readVibeUsage(sessionRoot)` and `resolveVibeWindow(threshold, env)` already exist in
`.skilled/hooks/session-handover/lib/context-usage.cjs`.

ACTION
Create `.skilled/hooks/session-handover/vibe/handover-parts.mjs` exporting two async functions.
Neither writes to stdout or calls `process.exit`. Both take `(payload, dependencies = {})` with
seams `env`, `pid`, `processTable` and `spawn`, like `armPendingRecord`.

1. `buildHandoverContextPart(payload, dependencies)` returns a string ('' for nothing). It serves
   two events: `pre_agent` (Codex's UserPromptSubmit) and `post_tool` (Codex's PostToolUse).
   - Return '' unless `isHookEnabled('session-handover', env, config, { runtime: 'vibe' })` is true
     (config from `loadConfigFile(configPath())`), the payload names `pre_agent` or `post_tool`, the
     session id is valid (`nudge.validSessionId`) and `parent_session_id` is empty.
   - Only at `pre_agent`: a seed prompt (`nudge.isSeedPrompt(payload.prompt)`) returns
     `nudge.seedInstructions(...)` or ''. Otherwise withdraw an armed hand-over exactly as Codex does
     on a prompt. When withdrawn, the result is `nudge.WITHDRAWN_NOTICE` (never a nudge too).
   - At `post_tool` there is no seed and no withdraw, only the nudge below.
   - Read usage with `readVibeUsage(payload.transcript_path)` and the window with
     `resolveVibeWindow`. Then follow the Codex nudge steps (`nudgeDecision`, `writeState`,
     `handoffText` with `runtime: 'vibe'`) and return the hand-off text.
2. `armHandoverTurnEnd(payload, dependencies)` always returns `null` (it must never deny a turn).
   - Same guards, but the event is `post_agent`.
   - Copy `armPendingRecord` with `runtime: 'vibe'`. The killer's `--transcript` is the newest file
     by modification time in `<transcript_path>/journal/`; when there is none, arm nothing.
   - Every error is logged with `appendLog` as Codex does and swallowed.

Then create `.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs` (node:test, dynamic
`import()` of the module) covering: a nudge past the threshold and none below it, a nudge at
`post_tool`, a seed prompt,
a withdraw, an arm that spawns the killer with the newest journal segment, a subagent payload
doing nothing, and the switch off doing nothing. Reuse helpers and fixtures from
`tests/codex-adapters.test.cjs` and `tests/fixtures/` where they fit.

Rules: no comment may name a spec folder, phase, packet or task id. Use the file header and
numbered section banners the Codex files use. Do not edit any other file.

FORMAT
Run `node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs` and end your reply
with its `pass` and `fail` lines, then the list of files you created.
