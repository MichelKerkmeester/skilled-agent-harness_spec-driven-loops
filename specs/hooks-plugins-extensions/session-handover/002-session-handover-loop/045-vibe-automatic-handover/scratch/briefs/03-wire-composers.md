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
`.skilled/hooks/session-handover/vibe/handover-parts.mjs` exports `buildHandoverContextPart(payload)`
(returns a string) and `armHandoverTurnEnd(payload)` (always returns null). Three Vibe hook entries
must run them. Each entry already composes parts in a fixed order.

ACTION
0. In `handover-parts.mjs`, `buildHandoverContextPart` returns `nudge.WITHDRAWN_NOTICE` right after a
   withdraw. Codex (`codex/shared.mjs`, the `quiet()` helper and the line "The withdraw prompt answers
   with the notice alone; its decision only fixes the re-arm floor") still runs the usage read and
   `nudge.nudgeDecision` on that prompt, because the decision stores the re-nudge floor. Make Vibe do
   the same: remember `withdrawn`, keep going, and return `nudge.WITHDRAWN_NOTICE` on every path that
   would otherwise return '' or a nudge. Add one test in `tests/vibe-adapters.test.cjs`: after the
   withdraw prompt, the nudge state file records the re-arm floor.
1. `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`: import `buildHandoverContextPart` and add
   `(payload) => buildHandoverContextPart(payload)` as the LAST item of `PARTS`. Add one short
   comment above it: the hand-over part runs last, so its claim or nudge text ends the context.
2. `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`: add a part that calls
   `armHandoverTurnEnd(payload)` (dynamic import, like `askSurfacePart`) and put it LAST in `PARTS`.
   Comment: it runs last because the composer stops at the first deny, so a turn another part sends
   back is never armed and ended; it never denies itself.
3. `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`: after `buildPostToolPart(payload)`,
   also await `buildHandoverContextPart(payload)` in its own try/catch. Join the non-empty texts with
   a blank line, compaction text first. Update the file's header comment in one sentence to say the
   binding also carries the hand-over nudge mid-turn.
4. In `turn-start.test.mjs` and `turn-end.test.mjs` (same folder) add one test each: with the
   handover switch off (env without `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED`), the default part list
   still gives the same result as before. Keep every existing test unchanged.

Rules: no comment may name a spec folder, phase, packet or task id. Do not edit any other file.

FORMAT
Run `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs` and end your reply with its `pass`
and `fail` lines, then the list of files you changed.
