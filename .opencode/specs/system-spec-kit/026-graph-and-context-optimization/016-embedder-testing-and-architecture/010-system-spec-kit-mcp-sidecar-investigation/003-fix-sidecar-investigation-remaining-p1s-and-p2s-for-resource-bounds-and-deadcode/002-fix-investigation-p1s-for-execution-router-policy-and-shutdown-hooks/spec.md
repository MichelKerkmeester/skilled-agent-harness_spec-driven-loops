---
title: "Spec: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks"
description: "Level 2 child phase closing 7 P1 findings in execution-router.ts: F6, F31, F52, F53, F58, F61, F74."
trigger_phrases:
  - "arc 010 003 002 execution-router p1"
  - "F6 F31 F52 F53 F58 F61 F74 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks"
    last_updated_at: "2026-05-23T06:22:00Z"
    last_updated_by: "codex"
    recent_action: "closed-execution-router-p1s"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0100030020100030020100030020100030020100030020100030020100030020"
      session_id: "010-003-002-execution-router-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Spec: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks

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
| **Handoff Criteria** | 7 P1 closed; embedder vitest green; typecheck PASSED; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`execution-router.ts` has 7 P1 findings from arc 010/001 deep-research. The defects cluster around production API hygiene, pure resolver boundaries, dimension fallback correctness, signal-hook shutdown semantics, and a zero-caller readiness method.

### Purpose
Close F6, F31, F52, F53, F58, F61, and F74 with surgical router edits, isolate test-only seams in a test-only module, add fixture coverage for the fallback/shutdown behavior, and keep the child packet independently verifiable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 P1 fixes in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`.
- A test-only import seam in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts`.
- Fixture tests in `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts`.
- This packet's Level 2 docs, optional decision record, description metadata, graph metadata, and scratch marker.

### Out of Scope
- `sidecar-worker.ts`, covered by phase 001.
- `sidecar-client.ts`, covered by phase 003.
- Launcher, reindex, barrel, registry, schema, and type cleanup covered by later phases.
- P2 execution-router findings, deferred to phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modify | F31, F52, F53, F58, F61, F74 surgical edits and testable internal exports |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts` | Create | F6 test-only seam that removes `__embedderExecutionRouterTestables` from production router exports |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Create/Modify | Fixture coverage for policy, fallback, mismatch warning, shutdown hook, and deleted ready surface |
| `<this-folder>/spec.md` | Modify | Packet scope and acceptance anchors |
| `<this-folder>/plan.md` | Modify | Implementation and verification plan |
| `<this-folder>/tasks.md` | Modify | Finding-specific task ledger |
| `<this-folder>/checklist.md` | Modify | Verification checklist and finding evidence |
| `<this-folder>/implementation-summary.md` | Modify | Completion evidence after verification |
| `<this-folder>/decision-record.md` | Create | ADRs for test seam, fallback policy, and shutdown hook semantics |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove production export of `__embedderExecutionRouterTestables` (F6) | Production router exports no `__*Testables` object; tests import from `execution-router.testables.ts` |
| REQ-002 | Keep `resolveExecutionPolicy` pure (F31) | Invalid env logging is emitted by caller-side logging helper, not inside the resolver |
| REQ-003 | Collapse dimension fallback to config then default (F52) | Resolver has explicit config path and default profile path; dead provider/model equality branch is gone |
| REQ-004 | Make fallback dimension mismatch visible (F61) | Mismatch between requested provider/model and default profile emits stderr warning with provider/model/dim context |
| REQ-005 | Simplify shutdown hook registration without fire-and-forget false safety (F53/F58) | Signal handling shares one handler over `[SIGINT, SIGTERM, SIGHUP]`, and ADR documents why process hooks cannot await async cleanup |
| REQ-006 | Delete zero-caller direct adapter readiness API (F74) | `DirectProviderAdapter.ready()` is gone and production grep shows no callers |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Add fixture tests for fallback and warning behavior | Tests assert config override, default fallback, and mismatch warning |
| REQ-008 | Preserve router runtime behavior for direct and sidecar adapters | Existing embedder vitest suite and MCP server typecheck pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F6, F31, F52, F53, F58, F61, and F74 are closed with checklist evidence.
- **SC-002**: At least 3 new execution-router fixture tests pass.
- **SC-003**: `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` exits 0.
- **SC-004**: `npm run typecheck --workspace=@spec-kit/mcp-server` exits 0.
- **SC-005**: `validate.sh <this-folder> --strict` exits 0.
- **SC-006**: **Given** invalid `SPECKIT_EMBEDDER_EXECUTION`, **When** the router selects a policy, **Then** the resolver returns `auto` and logging happens outside the resolver.
- **SC-007**: **Given** explicit dimensions, **When** an adapter is requested, **Then** the explicit value wins.
- **SC-008**: **Given** no explicit dimensions, **When** provider/model differs from the default startup profile, **Then** the default dimension is returned with a stderr warning.
- **SC-009**: **Given** signal hooks are registered, **When** SIGINT/SIGTERM/SIGHUP handlers are attached, **Then** one shared handler shape is registered for all signals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Test-only seam imports internals from production module | Medium | Export named internals only, keep testables object out of production router API |
| Risk | Shutdown hooks cannot truly await async cleanup on process signals | Medium | Keep best-effort cleanup minimal and document caller responsibility in ADR |
| Risk | Dimension warning could become noisy for legitimate default fallback | Low | Warn only when fallback profile provider/model does not match requested provider/model |
| Dependency | Existing startup profile helper | Low | Use current `getStartupEmbeddingProfile()` contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Router helpers must expose only small named seams needed by tests; no production `__*Testables` aggregate export.
- **NFR-M02**: Resolver functions must separate pure decisions from logging side effects.

### Reliability
- **NFR-R01**: Dimension fallback must warn on provider/model mismatch instead of silently returning potentially wrong dimensions.
- **NFR-R02**: Shutdown-hook behavior must not imply awaited cleanup where Node process events cannot guarantee it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `SPECKIT_EMBEDDER_EXECUTION` resolves to `auto`.
- Invalid `SPECKIT_EMBEDDER_EXECUTION` resolves to `auto` and logs once from the policy logging helper.
- Explicit positive integer dimensions bypass default fallback.
- Manifest dimensions win before default startup profile.

### Error Scenarios
- Mismatched default startup profile warns on stderr and returns the default dimension.
- Matching default startup profile returns the default dimension without warning.
- Signal shutdown cleanup remains best-effort because signal handlers cannot be awaited before process termination.

### State Transitions
- Test cleanup must clear router adapter/client maps between tests.
- Shutdown hook registration remains idempotent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 1 source file, 1 test seam, 1 execution-router test file, packet docs |
| Risk | 12/25 | Shutdown and fallback behavior need explicit tests and ADRs |
| Research | 4/20 | Findings already researched in arc 010/001 |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Defaults are fixed by this packet: separate testables file for F6, collapse fallback for F52, and document best-effort shutdown-hook semantics for F53.
<!-- /ANCHOR:questions -->
