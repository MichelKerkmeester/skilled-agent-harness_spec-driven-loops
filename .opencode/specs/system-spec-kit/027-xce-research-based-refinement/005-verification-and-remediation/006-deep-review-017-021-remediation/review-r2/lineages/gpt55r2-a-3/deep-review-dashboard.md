# Deep Review Dashboard - gpt55r2-a-3

## 1. Status

<!-- MACHINE-OWNED: START -->
- Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval`
- Target Type: spec-folder
- Started: 2026-06-18T05:54:16Z
- Session: fanout-gpt55r2-a-3-1781761314338-6u1ztm (generation 1, lineage new)
- Status: COMPLETE
- Release Readiness: in-progress
- Iteration: 1 of 1
- Provisional Verdict: CONDITIONAL
- hasAdvisories: true
<!-- MACHINE-OWNED: END -->

## 2. Findings Summary

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active, 0 new this iteration, 0 upgrades, 0 resolved
- **P1 (Major):** 2 active, 2 new this iteration, 0 upgrades, 0 resolved
- **P2 (Minor):** 1 active, 1 new this iteration, 0 upgrades, 0 resolved
- **Repeated findings:** 0
- **Dimensions covered:** correctness, security, traceability, maintainability
- **Convergence score:** 0.45
<!-- MACHINE-OWNED: END -->

## 3. Progress

<!-- MACHINE-OWNED: START -->
| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|---------------|-------|--------|
| 1 | Search/retrieval scope, recall, and contract drift | 14 | correctness, security, traceability, maintainability | 0/2/1 | 1.00 | complete |
<!-- MACHINE-OWNED: END -->

## 4. Coverage

<!-- MACHINE-OWNED: START -->
- Files reviewed: 14 / broad scope sampled
- Dimensions complete: 4 / 4 total
- Core protocols complete: 2 / 2 required (checklist_evidence marked not applicable)
- Overlay protocols complete: 1 / 2 applicable (feature_catalog_code partial)
<!-- MACHINE-OWNED: END -->

## 5. Trend

<!-- MACHINE-OWNED: START -->
- Severity trend (last 3): P0:0 P1:2 P2:1
- New findings trend (last 3): 3 stable (single iteration)
- Traceability trend (last 3): spec_code=partial, checklist_evidence=notApplicable
<!-- MACHINE-OWNED: END -->

## 6. Resolved / Ruled Out

<!-- MACHINE-OWNED: START -->
- **Disproved findings:** none
- **Dead-end review paths:** confidence calibration monotonicity, Stage2 hybrid intent double-weighting recurrence
<!-- MACHINE-OWNED: END -->

## 7. Next Focus

<!-- MACHINE-OWNED: START -->
Plan fixes for F001 and F002. F001 should constrain or disable community fallback when `specFolder` is set. F002 should replace arbitrary prefix sampling with a scoped/indexed summary retrieval path.
<!-- MACHINE-OWNED: END -->

## 8. Active Risks

<!-- MACHINE-OWNED: START -->
- F001 can violate explicit spec-folder search boundaries on weak-result queries.
- F002 makes summary recall unreliable exactly on large corpora where the scale gate activates it.
- F003 is public contract drift: callers can request `includeArchived`, but handler metadata reports it as ignored.
<!-- MACHINE-OWNED: END -->
