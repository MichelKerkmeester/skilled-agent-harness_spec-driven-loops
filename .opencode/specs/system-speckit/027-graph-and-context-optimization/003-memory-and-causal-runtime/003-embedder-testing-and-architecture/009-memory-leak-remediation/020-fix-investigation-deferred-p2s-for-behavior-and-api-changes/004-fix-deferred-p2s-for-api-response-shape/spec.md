---
title: "Spec: API Response Shape Closure for F9 F32 F39 F97 F99"
description: "Level 2 packet closing deferred P2 sidecar-client findings for test-only env export separation, worker response aliases, camelCase response naming, and pending-map discriminator narrowing."
trigger_phrases:
  - "020 004 api response shape"
  - "F9 F32 F39 F97 F99 sidecar-client"
  - "sidecar response aliases"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200040200040200040200040200040200040200040200040200040200040200"
      session_id: "020-004-api-response-shape"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 spec folder and branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: API Response Shape Closure for F9 F32 F39 F97 F99

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (020 deferred P2 bucket parent) |
| **Predecessors** | `../001-fix-deferred-p2s-for-test-only-and-shared-exports/decision-record.md`; `../002-fix-deferred-p2s-for-env-and-config-behavior/decision-record.md`; `../003-fix-deferred-p2s-for-filesystem-durability/decision-record.md`; `../../015-deep-research-drift-and-simplification/research/findings-registry.json` |
| **Handoff Criteria** | F9/F32/F39/F97/F99 closed or explicitly DEFERRED-AGAIN; embedders vitest green; mcp-server typecheck green; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five deferred P2 findings remain in the `sidecar-client.ts` API and response-shape surface. F9 exposes a test-only environment helper from production code, F32/F39/F97 require canonical camelCase response fields without a hard break, and F99 reports an unsafe pending-map cast that bypasses request/response discriminator checks.

### Purpose
Close the five findings with bounded public API compatibility, one-release deprecated aliases for legacy response names, focused regression fixtures, and ADRs documenting the testables split, alias policy, and discriminator-narrowing approach.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify `buildSidecarEnv` has no live production consumers, then move the test import surface to `sidecar-client.testables.ts`.
- Keep production `sidecar-client.ts` from exporting `buildSidecarEnv`.
- Identify response fields using legacy snake_case or short names in the sidecar client response surface.
- Return both canonical camelCase names and deprecated legacy aliases for one release cycle.
- Emit a stderr deprecation warning once per process when a legacy alias is read.
- Replace the unsafe pending-map cast with discriminator-narrowing and structured failure for malformed pending entries.
- Add focused fixtures in `sidecar-hardening.vitest.ts`.

### Out of Scope
- Modifying `ensure-rerank-sidecar.cjs`, `sidecar-worker.ts`, `execution-router.ts`, `reindex.ts`, `registry.ts`, or `index.ts`.
- Hard-breaking any legacy response field name during this packet.
- Pushing F99 changes into sibling consumer files. If required, record DEFERRED-AGAIN with the consumer list.
- Git commit, push, or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modify | Remove test-only helper export, add compat alias response shape, and narrow pending-map entries by discriminator |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts` | Modify | Re-export test-only helpers without production public API exposure |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modify | Add F9/F32/F39/F97/F99 regression fixtures |
| `<this-folder>/*.md` | Modify | Record plan, checklist evidence, ADRs, verification, and handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F9 no live production consumer proof | `rg buildSidecarEnv` shows only source/testables/test consumers; any live consumer triggers DEFERRED-AGAIN |
| REQ-002 | F9 testables relocation | Tests import `buildSidecarEnv` from `sidecar-client.testables.ts`; production `sidecar-client.ts` does not export it |
| REQ-003 | F32/F39/F97 canonical naming | Response object exposes camelCase canonical fields for worker-info/dimensions shape |
| REQ-004 | F32/F39/F97 one-release aliases | Response object also exposes legacy field names as deprecated aliases for one release cycle |
| REQ-005 | F32/F39/F97 deprecation warning | Accessing a legacy alias emits a stderr warning once per alias per process |
| REQ-006 | F99 discriminator narrowing | Pending-map handling checks the stored entry discriminator before resolving a response |
| REQ-007 | F99 malformed pending fixture | Invalid pending entries reject with structured `SidecarClientError` instead of reaching unsafe casts |

### P1 - Required (complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Preserve targeted tests | Requested embedders vitest command exits 0, with one F48 retry allowed |
| REQ-009 | Preserve type safety | `npm run typecheck --workspace=@spec-kit/mcp-server` exits 0 |
| REQ-010 | Preserve packet docs | Scaffold and final `validate.sh <spec-folder> --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F9, F32, F39, F97, and F99 are marked closed or explicitly DEFERRED-AGAIN in `checklist.md`.
- **SC-002**: `buildSidecarEnv` is available through `sidecar-client.testables.ts` for tests, not as a production export.
- **SC-003**: Canonical camelCase response fields and deprecated legacy aliases both exist.
- **SC-004**: Legacy alias reads warn once per process.
- **SC-005**: Pending-map response handling narrows by discriminator and rejects malformed entries.
- **SC-006**: All requested verification commands exit 0 unless halt-on-first-regression triggers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Public response-shape changes can break consumers | High | Emit both old and new fields for one release cycle; warning only on legacy access |
| Risk | Alias warning implementation can alter serialization | Medium | Use own properties/getters only where tests prove both names are present and readable |
| Risk | F99 type refactor may propagate to sibling files | High | Halt and DEFERRED-AGAIN if consumer files outside scope must change |
| Dependency | Predecessor bucket edits | Medium | Start from `ac54fd1062` sidecar-client env changes and preserve tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Alias creation and pending-entry validation stay O(1) per response.

### Security
- **NFR-S01**: Deprecation warnings include field names only; no payload vectors or env values are logged.

### Reliability
- **NFR-R01**: Existing legacy response consumers continue to read old names for one release cycle.
- **NFR-R02**: Malformed internal pending entries fail closed with structured error codes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Legacy aliases must reflect the same value as the canonical field and not drift after object creation.
- Warnings must be one per alias per process to avoid stderr spam.

### Error Scenarios
- If `buildSidecarEnv` has live production consumers, implementation stops and ADR documents DEFERRED-AGAIN.
- If F99 requires touching files outside scope, implementation stops and ADR documents touched consumers.

### State Transitions
- This packet starts the one-release compatibility window for legacy response names.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One production file, one testables module, one test file |
| Risk | 18/25 | Public response shape and exported helper surface |
| Research | 10/20 | Requires predecessor diffs, F37 precedent, and findings registry evidence |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. User specified mandatory backward compatibility and DEFERRED-AGAIN criteria.
<!-- /ANCHOR:questions -->
