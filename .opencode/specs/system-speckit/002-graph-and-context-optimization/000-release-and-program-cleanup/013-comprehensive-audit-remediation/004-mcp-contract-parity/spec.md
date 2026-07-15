---
title: "Feature Specification: Phase 4: mcp-contract-parity [template:level_1/spec.md]"
description: "MCP tool contracts drifted across public JSON schema, Zod validation, the allow-list, handlers, and docs, so callers cannot discover real parameters and governance/coverage metadata is validated then silently dropped. This phase realigns the four contract-parity tools and adds a guard test."
trigger_phrases:
  - "mcp contract parity"
  - "tool schema drift"
  - "governance ingest metadata"
  - "embedding reconcile coverage"
  - "stale graph guidance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity"
    last_updated_at: "2026-06-04T20:45:43Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented D1-D7 contract-parity fixes"
    next_safe_action: "Central typecheck and vitest run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-004-mcp-contract-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: mcp-contract-parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `scaffold/004-mcp-contract-parity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-memory-write-correctness |
| **Successor** | 005-metadata-status-derivation |
| **Handoff Criteria** | All seven D-cluster findings fixed or test-only; parity test authored; validate.sh passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the comprehensive audit remediation specification.

**Scope Boundary**: MCP tool contract, schema, ingest, and reconcile surfaces only: `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/types.ts`, `lib/embedders/embedding-reconcile.ts`, `handlers/memory-index.ts`, `handlers/memory-ingest.ts`, `handlers/memory-save.ts`, `lib/ops/job-queue.ts`, `context-server.ts`, plus the new parity test. The code-graph `query.ts` fail-closed block is out of scope and left unchanged.

**Dependencies**:
- Cluster B consumes the cross-cluster `tenantId/userId/agentId` schema fields added here to `memory_drift_why` and `memory_causal_link`.

**Deliverables**:
- Dry-run/apply parity in embedding reconcile coverage (D1).
- `activeOnly` documented as a reserved no-op; `[Phase 007]` token removed (D2).
- Governance metadata threaded through scan and async-ingest paths to the save layer (D3).
- Public schemas for `memory_index_scan` / `memory_ingest_start` expose governance fields (D4).
- Public schema for `memory_causal_stats` exposes the `backfill` object (D5).
- Stale-graph bootstrap guidance corrected to match the false-safe handler (D6).
- New `tool-contract-parity.vitest.ts` guarding public-vs-Zod key parity (D7).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The four contract-parity MCP tools drifted across their public JSON schema, Zod validation schema, the allow-list, the handlers, and the docs. Callers cannot discover governance and backfill parameters that the runtime actually accepts, the embedding-reconcile dry-run undercounts what apply will mutate, governed-ingest metadata is validated then dropped on the bulk scan and async paths, and the bootstrap guidance tells runtimes a stale graph is still queryable when the handler blocks it.

### Purpose
Make every advertised MCP contract honest: public schema, Zod, allow-list, handler behavior, and guidance agree, governed metadata survives all ingest paths, and a parity test prevents future drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Embedding-reconcile coverage predicate parity (D1) and its test fixture.
- Contract honesty for `memory_embedding_reconcile`, `memory_index_scan`, `memory_ingest_start`, `memory_causal_stats` (D2/D4/D5/D7).
- Governance threading through scan + async ingest to the save layer (D3).
- Bootstrap stale-graph guidance correction (D6).
- Cross-cluster schema additions for `memory_drift_why` / `memory_causal_link` (for cluster B).

### Out of Scope
- Re-aligning the already-fixed reconcile schema/Zod/type/allow-list (D2 recalibration) - already consistent.
- Adding runtime branching for `activeOnly` - would weaken the fail-closed safety model.
- Changing `system-code-graph` `query.ts` fail-closed block (D6) - the block is correct.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| lib/embedders/embedding-reconcile.ts | Modify | Dual-surface coverage predicate; reserved-no-op comment (D1/D2) |
| tool-schemas.ts | Modify | activeOnly/[Phase 007] descriptions; governance + backfill public props; cross-cluster causal fields (D2/D4/D5) |
| schemas/tool-input-schemas.ts | Modify | Zod + allow-list for causal tenant/user/agent fields (cross-cluster B) |
| handlers/memory-save.ts | Modify | Thread governance through indexMemoryFile (D3) |
| handlers/memory-index.ts | Modify | Pass governance into indexSingleFile (D3) |
| handlers/memory-ingest.ts | Modify | Persist governance into the ingest job (D3) |
| lib/ops/job-queue.ts | Modify | ingest_jobs governance column + rehydration (D3) |
| tools/types.ts | Modify | ScanArgs governance fields (D3) |
| context-server.ts | Modify | Stale-graph guidance + worker governance forwarding (D3/D6) |
| tests/tool-contract-parity.vitest.ts | Create | Public-vs-Zod parity guard (D7) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | (none - no P0 in this cluster) | n/a |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | D1: reconcile dry-run coverage predicate matches apply repair | computeSuccessCoverage checks rowid OR dim row; test count 2 to 3; apply-parity assertion passes |
| REQ-003 | D2: resolve dead activeOnly param without new runtime branching | Schema + interface describe activeOnly as reserved no-op; `[Phase 007]` token removed |
| REQ-004 | D3: governance threaded through scan and async-ingest paths | indexMemoryFile applies post-insert governance; ingest_jobs persists + rehydrates governance |
| REQ-005 | D7: parity test guards public-vs-Zod key sets for the four tools | tool-contract-parity.vitest.ts compares key sets and fails on drift |
| REQ-006 | D4: public schema exposes governance fields for scan + ingest | memory_index_scan / memory_ingest_start public props include the nine governance keys |
| REQ-007 | D5: public schema exposes the causal_stats backfill object | memory_causal_stats public inputSchema declares nested backfill with dry-run default |
| REQ-008 | D6: stale-graph guidance matches the false-safe handler | Guidance no longer says "still works"; routing rule emits query only for fresh |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Public ListTools property keys equal the Zod shape keys for all four parity tools (D7 test green after D4/D5).
- **SC-002**: A governed scan or async ingest produces memory_index rows carrying provenance/retention/scope metadata, matching the direct save path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cluster B causal post-filter | B is dead code without the causal schema fields | Added optional tenant/user/agent fields to causal schemas here |
| Risk | ingest_jobs schema migration | Med | Additive nullable governance_json column + PRAGMA-guarded ALTER for old tables |
| Risk | Concurrent peer edits to mcp_server | Med | Verification deferred to central typecheck + vitest |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
