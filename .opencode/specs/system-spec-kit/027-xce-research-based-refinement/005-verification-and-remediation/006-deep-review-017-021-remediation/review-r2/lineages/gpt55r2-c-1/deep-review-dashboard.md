# Deep Review Dashboard - gpt55r2-c-1

## 1. Status
<!-- MACHINE-OWNED: START -->
- Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server`
- Target Type: spec-folder
- Started: 2026-06-18T05:47:52Z
- Session: fanout-gpt55r2-c-1-1781761364358-6qni37 (generation 1, lineage new)
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
- **Dimensions covered:** correctness, security, traceability
- **Convergence score:** 0.45
<!-- MACHINE-OWNED: END -->

## 3. Progress
<!-- MACHINE-OWNED: START -->
| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|---------------|-------|--------|
| 1 | checkpoint scope isolation + TCP IPC contract | 7 | correctness, security, traceability | 0/2/0 | 1.00 | complete |
<!-- MACHINE-OWNED: END -->

## 4. Coverage
<!-- MACHINE-OWNED: START -->
- Files reviewed: 7 / broad target set
- Dimensions complete: 3 / 4 total
- Core protocols complete: 0 / 2 required (partial)
- Overlay protocols complete: 0 / 2 applicable
<!-- MACHINE-OWNED: END -->

## 5. Trend
<!-- MACHINE-OWNED: START -->
- Severity trend (last 3): P0:0 P1:2 P2:0
- New findings trend (last 3): 2 stable
- Traceability trend (last 3): partial
<!-- MACHINE-OWNED: END -->

## 6. Resolved / Ruled Out
<!-- MACHINE-OWNED: START -->
- **Disproved findings:** none
- **Dead-end review paths:** direct `context-server.js` source path was stale; live source is `context-server.ts`.
<!-- MACHINE-OWNED: END -->

## 7. Next Focus
<!-- MACHINE-OWNED: START -->
Replay F001 and F002 after remediation; if continuing review, cover remaining handler/provider daemon surfaces and maintainability.
<!-- MACHINE-OWNED: END -->

## 8. Active Risks
<!-- MACHINE-OWNED: START -->
- F001: scoped checkpoint restore/delete/list can match unscoped checkpoint metadata.
- F002: documented TCP IPC override is split-brain between launcher/CLI and server resolver.
- Max-iteration stop happened before full dimension and file coverage.
<!-- MACHINE-OWNED: END -->
