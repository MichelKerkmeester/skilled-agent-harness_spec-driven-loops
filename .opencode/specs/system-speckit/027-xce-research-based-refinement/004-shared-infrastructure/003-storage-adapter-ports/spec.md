---
title: "Feature Specification: Storage Adapter Ports (Five Divergence Seams)"
description: "Introduce a five-port storage adapter seam (vector, lexical, traversal, maintenance, contention) over the better-sqlite3 layer - hygiene and testability now, backend option-value later."
trigger_phrases:
  - "storage adapter"
  - "database ports"
  - "divergence seams"
  - "backend abstraction"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/003-storage-adapter-ports"
    last_updated_at: "2026-06-11T00:43:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Slice 5 final conservative routing completed and verified"
    next_safe_action: "No remaining 015 implementation work; preserve justified coupling exceptions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-storage-adapter-ports"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Storage Adapter Ports (Five Divergence Seams)

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
| **Priority** | P2 |
| **Status** | Complete - Slices 1-5 verified |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Driver coupling is scattered across roughly 127 production files: vector access, lexical search, graph traversal, maintenance (vacuum/checkpoint family), and contention/retry idioms are implicit better-sqlite3 call sites rather than named seams. This makes storage policy untestable in isolation and turns ANY backend evolution into shotgun surgery. The sqlite-to-turso revalidation (research.md section 8, 004 section 1) identified exactly five genuine divergence seams and estimated a ports layer at 1,200-2,000 LOC; phases 012 (traversal helper) and 014 (packed lexical engine) produce two port implementations as natural byproducts.

### Purpose
A thin, explicitly-typed five-port adapter makes storage behavior unit-testable behind fakes, concentrates driver coupling in one reviewable layer, and converts any future backend pilot (Turso compat, libSQL, or none) into a port-implementation exercise instead of a rewrite.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Port interfaces: VectorStore, LexicalSearch, GraphTraversal, Maintenance, ContentionPolicy - typed, documented, with the current better-sqlite3 implementations extracted behind them
- Port-level fakes for tests; no behavior change (golden evals + existing suites stay green)
- Adoption of 012's traversal helper and 014's packed engine as port implementations
- Migration notes per port documenting the known Turso divergences from the revalidation (informational only)

### Slice 1 Status
- Complete: the five typed interfaces, GraphTraversal adapter over the existing BFS helper, LexicalSearch adapter over the existing packed BM25 engine, five storage-free fakes, and contract tests for the two implemented ports.
- Slice 2 complete: the better-sqlite3 VectorStore adapter now owns the legacy SQLiteVectorStore method bodies, the vector-index export surface routes the legacy class through that port, and VectorStore contract tests cover both the better-sqlite adapter and fake.
- Slice 3 complete: the better-sqlite3 Maintenance adapter now owns the active maintenance pragma idioms for integrity checks, incremental-vacuum maintenance, and WAL checkpoints; retention/reindex call sites route through the port and Maintenance contract tests cover both the adapter and fake.
- Slice 4 complete: the better-sqlite3 ContentionPolicy adapter now owns retry/backoff/write-lock and busy-timeout idioms; checkpoint creation, async busy-retry helpers, analytics DB, and eval DB setup route through the port with identical retry counts, delays, and timeout values.
- Slice 5 complete: final conservative routing moved straightforward GraphTraversal and Maintenance call sites through ports, left fragile hybrid lexical combining unchanged as a justified coupling exception, and recorded residual coupling plus verification evidence.

### Out of Scope
- Any non-better-sqlite3 port implementation (Turso/libSQL pilots are explicitly out of scope here)
- Behavioral changes of any kind - this is a seam-extraction refactor
- system-code-graph and system-skill-advisor DB layers (spec-kit mcp_server only in this phase)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/storage/ports/` (new) | Create | Five port interfaces + better-sqlite3 implementations |
| `mcp_server/lib/search/**`, `lib/storage/**`, `lib/governance/**` | Modify | Call sites route through ports (mechanical, behavior-preserving) |
| `mcp_server/tests/` | Create | Port fakes + contract tests per port |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All five ports defined with the current implementation extracted behind them and zero behavior change (existing test suites + golden evals green before/after) | CI green; eval deltas zero; review confirms no logic edits inside moved code |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Port contract tests exist so an alternative implementation can be validated without the live daemon | Contract suite runs against the better-sqlite3 implementation and a fake |
| REQ-003 | Scope decision recorded at planning: confirm phase-sized execution or promote to a standalone packet (estimate is Level 2-3) | Decision row in plan.md with the chosen split |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Driver coupling concentrated: grep for better-sqlite3 idioms outside the ports layer trends to ~0 in mcp_server lib.
- **SC-002**: A port fake can stand in for storage in unit tests without touching SQLite files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mechanical extraction introduces subtle behavior drift | High | No-logic-edit rule for moved code; golden evals as the gate; small reviewable slices |
| Dependency | Phases 012 and 014 deliver two port implementations | Med | Sequence after both; do not duplicate their work |
| Risk | Scope larger than a phase (1,200-2,000 LOC) | Med | Planning-time decision point: split per-port or promote to standalone packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered for Slice 4: ContentionPolicy stays spec-kit mcp_server-local in this phase; skill-advisor lease retry remains out of scope.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
