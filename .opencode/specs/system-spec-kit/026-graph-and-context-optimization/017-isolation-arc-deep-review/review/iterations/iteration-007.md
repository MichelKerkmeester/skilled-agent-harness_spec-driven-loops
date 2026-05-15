# Iteration 007: Future-Coupling-Resistance + Cross-Cutting Concerns

**Date**: 2026-05-15T12:46:00Z
**Focus**: Future-coupling-resistance check + cross-cutting concerns (traceability, performance)
**Findings Count**: 2 (P1: 1, P2: 1)

---

## Future-Coupling-Resistance Check

### Question: How easily could a future PR add a new `import.*system-code-graph` line in spec-kit?

**Analysis**:
1. **Current state**: Zero `from.*system-code-graph` imports in spec-kit source (verified in iter-002)
2. **tsconfig.json**: No longer includes code-graph source files
3. **No CI check**: No grep-based pre-commit hook or CI rule preventing reintroduction
4. **No eslint rule**: No custom eslint rule to flag cross-skill imports
5. **Documentation**: ADR-001 documents the boundary but doesn't enforce it

**Vulnerability Assessment**:
- A developer could accidentally add `import { foo } from '../../../system-code-graph/mcp_server/lib/foo'`
- TypeScript would resolve this successfully (path is valid)
- No automated check would prevent commit
- Only manual code review would catch it

**P1-FINDING-006**: No automated prevention of cross-skill import reintroduction
- **Dimension**: Future-coupling-resistance (arc-specific)
- **File**: N/A (missing mechanism)
- **Evidence**: No CI rule, eslint rule, or pre-commit hook to prevent `from.*system-code-graph` imports in spec-kit
- **Recommendation**: Implement one of:
  - CI rule: `rg 'from.*system-code-graph' .opencode/skills/system-spec-kit/mcp_server/` must return 0
  - ESLint rule: Custom rule to flag cross-skill imports
  - Pre-commit hook: Husky or similar to block commits with cross-skill imports

---

### Recommended CI Rule

```yaml
# .github/workflows/isolation-check.yml
name: Isolation Check
on: [pull_request]
jobs:
  check-cross-skill-imports:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for code-graph imports in spec-kit
        run: |
          if rg 'from.*system-code-graph' .opencode/skills/system-spec-kit/mcp_server/; then
            echo "ERROR: Cross-skill imports detected"
            exit 1
          fi
```

### Recommended ESLint Rule

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-cross-skill-imports': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow imports from system-code-graph in system-spec-kit',
        },
      },
      create: (context) => ({
        ImportDeclaration(node) {
          if (node.source.value.includes('system-code-graph')) {
            context.report({
              node,
              message: 'Cross-skill imports from system-code-graph are not allowed in system-spec-kit',
            });
          }
        },
      }),
    },
  },
};
```

---

## Cross-Cutting Concerns

### Traceability: Spec-Doc Continuity

**Check**: Are spec-doc continuity fields consistent across 015/016/020/017?

**Analysis**:
- 015 research: Establishes the roadmap
- 016 Phase 1: Explicitly references 015 research.md §3 Recommendation, §4 Packet 1
- 020 Phase 2+3: Explicitly references ADR-001 superseding 014/007 ADR-002
- 017 review: Current packet reviewing the full arc

**Status**: PASS - clear parent-child relationships documented

---

### Traceability: Cross-Reference Survival After 22-- Rename

**Check**: Do cross-references survive the 22-- rename (commit 1d5907b38)?

**Analysis**:
- Commit 1d5907b38 performed sed pass across spec-kit + skill-advisor + code-graph
- Verified zero residual hits for old path in .opencode/skills/
- **Gap**: Verification didn't cover .opencode/specs/

**P2-FINDING-013**: Cross-ref verification scope limited to .opencode/skills/
- **Dimension**: Traceability
- **File**: Commit message for 1d5907b38
- **Evidence**: "Verified zero residual hits across .opencode/skills/" but no mention of .opencode/specs/
- **Recommendation**: Verify no residual references in spec docs (low risk as specs are historical record)

---

### Performance Regression Risk

**Check**: Could the isolation changes introduce performance regressions?

**Analysis**:
1. **MCP call latency**: Boundary wrapper adds MCP RPC calls for request-time graph data
   - Old: In-process function call (0ms overhead)
   - New: MCP subprocess call (5-20ms overhead per call)
   - Mitigation: Marker reads for startup paths (synchronous), bounded timeouts for request paths

2. **Marker read overhead**: File I/O for marker reads
   - Old: In-process function call
   - New: File read (synchronous I/O)
   - Mitigation: Small file (< 10KB), OS page caching

3. **Startup hooks**: Now use marker reads instead of in-process calls
   - Old: In-process code-graph imports
   - New: File read + MCP call (if marker missing)
   - Mitigation: Marker refreshed on code-graph startup, so most reads hit cache

**Assessment**: ACCEPTABLE RISK
- Performance impact is bounded and documented
- Mitigations are in place (marker caching, timeouts)
- No performance claim was made in the shipped work, so no regression against stated goal

**Status**: PASS - performance risk acceptable with mitigations

---

### Security: MCP Subprocess Invocation

**Check**: Are subprocess invocations injection-safe?

**Analysis**:
- Launcher path is hardcoded: `../../../../bin/mk-code-index-launcher.cjs`
- Uses `StdioClientTransport` with `process.execPath` (Node.js binary)
- Environment passed via `processEnv()` which filters non-string values
- **Risk**: Broad environment passing (P1-FINDING-004 from iter-005)

**Status**: PARTIAL - hardcoded launcher path helps, but environment allowlist recommended

---

## Findings Summary

**P1-FINDING-006**: No automated prevention of cross-skill import reintroduction
- **Dimension**: Future-coupling-resistance (arc-specific)
- **File**: N/A (missing mechanism)
- **Evidence**: No CI rule, eslint rule, or pre-commit hook to prevent `from.*system-code-graph` imports in spec-kit
- **Recommendation**: Implement CI rule, ESLint rule, or pre-commit hook to block cross-skill imports

**P2-FINDING-013**: Cross-ref verification scope limited to .opencode/skills/
- **Dimension**: Traceability
- **File**: Commit message for 1d5907b38
- **Evidence**: "Verified zero residual hits across .opencode/skills/" but no mention of .opencode/specs/
- **Recommendation**: Verify no residual references in spec docs (low risk as specs are historical record)

---

## Positive Signals

**Well-handled concerns**:
- Spec-doc continuity: Clear parent-child relationships documented
- Performance risk: Bounded with documented mitigations
- Security: Hardcoded launcher path reduces injection risk

---

## Next Steps

Iteration-008 will:
1. Synthesis of all findings across iterations 1-7
2. Begin drafting review-report.md sections
3. Calculate rolling new-info ratio to determine convergence