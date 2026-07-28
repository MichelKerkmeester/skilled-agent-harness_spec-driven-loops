---
title: "Implementation Summary: Cursor goal hooks"
description: "Planned phase, not yet built. Will port the goal core to Cursor via sessionStart prebind-style injection, an optional preToolUse refresh gated on phase 002, and sessionEnd verify, with fail-open behavior everywhere since Cursor hooks are shared with the editor."
trigger_phrases:
  - "cursor goal hooks summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-28T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec, plan, tasks, checklist, implementation-summary"
    next_safe_action: "Wait for phase 002's capability matrix before starting Phase 1"
    blockers:
      - "Depends on phase 002's capability-probe matrix for the preToolUse refresh cadence decision."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Completed** | Not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is `Planned`, per the parent packet's Phase Documentation Map, and stays `Planned` until phase 001 (`lib/goal-core.cjs`) and phase 002 (the capability-probe matrix) have shipped.

When built, this phase will deliver a `.opencode/hooks/goal/cursor/` adapter set on top of phase 001's runtime-neutral goal core:

- `session-start.cjs` — prebind-style `[active_goal]` injection (Cursor's `beforeSubmitPrompt`/prompt-submit path is confirmed non-delivery, so `sessionStart` is the honest injection surface).
- `session-end.cjs` — the ported heuristic verifier.
- `pre-tool-use.cjs` — an optional `agent_message` refresh, built only if phase 002's matrix confirms Cursor's realistic injection cadence supports it.
- Registration of all built adapters in `.cursor/hooks.json`.

Every adapter will be wrapped to fail open, since Cursor hooks fire for the shared editor experience and not just CLI dispatch — a goal-core error must never block or degrade an operator's editor session.

### Files Changed

Not yet delivered.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Per `plan.md`'s Phase 1 (Setup), implementation cannot begin until phase 001's `lib/goal-core.cjs` is importable and phase 002's capability matrix has resolved the `preToolUse` cadence question for Cursor.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `sessionStart` for injection, prebind-style, not `beforeSubmitPrompt`/prompt-submit. | The parent packet's recon confirmed Cursor's prompt-submit path is non-delivery — the same workaround class already proven for `spec-gate-prebind`. |
| Gate the `preToolUse` refresh adapter on phase 002's finding rather than building it unconditionally. | Building a refresh adapter on an unproven cadence risks either dead code (if the cadence doesn't work as assumed) or a misleading parity claim; phase 002 exists specifically to fix this honestly before adapter code is written. |
| Require fail-open on every adapter as a P0, not a P1. | Cursor hooks are shared with the editor, not just CLI dispatch — a block or visible error here degrades every Cursor session on this machine, not just a dispatched one. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `session-start.cjs` unit tests | Not yet run |
| `session-end.cjs` unit tests | Not yet run |
| `pre-tool-use.cjs` unit tests (conditional) | Not yet run |
| Fail-open simulation per adapter | Not yet run |
| Live smoke proof (`cursor-agent -p` or editor fallback) | Not yet run |
| `.cursor/hooks.json` live-firing confirmation | Not yet run |
| `validate.sh --strict` on this spec folder | Run this authoring pass — see task Errors/Warnings in the authoring session's own report |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase not started.** This packet documents planned scope only; no adapter code, tests, or live verification exist yet.
2. **`preToolUse` scope is genuinely undecided.** Whether this phase ships with 2 adapters (`sessionStart` + `sessionEnd`) or 3 (adding `pre-tool-use.cjs`) depends entirely on phase 002's still-unbuilt capability matrix.
3. **Live smoke proof method is contingent.** The plan calls for a real `cursor-agent -p` session; if CLI auth is unavailable at build time, the fallback is a live editor session, and that fallback must be stated plainly in this file when it happens rather than presented as equivalent evidence.
<!-- /ANCHOR:limitations -->
