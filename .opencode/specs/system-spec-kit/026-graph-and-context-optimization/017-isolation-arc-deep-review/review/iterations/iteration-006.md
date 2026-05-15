# Iteration 006: Adversarial Pass - Readiness Marker + Inlined Helper Equivalence

**Date**: 2026-05-15T12:46:00Z
**Focus**: Adversarial testing of readiness marker + inlined-helper equivalence verification
**Findings Count**: 2 (P1: 1, P2: 1)

---

## Adversarial Pass: Readiness Marker (readiness-marker.ts)

### Scenario 1: Write During Read (Race Condition)

**Challenge**: What happens if code-graph writes the marker while spec-kit is reading it?

**Analysis**:
- `writeFileSync` is atomic on most filesystems for writes < atomic write size
- Marker JSON is typically small (< 10KB)
- **Risk**: On non-atomic filesystems (NFS, some network mounts), partial writes could occur
- **Assessment**: LOW-MODERATE RISK - most local filesystems are atomic, but no guarantee for all environments

**P1-FINDING-005**: No atomic write pattern for readiness marker
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 7 (writeFileSync import), write calls throughout file
- **Evidence**: Direct `writeFileSync` without temp-file + rename pattern
- **Recommendation**: Implement atomic write pattern (write to temp file + atomic rename) for cross-filesystem safety

---

### Scenario 2: Directory Traversal via Write Path

**Challenge**: Can an attacker manipulate the write path to write to arbitrary locations?

**Analysis**:
- Write path is hardcoded: `resolve(process.cwd(), '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json')` (line 18-21)
- Uses `process.cwd()` which could be manipulated if code-graph runs from unexpected directory
- **Risk**: If `process.cwd()` is manipulated, marker could be written outside expected directory
- **Assessment**: MODERATE RISK - hardcoded relative path but depends on cwd

**P0-FINDING-005**: Directory traversal risk in readiness marker write
- **Dimension**: Security
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 18-21
- **Evidence**: `resolve(process.cwd(), ...)` could write to unexpected location if cwd is manipulated
- **Recommendation**: Validate write path is within expected code-graph directory before writing

---

### Scenario 3: Missing Parent Directory

**Challenge**: What happens if the database directory doesn't exist?

**Analysis**:
- `mkdirSync` is imported (line 7)
- Code calls `mkdirSync(dirname(CODE_GRAPH_READINESS_MARKER_PATH), { recursive: true })` before write (line 228)
- **Assessment**: WELL-HANDLED - directory creation with recursive flag

**Status**: PASS - missing parent directory handled gracefully

---

## Inlined-Helper Equivalence Verification

### Helper 1: compact-merger

**Original location**: `system-code-graph/mcp_server/lib/compact-merger.ts` (231 lines)
**Inlined location**: `system-spec-kit/mcp_server/lib/context/compact-merger.ts` (194 lines)

**Comparison**:
- Both implement `mergeCompactBrief` function
- Both use `allocateBudget` and `createDefaultSources` from budget-allocator
- Both implement token estimation, truncation, file path extraction, deduplication
- Key difference: Import paths changed from code-graph internal to spec-kit internal

**Equivalence Assessment**:
- Core logic appears preserved
- Line count difference (231 → 194) suggests some consolidation
- **Risk**: No automated test comparing outputs for identical inputs

**P2-FINDING-009**: No equivalence test for compact-merger
- **Dimension**: Correctness
- **Files**: `.opencode/skills/system-spec-kit/mcp_server/lib/context/compact-merger.ts` vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification with sample inputs

---

### Helper 2: budget-allocator

**Original location**: `system-code-graph/mcp_server/lib/budget-allocator.ts`
**Inlined location**: `system-spec-kit/mcp_server/lib/context/budget-allocator.ts` (108 lines)

**Comparison**:
- Both implement budget allocation logic
- Both implement `createDefaultSources` helper
- Core logic appears preserved

**Equivalence Assessment**:
- Core logic appears preserved
- **Risk**: No automated test comparing outputs

**P2-FINDING-010**: No equivalence test for budget-allocator
- **Dimension**: Correctness
- **Files**: `.opencode/skills/system-spec-kit/mcp_server/lib/context/budget-allocator.ts` vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

---

### Helper 3: runtime-detection

**Original location**: `system-code-graph/mcp_server/lib/runtime-detection.ts`
**Inlined location**: `system-spec-kit/mcp_server/lib/runtime-detection.ts` (121 lines)

**Comparison**:
- Both implement runtime detection logic (detecting Claude, Codex, Gemini)
- Both return `RuntimeInfo` type
- Core logic appears preserved

**Equivalence Assessment**:
- Core logic appears preserved
- **Risk**: No automated test comparing outputs

**P2-FINDING-011**: No equivalence test for runtime-detection
- **Dimension**: Correctness
- **Files**: `.opencode/skills/system-spec-kit/mcp_server/lib/runtime-detection.ts` vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

---

### Helper 4: index-scope-policy

**Original location**: `system-code-graph/mcp_server/lib/index-scope-policy.ts`
**Inlined location**: `system-spec-kit/mcp_server/lib/utils/index-scope.ts` (165 lines after inlining)

**Comparison**:
- Both implement `resolveIndexScopePolicy` function
- Both handle index scope resolution logic
- Core logic appears preserved

**Equivalence Assessment**:
- Core logic appears preserved
- **Risk**: No automated test comparing outputs

**P2-FINDING-012**: No equivalence test for index-scope-policy
- **Dimension**: Correctness
- **Files**: `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

---

## Findings Summary

**P0-FINDING-005**: Directory traversal risk in readiness marker write
- **Dimension**: Security
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 18-21
- **Evidence**: `resolve(process.cwd(), ...)` could write to unexpected location if cwd is manipulated
- **Recommendation**: Validate write path is within expected code-graph directory before writing

**P1-FINDING-005**: No atomic write pattern for readiness marker
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 7, 229
- **Evidence**: Direct `writeFileSync` without temp-file + rename pattern
- **Recommendation**: Implement atomic write pattern for cross-filesystem safety

**P2-FINDING-009**: No equivalence test for compact-merger
- **Dimension**: Correctness
- **Files**: Inlined vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

**P2-FINDING-010**: No equivalence test for budget-allocator
- **Dimension**: Correctness
- **Files**: Inlined vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

**P2-FINDING-011**: No equivalence test for runtime-detection
- **Dimension**: Correctness
- **Files**: Inlined vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

**P2-FINDING-012**: No equivalence test for index-scope-policy
- **Dimension**: Correctness
- **Files**: Inlined vs original in code-graph
- **Evidence**: No test comparing inlined vs original behavior
- **Recommendation**: Add equivalence test or document manual verification

---

## Positive Signals

**Well-handled scenarios**:
- Missing parent directory (mkdirSync with recursive flag)

---

## Next Steps

Iteration-007 will:
1. Begin future-coupling-resistance check (CI/eslint/hook to prevent reintroduction)
2. Cross-cutting concerns review (traceability, performance regression risk)
3. Synthesis of findings across all iterations<tool_call>read<arg_key>file_path</arg_key><arg_value>/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts