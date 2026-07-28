---
title: "Implementation Summary: Devin goal hooks"
description: "Planned-state summary for the Devin goal-hook adapters — not yet built, blocked on phase 001 (goal core) and phase 002 (capability-probe matrix)."
trigger_phrases:
  - "devin goal hooks summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Documented planned scope for Devin goal hooks"
    next_safe_action: "Implement after phase 002 fixes the Stop-hook parity tier"
    blockers:
      - "Phase 002 capability-probe matrix must land before adapter code starts."
    key_files:
      - ".opencode/hooks/goal/devin/"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook can block/continue per the phase 002 probe (undetermined)."
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-devin-goal-hooks |
| **Completed** | Not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is `Planned`. This document records the intended shape so a fresh agent picking up this packet has a target to implement against, not a claim of completed work.

### Planned: `.opencode/hooks/goal/devin/`

Three adapters, built on the phase 001 goal core (`.opencode/hooks/goal/lib/goal-core.cjs`, itself not yet built):

- `user-prompt-submit.cjs` — injects the rendered `[active_goal]` brief as `additionalContext` on every Devin user turn.
- `session-start.cjs` — restores the active goal state when a new Devin session starts.
- `stop.cjs` — verifies the current turn against the active goal; upgraded to force continuation (mirroring Claude's `decision:"block"`) only if phase 002's live probe confirms Devin's `Stop` hook schema supports it, otherwise verify-only.

### Planned: `.devin/hooks.v1.json` registration

Three new, additive-only entries wiring the above adapters to `UserPromptSubmit`, `SessionStart`, and `Stop`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Planned sequencing: phase 001 (goal core) must land first, then phase 002 (capability-probe matrix) must fix the Devin `Stop`-hook parity tier, then this phase implements the three adapters against that confirmed core and tier, directly on `skilled/v4.0.0.0` (operator choice for the parent packet), with a co-located `node --test` suite and a live `devin -p` smoke proof before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not assume the `Stop` hook's continuation behavior before phase 002 lands. | Devin's `Stop` hook schema mirrors Claude's, where `decision:"block"` forces continuation, but this is unproven for Devin per the parent packet's recon; shipping an assumed answer risks an honest-parity violation. |
| Adapters depend only on the phase 001 goal core, never on `mk-goal.js`. | Keeps the OpenCode per-session goal system and the new cross-runtime shared-state system fully decoupled, per the parent packet's scope boundary. |
| `.devin/hooks.v1.json` edit stays additive-only. | Minimizes blast radius on a config shared with every other live Devin hook in this repo. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Co-located `node --test` adapter suite | Not yet run |
| Live `devin -p` smoke proof (`UserPromptSubmit` injection) | Not yet run |
| Live `devin -p` smoke proof (`SessionStart` restore) | Not yet run |
| `Stop` verify (and continue, if applicable) | Not yet run |
| `.devin/hooks.v1.json` registration check | Not yet run |
| `validate.sh --strict` on this phase folder | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hard-blocked on phase 001 and phase 002.** No adapter code can be written responsibly until the goal core exists and the Devin `Stop`-hook capability tier is confirmed by a live probe, not assumed.
2. **`Stop` hook parity tier is genuinely unknown at authoring time.** This packet does not pre-commit to verify-and-continue; it will ship whichever tier phase 002 actually confirms, and will state that tier plainly once implemented.
3. **No live evidence exists yet.** Every verification row above is honestly `Not yet run` — this is a planning-stage document, not a completion claim.
<!-- /ANCHOR:limitations -->
