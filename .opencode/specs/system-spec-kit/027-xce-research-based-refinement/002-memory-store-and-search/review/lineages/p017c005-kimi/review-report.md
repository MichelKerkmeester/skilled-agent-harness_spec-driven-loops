# Review Report: Phase 5 cosine-topn-reorder

## Executive Summary
- **Verdict:** PASS
- **Active findings:** P0=0, P1=0, P2=2
- **hasAdvisories:** true
- **Scope:** Review of the cosine-primary top-N head reorder implementation (`hybrid-search.ts`, `search-flags.ts`, `pipeline/types.ts`, new unit tests) and the target spec-folder documentation.
- **Stop reason:** maxIterationsReached (configured `maxIterations: 1`)

The implementation preserves length/membership, uses a deterministic tiebreaker, correctly skips reorder in evaluation mode, and provides a lexical-only fallback. No correctness or security blockers were found in the reviewed surface.

## Planning Trigger
PASS with advisories. The two P2 findings are documentation and configurability polish; they do not block release but should be addressed before the phase is considered fully closed. Route to `/speckit:plan` only if the operator wants to resolve the advisories now; otherwise a changelog entry is acceptable.

## Active Finding Registry

### F001 — Reorder depth is a hard-coded module constant
- **Severity:** P2
- **Dimension:** maintainability
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2416`
- **Evidence:** `const COSINE_TOPN_REORDER_DEPTH = 10;` is consumed directly by `reorderTopNByCosine` with no environment override.
- **Status:** active
- **First seen:** iteration-001
- **Recommendation:** Expose `SPECKIT_COSINE_TOPN_REORDER_DEPTH` (default 10) so the head size can be tuned against labeled-set results without a source change.

### F002 — Spec-folder docs remain scaffold templates
- **Severity:** P2
- **Dimension:** maintainability
- **File:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder/spec.md:49`
- **Evidence:** `spec.md`, `plan.md`, and `tasks.md` still contain bracketed placeholders for priority, deliverables, and task descriptions.
- **Status:** active
- **First seen:** iteration-001
- **Recommendation:** Backfill the spec documents with the actual phase problem statement, in-scope files, acceptance criteria, and completed task marks.

## Remediation Workstreams
1. **Configurability polish** — F001
   - Add `SPECKIT_COSINE_TOPN_REORDER_DEPTH` flag in `search-flags.ts` and thread it into `hybrid-search.ts`.
2. **Documentation backfill** — F002
   - Update `spec.md`, `plan.md`, `tasks.md` to reflect the actual implementation and verification evidence.

## Spec Seed
- Add an acceptance criterion that the reorder is a pure permutation of the budgeted survivors (length/membership invariant).
- Add an acceptance criterion that the reorder is skipped in evaluation mode.
- Document the default reorder depth and the intended tunability path.

## Plan Seed
- T001 [P2] Add `SPECKIT_COSINE_TOPN_REORDER_DEPTH` env flag (`search-flags.ts`, `hybrid-search.ts`).
- T002 [P2] Backfill `spec.md`, `plan.md`, `tasks.md` with actual phase content.

## Traceability Status
| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | not-executed | Not covered in this single-iteration run |
| checklist_evidence | core | not-executed | Target folder has no `checklist.md` |

Security and traceability dimensions were not reviewed because of the `maxIterations: 1` cap.

## Deferred Items
- Security review of the reorder surface (input validation, trust boundaries).
- Full `spec_code` cross-reference between `implementation-summary.md` claims and shipped code.
- Checklist-evidence review once a `checklist.md` is created.

## Audit Appendix
- **Iterations:** 1
- **Files reviewed:** 8
- **Convergence replay:** Loop stopped due to `maxIterationsReached`. Dimension coverage 2/4 (correctness, maintainability).
- **Evidence sources:** direct file reads of `hybrid-search.ts`, `search-flags.ts`, `pipeline/types.ts`, `cosine-topn-reorder.vitest.ts`, and the target spec-folder docs.
- **Claim adjudication:** No P0/P1 findings; no adjudication packets required.
