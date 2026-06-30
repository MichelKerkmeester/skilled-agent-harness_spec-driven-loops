# Iteration 5: G5 OpenCode Goal Lifecycle

## Focus

[G5] Which OpenCode event/lifecycle hooks should track and drive a goal, and whether `session.idle` is the autonomy seam for `.opencode/plugins/mk-goal.js`.

## Actions Taken

- Read the deep-research workflow contract and state output contract for this leaf iteration.
- Read the current goal research state and strategy to avoid repeating the prior G1-G4 passes.
- Inspected local OpenCode plugin patterns in `.opencode/plugins/mk-spec-memory.js`, `.opencode/plugins/mk-code-graph.js`, `.opencode/plugins/mk-skill-advisor.js`, and `.opencode/plugins/session-cleanup.js`.
- Checked installed OpenCode version with `opencode --version`; current local CLI reports `1.17.11`.
- Searched the installed OpenCode binary for event names because the npm package ships a native/bundled binary with no readable TypeScript API files.

## Findings (evidence + OUR target + decision + risk)

1. Existing local plugins prove the OpenCode plugin lifecycle has a generic `event` hook and that current repo plugins use it for session lifecycle/cache invalidation, not autonomy. `mk-spec-memory` returns an `event` hook at `.opencode/plugins/mk-spec-memory.js:417`, marks runtime ready on `session.created` at `.opencode/plugins/mk-spec-memory.js:419`, invalidates per-session cache on `session.deleted` at `.opencode/plugins/mk-spec-memory.js:423`, and invalidates on any `message.*` or `session.*` event at `.opencode/plugins/mk-spec-memory.js:427`. `mk-code-graph` has the same broad invalidation rule for `session.*` and `message.*` at `.opencode/plugins/mk-code-graph.js:371`. OUR target: `.opencode/plugins/mk-goal.js` should expose a single `event({ event })` switch and reuse the same normalization/extraction helpers. Decision: use `session.created`, `session.deleted`, `message.updated`, `session.idle`, `session.error`, `permission.asked/replied`, `question.asked/replied`, `server.instance.disposed`, and `global.disposed` as the lifecycle set. Risk: local repo evidence proves event receipt and cache invalidation patterns, but not that a plugin can safely submit a new assistant turn.

2. `session.idle` is real in the installed OpenCode event stream and is treated by the TUI as the response-ready signal. The installed CLI is `1.17.11` from `opencode --version`. The bundled binary contains a listener that ignores all events except `session.idle` and `session.error`, then on `session.idle` reads `T.properties.sessionID` before creating the "turn complete" notification; this appears in `/opt/homebrew/lib/node_modules/opencode-ai/bin/opencode.exe` strings output at line `84952`. OUR target: `.opencode/plugins/mk-goal.js` should treat `session.idle` as the only lifecycle hook allowed to drive autonomous continuation. Decision: `session.idle` runs `maybeContinueGoal(sessionID)` after checking active status, no pending permission/question, no in-flight continuation lock, loop cap, token/time budget, and kill-switch. Risk: this is evidence from the bundled TUI event consumer, not a plugin smoke test; first implementation phase should log plugin-observed event types before enabling active continuation.

3. `message.updated` should track goal progress, not drive continuation. The installed binary's sync reducer handles `message.updated` by reading `C.properties.info.sessionID` and `C.properties.info.id`, updating the per-session message list, and pruning old message state; this is also in `/opt/homebrew/lib/node_modules/opencode-ai/bin/opencode.exe` strings output at line `84952`. OUR target: `.opencode/plugins/mk-goal.js` should use `message.updated` to refresh the goal record's `last_message_id`, `last_activity_at`, and possibly usage counters if present, then invalidate any rendered active-goal cache. Decision: never call continuation from `message.updated`; streaming or intermediate message updates would make that race-prone. Risk: token/usage data may not be present in the event payload, so G10 budget accounting may need a fallback source.

4. Teardown is explicit and should only reset volatile plugin state. `session-cleanup` documents that OpenCode lacks Claude's JSON `SessionEnd` hook and uses dispose lifecycle events as the session-end equivalent at `.opencode/plugins/session-cleanup.js:31`; its event hook is called for every lifecycle event at `.opencode/plugins/session-cleanup.js:47` and acts on `server.instance.disposed` / `global.disposed` at `.opencode/plugins/session-cleanup.js:52`. `mk-skill-advisor` also resets runtime state on those events at `.opencode/plugins/mk-skill-advisor.js:705`. OUR target: `.opencode/plugins/mk-goal.js` should flush in-memory locks/caches on dispose, while durable goal state stays in the goal state store unless `/goal clear` or `/goal complete` changes it. Decision: lifecycle teardown is not a completion signal. Risk: if state writes are buffered, dispose must synchronously flush or use atomic writes on every mutation.

5. Permission and question events are lifecycle blockers for autonomy. The installed binary's event reducer handles `permission.asked`, `permission.replied`, `question.asked`, `question.replied`, and `question.rejected` before session/message updates in the same event stream evidence at `/opt/homebrew/lib/node_modules/opencode-ai/bin/opencode.exe` strings output line `84952`. OUR target: `.opencode/plugins/mk-goal.js` should set per-session `blocked_by_prompt=true` on `permission.asked` or `question.asked`, clear it on corresponding replies, and refuse `session.idle` continuation while blocked. Decision: this avoids auto-continuing into an approval/question wait. Risk: if the plugin hook does not receive permission/question events even though the TUI does, the guard must also inspect `session.status` or another live status source before continuing.

## Questions Answered

- [G5] Yes, `session.idle` is the right autonomy seam if active continuation is implemented. It is post-response, session-scoped, and already used as a response-ready signal by the installed OpenCode TUI.
- [G5] `message.updated` is a tracking/cache invalidation hook, not a driver, because it can fire during message mutation and streaming.
- [G5] `session.created`, `session.deleted`, and dispose events are lifecycle hygiene hooks for readiness, cache eviction, and volatile reset.
- [G5] Permission/question events must pause any idle-driven continuation loop.

## Questions Remaining

- [G8] Which autonomy tier should ship first: passive injection only, gated `session.idle` continuation, or continuation plus supervisor verification?
- [G9] What exact prompt-submission API should `maybeContinueGoal(sessionID)` call, and can it be invoked safely from a plugin hook?
- [G10] Does `message.updated` expose token usage, or does budget accounting need another source?
- [G13] What sanitizer/fencing rule should wrap user-authored goal text before injection?

## Next Focus

[G6] Define the `/goal` command contract and the command-to-plugin/state handoff for `set`, `show`, `clear`, `complete`, and `pause`.
