# Review Report: request-quality-aggregation

## Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 1 |
| **Active P2** | 2 |
| **Iterations** | 1 of 1 |
| **Dimensions Covered** | 4/4 (correctness, security, traceability, maintainability) |
| **Stop Reason** | maxIterationsReached |
| **Scope** | `assessRequestQuality` and `computeResultConfidence` in `confidence-scoring.ts`, plus `request-quality-aggregation.vitest.ts` test coverage |

The implementation code (`confidence-scoring.ts`) is correct, secure, and well-structured. The top-dominant + margin-aware "good" rule works as specified, the quality-ratio head cap correctly isolates recall expansion, and all division-by-zero guards are present. However, the spec folder is a template scaffold — `spec.md`, `plan.md`, and `tasks.md` contain no populated requirements — making formal traceability verification impossible. No `checklist.md` exists. The single active P1 finding (F001) prevents a PASS verdict.

## Planning Trigger

This CONDITIONAL verdict routes to `/speckit:plan` to backfill spec documentation:
1. Populate `spec.md` with the actual requirements the implementation satisfies (top-dominant >= 0.8, margin-aware goodness, head-capped quality ratio, weak/gap safety net)
2. Populate `plan.md` with the technical approach already described in `implementation-summary.md`
3. Populate `tasks.md` with the actual tasks performed
4. Create `checklist.md` with verification evidence matching `implementation-summary.md` §Verification

The code changes themselves need no remediation — only the documentation scaffold needs population.

## Active Finding Registry

| ID | Severity | Category | Dimension | Title | File | Line | First | Last | Status |
|----|----------|----------|-----------|-------|------|------|-------|------|--------|
| F001 | P1 | traceability | traceability | Spec scaffold gap — empty template with 100% completion claim | spec.md | 81 | 1 | 1 | active |
| F002 | P2 | maintainability | maintainability | No boundary-value test coverage for threshold constants | confidence-scoring.ts | 67 | 1 | 1 | active |
| F003 | P2 | maintainability | maintainability | assessRequestQuality assumes parallel arrays without length validation | confidence-scoring.ts | 355 | 1 | 1 | active |

### F001 — Spec scaffold gap (P1)
**Claim:** `spec.md`, `plan.md`, and `tasks.md` are template scaffolds with no populated requirements, yet `implementation-summary.md` claims 100% completion. Traceability from spec to code is impossible — the implementation cannot be verified against documented requirements because no requirements are written.

**Evidence:**
- `spec.md:81-128` — REQ-001 and REQ-002 are placeholders; scope section is entirely placeholder text
- `plan.md:1-170` — All sections contain template defaults only
- `tasks.md:1-106` — Tasks are template defaults; no task references the actual files changed
- `implementation-summary.md:26` — `completion_pct: 100`

**Adjudication:** `finalSeverity: P1`, `confidence: 0.92`. The code implementation is described in the implementation summary, but formal requirements are not enumerated. A parent-spec search was not conducted in this iteration — if `017-search-and-output-intelligence-implementation/spec.md` contains the normative requirements, this could downgrade to P2.

**Downgrade trigger:** If parent spec contains the requirements this child phase satisfies, downgrade to P2 (documentation backfill deferred).

### F002 — Boundary-value test gap (P2)
**Claim:** The `assessRequestQuality` decision tree gates on four threshold constants (TOP_DOMINANT_THRESHOLD=0.8, HIGH_THRESHOLD=0.7, qualityRatio=0.6, LARGE_MARGIN_THRESHOLD=0.15), but no test case exercises exactly-at-threshold values. A `>=` vs `>` operator error would be invisible.

**Evidence:**
- `confidence-scoring.ts:67` — TOP_DOMINANT_THRESHOLD = 0.8
- `confidence-scoring.ts:384-390` — three threshold comparisons
- `request-quality-aggregation.vitest.ts:41-58` — test values at 0.78 and 0.81 (never exactly 0.80)

**Adjudication:** `finalSeverity: P2`, `confidence: 0.78`. Low blast radius; current tests cover the intent well. Adding boundary values would improve reliability without changing behavior.

### F003 — Parallel array assumption (P2)
**Claim:** `assessRequestQuality` assumes `results` and `confidences` arrays are parallel without asserting it. All current callers produce parallel arrays from `computeResultConfidence`, so no live bug exists, but a future caller could pass mismatched arrays and get silently wrong `confidences.slice()` analysis.

**Evidence:**
- `confidence-scoring.ts:355-370` — function accepts separate `results` and `confidences` params with no mutual-length assertion

**Adjudication:** `finalSeverity: P2`, `confidence: 0.60`. Defensive-only; no existing caller is broken.

## Remediation Workstreams

### Lane 1: Spec documentation backfill (P1)
- **F001**: Populate `spec.md` REQ-001, REQ-002, scope, and success criteria with the requirements the implementation already satisfies
- Populate `plan.md` with technical context (TypeScript, vitest, confidence-scoring module)
- Populate `tasks.md` with the actual tasks (modify `confidence-scoring.ts`, create `request-quality-aggregation.vitest.ts`, run typecheck + vitest)
- Create `checklist.md` with verification evidence from `implementation-summary.md:103-110`
- **Order:** 1 | **Dependency:** none

### Lane 2: Test coverage hardening (P2 advisories)
- **F002**: Add boundary-value test cases for TOP_DOMINANT_THRESHOLD=0.8, HIGH_THRESHOLD=0.7, qualityRatio=0.6, and LARGE_MARGIN_THRESHOLD=0.15
- **F003**: Add `assert(confidences.length === results.length)` or equivalent guard in `assessRequestQuality`, or add a test for mismatched-array defense
- **Order:** 2 | **Dependency:** Lane 1 (spec docs should be current before hardening tests)

## Spec Seed

### Updated spec.md requirements
```markdown
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Top-dominant quality: a result with absolute relevance >= 0.8 reads "good" regardless of tail | Given a query with topScore=0.81 and all other results weak, assessRequestQuality returns "good" |
| REQ-002 | Margin-aware quality: topScore >= 0.7 plus either qualityRatio >= 0.6 or topMargin >= 0.15 reads "good" | Given a strong top result with a clear gap to #2, assessRequestQuality returns "good" even when tail results are weak |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Quality ratio must be capped at the ranking head (K=5) so recall expansion does not depress it | Given 5 confident + 6 weak results, assessRequestQuality returns "good" despite whole-set ratio < 0.6 |
| REQ-004 | Weak/gap thresholds preserved for low-signal queries | Given topScore < 0.4 with low confidence, returns "gap"; given mixed signal, returns "weak" |
```

## Plan Seed

1. T001 Backfill spec.md requirements (REQ-001 through REQ-004) from implementation evidence
2. T002 Backfill plan.md technical context section
3. T003 Backfill tasks.md with actual task descriptions referencing `confidence-scoring.ts` and `request-quality-aggregation.vitest.ts`
4. T004 Create checklist.md with verification items from implementation-summary.md §Verification
5. T005 [P] Add boundary-value test cases for threshold constants (F002)
6. T006 [P] Add parallel-array length assertion or test (F003)

## Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| `spec_code` | core | **FAIL** | hard | spec.md is empty template; no normative claims to verify against implementation |
| `checklist_evidence` | core | **PARTIAL** | hard | No checklist.md exists; informal verification in implementation-summary.md |

Core traceability is broken — the two hard-gated protocols cannot pass until spec docs are populated. This alone would force FAIL if not for the fact that the implementation itself has no correctness or security issues.

## Resource Map Coverage Gate

Not applicable — `resource-map.md` was not present in the spec folder at init. Skipping coverage gate.

## Deferred Items

- **dist/ build freshness:** `dist-freshness.vitest.ts` was reported as FAIL in implementation-summary.md due to intentionally deferred `npm run build`. This is a known, documented limitation, not a review finding.
- **Pre-existing test failures:** The implementation-summary.md notes unrelated WIP failures (scaffold-golden-snapshots, phase-parent-pointer, handler-memory-index-needs-rebuild, etc.) that do not import `confidence-scoring`. Out of scope.
- **Full-suite baseline:** The full vitest suite on the working tree reports failures unrelated to this change. Not actionable in this review.

## Audit Appendix

### Iteration Table

| # | Focus | Files | Dimensions | P0 | P1 | P2 | Ratio | Status |
|---|-------|-------|------------|----|----|----|-------|--------|
| 1 | Comprehensive 4-dimension | 2 (+3 docs) | D1,D2,D3,D4 | 0 | 1 | 2 | 0.44 | complete |

### Convergence Replay
- **Stop reason:** `maxIterationsReached` — hard cap of 1 iteration for fan-out lineage
- **Dimension coverage:** 4/4 (100%) — all dimensions reviewed
- **P0 resolution:** 0 P0 active — gate passes
- **Evidence density:** 3 findings with 13 total evidence citations (avg 4.3 per finding) — gate passes
- **Claim adjudication:** All 3 new findings have adjudication packets with required fields — gate passes

### File Coverage Matrix

| File | D1 | D2 | D3 | D4 | Findings |
|------|----|----|----|----|----------|
| `confidence-scoring.ts` | x | x | x | x | F002, F003 |
| `request-quality-aggregation.vitest.ts` | x | — | x | x | — |
| `spec.md` | — | — | x | — | F001 |
| `plan.md` | — | — | x | — | — |
| `tasks.md` | — | — | x | — | — |

### Dimension Breakdown

| Dimension | Verdict | Key Finding |
|-----------|---------|-------------|
| Correctness | PASS | Logic tree correct; all guards present; top-dominant short-circuit, margin disjunct, quality-ratio head cap all verified against source |
| Security | PASS | No auth, secrets, I/O, or injection vectors; pure computational logic with no trust boundaries |
| Traceability | FAIL | spec.md/plan.md/tasks.md are template scaffolds; no requirements to verify code against; no checklist.md |
| Maintainability | CONDITIONAL | Well-structured code and tests; 2 P2 advisories for boundary-value test coverage and defensive-array validation |
