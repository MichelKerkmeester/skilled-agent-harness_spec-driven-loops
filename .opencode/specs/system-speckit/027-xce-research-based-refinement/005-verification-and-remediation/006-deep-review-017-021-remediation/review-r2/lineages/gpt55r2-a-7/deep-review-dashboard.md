# Deep Review Dashboard - gpt55r2-a-7

## 1. Status
<!-- MACHINE-OWNED: START -->
- Target: A-search-retrieval
- Target Type: files
- Started: 2026-06-18T06:20:54Z
- Session: fanout-gpt55r2-a-7-1781761314338-6u1ztm (generation 1, lineage new)
- Status: COMPLETE
- Release Readiness: in-progress
- Iteration: 1 of 1
- Provisional Verdict: CONDITIONAL
- hasAdvisories: true
<!-- MACHINE-OWNED: END -->

## 2. Findings Summary
<!-- MACHINE-OWNED: START -->
- P0: 0 active, 0 new this iteration, 0 upgrades, 0 resolved
- P1: 3 active, 3 new this iteration, 0 upgrades, 0 resolved
- P2: 1 active, 1 new this iteration, 0 upgrades, 0 resolved
- Repeated findings: 0
- Dimensions covered: correctness, security, performance, concurrency-cancellation, maintainability, spec-vs-code-drift
- Convergence score: 0.15
<!-- MACHINE-OWNED: END -->

## 3. Progress
<!-- MACHINE-OWNED: START -->
| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|---------------|-------|--------|
| 1 | search/retrieval constraints and fallback seams | 10 | correctness, security, performance, concurrency-cancellation, maintainability, spec-vs-code-drift | 0/3/1 | 0.85 | complete |
<!-- MACHINE-OWNED: END -->

## 4. Coverage
<!-- MACHINE-OWNED: START -->
- Files reviewed: 10 / 10 selected for this lineage
- Dimensions complete: 6 / 6 configured
- Core protocols complete: 2 / 2 required
- Overlay protocols complete: 1 / 1 applicable
<!-- MACHINE-OWNED: END -->

## 5. Trend
<!-- MACHINE-OWNED: START -->
- Severity trend: P0:0 P1:3 P2:1
- New findings trend: 4 in one configured iteration
- Traceability trend: core partial/pass; overlay partial
<!-- MACHINE-OWNED: END -->

## 6. Resolved / Ruled Out
<!-- MACHINE-OWNED: START -->
- Disproved findings: graph-expanded recovery fallback not active in formatter path.
- Dead-end review paths: multi-concept tier/context propagation, because post-collection filters exist.
<!-- MACHINE-OWNED: END -->

## 7. Next Focus
<!-- MACHINE-OWNED: START -->
Fix fallback scope propagation and add regression tests for scoped community fallback, scoped LLM seeds, and summary-embedding deprecated/descendant filters.
<!-- MACHINE-OWNED: END -->

## 8. Active Risks
<!-- MACHINE-OWNED: START -->
- F001 can return out-of-folder/out-of-filter community member rows and can exceed requested result limits after Stage 4.
- F002 can surface deprecated memories via summary embeddings despite default hard-exclusion behavior in other channels.
- F003 can send unscoped corpus excerpts to a configured LLM reformulation endpoint.
<!-- MACHINE-OWNED: END -->
