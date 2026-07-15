---
title: "Verification Checklist: Code-Graph Edge Write-Time Governance (closed-vocab CHECK done, siblings deferred)"
description: "Verification Date: 2026-06-19. Closed-vocab edge_type CHECK is implemented and verified. Churn cap, audit-subgraph and derived-clock siblings remain deferred."
trigger_phrases:
  - "edge governance verification"
  - "closed vocab check checklist"
  - "edge_type migration verification"
  - "churn cap audit derived clock checklist"
  - "code graph edge governance verify"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified closed-vocab edge_type CHECK migration and tests"
    next_safe_action: "Keep automatic CHECK rollout disabled until owner approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-006-edge-governance-vocab"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Edge Write-Time Governance (closed-vocab CHECK done, siblings deferred)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

> **Status:** Closed-vocab edge governance is implemented and verified. Churn cap, audit-subgraph and derived-clock siblings remain deferred and are not part of this scoped completion.

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..008, five candidates scoped, all PENDING)
- [x] CHK-002 [P0] Technical approach defined in plan.md (anchor migration + 3 additive siblings, phase deps)
- [x] CHK-003 [P1] Dependencies identified and available (sibling Q1-C2 `SUPERSEDES`, tombstone machinery, `edge-drift.ts`, live-DB DISTINCT vocab evidence verified on 2026-06-19)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (typecheck on `system-code-graph/mcp_server`). Evidence: `npm run typecheck` exit 0, comment hygiene exit 0 on modified code/test files.
- [x] CHK-011 [P0] No console errors or warnings on a clean scan + migration. Evidence: focused Vitest migration path ran cleanly. Live DB scan was read-only.
- [x] CHK-012 [P1] Migration error handling: pre-scan abort is all-or-nothing, names offending values, leaves no half-rebuilt table. Evidence: `code-edge-governance-vocab.vitest.ts` seeds out-of-vocab live/tombstone values and asserts no rebuild table remains.
- [x] CHK-013 [P1] Code follows project patterns (CHECK mirrors `parser_skip_list:208`, cap/audit/derived siblings deferred). Evidence: `code-graph-db.ts` implements table-rebuild UP/DOWN/BACKFILL helpers and default-off flag.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Closed-vocab acceptance criteria met (REQ-001 CHECK reject/admit, REQ-002 pre-scan abort, REQ-003 round-trip + `SCHEMA_VERSION` bump, REQ-004 `SUPERSEDES` admitted, REQ-008 reversible for Unit 1). REQ-005..007 are deferred sibling units.
- [x] CHK-021 [P0] Manual testing complete: pre-migration `SELECT DISTINCT edge_type` scan run against a live DB and recorded (closes iter-024 "no risk" gap).
- [x] CHK-022 [P1] Edge cases tested for closed-vocab scope (default-off flag, opt-in init, nullable `tombstone.edge_type`, populated table, rollback, rerun). Deferred sibling edge cases remain future work.
- [x] CHK-023 [P1] Error scenarios validated for closed-vocab scope (out-of-vocab value aborts migration, no half-rebuilt table, CHECK rejects invalid insert).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate classed: closed-vocab = `algorithmic`/schema-constraint, cascade-guard = `class-of-bug`, audit-subgraph = `cross-consumer` (tombstone store), derived-clock = `algorithmic` (order-independence). Evidence: spec marks closed-vocab done and siblings deferred.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: every writer setting `edge_type` uses a CHECK-admitted vocab value. Evidence: `EDGE_TYPES` includes all live writer values and `SUPERSEDES`. Live DB scan found only admitted values.
- [x] CHK-FIX-003 [P0] Consumer inventory: indexes recreated on the rebuilt table, `indexer-types.ts` union kept in sync with the CHECK list. Prune-order sites are deferred sibling work.
- [x] CHK-FIX-004 [P0] Migration adversarial table covered for closed-vocab scope: in-vocab, out-of-vocab, null tombstone edge_type, opt-in init, populated DB, rollback/rerun. Derived-clock arrival-order test deferred with Unit 4.
- [x] CHK-FIX-005 [P1] Matrix axes listed (spec §L2 edge cases + plan affected-surfaces) before completion claimed.
- [x] CHK-FIX-006 [P1] Hostile env variant covered for closed-vocab flag (`SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` off/on). Tombstone audit retention env variants are deferred with Unit 3.
- [x] CHK-FIX-007 [P1] Evidence pinned to base commit `bb038e19ab` plus explicit command/test outputs in this session. No git commit made.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: the CHECK is the input-validation boundary for `edge_type`. Out-of-vocab writes fail loudly at the driver
- [x] CHK-032 [P1] N/A, no auth/authz surface, no untrusted content rendered (NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized (completion metadata reconciled at impl close)
- [x] CHK-041 [P1] Code comments adequate (durable WHY, no ephemeral spec/packet ids in modified code comments)
- [x] CHK-042 [P2] N/A, no README surface for this internal lib change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files (e.g. DISTINCT-scan output) in scratch/ only, no temp files were created for the live DB scan.
- [x] CHK-051 [P1] scratch/ cleaned before completion, no scratch output created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->
