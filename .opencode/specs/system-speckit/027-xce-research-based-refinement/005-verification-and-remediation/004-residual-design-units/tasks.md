---
title: "Tasks: Residual 029 Design Units"
description: "Task Format: T### [P?] Description (file path). Three design units + defer-by-design bucket + L9/L2 verify-first tail. Units A/B + tail shipped; Unit C documented; tri-163 refuted; tri-129 deferred; tri-135 already-correct."
trigger_phrases:
  - "residual design units tasks"
  - "030 tasks"
  - "defer-by-design bucket"
  - "L9 L2 tail"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units"
    last_updated_at: "2026-06-13T17:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked units A/B + tail shipped, Unit C documented, defer-bucket resolved"
    next_safe_action: "Operator decision on optional follow-ons; push branch"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:b3db1ff916fb4c6f23bce7c21683241320a90f4d5e406396002455b735916221"
      session_id: "030-implement-2026-06-13"
      parent_session_id: "030-scaffold-populate-2026-06-13"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Residual 029 Design Units

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture decisions for the 3 units (A per-class reconcile recorded; B corpus = hash-class synthetic; C parity-vs-document = DOCUMENT) — resolved via verify-first design seats
- [x] T002 Per-unit design notes before code (canonical-surface for A, permissible-corpus for B, parity-decision for C) — produced by claude2 Opus design seats, verified against source
- [x] T003 [P] Safety harnesses: backup procedure (A, used), privacy test (B, SENTINEL test shipped), live-daemon adoption harness (C, designed; build deferred with the port)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Unit A — vector reconcile DONE (2026-06-13): online backup (/tmp/tri105-backup-20260613T153009, main+shard, quick_check ok) -> dry-run showed 91 success-missing-active-vector (the surface divergence) vs 2175 missing-vector-FAILED (a separate retry-all-failures op, deliberately skipped) -> applied targeted repairSuccessCoverage with resetMissing:false: 91 success-coverage rows reset to retry; retry-manager re-embedding. Orphan-vector autoClean + the broad failed-retry are separate maintenance ops, not the divergence. (memory vector store)
- [x] T005 Unit B — privacy-preserving hash-class synthetic replay corpus SHIPPED: lib/feedback/shadow-replay-corpus.ts + replay-seed-vocab.ts; keys query_hash/intent/result_count only, NO raw query text; fail-closed assertCorpusPrivacy; SENTINEL privacy test green (shadow-evaluation corpus builder)
- [x] T006 Unit B — corpus integrated into the shadow-evaluation scheduler (cycle builds corpus instead of skipping; synthetic replay passes null relevance query; stratified holdout by intent class); INTENT_CENTROID_SEEDS exported (shadow-evaluation scheduler)
- [x] T007 Unit C — DOCUMENT-the-asymmetry decision recorded (REQ-003 document branch): divergence is deeper than an exit-handler port (proxy+socket-only backend vs inherit-stdio tethered daemon + idle self-exit); staged C.1 gate / C.2 daemon-mode / C.3 launcher-wiring plan + risk register is the deliverable; launcher mutation is a follow-on packet, inert-until-fresh-session (`mk-code-index-launcher.cjs`)
- [x] T008 [P] Defer-by-design bucket resolved: tri-138 (health token budget) SHIPPED; tri-163 (key_files<->COVERED_BY) REFUTED (COVERED_BY is a deep-loop SLICE relation, not a spec->file edge; reframe offered); tri-129 (write-path stress) DEFER (covered in aggregate by 6 suites; large-payload bound is the one gap, spec'd for follow-on); tri-135 (live-dim eval) ALREADY-CORRECT (eval_run_ablation runs the live profile). :637 RESOLVED earlier (test-fixture schema gap, 41e6f79cbe)
- [x] T009 [P] L9/L2 verify-first tail SWEPT (2026-06-13): FIXED tri-121/122 (finalRank explainability recompute post-dedup); ALREADY-CORRECT tri-124 (flag drift-guard), tri-125 (38 rules/66 fixtures), tri-031 (repair-nodes honest-doc)
- [x] T009b [P] L9/L2 tail remainder COMPLETE: tri-108 (cooperative batch yields), tri-113 (checkpoint-freshness hint), tri-158 (gold-battery anchors), tri-111 (crash-probe receipt), tri-117 (graph value-metrics), tri-138 (health budget), tri-109 (ingest-queue generalization -> background scan) all shipped + committed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify each unit against its safety gate (A: backup+quiesce+per-class record done; B: privacy invariant holds via SENTINEL test; C: no launcher mutation — document-the-asymmetry is the terminal answer this packet)
- [x] T011 Defer-bucket + L9/L2 tail tracked with rationale; no item silently dropped (each has a verify-first verdict: shipped / refuted / deferred / already-correct)
- [x] T012 Documentation updated: spec/tasks/implementation-summary reconciled; strict validate run; parent phase-map row 30 status reflected
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All shippable tasks marked `[x]`; disposed items carry verify-first verdicts
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (per-unit typecheck + targeted suites green)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Inputs**: `../029-deep-research-remediation/handover.md` §3; `../029-deep-research-remediation/ai-council/council-report.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
