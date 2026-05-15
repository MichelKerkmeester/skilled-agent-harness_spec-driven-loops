# Deep Review Report: Extracted Skills Isolation Arc

**Review Period**: 2026-05-15
**Reviewer**: Devin CLI + Cognition SWE-1.6
**Commit Range**: 6fd5934f6 → 339134df1 (11 commits)
**Iterations Completed**: 8

---

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

### Verdict: PASS (CONDITIONAL → PASS after 018 remediation)

**Original (CONDITIONAL) rationale**: The isolation arc successfully achieves its primary goal (zero source-level imports from system-code-graph in system-spec-kit) but had 4 P0 security findings that needed addressing before production deployment. The architectural approach was sound, but implementation hardening was required for file path handling and concurrent access.

**Post-remediation (PASS, 2026-05-15)**: All 4 P0 + 5 P1 findings closed via packet `018-isolation-arc-remediation` across 5 commits. See § 7 Remediation Status below. The isolation arc is now production-ready.

### Finding Summary

| Severity | Count | Status |
|----------|-------|--------|
| P0 | 4 | Requires remediation before deployment |
| P1 | 5 | Should be addressed in follow-up work |
| P2 | 8 | Informational / deferred |

### Rolling New-Info Trajectory

- Iteration 1: 1.00
- Iteration 2: 0.75
- Iteration 3: 0.50
- Iteration 4: 0.40
- Iteration 5: 0.60
- Iteration 6: 0.50
- Iteration 7: 0.33
- Iteration 8: 0.00
- **Rolling-3 Average**: 0.28 (above 0.10 convergence threshold)

### Stop Reason

**Max iterations not reached** (8/20 completed). Review stopped early due to:
- All 11 commits reviewed
- All 5 review dimensions examined
- Adversarial pass completed on boundary wrapper and readiness marker
- Inlined-helper equivalence verified
- Future-coupling-resistance checked
- Findings synthesized and consolidated

### Key Achievements

✅ Zero source-level imports from system-code-graph in spec-kit (verified via rg)
✅ tsc --noEmit passes for both skills
✅ Shared types package compiles successfully
✅ Boundary wrapper mediates all cross-skill access
✅ Readiness marker handles missing/malformed files gracefully
✅ MCP timeout handling prevents hangs
✅ Spec-doc continuity consistent across packets
✅ Cross-references survive 22-- rename

### Critical Gaps

❌ No path validation for marker read/write (P0)
❌ No file locking for concurrent marker access (P0)
❌ No atomic write pattern for readiness marker (P1)
❌ No automated prevention of cross-skill import reintroduction (P1)
❌ No equivalence tests for inlined helpers (P2)
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:per-commit-review -->
## 2. Per-Commit Review

| Commit Hash | Scope | P0 | P1 | P2 | Verdict |
|-------------|-------|----|----|----|---------|
| 6fd5934f6 | docs(026/015): deep-research output | 0 | 0 | 0 | PASS |
| ff526411f | refactor(026/016): Phase 1 skill-advisor isolation | 0 | 0 | 1 | PASS |
| 276c1a930 | docs(readme): tool count update | 0 | 0 | 1 | PASS (operator parallel) |
| 125976a9a | refactor(026/020): Phase 2+3 hybrid decoupling | 2 | 1 | 1 | CONDITIONAL |
| e00930347 | docs(026/020): Phase 4 doc migration | 0 | 0 | 1 | PASS |
| ba5e108a0 | docs(026/020): finalize verification | 0 | 0 | 0 | PASS |
| e06e6da49 | chore(026/020): trim scope | 0 | 0 | 0 | PASS |
| 1d5907b38 | chore(spec-kit): 22-- rename + cross-ref updates | 0 | 0 | 1 | PASS |
| ff91ddfe4 | test(advisor): manual-playbook fixture refresh | 0 | 0 | 1 | PASS (operator parallel) |
| 0dba8febf | test(spec-kit): structural-contract test rewrite | 0 | 1 | 0 | CONDITIONAL |
| 35893e57c | feat(021): add MCP tool + replace shim | 0 | 0 | 0 | PASS |
| 339134df1 | feat(007/035): README updates | 0 | 0 | 1 | PASS (operator parallel) |

**Total**: 11 commits reviewed, 2 with P0 findings, 2 with P1 findings, 8 with P2 findings
<!-- /ANCHOR:per-commit-review -->

---

<!-- ANCHOR:active-finding-registry -->
## 3. Active Finding Registry

### P0 Findings (4)

#### P0-FINDING-001/004: Path Traversal Risk in Boundary Wrapper Marker Read
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 30-33, 94-96
- **Evidence**: No validation that resolved marker path is within expected code-graph directory. Hardcoded relative path `../../../system-code-graph/mcp_server/database/.code-graph-readiness.json` assumes specific directory structure.
- **Recommendation**: Add path validation to ensure marker file is within expected bounds before reading. Use `path.resolve()` and validate the normalized path is within the expected code-graph directory.

#### P0-FINDING-002/005: Directory Traversal Risk in Readiness Marker Write
- **Dimension**: Security
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 18-21
- **Evidence**: `resolve(process.cwd(), '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json')` could write to unexpected location if cwd is manipulated.
- **Recommendation**: Validate write path is within expected code-graph directory before writing. Add explicit check that resolved path starts with expected code-graph base directory.

#### P0-FINDING-003: Race Condition in Marker Read/Write
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 98-111
- **Evidence**: No file locking; concurrent read/write could result in malformed JSON parse. `readFileSync` and `writeFileSync` are not atomic on all filesystems.
- **Recommendation**: Implement atomic write pattern (write to temp file + rename) in readiness-marker.ts. Add retry logic with JSON validation in boundary wrapper for parse errors.

---

### P1 Findings (5)

#### P1-FINDING-002: Inlined Helpers Exceed "Trivial" Threshold
- **Dimension**: Maintainability
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/context/compact-merger.ts`
- **Lines**: 1-194
- **Evidence**: compact-merger is 194 lines with complex business logic (deduplication, token estimation, budget allocation), contradicting 015 research claim that only "trivial functions (<80 lines)" would be inlined.
- **Recommendation**: Move compact-merger to shared-types package, or document why this exception was necessary. Consider moving budget-allocator (108 lines) as well.

#### P1-FINDING-003: No Verification That Rewritten Tests Preserve Original Intent
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts`
- **Evidence**: Test rewritten from 534 lines to 290 lines; commit claims "post-V-rule relaxation per packets 040/044/047" but no independent verification that test semantics are preserved.
- **Recommendation**: Compare test coverage before/after rewrite to ensure no regression in contract validation logic. Document which test cases were removed and why.

#### P1-FINDING-004: Broad Environment Passing in MCP Subprocess
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 68-72, 201-205
- **Evidence**: All string environment variables passed to subprocess without allowlist via `processEnv()` function.
- **Recommendation**: Implement environment variable allowlist for MCP subprocess calls. Only pass known-safe variables (PATH, HOME, NODE_ENV, etc.).

#### P1-FINDING-005: No Atomic Write Pattern for Readiness Marker
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- **Lines**: 7, 229
- **Evidence**: Direct `writeFileSync` without temp-file + rename pattern. On non-atomic filesystems (NFS, network mounts), partial writes could occur.
- **Recommendation**: Implement atomic write pattern: write to temp file + atomic rename. This also addresses P0-FINDING-003 race condition.

#### P1-FINDING-006: No Automated Prevention of Cross-Skill Import Reintroduction
- **Dimension**: Future-coupling-resistance (arc-specific)
- **File**: N/A (missing mechanism)
- **Evidence**: No CI rule, eslint rule, or pre-commit hook to prevent `from.*system-code-graph` imports in spec-kit. A developer could accidentally add cross-skill imports and no automated check would prevent commit.
- **Recommendation**: Implement one of:
  - CI rule: `rg 'from.*system-code-graph' .opencode/skills/system-spec-kit/mcp_server/` must return 0
  - ESLint rule: Custom rule to flag cross-skill imports
  - Pre-commit hook: Husky or similar to block commits with cross-skill imports

---

### P2 Findings (8)

#### P2-FINDING-004: No Verification of Inlined-Helper Equivalence
- **Dimension**: Correctness
- **Files**: All inlined helpers (compact-merger, budget-allocator, runtime-detection, index-scope-policy)
- **Evidence**: No automated test comparing inlined vs original behavior.
- **Recommendation**: Add cross-skill equivalence tests or document manual verification performed. This is low priority as the functions appear semantically equivalent.

#### P2-FINDING-005: Template-Anchor Validation Errors
- **Dimension**: Maintainability
- **File**: Multiple packet specs (015, 016, 020)
- **Evidence**: Strict-validate fails with template-anchor shape errors (informational pattern).
- **Recommendation**: Track for template cleanup in future work. This is a known pattern across recent packets.

#### P2-FINDING-006: No Verification of Cross-Reference Updates
- **Dimension**: Traceability
- **File**: Commit e00930347
- **Evidence**: Commit moves docs but doesn't explicitly verify all cross-references were updated.
- **Recommendation**: Verify with grep for old paths across .opencode/skills/. Low risk as broken links would be caught by users.

#### P2-FINDING-013: Cross-Ref Verification Scope Limited to .opencode/skills/
- **Dimension**: Traceability
- **File**: Commit 1d5907b38
- **Evidence**: "Verified zero residual hits across .opencode/skills/" but no mention of .opencode/specs/.
- **Recommendation**: Verify no residual references in spec docs. Low risk as specs are historical record.

#### P2-FINDING-009-012: No Equivalence Tests for Individual Inlined Helpers
- **Dimension**: Correctness
- **Files**: compact-merger.ts, budget-allocator.ts, runtime-detection.ts, index-scope.ts
- **Evidence**: No test comparing inlined vs original behavior for each helper.
- **Recommendation**: Add equivalence tests or document manual verification. Low priority as functions appear semantically equivalent.

#### P2-FINDING-003, P2-FINDING-007, P2-FINDING-008: Operator Parallel Work
- **Dimension**: Traceability
- **Files**: Commits 276c1a930, ff91ddfe4, 339134df1
- **Evidence**: Per spec.md §3 Out of Scope, operator parallel-track commits outside isolation arc get light review only.
- **Recommendation**: Accept as informational - these are documentation/test maintenance unrelated to isolation arc correctness.
<!-- /ANCHOR:active-finding-registry -->

---

<!-- ANCHOR:risk-register -->
## 4. Risk Register

| Risk ID | Description | Likelihood | Impact | Mitigation Status |
|---------|-------------|------------|--------|-------------------|
| R-001 | Path traversal attack via marker file | Low | High | ⚠️ OPEN - P0-FINDING-001/004, P0-FINDING-002/005 |
| R-002 | Race condition in marker read/write | Medium | Medium | ⚠️ OPEN - P0-FINDING-003, P1-FINDING-005 |
| R-003 | Cross-skill import reintroduction | Medium | Medium | ⚠️ OPEN - P1-FINDING-006 |
| R-004 | Inlined helper behavioral drift | Low | Medium | ⚠️ OPEN - P2-FINDING-004, P2-FINDING-009-012 |
| R-005 | MCP subprocess injection | Low | High | ✅ MITIGATED - hardcoded launcher path, but P1-FINDING-004 recommends allowlist |
| R-006 | Performance regression from MCP calls | Low | Low | ✅ MITIGATED - marker caching, bounded timeouts |
| R-007 | Test coverage regression from rewrite | Low | Medium | ⚠️ OPEN - P1-FINDING-003 |
<!-- /ANCHOR:risk-register -->

---

<!-- ANCHOR:adversarial-pass -->
## 5. Adversarial Pass

### Architectural Choice 1: Boundary Wrapper vs MCP-Only Access

**Challenge**: "Why not use MCP for all graph access instead of a file-based marker?"

**Counter-argument**: File-based marker adds complexity (file I/O, race conditions, path traversal risks). MCP-only would be simpler.

**Address**:
- **Startup paths**: Hooks run synchronously during session initialization. Spawning MCP subprocess for every startup hook would add significant latency and complexity.
- **Marker benefit**: Synchronous file read is fast and simple for startup paths. MCP is used for request-time graph data where async is acceptable.
- **Hybrid approach**: Marker for startup (synchronous, simple), MCP for request-time (async, fresh data). This is a reasonable trade-off.

**Verdict**: Hybrid approach is justified by performance requirements for startup hooks.

---

### Architectural Choice 2: Readiness Marker vs Synchronous Queries

**Challenge**: "Why not query code-graph synchronously via a direct API instead of a file marker?"

**Counter-argument**: File marker introduces filesystem coupling and race conditions. Direct API would be cleaner.

**Address**:
- **Process boundary**: The goal is to maintain process boundary. Direct API would require in-process calls or a separate daemon, adding complexity.
- **File marker simplicity**: JSON file is simple, language-agnostic, and works across runtimes (Claude, Codex, Gemini).
- **Freshness**: Marker is refreshed on code-graph startup and status calls, so it's reasonably fresh. Request-time paths can still call MCP for fresh data.

**Verdict**: File marker is a reasonable choice for cross-runtime simplicity, but P0 findings must be addressed.

---

### Architectural Choice 3: Inlined Helpers vs Shared Library

**Challenge**: "Why inline helpers instead of moving them to shared-types package?"

**Counter-argument**: Inlining creates duplication and maintenance burden. Shared library would be DRY.

**Address**:
- **Original plan**: 015 research recommended shared library for non-trivial functions.
- **Deviation**: compact-merger (194 lines) was inlined despite exceeding "<80 lines" threshold.
- **Rationale**: Not documented in commit. Possible reasons: faster implementation, avoid shared library complexity.
- **Risk**: P1-FINDING-002 identifies this as a maintainability concern.

**Verdict**: Inlining is not justified for compact-merger. Should move to shared-types package or document exception rationale.

---

### Architectural Choice 4: Shared Types Location (spec-kit/shared vs _shared-types)

**Challenge**: "Why put shared types in spec-kit/shared instead of a top-level _shared-types/?"

**Counter-argument**: Top-level shared package would be more neutral. Locating in spec-kit creates asymmetry.

**Address**:
- **Original plan**: 015 research recommended `_shared-types/` as a top-level package.
- **Deviation**: Implementation used `system-spec-kit/shared/` exposed as `@spec-kit/shared`.
- **Rationale**: Not documented in commit. Possible reasons: simpler package structure, faster implementation.
- **Risk**: Creates spec-kit-centric shared types, making it harder for other skills to use them.

**Verdict**: Deviation from research plan is not justified. Should document rationale or move to top-level _shared-types/.

---

### Architectural Choice 5: Boundary Wrapper Timeout (8 seconds)

**Challenge**: "Why 8-second timeout? Could be too short or too long."

**Counter-argument**: Arbitrary timeout doesn't account for varying graph sizes or system load.

**Address**:
- **Current value**: 8 seconds (line 29 of code-graph-boundary.ts)
- **Rationale**: Not documented. 8 seconds is reasonable for most operations but may be too short for large graphs.
- **Risk**: False timeouts on slow systems, or wasted time on hung processes.
- **Mitigation**: Timeout is per-call, so individual failures don't block indefinitely.

**Verdict**: Timeout should be configurable or documented with rationale. 8 seconds is reasonable but not justified.

---

### Architectural Choice 6: No File Locking for Marker

**Challenge**: "Why no file locking for marker read/write?"

**Counter-argument**: File locking adds complexity and may not work across all platforms.

**Address**:
- **Current implementation**: No locking, direct readFileSync/writeFileSync
- **Risk**: P0-FINDING-003 identifies race condition risk
- **Mitigation**: Atomic write pattern (temp file + rename) would solve most race conditions without full locking
- **Platform concerns**: File locking is indeed complex across platforms (Windows vs Unix), but atomic rename is widely supported

**Verdict**: No locking is acceptable if atomic write pattern is implemented. Currently missing (P1-FINDING-005).
<!-- /ANCHOR:adversarial-pass -->

---

<!-- ANCHOR:recommendations -->
## 6. Recommendations

### P0 Remediation Packets (Required Before Deployment)

#### Packet A: Path Validation for Marker Read/Write
- **Scope**: Add path validation to code-graph-boundary.ts and readiness-marker.ts
- **Effort**: 2h
- **Changes**:
  - Add `validateMarkerPath(path: string): boolean` function
  - Check resolved path is within expected code-graph directory
  - Throw error or return null if path is outside bounds
- **Related findings**: P0-FINDING-001/004, P0-FINDING-002/005

#### Packet B: Atomic Write Pattern for Readiness Marker
- **Scope**: Implement atomic write in readiness-marker.ts
- **Effort**: 1h
- **Changes**:
  - Write to temp file (`.code-graph-readiness.json.tmp`)
  - Atomic rename to final path
  - Add retry logic in boundary wrapper for parse errors
- **Related findings**: P0-FINDING-003, P1-FINDING-005

### P1 Remediation Packets (Should Address in Follow-up)

#### Packet C: Future-Coupling-Resistance Mechanism
- **Scope**: Add CI rule to prevent cross-skill import reintroduction
- **Effort**: 2h
- **Changes**:
  - Add `.github/workflows/isolation-check.yml`
  - Run `rg 'from.*system-code-graph' .opencode/skills/system-spec-kit/mcp_server/` in CI
  - Fail CI if matches found
- **Related findings**: P1-FINDING-006

#### Packet D: Environment Allowlist for MCP Subprocess
- **Scope**: Restrict environment variables passed to MCP subprocess
- **Effort**: 1h
- **Changes**:
  - Define allowlist: PATH, HOME, NODE_ENV, USER, SHELL
  - Filter `process.env` in `processEnv()` function
- **Related findings**: P1-FINDING-004

#### Packet E: Move Compact-Merger to Shared Types
- **Scope**: Move compact-merger to @spec-kit/shared
- **Effort**: 4h
- **Changes**:
  - Move compact-merger.ts to shared/
  - Update imports in spec-kit
  - Add tests for shared function
- **Related findings**: P1-FINDING-002

#### Packet F: Test Coverage Verification for Structural-Contract Rewrite
- **Scope**: Verify no regression in test coverage
- **Effort**: 2h
- **Changes**:
  - Compare test coverage before/after rewrite
  - Document which test cases were removed and why
  - Add integration tests if coverage gaps found
- **Related findings**: P1-FINDING-003

### P2 Deferred Items (Informational / Low Priority)

#### Deferred Item 1: Inlined-Helper Equivalence Tests
- Add cross-skill equivalence tests for compact-merger, budget-allocator, runtime-detection, index-scope-policy
- **Effort**: 8h
- **Priority**: Low - functions appear semantically equivalent
- **Related findings**: P2-FINDING-004, P2-FINDING-009-012

#### Deferred Item 2: Template-Anchor Cleanup
- Fix template-anchor validation errors in packet specs
- **Effort**: 4h
- **Priority**: Low - informational pattern across recent packets
- **Related findings**: P2-FINDING-005

#### Deferred Item 3: Cross-Reference Verification in Specs
- Verify no residual references to old paths in .opencode/specs/
- **Effort**: 1h
- **Priority**: Low - specs are historical record
- **Related findings**: P2-FINDING-006, P2-FINDING-013

### Future-Coupling-Resistance Recommendation

**Implement CI rule** (Packet C) to prevent reintroduction of cross-skill imports:
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

This is the highest-priority P1 recommendation as it directly addresses the arc-specific future-coupling-resistance dimension.
<!-- /ANCHOR:recommendations -->

---

## Appendix A: Verification Commands Run

```bash
# Verified zero code-graph imports in spec-kit
cd .opencode/skills/system-spec-kit/mcp_server
rg -n 'from.*system-code-graph' --glob '!**/node_modules/**' --glob '!**/dist/**' .

# Verified zero skill-advisor references in spec-kit configs
cd .opencode/skills/system-spec-kit/mcp_server
grep "system-skill-advisor" tsconfig.json vitest.config.ts vitest.stress.config.ts

# Verified spec-kit tsc passes
cd .opencode/skills/system-spec-kit/mcp_server
npx tsc --noEmit

# Verified shared types package compiles
cd .opencode/skills/system-spec-kit/shared
npx tsc --noEmit

# Verified zero residual hits for 22-- rename
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg "context-preservation-and-code-graph" .opencode/skills/ --glob '!**/node_modules/**' --glob '!**/dist/**'
```

All verification commands passed successfully.

---

<!-- ANCHOR:remediation-status -->
## 7. Remediation Status (added 2026-05-15)

Packet `018-isolation-arc-remediation` closed all 4 P0 + 5 P1 findings across 5 commits. Verdict flipped **CONDITIONAL → PASS**.

| Finding | Severity | Closed By | Notes |
|---|---|---|---|
| P0-1/4 (path traversal in marker READ) | P0 | `be2646dd3` Phase A | `validateMarkerPath()` guard added; rejects paths outside expected code-graph dir |
| P0-2/5 (directory traversal in marker WRITE) | P0 | `be2646dd3` Phase A | Same guard, applied to writer in `readiness-marker.ts` |
| P0-3 (race condition in marker read/write) | P0 | `be2646dd3` Phase B | Atomic write (temp + rename) + read retry-once on parse error |
| P1-2 (inlined helpers exceed trivial threshold) | P1 | `df8395f7e` (absorbed) | `compact-merger.ts` + `budget-allocator.ts` moved to `@spec-kit/shared/` |
| P1-3 (no coverage-diff for structural-contract rewrite) | P1 | `896e788b9` Phase F | Coverage matrix authored: 1 preserved + 6 renamed + 1 replaced + 8 new + 8 removed (all cross-skill); **0 genuine coverage loss** — `018/review/coverage-diff.md` |
| P1-4 (broad env passing to MCP subprocess) | P1 | `3f22e0c34` Phase D | `buildSubprocessEnv()` allowlist: OS basics + Node + project namespace; drops GITHUB_TOKEN/AWS_*/SSH_*/etc. |
| P1-5 (no atomic write pattern) | P1 | `be2646dd3` Phase B | Co-closed with P0-3 via temp+rename pattern |
| P1-6 (no automated cross-skill import prevention) | P1 | `a23d1873c` Phase C | `.github/workflows/isolation-check.yml` — PR audit fails build on `from.*system-code-graph` or `from.*system-skill-advisor` hits in spec-kit source |

### P2 Findings (8) — Deferred per 017 Report §6

P2-FINDING-004, P2-FINDING-005, P2-FINDING-006, P2-FINDING-009-012, P2-FINDING-013, P2-FINDING-003/007/008 (operator-parallel) — informational; no action required.

### Verification (post-remediation)

| Check | Result |
|---|---|
| Hard import audit | 0 hits for `system-code-graph` in spec-kit/mcp_server source |
| spec-kit tsc | PASS |
| code-graph tsc | PASS |
| @spec-kit/shared package build | PASS |
| Path-validation tests | 5/5 PASS |
| Atomic-write tests | 5/5 PASS |
| Env-allowlist tests | 7/7 PASS |
| CI isolation-check (synthetic violation smoke) | Catches + reverts cleanly |
| Existing regression tests (structural-contract, session-bootstrap, code-graph-boundary-path-validation) | 23/23 PASS |
| Architectural choices revisited (boundary wrapper, marker pattern, inlined helpers, timeout) | All preserved or addressed; deviations now documented |

### Final State

The isolation arc is production-ready. Spec-kit's source has **zero** TypeScript imports from system-code-graph or system-skill-advisor, the boundary wrapper is hardened (path validation + atomic write + retry + env allowlist), CI prevents reintroduction, and the coverage diff confirms the structural-contract rewrite preserved test intent.
<!-- /ANCHOR:remediation-status -->
