---
title: "Spec: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack"
description: "Level 2 child phase for closing arc 010 P0 findings F12, F13, and F47 with bounded resource handling and crypto-strong temp file creation."
trigger_phrases:
  - "arc 010 p0 sidecar fixes"
  - "F12 F13 F47 remediation"
  - "resource exhaustion symlink attack"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-p0-remediation-child"
    next_safe_action: "implement-F12-F13-F47-bounds"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100020010100020010100020010100020010100020010100020010100020010"
      session_id: "010-002-001-p0"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Finding source is arc 010/001 research.md and findings-registry.json."
---
# Spec: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 001 of 004 |
| **Predecessor** | None |
| **Successor** | `../002-fix-investigation-p1s-for-resource-bounds-and-input-validation/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Arc 010/001 found three P0 security issues where sidecar IPC and ledger writes can consume unbounded resources or use predictable filesystem names. The affected findings are F12, F13, and F47.

### Purpose
Close all P0 findings with bounded-resource guarantees, crypto-strong temporary file names, and defense-in-depth tests proving the new limits.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F12: `security:sidecar-client:unbounded-json-parsing-resource-exhaustion`
- F13: `security:ensure-rerank-sidecar:predictable-temp-file-names-symlink-attack`
- F47: `security:sidecar-worker:unbounded-json-parsing-resource-exhaustion`
- Targeted tests for max line length, max buffer size, max input length, and exclusive temp-file creation.

### Out of Scope
- P1/P2 sidecar simplification or API surface cleanup.
- Research artifact edits under `../../001-deep-research-drift-and-simplification/research/`.
- Source changes unrelated to F12, F13, and F47.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:476-497` | Modify | Add max line length and max stdout buffer handling before JSON parsing. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs:167-169` | Modify | Replace predictable temp suffix with crypto-random suffix and exclusive creation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132` | Modify | Add max line length and input array length validation before JSON parsing/allocation. |
| `.opencode/skills/system-spec-kit/**/tests/**` | Modify/Create | Add defense-in-depth tests for the P0 contracts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close all 3 P0 findings with bounded-resource guarantees and crypto-strong temp file names. | F12, F13, and F47 checklist rows are `closed` with commit and test evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Add defense-in-depth tests asserting the new bounds. | Tests fail before the fix or assert explicit rejection/termination behavior for oversized inputs. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Oversized stdout/stderr lines and accumulated buffers cannot grow without a configured cap.
- **SC-002**: Worker stdin rejects oversized JSON lines and oversized `input` arrays before large allocation.
- **SC-003**: Ledger temp files are created with unpredictable names and exclusive creation semantics.
- **SC-004**: Strict validation for this phase and its parent exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cap values are too small for valid embedding batches. | Legitimate indexing may fail. | Use documented defaults from research: 1MB line limit and around 500 inputs unless implementation evidence requires adjustment. |
| Risk | Exclusive temp-file write breaks existing ledger tests. | Test fixtures may need deterministic dependency injection. | Keep production randomness while injecting dependencies only in tests. |
| Dependency | Existing sidecar tests | Missing coverage can hide regressions. | Add targeted Vitest/CJS tests near existing sidecar test suites. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; implementation may adjust cap constants if existing batch-size evidence requires it.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- Parsing limits fail closed and cannot be bypassed by partial-line accumulation.
- Temp files cannot be pre-created through predictable names or symlink tricks.

### Reliability
- Rejection paths clean up pending requests and child processes deterministically.

### Maintainability
- Cap constants are named and tested rather than embedded as unexplained literals.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A line exceeds the cap before a newline arrives.
- Multiple chunks collectively exceed the max buffer size.
- Worker receives a valid JSON envelope with too many input strings.
- Temp file path already exists because another process won the race.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| F12 | Small | Client stdout buffering and tests are localized. |
| F13 | Small | Requires crypto random suffix and exclusive write semantics. |
| F47 | Small | Worker parser and input validation are localized. |
| Verification | Small | Targeted tests plus strict spec validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Signal | Score | Rationale |
|--------|-------|-----------|
| Security risk | 20 | P0 denial-of-service and symlink attack findings. |
| File count | 10 | Three implementation surfaces plus tests. |
| Cross-runtime behavior | 5 | CJS ledger write behavior must preserve testability. |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
