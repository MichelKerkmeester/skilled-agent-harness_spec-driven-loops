---
title: "Implementation Summary: Cursor goal hooks"
description: "Built the sessionStart-only prebind-style goal injection adapter for Cursor, the fixed injection-only tier per phase 002's capability matrix, with unconditional fail-open behavior since Cursor hooks are shared with the editor."
trigger_phrases:
  - "cursor goal hooks summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-29T04:52:51Z"
    last_updated_by: "claude"
    recent_action: "Built, tested, live-smoked, and registered goal-inject.mjs"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".opencode/hooks/goal/cursor/goal-cursor.test.mjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sessionStart-only is the fixed, honest parity tier for Cursor per phase 002; sessionEnd verify and preToolUse refresh both dropped."
      - "Live smoke found zero occurrences of the injected marker in model-visible transcript across 2 dispatches, reported honestly as unproven delivery, not overclaimed."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cursor-goal-hooks |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One adapter, `.opencode/hooks/goal/cursor/goal-inject.mjs`, plus its test suite and one `.cursor/hooks.json` registration. Phase 002's capability matrix fixed Cursor's honest parity tier at "injection-only, `sessionStart`-once" before this phase's implementation began, so the originally-planned `session-end.cjs` (heuristic verify) and `pre-tool-use.cjs` (optional refresh) adapters were dropped rather than built — both would have been inert: `preToolUse`'s `agent_message` is confirmed not spliced into model context, and `stop` never fires so no verify/continue mechanism exists for a `sessionEnd` verdict to act on.

- `goal-inject.mjs` — `sessionStart` adapter. Reads the shared goal via `readGoalRecord()`, renders the `[active_goal]` block via `renderGoalBrief({goal, runtimeLabel:'Cursor'})`, records the touch via `recordTurn({runtime:'cursor'})`, and returns the block as `agent_message` in Cursor's `{permission, user_message, agent_message}` response envelope. Every path (malformed/missing stdin, disabled plugin, goal-core error, no/paused/cleared goal) fails open to `{"permission":"allow"}`.
- Registered on `sessionStart` in `.cursor/hooks.json`, appended after the 6 pre-existing entries (none removed or reordered).

### Files Changed

| File | Change |
|------|--------|
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Created — the sessionStart adapter |
| `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` | Created — `node --test` suite, 10 tests |
| `.cursor/hooks.json` | Modified — one new `sessionStart` entry appended |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read phase 001's `lib/goal-core.cjs` API surface and phase 002's `capability-matrix.md` (including its Fixed Parity Tiers section) before writing any code. Modeled `goal-inject.mjs` on the established `spec-gate-prebind.mjs` idiom (direct-run `.mjs`, no build step, stdin JSON parse with fail-open catch, `createRequire` to bridge the `.cjs` core from ESM). Wrote the co-located test suite using the same `execFileSync` + isolated-`stateDir` fixture pattern as `lib/goal-core.test.cjs`. Registered the adapter in `.cursor/hooks.json`, then ran a live smoke test in an isolated `/tmp` workspace (own `.cursor/hooks.json`, own `MK_GOAL_STATE_DIR`-equivalent via a fresh `git init`'d repo root) so the repo's real hook config and real shared goal state were never touched, following the `cli-cursor` manual-testing-playbook's CU-013 isolation methodology.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `sessionStart` for injection, prebind-style, not `beforeSubmitPrompt`/prompt-submit. | Confirmed non-delivery — the same workaround class already proven for `spec-gate-prebind`. |
| Drop `session-end.cjs` and `pre-tool-use.cjs` entirely rather than building them speculatively. | Phase 002 fixed the tier before this phase started: `preToolUse`'s `agent_message` doesn't reach model context, and `stop` never fires, so neither adapter could ever do useful work. Building them would have shipped dead code presented as a working parity feature. |
| Require fail-open unconditionally, not just on goal-core errors. | Cursor hooks are shared with the editor, not just CLI dispatch — a block or visible error here degrades every Cursor session on this machine, not just a dispatched one. Malformed/missing stdin is covered alongside goal-core errors. |
| Call `recordTurn({runtime:'cursor'})` once per `sessionStart` fire. | `sessionStart` is the only touch point this runtime gets; recording it lets other runtimes reading the shared state see Cursor's last activity, matching the API's documented per-touch semantics even though it isn't a true per-turn signal. |
| Verify live delivery with raw agent-transcript inspection, not self-report alone. | Phase 002 documented self-report as an unreliable oracle for a prior `sessionStart` test; this phase's live smoke checked the raw JSONL transcript directly for an injected nonce token, which is the same rigor phase 002 used for its `preToolUse` CONFIRMED-non-delivery finding. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `goal-inject.mjs` unit tests | `node --test .opencode/hooks/goal/cursor/goal-cursor.test.mjs` → **10/10 pass** (active-goal injection, turn recording, 4 no-op cases: none/paused/disabled/cleared, 4 fail-open cases: malformed stdin, empty stdin, missing-field payload, corrupt state JSON) |
| ~~`session-end.cjs` unit tests~~ | N/A — adapter dropped |
| ~~`pre-tool-use.cjs` unit tests~~ | N/A — adapter dropped |
| Fail-open simulation | Covered by the 4 fail-open test cases above; all resolve to exit 0 + `{"permission":"allow"}` |
| Live smoke proof (`cursor-agent -p`) | **Run, no fallback needed** (`cursor-agent about` confirmed Pro-tier auth, `mkerkmeester@proton.me`). 2 dispatches in an isolated `/tmp` workspace with its own `.cursor/hooks.json` pointing at the real adapter and its own goal state (via a fresh `git init` making the temp dir its own resolved repo root). Hook confirmed **firing and returning content**: shared state's `turnsUsed` incremented 0→1→2 and `runtime` recorded as `"cursor"` across both dispatches — this is Cursor's own JSON response envelope actually carrying the `agent_message` field (RECORDED-EVIDENCE per phase 002's terminology). Raw agent-transcript JSONL inspection (`~/.cursor/projects/tmp-cli-cursor-goal-inject-probe-ws/agent-transcripts/*/*.jsonl`) found **zero occurrences** of the injected nonce token (`GOALPROBE-QX9K7ZTM`) or the `[active_goal]` marker in model-visible `user`/`assistant` content across both transcripts. A direct self-report ask ("do you see any active_goal block...") independently returned `"NONE."` with an accurate description of what context it actually saw. **Honest conclusion: the hook works correctly end-to-end from Cursor's own hook contract (fires, reads state, renders, returns `agent_message`), but this phase found no evidence the content reaches the model** — consistent with, and extending, phase 002's unresolved `sessionStart` model-visibility finding with a negative signal on n=2. This is not claimed as a closed CONFIRMED-non-delivery finding (that determination belongs to phase 002's matrix, out of this phase's scope to amend), just reported plainly. |
| `.cursor/hooks.json` live-firing confirmation | **Confirmed** — same live-smoke evidence above (turn-counter increment proves the registered command actually executed, not just parsed) |
| `python3 -c "import json;json.load(open('.cursor/hooks.json'))"` | Valid JSON |
| `validate.sh --strict` on this spec folder | Run post-implementation — see completion evidence in `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`sessionStart` model-visibility remains unproven, not disproven.** This phase's live smoke (2 dispatches, direct transcript inspection) found no evidence the injected `agent_message` reaches the model, extending phase 002's RECORDED-EVIDENCE finding with a negative signal — but n=2 is not the same rigor as a CONFIRMED finding, and this phase does not own the capability matrix to formally reclassify it there.
2. **`goal_prompt`'s Role line does not reflect the reading runtime.** `renderGoalBrief({runtimeLabel:'Cursor'})`'s `runtimeLabel` argument is currently unused inside the shared `lib/goal-core.cjs` — the Role line text is baked in once at `setGoal()` time from whichever runtime *created* the goal, not re-derived per reader. Observed during test-writing; RESOLVED in a phase-001 core follow-up this session — `renderGoalBrief` now rewrites the Role line to the reading runtime's label, regression-tested, so a Cursor read shows "Focused Cursor execution agent" regardless of set-time runtime.
3. **No mid-session refresh or verify/continue exists for this runtime, by design.** `sessionStart`-once is the fixed ceiling per phase 002, not a gap in this phase's build — a goal set or changed mid-session will not reach an already-running Cursor session until the next `sessionStart`.
<!-- /ANCHOR:limitations -->
