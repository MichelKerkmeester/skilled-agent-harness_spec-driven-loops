---
title: "Verification Checklist: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak)"
description: "Verification Date: 2026-06-19 (planning; impl pending). All five candidates PENDING — none in 030 §14."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-governance-vocab verification checklist from 028/002 research"
    next_safe_action: "Begin Unit 1 — pre-migration DISTINCT vocab scan (T001)"
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
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

> **Status:** Planning only. All five candidates PENDING; no implementation yet, so verification items remain unchecked until the impl phase runs.

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
- [ ] CHK-003 [P1] Dependencies identified and available (sibling Q1-C2 `SUPERSEDES`; tombstone machinery; `edge-drift.ts`; live-DB DISTINCT vocab evidence still RED)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (typecheck on `system-code-graph/mcp_server`)
- [ ] CHK-011 [P0] No console errors or warnings on a clean scan + migration
- [ ] CHK-012 [P1] Migration error handling: pre-scan abort is all-or-nothing, names offending values, leaves no half-rebuilt table
- [ ] CHK-013 [P1] Code follows project patterns (CHECK mirrors `parser_skip_list:208`; cap integrates with `edge-drift.ts`; audit EXTENDS tombstones, not a new table)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 CHECK reject/admit; REQ-002 pre-scan abort; REQ-003 round-trip + `SCHEMA_VERSION` bump; REQ-004 `SUPERSEDES` admitted; REQ-005 churn cap; REQ-006 audit extension; REQ-007 derived clock; REQ-008 reversible)
- [ ] CHK-021 [P0] Manual testing complete — pre-migration `SELECT DISTINCT edge_type` scan run against a live DB and recorded (closes iter-024 "no risk" gap)
- [ ] CHK-022 [P1] Edge cases tested (empty table; nullable `tombstone.edge_type`; `deleted_at` ties; high-fan-out heuristic scan; audit retention age-out)
- [ ] CHK-023 [P1] Error scenarios validated (out-of-vocab value aborts migration; cap hit drops + records; crashed migration leaves a clean state)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate classed: closed-vocab = `algorithmic`/schema-constraint; cascade-guard = `class-of-bug`; audit-subgraph = `cross-consumer` (tombstone store); derived-clock = `algorithmic` (order-independence)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: every writer setting `edge_type` (`rg -n "edge_type|edgeType" system-code-graph/mcp_server/lib`) uses a CHECK-admitted vocab value
- [ ] CHK-FIX-003 [P0] Consumer inventory: indexes recreated on the rebuilt table; both prune-order sites updated (`:279`, `:1493`); the `indexer-types.ts:20-22` union kept in sync with the CHECK list
- [ ] CHK-FIX-004 [P0] Migration adversarial table: {in-vocab, out-of-vocab, null tombstone edge_type} × {empty, populated} DBs; derived-clock tested across two arrival orders (no-op / re-order cases)
- [ ] CHK-FIX-005 [P1] Matrix axes listed (spec §L2 edge cases + plan affected-surfaces) before completion claimed
- [ ] CHK-FIX-006 [P1] Hostile env variant: `SPECKIT_CODE_GRAPH_TOMBSTONES` on/off and `SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT` exercised for the audit/retention path
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation: the CHECK is the input-validation boundary for `edge_type`; out-of-vocab writes fail loudly at the driver
- [ ] CHK-032 [P1] N/A — no auth/authz surface; no untrusted content rendered (NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized (completion metadata reconciled at impl close)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY for the table-rebuild + derived-clock key; no ephemeral spec/packet ids in comments)
- [ ] CHK-042 [P2] N/A — no README surface for this internal lib change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (e.g. DISTINCT-scan output) in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 2/11 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-19 (planning; implementation pending)
<!-- /ANCHOR:summary -->
