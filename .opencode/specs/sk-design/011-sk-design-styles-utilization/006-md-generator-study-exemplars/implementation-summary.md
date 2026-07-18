---
title: "Implementation Summary: bounded STUDY exemplars for design-md-generator"
description: "Planned scaffold — not yet built. Captures the intended reversible pre-WRITE STUDY phase for design-md-generator: one-bundle guarded hydration via phase-004 retrieval, a de-literalized observation transformer, a target-facts-bound optional prompt block via buildWritePrompt/buildPlan, a provenance/rights/injection envelope, and a two-signal source-leak gate in runGuided with discard-and-retry-without-STUDY. ~8-12 engineer-days; depends on phases 004 + 005."
trigger_phrases:
  - "md generator study summary"
  - "STUDY exemplar status"
  - "source-leak gate status"
importance_tier: "important"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the L2 STUDY-exemplars scaffold"
    next_safe_action: "Implement STUDY module after phases 004 and 005 land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-study-011-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: bounded STUDY exemplars for design-md-generator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-md-generator-study-exemplars |
| **Status** | Planned — scaffold; implementation not started |
| **Level** | 2 |
| **Origin** | Sixth child of the styles-library utilization phase parent; Phase B of the 002 md-generator research |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet — this is a planning scaffold, not a build. No `design-md-generator` code has been changed. The documents in this folder define the intended reversible pre-WRITE STUDY phase and its safety controls so the work can be scheduled after its dependencies (phases 004 retrieval and 005 schema contract) land.

### Files Created / Changed

| File | Action | Result |
|------|--------|--------|
| `006-md-generator-study-exemplars/{spec,plan,tasks,checklist}.md` | Create | The Level 2 planning scaffold for the STUDY phase. |
| `006-md-generator-study-exemplars/implementation-summary.md` | Create | This planned-status summary. |
| `design-md-generator/**` (study module, `build-write-prompt.ts`, `guided-run.ts`, fixtures) | Proposed | Not yet touched — the intended surfaces are listed as proposed in `plan.md` and `spec.md`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. When built, the plan is: a new STUDY module selects exactly one coherent style bundle through the phase-004 retrieval surface under a generation guard, de-literalizes it into structural observations, binds those to the locked target-facts digest, and injects an optional prompt block AFTER the locked FACTS and before the prose task via `build-write-prompt.ts::buildWritePrompt` and `guided-run.ts::buildPlan`. A two-signal source-leak gate (exact-value + normalized-span) runs at the authored-draft boundary in `runGuided`; on any trip the draft is discarded and regenerated WITHOUT STUDY. STUDY ships only with its transformation, provenance, and leakage controls together — never as a raw few-shot shortcut. The corpus teaches shape, never target values.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| STUDY is a separate, reversible pre-WRITE phase | The prose lift is real but risky; keeping STUDY opt-in means disabling it restores the exact pre-STUDY WRITE path, so the feature never becomes load-bearing for correctness. |
| The corpus teaches shape, never values | Locked FACTS from phase 005 remain the sole authority for target-measured values; STUDY contributes only de-literalized structural observations. |
| No raw few-shot shortcut | STUDY ships only with its transformation, provenance/rights/injection envelope, and two-signal leak gate together — never as an intermediate raw exemplar. |
| Ordered after 004 + 005 | STUDY consumes the phase-004 retrieval surface for one-bundle selection and binds to the phase-005 locked FACTS; both are prerequisites. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reversibility (REQ-001) | PENDING — not built. |
| De-literalization (REQ-002) | PENDING — not built. |
| Two-signal leak gate (REQ-003) | PENDING — not built. |
| Packet validity | Re-confirm with `validate.sh .opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars --strict` after this scaffold lands. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a plan, not a build.** Nothing in the `design-md-generator` runtime has changed.
2. **Blocked on dependencies.** Selection binds to the phase-004 retrieval surface and the phase-005 locked FACTS; neither is consumed until those phases land.
3. **STUDY carries real risk.** Rights, injection, stale-generation, and source-leak gates are prerequisites, not add-ons; the phase deliberately couples the prose lift to its safety controls.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

1. Land phase 004 (retrieval) and phase 005 (schema contract) first.
2. Build Phase 1 — one-bundle selection + generation-guarded hydration.
3. Build Phase 2 — de-literalized transformer, target-facts binding, prompt-block injection, provenance envelope.
4. Build Phase 3 — two-signal leak gate, discard-and-retry-without-STUDY, adversarial + counterfactual fixtures.
5. Verify reversibility and leak-gate behavior, then reconcile `checklist.md` with evidence.

Estimated cost: ~8–12 engineer-days.
<!-- /ANCHOR:next-steps -->
