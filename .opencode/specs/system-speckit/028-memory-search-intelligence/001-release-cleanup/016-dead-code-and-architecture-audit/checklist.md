---
title: "Verification Checklist: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "Verification items for the twenty-pass research program, the evidence gate on every finding, and the no-collateral-writes containment guarantee."
trigger_phrases:
  - "dead code audit checklist"
  - "release cleanup 016 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T05:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Mark pre-implementation items once pre-flight runs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Dead Code, Legacy Artifact and Architecture Simplification Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Audit scope and the six categories documented in `spec.md`
- [ ] CHK-002 [P0] Research program and convergence policy documented in `spec.md` section 4
- [ ] CHK-003 [P0] Executor auth pre-flight passed for all three transports
- [ ] CHK-004 [P0] Five distinct manual-pass focuses declared before the first Devin dispatch
- [ ] CHK-005 [P1] Recovery-baseline commit hash recorded before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Quality of the audit's own output, since this phase produces findings rather than code.

- [ ] CHK-010 [P0] Every finding names a real path that exists in the working tree
- [ ] CHK-011 [P0] Every finding carries a category label from CAT-1 through CAT-6
- [ ] CHK-012 [P1] Findings are ranked by remediation value against blast radius
- [ ] CHK-013 [P1] Every CAT-6 finding proposes a concrete simpler shape and its adoption cost
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Lineage L1 completed 10 passes
- [ ] CHK-021 [P0] Lineage L2 completed 5 passes
- [ ] CHK-022 [P0] All 5 manual Devin passes ran, each on its own declared focus
- [ ] CHK-023 [P0] No lineage terminated on early convergence
- [ ] CHK-024 [P1] A sampled subset of per-finding verification commands was re-run and reproduced
- [ ] CHK-025 [P1] Each lineage's first iteration boundary was checked for a real state write rather than a stall
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Applied here to finding completeness, since remediation itself is deferred to a separate phase.

- [ ] CHK-FIX-001 [P0] Each finding has a class: `dead-code`, `legacy-file`, `residue`, `misplacement`, `architecture`, or `over-engineering`.
- [ ] CHK-FIX-002 [P0] Dead-code candidates checked for dynamic and string-literal references, not just import graphs.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every symbol, script, flag, or path proposed for deletion.
- [ ] CHK-FIX-004 [P0] Every CAT-1 through CAT-4 finding carries a reproducible verification command a reviewer can re-run.
- [ ] CHK-FIX-005 [P1] Cross-pass disagreements recorded rather than silently merged.
- [ ] CHK-FIX-006 [P1] Findings that could not be verified were dropped, not softened into hedged claims.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a recorded commit SHA, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No file outside this spec folder was deleted, moved, or modified
- [ ] CHK-031 [P0] `git status --porcelain` output recorded as evidence at phase close
- [ ] CHK-032 [P1] Pass artifacts are confined to `research/`
- [ ] CHK-033 [P1] No secrets or credentials reproduced in finding evidence excerpts
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `findings-report.md` covers all six categories
- [ ] CHK-041 [P1] `spec.md`, `plan.md` and `tasks.md` are synchronized with what was actually run
- [ ] CHK-042 [P1] `implementation-summary.md` records per-category counts and the remediation handoff
- [ ] CHK-043 [P1] Parent phase map row reflects the real status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
- [ ] CHK-052 [P0] `validate.sh --strict` exits 0 for this folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 15 | 0/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
