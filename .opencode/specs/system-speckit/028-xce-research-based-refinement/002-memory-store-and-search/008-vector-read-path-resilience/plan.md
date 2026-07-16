---
title: "Implementation Plan: Vector Read-Path Resilience & Performance"
description: "Add an integrity probe to shard open/attach, quarantine + auto-rebuild corrupted shards through the existing reindex staging path, surface degraded state via health counters, replace regex dimension discovery with the embedder profile, and benchmark the KNN query shape."
trigger_phrases:
  - "013-vector-read-path-resilience plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/008-vector-read-path-resilience"
    last_updated_at: "2026-06-10T21:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented phase plan and verification gates"
    next_safe_action: "Rerun live-corpus KNN benchmark after live memory health recovers"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Vector Read-Path Resilience & Performance

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP daemon |
| **Storage** | SQLite (context-index + vector shards) |
| **Testing** | vitest + eval harness fixtures |

### Overview
Add an integrity probe to shard open/attach, quarantine + auto-rebuild corrupted shards through the existing reindex staging path, surface degraded state via health counters, replace regex dimension discovery with the embedder profile, and benchmark the KNN query shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met, except live-corpus benchmark sizing blocked by live MCP `E040`; isolated benchmark recorded and kept scalar JOIN
- [x] Tests passing: build, new targeted vitest, and existing observability suite
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical refinement of existing mcp_server modules; additive and flag-gated until verification gates pass.

### Key Components
- **Integrity probe + quarantine**: quick_check/schema presence at open; rename-aside + rebuild trigger
- **Authoritative dims**: Embedder profile as source of truth
- **KNN benchmark**: Scalar JOIN vs vec0 MATCH at live corpus size

### Data Flow
shard open -> probe -> healthy: continue | corrupt: quarantine -> reindex rebuild -> health counter cleared.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug-fix packet; surfaces and verification live in the spec Files-to-Change table and the phase checklist below. No security/path/schema-boundary findings in scope.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| See spec.md Files to Change | Read/write paths named there | Modify/Create per spec | Tests + benchmarks listed in Phase 3 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Corruption fixture (truncated/malformed shard copies)
- [x] Baseline KNN benchmark

### Phase 2: Core
- [x] Probe + quarantine + rebuild wiring
- [x] Health counters (coordinate 008)
- [x] Dims from profile

### Phase 3: Verification
- [x] Fault-injection self-heal test green
- [x] Benchmark table recorded; conditional query adoption
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New/changed modules | vitest |
| Integration | End-to-end path on fixtures | vitest + fixture DBs |
| Benchmark | Latency/RAM gates named in spec | recorded in implementation-summary |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 (observability counters) | Internal | Pending | Counters additive; land independently if 008 unstarted |
| Embedder reindex path | Internal | Pending | Rebuild reuses staging + atomic rename |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate failure or behavior drift.
- **Procedure**: Probe and quarantine are additive; disabling the probe flag restores current behavior.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
