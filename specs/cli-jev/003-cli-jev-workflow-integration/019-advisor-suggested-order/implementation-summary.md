---
title: "Implementation Summary: Phase 19: advisor-suggested-order"
description: "Nothing is built yet. This Planned phase will test research R3 offline: a Jev or Deem whole-cluster order for the advisor's near-tie cluster, timed inside a child like the prompt shim's, against the best zero-call order and the 2,200 ms advisor budget."
trigger_phrases:
  - "advisor suggested order summary"
  - "score-suggested-order status"
  - "r3 planned phase"
  - "near-tie order not built"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase from research R3"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-019-advisor-suggested-order"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 19: advisor-suggested-order

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-advisor-suggested-order |
| **Status** | Planned |
| **Completed** | Not built |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned and not built. It was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.

### Phase 19: advisor-suggested-order

When built, `score-suggested-order.mjs` (proposed) in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` will tell you, with zero model calls, how many near-tie rows can move and how much of the 2,200 ms budget the advisor itself spends. Behind `--jev` or `--deem` it will then settle whether a model's whole-cluster order earns a `keep` under the rule fixed in `spec.md` section 4. Phase 002's `kill` on both backends covered only the pick-first form, so this phase tests the part of R3 that 002 left open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Created | The Planned phase documents. No code or skill doc exists yet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase was released on 2026-09-29 (parent D3, amended by the operator's "Bind and release"), and the build follows `plan.md` section 4 under parent D5.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Order the whole cluster, not the pick | 002 already killed the pick-first form on both backends, so a rerun of that question would teach nothing new |
| Time every call inside a child spawned like the shim's | Research condition C11 asks for a health-plus-call p95 measured inside the advisor child, and 002's p95s were timed outside it |
| Import 002's census and gates unchanged | The comparison stays on 002's rows and 53/70, and 002's verdicts stay reproducible |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and runs | Not run. Nothing is built |
| Phase docs | `validate.sh --strict` and `check-goal.cjs` on this folder, recorded in the parent orchestrator's report for the authoring pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not built.** Every requirement in `spec.md` is open, and no verdict exists for this phase.
2. **Jev's probability map is unconfirmed.** Whether `jev choice` returns a probability for every submitted key is UNKNOWN until one real answer is read (`tasks.md` T008).
<!-- /ANCHOR:limitations -->

---
