---
title: "Tasks: Residual 029 Design Units"
description: "Task Format: T### [P?] Description (file path). Three design units + defer-by-design bucket + L9/L2 verify-first tail, all not-started."
trigger_phrases:
  - "residual design units tasks"
  - "030 tasks"
  - "defer-by-design bucket"
  - "L9 L2 tail"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/030-residual-design-units"
    last_updated_at: "2026-06-13T14:30:00Z"
    last_updated_by: "scaffold-author"
    recent_action: "Enumerated units + defer-bucket + L9/L2 tail as not-started tasks"
    next_safe_action: "Operator review; then start T001 Unit A design note"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:b3db1ff916fb4c6f23bce7c21683241320a90f4d5e406396002455b735916221"
      session_id: "030-scaffold-populate-2026-06-13"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Capture operator decisions for the 3 escalation questions (Unit A per-class reconcile, Unit B corpus model, Unit C parity-vs-document)
- [ ] T002 Draft per-unit design notes before any code (canonical-surface for A, permissible-corpus for B, parity-decision for C)
- [ ] T003 [P] Identify safety harnesses: backup procedure, privacy test, live-daemon adoption harness
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Unit A — vector reconcile: backup -> daemon-quiesce -> per-class reconcile of 6 orphans + 308 non-success + 5 missing-success -> post-health re-check (memory vector store)
- [ ] T005 Unit B — build privacy-preserving hash-class synthetic replay corpus (keys: `query_hash`/intent; NO raw query text) (shadow-evaluation corpus builder)
- [ ] T006 Unit B — integrate the corpus into the shadow-evaluation scheduler + fold Cluster B/C remnants from the L7 disposition (shadow-evaluation scheduler)
- [ ] T007 Unit C — port the packet-140 supervision scaffold (crash-loop guard, `shouldAbortRelaunchOnFire`, relaunch backoff, process-group reap) OR record document-the-asymmetry (`mk-code-index-launcher.cjs`)
- [ ] T008 [P] Defer-by-design bucket — track tri-138 (health token budget), tri-163 (key_files<->COVERED_BY crosswalk, design-first), tri-129/135 (write-path stress + live-dim eval harnesses), L3 (deleted-memory receipt replay validity), and `memory-save-extended:637` NULL content_text (separate-subsystem investigation)
- [ ] T009 [P] L9/L2 verify-first tail — re-confirm still-real BEFORE implementing: tri-108/109, tri-111/113/117/121/122/124, carry-overs 125/158, L2 tri-031
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify each unit against its safety gate (A: backup+quiesce+per-class record; B: privacy invariant holds; C: no flap under adoption harness or recorded decision)
- [ ] T011 Confirm defer-bucket + L9/L2 tail are tracked with rationale; no item silently dropped
- [ ] T012 Update documentation: spec/plan/tasks + parent phase-map row 30; run strict validate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
