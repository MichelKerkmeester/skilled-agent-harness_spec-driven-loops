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
- Topic: Do the READMEs, AGENTS.md, CROSS-CLI.md, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks across the repo describe the current eleven agents (.skilled/agents/*.md and agent-registry.json) and their runtime copies (.claude, .codex, .cursor, .devin, .dsh, .opencode, .pi, .vibe agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Exclude changelogs, specs/ and archived packets.
- Started: 2026-11-15T14:58:06.196Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-vibe-a-1794754623609-z9i1mt
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
| 1 | Top-level docs and runtime sync docs vs the eleven-agent inventory | docs-inventory | 0.94 | 8 | complete |
| 2 | Skill and command docs vs each agent declared role, tools, status values and routing | skill-docs | 0.86 | 7 | complete |
| 3 | Feature catalogs, manual testing playbooks and the doctor agent-roster check | playbooks-and-doctor | 0.88 | 8 | complete |

- iterationsCompleted: 3
- keyFindings: 23
- openQuestions: 1
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/5
- [x] Do the runtime sync docs and the generator scripts describe the same sync mechanism, source-of-truth path and runtime copy locations (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`) that the generators actually implement?
- [x] Do the skill and command docs (`.skilled/skills/**`, `.skilled/commands/**`) describe each agent's role, allowed tools, status values and routing correctly?
- [x] Do the feature catalogs and manual testing playbooks describe agent status values, routing, file locations and sync behaviour correctly?
- [x] Which specific doc lines misdescribe an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and which agent or generator file contradicts each one?
- [ ] Does the canonical agent inventory in `.skilled/agents/*.md` plus `.skilled/agents/agent-registry.json` match what the top-level docs (`README.md`, `AGENTS.md`, `CROSS-CLI.md`) say about the eleven agents' names, roles, tiers, tools and model pins? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Does the canonical agent inventory in `.skilled/agents/*.md` plus `.skilled/agents/agent-registry.json` match what the top-level docs (`README.md`, `AGENTS.md`, `CROSS-CLI.md`) say about the eleven agents' names, roles, tiers, tools and model pins?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▅▄▄▃▂▁▁▁▁▂▂▂▂▂▃▃
- score sparkline: █▇▇▆▅▄▄▃▂▁▁▁▁▂▂▂▂▂▃▃
- Last 3 ratios: 0.94 -> 0.86 -> 0.88
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.88
- coverageBySources: {"code":42,"other":19}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `.skilled/CROSS-CLI.md` is the only `CROSS-CLI.md` in the repository (there is none at the root). It is a cross-CLI dispatch doc, not an agent-inventory doc; its agent references are dispatch examples rather than role or tool claims. (iteration 1)
- `AGENTS.md` carries no per-agent inventory: its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim. There is nothing there to contradict, so `AGENTS.md` is not a productive target for this topic. (iteration 1)
- Counting the CLI bridges as an agent-inventory error: `README.md:69`'s "Eight CLI bridges" resolves correctly against `.skilled/skills/cli-external-orchestration/mode-registry.json`, which declares exactly eight `workflow` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`). Not a finding. (iteration 1)
- Treating `.claude/agents/Explore.md` as an undocumented twelfth agent: `.claude/README.md:41` documents it ("plus `Explore.md`, which only Claude has") and `check-agent-mirror-sync.cjs:40` carries it in `CLAUDE_ONLY_AGENTS`. Not a finding. (iteration 1)
- Treating `.skilled/agents/README.txt`'s model-pin claim as wrong: the claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly. Not a finding. (iteration 1)
- `.skilled/agents/orchestrate.md`'s three generated blocks (`routing-table` at line 76, `tier-table` at line 98, `agent-files` at line 171) match `agent-registry.json` exactly, including the eleven priorities and the LEAF/ORCHESTRATOR split. The generator is in sync. (iteration 2)
- `.skilled/commands/deep/research.md` makes no per-agent role, tool or status claim: it is a thin router that explicitly refuses to dispatch (lines 13-14, 24, 31) and defers every agent claim to the workflow YAML. Nothing there to contradict. (iteration 2)
- `.skilled/skills/system-deep-loop/SKILL.md`'s mode table (lines 28-31) names only `deep-research` and `deep-review` as agents, which is correct for a two-mode hub; the council is correctly called out as standalone at line 33. Not a finding. (iteration 2)
- Treating `ai-council`'s `task: allow` as a LEAF violation: `.skilled/agents/ai-council.md:38-47` defines an explicit Depth 0 / Depth 1 split, where seats are dispatched only when the prompt states operator invocation and Depth 1 refuses nested dispatch. The permission is consistent with the agent's own contract, so the registry's flat `LEAF` tier is a simplification rather than a contradiction. (iteration 2)
- Treating `review`'s `bash: allow` as contradicting its "READ-ONLY file access" claim: `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`, which are read-only commands. Not a finding. (iteration 2)
- Treating the deep-research status enum as wrong: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six values and matches `.skilled/agents/deep-research.md`. Only the deep-review sibling is short a value. (iteration 2)
- `.skilled/commands/doctor/runtime-mirrors.md:59` describes the roster check only as "the agent roster" without naming a runtime count or a canonical tree, so the command doc itself carries no contradictable claim. The misdescription lives in the script it invokes. (iteration 3)
- The feature catalogs are not a productive surface for this topic. Of the thirteen catalog files that mention an `agents/` path, only the two iteration-dispatch files make an agent claim, and both are accurate. The remaining eleven reference agent paths as evidence links rather than as role, tool or status claims. (iteration 3)
- Treating `pause-sentinel-halt.md:110`'s citation of `.skilled/agents/deep-research.md:43-55` as stale: those lines are the ILLEGAL NESTING AND SCOPE LOCK block, which is what the row claims to anchor. Not a finding. (iteration 3)
- Treating the `.cursor`/`.devin` symlink claim as wrong: `ls -la` confirms `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`. Only the OpenCode/Codex half of that sentence is wrong. (iteration 3)
- Treating the feature catalogs as a misdescription surface: the two catalogs that name an agent — `deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md` and `deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md` — describe the LEAF contract, the reducer boundary and the file locations correctly, and `deep-research/feature-catalog/feature-catalog.md:54` matches the workflow. No finding. (iteration 3)

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
Follow up on: `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md:106` cites `.skilled/agents/deep-research.md:51-55` for "agent may not repair reducer or contro...

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
