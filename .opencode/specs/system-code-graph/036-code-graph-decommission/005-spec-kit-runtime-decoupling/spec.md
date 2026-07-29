---
title: "Feature Specification: Phase 5: spec-kit-runtime-decoupling"
description: "Remove system-spec-kit's runtime dependency on the code graph: the process-level boundary that spawns the launcher, the shared contracts module, mirrored tool schemas, and the code-graph state threaded through the session and context handlers."
trigger_phrases:
  - "spec kit code graph boundary removal"
  - "code-graph-contracts removal"
  - "session bootstrap code graph decoupling"
  - "context server code graph call"
  - "036 spec kit runtime decoupling"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/005-spec-kit-runtime-decoupling"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-005-spec-kit-runtime-decoupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: spec-kit-runtime-decoupling

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 16 |
| **Predecessor** | 004-plugin-and-hook-removal |
| **Successor** | 006-spec-kit-test-and-harness-cleanup |
| **Handoff Criteria** | The spec-kit MCP server builds and serves with no path, import, or spawn reaching the code graph |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the code graph decommission specification.

**Scope Boundary**: `system-spec-kit` production source only. Its tests, stress harnesses, and matrix runners are phase 006.

**Dependencies**:
- The per-consumer disposition from phase 002, which decides whether the enrichment path degrades or disappears.

**Deliverables**:
- The code-graph boundary module removed and its call sites rewritten.
- The shared contracts module removed.
- Mirrored code-graph tool schemas removed from the spec-kit schema surface.
- Session bootstrap, health, resume, and memory-context handlers no longer report or depend on graph state.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`system-spec-kit` is the deepest consumer. It deliberately calls the code graph through a process boundary — spawning the launcher over stdio rather than importing its modules — so that a CI job could forbid source-level coupling. That design keeps the two packages separable, but it is still a hard runtime dependency: the context server calls `code_graph_context` during enrichment, the session handlers surface graph readiness in their output, and spec-kit carries its own copy of the graph contracts and tool schemas. Removing the target without unpicking these leaves the spec-kit server spawning a launcher that cannot start.

### Purpose
Make `system-spec-kit` self-contained: no spawn, no shared contract, no mirrored schema, and no session output that promises graph state the system can no longer produce.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The boundary module that resolves and spawns the launcher.
- The context server's enrichment call and its surrounding advisory strings.
- The shared code-graph contracts module.
- Code-graph entries in the spec-kit tool-schema surface.
- Graph-state fields in the session bootstrap, health, resume, and memory-context handlers.
- Architecture layer definitions and runtime detection that name the package.

### Out of Scope
- Tests, stress harnesses, and matrix-runner templates — phase 006.
- Reference documentation under the skill — phase 011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts` | Delete | Launcher spawn boundary |
| `.opencode/skills/system-spec-kit/shared/code-graph-contracts.ts` | Delete **only if unimported** | Verify first: types such as `GraphFreshness` and `StructuralReadiness` may still be referenced by surviving spec-kit code independent of the boundary. If so, trim it to the surviving types and keep it as a spec-kit-local file |
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | Modify | Remove the import and the enrichment call |
| `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` | Modify | Remove mirrored code-graph schema entries |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/session-*.ts` | Modify | Remove graph readiness reporting |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts` | Modify | Remove graph-backed context path |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/code-index-cli-fallback.ts` | Delete | CLI fallback for the removed daemon |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No spec-kit source spawns the launcher | No reference to the launcher path remains in production source |
| REQ-002 | The package builds cleanly | TypeScript build succeeds with no unresolved import |
| REQ-003 | Session output makes no graph claim | Bootstrap, health, and resume payloads omit graph fields rather than reporting them unavailable |
| REQ-004 | Context enrichment degrades deliberately | The enrichment path is removed, not left calling a dead tool |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Advisory strings no longer recommend graph tools | No handler emits guidance naming a removed tool id |
| REQ-006 | Layer definitions drop the package | Architecture metadata no longer lists it as a layer participant |
| REQ-007 | Consumers of removed exports are updated | No module imports a symbol that no longer exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The spec-kit MCP server starts and serves `memory_context` with the graph path absent, not failing.
- **SC-002**: A build and typecheck of the package pass with zero unresolved references.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Session output silently loses a field consumers expect | Downstream hooks misread the payload | Update the payload shape and its tests together in phase 006 |
| Risk | Enrichment quality drops without notice | Context retrieval quietly degrades | Record the accepted quality change in the phase 002 decision record |
| Dependency | Phase 002 disposition | Remove-versus-fallback undecided | Do not start until the record is ratified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the session payload keep a stable field reporting that structural context is unavailable, or drop the field entirely?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
