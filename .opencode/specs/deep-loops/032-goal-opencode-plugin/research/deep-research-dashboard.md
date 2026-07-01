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
- Topic: Investigate whether related skill documentation (SKILL.md files, references/, assets/) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the /goal OpenCode plugin, following the phases 010-014 remediation completed in this session plus the goal_opencode.md filename correction.

Context: .opencode/plugins/mk-goal.js gained new functions (recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates), new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS), a new store_health status field, a mutation field on /goal set output, hardened sanitizer/redaction, and the command file is now finally named .opencode/commands/goal_opencode.md (NOT goal.md -- confirm this is still the live name at execution time).

Already-updated docs this session (do not re-flag, but DO verify they are still accurate): .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md, .opencode/skills/system-spec-kit/SKILL.md, .opencode/skills/system-spec-kit/references/config/hook_system.md, .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md + feature_catalog/18--ux-hooks/goal-opencode-plugin.md, .opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md, .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md + manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md, .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md.

Find what's still missed: (1) other skills' own SKILL.md/references/assets that mention mk-goal.js, /goal, mk_goal, or the goal plugin even in passing (e.g. cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows) and whether their mentions are still accurate; (2) any repo-level or skill-level README.md files (root README, .opencode/plugins/README.md if one exists, per-skill README.md files) that describe the goal plugin/command and might be stale on the new env vars, status fields, or command filename; (3) ENV_REFERENCE.md's completeness for the 3 new env vars; (4) any doc that still says 'usage_limited is unimplemented/dead' now that phase 013 wired it, or 'goal-state never gets cleaned up' now that phase 014 added archive/sweep.

ANTI-CONVERGENCE: target exactly 10 iterations; do not converge early unless every related-skill/README avenue is genuinely exhausted. Under convergence pressure before iteration 10, rotate to an unexamined skill directory or doc class (SKILL.md vs references/ vs assets/ vs README.md vs ENV_REFERENCE.md vs feature_catalog vs manual_testing_playbook vs constitutional) instead of stopping.
- Started: 2026-07-01T14:36:44Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-goal-docs-audit-032-20260701-143644
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status | Log Offset | Log Size | Log Path |
|---|-------|-------|-------|----------|--------|------------|----------|----------|
| undefined | Confirm live goal_opencode.md command filename and build the first repo/docs candidate list for stale /goal plugin references. | - | 0.68 | 0 | insight | 4938 | 1991 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Confirm live goal_opencode.md command filename and locate current references to old/wrong goal.md name. | - | 0.57 | 0 | insight | 7118 | 2471 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Confirm live goal_opencode.md command filename and locate current references to old/wrong goal.md name. | - | 0.46 | 0 | insight | 9778 | 2496 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? | - | 0.54 | 0 | insight | 12463 | 3511 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? | - | 0.61 | 0 | insight | 16163 | 4058 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? | - | 0.52 | 0 | insight | 20410 | 2869 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Do other skills' own SKILL.md, references, and assets mention mk-goal.js, /goal, or mk_goal, and are those mentions still accurate post-remediation? | - | 0.58 | 0 | insight | 23468 | 3246 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Should .opencode/plugins/README.md remain only an entrypoint inventory, or should it be expanded because the root README points to it as the plugin contract? | - | 0.49 | 0 | insight | 26903 | 3705 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Should .opencode/plugins/README.md remain only an entrypoint inventory, or should it be expanded because the root README points to it as the plugin contract? | - | 0.37 | 0 | insight | 30797 | 3482 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |
| undefined | Sweep feature_catalog, manual_testing_playbook, and constitutional docs for remaining /goal plugin documentation staleness. | - | 0.34 | 0 | insight | 34469 | 2410 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-state.jsonl |

- iterationsCompleted: 10
- keyFindings: 0
- openQuestions: 8
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/8
- [ ] Is `.opencode/commands/goal_opencode.md` still the live command filename (not `goal.md`), and does anything reference the old/wrong name? [legacy-import]
- [ ] Do other skills' own SKILL.md/references/assets (cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows, etc.) mention mk-goal.js/`/goal`/mk_goal, and are those mentions still accurate post-remediation? [legacy-import]
- [ ] Do any repo-level or skill-level README.md files describe the goal plugin/command, and are they stale on new env vars, `store_health` status field, `mutation` field, or command filename? [legacy-import]
- [ ] Is ENV_REFERENCE.md complete for the 3 new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS)? [legacy-import]
- [ ] Does any doc still claim `usage_limited` is unimplemented/dead now that phase 013 wired `recordProviderUsageLimit`? [legacy-import]
- [ ] Does any doc still claim goal-state never gets cleaned up now that phase 014 added `archiveGoalStateFile`/`pruneArchive`/`sweepOrphanedActiveStates`? [legacy-import]
- [ ] Are the already-updated docs (goal_plugin.md, system-spec-kit SKILL.md, hook_system.md, feature_catalog entries, manual_testing_playbook entries, goal-prompting-runtime-specific.md) still internally accurate after cross-checking against the current mk-goal.js source? [legacy-import]
- [ ] Are there any stale references to old function names, old status fields, or old behaviors anywhere else in the repo (grep sweep for mk-goal.js, mk_goal, goal_opencode, recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates)? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 8
- [ ] Is `.opencode/commands/goal_opencode.md` still the live command filename (not `goal.md`), and does anything reference the old/wrong name?
- [ ] Do other skills' own SKILL.md/references/assets (cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows, etc.) mention mk-goal.js/`/goal`/mk_goal, and are those mentions still accurate post-remediation?
- [ ] Do any repo-level or skill-level README.md files describe the goal plugin/command, and are they stale on new env vars, `store_health` status field, `mutation` field, or command filename?
- [ ] Is ENV_REFERENCE.md complete for the 3 new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS)?
- [ ] Does any doc still claim `usage_limited` is unimplemented/dead now that phase 013 wired `recordProviderUsageLimit`?
- [ ] Does any doc still claim goal-state never gets cleaned up now that phase 014 added `archiveGoalStateFile`/`pruneArchive`/`sweepOrphanedActiveStates`?
- [ ] Are the already-updated docs (goal_plugin.md, system-spec-kit SKILL.md, hook_system.md, feature_catalog entries, manual_testing_playbook entries, goal-prompting-runtime-specific.md) still internally accurate after cross-checking against the current mk-goal.js source?
- [ ] Are there any stale references to old function names, old status fields, or old behaviors anywhere else in the repo (grep sweep for mk-goal.js, mk_goal, goal_opencode, recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▄▅▆▆▆▅▅▆▆▅▄▃▂▁▁
- score sparkline: █▇▆▅▄▄▅▆▆▆▅▅▆▆▅▄▃▂▁▁
- Last 3 ratios: 0.49 -> 0.37 -> 0.34
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.34
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Should old-name and old-behavior references inside archive/phase materials be fixed in place, annotated as historical, or left untouched?

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
