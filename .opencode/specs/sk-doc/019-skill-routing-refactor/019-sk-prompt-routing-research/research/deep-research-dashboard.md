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
- Topic: Diagnose sk-prompt skill-routing and apply the sk-doc typed-pair routing optimizations. It is a parent hub (prompt-improve/prompt-models); only prompt-improve has a RESOURCE_MAP (flat root-relative paths, 6/6 resolve) and prompt-models has none; the baseline shows 100 but only d5 is scored (routing dimensions null/unmeasured); 32 scenarios, 0 typed gold. Investigate a hub-level surface router, packet-qualified typed pairs for both modes, and concrete routing optimizations. Produce findings and a resource-map.
- Started: 2026-07-17T05:19:12Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: rsr-2026-07-17T05-19-12Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Map both workflow modes to their owning packets, current router declarations, resource leaves, and implied typed-pair surface. | architecture | 1.00 | 6 | complete |
| 2 | Produce the dependency-ordered change plan without weakening unknown/ambiguous fallback behavior. | architecture | 0.93 | 6 | complete |
| 3 | Define and resolve-check the complete prompt-models RESOURCE_MAP, classifying route-selected leaves, lifecycle leaves, aliases, and supporting-only resources. | architecture | 0.90 | 5 | complete |
| 4 | Trace the benchmark producer-to-report path and reconcile hub aggregate 100 with the child D5-only/null report before typed gold exists. | measurement | 0.92 | 6 | complete |
| 5 | Classify all 32 sk-prompt playbook scenarios under actual loader rules and specify the smallest independently authored typed-gold seed. | benchmark-corpus | 0.92 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 29
- openQuestions: 3
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/5
- [x] Which of the 32 playbook scenarios are genuine routing decisions eligible for independently authored typed gold?
- [x] What dependency-ordered changes produce a hub-level surface router and improve routing without weakening fallback behavior?
- [ ] How do `prompt-improve` and `prompt-models` currently route, and what `(workflowMode, leafResourceId)` pairs do they imply? [legacy-import]
- [ ] What resources must a `prompt-models` `RESOURCE_MAP` expose, and do all proposed leaves resolve? [legacy-import]
- [ ] Why does the baseline report 100 while routing dimensions remain null, and what score appears once typed routing is measured? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] How do `prompt-improve` and `prompt-models` currently route, and what `(workflowMode, leafResourceId)` pairs do they imply?
- [ ] What resources must a `prompt-models` `RESOURCE_MAP` expose, and do all proposed leaves resolve?
- [ ] Why does the baseline report 100 while routing dimensions remain null, and what score appears once typed routing is measured?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▃▃▂▂▁▁▁▂▂▂▂▂▂▂▂
- score sparkline: █▇▆▅▄▃▃▂▂▁▁▁▂▂▂▂▂▂▂▂
- Last 3 ratios: 0.90 -> 0.92 -> 0.92
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.92
- coverageBySources: {"code":37,"other":33}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Adding lexical carve-outs before measuring typed-pair behavior: the current hub itself requires benchmark evidence before such a carve-out. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:124] (iteration 2)
- No new exhausted approach category. The prior ruled-out conversions of `prompt-models` to a surface packet and packet `SKILL.md` pointers to leaf gold remain excluded. (iteration 2)
- Replacing `hub-router.json` resources with leaf paths: this conflates `hubLoadAddress` with `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298] (iteration 2)
- Treating UNKNOWN as the default mode's normal leaf set: the second-layer scaffold requires no resource load on a no-keyword match. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:46] (iteration 2)
- Adding one `RESOURCE_MAP` entry per alias: aliases normalize to canonical ids before profile construction, so duplicate alias leaves would misrepresent the router and create duplicate typed pairs. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150] (iteration 3)
- Promoting every discovered Markdown file to typed gold: discovery establishes availability, not selection; the actual router loads only the index, one profile, and the pattern index. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168] (iteration 3)
- Treating JSON registry/budget assets as leaves: `_guard_in_skill` rejects non-Markdown resources. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136] (iteration 3)
- Counting untyped scenarios as typed failures or passes; absent typed gold intentionally does not engage the taxonomy scorer. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121] (iteration 4)
- No new exhausted category. A read-only benchmark rerun was unnecessary because the checked-in machine reports, producer code, rendered reports, and clean targeted Git status already established provenance and denominator semantics. (iteration 4)
- Treating aggregate 100 as full D1-D5 coverage; three routing/usefulness dimensions remain null. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:12] (iteration 4)
- Treating the child `prompt-improve` D5=16 report as the hub baseline; its target and scenario denominator differ. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7] (iteration 4)
- Starting with ambiguous, full-inventory, or bundled cases: they cannot establish a minimal cross-mode atomic baseline and would conflate contract enablement with fallback or breadth semantics. [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:19] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:271] (iteration 5)
- Typing all 32 scenarios: 25 scenarios assert command, behavior, scoring, contract, guard, or recovery outcomes rather than a positive leaf-selection oracle. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:175] (iteration 5)
- Using current `expected_resources: */SKILL.md` as leaf gold: the loader's path extractor does not recognize packet `SKILL.md` paths as leaf resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168] (iteration 5)

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
Produce the dependency-ordered change plan without weakening unknown/ambiguous fallback behavior.

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
- Blocker: ERR_MODULE_NOT_FOUND: better-sqlite3

<!-- /ANCHOR:graph-convergence -->
