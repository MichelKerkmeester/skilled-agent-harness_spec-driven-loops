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
- Topic: Surface setup hardening for external sk-code users. Skilled assumes every sk-code surface except sk-code-opencode (the native surface, lowest priority for an external user) and sk-code-review (workflow) is irrelevant to an external user, that sk-code-obsidian and sk-code-webflow are the operator's personal examples an external user deletes, that shared/ and sk-code-quality stay, and that any surface the user adds outranks sk-code-opencode. The tie order today is quality, review, opencode, obsidian, webflow (.skilled/skills/sk-code/hub-router.json routerPolicy.tieBreak). Already shipped and NOT to be re-recommended: phase 025 research (specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md, F1-F96, R1-R10, X1-X24; its section 14 is the final list); phase 026 built R1 (/create:skill-parent update --surfaces places a new surface ahead of sk-code-opencode), R2 (sk-code drift guards tolerate removed examples), R3 and R7 (doctor, guard and sync messages name the fix; a missing authored closure is a named failure), R8 (scaffold handoff names the canary and re-mint follow-ups), R4 and R9 (examples marked, the root README block "What Adapting `sk-code` Looks Like" is the single external-user guide, release note v4.0.0.5); phase 027 added doctor check 5l in .skilled/commands/doctor/scripts/parent-skill-check.cjs that reports a hand-placed surface after sk-code-opencode in tieBreak unless it is one of the two examples. Operator ruling R5 stands: sk-code-opencode keeps its generic language keywords (report its UX cost only). Answer with path:line or command evidence, classify every finding NEW or ALREADY-COVERED (name the 025 F/R/X id or 026/027), and observe behavior in throwaway copies only: (1) remaining ways the assumption breaks: hand edits to tieBreak, mode-registry.json or hub-router.json, skill-advisor routing (graph metadata, scorer boosts, batteries), compiled routing (manifest, canary fixtures, authored copies), the Hermes copies and the other runtimes' mirrors (.opencode, .claude, .codex, .cursor, .devin, .pi, .hermes), manual-testing playbooks, benchmarks, canaries, feature catalogs, and a fresh clone; (2) the end-to-end external-user journey from clone to a green battery (doctor, guard, sync, drift guards, advisor, one routed prompt), with every friction point; (3) automation that removes manual steps without a judgment call; (4) the operator's two shapes weighed against each other with better names: a new doctor command such as `/doctor sk-code-setup` referenced and integrated in the sk-code hub, versus a new mode inside the sk-code hub such as `sk-code-setup`; for each, where it would be referenced, what it would run, its cost and blast radius, and which existing surfaces (doctor command family under .skilled/commands/doctor/, hub mode-registry, /create:skill-parent) it would overlap; (5) ideas to reject and why. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the failure it prevents today, the smallest change, and the cheaper move that fails.
- Started: 2026-10-13T17:31:25.170Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: dr-028-swe-max-2026-10-13T17:31:25.170Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q2: fresh-clone external-user journey from git clone to green battery, following only the README adapting block | external-user-journey | 0.60 | 9 | complete |
| 2 | Add-surface leg in a provisioned copy: simulate /create:skill-parent update --surfaces output, capture full battery failures, classify scriptable vs AI-only steps, map doctor coverage | surface-setup-hardening | 0.70 | 9 | complete |
| 3 | Q3/Q1 fresh-clone provisioning gap: enumerate provisioning entry points, test a single command on a true clone, classify README remove-leg steps, correct the mode-registry modes-shape claim | provisioning | 0.90 | 6 | complete |
| 4 | Add-surface leg in provisioned copy (advisor + compiled-route probes, hand-edit detection) plus independent Q4 doctor-vs-hub-mode weigh-in from _routes.yaml and mode-registry.json | surface-setup-hardening | 0.75 | 8 | complete |
| 5 | Q5/Q6 consolidation: deduplicated ranked recommendations, rejected ideas, /doctor:sk-code setup naming decision, build phases | consolidation | 0.40 | 11 | insight |

- iterationsCompleted: 5
- keyFindings: 0
- openQuestions: 1
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/6
- [x] Q2: What does an external user do from clone to a green battery, and where is each friction point?
- [x] Q3: Which manual steps can existing automation absorb without a judgment call?
- [x] Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?
- [x] Q5: Which ideas should be rejected, and why?
- [x] Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027?
- [ ] Q1: Where can the assumption still break (hand edits to tieBreak or the registries, skill-advisor routing, compiled routing, Hermes copies, runtime mirrors, playbooks, benchmarks, canaries, feature catalogs, fresh clones)? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Q1: Where can the assumption still break (hand edits to tieBreak or the registries, skill-advisor routing, compiled routing, Hermes copies, runtime mirrors, playbooks, benchmarks, canaries, feature catalogs, fresh clones)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▅▅▅▆▇▇██▇▇▆▆▅▄▃▂▁
- score sparkline: ▄▄▄▅▅▅▆▇▇██▇▇▆▆▅▄▃▂▁
- Last 3 ratios: 0.90 -> 0.75 -> 0.40
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.40
- coverageBySources: {"code":36,"other":25}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None definitively; the add-surface leg (slash command requires an AI runtime) is deferred, not dead. (iteration 1)
- Re-running the provisioned-copy recipe (APFS clone with node_modules): the dispatch's control-run is already green there and it cannot reproduce the external user's clone path — it masks the provisioning gap (same masking 025 V0 had via symlinked node_modules). (iteration 1)
- None new. Iteration 1's BLOCKED directions respected: I used the provisioned copy only for the *add* leg (which needs node_modules for the generators), not to re-test the clone journey. (iteration 2)
- Testing `sync-skills-hermes.cjs` and `test_readme_manifest.py` on the add leg: not run (clock). What would settle it: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` (or its --check equivalent) in `$X` and observe whether a new packet produces a named drift line. (iteration 2)
- `compiled-route-admission.cjs` is not the mint entry point (rejects `--help`, interface undetermined in budget). What would settle it: find the generator of `013-live-activation/activation/*/manifest.json` — likely the admission pipeline under `.skilled/bin/lib/compiled-routing/` — and check whether `update --surfaces` calls it. (iteration 4)
- Hand-editing `leaf-manifest.json`: generator-owned; `10b` byte-drift fires on same entries/different bytes. `generate-leaf-manifest.cjs --write` is the only writer. (iteration 4)
- Probing which single invariant blocks `resolve hubs`: exhausted 3 sync attempts with distinct fixes applied; the blocker is upstream of doctor's invariant set (activation manifest mint), not a missing packet field (frontmatter completed to match `sk-code-obsidian`'s shape and sync still failed). (iteration 4)
- New copy probes this iteration: consolidation focus; the two open Q1 tails need a copy and are deferred, not dead. (iteration 5)
- None new. (iteration 5)
- Re-reading individual 025 F-rows: sections 5-9/13-14 carry the verified rulings; row-level detail unchanged by this pass. (iteration 5)

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
Q1 tail stays open by deferral, not exhaustion: whether `.` and `.skilled` provision roots are individually required (subset never isolated); `sync-skills-hermes.cjs`/`test_readme_manifest.py` add-leg behavior (never observed). Consolidation consumed the budget; both are recorded for the packet's open questions.

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
