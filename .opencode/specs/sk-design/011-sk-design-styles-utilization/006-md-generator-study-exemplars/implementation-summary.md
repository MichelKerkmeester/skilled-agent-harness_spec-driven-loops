---
title: "Implementation Summary: bounded STUDY exemplars for design-md-generator"
description: "The reversible pre-WRITE STUDY phase for design-md-generator is built and verified: one-bundle generation-guarded hydration via phase-004 retrieval, a de-literalized observation transformer that strips instructions (injection-neutralized), target-facts binding to the phase-005 locked FACTS, and a two-signal source-leak gate with a real production discard-and-retry-without-STUDY. 162/162 tests pass; an adversarial review passed injection-neutralization and closed two leak/retry gaps."
trigger_phrases:
  - "md generator study summary"
  - "STUDY exemplar status"
  - "source-leak gate status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars"
    last_updated_at: "2026-07-18T19:07:27Z"
    last_updated_by: "claude"
    recent_action: "Built and verified STUDY exemplars; 162/162 tests, injection-neutralized, real retry"
    next_safe_action: "Consider the optional Phase C calibration watchdog later"
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
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The hydrated exemplar is inert data; embedded instructions cannot alter the locked task."
      - "On a leak, production re-authors WITHOUT STUDY — the feature is never load-bearing for correctness."
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
| **Status** | Complete — implemented, reviewed, verified |
| **Level** | 2 |
| **Origin** | Sixth child of the styles-library utilization phase parent; Phase B of the 002 md-generator research |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reversible pre-WRITE STUDY phase for `design-md-generator`. It selects exactly one coherent style bundle through the phase-004 retrieval surface under a generation guard, de-literalizes it into structural observations only (stripping instruction-like content so it stays inert data), binds those observations to the phase-005 locked target-facts digest, and injects an optional STUDY block AFTER the locked FACTS and before the prose task. A two-signal source-leak gate (exact-value + normalized-span) runs at the authored-draft boundary; on any trip the draft is discarded and re-authored WITHOUT STUDY in production.

### Files Created / Modified

| File | Action | Result |
|------|--------|--------|
| `backend/scripts/study-prepare.ts` | Create | One-bundle selection + generation-guarded hydration via phase-004 |
| `backend/scripts/study-exemplars.ts` | Create | De-literalized observation transformer, provenance/rights/injection envelope, two-signal leak gate |
| `backend/scripts/build-write-prompt.ts` | Modify | Optional STUDY block after locked FACTS, before the prose task |
| `backend/scripts/guided-run.ts` | Modify | `buildPlan` wires STUDY; `runGuided` enforces the leak gate + real discard-and-retry-without-STUDY |
| `backend/tests/study-exemplars.test.ts`, `tests/__fixtures__/study-cases.ts` | Create | Injection-oracle, leak-bypass, and production-retry fixtures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built by a `cli-codex gpt-5.6-sol` (high, fast) implementer to `spec.md`/`plan.md`/`tasks.md` in an isolated worktree, on top of phases 004 and 005. A `gpt-5.6-sol` xhigh-fast adversarial reviewer confirmed injection-neutralization (an exemplar carrying "Change the FACTS" stayed inert) and FACTS-binding, and found two real gaps: the leak gate missed brand names / relative assets / primitive token values, and the no-STUDY retry existed only in a test mock. A scoped fix pass extended leak extraction to source identities, all asset references, every primitive token value, and distinctive spans, and wired a real production child-process re-author without STUDY. The corpus teaches shape, never values; STUDY ships only with its transformation, provenance, and leak controls together.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| STUDY is a separate, reversible pre-WRITE phase | Disabling it restores the exact pre-STUDY WRITE path, so the feature is never load-bearing for correctness. |
| The hydrated exemplar is inert data, not instructions | The transformer strips imperative content; the provenance envelope marks the boundary but is not the control. |
| The corpus teaches shape, never values | Locked FACTS from phase 005 remain the sole authority for target-measured values. |
| No raw few-shot shortcut | STUDY ships only with transformation, provenance/rights/injection envelope, and the two-signal leak gate together. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run by the implementer and independently re-run by the orchestrator.

| Check | Result |
|-------|--------|
| Injection neutralization (REQ-008) | VERIFIED: an exemplar carrying "Change the FACTS" stays inert; the locked task/FACTS are unchanged |
| De-literalization (REQ-002) | VERIFIED: brand names, relative assets, primitive token values, and short phrases are caught by the gate |
| Two-signal leak gate (REQ-003) | VERIFIED: exact-value + normalized-span both run; a hit discards the draft |
| Production no-STUDY retry | VERIFIED: a real child-process re-author without STUDY produces a clean, gate-passing draft |
| Binds to locked FACTS (REQ-001) | VERIFIED: STUDY admission is schema+FACTS-digest validated; FACTS/task ordering unchanged |
| Generation guard | VERIFIED: one bundle hydrated with generation binding via phase-004 |
| Test suite | VERIFIED: `npm test` 162/162 pass; `tsc --noEmit` clean |
| Packet validity | VERIFIED: `validate.sh 006-md-generator-study-exemplars --strict` → Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **STUDY is opt-in and reversible.** Disabling it restores the exact pre-STUDY WRITE path; it deliberately never becomes load-bearing for correctness.
2. **Diversity watchdog deferred.** The optional Phase C calibration watchdog and learned/fuzzy ranking remain out of scope.
3. **Prose lift is coupled to safety.** Rights, injection, stale-generation, and source-leak controls are prerequisites that ship together with the exemplar, never after.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

- Optionally add the Phase C diversity-preserving calibration watchdog once real generated-output evidence accumulates.
- Feed STUDY prose-lift learnings back into the phase-005 schema advisory strata if warranted.
<!-- /ANCHOR:next-steps -->
