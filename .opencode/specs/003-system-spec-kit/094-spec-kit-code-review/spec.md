# Feature Specification: Spec Kit MCP Server Code Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-08 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-spec-kit` MCP server codebase (679 files) had never been audited against the project's own coding standards defined in `workflows-code--opencode/SKILL.md`. Without a systematic review, latent bugs -- including critical issues like Map mutation during iteration, falsy checks on numeric zero, and NaN propagation -- remained undetected across handlers, cognitive modules, scoring libraries, and shell scripts.

### Purpose
Perform a comprehensive code review of the entire `system-spec-kit` MCP server codebase against established coding standards, identify all violations by severity (P0/P1/P2), and fix all P0 and P1 bugs to bring the codebase to a reliable, standards-compliant baseline.

---

## 3. SCOPE

### In Scope
- Code review of all TypeScript/JavaScript source files in `system-spec-kit/mcp_server/`
- Code review of all shell scripts in `system-spec-kit/scripts/`
- Code review of all test files in `system-spec-kit/mcp_server/`
- Code review of shared type definitions and constants
- Fixing all P0 (critical) and P1 (required) bugs found
- Documenting all P2 items for future remediation

### Out of Scope
- P2 violations (header format, naming conventions, duplicate constants, missing TSDoc, test quality) -- deferred to future work
- TypeScript recompilation (`dist/` rebuild) -- requires separate build step
- Scripts TypeScript area -- agent hit rate limit before completing review
- Performance optimization or refactoring beyond bug fixes
- Adding new tests for the fixed bugs

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `handlers/causal-graph.ts` | Modify | Fix falsy checks rejecting valid numeric `0` IDs |
| `lib/cache/tool-cache.ts` | Modify | Fix Map deletion during iteration; fix cached null treated as miss |
| `lib/providers/retry-manager.ts` | Modify | Fix input row mutation in `parseRow()` |
| `handlers/memory-context.ts` | Modify | Fix error object passed instead of `.message` |
| `handlers/memory-search.ts` | Modify | Add missing import; fix raw MCP response |
| `handlers/memory-crud.ts` | Modify | Add null checks on `getDb()`; fix raw error response |
| `lib/scoring/composite-scoring.ts` | Modify | Add NaN guards for invalid dates |
| `handlers/memory-save.ts` | Modify | Replace non-null assertions; fix dryRun envelope; add `embedding!` non-null assertion guard clause (line 580) |
| `handlers/checkpoints.ts` | Modify | Add missing `initializeDb()` and `startTime` |
| `lib/cognitive/prediction-error-gate.ts` | Modify | Fix flat confidence defeating pattern comparison |
| `lib/cognitive/co-activation.ts` | Modify | Fix empty/invalid Float32Array in vector search |
| `lib/cognitive/tier-classifier.ts` | Modify | Fix `Math.min` defeating type-based stability |
| `.opencode/agent/review.md` | Modify | Quality bands harmonized (4-band), Mode 3 output template added, Mermaid diagram fixed, uncited claim removed, duplicate section removed |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix Map deletion during iteration in `tool-cache.ts` | `invalidateByTool`, `invalidateByPattern`, `cleanupExpired` use collect-then-delete pattern |
| REQ-002 | Fix falsy checks on numeric `0` in `causal-graph.ts` | All 3 locations use `=== undefined \|\| === null` instead of `!value` |
| REQ-003 | Fix NaN propagation in `composite-scoring.ts` | `isNaN()` guards after `new Date().getTime()` calls |
| REQ-004 | Fix non-null assertions in `memory-save.ts` | Guard-before-switch pattern replaces `!` assertions |
| REQ-005 | Fix row mutation in `retry-manager.ts` | `parseRow()` operates on a spread copy, not the original |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Fix error object handling in `memory-context.ts` | Error `.message` property passed instead of full Error object |
| REQ-007 | Add missing import and fix raw response in `memory-search.ts` | `createMCPErrorResponse` imported; envelope wrapping applied |
| REQ-008 | Add `getDb()` null checks in `memory-crud.ts` | `handleMemoryList` and `handleMemoryStats` validate db before use |
| REQ-009 | Fix raw error response in `memory-crud.ts` delete handler | Uses `createMCPErrorResponse` envelope |
| REQ-010 | Add `initializeDb()` and `startTime` in `checkpoints.ts` | All 5 handlers call `initializeDb()` and track `startTime` |
| REQ-011 | Fix flat confidence in `prediction-error-gate.ts` | Confidence computed from actual pattern comparison, not hardcoded 0.6 |
| REQ-012 | Fix empty Float32Array in `co-activation.ts` | Validates vector before search operation |
| REQ-013 | Fix `Math.min` stability in `tier-classifier.ts` | `Math.max` used for stability baseline selection |
| REQ-014 | Fix cached null treated as cache miss in `tool-cache.ts` | `withCache()` distinguishes null result from absent cache entry |
| REQ-015 | Fix dryRun raw response in `memory-save.ts` | dryRun path returns proper envelope |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 5 P0 bugs fixed with correct patterns applied
- **SC-002**: All 14 P1 bugs fixed across 10 affected files
- **SC-003**: No regressions introduced (fixes are surgical, pattern-preserving)
- **SC-004**: Review scores and findings documented for future P2 remediation

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rate limiting on review agents | Incomplete coverage | Accept partial coverage (8/10 Opus completed); document gaps |
| Risk | Fixes without recompilation | Runtime not updated | ~~Document `dist/` rebuild as required follow-up~~ Resolved: dist/ rebuilt 2026-02-09 07:11 (all .js newer than .ts) |
| Risk | Cascading effects from fixes | Could break dependent code | Apply minimal, surgical fixes; preserve existing APIs |
| Dependency | `workflows-code--opencode/SKILL.md` | Standards reference | Already available in codebase |
| Dependency | Agent capacity (Opus + Sonnet) | Parallel review throughput | 20 agents dispatched; graceful degradation on rate limits |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Review phase completes within reasonable agent session limits
- **NFR-P02**: Fix phase applies changes without introducing performance regressions

### Security
- **NFR-S01**: No hardcoded secrets introduced in fixes
- **NFR-S02**: Input validation patterns preserved or improved in all handlers

### Reliability
- **NFR-R01**: All null/undefined checks prevent runtime crashes
- **NFR-R02**: NaN guards prevent corrupted scoring calculations

---

## L2: EDGE CASES

### Data Boundaries
- Numeric zero as valid ID: System must accept `0` as a legitimate causal link ID, not reject it as falsy
- Empty Float32Array: Vector search must handle zero-length or invalid embedding arrays
- Null cached values: Cache must distinguish between "value is null" and "key not in cache"

### Error Scenarios
- Database unavailable: `getDb()` returning null must be caught before SQL operations
- Invalid dates: `new Date(undefined).getTime()` producing NaN must not propagate through scoring
- Missing `existingMemoryId`: Non-null assertions on optional fields must be replaced with explicit guards

### State Transitions
- Map iteration during deletion: Concurrent modification must use collect-then-delete pattern
- Row mutation: Database row objects must not be mutated in-place by parsing functions

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 679 files, 12 files modified, 19 bugs fixed |
| Risk | 18/25 | MCP server core, cognitive modules, data integrity |
| Research | 15/20 | Multi-agent parallel review with standards comparison |
| **Total** | **55/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- When will `dist/` be rebuilt to include the source fixes at runtime? **Resolved**: Rebuilt 2026-02-09 07:11:18 — all .js files newer than .ts sources.
- Should P2 items (header format, naming conventions, TSDoc) be tracked in a follow-up spec folder?
- Should the unreviewed Scripts TypeScript area be added to a separate review spec?

---

## 8. FOLLOW-UP REVIEW SESSION (2026-02-09)

A follow-up review session applied additional fixes beyond the original scope:

- **P0**: `embedding!` non-null assertion in `memory-save.ts:580` replaced with guard clause
- **P1**: `review.md` quality bands harmonized with `orchestrate.md` (5-band → 4-band system)
- **P1**: `review.md` Mode 3 output template added for focused file review
- **P1**: `review.md` Mermaid diagram logic corrected (ANALYZE→FINDINGS→EVALUATE→REPORT)
- **P1**: `review.md` uncited performance claim removed
- **P1**: `review.md` duplicate Section 11 content removed
- **P1**: Memory file spec folder reference corrected (006→094)

---
