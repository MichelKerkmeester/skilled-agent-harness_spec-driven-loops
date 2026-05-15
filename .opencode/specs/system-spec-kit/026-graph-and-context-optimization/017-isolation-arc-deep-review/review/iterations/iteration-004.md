# Iteration 004: Operator Parallel Work + MCP Tool + README Updates

**Date**: 2026-05-15T12:46:00Z
**Commits**: ff91ddfe4, 0dba8febf, 35893e57c, 339134df1
**Focus**: Light review of operator parallel work + MCP tool addition + README updates
**Findings Count**: 2 (P1: 1, P2: 1)

---

## Commit ff91ddfe4: test(advisor) - Manual-Playbook Fixture Refresh

### Scope
- Updates manual-playbook test fixture from 42 → 45 scenarios
- 1 file changed, 6 insertions, 6 deletions
- Test now passes: 368/372 (4 skipped, 0 failed)

### Findings

**P2-FINDING-007**: Operator parallel work - minimal review scope
- **Dimension**: Traceability
- **File**: Commit message for ff91ddfe4
- **Evidence**: Per spec.md §3 Out of Scope, operator parallel-track commits outside isolation arc get light review only
- **Recommendation**: Accept as informational - test fixture maintenance unrelated to isolation arc correctness

---

## Commit 0dba8febf: test(spec-kit) - Structural-Contract Test Rewrite

### Scope
- Rewrites structural-contract.vitest.ts as pure spec-kit unit test
- 2 files changed, 290 insertions, 534 deletions
- Mocks code-graph boundary instead of importing scan handler
- All 16/16 tests now pass

### Claims Verification

**Claim 1**: Test was orphaned by 020 decoupling
- **Evidence**: Commit message: "structurally orphaned by the 020 decoupling"
- **Status**: PLAUSIBLE - cross-imports couldn't co-resolve after split

**Claim 2**: All 16/16 tests now pass
- **Evidence**: Commit message: "All 16/16 tests now pass"
- **Status**: PLAUSIBLE - rewrite mocks boundary instead of importing code-graph

### Findings

**P1-FINDING-003**: No verification that rewritten tests preserve original intent
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts`
- **Evidence**: Test rewritten from 534 lines to 290 lines; commit claims "post-V-rule relaxation per packets 040/044/047" but no independent verification that test semantics are preserved
- **Recommendation**: Compare test coverage before/after rewrite to ensure no regression in contract validation logic

---

## Commit 35893e57c: feat(021) - Add MCP Tool + Replace Spec-Kit Shim

### Scope
- Adds `code_graph_classify_query_intent` MCP tool to system-code-graph
- Replaces spec-kit shim with RPC call to new tool
- 26 files changed, 1079 insertions, 89 deletions
- Creates 021 packet with full documentation

### Claims Verification

**Claim 1**: Provides RPC surface for query intent classification
- **Evidence**: New handler `classify-query-intent.ts` added to code-graph
- **Status**: PLAUSIBLE - this addresses 020 spec.md §12 open question about RPC classifier

**Claim 2**: Replaces spec-kit shim
- **Evidence**: code-graph-boundary.ts modified (73 lines removed), now uses `classifyQueryIntent` RPC call
- **Status**: POSITIVE - this reduces inlined code, improving maintainability

### Findings

None - this is a positive architectural improvement that reduces inlining.

---

## Commit 339134df1: feat(007/035) - README Updates

### Scope
- Adds 3 READMEs to system-code-graph code folders
- 15 files changed, 1332 insertions
- Part of 4-phase README-authoring effort

### Findings

**P2-FINDING-008**: Operator parallel work - minimal review scope
- **Dimension**: Traceability
- **File**: Commit message for 339134df1
- **Evidence**: Per spec.md §3 Out of Scope, operator parallel-track commits outside isolation arc get light review only
- **Recommendation**: Accept as informational - documentation hygiene unrelated to isolation arc correctness

---

## Traceability Check

**Spec-doc continuity**: 021 packet created for MCP tool
- 021 spec.md documents the new RPC surface
- 021 implementation-summary.md describes the shim replacement
- **Status**: CONSISTENT - clear documentation of architectural improvement

---

## Security Assessment

**MCP subprocess invocation** (commit 35893e57c):
- New MCP tool `code_graph_classify_query_intent` added to code-graph
- Boundary wrapper calls this tool via `callCodeGraphTool`
- **Assessment**: The existing `callCodeGraphTool` function uses `StdioClientTransport` with hardcoded launcher path and environment passing
- **Status**: ACCEPTABLE - follows existing MCP invocation pattern; no new attack surface introduced

---

## Maintainability Assessment

**Positive signals**:
- Commit 35893e57c reduces inlining by adding RPC surface (addresses P1-FINDING-002 from iter-002)
- Commit 0dba8febf adapts tests to new architecture
- Clear packet documentation for 021

**Concerns**:
- P1-FINDING-003: No verification that rewritten tests preserve original intent

---

## Next Steps

Iteration-005 will:
1. Begin adversarial pass on boundary wrapper (security scenarios)
2. Begin adversarial pass on readiness marker (edge cases)
3. Start inlined-helper equivalence verification