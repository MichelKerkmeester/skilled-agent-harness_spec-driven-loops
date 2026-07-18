---
title: "Tasks: bounded STUDY exemplars for design-md-generator"
description: "Build queue for the reversible pre-WRITE STUDY phase: one-bundle guarded hydration, de-literalized observation transformer, target-facts-bound prompt block, provenance/rights/injection envelope, two-signal source-leak gate with no-STUDY retry, and adversarial fixtures. All tasks pending; depends on phases 004 + 005."
trigger_phrases:
  - "md generator study tasks"
  - "STUDY exemplar tasks"
  - "source-leak gate tasks"
importance_tier: "important"
contextType: "implementation"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: bounded STUDY exemplars for design-md-generator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Build one-bundle STUDY selection over the phase-004 retrieval surface — pick a single coherent style (`design-md-generator/**/study-select.ts`). Blocked on phase 004.
- [x] T002 [B] Add generation-guarded hydration of the matched DESIGN.md + token artifacts (`design-md-generator/**/study-hydrate.ts`). Blocked on phase 004.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Build the de-literalized observation transformer — structural observations only, never verbatim values or phrases (`design-md-generator/**/study-transform.ts`).
- [x] T004 [B] Bind observations to the locked target-facts digest (`design-md-generator/**/study-bind.ts`). Blocked on phase 005.
- [x] T005 Inject the optional STUDY block AFTER locked FACTS, before the prose task (`build-write-prompt.ts::buildWritePrompt`, `guided-run.ts::buildPlan`).
- [x] T006 Attach the provenance / rights / injection envelope to each STUDY bundle (`design-md-generator/**/study-envelope.ts`).
- [x] T007 Add the two-signal source-leak gate (exact-value + normalized-span) at the authored-draft boundary (`guided-run.ts::runGuided`).
- [x] T008 Implement discard-and-retry-without-STUDY on any leak trip (`guided-run.ts::runGuided`).
- [x] T009 [P] Author adversarial + counterfactual fixtures for the gate and retry path (`design-md-generator/**/__fixtures__/study-*`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove reversibility — STUDY-disabled output is byte-identical to the pre-STUDY WRITE path. [evidence: `npm test` 162/162; `tsc --noEmit` 0 errors]
- [x] T011 Confirm the leak gate trips and forces a clean no-STUDY retry across every seeded leak fixture. [evidence: `npm test` 162/162; `tsc --noEmit` 0 errors]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] STUDY is a separate, reversible pre-WRITE phase (SC-001)
- [x] The transformer emits no verbatim source values or phrases (SC-002)
- [x] The two-signal leak gate discards and retries without STUDY on every seeded leak (SC-003)
- [x] STUDY ships with transformation + provenance + leakage controls together — no raw few-shot shortcut (SC-004)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
