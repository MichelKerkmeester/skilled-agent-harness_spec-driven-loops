---
title: "Spec: Investigation P1 Fixes for Resource Bounds and Input Validation"
description: "Level 2 child phase for P1 findings F48, F85, F86, and F87 around resource bounds, input validation, and predictable IDs."
trigger_phrases:
  - "arc 010 resource bounds input validation"
  - "F48 F85 F86 F87 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-resource-bounds-p1-child"
    next_safe_action: "implement-F48-F85-F86-F87"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100020020100020020100020020100020020100020020100020020100020020"
      session_id: "010-002-002-resource-bounds"
      parent_session_id: null
    completion_pct: 0
---
# Spec: Investigation P1 Fixes for Resource Bounds and Input Validation

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
| **Phase** | 002 of 004 |
| **Predecessor** | `../001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack/spec.md` |
| **Successor** | `../003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The registry's P1 resource-bound keyword selection contains F48, F85, F86, and F87. These findings leave local HTTP and IPC paths with predictable or unbounded behavior after the P0 fixes are complete.

### Purpose
Close every selected P1 with explicit caps, validation, or unpredictable IDs, and add tests proving each contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F48: predictable request IDs in sidecar-client.
- F85: unbounded `healthPayload` body accumulation.
- F86: unbounded client embed input array.
- F87: unbounded worker embed input array.
- Evidence sources: `../../001-deep-research-drift-and-simplification/research/research.md` and `../../001-deep-research-drift-and-simplification/research/findings-registry.json`.

### Out of Scope
- P0 fixes owned by child 001.
- TS/CJS/Python parity drift owned by child 004 unless a shared cap contract is needed.
- Research artifact edits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:214,443-444` | Modify | Replace predictable request IDs with random or random-prefixed IDs. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49` | Modify | Add `healthPayload` maximum body size handling, suggested cap 64KB or parity cap. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:82` | Modify if parity requires | Keep Python and JS health cap contracts aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270,433-473` | Modify | Add max embed batch size, suggested cap 500 texts. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132,151-175` | Modify | Mirror the client max input length in worker parsing. |
| `.opencode/skills/system-spec-kit/**/tests/**` | Modify/Create | Add defense-in-depth tests for selected P1 bounds. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every selected P1 is closed with an explicit cap, validation, or unpredictable ID contract. | F48, F85, F86, and F87 checklist rows are `closed` with commit and test evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Defense-in-depth tests cover each selected P1 contract. | Tests assert cap rejection, body accumulation stop, worker/client batch parity, and non-sequential request IDs. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Sidecar request IDs are not predictable from prior requests.
- **SC-002**: Health payload accumulation stops at an explicit byte cap.
- **SC-003**: Client and worker embed input arrays share an enforced maximum.
- **SC-004**: Strict validation for this child and parent exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Client and worker max-batch constants diverge. | One side rejects valid work from the other. | Prefer one shared constant or parity tests. |
| Risk | Random IDs make tests flaky. | Existing tests may assume sequence ordering. | Inject deterministic ID generation only in tests. |
| Dependency | Child 001 P0 parser limits | P1 batch validation should not fight parser rejection semantics. | Implement after P0 caps or preserve compatible constants. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `healthPayload` use the research-suggested 64KB cap or align with Python's 8192-byte cap? Resolve during implementation with parity evidence.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- Request IDs and resource caps reduce local hijacking and denial-of-service risk.

### Reliability
- Oversized input errors are clear and deterministic.

### Maintainability
- Cap values are centralized or parity-tested where two runtimes enforce the same boundary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Exactly-at-cap request body and input arrays.
- One-over-cap request body and input arrays.
- Concurrent requests generated in the same millisecond.
- Spoofed local service streaming an endless health response.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| F48 | Small | Request ID generation is localized. |
| F85 | Small | Health body accumulation is localized, parity may add test work. |
| F86/F87 | Medium | Client/worker cap contract should be kept aligned. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Signal | Score | Rationale |
|--------|-------|-----------|
| Security risk | 15 | P1 resource exhaustion and request ID hardening. |
| File count | 10 | Client, worker, CJS helper, and tests. |
| Cross-runtime behavior | 5 | Health cap may touch Python parity. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
