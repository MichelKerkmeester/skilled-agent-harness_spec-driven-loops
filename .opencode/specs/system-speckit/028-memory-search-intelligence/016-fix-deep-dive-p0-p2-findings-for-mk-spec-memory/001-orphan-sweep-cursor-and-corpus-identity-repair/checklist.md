---
title: "Verification Checklist: Orphan Sweep Cursor and Corpus Identity Repair"
description: "P0/P1/P2 verification gates for the cursor persistence fix, the count-verified dead-row drain, and the checkpoint-clean heal/collapse migrations, with evidence slots per item."
trigger_phrases:
  - "orphan sweep cursor checklist"
  - "corpus identity repair verification"
  - "drain heal collapse gates"
  - "checkpoint restore drill evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 verification checklist with evidence slots"
    next_safe_action: "Fill evidence slots as Phase 1 verification tasks close"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-orphan-sweep-cursor-and-corpus-identity-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Orphan Sweep Cursor and Corpus Identity Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001..REQ-010 documented in spec.md with finding citations. Evidence:
- [ ] CHK-002 [P0] Technical approach, affected surfaces, and rollback defined in plan.md. Evidence:
- [ ] CHK-003 [P1] Dependencies identified: checkpoint tooling drill passed, phase 002 forward-dependency recorded, scan quiesce path known. Evidence:
- [ ] CHK-004 [P0] Baseline captured BEFORE any change: whole vitest gate + SQL counts (orphan rows, dup-hash parents, cross-prefix pairs, per-prefix totals) (T005). Evidence:
- [ ] CHK-005 [P0] Confirm-before-fix evidence recorded for every 🟡 finding (#17 projection, path resolution, scope prefix, discovery alignment) (T001-T003). Evidence:
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (mcp_server toolchain). Evidence:
- [ ] CHK-011 [P0] No console errors or warnings introduced in scan/migration paths. Evidence:
- [ ] CHK-012 [P1] Error handling: failed checkpoint aborts the step before mutation; interrupted migrations resume idempotently. Evidence:
- [ ] CHK-013 [P1] Code follows existing migration patterns (v28 precedent, chunked transactions). Evidence:
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All REQ acceptance criteria met (REQ-001..REQ-010 traced to passing checks). Evidence:
- [ ] CHK-021 [P0] SQL success gates pass on the live DB (SQL-level invariant at 001-completion): orphan rows = 0, cross-prefix duplicate active rows = 0, exactly 1 active row per logical key (T028); the search-level one-row-per-doc guarantee is deferred to post-002. Evidence:
- [ ] CHK-022 [P1] Edge cases tested: heal decision-tree matrix rows, chunked parents >2 rows, path-reuse projection scenario, `embedding_status='failed'` rows covered by reconcile projection repoint and track-heal (T031). Evidence:
- [ ] CHK-023 [P1] Error scenarios validated: checkpoint failure abort, mid-chunk interruption resume, watcher-write during step detection. Evidence:
- [ ] CHK-024 [P0] Whole vitest gate re-run after changes; delta vs T005 baseline reported with real numbers. Evidence:
- [ ] CHK-025 [P1] Migration idempotency: re-running heal and collapse after success changes 0 rows. Evidence:
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence:
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (sweep/cursor callers, discovery surfaces), or instance-only status proven by grep. Evidence:
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers and fields: `reconcileMoves`, `active_memory_projection`, `near_duplicate_of`, `normalizeSpecFolderScope`, docs, tests. Evidence:
- [ ] CHK-FIX-004 [P0] Path-resolution fix includes adversarial table tests: relative, absolute, `..` segments, case-variant prefix, symlinked base, no-op, fallback. Evidence:
- [ ] CHK-FIX-005 [P1] Heal decision-tree matrix axes and row count listed (T016) before completion is claimed. Evidence:
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed where code reads process-wide state (cursor persistence across restart). Evidence:
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence:
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced. Evidence:
- [ ] CHK-031 [P0] Path traversal guarded: base-resolved paths never escape the workspace base (NFR-S02). Evidence:
- [ ] CHK-032 [P1] Write scope honored: migrations touch only the memory DB and its checkpoint directory (NFR-S01). Evidence:
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with what actually shipped. Evidence:
- [ ] CHK-041 [P1] Code comments carry the durable WHY only; no spec/packet/finding ids in code comments (comment-hygiene HARD BLOCK). Evidence:
- [ ] CHK-042 [P2] Skill/ENV reference docs updated if sweep or scan semantics described there changed. Evidence:
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (dry-run reports, matrices, baselines) in scratch/ only. Evidence:
- [ ] CHK-051 [P1] scratch/ cleaned or summarized into implementation-summary.md before completion. Evidence:
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending (implementation not started)
<!-- /ANCHOR:summary -->

---

<!-- Level 3 addendum sections below -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 disposal, ADR-002 near_duplicate_of, ADR-003 cursor storage, ADR-004 migration packaging). Evidence:
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted); ADR-001 ratified after T013 data, ADR-002 after T004 format/consumer confirm and T020 winner validation. Evidence:
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale in each ADR. Evidence:
- [ ] CHK-103 [P2] Migration path documented: drain -> heal -> collapse ordering; checkpoint-clean heal/collapse, count-verified drain (no drain checkpoint). Evidence:
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Sweep batches bounded; full drain completes within 24h of scheduled scans (NFR-P01). Evidence:
- [ ] CHK-111 [P1] Migration chunk transactions hold the write lock ~1s or less at 33k rows (NFR-P02). Evidence:
- [ ] CHK-112 [P2] Scan event-loop lag not worsened by cursor persistence (compare against T005 baseline scan timing). Evidence:
- [ ] CHK-113 [P2] Post-repair search-latency spot check recorded (context for phase 010). Evidence:
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented AND tested: checkpoint restore drill passed on a DB copy for heal/collapse (T006); drain rollback documented as restore-by-count-verification (delete only file-absent rows, reconcile counts). Evidence:
- [ ] CHK-121 [P0] Checkpoint id recorded BEFORE each bounded migration step (heal T015, collapse T019); the drain (T012/T014) records the baseline dead-row count and uses count-verification (no checkpoint). Evidence:
- [ ] CHK-122 [P1] Post-step SQL verification queries wired and run after each destructive step. Evidence:
- [ ] CHK-123 [P1] Rollback runbook (command sequence per step) committed in implementation-summary.md. Evidence:
- [ ] CHK-124 [P2] Loser-row ledger handed to phase 002 for read-exclusion verification (T022). Evidence:
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Data-integrity review completed: no valid row deleted (dry-run counts vs baseline reconciled). Evidence:
- [ ] CHK-131 [P1] Dependency licenses unchanged (no new dependencies expected). Evidence:
- [ ] CHK-132 [P2] Destructive-operation policy honored: name-the-rollback before delete/migrate steps. Evidence:
- [ ] CHK-133 [P2] Data handling compliant: memory DB stays local; no content leaves the workspace. Evidence:
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record + implementation-summary at close). Evidence:
- [ ] CHK-141 [P1] Tool-surface behavior changes (scan results cursor field, health labels) documented where those surfaces are described. Evidence:
- [ ] CHK-142 [P2] Parent packet phase map and changelog entry refreshed at close. Evidence:
- [ ] CHK-143 [P2] Knowledge transfer: heal decision tree, winner heuristic, and the `near_duplicate_of` JSON format (for phase 003's save-time lane) recorded for phases 002/003. Evidence:
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead (operator) | [ ] Approved | |
| Michel Kerkmeester | Product Owner (operator) | [ ] Approved | |
| Michel Kerkmeester | QA Lead (operator) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
