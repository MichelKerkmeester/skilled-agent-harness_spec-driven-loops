# Iteration 4: G4 OpenCode System-Transform Injection

## Focus

[G4] How OpenCode injects context via `experimental.chat.system.transform`, using `.opencode/plugins/mk-spec-memory.js` as the concrete pattern for `.opencode/plugins/mk-goal.js`.

## Actions Taken

- Read the deep-research quick reference and output contract to keep this as a leaf iteration that writes only the iteration narrative and delta file.
- Read the packet strategy and state log. The strategy's next focus is G4, specifically the exact OpenCode `experimental.chat.system.transform` signature and how to push an `[active_goal]` block.
- Read `.opencode/plugins/mk-spec-memory.js` with line numbers, then checked sibling plugins and the installed `@opencode-ai/plugin` type definition for the actual hook signature.
- Read the hook-system documentation and prior hook-parity decision record to distinguish prompt-time injection from lifecycle/event handling.

## Findings (evidence + OUR target + decision + risk)

### Finding 1 - The system-transform hook is the right injection mechanism, and it is string-only.

Evidence: the installed OpenCode `Hooks` interface defines `"experimental.chat.system.transform"` with `input.sessionID?: string` and `input.model`, and `output.system: string[]`. [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:197] [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:201] The existing memory plugin returns the hook key as `'experimental.chat.system.transform': appendContinuityBrief`. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:436]

OUR target: `.opencode/plugins/mk-goal.js`, specifically the per-turn injection path.

Decision: Implement `.opencode/plugins/mk-goal.js` with an async `appendGoalBrief(input, output = { system: [] })` function registered under `'experimental.chat.system.transform'`. The function should render one plain string, not mutate chat messages: a compact `[active_goal]` block containing `status`, `goalId`, `objective`, budget/usage summary when present, and a short directive.

Risk: `sessionID` is optional in the OpenCode type. If the hook receives no session id, falling back to a global goal could leak a goal across sessions. The safer v1 behavior is to skip injection when no session id is available, while the status tool can report `missing_session_id`.

### Finding 2 - `mk-spec-memory` shows the exact append pattern: guard output, normalize `system`, look up session state, clamp, dedupe, push.

Evidence: `appendContinuityBrief` first rejects invalid output, normalizes `output.system` to an array, skips disabled state, derives `sessionID`, fetches the brief, clamps it, dedupes against existing system entries, and finally pushes the brief. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:404] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:406] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:408] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:411] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:412] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:413]

OUR target: `.opencode/plugins/mk-goal.js`, especially `appendGoalBrief`.

Decision: Mirror this control flow for goals. `appendGoalBrief` should ensure `output.system` exists, skip when disabled, resolve the session id, load the session goal, skip statuses that should not steer (`paused`, `complete`, absent record), render and clamp the block, then dedupe by a stable sentinel such as `[active_goal:${goalId}]` before pushing.

Risk: Unlike memory continuity, goal changes are user-facing and must feel immediate after `/goal pause`, `/goal clear`, or `/goal complete`. A long cache TTL would be wrong here. Either read the small JSON state fresh on every transform, or use a very short cache invalidated by command/event updates.

### Finding 3 - Prompt-time injection and lifecycle observation are separate OpenCode surfaces.

Evidence: the hook-system reference maps OpenCode prompt-time advisor injection to `experimental.chat.system.transform`, while session priming and cleanup use `event` startup/cleanup handlers. [SOURCE: `.opencode/skills/system-spec-kit/references/config/hook_system.md`:62] [SOURCE: `.opencode/skills/system-spec-kit/references/config/hook_system.md`:63] [SOURCE: `.opencode/skills/system-spec-kit/references/config/hook_system.md`:65] The same document states OpenCode can inject runtime-visible context in-turn via `experimental.chat.system.transform`. [SOURCE: `.opencode/skills/system-spec-kit/references/config/hook_system.md`:71] `mk-spec-memory` follows that split by returning both `event` and the system transform. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:416] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:417] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:436]

OUR target: `.opencode/plugins/mk-goal.js` hook layout.

Decision: Keep G4 injection passive and prompt-time: `experimental.chat.system.transform` only places the active goal into model context. Lifecycle/autonomy belongs in the `event` handler and should be finalized in G5. This avoids mixing "tell the model the active goal" with "decide whether to continue autonomously."

Risk: The hook runs before each LLM call, not only when the user submits a prompt. Prior hook-parity notes call out that this recomputes the brief on each LLM turn. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge/decision-record.md`:231] That is good for freshness, but budget usage and cache metrics may update more often than a user-turn mental model expects.

### Finding 4 - Session id normalization and event cache invalidation are reusable, but goal injection should not over-cache.

Evidence: `mk-spec-memory` extracts a session id from direct input, nested session objects, or event `properties` before falling back to `__global__`. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:128] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:131] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:134] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:137] It invalidates a session cache by key prefix and clears cache on session deletion or broad message/session events. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:392] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:397] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:423] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:427]

OUR target: `.opencode/plugins/mk-goal.js` state lookup and cache behavior.

Decision: Reuse the same `sessionIdFrom`, `eventPayloadFrom`, `eventTypeFrom`, and `invalidateSession` style helpers, but change fallback policy: for goal injection, `__global__` should be valid only for status/debug output, not for active per-session steering. Prefer no injection if session identity is missing.

Risk: OpenCode event payload shapes are normalized defensively in existing plugins, but G5 still needs to verify whether `session.idle` and `message.updated` carry enough stable identifiers for active continuation and budget accounting.

### Finding 5 - The goal plugin should expose a status tool beside the injected context.

Evidence: `mk-spec-memory` registers `tool` alongside the hook and exposes `mk_spec_memory_status`. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:438] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:439] The status output includes plugin id, enabled state, cache settings, readiness, last bridge status, lookup counts, and cache hit rate. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:447] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:453] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:458] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:462] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:466]

OUR target: `.opencode/plugins/mk-goal.js` and `.opencode/commands/goal.md`.

Decision: Add a plugin tool such as `mk_goal_status` in `.opencode/plugins/mk-goal.js`. `/goal show` in `.opencode/commands/goal.md` should route to the same state fields, while the tool gives model-visible diagnostics: plugin enabled, active session id present, active goal status, last injection result, last error, and store health.

Risk: Status output can leak local implementation details if it prints absolute paths. `mk-spec-memory` already masks its bridge path as `[spec-memory-bridge]`. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:457] `mk-goal.js` should similarly report a logical store label instead of the full state-store path unless an explicit debug option is enabled.

### Finding 6 - A bridge subprocess is not needed for local goal state, but fail-open behavior still is.

Evidence: `mk-spec-memory` spawns a bridge subprocess for continuity lookups and status, with timeout handling and fail-open responses. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:273] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:277] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:286] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:315] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:323] The hook then simply returns when no brief is available. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:409] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:410]

OUR target: `.opencode/plugins/mk-goal.js` state-store integration.

Decision: Do not introduce a bridge for v1 goal injection. Read the local goal state store directly with async filesystem APIs, render the block in-process, and fail open by skipping injection plus recording `lastError` for `mk_goal_status` if the store is unreadable or malformed.

Risk: Direct filesystem reads in a prompt-time hook put latency on the hot path. The G7 store decision should require atomic writes, small per-session files, and bounded read/parse cost so the hook remains cheap enough to run before every LLM call.

## Questions Answered

- [G4] Answered: OpenCode prompt-time context injection is an async plugin hook named `experimental.chat.system.transform`. It receives an optional `sessionID` and mutates `output.system`, a string array. The buildable `mk-goal.js` design is to render a compact `[active_goal]` string and push it to `output.system`, mirroring `mk-spec-memory`'s output guard, session lookup, clamping, dedupe, and fail-open behavior.
- The injection mechanism is not the autonomy mechanism. `experimental.chat.system.transform` should only steer the model with current goal state; event-driven continuation remains G5.

## Questions Remaining

- [G5] Verify exact event payloads and whether `session.idle` can drive safe continuation without racing user input.
- [G6] Verify whether `.opencode/commands/goal.md` can route through a plugin tool/helper or must instruct file-state mutation through normal command tooling.
- [G7] Finalize the state-store path, atomic write strategy, and cache policy.
- [G11] Decide the exact `mk_goal_status` fields and how `/goal show` should differ from model-visible diagnostics.
- [G13] Decide how to sanitize or fence the user-authored objective before injecting it into every turn.

## Next Focus

[G5] Which OpenCode event/lifecycle hooks track and drive a goal, especially whether `session.idle` can safely serve as the autonomy seam.
