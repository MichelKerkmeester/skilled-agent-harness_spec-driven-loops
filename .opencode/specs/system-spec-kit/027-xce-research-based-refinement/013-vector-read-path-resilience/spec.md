---
title: "Feature Specification: Vector Read-Path Resilience & Performance [template:level_1/spec.md]"
description: "Detect, quarantine, and auto-rebuild corrupted vector shards (a live malformed shard was observed silently degrading search), harden dimension discovery, and benchmark the KNN query shape."
trigger_phrases:
  - "vector shard corruption"
  - "shard auto rebuild"
  - "dimension discovery"
  - "knn benchmark"
  - "vec quick check"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience"
    last_updated_at: "2026-06-10T21:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented vector shard resilience and benchmark gates"
    next_safe_action: "Rerun live-corpus benchmark after live MCP health recovers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-vector-read-path-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Vector Read-Path Resilience & Performance

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A live defect class was observed on 2026-06-10: the active embedder shard context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite reported database disk image is malformed and vec_768 was missing from context-index.sqlite - the provider cascade silently degraded vector search with no health surface, no quarantine, and no rebuild. Separately, dimension discovery falls back to regexing FLOAT[N] out of sqlite_master.sql (vector-index-store.ts:258-273), and the KNN hot path computes scalar vec_distance_cosine in a plain JOIN (vector-index-queries.ts:310-324) - a shape never benchmarked against sqlite-vec's optimized vec0 MATCH form. Source evidence: z_future/sqlite-to-turso context-report.md and 004 - gap-alternatives.md section 2.

### Purpose
Corrupted shards become a detected, quarantined, automatically rebuilt condition with an honest health signal instead of a silent degradation, and the vector read path gets an authoritative dimension source plus a benchmarked query shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shard integrity probe on open/attach (quick_check / schema presence) with quarantine + auto-rebuild via the existing reindex staging + atomic-rename path
- Degraded-vector health surfacing wired into the phase-008 observability counters (additive)
- Authoritative embedding-dimension source (embedder profile/config) replacing the sqlite_master regex fallback
- KNN query-shape benchmark: scalar-distance JOIN vs vec0 MATCH; adopt the winner if the gain exceeds 20%

### Out of Scope
- New vector backends or ANN indexes (alternatives catalogued in z_future research 004)
- Embedder/provider cascade policy changes - only the corruption path is in scope
- Write-path schema changes (phase 003 territory)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-store.ts` | Modify | Integrity probe, quarantine hook, authoritative dims |
| `mcp_server/lib/embedders/reindex.ts` | Modify | Auto-rebuild entry point from quarantine |
| `mcp_server/lib/search/vector-index-queries.ts` | Modify | Adopt benchmarked KNN shape (conditional) |
| `mcp_server/lib/observability/` | Modify | Degraded-vector counters (coordinate with 008) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A malformed shard is detected at open, quarantined (renamed aside), rebuilt automatically when embeddings are derivable, and surfaced in memory_health - never a silent cascade | Fault-injection test: corrupt a copy-fixture shard; observe detect -> quarantine -> rebuild -> healthy |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Dimension discovery reads the embedder profile as the authoritative source; the regex fallback is removed or demoted to last-resort with a warning | Unit test covers profile, schema, and absent-shard cases |
| REQ-003 | KNN shape benchmark (scalar JOIN vs vec0 MATCH) recorded at the live corpus size; winner adopted if >20% faster | Benchmark table in implementation-summary; query change gated on the threshold. **Evidence-pending deferral:** the corpus-32 interim benchmark is recorded (scalar JOIN retained, `MATCH` not >20% faster); the live-corpus-size rerun is deferred — blocked by daemon E040. The scalar-JOIN decision is unchanged unless the live rerun shows `MATCH` >20% faster |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A corrupted shard self-heals end-to-end on a fixture with zero manual steps.
- **SC-002**: No silent vector degradation: health output names the degraded state while it exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auto-rebuild on a live daemon races in-flight queries | Med | Reuse the staging + atomic-rename pattern; rebuild behind the existing single-writer paths |
| Dependency | Phase 008 observability counters | Low | Counters are additive; land independently if 008 is unstarted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: quarantined shard files are retained beside the original path for forensics; no deletion policy was introduced.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
