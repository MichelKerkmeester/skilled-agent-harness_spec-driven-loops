---
title: "Implementation Summary: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Shipped and live-verified: operator-visible input-transform injection, session_start restore, and observe-only turn-end verify, all proven in a real Pi session transcript"
trigger_phrases:
  - "pi goal extension summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-29T04:52:51Z"
    last_updated_by: "claude"
    recent_action: "Shipped and live-verified the Pi goal extension"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".pi/extensions/goal-context.ts"
      - ".opencode/hooks/goal/pi/goal-pi.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Turn-end verify is observe-only: void-returning handlers cannot force continuation, confirmed live (5 verdicts recorded, agent kept working under its own loop)."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-pi-goal-hooks |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One new Pi extension delivering all three lifecycle points named in scope, plus its co-located test suite:

- **`.opencode/hooks/goal/pi/goal-context.ts`** — the real, canonical extension file. A single default-exported factory registers three handlers:
  - `input`: dynamic-imports the goal core, reads the active-goal record, and — if a brief renders — returns `{action:"transform", text: "${event.text}\n\n${brief}"}`, appending the byte-compatible `[active_goal]` block to the user's own turn. Chains additively with the repo's other `input` handlers (e.g. `spec-gate-classify.ts`) the same way that file does.
  - `session_start`: restores the active goal via a `pi.sendMessage({customType:"goal-context-restore", ..., display:false})` custom message, fired once per session before any user turn.
  - `turn_end`: flattens the turn's ending message and tool-result content into evidence text, runs the ported heuristic verifier, calls `recordTurn` to persist turn count/activity, and — only when the verdict is not `"met"` — sends a non-blocking `goal-verify-nudge` custom message. It never returns a value that could force continuation (the event's handler type is `void`).
  - Every handler wraps its body in try/catch and fails open (`{action:"continue"}` for `input`, `undefined` for `session_start`/`turn_end`) so a goal-state bug can never block a Pi turn or session.
- **`.pi/extensions/goal-context.ts`** — a relative symlink (`-> ../../.opencode/hooks/goal/pi/goal-context.ts`) satisfying Pi's fixed auto-discovery directory. Reverse of the general Pi-extension pattern in this repo (real file usually lives under `.pi/extensions/`), matching the goal concern's canonical home in `.opencode/hooks/goal/` alongside its sibling adapters.
- **`.opencode/hooks/goal/pi/goal-pi.test.mjs`** — 13 `node --test` cases covering render selection (active/none/paused), `isPluginDisabled`, four heuristic-verifier scenarios, the factory's export/registration shape, and the fail-open contract of all three handlers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/goal/pi/goal-context.ts` | Created | Real extension source: input-transform injection, session_start restore, gated turn-end verify. |
| `.pi/extensions/goal-context.ts` | Created (symlink) | Pi auto-discovery entry point. |
| `.opencode/hooks/goal/pi/goal-pi.test.mjs` | Created | Co-located adapter test suite. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read this phase's `spec.md`/`plan.md`/`tasks.md`/`checklist.md`, phase 001's `goal-core.cjs` (state I/O, render, verifier exports), and phase 002's `capability-matrix.md` (fixed Pi's tier: `turn_end`/`agent_end`/`agent_settled` confirmed subscribable, all `void`-returning — no forced continuation).
2. Read the proven Pi symlink-mirror precedent (`.pi/extensions/README.md`, `spec-gate-classify.ts`, `session-start-context.ts`) and confirmed the same import-depth pattern already lives at `.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts` (`../../.opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`).
3. Read Pi's installed `types.d.ts` directly for the exact `InputEvent`/`InputEventResult`/`SessionStartEvent`/`TurnEndEvent`/`ExtensionAPI` shapes, plus `@earendil-works/pi-agent-core`/`pi-ai`'s `Message`/`AgentMessage`/`TextContent` types for turn-end content extraction.
4. Authored `.opencode/hooks/goal/pi/goal-context.ts` with imports written for the `.pi/extensions/` base and verified the exact resolved path with `os.path.normpath` before finalizing (`../../.opencode/hooks/goal/lib/goal-core.cjs` resolves correctly from `.pi/extensions/`).
5. Created the relative symlink `.pi/extensions/goal-context.ts -> ../../.opencode/hooks/goal/pi/goal-context.ts`; confirmed with `readlink`/`os.path.realpath`.
6. Wrote `goal-pi.test.mjs`: core-facing render/verifier tests via direct `goal-core.cjs` import (isolated per-test `MK_GOAL_STATE_DIR` temp dirs, matching `goal-core.test.cjs`'s own isolation pattern); factory-shape and fail-open tests via a dynamic import of the real `.ts` file's own path (Node's native type-stripping in this installed Node 22.23.1 handles the `import type` erasure with no flag needed) plus a hand-rolled fake `ExtensionAPI`.
7. Ran `node --test .opencode/hooks/goal/pi/goal-pi.test.mjs`: 13/13 pass.
8. Set an active goal via `bin/goal.cjs set` under an isolated `MK_GOAL_STATE_DIR` and Pi `--session-dir` (to avoid colliding with sibling phases 003/004 also live-testing against the shared goal-state file this session), then ran `pi --offline --approve -p "what is my current active goal, if any?"`. Read the resulting session `.jsonl` transcript directly (not just CLI stdout) for load-bearing evidence.
9. Confirmed zero extension-load errors, injection visibility, restore, and verify firing — see Verification below.
10. Cleared the isolated goal state; confirmed the real shared `.opencode/skills/.goal-state/` tree was untouched by this work.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `turn_end` (not `agent_end`/`agent_settled`) as the verify trigger | `TurnEndEvent` carries the concrete ending `message` plus `toolResults`, giving real per-turn evidence text; `AgentEndEvent` only gives the whole run's `messages[]` and `AgentSettledEvent` carries no payload at all — `turn_end` best matches REQ-005's "verify goal progress at turn end" wording. |
| Turn-end verify is observe/record-only, never forcing continuation | Phase 002's matrix is explicit: `turn_end`/`agent_end`/`agent_settled` are `void`-returning, so no handler return value can force continuation the way Devin's `Stop` can. The handler calls `recordTurn` (persists turn count/activity, the only "record" primitive the core actually exposes) and optionally sends a non-blocking `pi.sendMessage` nudge — it never re-queues, steers, or blocks a turn. This cap is stated in code comments, tests, and every doc touched by this phase, not glossed over. |
| `session_start`/`turn_end` custom messages use `display:false` | Mirrors the established pattern this repo's other session-lifecycle Pi bridges already use (`session-start-context.ts`); the `input` transform is the one channel this phase deliberately makes operator-visible per REQ-003 — `session_start`/`turn_end` restore/verify state into context without adding extra chat noise every turn. |
| Live smoke run isolated via `MK_GOAL_STATE_DIR` + `--session-dir` rather than the shared real state file | Mid-verification, a first live run against the real shared `.goal-state/` file was silently clobbered by a concurrent sibling session building phases 003/004 (a `setGoal` replace archived my active goal before the model could answer). The shared-state-file design (phase 001, out of scope here) makes this a real, structural risk whenever multiple runtime adapters are being built in parallel; isolating this phase's own verification sidesteps it without touching phase 001's core. |
| No named export beyond the default factory | Matches this repo's established Pi-extension boundary rule (`.pi/extensions/README.md` §4: "Exactly one default-exported `ExtensionFactory` per file. No named exports."); the internal `extractContentText`/`extractTurnEndText` helpers stay private, tested indirectly through `verifyGoalHeuristic` with crafted transcript text plus the live smoke proof, not through a direct unit import. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Co-located `node --test` suite | PASS — `# tests 13 / # pass 13 / # fail 0` |
| Symlink resolution | PASS — `.pi/extensions/goal-context.ts -> ../../.opencode/hooks/goal/pi/goal-context.ts`; `os.path.realpath` resolves to the real file; import depth verified with `os.path.normpath` before finalizing |
| Live smoke proof, injection visible in transcript (REQ-003) | PASS — isolated `pi --offline --approve -p "what is my current active goal, if any?"` run; session `.jsonl` transcript's first `role:"user"` message body is the literal prompt text followed by the full `[active_goal:...]...[/active_goal]` block; the model's reply explicitly cites "the `[active_goal:...]` block at the top of this turn" and states the objective verbatim |
| Live `session_start` restore check (REQ-004) | PASS — same transcript, a `customType:"goal-context-restore"` message carrying the full brief fired automatically before the first user turn |
| Turn-end verify (REQ-005) | PASS, observe-only as designed — 5 `customType:"goal-verify-nudge"` messages fired across the session (`verdict=not-met`/`unclear` with heuristic reasons); the goal record's `turnsUsed` advanced 0 → 5 via `recordTurn`; the session's continued activity was the agent's own tool-use loop, not a forced continuation from this handler |
| Zero extension-load errors | PASS — session progressed through 28 transcript lines across multiple turns and tool calls with no "does not export a valid factory function" or similar failure |
| `validate.sh --strict` on this folder | PASS — Errors: 0 |
| `validate.sh --strict` on the parent packet | PASS — Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Turn-end verify cannot force continuation.** `turn_end`/`agent_end`/`agent_settled` are `void`-returning in Pi's installed `types.d.ts` — no handler return value can block, re-queue, or steer a turn the way Devin's `Stop` `decision:"block"` can. The shipped handler only records the turn and optionally surfaces a non-blocking nudge message; this is a real capability ceiling for Pi, not an implementation gap. If Pi exposes an auto-continue mechanism at all (e.g., an extension explicitly queuing a follow-up turn via `sendUserMessage`), it was not probed or implemented this phase — REQ-005/SC-004 only required verify to be implemented and tested, which it is.
2. **The goal core has no "record verdict" setter.** `goal-core.cjs` (phase 001, read-only to this phase) exposes `recordTurn` (turn count/activity) but no function to persist `lastVerifierVerdict`/`lastVerifierReason` onto the state record after `setGoal` first creates it. The Pi adapter therefore calls `recordTurn` and surfaces the verdict only via a transient `pi.sendMessage` nudge — it does not, and per NFR-Q01 should not, reach around the core to write those fields directly. A future core enhancement (out of this phase's scope) could add that setter for all runtime adapters to share.
3. **`renderGoalBrief`'s `runtimeLabel` parameter does not retroactively relabel an existing goal's Role line.** The "Focused `<runtimeLabel>` execution agent…" line is baked into `goal.goalPrompt` at `setGoal()`-time from whichever caller's own `runtime` argument was used then (e.g. `bin/goal.cjs`'s CLI defaults to `"cli"` unless `MK_GOAL_RUNTIME_LABEL` is set) — `renderGoalBrief({goal, runtimeLabel:"Pi"})` renders the goal's already-stored prompt verbatim, it does not rebuild it. This is existing phase-001 core behavior (out of scope to change here); the live smoke ran before the fix, so its transcript honestly shows "Focused cli execution agent…"; a phase-001 core follow-up this session now relabels the Role line to the reading runtime (regression-tested), so a subsequent Pi read renders "Focused Pi execution agent…".
4. **Live verification ran against an isolated state/session directory, not the shared production `.goal-state/` tree.** This was necessary because a concurrent sibling session (phases 003/004) was live-testing against the same shared file during this work and silently replaced an earlier attempt's goal. The isolation proves the adapter's logic end-to-end identically to how it behaves against the real shared file (same code path, same `goal-core.cjs`, only the `MK_GOAL_STATE_DIR`/`--session-dir` values differ) — it does not itself constitute a gap, but it is disclosed here for honesty.
<!-- /ANCHOR:limitations -->
