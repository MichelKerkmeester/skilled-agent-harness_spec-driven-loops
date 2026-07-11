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
- Topic: Audit every .opencode/commands/** command.md, workflow/route YAML, presentation .txt and compiled contract; the whole /doctor subsystem; and all 12 agents across .claude/agents + .opencode/agents — for logic alignment with current skill reality. Emit ranked P0/P1/P2 findings, each with file:line + concrete fix, partitioned by surface (commands / doctor / agents / cross-surface). READMEs are phase 005, out of scope here.
- Started: 2026-07-10T19:47:41.899Z
- Status: INITIALIZED
- Iteration: 15 of 15
- Session ID: research-132-001-1783712861900
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Broad command.md dispatch, mode, asset, and allowed-tool reference sweep | - | 0.90 | 0 | complete |
| undefined | Doctor route-to-YAML-to-script tri-existence and read-only target execution | - | 0.78 | 0 | complete |
| undefined | Are all 12 Claude/OpenCode agent mirrors body-synced and correctly localized? | - | 0.82 | 0 | complete |
| undefined | Do all command workflow YAMLs and presentations outside /doctor match command Markdown and compiled contracts field by field? | - | 0.76 | 0 | complete |
| undefined | Which command-to-skill and command-to-agent references remain dead after excluding the already confirmed design transport routes? | - | 0.58 | 0 | complete |
| undefined | Batch 2 (deeper): compiled deep contracts vs source, mutation_boundaries + gate completeness, presentation .txt completeness, argv/flag-isolation, advisor trigger_phrase collisions, prompt-injection hygiene | - | 0.74 | 0 | complete |
| undefined | Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired speckit.md agent lookup? | - | 0.68 | 0 | complete |
| undefined | Should doctor _routes.yaml trigger_phrases be actively wired into the advisor signal map, or is the presentation-menu-driven dispatch intentionally exempt from Gate-2 lexical routing (and the header comment simply wrong)? | - | 0.35 | 0 | complete |
| undefined | Full mechanical sweep of every agent_file/agent_availability block across all 62 workflow YAMLs beyond /create, /deep, and /speckit families | - | 0.55 | 0 | complete |
| undefined | Final synthesis: consolidate all 9 prior iterations into ranked P0/P1/P2 findings partitioned by surface (commands/doctor/agents/cross-surface); confirm create-agent speckit.md fix direction; resolve mutation_boundaries inventory question | - | 0.15 | 0 | complete |
| undefined | P0 re-verification (confirm/downgrade), execute all 9 read-only doctor targets + route-validate.sh, surface systemic patterns, resolve skill-graph reindex question | - | 0.65 | 0 | calibration+deepen |
| undefined | Which frontmatter schema does the installed Claude runtime enforce? RESOLVED: Claude=tools: string, OpenCode=permission: object; create-agent emits only permission: for both (wrong for Claude); .claude/agents/deep-improvement.md uses wrong schema (permission: instead of tools:) | - | 0.65 | 0 | insight |
| undefined | Should mutation_boundaries become a cross-family workflow-YAML convention? RESOLVED: No. Correctly doctor-specific. Schema models filesystem-path-target validation unique to doctor operating model. Other families use different safety models (behavioral/dynamic/git-delegated). Cross-family promotion = over-abstraction. Real priority is within-doctor standardization (fable-mode still missing block). | - | 0.55 | 0 | insight |
| undefined | Should create-agent call the system-spec-kit command workflow directly? (carried since iteration 5 — answered in principle at iteration 7/10, implementation not yet applied) | - | 0.38 | 0 | insight |
| undefined | Final synthesis: consolidate all 14 iterations into definitive P0/P1/P2 ranking, re-verify all P0s on disk, close/defer all carried-forward questions | - | 0.15 | 0 | complete |

- iterationsCompleted: 15
- keyFindings: 71
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Do all command.md dispatch paths, mode suffixes, and asset links resolve to real skills/modes/files under the current hub structure? [legacy-import]
- [ ] Are command workflow/route YAML + presentation .txt internally consistent with their command.md (modes, flags, allowed-tools, registered MCP namespaces)? [legacy-import]
- [ ] Does the /doctor subsystem (router speckit.md, _routes.yaml, per-target YAML, scripts) have full route<->yaml<->script tri-existence + honest mutation-class, and do the read-only targets run clean? [legacy-import]
- [ ] Are the 12 agents cross-runtime body-synced (.claude vs .opencode), with coherent tool grants, correct path self-refs, and current skill/model refs? [legacy-import]
- [ ] What cross-surface drift exists (command<->skill<->agent<->advisor: dead refs, stale enumerations, renamed-skill fallout) beyond the 9 recon seed defects? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Do all command.md dispatch paths, mode suffixes, and asset links resolve to real skills/modes/files under the current hub structure?
- [ ] Are command workflow/route YAML + presentation .txt internally consistent with their command.md (modes, flags, allowed-tools, registered MCP namespaces)?
- [ ] Does the /doctor subsystem (router speckit.md, _routes.yaml, per-target YAML, scripts) have full route<->yaml<->script tri-existence + honest mutation-class, and do the read-only targets run clean?
- [ ] Are the 12 agents cross-runtime body-synced (.claude vs .opencode), with coherent tool grants, correct path self-refs, and current skill/model refs?
- [ ] What cross-surface drift exists (command<->skill<->agent<->advisor: dead refs, stale enumerations, renamed-skill fallout) beyond the 9 recon seed defects?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▇▇▆▆▆▆▄▄▄▂▄▆▆▅▄▃▁
- score sparkline: █▇▇▇▇▆▆▆▆▄▄▄▂▄▆▆▅▄▃▁
- Last 3 ratios: 0.55 -> 0.38 -> 0.15
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.15
- coverageBySources: {"code":5,"other":21}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter 10; adoption decision deferred — iter 13 resolved: No, correctly doctor-specific)

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
