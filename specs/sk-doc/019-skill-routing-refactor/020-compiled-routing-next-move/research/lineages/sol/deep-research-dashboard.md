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
- Topic: DECISION RESEARCH: Decide the best next move for the compiled-routing subsystem from the supplied verified state.
- Started: 2026-07-27T03:27:31Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-sol-1785122678068-tumo3g
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
| 1 | Q1 activation-manifest ownership model | architecture | 1.00 | 6 | complete |
| 2 | Q2 authored/runtime closure-resolution mechanism | debug | 1.00 | 6 | complete |
| 3 | Q3 freshness guard enforcement and exception semantics | safety | 1.00 | 6 | complete |
| 4 | Q4 staging and rollback retention | safety | 1.00 | 6 | complete |
| 5 | Q5 minimum sequenced work and dependency split | synthesis | 0.85 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 36
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1. Which activation-manifest ownership model should be the long-term contract, and what breaks under authored-only, runtime-authoritative, or a better third model?
- [x] Q2. What exact mechanism makes authored closure tracing fail for `cli-external-orchestration` and `sk-design` while byte-identical runtime manifests resolve?
- [x] Q3. Where should compiled-route freshness block—pre-commit, pre-push, CI, or session hook—and how should legitimately uncompilable in-progress hubs escape?
- [x] Q4. Should staging and rollback remain for a single-operator git-backed build tool, given the former live-runtime `rmSync` hazard?
- [x] Q5. What is the minimum sequenced work for reproducibility, self-reporting, and unattended safety, split into work safe now versus work that must wait for `sk-design`?

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
- Last 3 ratios: 1.00 -> 1.00 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":109,"other":43}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Continuing the current advisory-only drift report: ruled out for Q1 because it detects the failure but still permits source/runtime divergence to persist. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21] (iteration 1)
- Pure authored-only ownership with no runtime mirror: ruled out because the serving resolver reads the promoted activation root, not the authored spec tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24] (iteration 1)
- Pure runtime-authoritative ownership: ruled out for long-term use because it makes rebuilds non-reproducible unless a separate source sync is added. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17] (iteration 1)
- Do not spend the next iteration trying to prove current runtime success for `cli-external-orchestration` and `sk-design`; current evidence contradicts it. The smallest useful follow-up is to decide how guard enforcement should treat "known uncompilable because live inputs are mid-restructure" versus "unintended stale compiled closure." (iteration 2)
- Pure activation-manifest byte comparison was ruled out as a sufficient explanation. `cli-external-orchestration` manifests are byte-identical, yet both authored and promoted resolver paths currently return `null`; the failing operation is snapshot compilation from live skill inputs. [SOURCE: command: focused manifest `shasum -a 256`] [SOURCE: command: snapshot loader comparison] (iteration 2)
- Runtime success in the current checkout was ruled out by `--verify` and direct `resolveRoute` reproduction. [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison] (iteration 2)
- Authoritative pre-commit blocking: ruled out because local hooks are opt-in or bypassable and current worktree hook anchoring is not a reliable shared enforcement boundary. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294] (iteration 3)
- Authoritative pre-push blocking: ruled out because the current pre-push hook enforces remote branch safety, not content correctness, and already has scoped bypasses. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:132] (iteration 3)
- Session hook as a blocker: ruled out because current SessionStart guards are explicitly non-fatal visibility surfaces. [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18] (iteration 3)
- Keeping every nested rename recovery branch at current size without pruning: not ruled out as unsafe, but not recommended as the minimum next move. The tests demonstrate behavior, yet the prompt baseline says roughly 100 lines of test-injection-only nested rename recovery remain oversized. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863] [INFERENCE: based on current failure-injection-only entry points plus the supplied verified baseline] (iteration 4)
- Removing staging and copying directly into the serving root: ruled out because the old `rmSync(RUNTIME_ROOT)`-then-copy pattern is the exact live-runtime deletion hazard Q4 asks to consider. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`] (iteration 4)
- Treating git as the rollback mechanism for post-publish gates: ruled out because current rollback binding uses runtime fingerprints and active publication state, while git has no knowledge of a local publication's displaced sibling or runtime-only external activation manifests. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564] (iteration 4)
- Blocking primarily in pre-commit, pre-push, or session hooks: Q3 evidence already ruled those out as authoritative boundaries; CI is the unattended merge-safety point. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:10] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:13] (iteration 5)
- Re-arguing Q1-Q4: the iteration prompt explicitly marks those focuses evidence-complete and asks Q5 to use them as constraints. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:9] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:21] (iteration 5)
- Removing staging/rollback before closure tests can run: Q4 evidence makes the former live-runtime deletion hazard and retained rollback binding load-bearing safety concerns. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:10] (iteration 5)

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
