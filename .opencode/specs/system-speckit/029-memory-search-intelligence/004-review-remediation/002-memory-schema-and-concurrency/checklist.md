---
title: "Verification Checklist: Memory Schema and Concurrency Remediation"
description: "PENDING verification checklist for the derived-id, in-lock embedding and retention spare-only fixes."
trigger_phrases:
  - "028 memory schema concurrency checklist"
  - "derived-id consolidation retention checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-review-remediation/002-memory-schema-and-concurrency"
    last_updated_at: "2026-07-04T14:10:00.993Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING memory-schema-and-concurrency checklist"
    next_safe_action: "Do not mark items complete until fix and test evidence exists"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-checklist-006-002-memory-schema-and-concurrency"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Memory Schema and Concurrency Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Scope is limited to P1-2, P1-4 and P1-5.
- [ ] CHK-002 [P0] The three cited facts are confirmed against source.
- [ ] CHK-003 [P1] A pre-change DB copy exists before any backfill reconciliation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Backfill and live write produce one `derived_id` for the same logical edge.
- [ ] CHK-011 [P0] The embedding pass runs outside `BEGIN IMMEDIATE`.
- [ ] CHK-012 [P0] The spare axes are re-validated inside the retention transaction.
- [ ] CHK-013 [P1] No default-on runtime path changes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Identity-parity test passes across migration and live.
- [ ] CHK-021 [P0] Lock-behavior test proves the lease stays fresh during embedding.
- [ ] CHK-022 [P0] Forced-interleaving test proves a concurrent trust raise protects the row.
- [ ] CHK-023 [P1] Strict validation exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] All three P1 findings are addressed.
- [ ] CHK-061 [P0] The partial UNIQUE index can dedup the reconciled identity.
- [ ] CHK-062 [P1] Out-of-scope derived-id and temporal-edge P2 items are left for phase 004.
- [ ] CHK-063 [P1] The concurrent session's files and packet 030 remain unchanged.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No data-loss path is introduced by the retention re-validation.
- [ ] CHK-031 [P1] Migration changes stay additive and reversible.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and checklist remain synchronized.
- [ ] CHK-041 [P1] Parent phase map still points to this child.
- [ ] CHK-042 [P2] Fix and test evidence is linked from this child when execution happens.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files or DB copies are committed.
- [ ] CHK-051 [P1] New tests live beside the affected suites.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->
