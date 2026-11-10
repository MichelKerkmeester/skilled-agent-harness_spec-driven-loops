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
- Topic: Design a doctor-style setup path for sk-git that lets a repository user adapt sk-git to their own repository, the way /doctor:sk-code setup lets them adapt sk-code. Study the sk-code precedent first: .skilled/commands/doctor/sk-code.md, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs, the sk-code adaptation guide and the packets under specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build and 029-surface-setup-build. Then map every customizable part of sk-git (.skilled/skills/sk-git/: SKILL.md, hard-rules.json, the commit message template and its per-repository rules, the remote branch allowlist, worktree naming and provisioning, the Commit-Id allocator and its opt-in config, hook trust and skilled.trustRepoHooks, the global hooks under .skilled/scripts/git-hooks/ and the preflight advisory) and the existing /doctor:git command (.skilled/commands/doctor/git.md). For each part state what a user would want to change, where it is set today, what breaks when it is changed or removed, and what a read-only setup check would need to prove. Decide whether the setup belongs in /doctor:git as a new action or in a separate command, and name ideas to reject with the reason. Cite path:line for every claim. End the synthesis with proposed implementation phases.
- Started: 2026-10-15T05:43:00.300Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: fanout-swe-2-max-1792042581294-btcd4b
- Parent Session: none
- Lifecycle Mode: detached
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | The /doctor:sk-code setup precedent: router, route manifest, workflow, battery, presentation, adaptation guide | - | 0.90 | 10 | complete |
| 2 | What the 026/028/029 packets decided: command-shape rationale, rejected ideas, phase ordering | - | 0.88 | 9 | complete |
| 3 | sk-git customization surface part 1: commit contract, contract-dir resolution, git-standards, allowlist, worktree naming/provisioning, Commit-Id opt-in | - | 0.92 | 10 | complete |
| 4 | hooks and runtime safety: install, trust gate, per-gate config, preflight advisory, message gate, doctor backend | - | 0.90 | 10 | complete |
| 5 | /doctor:git router contract, ownership boundary, placement decision, rejected designs, battery composition | - | 0.88 | 10 | complete |

- iterationsCompleted: 5
- keyFindings: 49
- openQuestions: 3
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/3
- [ ] Is there a uniform read-only probe for per-runtime adapter registration (Claude PreToolUse, opencode plugin, pi extension)? [operator]
- [ ] Does a repo-local overlay for hard-rules.json exist or is the vendored sidecar the only source? [operator]
- [ ] How should repos without specs/ satisfy trailers.spec mustExist? [operator]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] Is there a uniform read-only probe for per-runtime adapter registration (Claude PreToolUse, opencode plugin, pi extension)?
- [ ] Does a repo-local overlay for hard-rules.json exist or is the vendored sidecar the only source?
- [ ] How should repos without specs/ satisfy trailers.spec mustExist?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▄▃▂▂▁▃▄▆▇█▇▆▅▅▄▃▂▂▁
- score sparkline: ▅▄▃▂▂▁▃▄▆▇█▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.92 -> 0.90 -> 0.88
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.88
- coverageBySources: {"code":42,"other":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None. Every named file in the dispatch topic resolved. (iteration 1)
- Reading the full git-standards/git-hook-gates scripts this iteration — deferred to iteration 4 where they belong topically; `_routes.yaml` already fixed their contract surface. (iteration 1)
- None. (iteration 2)
- Reading `parent-skill-check.cjs`, the guard, or the sync scripts' internals — their contract surfaces (what they check) are already established via the battery's leg commands; internals matter only if sk-git needs an analogous per-leg script, which iteration 4 will settle. (iteration 2)
- None — every file the topic named exists and resolved cleanly. (iteration 3)
- `trustRepoHooks` does not appear under `.opencode/` or as a standalone file — it lives in the identical trust block inside each lifecycle hook and in README/changelog docs. Resolved by reading `pre-commit:28-56` directly. (iteration 4)
- No `hard-rules.json` repo override exists — confirmed by `readHardRules` reading only the sidecar beside `SKILL.md`. Recorded as a limitation, not a defect to fix here. (iteration 5)
- Separate `/doctor:sk-git` or `/doctor:git-setup` commands (R1/R3); flags on the mutating routes (R2); mutating/auto-repair setup (R4); per-tool `--doctor` modes (R5); `--status` alone as the battery (R6). (iteration 5)

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
u1–u3 above; the per-runtime registration probe is the only leg that cannot be made deterministic from git/skill state alone.

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
