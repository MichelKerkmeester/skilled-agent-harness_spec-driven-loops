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
- Topic: Surface setup hardening for external sk-code users. Skilled assumes every sk-code surface except sk-code-skilled (the native surface, lowest priority for an external user) and sk-code-review (workflow) is irrelevant to an external user, that sk-code-obsidian and sk-code-webflow are the operator's personal examples an external user deletes, that shared/ and sk-code-quality stay, and that any surface the user adds outranks sk-code-skilled. The tie order today is quality, review, opencode, obsidian, webflow (.skilled/skills/sk-code/hub-router.json routerPolicy.tieBreak). Already shipped and NOT to be re-recommended: phase 025 research (specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md, F1-F96, R1-R10, X1-X24; its section 14 is the final list); phase 026 built R1 (/create:skill-parent update --surfaces places a new surface ahead of sk-code-skilled), R2 (sk-code drift guards tolerate removed examples), R3 and R7 (doctor, guard and sync messages name the fix; a missing authored closure is a named failure), R8 (scaffold handoff names the canary and re-mint follow-ups), R4 and R9 (examples marked, the root README block "What Adapting `sk-code` Looks Like" is the single external-user guide, release note v4.0.0.5); phase 027 added doctor check 5l in .skilled/commands/doctor/scripts/parent-skill-check.cjs that reports a hand-placed surface after sk-code-skilled in tieBreak unless it is one of the two examples. Operator ruling R5 stands: sk-code-skilled keeps its generic language keywords (report its UX cost only). Answer with path:line or command evidence, classify every finding NEW or ALREADY-COVERED (name the 025 F/R/X id or 026/027), and observe behavior in throwaway copies only: (1) remaining ways the assumption breaks: hand edits to tieBreak, mode-registry.json or hub-router.json, skill-advisor routing (graph metadata, scorer boosts, batteries), compiled routing (manifest, canary fixtures, authored copies), the Hermes copies and the other runtimes' mirrors (.opencode, .claude, .codex, .cursor, .devin, .pi, .hermes), manual-testing playbooks, benchmarks, canaries, feature catalogs, and a fresh clone; (2) the end-to-end external-user journey from clone to a green battery (doctor, guard, sync, drift guards, advisor, one routed prompt), with every friction point; (3) automation that removes manual steps without a judgment call; (4) the operator's two shapes weighed against each other with better names: a new doctor command such as `/doctor sk-code-setup` referenced and integrated in the sk-code hub, versus a new mode inside the sk-code hub such as `sk-code-setup`; for each, where it would be referenced, what it would run, its cost and blast radius, and which existing surfaces (doctor command family under .skilled/commands/doctor/, hub mode-registry, /create:skill-parent) it would overlap; (5) ideas to reject and why. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the failure it prevents today, the smallest change, and the cheaper move that fails.
- Started: 2026-10-13T17:31:23.657Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: dr-028-deepseek-max-2026-10-13T17:31:23.657Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: Where can the assumption still break - skill advisor (graph-metadata, scorer boosts), compiled routing (canary fixtures, authored copies) and runtime mirrors including the Hermes copies | surface-hardening | 0.33 | 9 | complete |
| 2 | Q1 remainder in a provisioned copy: Hermes sync prune/flag behavior, mirror checks, playbooks, benchmarks, feature catalogs, bare-delete gate failures, and the hand-placed stand-in probe for doctor 5l | - | 0.87 | 11 | complete |
| 3 | Q4 — the two shapes weighed: new doctor command vs new sk-code hub mode | - | 0.72 | 9 | complete |
| 4 | Q3 + the doctor shape in detail: the six-command README battery timed in a provisioned copy, pristine and after a stand-in surface add; failure translations; read-only vs mutating repairs; /doctor:sk-code vs /doctor:skill-advisor surface-setup | - | 0.90 | 0 | complete |
| 5 | Settle the contested swe-max i4 P0 claim (README refresh-and-copy mint path) in a provisioned copy, then Q5 rejects | - | 0.79 | 8 | complete |

- iterationsCompleted: 5
- keyFindings: 0
- openQuestions: 2
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/6
- [x] Q3: Which manual steps can existing automation absorb without a judgment call?
- [x] Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?
- [x] Q5: Which ideas should be rejected, and why?
- [x] Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027?
- [ ] Q1: Where can the assumption still break (hand edits to tieBreak or the registries, skill-advisor routing, compiled routing, Hermes copies, runtime mirrors, playbooks, benchmarks, canaries, feature catalogs, fresh clones)? [legacy-import]
- [ ] Q2: What does an external user do from clone to a green battery, and where is each friction point? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Q1: Where can the assumption still break (hand edits to tieBreak or the registries, skill-advisor routing, compiled routing, Hermes copies, runtime mirrors, playbooks, benchmarks, canaries, feature catalogs, fresh clones)?
- [ ] Q2: What does an external user do from clone to a green battery, and where is each friction point?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▂▄▅▇█▇▇▆▆▆▆▇▇███▇▇▇
- score sparkline: ▁▂▄▅▇█▇▇▆▆▆▆▇▇███▇▇▇
- Last 3 ratios: 0.72 -> 0.90 -> 0.79
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.79
- coverageBySources: {"code":40,"other":30}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None definitive this iteration; the deferred copy probe (below) is the candidate for a later iteration, not a dead end. (iteration 1)
- Row-by-row reading of all 025 F-rows: budget; used sections 7, 8, 14 and targeted F-row greps instead. (iteration 1)
- Whole-repo name grep as the classification instrument: 849/925 matching files, dominated by spec archives; narrowed to `.skilled/` and the runtime mirrors. (iteration 1)
- None definitive. The bare-delete wall is a finding, not a dead end; the copy probes are reproducible (copy `deepseek-max-i2-wGIE`, or re-run the recipes above). (iteration 2)
- Running the Hermes sync from a shell whose `$X` variable did not persist: an intermediate invocation fell back to the default cwd (the original worktree) and reported `Wrote 0 of 68 ... pruned 0`. Verified harmless — `git status --porcelain -- .hermes` is empty and the original `.hermes/skills` still holds both example copies — and the probe was re-run with a hardcoded copy path. All later commands used the hardcoded path. (iteration 2)
- Copy probes for Q4: unnecessary — the doctor family's registration, validation and mirroring contracts are all committed files, and every claim above is a path:line read. The recipes remain for the Q2 fresh-clone journey. (iteration 3)
- None definitive. (iteration 3)
- None definitive. The stand-in's `check paths` noise is a probe artifact and not a candidate for "Exhausted Approaches". (iteration 4)
- Re-running the 5l failing direction (surface placed after OpenCode): the message text is a committed-file read ([SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]) and 027 already shipped the check; budget spent on the un-run directions instead. (iteration 4)
- Reproducing the `check paths` dead-reference lines as a product finding: they came from my rename shortcut (content rewritten, filenames not), so they are probe noise, not a product defect. The decisive stand-in guard failures are `check surfaces` and doc-claims. (iteration 4)
- None definitive. The commit-path repair question is a named remaining uncertainty, not a dead end. (iteration 5)
- Re-running the swe-max failure sequence with their exact edit order to force `MOVE-SIMULATION`: budget; the README path's end-to-end green (sync, guard, route) is the decisive answer, and the non-reproduction is recorded as a BREAK row. (iteration 5)

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
Q2: the clone-to-battery journey — battery timing and friction captured (iterations 3-4), fresh-clone probe still not done.

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
