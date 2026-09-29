---
title: "Implementation Summary: Phase 21: stage2-leaf-route-replay"
description: "Nothing is built yet. This Planned phase will rebuild the stage-2 leaf-route replay with zero calls, score it on the committed expected_leaf_resources gold, recount ROUTER.md reads and test a Jev or Deem tie-break on the rows the replay leaves tied."
trigger_phrases:
  - "leaf route replay summary"
  - "leaf-route-replay status"
  - "r25 planned phase"
  - "stage2 replay not built"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay"
    last_updated_at: "2026-09-29T14:00:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase from research R25"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-021-stage2-leaf-route-replay"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 21: stage2-leaf-route-replay

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-stage2-leaf-route-replay |
| **Status** | Planned |
| **Completed** | Not built |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned and not built. It was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.

### Phase 21: stage2-leaf-route-replay

When built, `leaf-route-replay.cjs` (proposed) in `.skilled/skills/sk-doc/sk-create-skill/scripts/` will tell you, with zero model calls, how well each hub's `ROUTER.md` keyword block alone picks the leaves the playbooks name as gold, and where it leaves a tie. On your transcript directory it counts the `ROUTER.md` bytes your sessions read each week. With your prose rows it says whether the replay holds up against the main AI reading the file. Only on tied rows, a `--jev` or `--deem` run settles whether a model's pick beats the replay's own answer. The replay this rebuilds was deleted on 2026-09-11, and seven `ROUTER.md` files still point at it.

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
| Port the retired keyword rules, not restore the file | The old file carried a benchmark lane that was retired on purpose. The scoring is all this phase needs |
| Judge the tie-break on tied rows only | Untied rows score the same in both arms and would only dilute the margin |
| Baseline is the better of the union and the first tied intent | A model has to beat the best free answer, not only today's union |
| Count transcript reads as numbers only | The promote rule needs a recount, and the operator's session text must not leave the machine or land in a report |
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
2. **No prose arm yet.** No committed record holds per-leaf prose picks, so the replay verdict stops at coverage until the operator records them.
3. **Serves nothing.** A good replay still needs the routing owner to wire it in. This phase only measures.
<!-- /ANCHOR:limitations -->

---
