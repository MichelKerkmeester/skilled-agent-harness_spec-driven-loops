---
title: "Verification Checklist: memory_save Replay Enrichment Repair"
description: "Verification Date: 2026-06-02"
trigger_phrases:
  - "memory_save enrichment repair checklist"
  - "schema v30 verification"
  - "replay repair acceptance"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored enrichment-repair packet plan from follow-up research"
    next_safe_action: "Implement schema v30 marker + repair-on-replay via gpt-5.5-fast xhigh"
    blockers: []
    key_files:
      - "mcp_server/lib/search/vector-index-schema.ts"
      - "mcp_server/handlers/memory-save.ts"
      - "mcp_server/handlers/save/enrichment-state.ts"
      - "mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-repair-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: memory_save Replay Enrichment Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

> Mark `[x]` only with evidence (test name + pass count, or a file:line). Maps to spec Acceptance Criteria.

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (replay-enrichment hole, schema v30, marker lifecycle). _Evidence:_
- [ ] CHK-002 [P0] Technical approach defined in plan.md (marker + repair-on-replay + scan backfill). _Evidence:_
- [ ] CHK-003 [P1] Dependencies identified: `runPostInsertEnrichmentIfEnabled()`, packet 005 `memory-index.ts` region, deploy gate. _Evidence:_
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `SCHEMA_VERSION === 30` in `lib/search/vector-index-schema.ts`. _Evidence:_
- [ ] CHK-011 [P0] Fresh DB creates all 4 marker columns + the partial index on `status != 'complete'`. _Evidence:_
- [ ] CHK-012 [P0] v29 → v30 migration is idempotent (second run is a no-op) and defaults existing rows to `complete`. _Evidence:_
- [ ] CHK-013 [P1] Marker helpers in `enrichment-state.ts` stay synchronous; only repair functions await enrichment and reuse `runPostInsertEnrichmentIfEnabled()` (no duplicated enrichment logic). _Evidence:_
- [ ] CHK-014 [P1] `dedup.ts` helpers remain synchronous; repair runs in the async caller after the sync verdict. _Evidence:_
- [ ] CHK-015 [P1] `memory-index.ts` backfill edit is additive and in a distinct region from packet 005's edit (lines 249-333). _Evidence:_
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All spec Acceptance Criteria (REQ-001..REQ-007) met. _Evidence:_
- [ ] CHK-021 [P0] `pending` written inside the primary transaction (atomic with the row); marker flips to `complete` after enrichment returns. _Evidence:_
- [ ] CHK-022 [P0] `unchanged` and `duplicate` replay of a `pending` row repairs → `complete`; `complete` replay is a no-op (edge/row counts stable). _Evidence:_
- [ ] CHK-023 [P1] `deferred` is not repaired on normal replay. _Evidence:_
- [ ] CHK-024 [P1] `memory_index_scan` repairs a bounded set under the lease + reports the count. _Evidence:_
- [ ] CHK-025 [P1] Repairing twice yields identical FTS/vector/graph state (stable counts). _Evidence:_
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: this is a `cross-consumer` + `algorithmic` (idempotent repair) fix across schema, save path, dedup returns, and scan lease. _Evidence:_
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'SCHEMA_VERSION|post_insert_enrichment' mcp_server/lib/search/vector-index-schema.ts`. _Evidence:_
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed symbols: `rg -n 'runPostInsertEnrichmentIfEnabled|post_insert_enrichment_status|needsEnrichmentRepair' mcp_server --glob '*.ts'`. _Evidence:_
- [ ] CHK-FIX-004 [P0] Idempotency adversarial cases tested: no-op replay of `complete`, `deferred` skip, repeated-repair stability (edge/row counts). _Evidence:_
- [ ] CHK-FIX-005 [P1] Matrix axes listed: status {pending, complete, partial, failed, deferred} × replay {unchanged, duplicate} × source {replay, backfill}. _Evidence:_
- [ ] CHK-FIX-006 [P1] Migration variant executed against both a fresh DB and a v29 upgrade fixture. _Evidence:_
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. _Evidence:_
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced by the new marker columns or helpers. _Evidence:_
- [ ] CHK-031 [P0] Marker columns are written only from internal enrichment state (no new external input / trust boundary). _Evidence:_
- [ ] CHK-032 [P1] No new SQL is built from untrusted strings; migration uses guarded DDL only. _Evidence:_
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized. _Evidence:_
- [ ] CHK-041 [P1] No code comment embeds spec paths / packet ids / phase numbers / ADR-REQ-CHK-task ids (durable WHY only). _Evidence:_
- [ ] CHK-042 [P2] Deploy-gated note carried in implementation-summary continuation notes. _Evidence:_
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Any scratch/test DBs are throwaway and not committed. _Evidence:_
- [ ] CHK-051 [P1] No edits leak outside the 4 in-scope files (no launcher/front-proxy, no packet 005 checkpoint files). _Evidence:_
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 17 | [ ]/17 |
| P2 Items | 3 | [ ]/3 |

**Verification Date**: 2026-06-02
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-1..ADR-4). _Evidence:_
- [ ] CHK-101 [P1] All ADRs have a status (Accepted). _Evidence:_
- [ ] CHK-102 [P1] Rejected alternatives documented: in-transaction enrichment, scan-only backfill. _Evidence:_
- [ ] CHK-103 [P2] Migration path documented (v29 → v30, additive defaulted columns). _Evidence:_
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Save-path latency unchanged vs v29 (only the `pending` marker write joins the primary txn). _Evidence:_
- [ ] CHK-111 [P1] Backfill is bounded by an explicit limit under the scan lease (no unbounded re-enrichment). _Evidence:_
- [ ] CHK-112 [P2] Partial index keeps backfill scans cheap (only non-`complete` rows). _Evidence:_
- [ ] CHK-113 [P2] No mass re-enrichment storm on upgrade (history defaults to `complete`). _Evidence:_
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Deploy boundary respected: no `dist/` rebuild, no daemon restart, no live-DB migration in this packet. _Evidence:_
- [ ] CHK-121 [P0] Rollback documented: revert branch pre-deploy; columns are additive + defaulted so they sit inert if a deploy already ran. _Evidence:_
- [ ] CHK-122 [P1] Deploy gate (open question) recorded: confirm window separately; drain v29 sessions or confirm safe under the single-writer lease. _Evidence:_
- [ ] CHK-123 [P1] Production stays on v29 until an explicit confirmed deploy. _Evidence:_
- [ ] CHK-124 [P2] Deployment runbook note reviewed before any restart. _Evidence:_
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Change reviewed for replay-idempotency correctness (no duplicate rows/edges). _Evidence:_
- [ ] CHK-131 [P1] No new third-party dependencies introduced. _Evidence:_
- [ ] CHK-132 [P2] DDL is guarded and safe to re-run (no destructive operations). _Evidence:_
- [ ] CHK-133 [P2] Data handling unchanged; only enrichment-completion metadata is added. _Evidence:_
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized for this packet. _Evidence:_
- [ ] CHK-141 [P1] `validate.sh --strict` passes for this packet (Errors: 0). _Evidence:_
- [ ] CHK-142 [P2] Marker status semantics table documented (pending/complete/partial/failed/deferred). _Evidence:_
- [ ] CHK-143 [P2] Continuation/handover note captures the deploy gate. _Evidence:_
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Deploy gatekeeper | [ ] Approved | |
| Implementer | Technical owner | [ ] Approved | |
| Reviewer | QA / correctness | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
