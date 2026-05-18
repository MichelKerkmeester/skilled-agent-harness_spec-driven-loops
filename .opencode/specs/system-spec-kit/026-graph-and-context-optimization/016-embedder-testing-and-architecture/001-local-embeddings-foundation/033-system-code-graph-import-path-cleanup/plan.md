---
title: "Implementation Plan: System Code Graph Import Path Cleanup"
description: "Plan for removing orphan shared dist output from mcp_server clean builds while preserving runtime startup."
trigger_phrases:
  - "033 import path cleanup plan"
  - "mcp_server tsconfig shared plan"
  - "orphan shared dist cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/033-system-code-graph-import-path-cleanup"
    last_updated_at: "2026-05-14T15:39:08Z"
    last_updated_by: "codex-gpt5.5-033"
    recent_action: "Planned dist import cleanup"
    next_safe_action: "Use build and smoke evidence from implementation-summary"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tsconfig.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-033-system-code-graph-import-path-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tight rootDir is not sufficient while mcp_server directly imports sibling MCP TypeScript sources."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: System Code Graph Import Path Cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | Node MCP server workspace |
| **Storage** | Existing SQLite memory database only for health-check |
| **Testing** | `npm run build`, Node health-check, Vitest smoke, strict spec validation |

### Overview

The build should stop emitting duplicate shared-package code under `mcp_server/dist/system-spec-kit/shared`. The chosen approach keeps current sibling MCP compile behavior intact, routes shared imports through the `@spec-kit/shared` workspace package, and finalizes the clean dist layout after `tsc --build`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Actual tsconfig and package exports read before edits.
- [x] Clean-build verification path defined.

### Definition of Done

- [x] `npm run build` exits 0 from `mcp_server`.
- [x] `dist/system-spec-kit/shared` is absent after a clean build.
- [x] `dist/context-server.js --health-check` exits 0.
- [x] Targeted vitest smoke exits 0.
- [x] 033 packet validates with `--strict`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Composite TypeScript build plus postbuild dist normalization.

### Key Components

- **`mcp_server/tsconfig.json`**: owns compile-time resolution and excludes shared source from the mcp_server program.
- **`@spec-kit/shared` package exports**: owns runtime shared modules through `shared/dist`.
- **`scripts/finalize-dist.mjs`**: owns clean-build dist normalization for the documented runtime entrypoint.

### Data Flow

`tsc --build` builds the referenced shared package and emits the mcp_server plus sibling MCP code under the broad `rootDir`. The finalizer copies the compiled mcp_server subtree to the canonical root dist location, rewrites flattened sibling imports, rewrites relative shared imports to `@spec-kit/shared/*.js`, and removes the orphan shared subtree if it exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/tsconfig.json` | Compile surface and package path aliases | Removed the `@spec-kit/shared/*` source alias and excluded `../../shared/**` | `npm run build` exit 0; no `dist/system-spec-kit/shared` |
| `shared/package.json` | Runtime shared export contract | Unchanged; used as the runtime source of truth | Health-check resolves `@spec-kit/shared/unicode-normalization.js` and embeddings factory |
| `mcp_server/package.json` | Build command | Added postbuild finalizer | `npm run build` output includes finalizer command |
| `scripts/finalize-dist.mjs` | Dist normalization | Created | Health-check and vitest smoke pass |

Required inventories:
- Same-class producers: `rg -n "@spec-kit/shared|system-spec-kit/shared" .opencode/skills/system-spec-kit/mcp_server .opencode/skills/system-skill-advisor/mcp_server .opencode/skills/system-code-graph/mcp_server`.
- Consumers of changed build output: install guide and package metadata reference `dist/context-server.js`; health-check verified that entrypoint.
- Matrix axes: stale dist present vs clean dist; root mcp_server files vs prefixed sibling bundles; shared imports via package vs relative orphan path.
- Algorithm invariant: no compiled runtime file should require `dist/system-spec-kit/shared/**`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold Level 2 packet at the bound 033 phase path.
- [x] Read root, mcp_server, and shared tsconfig files.
- [x] Read shared package exports.

### Phase 2: Core Implementation

- [x] Remove shared source path alias from mcp_server tsconfig.
- [x] Exclude `../../shared/**` from mcp_server compile root.
- [x] Add build finalizer for clean dist entrypoint and shared import rewrites.

### Phase 3: Verification

- [x] Move existing `dist` aside to simulate `rm -rf dist` without using a blocked destructive command.
- [x] Run `npm run build`.
- [x] Confirm orphan shared tree is absent.
- [x] Run health-check.
- [x] Run targeted vitest smoke.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Clean mcp_server emit and finalizer | `npm run build` |
| Runtime smoke | MCP startup import resolution and DB init | `node .../dist/context-server.js --health-check` |
| Unit smoke | Token budget and governance behavior | `npx vitest run tests/llama-cpp-token-budget.vitest.ts tests/governance-ephemeral-decouple.vitest.ts` |
| Documentation | Level 2 packet contract | `validate.sh <033-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared` workspace package | Internal | Green | Shared runtime imports fail if `shared/dist` is missing. |
| `mcp_server` direct sibling imports | Internal | Yellow | They force a broad compiler root, so final dist normalization remains necessary. |
| Node ESM package exports | Runtime | Green | `@spec-kit/shared/*.js` resolves through shared package exports. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Clean build, health-check, or targeted vitest smoke fails after this change.
- **Procedure**: Revert `mcp_server/tsconfig.json`, `mcp_server/package.json`, and `mcp_server/scripts/finalize-dist.mjs`, then rebuild from the prior dist behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verification |
| Verification | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Medium | 45 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **90 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Clean build run with previous dist moved aside.
- [x] Runtime health-check run from repository root.
- [x] Targeted vitest smoke run.

### Rollback Procedure

1. Revert the three implementation files.
2. Move a known-good dist backup back only if an immediate local runtime restore is needed.
3. Run `npm run build` from `mcp_server`.
4. Run the health-check again.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->
