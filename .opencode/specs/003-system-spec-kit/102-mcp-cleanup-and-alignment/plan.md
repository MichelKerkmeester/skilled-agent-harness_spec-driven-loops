# Plan — Spec 102: MCP Server Cleanup & Documentation Alignment

**Status:** COMPLETE (retroactive)
**Created:** 2026-02-10

## Approach

Two-session incremental approach. Each fix independently verifiable — no rollback plan needed.

- **Session 1:** Test fixes, TypeScript errors, 31/36 audit findings, ADR-008
- **Session 2:** 5 deferred architectural findings requiring cross-file standardization

## Workstreams

| WS | Scope | Files | Session |
|----|-------|-------|---------|
| WS-1 | Fix 2 pre-existing test failures | 2 | 1 |
| WS-2 | Fix 5+1 TypeScript errors | 6 | 1 |
| WS-3 | Resolve 36 Spec 101 audit findings | ~25 | 1 + 2 |
| WS-4 | Write ADR-008 (sqlite-vec adoption) | 1 | 1 |

### WS-1: Pre-existing Test Failures

- `scoring-gaps.test.ts` — 4 tests expected throws but production code returns false
- `vector-index-impl.js` — CREATE TABLE schema missing `is_archived` column

### WS-2: Pre-existing TypeScript Errors

6 TS errors across core, handlers, hooks, and lib modules. Each is a type mismatch or missing signature — isolated fixes with no behavioral change.

### WS-3: Spec 101 Misalignment Audit

36 findings from Spec 101's documentation-code audit, executed in 3 phases:

| Phase | Count | Type | Session |
|-------|-------|------|---------|
| Phase 1 | 13 | Quick wins (single-line, count fixes) | 1 |
| Phase 2 | 11 | Moderate (section rewrites, added docs) | 1 |
| Phase 3 | 7 | Remaining non-architectural | 1 |
| Phase 3 (deferred) | 5 | Architectural (cross-file standardization) | 2 |

Session 2 architectural findings:
- **F-002 + F-003:** Unified L1 `memory_context` entry point (6 files)
- **F-008:** Circuit breaker parameter standardization (10 files)
- **F-022:** Quality gate threshold standardization (7 files)
- **F-034:** Resume MCP docs consolidation (1 file)

### WS-4: ADR-008

Document the sqlite-vec adoption decision (T305 gap from Spec 098). Added to `specs/098-feature-bug-documentation-audit/decision-record.md`.

## Quality Gates

| Gate | Threshold | Measured By |
|------|-----------|-------------|
| TypeScript errors | 0 | `tsc --noEmit` |
| Test failures | 0 | `npm test` (104 tests) |
| Spec 101 findings resolved | 36/36 | Manual audit against finding list |
| No regressions | 0 new failures | Full test suite pass |

## Risk Assessment

**Low risk.** All changes are incremental fixes to existing code. No new features, no API changes, no schema migrations. Each fix independently verifiable via test suite.
