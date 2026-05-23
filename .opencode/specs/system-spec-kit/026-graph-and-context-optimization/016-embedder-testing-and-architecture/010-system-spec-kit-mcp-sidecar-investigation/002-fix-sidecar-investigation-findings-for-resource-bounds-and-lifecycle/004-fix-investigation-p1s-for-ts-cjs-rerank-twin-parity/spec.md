---
title: "Spec: Investigation P1 Fixes for TS CJS Rerank Twin Parity"
description: "Level 2 child phase for selected P1 drift and parity findings F1, F2, F3, F37, F38, F69, F70, F101, and F102."
trigger_phrases:
  - "arc 010 ts cjs rerank parity"
  - "F1 F2 F3 F37 F38 F69 F70 F101 F102 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-parity-p1-child"
    next_safe_action: "implement-drift-parity-P1s"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100020040100020040100020040100020040100020040100020040100020040"
      session_id: "010-002-004-parity"
      parent_session_id: null
    completion_pct: 0
---
# Spec: Investigation P1 Fixes for TS CJS Rerank Twin Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 004 of 004 |
| **Predecessor** | `../003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle/spec.md` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The registry's P1 `drift|python|cjs|parity` selection contains nine findings where TypeScript, CJS, and Python sidecar contracts disagree or their canonical source is unclear.

### Purpose
Align TS/CJS/Python sidecar contracts so ledger rows, owner tokens, health payloads, config hashing, backend normalization, and public comments describe the same behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F1, F2, F3, F37, F38, F69, F70, F101, F102.
- Evidence sources: `../../001-deep-research-drift-and-simplification/research/research.md` and `../../001-deep-research-drift-and-simplification/research/findings-registry.json`.
- Parity tests asserting equivalence across TS/CJS/Python where behavior crosses runtime boundaries.

### Out of Scope
- P0 temp-file randomness owned by child 001, except where F69 parity adds locking around the same ledger surface.
- P1 resource caps owned by child 002, except where F101 parity resolves the shared health cap.
- Unselected P1 dead-code, simplification, and refinement findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49,136,164-170,178-187` | Modify | Align health payload cap, config hash default, JS ledger locking, and liveness handling with Python. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:80-82,140` | Modify if parity requires | Align Python health/config behavior with JS decision. |
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:94-104,150-161,187-189` | Modify if parity requires | Align ledger lock and liveness contract. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31,80,106-117,229-233` | Modify | Align backend kind, env naming, and public options contract. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:46-55,211-216` | Modify | Align backend kind normalization with sidecar-client. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts:4` | Modify | Update canonical-location comment or move implementation to the documented shared location. |
| `.opencode/skills/**/tests/**` | Modify/Create | Add parity tests for selected contracts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | TS/CJS/Python ensure helpers produce the same ledger row shape and owner-token contract. | Parity tests or shared helper coverage prove equivalent output for selected F1, F69, F101, and F102 paths. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Parity tests assert equivalence across the boundary. | Checklist rows include tests for each selected drift contract or a documented reason the finding is resolved by deletion. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Config hash default revision behavior is identical or explicitly documented.
- **SC-002**: Backend kind normalization has one canonical implementation or parity-backed duplicates.
- **SC-003**: JS ledger writes match Python locking guarantees.
- **SC-004**: Health payload and liveness behavior no longer drift across JS/Python.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared helper extraction creates more churn than parity tests. | Larger blast radius than the finding requires. | Prefer parity tests unless a shared helper is already local pattern. |
| Risk | Health cap choice conflicts with child 002. | Duplicate fixes or contradictory caps. | Coordinate F85/F101 by documenting the final cap in both summaries if both phases touch it. |
| Dependency | Python and Node tests | Cross-runtime parity needs both toolchains. | Record missing environment separately instead of weakening the contract. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should backend normalization move to `@spec-kit/shared/embeddings/types.js`, or should local duplicates remain with parity tests? Resolve during implementation based on existing import boundaries.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- File locking, temp file, owner-token, and liveness contracts do not diverge between sibling implementations.

### Reliability
- JS and Python helpers produce compatible sidecar reuse decisions.

### Maintainability
- Comments and public options match actual production behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty revision string vs omitted revision.
- Concurrent ledger writes from JS and Python helpers.
- Health payload just above and below the chosen cap.
- Unknown liveness error in one runtime but not the other.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Rerank JS/Python parity | Medium | F1, F69, F101, and F102 cross runtimes. |
| Backend/env drift | Medium | F2, F3, F38, and F70 may share a canonical helper decision. |
| API surface drift | Small | F37 can be narrowed or documented. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Signal | Score | Rationale |
|--------|-------|-----------|
| Cross-runtime behavior | 20 | JS, CJS, and Python parity decisions. |
| File count | 15 | Multiple embedder and rerank helper files. |
| Test complexity | 10 | Parity tests may need both toolchains. |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
