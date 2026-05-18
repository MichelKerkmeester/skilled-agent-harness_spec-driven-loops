---
title: "System Code Graph Import Path Cleanup"
description: "Remove stale shared-package emits from mcp_server dist while preserving clean-build runtime startup."
trigger_phrases:
  - "033 system code graph import path cleanup"
  - "mcp_server orphan shared dist"
  - "system-spec-kit shared duplicate emit"
  - "tsconfig rootDir shared cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup"
    last_updated_at: "2026-05-14T15:39:08Z"
    last_updated_by: "codex-gpt5.5-033"
    recent_action: "Removed orphan shared dist emit"
    next_safe_action: "Use npm run build from mcp_server for clean dist"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tsconfig.json"
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-033-system-code-graph-import-path-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The orphan dist/system-spec-kit/shared tree is produced by compile-time source resolution of shared imports combined with rootDir ../..."
      - "Clean build must still publish dist/context-server.js because install docs and runtime configs depend on that entrypoint."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: System Code Graph Import Path Cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `mcp_server` build emitted stale shared-package files under `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/shared/`. Those files duplicated the real `@spec-kit/shared` workspace package output and could drift from `.opencode/skills/system-spec-kit/shared/dist/`, as seen when the orphan `llama-cpp.js` retained old token-budget behavior after source changes landed elsewhere.

### Purpose

Make clean `mcp_server` builds use the workspace `@spec-kit/shared` package for shared runtime code, remove the orphan shared emit tree, and keep the documented `dist/context-server.js` entrypoint valid.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Investigate the root composite config, `mcp_server` tsconfig, shared tsconfig, and shared package exports.
- Prevent `mcp_server/dist/system-spec-kit/shared/` from existing after a clean build.
- Preserve clean-build startup through `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js`.
- Add Level 2 packet documentation and verification evidence.

### Out of Scope

- Source changes in `.opencode/skills/system-spec-kit/shared/`.
- Source changes in `.opencode/skills/system-spec-kit/mcp_server/lib/`.
- Git branch creation, commits, or PR work.
- Memory MCP calls.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Modify | Stop resolving `@spec-kit/shared/*` to source and exclude `../../shared/**` from the mcp_server compile surface. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modify | Run the dist finalizer after `tsc --build`. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs` | Create | Normalize clean build output, rewrite compiled shared imports to `@spec-kit/shared/*`, and remove the orphan shared dist tree. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup/` | Create | Level 2 packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Clean build removes the orphan shared tree | After a moved-aside clean build, `dist/system-spec-kit/shared` does not exist. |
| REQ-002 | Runtime entrypoint still works | `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js --health-check` exits 0 and logs API key validation plus database initialization. |
| REQ-003 | Shared imports resolve through package exports | Compiled sibling imports to shared are rewritten to `@spec-kit/shared/*.js`, relying on `.opencode/skills/system-spec-kit/shared/package.json` exports. |
| REQ-004 | Targeted smoke tests pass | `npx vitest run tests/llama-cpp-token-budget.vitest.ts tests/governance-ephemeral-decouple.vitest.ts` exits 0. |
| REQ-005 | Packet validates strictly | `validate.sh <033-folder> --strict` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Scope stays narrow | No source changes under `shared/` or `mcp_server/lib/`; no branch or commit created. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run build` from `mcp_server` exits 0 after the previous `dist` is moved aside.
- **SC-002**: `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/shared/` is absent after build.
- **SC-003**: `dist/context-server.js` exists after build and passes health-check.
- **SC-004**: The targeted vitest smoke passes 6 tests with 1 skipped test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `rootDir: "../.."` is still needed for direct sibling imports | Tightening `rootDir` alone breaks current compile and runtime import geometry. | Keep the broad compiler root and normalize the final runtime dist layout after build. |
| Risk | Sibling bundles import back into the prefixed system-spec-kit bundle | Rewriting all compiled imports would break those preserved prefixed paths. | Rewrite only flattened root mcp_server sibling imports, while rewriting shared-package imports across dist to `@spec-kit/shared/*.js`. |
| Dependency | `@spec-kit/shared` workspace package | Runtime shared imports rely on `shared/dist` and `package.json` exports. | `npm run build` references `../shared`, so shared output is built before mcp_server. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Build finalization stays local filesystem-only and adds no network dependency.
- **NFR-P02**: Startup health-check performance remains within existing server behavior; this packet does not add runtime startup work beyond import resolution.

### Security

- **NFR-S01**: No secrets or credential material are added.
- **NFR-S02**: The finalizer only copies compiler output within `mcp_server/dist` and deletes the known orphan shared subtree.

### Reliability

- **NFR-R01**: Clean builds keep the documented `dist/context-server.js` entrypoint.
- **NFR-R02**: Shared runtime code is loaded from the single workspace package export surface.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty dist before build: handled by `tsc --build` creating fresh compiler output.
- Missing prefixed mcp_server compiler output: finalizer throws with the expected path.
- Existing orphan shared tree: finalizer removes `dist/system-spec-kit/shared`.

### Error Scenarios

- Relative sibling imports in flattened root files: finalizer rewrites only copied root mcp_server files.
- Relative shared imports in sibling bundles: finalizer rewrites those to `@spec-kit/shared/*.js`.
- Sandbox blocking `rm -rf dist`: verification used a non-destructive `mv dist /private/tmp/...` clean-build equivalent.

### State Transitions

- Pre-build: stale orphan shared files may exist.
- Post-build: shared orphan is absent, root entrypoint exists, and sibling bundle paths remain valid.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Config, package script, small finalizer, and packet docs. |
| Risk | 16/25 | Build output topology is delicate because sibling MCP code is compiled into the mcp_server bundle. |
| Research | 12/20 | Required tsconfig, package exports, clean-build, health, and test verification. |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
