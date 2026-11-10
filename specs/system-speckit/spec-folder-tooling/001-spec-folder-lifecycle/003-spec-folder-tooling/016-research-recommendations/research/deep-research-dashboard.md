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
- Topic: Overengineering and simplification in the research-recommendations build: where heal-spec-docs.cjs, upgrade-legacy.mjs, validation/orchestrator.ts, frontmatter-migration.ts, the doctor update compatibility assets and their tests carry abstraction, modes, flags, options, fallbacks, duplicated machinery, configuration or tests beyond what phases 003, 009, 011, 012, 013 and 015 require; judged against prevent-overengineering.md and the AGENTS.md section 3 Restraint Signals; ranked concrete simplifications with reduction, risk, pinning tests and forbidding requirements; and whether the eight applied P2 simplifications went far enough.
- Started: 2026-10-09T08:44:52Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-10-09T08:44:52Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Which modes, flags, options and branches in heal-spec-docs.cjs and upgrade-legacy.mjs (anchor repair from 011, folded one-off repairs from 012, lane rules as heal modes from 015) go beyond what those phase specs require? | - | 1.00 | 3 | complete |
| 2 | Trace residual writer, loader, parser, walker, refusal-ordering, and export machinery across heal-spec-docs.cjs, upgrade-legacy.mjs, and frontmatter-migration.ts; assess whether the eight applied P2 simplifications went far enough for the narrow CLI-surface slice. | - | 0.83 | 3 | complete |
| 3 | Compare phase-013 anchor validation and phase-009 doctor compatibility state machinery with their requirements, identifying only unearned diagnostic or declarative complexity. | - | 0.83 | 3 | complete |
| 4 | Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough? | - | 0.63 | 4 | complete |
| 5 | Broaden: rank the concrete simplifications found so far | - | 0.70 | 5 | complete |

- iterationsCompleted: 5
- keyFindings: 19
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which modes, flags, options and branches in heal-spec-docs.cjs and upgrade-legacy.mjs (anchor repair from 011, folded one-off repairs from 012, lane rules as heal modes from 015) go beyond what those phase specs require?
- [x] Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough?
- [x] Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for?
- [x] Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- [x] What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▅▅▅▅▅▅▄▄▃▂▁▁▂▂▂▂
- score sparkline: █▇▇▆▅▅▅▅▅▅▄▄▃▂▁▁▂▂▂▂
- Last 3 ratios: 0.83 -> 0.63 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"code":8,"other":49}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Merging archived packets into the active repair path: phase 011 explicitly restricts archive edits to questions-anchor un-nesting. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:78-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:114-116]` (iteration 1)
- Removing any of the five lane modes, their refusal/idempotence gates or the all-mode sequence: phase 015 requires each. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:103-113]` (iteration 1)
- Removing grouped-detail reporting: phase 012 requires grouped failures with detail counts. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:104-113]` (iteration 1)
- Removing the anchor-repair mode or its dry-run/apply route: phase 011 explicitly requires the repair mode, correct dry run and upgrade integration. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]` (iteration 1)
- Do not merge the reversibility-manifest writer with the healer writer without preserving the manifest's exclusive-create and private-file semantics. (iteration 2)
- Do not merge the specialized healer frontmatter reader with the full migration parser without a demonstrated shared contract; their visible responsibilities differ. (iteration 2)
- Do not remove deterministic refusal sorting without checking the persisted-baseline equality contract and adding a focused ordering assertion. (iteration 2)
- Do not replace both packet discovery paths with a configurable generic walker based only on traversal similarity; active/archive/artifact and skip policies differ. (iteration 2)
- Deleting planLayoutMove layout-state branches or collision and symlink checks: phase 009 preview and partial-move requirements depend on them. (iteration 3)
- Removing move approval, upgrade approval, step logs, interrupted-run recovery, or rollback reporting: phase 009 requires a separately approved, auditable, resumable path. (iteration 3)
- Removing pre-existing anchor pairing checks or the phase-parent exemption solely because phase 013 focuses on nesting and duplicate closers. (iteration 3)
- Do not merge the manifest writer with the healer writer, the focused healer frontmatter reader with the full migration parser, or the active and archive walkers. The existing evidence shows distinct write, parse, and selection contracts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244] (iteration 4)
- Do not remove refusal sorting based on the present evidence. A direct order assertion is missing, but baseline stability is exercised by repeated-run equality. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283] (iteration 4)
- Do not remove the lane-mode behaviors, their refusal and idempotence gates, or the ordered all-mode run. Phase 015 requires them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114] (iteration 4)
- Merging distinct file writers, parsers or walkers, or removing refusal sorting based on the evidence from the previous iteration. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:31-35] (iteration 5)
- Removing the close-before-open diagnostic. Phase 013 explicitly requires it, and a focused test pins it. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198] (iteration 5)
- Removing the doctor layout-state cases, preview and collision checks, separate approvals, logs, interrupted-run recovery or rollback reporting. Phase 009 requires these safety and recovery behaviors. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:170-182] (iteration 5)
- Removing the five lane modes, their derivability/refusal behavior, idempotence gates or ordered upgrade integration. Phase 015 requires these behaviors and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114] (iteration 5)

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
