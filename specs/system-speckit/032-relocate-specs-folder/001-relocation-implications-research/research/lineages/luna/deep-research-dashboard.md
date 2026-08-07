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
- Topic: Implications of relocating the root .opencode/specs folder to a top-level specs/ directory outside .opencode: spec-kit tooling path assumptions (validate.sh, create.sh, generate-description.js, backfill-graph-metadata.js), cross-runtime mirror behavior (.claude, .codex, .cursor, .devin, .pi), git and .gitignore interactions (the existing root specs symlink, the !specs and !.opencode/ negation rules, and ~/.gitignore_global's /specs and /.opencode/ ignores for downstream symlinked repos), Spec Kit Memory MCP server path resolution, and the scale/risk of repointing in-repo path references
- Started: 2026-08-06T12:31:20.167Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-luna-1786019208170-r5nald
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Tooling path assumptions | - | 1.00 | 6 | complete |
| 3 | Cross-runtime mirror behavior | - | 0.75 | 5 | complete |
| 2 | Git, symlink, and ignore behavior | - | 0.85 | 5 | complete |
| 4 | Spec Kit Memory MCP path resolution | - | 0.65 | 6 | complete |
| 5 | Measured reference surface and migration shape | - | 0.45 | 5 | complete |

- iterationsCompleted: 5
- keyFindings: 27
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which in-repo tools hard-code the current specs root, and which resolve it dynamically?
- [x] What breaks or stays stable across runtime mirrors, generated symlinks, and shared assets?
- [x] How do Git, symlinks, ignore negations, and global ignore rules affect relocation and downstream repos?
- [x] How does Spec Kit Memory resolve spec paths, and what boundary changes would it require?
- [x] What is the measured reference count and the safest migration shape under these constraints?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▅▅▅▅▆▆▆▅▅▄▄▃▃▂▂▁
- score sparkline: █▇▇▆▅▅▅▅▆▆▆▅▅▄▄▃▃▂▂▁
- Last 3 ratios: 0.85 -> 0.65 -> 0.45
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.45
- coverageBySources: {"code":25,"other":50}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Coverage-graph convergence was unavailable because the local `better-sqlite3` binary does not match the active Node ABI. Inline convergence remains the available signal. (iteration 1)
- No complete migration direction is ruled out. The evidence rules out the assumption that all four named scripts need the same kind of patch: their failure modes differ between default selection, discovery, special cases, and caller-provided paths. (iteration 1)
- The YAML executor branch was attempted twice and produced no leaf artifact because `cli-codex` was already present in `SPECKIT_CLI_DISPATCH_STACK`. The direct-mode fallback is bounded to this detached lineage and is recorded in `deep-research-state.jsonl`. (iteration 1)
- Direct child-path ignore inspection through the tracked `specs` symlink is not available because Git treats the path as beyond a symbolic link. The root-level index and ignore evidence remain usable. (iteration 2)
- The claim that the current source repository's local ignore result predicts downstream behavior is ruled out; the configured global ignore source creates a different contract for downstream symlinked repositories. (iteration 2)
- A broad “regenerate all five runtime surfaces because specs moved” requirement is ruled out by the generator contracts: the generated surfaces do not consume the specs root directly. (iteration 3)
- The shared mirror check is not a clean migration baseline because it already reports unrelated drift. Its output is still useful as a pre-existing-state receipt. (iteration 3)
- A live database/index scan was not confirmed because the memory daemon IPC endpoint was unavailable; source-level behavior is the evidence for this iteration. (iteration 4)
- Treating Memory MCP as uniformly dual-root-aware is ruled out by the different discovery, recovery, and repair implementations. (iteration 4)
- A live Memory database migration result was not confirmed because the daemon IPC endpoint and coverage graph native module were unavailable. (iteration 5)
- Blindly replacing every `.opencode/specs` literal with `specs` is ruled out because references have different contracts and precedence. (iteration 5)
- Regenerating all runtime mirrors as a relocation step is ruled out by the zero source-reference result and the generator ownership audit; existing mirror drift still requires a separate baseline. (iteration 5)

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
