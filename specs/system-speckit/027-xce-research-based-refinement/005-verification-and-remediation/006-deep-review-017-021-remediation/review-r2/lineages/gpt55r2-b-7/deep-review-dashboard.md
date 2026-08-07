# Deep Review Dashboard - gpt55r2-b-7

## 1. Status
<!-- MACHINE-OWNED: START -->
- Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002`
- Target Type: spec-folder
- Started: 2026-06-18T06:17:55Z
- Session: fanout-gpt55r2-b-7-1781761339355-o7qylx (generation 1, lineage new)
- Status: COMPLETE
- Release Readiness: in-progress
- Iteration: 1 of 1
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false
<!-- MACHINE-OWNED: END -->

## 2. Findings Summary
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active, 0 new this iteration, 0 upgrades, 0 resolved
- **P1 (Major):** 2 active, 2 new this iteration, 0 upgrades, 0 resolved
- **P2 (Minor):** 0 active, 0 new this iteration, 0 upgrades, 0 resolved
- **Repeated findings:** 0
- **Dimensions covered:** correctness, security, traceability, maintainability
- **Convergence score:** 0.45
<!-- MACHINE-OWNED: END -->

## 3. Progress
<!-- MACHINE-OWNED: START -->
| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|---------------|-------|--------|
| 1 | correctness-security-data-integrity broad pass | 13 | correctness, security, traceability, maintainability | 0/2/0 | 1.00 | complete |
<!-- MACHINE-OWNED: END -->

## 4. Coverage
<!-- MACHINE-OWNED: START -->
- Files reviewed: 13 / 13 selected
- Dimensions complete: 4 / 4 total
- Core protocols complete: 1 / 2 complete-or-partial
- Overlay protocols complete: 1 / 2 applicable complete-or-partial
- Resource map coverage: skipped; target scope has no `resource-map.md`
<!-- MACHINE-OWNED: END -->

## 5. Trend
<!-- MACHINE-OWNED: START -->
- Severity trend (last 3): P0:0 P1:2 P2:0
- New findings trend (last 3): 2 stable
- Traceability trend (last 3): partial
<!-- MACHINE-OWNED: END -->

## 6. Resolved / Ruled Out
<!-- MACHINE-OWNED: START -->
- Disproved findings: none
- Ruled out: retention hard-delete orphaning; background batch cancellation drain
<!-- MACHINE-OWNED: END -->

## 7. Next Focus
<!-- MACHINE-OWNED: START -->
Fix governed scan/ingest metadata rollback and soft-delete projection visibility, then rerun targeted validation.
<!-- MACHINE-OWNED: END -->

## 8. Active Risks
<!-- MACHINE-OWNED: START -->
- F001: governed bulk scan/ingest can commit unscoped rows if metadata update fails.
- F002: soft-delete mode can leave deleted rows active in projection-backed readers.
- Stop reason is `maxIterationsReached`, not convergence.
<!-- MACHINE-OWNED: END -->
