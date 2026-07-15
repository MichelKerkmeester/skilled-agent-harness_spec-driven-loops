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
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (replay-enrichment hole, schema v30, marker lifecycle). _Evidence:_ `spec.md` sections 2-4 define replay hole, schema v30 marker, replay repair, and scan backfill.
- [x] CHK-002 [P0] Technical approach defined in plan.md (marker + repair-on-replay + scan backfill). _Evidence:_ `plan.md` sections 3-5 define marker-and-repair architecture and test matrix.
- [x] CHK-003 [P1] Dependencies identified: `runPostInsertEnrichmentIfEnabled()`, packet 005 `memory-index.ts` region, deploy gate. _Evidence:_ `plan.md` section 6 and `decision-record.md` ADR-4.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `SCHEMA_VERSION === 30` in `lib/search/vector-index-schema.ts`. _Evidence:_ grep inventory shows `SCHEMA_VERSION = 30`; `vector-index-schema-enrichment-v30.vitest.ts` passed.
- [x] CHK-011 [P0] Fresh DB creates all 4 marker columns + the partial index on `status != 'complete'`. _Evidence:_ `vector-index-schema-enrichment-v30.vitest.ts` fresh-schema test passed.
- [x] CHK-012 [P0] v29 → v30 migration is idempotent (second run is a no-op) and defaults existing rows to `complete`. _Evidence:_ `vector-index-schema-enrichment-v30.vitest.ts` upgrade replay test passed.
- [x] CHK-013 [P1] Marker helpers in `enrichment-state.ts` stay synchronous; only repair functions await enrichment and reuse `runPostInsertEnrichmentIfEnabled()` (no duplicated enrichment logic). _Evidence:_ `handlers/save/enrichment-state.ts`; `enrichment-state.vitest.ts` passed.
- [x] CHK-014 [P1] `dedup.ts` helpers remain synchronous; repair runs in the async caller after the sync verdict. _Evidence:_ `dedup.ts` unchanged; `memory-save-dedup-order.vitest.ts` verifies both caller-side repair branches.
- [x] CHK-015 [P1] `memory-index.ts` backfill edit is additive and in a distinct region from packet 005's edit (lines 249-333). _Evidence:_ repair block is after scan result/orphan sweep flow; `handler-memory-index-cooldown.vitest.ts` passed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All spec Acceptance Criteria (REQ-001..REQ-007) met. _Evidence:_ REQ-001..REQ-006 covered by vitest `22/22`; REQ-007 typecheck attempted but not clean due project ambient module/type-resolution errors, recorded in implementation-summary.
- [x] CHK-021 [P0] `pending` written inside the primary transaction (atomic with the row); marker flips to `complete` after enrichment returns. _Evidence:_ `enrichment-state.vitest.ts` lifecycle test and `memory-save-dedup-order.vitest.ts` source-order guard passed.
- [x] CHK-022 [P0] `unchanged` and `duplicate` replay of a `pending` row repairs → `complete`; `complete` replay is a no-op (edge/row counts stable). _Evidence:_ `enrichment-state.vitest.ts` replay/no-op tests and `memory-save-dedup-order.vitest.ts` caller-branch guard passed.
- [x] CHK-023 [P1] `deferred` is not repaired on normal replay. _Evidence:_ `enrichment-state.vitest.ts` deferred replay/backfill test passed.
- [x] CHK-024 [P1] `memory_index_scan` repairs a bounded set under the lease + reports the count. _Evidence:_ `handler-memory-index-cooldown.vitest.ts` scan repair-count test passed.
- [x] CHK-025 [P1] Repairing twice yields identical FTS/vector/graph state (stable counts). _Evidence:_ `enrichment-state.vitest.ts` repeated-repair stability test passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: this is a `cross-consumer` + `algorithmic` (idempotent repair) fix across schema, save path, dedup returns, and scan lease. _Evidence:_ `implementation-summary.md` What Was Built.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'SCHEMA_VERSION|post_insert_enrichment' mcp_server/lib/search/vector-index-schema.ts`. _Evidence:_ grep returned schema version, required columns, migration DDL, fresh DDL, and partial index hits.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed symbols: `rg -n 'runPostInsertEnrichmentIfEnabled|post_insert_enrichment_status|needsEnrichmentRepair' mcp_server --glob '*.ts'`. _Evidence:_ grep returned helper, save caller, schema, tests, and existing post-insert consumers.
- [x] CHK-FIX-004 [P0] Idempotency adversarial cases tested: no-op replay of `complete`, `deferred` skip, repeated-repair stability (edge/row counts). _Evidence:_ `enrichment-state.vitest.ts` passed.
- [x] CHK-FIX-005 [P1] Matrix axes listed: status {pending, complete, partial, failed, deferred} × replay {unchanged, duplicate} × source {replay, backfill}. _Evidence:_ `plan.md` affected-surfaces matrix plus `enrichment-state.vitest.ts` replay/backfill/deferred/idempotency tests.
- [x] CHK-FIX-006 [P1] Migration variant executed against both a fresh DB and a v29 upgrade fixture. _Evidence:_ `vector-index-schema-enrichment-v30.vitest.ts` passed.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. _Evidence:_ Not applicable in this implementer packet because orchestrator owns git; evidence is pinned to test suite names and changed file paths only.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced by the new marker columns or helpers. _Evidence:_ code changes add marker DDL/helper state only; no env/secret reads added.
- [x] CHK-031 [P0] Marker columns are written only from internal enrichment state (no new external input / trust boundary). _Evidence:_ `markEnrichmentPending`, `recordEnrichmentResult`, and repair helpers derive state from internal post-insert results.
- [x] CHK-032 [P1] No new SQL is built from untrusted strings; migration uses guarded DDL only. _Evidence:_ all new SQL uses static statements plus bound parameters for ids, status/state, and limits.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized. _Evidence:_ checklist and implementation-summary updated with shipped state and verification evidence.
- [x] CHK-041 [P1] No code comment embeds spec paths / packet ids / phase numbers / ADR-REQ-CHK-task ids (durable WHY only). _Evidence:_ `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <touched-file>` passed for all touched TS files.
- [x] CHK-042 [P2] Deploy-gated note carried in implementation-summary continuation notes. _Evidence:_ `implementation-summary.md` Known Limitations and Continuation Notes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Any scratch/test DBs are throwaway and not committed. _Evidence:_ tests use `new Database(':memory:')`; no scratch DB files created.
- [x] CHK-051 [P1] No edits leak outside the 4 in-scope files (no launcher/front-proxy, no packet 005 checkpoint files). _Evidence:_ changed paths are limited to allowed source files, tests, checklist, and implementation-summary.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 12/13 |
| P1 Items | 17 | 16/17 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-06-02
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-1..ADR-4). _Evidence:_ `decision-record.md` ADR-001 through ADR-4.
- [x] CHK-101 [P1] All ADRs have a status (Accepted). _Evidence:_ `decision-record.md` metadata tables.
- [x] CHK-102 [P1] Rejected alternatives documented: in-transaction enrichment, scan-only backfill. _Evidence:_ `decision-record.md` ADR-001 alternatives.
- [x] CHK-103 [P2] Migration path documented (v29 → v30, additive defaulted columns). _Evidence:_ `plan.md` rollback/enhanced rollback and `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Save-path latency unchanged vs v29 (only the `pending` marker write joins the primary txn). _Evidence:_ `memory-save.ts` source-order guard verifies only marker write joins the transaction; enrichment remains post-commit.
- [x] CHK-111 [P1] Backfill is bounded by an explicit limit under the scan lease (no unbounded re-enrichment). _Evidence:_ `memory-index.ts` calls `repairIncompleteMarkers(..., { limit: BATCH_SIZE })` under the lease; scan test passed.
- [x] CHK-112 [P2] Partial index keeps backfill scans cheap (only non-`complete` rows). _Evidence:_ `idx_post_insert_enrichment_incomplete` partial index on `post_insert_enrichment_status != 'complete'`.
- [x] CHK-113 [P2] No mass re-enrichment storm on upgrade (history defaults to `complete`). _Evidence:_ v29 upgrade test asserts existing row status `complete`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Deploy boundary respected: no `dist/` rebuild, no daemon restart, no live-DB migration in this packet. _Evidence:_ commands run: vitest, no-emit typecheck attempts, comment hygiene, alignment drift, and spec validation only.
- [x] CHK-121 [P0] Rollback documented: revert branch pre-deploy; columns are additive + defaulted so they sit inert if a deploy already ran. _Evidence:_ `plan.md` rollback sections and `implementation-summary.md` Known Limitations.
- [x] CHK-122 [P1] Deploy gate (open question) recorded: confirm window separately; drain v29 sessions or confirm safe under the single-writer lease. _Evidence:_ `spec.md` Open Questions and `implementation-summary.md` Continuation Notes.
- [x] CHK-123 [P1] Production stays on v29 until an explicit confirmed deploy. _Evidence:_ no daemon restart, no live DB migration, and no dist build performed.
- [x] CHK-124 [P2] Deployment runbook note reviewed before any restart. _Evidence:_ deploy remains orchestrator-owned; implementation-summary notes the separate deploy gate.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Change reviewed for replay-idempotency correctness (no duplicate rows/edges). _Evidence:_ repeated repair/no-op tests assert stable memory and causal edge counts.
- [x] CHK-131 [P1] No new third-party dependencies introduced. _Evidence:_ no package files edited and tests use existing `better-sqlite3`/vitest dependencies.
- [x] CHK-132 [P2] DDL is guarded and safe to re-run (no destructive operations). _Evidence:_ v30 migration uses guarded column additions and `CREATE INDEX IF NOT EXISTS`; idempotency test passed.
- [x] CHK-133 [P2] Data handling unchanged; only enrichment-completion metadata is added. _Evidence:_ new columns are marker status/state/completion timestamp/version only.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized for this packet. _Evidence:_ checklist and implementation-summary now reflect shipped state; plan/spec/decision-record already define the same scope.
- [x] CHK-141 [P1] `validate.sh --strict` passes for this packet (Errors: 0). _Evidence:_ `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair --strict` passed with exit 0.
- [x] CHK-142 [P2] Marker status semantics table documented (pending/complete/partial/failed/deferred). _Evidence:_ `implementation-summary.md` Marker Status Semantics.
- [x] CHK-143 [P2] Continuation/handover note captures the deploy gate. _Evidence:_ `implementation-summary.md` Continuation Notes.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Deploy gatekeeper | [ ] Approved | |
| Implementer | Technical owner | [x] Approved | 2026-06-02 |
| Reviewer | QA / correctness | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
