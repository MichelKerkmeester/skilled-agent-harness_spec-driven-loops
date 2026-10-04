---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Is /doctor:update perfected? Audit the whole /doctor:update surface end to end: the router .skilled/commands/doctor/update.md, the workflows doctor-update-check.yaml, doctor-update-align.yaml and doctor-update-apply.yaml, doctor-update-presentation.txt, the engine .skilled/commands/doctor/scripts/release-update.cjs and its tests. Find every remaining defect, gap, unsafe path and drift: workflow promises the engine does not keep, engine behaviour the workflows do not describe, real operator scenarios that break (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback, customized skills), sk-create-command contract violations, missing tests. Rank the fixes that would make it perfect. Ground every claim in file and line evidence from this repository.
- Started: 2026-10-03T19:12:55.598Z
- Status: INITIALIZED
- Iteration: 6 of 6
- Session ID: 2026-10-03T19:12:55.598Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Cross-check the router, presentation asset and check/align/apply workflows against engine flags and apply/rollback behavior. | - | 0.68 | 0 | complete |
| 2 | Q2: exercise release-update.cjs across vendored-without-tags, offline, prerelease, rename, deletion, binary/generated file, partial/interrupted apply, and rollback scenarios; compare behavior with tests. | - | 0.70 | 0 | complete |
| 5 | Q5 only: trace framework acquisition and sync, post-apply rebuild or reindex, operator docs and changelog, and recovery after failed or interrupted apply. | - | 0.68 | 0 | insight |
| 3 | Q3 only (other iterations cover Q1, Q2, Q4 and Q5 concurrently, so stay on Q3): check .skilled/commands/doctor/update.md and doctor-update-presentation.txt against the sk-create-command contract in .skilled/skills/sk-doc/sk-create-command/ (thin router, presentation split, argument-hint, allowed-tools, approval gates, dry-run, rollback) and against the three doctor-update-*.yaml workflows. Report every contract violation and every place the router, presentation and workflows disagree, with file:line evidence. | - | 0.46 | 0 | insight |
| 4 | Q4 only: customization handling end to end in release-update.cjs and the align/apply workflows. | - | 0.66 | 0 | insight |
| 6 | Independent cross-check of iterations 1-5: re-verify every P0/P1 and the strongest P2 findings against the code, reconcile contradictions between iterations, hunt cross-question defects, settle Q1 | cross-check | 0.62 | 28 | complete |

- iterationsCompleted: 6
- keyFindings: 49
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback?
- [x] Q2: Does release-update.cjs behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each?
- [x] Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows?
- [x] Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?
- [x] Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇███████▇▅▃▂▂▃▅▇▇▆▆▆
- score sparkline: ▇███████▇▅▃▂▂▃▅▇▇▆▆▆
- Last 3 ratios: 0.46 -> 0.66 -> 0.62
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.62
- coverageBySources: {"code":3,"other":22}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A data-overwriting race from local edits between dry-run and approval: `assertPlanFresh` and the HEAD-dirty check refuse or skip instead [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1877-1882]. (iteration 6)
- A tracked `.skilled/release/` colliding with apply's metadata writes: `git ls-files .skilled/release` is empty and `runs/` is ignored at `.gitignore:256`. (iteration 6)
- An offline downgrade through a stale local tag: when the recorded base cannot resolve offline, the base falls back to ancestry, so newer local content reads `local-only`, not `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:797-819]. (iteration 6)
- None. Every action produced evidence. (iteration 6)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
