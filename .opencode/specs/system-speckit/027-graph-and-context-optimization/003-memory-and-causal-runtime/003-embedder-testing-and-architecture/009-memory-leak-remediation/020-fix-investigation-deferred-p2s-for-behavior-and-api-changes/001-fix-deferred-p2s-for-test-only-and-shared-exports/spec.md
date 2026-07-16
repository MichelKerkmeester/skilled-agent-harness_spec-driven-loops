---
title: "Spec: Test-Only Barrel Export Cleanup for F44 and F109"
description: "Level 2 packet closing deferred P2 findings F44 and F109 by moving test consumers to direct module imports and removing unused barrel re-exports."
trigger_phrases:
  - "020 001 F44 F109"
  - "test-only barrel export cleanup"
  - "listSupportedDimensions EmbedderManifest"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports"
    last_updated_at: "2026-05-23T10:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Parent agent may commit packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-registry.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200010200010200010200010200010200010200010200010200010200010200"
      session_id: "020-001-f44-f109-barrel-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 spec folder and branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Test-Only Barrel Export Cleanup for F44 and F109

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (020 deferred P2 bucket parent) |
| **Predecessor** | `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md` |
| **Handoff Criteria** | F44/F109 closed; embedders vitest green; mcp-server typecheck green; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
F44 and F109 were deferred by arc 017/005 because current tests imported production-dead symbols through public barrels. `listSupportedDimensions` is only needed by registry tests, and `EmbedderManifest` is only needed as a test type through the mcp-server embedders barrel.

### Purpose
Move test consumers to direct source-module imports, then remove the two public barrel exports without changing production runtime behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify `listSupportedDimensions` consumers are test-only before editing.
- Verify `EmbedderManifest` barrel consumers are test-only before editing.
- Refactor test imports to direct source modules.
- Remove `listSupportedDimensions` from `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` if that is the barrel export surface.
- Remove `EmbedderManifest` from `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts`.
- Preserve full embedders vitest and mcp-server typecheck.

### Out of Scope
- Modifying `sidecar-client.ts`, `sidecar-worker.ts`, `execution-router.ts`, `ensure-rerank-sidecar.cjs`, or `reindex.ts`.
- Changing runtime registry behavior or supported manifest content.
- Reworking non-test production consumers. If any live consumer is found, stop and ADR-escalate instead.
- Git commit or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` | Modify | Remove `EmbedderManifest` and `listSupportedDimensions` barrel exports after test consumers move |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-registry.vitest.ts` | Modify | Import `listSupportedDimensions` and `EmbedderManifest` from direct source modules |
| `<this-folder>/decision-record.md` | Create | Record no-live-consumer ADR for barrel export collapse |
| `<this-folder>/*.md` | Modify | Record plan, checklist evidence, verification, and handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prove F44 has no non-test consumer | `rg -l "listSupportedDimensions" .opencode/` results are grouped and no live source consumer depends on the barrel export |
| REQ-002 | Prove F109 has no non-test barrel consumer | `rg -l "EmbedderManifest" .opencode/` results are grouped and no live source consumer imports the mcp-server barrel type |
| REQ-003 | Refactor tests before export deletion | Typecheck passes after test import changes and before removing barrel exports |
| REQ-004 | Remove unused barrel exports | Typecheck passes after the exports are deleted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve embedder tests | `vitest run mcp_server/tests/embedders/` exits 0 |
| REQ-006 | Preserve packet docs | `validate.sh <spec-folder> --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F44 and F109 are marked closed in this packet's checklist.
- **SC-002**: Public barrel no longer exports the test-only `listSupportedDimensions` and `EmbedderManifest` members.
- **SC-003**: Test consumers import from direct source modules.
- **SC-004**: Embedders vitest, mcp-server typecheck, and strict spec validation all exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hidden live consumer of removed barrel export | High | Halt if grep finds any live source importer beyond the barrel/source definitions |
| Risk | Import path crosses package boundary incorrectly | Medium | Use existing compiled `.js` import style and verify with workspace typecheck |
| Dependency | mcp-server package tooling | Medium | Run the requested workspace typecheck and embedders vitest commands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime code path or manifest construction changes.

### Security
- **NFR-S01**: No secrets, credentials, env propagation, file IO, or process behavior changes.

### Reliability
- **NFR-R01**: Test coverage for the registry remains green after direct imports.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Direct source import must reference the canonical shared registry/type module, not duplicate the symbols locally.

### Error Scenarios
- If any non-test consumer is found, implementation stops and `decision-record.md` records the consumer list plus migration plan.

### State Transitions
- Barrel export deletion happens only after test consumers compile through direct imports.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One barrel and one expected test file |
| Risk | 8/25 | Public surface deletion, but expected test-only consumers |
| Research | 5/20 | Requires grep verification and predecessor evidence |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. User specified the direct-import cleanup path and halt condition.
<!-- /ANCHOR:questions -->
