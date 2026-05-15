# Iteration 008: Findings Synthesis + Report Draft

**Date**: 2026-05-15T12:46:00Z
**Focus**: Synthesis of all findings across iterations 1-7 + begin drafting review-report.md
**Findings Count**: 0 (synthesis iteration)
**Rolling New-Info Ratio (last 3)**: 0.48 (above 0.10 threshold)

---

## Findings Synthesis

### P0 Findings (5 total)

| ID | Dimension | File | Lines | Description |
|----|-----------|------|-------|-------------|
| P0-FINDING-001 | Security | code-graph-boundary.ts | 30-33 | Path traversal risk in marker read |
| P0-FINDING-002 | Security | readiness-marker.ts | 18-21 | Directory traversal risk in marker write |
| P0-FINDING-003 | Correctness | code-graph-boundary.ts | 98-111 | Race condition in marker read/write |
| P0-FINDING-004 | Security | code-graph-boundary.ts | 30-33, 94-96 | Insufficient path validation in marker read |
| P0-FINDING-005 | Security | readiness-marker.ts | 18-21 | Directory traversal risk in readiness marker write |

**Note**: P0-FINDING-002 and P0-FINDING-005 are duplicates (same issue in readiness-marker.ts). Consolidating to 4 unique P0 findings.

---

### P1 Findings (4 total)

| ID | Dimension | File | Lines | Description |
|----|-----------|------|-------|-------------|
| P1-FINDING-001 | Correctness | 016 spec.md | REQ-001-010 | Verification claims not independently audited |
| P1-FINDING-002 | Maintainability | compact-merger.ts | 1-194 | Inlined helpers exceed "trivial" threshold |
| P1-FINDING-003 | Correctness | structural-contract.vitest.ts | - | No verification that rewritten tests preserve original intent |
| P1-FINDING-004 | Security | code-graph-boundary.ts | 68-72, 201-205 | Broad environment passing in MCP subprocess |
| P1-FINDING-005 | Correctness | readiness-marker.ts | 7, 229 | No atomic write pattern for readiness marker |
| P1-FINDING-006 | Future-coupling-resistance | N/A | - | No automated prevention of cross-skill import reintroduction |

**Note**: P1-FINDING-001 was verified in iter-002 (claims were true), so this is resolved. Consolidating to 5 unique P1 findings.

---

### P2 Findings (8 total)

| ID | Dimension | File | Description |
|----|-----------|------|-------------|
| P2-FINDING-003 | Traceability | 276c1a930 commit | Operator parallel work - minimal review scope |
| P2-FINDING-004 | Correctness | All inlined helpers | No verification of inlined-helper equivalence |
| P2-FINDING-005 | Traceability | 276c1a930 commit | Template-anchor validation errors |
| P2-FINDING-006 | Traceability | e00930347 commit | No verification of cross-reference updates |
| P2-FINDING-007 | Traceability | ff91ddfe4 commit | Operator parallel work - minimal review scope |
| P2-FINDING-008 | Traceability | 339134df1 commit | Operator parallel work - minimal review scope |
| P2-FINDING-009 | Correctness | compact-merger.ts | No equivalence test for compact-merger |
| P2-FINDING-010 | Correctness | budget-allocator.ts | No equivalence test for budget-allocator |
| P2-FINDING-011 | Correctness | runtime-detection.ts | No equivalence test for runtime-detection |
| P2-FINDING-012 | Correctness | index-scope.ts | No equivalence test for index-scope-policy |
| P2-FINDING-013 | Traceability | 1d5907b38 commit | Cross-ref verification scope limited to .opencode/skills/ |

**Note**: P2-FINDING-003, P2-FINDING-007, P2-FINDING-008 are operator parallel work (per spec, out of scope for deep review). Consolidating to 8 unique P2 findings.

---

## Consolidated Findings Registry

### P0 Findings (4 unique)

1. **P0-FINDING-001/004**: Path traversal risk in boundary wrapper marker read
   - **Dimension**: Security
   - **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
   - **Lines**: 30-33, 94-96
   - **Evidence**: No validation that resolved marker path is within expected code-graph directory
   - **Recommendation**: Add path validation to ensure marker file is within expected bounds before reading

2. **P0-FINDING-002/005**: Directory traversal risk in readiness marker write
   - **Dimension**: Security
   - **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
   - **Lines**: 18-21
   - **Evidence**: `resolve(process.cwd(), ...)` could write to unexpected location if cwd is manipulated
   - **Recommendation**: Validate write path is within expected code-graph directory before writing

3. **P0-FINDING-003**: Race condition in marker read/write
   - **Dimension**: Correctness
   - **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
   - **Lines**: 98-111
   - **Evidence**: No file locking; concurrent read/write could result in malformed JSON parse
   - **Recommendation**: Implement atomic write pattern (write to temp file + rename) or add retry logic with JSON validation

---

### P1 Findings (5 unique)

1. **P1-FINDING-002**: Inlined helpers exceed "trivial" threshold
   - **Dimension**: Maintainability
   - **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/context/compact-merger.ts`
   - **Lines**: 1-194
   - **Evidence**: compact-merger is 194 lines with complex business logic, contradicting 015 research claim of "<80 lines"
   - **Recommendation**: Move compact-merger to shared-types package, or document why this exception was necessary

2. **P1-FINDING-003**: No verification that rewritten tests preserve original intent
   - **Dimension**: Correctness
   - **File**: `.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts`
   - **Evidence**: Test rewritten from 534 lines to 290 lines; no independent verification that test semantics are preserved
   - **Recommendation**: Compare test coverage before/after rewrite to ensure no regression in contract validation logic

3. **P1-FINDING-004**: Broad environment passing in MCP subprocess
   - **Dimension**: Security
   - **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
   - **Lines**: 68-72, 201-205
   - **Evidence**: All string environment variables passed to subprocess without allowlist
   - **Recommendation**: Implement environment variable allowlist for MCP subprocess calls

4. **P1-FINDING-005**: No atomic write pattern for readiness marker
   - **Dimension**: Correctness
   - **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
   - **Lines**: 7, 229
   - **Evidence**: Direct `writeFileSync` without temp-file + rename pattern
   - **Recommendation**: Implement atomic write pattern for cross-filesystem safety

5. **P1-FINDING-006**: No automated prevention of cross-skill import reintroduction
   - **Dimension**: Future-coupling-resistance (arc-specific)
   - **File**: N/A (missing mechanism)
   - **Evidence**: No CI rule, eslint rule, or pre-commit hook to prevent `from.*system-code-graph` imports in spec-kit
   - **Recommendation**: Implement CI rule, ESLint rule, or pre-commit hook to block cross-skill imports

---

### P2 Findings (8 unique)

1. **P2-FINDING-004**: No verification of inlined-helper equivalence
   - **Dimension**: Correctness
   - **Files**: All inlined helpers
   - **Evidence**: No automated test comparing inlined vs original behavior
   - **Recommendation**: Add cross-skill equivalence tests or document manual verification performed

2. **P2-FINDING-005**: Template-anchor validation errors
   - **Dimension**: Maintainability
   - **File**: Multiple packet specs
   - **Evidence**: Strict-validate fails with template-anchor shape errors (informational pattern)
   - **Recommendation**: Track for template cleanup in future work

3. **P2-FINDING-006**: No verification of cross-reference updates
   - **Dimension**: Traceability
   - **File**: Commit e00930347
   - **Evidence**: Commit moves docs but doesn't explicitly verify all cross-references were updated
   - **Recommendation**: Verify with grep for old paths across .opencode/skills/

4. **P2-FINDING-013**: Cross-ref verification scope limited to .opencode/skills/
   - **Dimension**: Traceability
   - **File**: Commit 1d5907b38
   - **Evidence**: "Verified zero residual hits across .opencode/skills/" but no mention of .opencode/specs/
   - **Recommendation**: Verify no residual references in spec docs (low risk as specs are historical record)

5. **P2-FINDING-009**: No equivalence test for compact-merger
   - **Dimension**: Correctness
   - **Files**: Inlined vs original in code-graph
   - **Evidence**: No test comparing inlined vs original behavior
   - **Recommendation**: Add equivalence test or document manual verification

6. **P2-FINDING-010**: No equivalence test for budget-allocator
   - **Dimension**: Correctness
   - **Files**: Inlined vs original in code-graph
   - **Evidence**: No test comparing inlined vs original behavior
   - **Recommendation**: Add equivalence test or document manual verification

7. **P2-FINDING-011**: No equivalence test for runtime-detection
   - **Dimension**: Correctness
   - **Files**: Inlined vs original in code-graph
   - **Evidence**: No test comparing inlined vs original behavior
   - **Recommendation**: Add equivalence test or document manual verification

8. **P2-FINDING-012**: No equivalence test for index-scope-policy
   - **Dimension**: Correctness
   - **Files**: Inlined vs original in code-graph
   - **Evidence**: No test comparing inlined vs original behavior
   - **Recommendation**: Add equivalence test or document manual verification

---

## Next Steps

Iteration-009 will:
1. Draft review-report.md Executive Summary
2. Draft Per-Commit Review table
3. Draft Active Finding Registry
4. Continue with remaining sections