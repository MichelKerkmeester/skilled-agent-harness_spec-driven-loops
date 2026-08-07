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
- Topic: Residual documentation and reference-structure gaps across the 5 deep-* skills after the 008 doc-evolution pass (subfoldering, sk-doc conformance, README rewrites, catalog/playbook verify, deep-review SKILL cap fix, thin-ref consolidation, dead-link + validator fixes, cross-subfolder pointer tightening, big-file splits)
- Started: 2026-05-25T14:05:00Z
- Status: COMPLETE
- Iteration: 2 of 10
- Session ID: 116-008-009-dr-2026-05-25
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: all_questions_answered

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | residual-gap sweep | - | 0.00 | 0 | negative |
| undefined | adversarial concrete re-verification | - | 0.00 | 0 | negative |

- iterationsCompleted: 2
- keyFindings: 0
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1 — Are any reference files still mis-sized, mis-placed, orphaned, or duplicated after the subfoldering + splits?
- [x] Q2 — Are there remaining stale or dangling cross-references (skill->skill, agent mirror, command, feature_catalog, manual_testing_playbook) introduced or missed by the 008 moves?
- [x] Q3 — Do the SKILL.md smart routers + READMEs fully and accurately reflect the new subfolder structure (resource maps, intent lists, structure trees)?
- [x] Q4 — Are the feature_catalog + manual_testing_playbook snippets template-conformant with current reference paths?
- [x] Q5 — Does any other deep-* infrastructure (command YAMLs/MDs, agent mirrors, tests, configs) still carry stale paths from the 003 isolation or the 008 moves, beyond the already-fixed deep-research loop driver?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.00 -> 0.00
- Stuck count: 2
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.00
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Mis-sized/mis-placed/orphaned/duplicated reference files — all 5 skills' references/ structures verified clean (iteration 1)
- Other stale infra paths from 003 isolation or 008 moves — resource-map.yaml phase_002b_completion records 0 residual stale refs (iteration 1)
- SKILL.md router + README structure tree mismatches — all routers align with on-disk subfolders (iteration 1)
- Stale or dangling cross-references in SKILL.md RESOURCE_MAP entries — all paths resolve correctly (iteration 1)
- Stale paths in feature_catalog snippets — spot-checked samples use current subfoldered paths (iteration 1)
- Stale paths in manual_testing_playbook snippets — spot-checked samples use current subfoldered paths (iteration 1)
- Dangling references/ links — 0 dangling across 300+ links checked in 5 skills (grep + ls verification) (iteration 2)
- deep-loop-runtime subfoldering need — confirmed flat-by-design with 4 files and 4 consumers (find + grep verification) (iteration 2)
- Orphaned reference files — 0 orphans across 5 skills (every on-disk file has inbound links) (iteration 2)
- README structure tree mismatches — all 4 subfoldered skills match on-disk find results exactly (deep-research 13/13, deep-review 10/10, deep-ai-council 15/15, deep-agent-improvement 15/15) (iteration 2)
- Stale flat paths in agent mirrors — 0 stale flat references/ patterns in .claude/, .gemini/, .codex/ (grep verification) (iteration 2)
- Stale flat paths in command surfaces — 0 stale flat references/ patterns in .opencode/commands/deep/ (grep verification) (iteration 2)

<!-- /ANCHOR:dead-ends -->
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
