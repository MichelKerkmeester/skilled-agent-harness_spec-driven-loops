---
title: "Feature Specification: Memory Schema and Concurrency Remediation"
description: "Remediation scope for P1-2 derived-id split, P1-4 embedding-in-lock and P1-5 retention spare-only stale snapshot."
trigger_phrases:
  - "028 memory schema concurrency remediation"
  - "derived-id identity split fix"
  - "consolidation embedding lock fix"
  - "retention spare-only stale snapshot fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING memory-schema-and-concurrency remediation scaffold"
    next_safe_action: "Confirm the three cited concurrency and identity facts before changing code"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-006-002-memory-schema-and-concurrency"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase defines remediation scope only."
      - "The three fixes are executed by a separate seat."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Memory Schema and Concurrency Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | PENDING |
| **Created** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/006-review-remediation` |
| **Phase** | 002 of 004 |
| **Predecessor** | ../001-eval-benchmark-fidelity/spec.md |
| **Successor** | ../003-doc-accuracy/spec.md |
| **Source Review** | `../../review-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three confirmed P1 defects sit in the memory schema and storage layer: a content-addressed identity that splits across the migration versus live-write boundary, a semantic-edge embedding pass that runs inside a write lock without refreshing its maintenance marker and a retention sweep that applies stale pre-transaction delete decisions on its new spare axes. All three are 028's own code. The identity split defeats the cross-DB and replay identity the feature exists to provide. The in-lock embedding can let a competing launcher reap the daemon mid-write. The stale-snapshot delete can wrongly remove a row a concurrent writer just protected. Each is bounded by default-off flags or latent callers today but must be fixed before the features go live.

### Purpose
Fix the derived-id identity split so the same logical edge produces one identity across migration and live, move the consolidation embedding pass out of the write transaction with a refreshed maintenance handle and give the retention spare axes the same in-transaction re-validation discipline that `delete_after` and tier/pin already have. This phase defines that remediation scope, objective and verification only. A separate seat executes the fixes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-2: generated causal-edge `derived_id` splits identity across the migration versus live-write boundary.
- P1-4: semantic-edge embedding runs inside the consolidation `BEGIN IMMEDIATE` write lock with no maintenance-marker refresh.
- P1-5: retention-forgetting spare-only delete decisions are applied from a stale pre-transaction snapshot.

### Out of Scope
- The derived-id and temporal-edge P2 hardening items (dedup-guard skew, `content-id.ts` default fallback, upsert reopen). Those are triaged in phase 004.
- Changing the criterion-4 benchmark or eval driver (phase 001).
- The concurrent session's files (including `shared/algorithms/rrf-fusion.ts`) and packet 030.

### Cited Findings

| ID | Location | Finding (quoted from review-report.md) |
|----|----------|----------------------------------------|
| P1-2 | `lib/search/vector-index-schema.ts:1126` | "Generated causal-edge `derived_id` splits identity across the migration vs live-write boundary because `rule_version` is baked into the content hash. `content-id.ts:67` hashes `rule_version` into the edge identity. The v40 backfill (`vector-index-schema.ts:1126`) hardcodes `legacy-pre-derived-id` while every live caller ... defaults to `causal-edge:v1` (`causal-edges.ts:125`). The same logical edge therefore produces two different `derived_id` values across migration vs live." |
| P1-4 | `lib/storage/consolidation.ts:701` | "Semantic-edge embedding runs inside the consolidation `BEGIN IMMEDIATE` write lock with no maintenance-marker refresh, risking reaper / lease starvation ... A slow provider holding the lock >120-180s lets a competing launcher treat the daemon as stale and reap or respawn it mid-write." |
| P1-5 | `lib/governance/memory-retention-sweep.ts:612` | "Retention-forgetting spare-only delete decisions are applied from a stale pre-transaction snapshot. The spare axes lack the `delete_after` re-validation discipline ... a concurrent writer raising trust or importance above threshold while `delete_after` stays expired loses its protection and the row is wrongly deleted at `line 687`." |

### Fix Intent (quoted)

- P1-2: the same logical edge must produce one `derived_id` across migration and live. The v40 backfill at `vector-index-schema.ts:1126` hardcodes `legacy-pre-derived-id` while live callers default to `causal-edge:v1` (`causal-edges.ts:125`, `content-id.ts:67`). The partial UNIQUE index "only collapses byte-equal ids, so it cannot dedup the split." Align the backfill rule_version with the live runtime default (or reconcile the skew) so the content-addressed cross-DB / replay identity holds.
- P1-4: "generate embeddings outside the immediate transaction and wrap the long phase in a maintenance handle with explicit `refresh()`." The pass must not hold `BEGIN IMMEDIATE` (`line 684`) across the up-to-100-row synchronous `provider.embedEdgeText()` loop, and must honor the maintenance-marker TTL contract.
- P1-5: give the spare axes the in-transaction re-validation that `delete_after` and tier/pin already get. The in-tx rescue (`getRetentionProtectionReason`, `264-272`) checks only tier/pin/edge, never the spare axes that `evaluateSpareOnlyRetention` decides on. The delete decision must be re-validated against fresh `importance_weight`/`quality_score`/`retention_trust_score`/`created_at` inside the transaction before `line 687`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modify later | Align v40 backfill rule_version with the live default and reconcile the skew |
| `mcp_server/lib/content-id.ts` | Investigate later | The `rule_version` is hashed into the edge identity at line 67 |
| `mcp_server/lib/storage/causal-edges.ts` | Investigate later | Live caller defaults to `causal-edge:v1` at line 125 |
| `mcp_server/lib/storage/consolidation.ts` | Modify later | Move the embedding pass out of `BEGIN IMMEDIATE` and add a refreshed maintenance handle |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modify later | Re-validate spare axes inside the transaction before delete |
| `spec.md` | Create | Defines remediation scope and acceptance criteria |
| `plan.md` | Create | Defines fix approach and verification route |
| `tasks.md` | Create | Keeps all remediation work PENDING |
| `checklist.md` | Create | Keeps all verification items PENDING |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Single identity across migration and live | The same logical edge yields one `derived_id` whether backfilled or live-written |
| REQ-002 | Embedding pass outside the write lock | `runSemanticEdgeEmbeddingPass()` no longer runs inside `BEGIN IMMEDIATE` and embeddings are generated before or after the transaction |
| REQ-003 | Maintenance handle with refresh | The long embedding phase opens a maintenance handle and calls `refresh()` per the TTL contract |
| REQ-004 | Spare-axis re-validation in transaction | The in-tx guard re-checks trust, importance, quality and age before applying a spare-only delete |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No default-on regression | All three features stay default-off and the fixes change gated paths only |
| REQ-006 | Concurrency tests added | New tests cover the reaper-starvation and stale-snapshot windows |
| REQ-007 | Identity reconciliation is migration-safe | The backfill change does not corrupt or duplicate existing rows |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A backfilled edge and its live-written twin share one `derived_id`, so the partial UNIQUE index can dedup them.
- The consolidation embedding pass runs outside the immediate transaction with a refreshed maintenance handle, so a slow provider cannot trigger a mid-write reap.
- A concurrent writer raising trust or importance above threshold protects the row from the spare-only delete.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency --strict` exits 0 after the fixes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Identity reconciliation rewrites existing ids | Migration could touch live rows | Backfill only `WHERE derived_id IS NULL` or reconcile skew explicitly, then test on a copy |
| Risk | Moving embedding out of the tx changes ordering | Edges could be embedded against an uncommitted state | Sequence embed-then-commit or commit-then-embed with idempotent writes |
| Risk | Spare-axis re-check adds tx work | Slightly longer transaction | Keep the re-read narrow to the four axes already read by `getCurrentExpiredRow` |
| Dependency | `maintenance-marker.ts` TTL contract | The refresh fix depends on the marker API | Reuse the existing maintenance handle pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- All three features remain default-off. No default-on runtime path changes.
- Schema changes stay additive and migration-safe.
- Concurrency fixes must not introduce new lock contention on the default path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A future call site that omits `ruleVersion` must not silently degrade to the legacy tag and re-introduce the split (tracked as a P2 in phase 004).
- The embedding provider seam is latent today (the only prod caller passes no provider), so the fix must hold once a real provider is wired.
- The stale-snapshot window is narrow and gated by `SPECKIT_RETENTION_FORGETTING_V1` plus active mode, so a deterministic test must force the concurrent-writer interleaving.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Medium | Three lib files plus two investigation surfaces |
| Risk | High | Schema identity and concurrency correctness on storage paths |
| Verification | High | Requires migration-safety and concurrency-window tests |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- For P1-2, is the correct fix to change the backfill rule_version to the live default, or to make the live default match the legacy backfill? The choice must preserve cross-DB and replay identity and is decided during execution.
<!-- /ANCHOR:questions -->
