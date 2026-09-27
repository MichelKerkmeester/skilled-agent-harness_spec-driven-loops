---
title: Deep Review Strategy - mimo lineage
description: Session tracking for the mimo fan-out lineage over the advisor refinements manifest.
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review of `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review` (spec-folder target). Scope is exactly the 38 repo-relative paths in `goal-file-manifest.txt`, read against the requirements in `../002-hook-deadline-and-diagnostics/spec.md` through `../005-follow-up-fixes/spec.md`. In the four deep-loop workflow files only `step_convergence_report` is in scope; in `.pi/extensions/pi-cache-optimizer/index.ts` only the hash-verified edits section is in scope.

## Known Context

- Target pointers: 38 manifest files (hooks, advisor runtime, render plugin mirror, four deep-loop YAMLs, pi-cache-optimizer, 13 test files).
- Claimed behavior to verify: hook deadline + runtime labels + diagnostics (phase 2, ../002); hook path request option, stale-daemon retry, casual-prompt gate (phase 3, ../003); fallback status heads and dedup (phases 4-5, ../004 + ../005); deep-loop `step_convergence_report` synthesis close without root dashboard (phase 5 fix); Pi `edit_lines` hash-verified edits section.
- Reuse/convention pointers: sibling packet specs under `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/002..005`.
- Risk areas: cross-runtime hook shims (4 runtimes), daemon request path + stale-daemon retry loop, embedded workflow shell scripts, untrusted prompt content flowing through advisor briefs, hash-verified edit gating in pi-cache-optimizer.
- Missing context: no `resource-map.md` at init (coverage gate skipped); no checklist.md in the packet (AC_COVERAGE exempt, Level 1).
- Stale-graph caveats: graph-metadata.json exists for the packet but no code graph for the manifest files is consumed here.
- Out of scope: fixing findings; the research lineages under `../001-deep-research/research/`; other sessions' uncommitted work.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

Fixing findings. Reviewing the research lineages under `../001-deep-research/research/`. Reviewing sections of the four deep-loop YAMLs outside `step_convergence_report`, or pi-cache-optimizer outside the hash-verified edits section (those are context only).

## 5. STOP CONDITIONS

Hard ceiling: 3 iterations (`stopPolicy: max-iterations`), then synthesis with `stopReason: maxIterationsReached`. Also stop early on an unrecoverable state/containment failure.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
[None yet]

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
