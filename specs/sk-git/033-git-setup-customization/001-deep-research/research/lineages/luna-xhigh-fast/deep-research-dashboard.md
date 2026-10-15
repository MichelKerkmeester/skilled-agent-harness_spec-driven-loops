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
- Topic: Design a doctor-style setup path for sk-git that lets a repository user adapt sk-git to their own repository, the way /doctor:sk-code setup lets them adapt sk-code. Study the sk-code precedent first; map every customizable part of sk-git and /doctor:git; recommend setup command placement, rejected ideas, read-only proof requirements, and implementation phases.
- Started: 2026-10-15T05:39:48Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-luna-xhigh-fast-1792042581294-btcd4b
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
| 1 | Study the sk-code setup guide and /doctor:sk-code setup precedent | - | 1.00 | 4 | complete |
| 2 | Map repository-specific sk-git policy surfaces: SKILL.md, hard-rules.json, commit contracts, and remote branch allowlist | - | 1.00 | 4 | complete |
| 3 | Trace worktree base and provisioning inputs, Commit-Id opt-in, and shared allocator/hook behavior | - | 1.00 | 4 | complete |
| 4 | Trace repository hook trust, Git hook installation and persistent gates, and runtime preflight advisory delivery | - | 1.00 | 4 | complete |
| 5 | Define the read-only setup proof matrix, inspect doctor route constraints, decide command placement, and reject unsafe or redundant approaches | - | 0.90 | 5 | complete |

- iterationsCompleted: 5
- keyFindings: 21
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What does the sk-code adaptation guide and `/doctor:sk-code setup` check, and how do those responsibilities divide?
- [x] Which sk-git policy inputs are repository-customizable, where are they set, and what behavior depends on them?
- [x] How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact?
- [x] What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- [x] Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████████████▇▅▄▂▁
- score sparkline: ███████████████▇▅▄▂▁
- Last 3 ratios: 1.00 -> 1.00 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":8,"other":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Rejected a doctor action that applies repairs: the precedent's diagnostic boundary explicitly requires reporting a repair command and leaves it to the operator. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28] (iteration 1)
- Rejected making the remote allowlist a denylist replacement: the current file is additive, and removing it deliberately leaves only the built-in exemptions. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:36-44] (iteration 2)
- Rejected treating a successful `validate-message.mjs --explain` exit as proof of enforcement: the command returns 0 even when there is no contract directory or a kind has no enforced rules. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136] (iteration 2)
- No alternate user-facing Commit-Id format or allocator setting appeared in the inspected allocator and policy interfaces; changing the format would cross the history scanner, shared hook policy, stamper, enforcement gate, and shipped template rather than adjust one repository setting. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47] (iteration 3)
- No single “hooks installed” bit covers this system: global Git lifecycle hooks, per-repository trust, persistent gate settings, and runtime preflight adapters have separate resolvers and failure modes. [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84] (iteration 4)
- Rejected a separate `/doctor:sk-git` command: `/doctor:git` already resolves git-specific targets through the canonical route manifest and is owned by `sk-git`, so a second router would split one domain without adding a new owner. [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267] (iteration 5)
- Rejected the idea that the existing `hooks` target is already a setup diagnostic: its status read is followed by an interactive choice and approved config writes, so it does not provide the one-pass read-only result the precedent establishes. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103] (iteration 5)

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
