---
title: "Spec: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code"
description: "Level 2 child phase closing 7 P1 findings in sidecar-worker.ts: F5, F14, F19, F26, F30, F94, F95."
trigger_phrases:
  - "arc 010 003 001 sidecar-worker p1"
  - "F5 F14 F19 F26 F30 F94 F95 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Closed 7 sidecar-worker P1 findings"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Spec: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (010/003) |
| **Handoff Criteria** | 7 P1 closed; sidecar-hardening vitest green; typecheck PASSED; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sidecar-worker.ts has 7 P1 findings from arc 010/001 deep-research covering: dead model-name fallback (F5), incorrect parent-liveness detection (F14), single-caller helper-function indirection chain (F19), 4 trivial-impl single-call helpers (F26), inconsistent error-message detail across module boundaries (F30), pre-parse failure responses use id=0 with silent loss (F94), cached rejected provider promise persists indefinitely (F95). Each is either a correctness risk (F14, F94, F95) or a dead-code/over-engineering cleanup (F5, F19, F26, F30).

### Purpose
Close all 7 P1 findings with surgical edits, add fixture tests for F14 (parent-liveness), F94 (pre-parse failure id), F95 (rejected-promise eviction), and verify no regressions in sidecar-hardening.vitest.ts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 P1 fixes in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`.
- Fixture tests in `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` for the 3 correctness fixes (F14, F94, F95).
- Spec docs in this folder.

### Out of Scope
- P2 findings on sidecar-worker.ts (deferred to phase 005).
- Touching sidecar-client.ts (phase 003 covers).
- Touching execution-router.ts (phase 002 covers).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modify | F5, F14, F19, F26, F30, F94, F95 surgical edits |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modify | Add F14, F94, F95 fixture tests |
| `<this-folder>/checklist.md` | Modify | Mark 7 findings closed with evidence |
| `<this-folder>/implementation-summary.md` | Modify | Fill Status=Completed, completion_pct=100 |
| `<this-folder>/decision-record.md` | Create (optional) | If non-trivial design choice surfaces during F14 fix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close 7 P1 findings in sidecar-worker.ts | Each finding listed in checklist.md with file:line evidence; vitest sidecar-hardening green |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fixture tests for F14, F94, F95 | Vitest sidecar-hardening passes 3 new test cases |
| REQ-003 | No regression in sibling vitest | `npm run test --workspace=@spec-kit/mcp-server -- tests/embedders/` PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 7 P1 findings closed
- **SC-002**: 3 new fixture tests pass
- **SC-003**: typecheck PASSED
- **SC-004**: strict validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | F14 parent-liveness fix may break legitimate uses | Med | Add fixture for both alive AND dead parent; assert behavior of each |
| Risk | F95 rejected-promise eviction may evict valid retries | Med | Cache eviction only on first rejection, with subsequent calls bypassing cache |
| Dependency | arc 010/002 already closed F88 (processLiveness in launcher) | Low | Pattern for F14 can mirror F88's structured-return approach |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: rejected-promise cache must self-evict; no indefinite memory growth.

### Maintainability
- **NFR-M01**: helper-function consolidation must not reduce test coverage.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `model` env var → F5 fallback chain currently has dead branches; reduce to 1 source-of-truth.
- Parent PID = 1 → F14 must treat as orphaned (already-detached), not alive.
- Pre-parse failure on first message → F94 currently emits id=0 silently; must surface error with explicit id or terminate.

### Error Scenarios
- Provider rejection on first dispatch → F95 cached forever; must clear cache on rejection.
- Concurrent dispatch after rejection → must retry, not return stale rejection.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 1 source file + 1 test file, 7 findings, 3 with new tests |
| Risk | 12/25 | F14 + F95 carry behavioral-change risk; mitigated by fixture coverage |
| Research | 4/20 | Findings already researched in 010/001 |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- F19 + F26 are dead-code/over-engineering cleanups that overlap (helper consolidation). Treat as single refactor or separate edits? Default: single consolidation pass.
- F30 inconsistent error-message detail — adopt one canonical format or document the divergence? Default: canonical `{ phase, code, detail }` per error.
<!-- /ANCHOR:questions -->
