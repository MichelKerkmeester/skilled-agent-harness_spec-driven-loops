---
title: "Spec: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers"
description: "Level 2 child phase closing 7 P1 findings in sidecar-client.ts: F18, F20, F25, F57, F62, F73, F91."
trigger_phrases:
  - "arc 010 003 003 sidecar-client p1"
  - "F18 F20 F25 F57 F62 F73 F91 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "codex"
    recent_action: "Closed 7 sidecar-client P1 findings"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0100030030100030030100030030100030030100030030100030030100030030"
      session_id: "010-003-003-sidecar-client-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F20 required a narrow execution-router type import change as the sibling EmbedOptions definer."
      - "F57 is distinct after F79 because signal sequencing still benefited from one grace-period helper."
---

# Spec: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers

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
| **Handoff Criteria** | 7 P1 closed; embedders vitest green; typecheck PASSED; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sidecar-client.ts` retained several P1 issues from arc 010/001 deep research: production constructor options still blurred into test-only knobs (F18), `EmbedOptions` existed twice (F20), trivial single-call helper indirection hid the flow (F25), termination still split signal/exit sequencing across duplicate paths (F57), response handling used unsafe post-parse assertions instead of discriminator narrowing (F62), `ready()` had no production role in the sidecar execution path (F73), and `embed()` validation was a nested cascade (F91).

### Purpose
Close all 7 P1 findings with leaf-scoped TypeScript edits, keep sidecar behavior stable, add fixture coverage for F18/F57/F62, and record the decisions and verification evidence in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 P1 fixes in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`.
- Narrow F20 type consolidation in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`.
- Negative compile-time fixture in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts`.
- Runtime fixtures in `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`.
- Spec docs in this folder.

### Out of Scope
- Sidecar worker changes (010/003/001).
- Execution-router policy or shutdown-hook behavior changes (010/003/002).
- Launcher, reindex, barrel, registry, schema, or review-artifact changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modify | F18, F20, F25, F57, F62, F73, F91 surgical edits |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modify | F20 import canonical `EmbedOptions` only |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts` | Create | F18 compile-time production/test option fixture |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modify | F57 and F62 runtime fixtures; remove `ready()` fixture dependence |
| `<this-folder>/*.md` and metadata JSON | Modify | Level 2 packet docs and handoff evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close F18, F20, F25, F57, F62, F73, and F91 | Each finding listed in checklist.md with file:line evidence; vitest and typecheck pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Add at least 3 new fixtures | F18 negative typecheck, F57 grace-period sequencing, and F62 unknown-type response fixtures pass |
| REQ-003 | Preserve sidecar request behavior | Existing sidecar-hardening tests and full embedders vitest pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 7 P1 findings closed
- **SC-002**: 3 new fixtures pass
- **SC-003**: full embedders vitest PASSED
- **SC-004**: typecheck PASSED
- **SC-005**: strict validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing `ready()` can break tests that used it as a worker-start seam | Med | Convert tests to start workers through real `embed()` paths and observe `getWorkerInfo()` |
| Risk | Unknown response narrowing may reject malformed responses earlier | Low | Reject with structured `SidecarClientError` and fixture unknown discriminator |
| Risk | F20 needs execution-router type-only change despite router behavior being out of scope | Low | Limit edit to importing canonical `EmbedOptions` and deleting the duplicate interface |
| Dependency | F79 prior lifecycle simplification | Low | Preserve single-promise termination while consolidating remaining signal sequencing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: unknown sidecar response discriminators must reject the matching pending request with a structured client error.

### Maintainability
- **NFR-M01**: production options remain minimal, with test-only constructor knobs isolated in `SidecarClientTestOptions`.
- **NFR-M02**: helper functions remain only where they encode a meaningful seam or non-trivial validation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty embed input returns `[]` without starting a worker.
- Batches above `MAX_EMBED_INPUTS` fail before worker dispatch.
- Unknown response `type` values reject only the pending request matching the response id.

### Error Scenarios
- SIGTERM-ignoring child receives SIGKILL only after the explicit grace period.
- Test-only constructor fields remain accepted through `SidecarClientTestOptions` but fail when assigned to `SidecarClientOptions`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 2 source files, 1 testable fixture file, 1 vitest file, 7 findings |
| Risk | 14/25 | F57/F62 behavioral paths need focused fixtures; F73 changes tests |
| Research | 4/20 | Findings and F37/F79 precedents already researched |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. F57 was treated as distinct from F79 because F79 removed the dual-promise lifecycle, while F57 targeted duplicated signal/exit sequencing inside that lifecycle.
<!-- /ANCHOR:questions -->
