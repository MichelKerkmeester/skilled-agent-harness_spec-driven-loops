---
title: "Implementation Plan: MCP server build fix"
description: "Resolve the missing MCP SDK import failure by repairing the extracted system-code-graph dependency declaration and verifying the system-spec-kit MCP build."
trigger_phrases:
  - "mcp_server build fix"
  - "modelcontextprotocol sdk dependency"
  - "system-code-graph package dependency"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix"
    last_updated_at: "2026-05-14T11:12:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed MCP SDK dependency repair"
    next_safe_action: "Review implementation-summary.md verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/package.json"
      - ".opencode/skills/system-code-graph/package-lock.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000302"
      session_id: "003-mcp-server-build-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fix path: Path A, missing standalone dependency declaration."
---
# Implementation Plan: MCP server build fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | MCP server using `@modelcontextprotocol/sdk` |
| **Storage** | None for this fix |
| **Testing** | `npm run build`, targeted grep checks, narrow Vitest sanity attempt |

### Overview
The extracted `system-code-graph` MCP server imports `@modelcontextprotocol/sdk` from its standalone entrypoint, but the standalone package did not declare that dependency. The build currently passes only because `system-code-graph/node_modules/@modelcontextprotocol` is a symlink into `system-spec-kit/mcp_server/node_modules`; the repair makes the dependency explicit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet spec read first.
- [x] Failing build command rerun against current workspace.
- [x] Import sites, dependency manifests, node_modules state, and ADR-002 topology context inspected.

### Definition of Done
- [x] `npm run build` in `system-spec-kit/mcp_server` exits 0.
- [x] SDK import errors are absent.
- [x] Watched dist files have fresh mtimes and preserve earlier Fix-1 markers.
- [x] Packet docs capture root cause, commands, and verification evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone MCP package dependency ownership.

### Key Components
- **`system-code-graph/mcp_server/index.ts`**: imports the MCP SDK for standalone `system_code_graph` registration.
- **`system-code-graph/package.json`**: now declares the SDK dependency used by the entrypoint.
- **`system-spec-kit/mcp_server` build**: still includes the extracted code-graph TypeScript surface during compilation.

### Data Flow
`system-code-graph/mcp_server/index.ts` imports MCP SDK modules, TypeScript resolves the dependency through package ownership, and `system-spec-kit/mcp_server` can compile the combined include surface without unresolved SDK imports.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-code-graph/package.json` | Standalone package manifest | Added `@modelcontextprotocol/sdk` dependency | `npm ls @modelcontextprotocol/sdk --depth=0` resolves it under `system-code-graph` |
| `.opencode/skills/system-code-graph/package-lock.json` | Standalone package lock metadata | Added root dependency and SDK package entry | Node can resolve the installed SDK; npm registry install was blocked by network |
| `.opencode/skills/system-spec-kit/mcp_server/dist/**` | Runtime JS output | Refreshed watched JS files from compiler output | mtimes `2026-05-14 13:10:34`; grep markers pass |
| TypeScript source under save/retry/error providers | Sibling-owned Fix-1 source | Unchanged | Hard constraint honored |

Required inventories:
- Import inventory: `rg -n "@modelcontextprotocol/sdk" .opencode/skills .opencode/specs`.
- Dependency inventory: `package.json` under `system-spec-kit/mcp_server` declares `^1.24.3`; `system-code-graph/package.json` did not before this fix.
- Node modules invariant: standalone package must not depend on an undeclared symlink into a sibling package for a direct import.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet `spec.md`.
- [x] Reproduced current build command.
- [x] Located ADR-002 standalone MCP topology decision.

### Phase 2: Implementation
- [x] Chose Path A: missing dependency declaration.
- [x] Added `@modelcontextprotocol/sdk` to `system-code-graph` package metadata.
- [x] Avoided TypeScript source changes in sibling-owned files.

### Phase 3: Verification
- [x] `npm run build` exits 0.
- [x] SDK errors absent from build output.
- [x] Watched dist files refreshed and Fix-1 markers verified.
- [x] Docs and metadata updated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Combined `system-spec-kit/mcp_server` TypeScript build | `npm run build` |
| Dependency | Standalone code-graph SDK resolution | `npm ls @modelcontextprotocol/sdk --depth=0` |
| Runtime marker | Dist survival for earlier Fix-1 patches | `grep` on generated JS |
| Sanity | Existing context-server Vitest | Attempted; stale topology expectations fail out of scope |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@modelcontextprotocol/sdk` | External npm package | Green on disk; registry unavailable | Manual lock repair used existing resolved metadata and installed symlink |
| `system-code-graph` standalone topology | Internal | Green | ADR-002 confirms standalone ownership |
| TypeScript shared project force rebuild | Internal | Yellow | `tsc --build --force` hits `EPERM` in `shared/dist`; plain build passes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Standalone `system_code_graph` install unexpectedly rejects the added dependency metadata.
- **Procedure**: Remove `@modelcontextprotocol/sdk` from `.opencode/skills/system-code-graph/package.json` and the matching lockfile entry, then rerun `npm run build` in `system-spec-kit/mcp_server`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Investigation -> Path selection -> Dependency repair -> Build/dist verification -> Packet docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigation | Packet spec | Path selection |
| Path selection | Import and package inventory | Dependency repair |
| Dependency repair | Path A decision | Build verification |
| Build verification | Manifest/lock repair | Completion docs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Investigation | Low | Short |
| Dependency repair | Low | Short, registry blocked |
| Verification | Medium | Extra care for dist refresh and stale tests |
| Documentation | Low | Level-2 packet docs |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Revert only `.opencode/skills/system-code-graph/package.json` and `.opencode/skills/system-code-graph/package-lock.json`.
2. Restore the prior dist files from git if a reviewer rejects the dist refresh.
3. Rerun `npm run build` in `.opencode/skills/system-spec-kit/mcp_server` and confirm the failure mode.
<!-- /ANCHOR:enhanced-rollback -->
