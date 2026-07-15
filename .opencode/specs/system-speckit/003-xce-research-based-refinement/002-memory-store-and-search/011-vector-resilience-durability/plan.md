---
title: "Implementation Plan: Vector Resilience Durability"
description: "Persist vector-shard repair intent with a per-shard sentinel, resume pending repair during shard attach, and clear stale degraded-vector health when reindex completion proves the shard was rebuilt. Verification uses temp-fixture Vitest coverage plus TypeScript, strict spec validation, and comment-hygiene checks."
trigger_phrases:
  - "vector shard repair sentinel"
  - "boot attach repair resume"
  - "clear degraded vector state"
  - "reindex completion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/011-vector-resilience-durability"
    last_updated_at: "2026-06-11T08:50:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Verified sentinel-backed repair resume"
    next_safe_action: "Monitor vector repair regressions"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vector-resilience-durability-2026-06-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a separate vector-shard repair sentinel instead of reusing checkpoint `.needs-rebuild`."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Vector Resilience Durability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, better-sqlite3, sqlite-vec |
| **Framework** | System Spec Kit MCP server |
| **Storage** | SQLite main memory database plus profile-specific vector shards |
| **Testing** | Vitest with mocked embedder registry and temp filesystem fixtures |

### Overview
The implementation adds a per-shard repair-pending sentinel in the active database `checkpoints/` directory. Quarantine writes the sentinel before renaming the shard aside, boot attach resumes the repair when the sentinel is present, and reindex completion clears both the sentinel and degraded-vector state when it rebuilds the affected shard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.
- [x] Live shard and host daemon constraints documented.

### Definition of Done
- [x] All acceptance criteria met.
- [x] TypeScript check passes.
- [x] Targeted Vitest coverage passes.
- [x] Strict spec validation passes.
- [x] Comment-hygiene grep is clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small durability extension to the existing vector-shard quarantine and reindex orchestration flow.

### Key Components
- **Quarantine path**: Computes the quarantine path, writes the repair sentinel atomically, then renames the shard and sidecars aside.
- **Sentinel helper**: Stores one repair-pending file per shard basename under `checkpoints/`, separate from checkpoint `.needs-rebuild` derived-artifact repair.
- **Boot attach**: Reads the sentinel for the active profile shard and schedules repair when the normal probe did not already quarantine the shard.
- **Reindex completion**: Records rebuild completion and clears the sentinel for repair jobs and matching non-repair reindexes.
- **Observability**: Clears stale active job identity when completion targets the same degraded shard.

### Data Flow
Corrupt shard detection writes the sentinel, quarantines the shard, and schedules repair. If the process restarts before repair completion, `attachActiveVectorShard` sees the sentinel, marks degraded-vector health as quarantined, schedules the same repair reindex, and leaves the sentinel in place until the reindex completion path clears it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `vector-index-store.ts` quarantine helpers | Detects bad shards, renames them aside, and schedules repair in memory. | Add durable sentinel write before rename and boot attach resume. | Restart-durability Vitest case and existing quarantine test. |
| `reindex.ts` completion path | Marks repair jobs complete only when in-memory repair context is present. | Clear sentinel and degraded state for repair context or matching non-repair reindex. | Clear-degraded Vitest case. |
| `retrieval-observability.ts` degraded snapshot | Tracks degraded state, last shard, and active repair job. | Clear stale active job id when completion matches the degraded shard. | Clear-degraded Vitest case. |
| Test harness | Exercises temp vector shard corruption and rebuild. | Add restart sentinel and non-repair reindex coverage with socket sandbox. | `npx vitest run tests/vector-shard-read-path-resilience.vitest.ts`. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read target quarantine, sentinel, attach, and reindex completion code.
- [x] Read existing vector-shard read-path resilience test.
- [x] Confirm tests can use temp roots and mocked embedders only.

### Phase 2: Core Implementation
- [x] Add per-shard repair-pending sentinel helpers.
- [x] Write sentinel before quarantine rename.
- [x] Resume repair from sentinel during active shard attach.
- [x] Clear sentinel and degraded state from rebuild completion.
- [x] Clear stale degraded state when a normal reindex rebuilds the same shard.

### Phase 3: Verification
- [x] Add restart-durability regression coverage.
- [x] Add clear-degraded regression coverage.
- [x] Run final TypeScript, Vitest, spec validation, and comment-hygiene gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type check | MCP server TypeScript compile surface | `npx tsc --noEmit` |
| Integration | Corrupt shard quarantine, sentinel persistence, repair resume, reindex health cleanup | `npx vitest run tests/vector-shard-read-path-resilience.vitest.ts` |
| Spec validation | Packet document contract and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Hygiene | Code comments do not contain spec paths, phase labels, or requirement IDs | `rg` comment-hygiene patterns on modified code/tests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | External package | Green | Tests and shard attach cannot run without SQLite. |
| `sqlite-vec` | External package | Green | Existing vector table path remains under the current fallback behavior. |
| Existing embedder mock seam | Internal test seam | Green | Regression tests stay deterministic and offline. |
| Spec validator | Internal workflow | Green | Completion claim requires strict validation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript, targeted Vitest, strict spec validation, or comment-hygiene checks fail without a safe local fix.
- **Procedure**: Revert the sentinel helper additions, boot resume call, reindex completion cleanup, observability active-job clearing, and new test assertions as one packet-scoped change.
<!-- /ANCHOR:rollback -->
