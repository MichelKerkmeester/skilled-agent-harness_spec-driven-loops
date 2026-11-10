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
- Topic: Walking a fresh clone of this framework from install to the first routed request and the first spec packet, as an external repo user: what are all the stumbles, ranked by user impact? For each known stumble (advisor runtime Node 20.19 vs spec-kit CLI Node 22.12 floor mismatch; sk-vision tests failing until vision-runtime/dist is built; the compiled-routing rebuild depending on an authored source under specs/sk-doc/z_archive referenced by .skilled/bin/lib/compiled-route-layout.cjs; worktree provisioning; hook trust via skilled.trustRepoHooks) is it real today and what does it cost the user? What is the smallest set of fixes, ranked by user impact, each passed through .skilled/repo-rules/prevent-overengineering.md?
- Started: 2026-10-11T16:22:38.567Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-002-fresh-clone-2026-10-11T16-22-38-567Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 documented install path for an external user (README, PUBLIC-RELEASE.md, CONTRIBUTING.md, install guides) through the first routed request and first spec packet | onboarding | 0.85 | 10 | complete |
| 2 | Q2 -- complete the Node-floor matrix and test it: read .skilled/skills/system-spec-kit/runtime/cli/package.json and the launcher entry .skilled/bin/skill-advisor.cjs (does it self-install/build on first run, per README.md:162?), then reproduce in the clone with Node 18 / 20.19 / 22.12 (PATH=$HOME/.nvm/versions/node/<v>/bin:$PATH) recording the first failing command. This tests findings 2, 4 and 5. | node-runtime-floor | 0.79 | 7 | complete |
| 3 | Q3, Q4, Q5: sk-vision dist gap, compiled-routing z_archive dependence, worktree provisioning, hook trust (skilled.trustRepoHooks) | - | 0.89 | 7 | complete |
| 4 | Q5 closure: further walk stumbles (first routed request behavior, per-runtime wiring, dangling tracked symlinks, credential surfaces) and the finalized ranked fix set passed through prevent-overengineering.md | - | 0.77 | 6 | complete |
| 5 | Broadened coverage: non-OpenCode first-session surfaces (hook self-heal mechanism, dist-adapter drift, shipped settings defaults) and fix-anchor re-verification | per-runtime-wiring | 0.80 | 5 | complete |
| 6 | Dist-based session-start remedy chain: what clears the mk-hook-drift notices, which runtimes name a working remedy, and what the documented install leaves unbuilt | fresh-clone-onboarding | 0.88 | 4 | complete |
| 7 | Agent mirror-model hermeticity on a fresh clone: does the committed mirror state pass the sync gates, and can those gates run on the documented setup path? | - | 0.88 | 4 | complete |
| 8 | Codex drift-notice fix decision: source of truth, misdirection, and the smallest alignment move | fresh-clone-onboarding | 0.75 | 4 | complete |
| 9 | Consolidated ranked fix set: fold F1-F6, F7, F7b, iteration 7 finding-4 candidates and the First-Use gap into one ranked set, each passed through prevent-overengineering | - | 0.50 | 5 | insight |
| 10 | Close the two carried candidates: pi defaultProjectTrust scope (falsified as global-only) and the pi silent fail-open notice decision; freeze the final ranked fix set with F10 added | onboarding-security | 0.60 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 71
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1 What is the documented install path for an external user (README, PUBLIC-RELEASE.md, CONTRIBUTING.md, install guides), and what does each step require up to the first routed request and the first spec packet?
- [x] Q2 Is the Node floor mismatch real today: which engines/version floors do the advisor runtime and the spec-kit CLI declare, and what happens on a single Node version a newcomer is likely to have?
- [x] Q3 Are the sk-vision vision-runtime/dist build gap and the compiled-routing rebuild dependence on specs/sk-doc/z_archive (.skilled/bin/lib/compiled-route-layout.cjs) real today, and when does a newcomer hit them?
- [x] Q4 Are worktree provisioning and hook trust (skilled.trustRepoHooks) real stumbles on the first-packet path, and what does each cost the user (blocked, confused, or silent degradation)?
- [x] Q5 What further stumbles appear on the walk (unclear errors, missing prerequisites, tracked clutter, absent credentials, per-runtime setup), and what is the smallest ranked fix set, each passed through .skilled/repo-rules/prevent-overengineering.md?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇▆▇█▇▆▆▆▇▇██▇▆▅▃▁▂▃
- score sparkline: ▇▇▆▇█▇▆▆▆▇▇██▇▆▅▃▁▂▃
- Last 3 ratios: 0.75 -> 0.50 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":107,"json.schemastore.org":1,"other":87}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `docs/` tree: no `docs/` directory exists in worktree or clone; internal docs are the root markdown files plus the skill-local READMEs listed in README section 16. [SOURCE: README.md:1576-1592] [INFERENCE: find docs probe returned nothing, this iteration] (iteration 1)
- PUBLIC-RELEASE.md as the external-user install path: it documents the maintainer release workflow and the symlink consumer model, both requiring ownership of a shared framework checkout. [SOURCE: PUBLIC-RELEASE.md:74-235] (iteration 1)
- Root-level single install (`npm install` at the repository root): no root `package.json` exists; install is per-workspace across 15 manifests outside `specs/` (probe). [INFERENCE: find probe listing package.json files, this iteration] (iteration 1)
- Node 18 runtime reproduction on this machine: no Node 18 interpreter in nvm (versions v20.19.5+ only); used the lowest available floor 20.19.5 instead. The CONTRIBUTING 18+ claim stays contradicted statically by the >=20.11 floors [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] and is not runtime-proven either way. (iteration 2)
- None new this iteration. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE and root-install directions stayed untouched. (iteration 2)
- "sk-vision tests fail until `vision-runtime/dist` is built": falsified at file level. Tests import `src` and spawn `python/runtime.py`; no test consumes `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22]. The dist consumer is the plugin/CLI delivery surface, not the test suite. (iteration 3)
- "The compiled-routing rebuild breaks a fresh clone because the authored source under `specs/sk-doc/z_archive` is absent": falsified. The path is tracked (6996 files) and present in the clone; sync, guard and the pre-commit gate all resolve it there. (iteration 3)
- None new. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE, root-install and Node-18 directions stayed untouched. (iteration 3)
- Runtime `bun test` roast of sk-vision was planned and not executed (tool-call budget and the clone's missing node_modules for that workspace); carried to next iteration rather than inferred away. (iteration 3)
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, and the `z_archive`-absence claim all stayed untouched. (iteration 4)
- None new. Nothing found this iteration suggests a productive path for the falsified hypotheses. (iteration 4)
- The `bun test` Python-spawning roast was not run and is superseded: its motivating hypothesis (tests fail until `dist` is built) is falsified, and the delivery-surface question it was meant to close is answered by the observed build probe (finding 5). (iteration 4)
- Executing the `check-git-hooks.sh` self-heal end-to-end inside the clone: running it invokes the installer whose effects beyond the clone's `.git/hooks` were not verified from the 1-55 read, so the mechanism and its trigger conditions were established from the script text instead of mutating machine state. (iteration 5)
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched. (iteration 5)
- None new. (iteration 5)
- Re-running the spec-kit runtime workspace build end-to-end in the clone to re-prove the devin-named remedy command: the clone is not pristine (prior iterations installed its node_modules and produced its dist), so a re-run would not establish the claim that matters — that the documented step 2 is sufficient. The build script, the present `dist/hooks` tree and the two executed adapters already ground the remedy chain; the step-2 sufficiency statement stays an explicit inference. (iteration 6)
- Executing the checker against a tree without the built parser (the decisive crash reproduction): it would require deleting the built file inside the clone, and deletions are banned in this run; the arc is grounded by the tracked-file count, the load-time require structure, and Node module semantics, with the last hop marked inference. (iteration 7)
- None new. The mirror-content direction is *not* a dead end but is now fully mapped: no content drift exists at HEAD, so no content fix is owed there. (iteration 7)
- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched. (iteration 7)
- Spawning a second pristine sandbox clone: the sanctioned fixture plus `git ls-files` tracking evidence answers the pristine-state question without a new probe zone. (iteration 7)
- Editing the generated `.codex/hooks.json` directly to change the notice: pre-commit and CI run `sync-hook-registrations.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161], so an un-regenerated edit reports drift; the registry is the edit point. (iteration 8)
- Executing `install-codex-hooks.mjs --check` in the clone to observe user-global behavior: the user-global `~/.codex/hooks.json` sits outside the clone sandbox; the tool's contract is documented and `--check` is non-mutating by design [SOURCE: .skilled/bin/README.md:168], so its semantics were read, not executed. (iteration 8)
- None new. The registry-sourced generation pipeline is the live mechanism at HEAD, confirmed by both gates and by the clone probe; the direction is resolved rather than dead, and no content fix remains owed beyond the one string. (iteration 8)
- Per-binding `message` overrides for the dist-only codex adapters: the mechanism exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and is used five times [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728], but all four runtimes use runtime-level defaults; adding per-adapter strings adds binding bookkeeping the requirement does not earn. (iteration 8)
- Rewording the claude/cursor defaults in the same pass: both name a correct rebuild direction [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]; no observed misdirection; keeps the pass off the "while we're here" path. (iteration 8)
- Adding F6 to the implementation bundle: the "while we're here" restraint signal; no observed failure names it. (iteration 9)
- None new. The consolidated set resolves the carried fix-set recommendation; the remaining work is implementation-time anchor re-verification, not research. (iteration 9)
- Re-probing the anchors beyond the fresh read: the read is the verification; a second pass is owed only at implementation start per iteration 8's (b). (iteration 9)
- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the z_archive-absence claim, the bun-test roasts, the check-git-hooks execution and the build re-run all stayed untouched. (iteration 9)
- Writing `research/research.md` despite `progressiveSynthesis: true`: outside this dispatch's allowed write paths; progressive synthesis stays workflow-owned. (iteration 9)
- **A fresh-HOME pi launch to observe the trust prompt end-to-end.** The trust decision is interactive, and a one-shot probe cannot bind it; pi's normative scope rule, the trust-resolution order and the dist read path settle the file-level question with primary sources (Finding 1). (iteration 10)
- **A live Claude Code session to observe project-settings startup precedence.** No safe non-interactive probe exists; the fetched schema documents the shipped values' semantics, and the residual uncertainty is recorded in Finding 2 instead of being smoothed over. (iteration 10)
- **Reproducing the Pi silence by removing `runtime/dist`.** Deletion is banned, and the probe clone's dist was produced by earlier iterations; the file-level chain plus the 0-tracked `git ls-files` count stand as the evidence. (iteration 10)
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the generated `.codex/hooks.json` edit path and the F6-bundling direction all stayed untouched. (iteration 10)

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
