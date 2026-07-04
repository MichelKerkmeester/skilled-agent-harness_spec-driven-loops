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
- Topic: Deep-agent router & orchestration hardening for GPT-backed OpenCode
- Started: 2026-06-30T12:43:22Z
- Status: INITIALIZED
- Iteration: 6 of 8
- Session ID: 031-001-res-1782823402
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Foundational structural mapping: subagent_type contract, deep dispatch surfaces, ai-council reachability, runtime mirrors | - | 0.95 | 9 | complete |
| 2 | KQ4 GPT slowness mechanism + KQ5 pre-route vs negotiate prompt structure | - | 0.75 | 6 | complete |
| 3 | KQ8 FIX-5 criterion + KQ9 Claude flexibility + KQ10 first-dispatch verification | - | 0.58 | 6 | complete |
| 4 | KQ1 deepening: concrete reviewable draft of .opencode/agents/deep.md inside iteration artifact | router-artifact | 0.55 | 5 | insight |
| 5 | KQ8 FIX-5 trigger stress-test plus KQ5 four-mode pre-route edits | deepening | 0.52 | 9 | complete |
| 6 | KQ2 host-runtime hard identity spec + KQ9 per-edit Claude-flex preservation test | deepening-host-identity-flex | 0.46 | 8 | complete |

- iterationsCompleted: 6
- keyFindings: 41
- openQuestions: 20
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/20
- [ ] DEEP agent form factor: new standalone .opencode/agents/deep.md, enhancement to deep-loop-workflows mode-registry router, or both? What does OpenCode's agent dispatch model support for primary-agent dispatch to named sub-agents / specialized subagent_type? [operator]
- [ ] Can agent files declare a per-agent subagent_type that survives dispatch as hard runtime identity, or is every dispatch normalized to 'general'? Smallest host-runtime change to enable it; in scope or follow-up? [operator]
- [ ] How much can orchestrate.md change deep-loop dispatch behavior without breaking Claude Code parity and Claude's adaptive flexibility? What specifically carries deep dispatch today? [operator]
- [ ] Why is GPT slower than Claude even in fast mode with deep skills? Role-negotiation overhead, prompt verbosity, redundant context carriage, or other? Quantify from YAMLs and dispatch prose. [operator]
- [ ] What concrete prompt-structure changes convert runtime role-negotiation into up-front pre-routing? Where is the role negotiated today; what does pre-resolved target look like? [operator]
- [ ] How should DEEP router include ai-council without breaking its direct invocability, given ai-council.md is mode: primary today? [operator]
- [ ] What must be mirrored across .opencode/agents/, .claude/agents/, .codex/agents/? Sync convention or hand-mirrored? What breaks on drift? [operator]
- [ ] Under what conditions does the agent-layer fix prove insufficient and FIX-5 (native->CLI subprocess executor) becomes mandatory? Give a clear decision criterion. [operator]
- [ ] What specific Claude-flexible behaviors must NOT be constrained away? Identify adaptive behaviors so GPT refinements target mis-invocation signals, not legitimate flexibility. [operator]
- [ ] How to measure 'GPT invokes the correct deep agent on the first dispatch'? Dispatch provenance observable, or need a probe? Minimal before/after test. [operator]
- [ ] KQ1 — DEEP agent form factor (standalone agent vs mode-registry enhancement vs both); OpenCode dispatch model support for specialized subagent_type. Cite agent frontmatter schema, Task tool subagent_type contract, orchestrate.md. [legacy-import]
- [ ] KQ2 — subagent_type specialization feasibility (hard runtime identity vs normalized to general); smallest host-runtime change; in scope or follow-up. Cite opencode agent spec, orchestrate.md ILLEGAL NESTING. [legacy-import]
- [ ] KQ3 — Orchestrate hardening boundary: what can change without breaking Claude parity/flexibility; what carries deep dispatch today. [legacy-import]
- [ ] KQ4 — GPT slowness mechanism (role-negotiation overhead vs verbosity vs context carriage vs other). Quantify from deep command YAMLs and dispatch prose. [legacy-import]
- [ ] KQ5 — Pre-route vs negotiate: concrete prompt-structure edits; where role is negotiated today; pre-resolved target shape. [legacy-import]
- [ ] KQ6 — ai-council dual reachability (DEEP sub-agent target AND directly invocable primary). Cite ai-council.md. [legacy-import]
- [ ] KQ7 — Cross-runtime parity (.opencode/.claude/.codex agents); sync convention or hand-mirrored; drift breakage. [legacy-import]
- [ ] KQ8 — FIX-5 decision criterion: when does the agent-layer fix prove insufficient and FIX-5 (native->CLI subprocess, process isolation) become mandatory. [legacy-import]
- [ ] KQ9 — Claude flexibility preservation: identify adaptive behaviors to NOT constrain away. [legacy-import]
- [ ] KQ10 — Verification strategy: how to measure first-dispatch correctness; minimal before/after test. [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 20
- [ ] DEEP agent form factor: new standalone .opencode/agents/deep.md, enhancement to deep-loop-workflows mode-registry router, or both? What does OpenCode's agent dispatch model support for primary-agent dispatch to named sub-agents / specialized subagent_type?
- [ ] Can agent files declare a per-agent subagent_type that survives dispatch as hard runtime identity, or is every dispatch normalized to 'general'? Smallest host-runtime change to enable it; in scope or follow-up?
- [ ] How much can orchestrate.md change deep-loop dispatch behavior without breaking Claude Code parity and Claude's adaptive flexibility? What specifically carries deep dispatch today?
- [ ] Why is GPT slower than Claude even in fast mode with deep skills? Role-negotiation overhead, prompt verbosity, redundant context carriage, or other? Quantify from YAMLs and dispatch prose.
- [ ] What concrete prompt-structure changes convert runtime role-negotiation into up-front pre-routing? Where is the role negotiated today; what does pre-resolved target look like?
- [ ] How should DEEP router include ai-council without breaking its direct invocability, given ai-council.md is mode: primary today?
- [ ] What must be mirrored across .opencode/agents/, .claude/agents/, .codex/agents/? Sync convention or hand-mirrored? What breaks on drift?
- [ ] Under what conditions does the agent-layer fix prove insufficient and FIX-5 (native->CLI subprocess executor) becomes mandatory? Give a clear decision criterion.
- [ ] What specific Claude-flexible behaviors must NOT be constrained away? Identify adaptive behaviors so GPT refinements target mis-invocation signals, not legitimate flexibility.
- [ ] How to measure 'GPT invokes the correct deep agent on the first dispatch'? Dispatch provenance observable, or need a probe? Minimal before/after test.
- [ ] KQ1 — DEEP agent form factor (standalone agent vs mode-registry enhancement vs both); OpenCode dispatch model support for specialized subagent_type. Cite agent frontmatter schema, Task tool subagent_type contract, orchestrate.md.
- [ ] KQ2 — subagent_type specialization feasibility (hard runtime identity vs normalized to general); smallest host-runtime change; in scope or follow-up. Cite opencode agent spec, orchestrate.md ILLEGAL NESTING.
- [ ] KQ3 — Orchestrate hardening boundary: what can change without breaking Claude parity/flexibility; what carries deep dispatch today.
- [ ] KQ4 — GPT slowness mechanism (role-negotiation overhead vs verbosity vs context carriage vs other). Quantify from deep command YAMLs and dispatch prose.
- [ ] KQ5 — Pre-route vs negotiate: concrete prompt-structure edits; where role is negotiated today; pre-resolved target shape.
- [ ] KQ6 — ai-council dual reachability (DEEP sub-agent target AND directly invocable primary). Cite ai-council.md.
- [ ] KQ7 — Cross-runtime parity (.opencode/.claude/.codex agents); sync convention or hand-mirrored; drift breakage.
- [ ] KQ8 — FIX-5 decision criterion: when does the agent-layer fix prove insufficient and FIX-5 (native->CLI subprocess, process isolation) become mandatory.
- [ ] KQ9 — Claude flexibility preservation: identify adaptive behaviors to NOT constrain away.
- [ ] KQ10 — Verification strategy: how to measure first-dispatch correctness; minimal before/after test.

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▆▅▄▄▃▃▃▂▂▂▂▂▂▂▁▁▁
- score sparkline: █▇▆▆▅▄▄▃▃▃▂▂▂▂▂▂▂▁▁▁
- Last 3 ratios: 0.55 -> 0.52 -> 0.46
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.46
- coverageBySources: {"code":132}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Searching for a current hard custom-agent `subagent_type` field in `.opencode/` produced only orchestrator prose, archived/spec references, and `mode:` frontmatter; no current live agent schema evidence supported custom specialized `subagent_type` declarations. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:207] (iteration 1)
- Treating `.codex/agents/` as confirmed-present was ruled out by direct read failure and zero TOML matches. [SOURCE: .codex/agents Read result: file not found] [SOURCE: Glob **/agents/*.toml result: no files found] (iteration 1)
- Treating `subagent_type` as a current per-agent declaration was ruled out for the sampled live agent files: the evidence found `mode` fields and orchestrator-mandated `subagent_type: "general"`, not per-agent `subagent_type` declarations. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:162] (iteration 1)
- No new blocked dead end. The iteration avoided retrying the blocked `subagent_type` specialization search from iteration 1 and used that result only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:40] (iteration 2)
- Treating full `deep_research_auto.yaml` or sibling YAML size as the direct per-leaf injected payload was ruled out for native research dispatch: the YAML renders a prompt pack and sends `context_source: "rendered_prompt_pack"`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:856] (iteration 2)
- Treating state-log carriage as the dominant prompt payload was ruled out: the prompt pack carries file paths and summaries while state remains externalized in config/state/strategy files. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:477] (iteration 2)
- Building a new benchmark/probe harness was ruled out because the workflow already has state-log append validation, delta-file validation, observability envelopes, and executor audit/failure records. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-003.md:43] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940] (iteration 3)
- No new blocked implementation dead end. The iteration avoided re-searching the already-blocked custom `subagent_type` specialization path and used it only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:82] (iteration 3)
- Treating FIX-5 as mandatory merely because `subagent_type` cannot specialize was ruled out: prior evidence makes that the structural ceiling, but KQ8 needs an observable post-fix failure trigger, not just the existence of a soft identity boundary. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:21] (iteration 3)
- Creating the real `.opencode/agents/deep.md` was ruled out because this iteration's prompt explicitly made implementation a non-goal and required the draft to live inside `iteration-004.md`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-004.md:38] (iteration 4)
- No new dead-end research path. The iteration produced a concrete artifact from existing evidence rather than reopening prior blocked approaches. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:157] (iteration 4)
- Retrying the blocked custom `subagent_type` specialization path was ruled out; this iteration only used the prior finding that all custom-agent dispatches use `general`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:94] [SOURCE: .opencode/agents/orchestrate.md:162] (iteration 4)
- No new blocked research path. The pass avoided implementing runtime files and stayed on evidence-backed pre-route edits and validator analysis. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-005.md:29] (iteration 5)
- Treating council as native-only was ruled out: the YAML has `executor.cli` input, but the actual CLI dispatch is indirect via `orchestrate-session.cjs`, not a YAML `if_cli_opencode` branch. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:24] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:119] (iteration 5)
- Treating the FIX-5 trigger as complete just because it catches schema/artifact failures was ruled out; it misses semantically wrong-mode but schema-correct artifacts. [INFERENCE: based on finding 5 and `.opencode/commands/deep/assets/deep_research_auto.yaml:940-968`] (iteration 5)
- No new blocked path. Host internals are not inspectable from this workspace, so the host change is specified at the contract surface and recommended as an upstream/FIX-5-alternative follow-up rather than packet-local implementation. [SOURCE: opencode.json:2] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:390] (iteration 6)
- Treating a new agent frontmatter field such as `subagent_type: deep-research` as sufficient was ruled out: current files use `mode`, and a frontmatter-only field would not bind runtime identity unless the host resolver enforces it. [SOURCE: .opencode/agents/deep-research.md:4] [SOURCE: .opencode/agents/orchestrate.md:162] [INFERENCE: runtime enforcement is required] (iteration 6)
- Treating FIX-5 as the immediate next step was ruled out for this phase: iteration 5's blind spot first calls for route-proof fields in current validators, while hard host identity and process isolation remain follow-ups if GPT still misroutes. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-005.md:50] (iteration 6)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
None for KQ2/KQ9 deepening. Implementation still needs to choose between packet-local route-proof validation now and external host-runtime hard identity as follow-up.

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
