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
- Topic: Round two of the external sk-code surface priority research. Round one (research/research.md in this spec folder, findings F1-F33, recommendations R1-R5, rejected ideas X1-X9, phases P1-P4) found that the one order source is sk-code hub-router.json routerPolicy.tieBreak; a user's own surface outranks the native sk-code-skilled if it is inserted ahead of opencode (R1); stack-agnostic tooling must stop naming the obsidian and webflow examples (R2); deleting the examples must become a documented, verified path including the re-mint and authored copy (R3); the two surfaces must be marked as examples (R4); R5 (opencode generic keywords) stays as is by operator ruling. Background: sk-code-obsidian and sk-code-webflow are the operator's personal example surfaces; an external user deletes them and adds their own surface, which must outrank sk-code-skilled. sk-code-review, sk-code-quality and shared/ are stack-agnostic. Round two goes deeper, with path:line or command evidence: (1) F10, ROUTER.md stack-agnostic intents (debugging, performance, deployment, accessibility, implementation) load mostly or only Webflow leaves, so after an external user deletes webflow those intents load almost nothing: what shared/ or opencode leaves could serve them, and a proposed R6; (2) F20, compiled-routing re-mint depends on the authored closure under specs/sk-doc/z_archive/019-skill-routing-refactor/, so a user who prunes specs/ cannot re-mint: cost and blast radius of fixing it versus documenting it, and R7 or a reasoned no; (3) F18, adding a surface by hand fails five doctor legs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary): does /create:skill-parent update --surfaces (.skilled/commands/create/skill-parent.md and its assets) perform those steps, observed in a throwaway full-tree copy; (4) stress-test R1-R4: exact edit text, every file each one touches (including the auto twin of create-skill-parent-confirm.yaml, both README tables, the sk-code README), what can still break, and whether each is the smallest correct fix under .skilled/repo-rules/prevent-overengineering.md; (5) anything round one missed: other hubs or tooling that assume sk-code's examples (benchmarks, playbooks, feature catalogs, advisor batteries and fixtures, Hermes and runtime mirrors, CI workflows under .github/, install guides, /doctor:update release-engine keep-local rules) and the end-to-end external-user flow (clone, delete examples, add own surface, run doctor, route a prompt); (6) challenge the rejected ideas X1-X9 once more and name new rejections. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails. Number new findings from F34, new recommendations from R6 and new rejections from X10 only in the final synthesis; inside iterations use the finding-row format the preamble gives.
- Started: 2026-10-12T18:58:06.247Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q7/F10: existing shared and OpenCode leaf coverage after removing Webflow and Obsidian | - | 0.88 | 4 | complete |
| 2 | Q9, F18 re-verification: update --surfaces doctor-leg coverage and tieBreak priority | - | 0.90 | 5 | complete |
| 3 | Q8: compiled-routing re-mint dependency on the archived authored closure and the smallest safe external-user guidance | - | 0.75 | 4 | complete |
| 4 | Q10 R1 tieBreak insertion rule: identify every writer/document/check and stress-test the ordering in the prepared throwaway copy. | - | 0.50 | 6 | complete |
| 5 | Q10 / R2 stress test of example-dependent drift guards after deleting Webflow and Obsidian | - | 0.75 | 6 | complete |
| 6 | Q10 R3/R4 removal and documentation stress test | - | 0.60 | 5 | timeout |
| 7 | Q11: outside the sk-code hub, inventory external tooling assumptions and the user-facing deletion path | - | 0.71 | 7 | complete |
| 8 | External user's delete-and-adapt path through docs, example removal, re-mint, doctor and routing | - | 0.75 | 6 | timeout |
| 9 | Operator-added surface automation, external-user guide design, and adversarial review of rejected ideas X1-X9 | - | 0.21 | 14 | complete |
| 10 | Adversarial re-verification of F10, F18, F19, F20 and R1-R4 | - | 0.30 | 6 | timeout |

- iterationsCompleted: 10
- keyFindings: 0
- openQuestions: 2
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/6
- [x] Q7: F10, which shared/ or sk-code-skilled leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?
- [x] Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?
- [x] Q9: F18, does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in a throwaway full-tree copy?
- [x] Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected?
- [ ] Q10: R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix? [legacy-import]
- [ ] Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Q10: R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix?
- [ ] Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▆▄▅▆▆▅▅▆▆▆▆▃▁▁▂
- score sparkline: ███▇▇▆▄▅▆▆▅▅▆▆▆▆▃▁▁▂
- Last 3 ratios: 0.75 -> 0.21 -> 0.30
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.30
- coverageBySources: {"code":103,"other":55}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes. (iteration 2)
- Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs. (iteration 2)
- Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest. (iteration 2)
- Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead. (iteration 3)
- A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract. (iteration 4)
- A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position. (iteration 4)
- None. (iteration 4)
- None established. The complete R3 migration remains untested. (iteration 6)
- Treating the current `/create:skill-parent update --surfaces` command as a complete removal path; its command contract has no removal option, and the earlier simulations did not clear all doctor legs. (iteration 6)
- Treating the failed COPY_A harness as a successful deletion or full-checklist test. (iteration 6)
- None established. Deletion-dependent manual and quality paths still need a bounded throwaway-copy check. (iteration 7)
- Treating advisor Obsidian/Webflow marker fixtures as dependencies on installed sk-code packets: the test builds temporary workspaces and asserts the hint value directly. (iteration 7)
- Treating the archived benchmark PASS as a deletion-test result: its own report has zero eligible/scored rows and routes gold to the Webflow example. (iteration 7)

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
Q10 remains partial: exact locations and candidate wording for R1/R4 were checked, but the complete file-by-file R1–R4 diff and residual validation matrix were not re-opened end to end.

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
