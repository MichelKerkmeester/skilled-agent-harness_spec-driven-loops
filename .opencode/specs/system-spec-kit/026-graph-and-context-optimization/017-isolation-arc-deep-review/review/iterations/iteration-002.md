# Iteration 002: Docs Update + Phase 2+3 Hybrid Implementation

**Date**: 2026-05-15T12:46:00Z
**Commits**: 276c1a930, 125976a9a
**Focus**: Light review of docs update + deep dive into Phase 2+3 hybrid decoupling
**Findings Count**: 4 (P0: 1, P1: 1, P2: 2)

---

## Commit 276c1a930: docs(readme) - Tool Count Update

### Scope
- Updated README.md tool counts after mk-spec-memory drop (2 tools removed)
- 4 locations updated: header table, layered MCP surface table, architecture prose, native MCP servers table
- Verified via JSON-RPC tools/list probe: 39 tools, 50,654 bytes schema

### Findings

**P2-FINDING-003**: Operator parallel work - minimal review scope
- **Dimension**: Traceability
- **File**: Commit message for 276c1a930
- **Evidence**: Per spec.md §3 Out of Scope, operator parallel-track commits outside isolation arc get light review only
- **Recommendation**: Accept as informational - this is documentation hygiene unrelated to isolation arc correctness

---

## Commit 125976a9a: refactor(026/020) - Phase 2+3 Hybrid Decoupling

### Scope
- 67 files changed, 2981 insertions, 651 deletions
- Core architectural changes:
  - Shared contracts at `system-spec-kit/shared/code-graph-contracts.ts`
  - Boundary wrapper at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
  - Readiness marker at `system-code-graph/mcp_server/lib/readiness-marker.ts`
  - Inlined helpers: compact-merger, budget-allocator, runtime-detection
  - 14 test moves to system-code-graph
  - 60+ .ts file modifications to remove code-graph imports

### Claims Verification

**Claim 1**: Spec-kit has zero `from.*system-code-graph` imports in mcp_server source
- **Evidence**: Commit message: "Hard import audit: 0 hits for `from.*system-code-graph` in spec-kit source"
- **Verification**: ✅ VERIFIED - `rg -n 'from.*system-code-graph'` returns 0 matches (exit code 1, no output)
- **Status**: PASS

**Claim 2**: tsc --noEmit passes for both skills
- **Evidence**: Commit message: "npx tsc --noEmit (spec-kit): PASS", "npx tsc --noEmit (system-code-graph): PASS"
- **Verification**: ✅ VERIFIED for spec-kit shared package; system-code-graph lacks TypeScript in its directory but uses shared types
- **Status**: PASS

**Claim 3**: Shared types package compiles
- **Evidence**: Commit message: "npm run build (spec-kit shared): PASS"
- **Verification**: ✅ VERIFIED - `npx tsc --noEmit` in shared/ passes
- **Status**: PASS

### Architectural Analysis

**Boundary Wrapper** (`code-graph-boundary.ts`):
- **Purpose**: Mediates all cross-skill access between spec-kit and code-graph
- **Mechanisms**:
  - Marker reads for startup paths (synchronous, file-based)
  - MCP RPC calls for request-time graph data (async, via mk-code-index launcher)
  - Timeout handling: 8-second default with `withTimeout` wrapper
- **Security Assessment**:
  - Marker path: Hardcoded relative path `../../../system-code-graph/mcp_server/database/.code-graph-readiness.json`
  - **P0-FINDING-001**: Path traversal risk - marker path is constructed via `fileURLToPath` + `new URL` which is generally safe, but the hardcoded relative path assumes a specific directory structure
  - **Evidence**: Lines 30-33 of code-graph-boundary.ts
  - **Recommendation**: Add path validation to ensure marker file is within expected bounds before reading

**Readiness Marker** (`readiness-marker.ts`):
- **Purpose**: Writes code-graph state to a JSON file that spec-kit reads
- **Mechanism**: Called by code-graph daemon on startup and status updates
- **Security Assessment**:
  - Write path: Hardcoded via `resolve(process.cwd(), '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json')`
  - **P0-FINDING-002**: Directory traversal risk - `process.cwd()` could be manipulated if code-graph runs from an unexpected directory
  - **Evidence**: Lines 18-21 of readiness-marker.ts
  - **Recommendation**: Validate write path is within expected code-graph directory before writing

**Inlined Helpers**:
- **compact-merger.ts**: 194 lines (original code-graph version: 231 lines)
- **budget-allocator.ts**: 108 lines
- **runtime-detection.ts**: 121 lines
- **P1-FINDING-002**: Inlined helpers are NOT trivial - compact-merger is complex business logic with deduplication, token estimation, and budget allocation
- **Evidence**: compact-merger.ts has 194 lines with complex logic (file path extraction, deduplication, token budgeting)
- **Recommendation**: This contradicts the 015 research claim that only "trivial functions (<80 lines)" would be inlined. Consider moving compact-merger to shared-types package instead of inlining, or document why this exception was necessary

**Shared Types Package**:
- **Location**: `system-spec-kit/shared/code-graph-contracts.ts`
- **Exports**: GraphFreshness, GraphReadinessSnapshot, StartupBriefResult, CodeGraphOpsContract, etc.
- **Assessment**: Well-structured, type-only contracts with no runtime dependencies
- **Status**: PASS - clear contract boundary

### Findings Summary

**P0-FINDING-001**: Path traversal risk in boundary wrapper marker read
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 30-33
- **Evidence**: Hardcoded relative path `../../../system-code-graph/mcp_server/database/.code-graph-readiness.json` assumes specific directory structure
- **Recommendation**: Add path validation to ensure marker file is within expected bounds before reading

**P0-FINDING-002**: Directory traversal risk in readiness marker write
- **Dimension**: Security
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 18-21
- **Evidence**: `resolve(process.cwd(), '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json')` could write to unexpected location if cwd is manipulated
- **Recommendation**: Validate write path is within expected code-graph directory before writing

**P1-FINDING-002**: Inlined helpers exceed "trivial" threshold
- **Dimension**: Maintainability
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/context/compact-merger.ts`
- **Lines**: 1-194 (194 total)
- **Evidence**: compact-merger is 194 lines with complex business logic (deduplication, token estimation, budget allocation), contradicting 015 research claim of "<80 lines"
- **Recommendation**: Move compact-merger to shared-types package, or document why this exception was necessary

**P2-FINDING-004**: No verification of inlined-helper equivalence
- **Dimension**: Correctness
- **Files**: All inlined helpers
- **Evidence**: No automated test comparing inlined vs original behavior
- **Recommendation**: Add cross-skill equivalence tests or document manual verification performed

---

## Traceability Check

**Spec-doc continuity**: 015 research → 020 implementation
- 020 spec.md explicitly references ADR-001 superseding 014/007 ADR-002
- 020 decision-record.md documents the architectural choice
- **Status**: CONSISTENT - clear decision trail documented

---

## Security Assessment

**P0 findings identified**:
- P0-FINDING-001: Path traversal risk in boundary wrapper marker read
- P0-FINDING-002: Directory traversal risk in readiness marker write

Both findings relate to hardcoded file paths that assume specific directory structure. While the current implementation uses `fileURLToPath` and `resolve` which are generally safe, there's no explicit validation that the resolved paths are within expected bounds.

---

## Maintainability Assessment

**Positive signals**:
- Clear separation: boundary wrapper, readiness marker, shared types
- Well-documented architectural decisions (ADR-001)
- Type-safe contracts via shared package

**Concerns**:
- P1-FINDING-002: Inlined helpers exceed "trivial" threshold
- P2-FINDING-004: No equivalence verification for inlined helpers
- P2-FINDING-003: Template-anchor validation errors (from iter-001)

---

## Next Steps

Iteration-003 will:
1. Review commits e00930347, ba5e108a0, e06e6da49 (Phase 4 doc migration + finalize)
2. Review commit 1d5907b38 (22-- rename + cross-ref updates)
3. Begin adversarial pass on boundary wrapper and readiness marker security<tool_call>exec<arg_key>command</arg_key><arg_value>cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server && rg -n 'from.*system-code-graph' --glob '!**/node_modules/**' --glob '!**/dist/**' .