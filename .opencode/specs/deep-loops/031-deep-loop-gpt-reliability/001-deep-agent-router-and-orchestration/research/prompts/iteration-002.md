DEEP-RESEARCH

# Deep-Research Iteration 2 — GPT Slowness Mechanism (KQ4) + Pre-route vs Negotiate (KQ5)

## STATE

Segment: 1 | Iteration: 2 of 8
Questions: 5/10 answered (KQ1,KQ2,KQ3,KQ6,KQ7 done in iteration 1) | Last focus: foundational structural mapping
Last 2 ratios: N/A -> 0.95 | Stuck count: 0
Resource map: not present; skipping coverage gate.
Next focus: KQ4 (WHY is GPT slower than Claude even in fast mode with deep skills?) + KQ5 (what concrete prompt-structure changes convert runtime role-negotiation into up-front pre-routing?).

Research Topic: Deep-agent router & orchestration hardening for GPT-backed OpenCode
Iteration: 2 of 8
Focus Area: Latency root-cause + prompt-structure refinement. Quantify the GPT-slow mechanism from the deep command YAMLs and dispatch prose, then propose concrete pre-routing edits.
Remaining Key Questions: KQ4, KQ5, KQ8, KQ9, KQ10.
Carried-Forward Open Questions: KQ4, KQ5, KQ8, KQ9, KQ10.
Last 3 Iterations Summary: run 1: foundational structural mapping, subagent_type=general confirmed (0.95).

## ITERATION 1 RESULTS (build on these, do not re-derive)

- subagent_type is normalized to "general"; agent identity is prompt-injected from agent-definition files. (CONFIRMED, iteration 1)
- DEEP should be BOTH a runtime-facing primary/router agent file AND mode-registry.json as logic source of truth.
- orchestrate.md can harden route selection + prompt packaging but cannot create hard runtime identity without host-runtime changes.
- ai-council stays directly invocable (mode: all), referenced by the DEEP router/registry.
- Read iteration-001.md for full detail and citations.

## STATE FILES

- Config: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-config.json
- State Log: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-state.jsonl
- Strategy: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md
- Registry: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/findings-registry.json
- Iteration 1 narrative: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md
- Write iteration narrative to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deltas/iter-002.jsonl

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Max 12 tool calls total.
- Write ALL findings to files. Cite every load-bearing claim with file:line. Mark CONFIRMED vs INFERRED.
- Do not implement fixes. Report findings + concrete proposed edits only.
- Do NOT write or modify research.md (workflow-owned; the orchestrator produces it at synthesis). Only iteration-002.md + state-log append + delta file.

## FOCUS FOR THIS ITERATION (answer with file:line evidence)

**KQ4 — GPT slowness mechanism.** WHY is GPT slower than Claude even in fast mode when using deep skills? Is it (a) runtime role-negotiation overhead (GPT re-reads YAML/state/reducer/prompt-pack each iteration instead of isolating to a fresh leaf), (b) prompt verbosity, (c) redundant context carriage, or (d) something else? Find evidence in the deep command YAMLs (how much context is injected per dispatch), the executor dispatch prose, and any latency notes. QUANTIFY if possible: measure/estimate the per-dispatch context size (lines or tokens) of the deep_*_auto.yaml prompt packs, the state-read overhead per iteration, and the prompt_pack_iteration.md.tmpl size. Compare across research/review/context/council YAMLs. Identify the dominant cost.

**KQ5 — Pre-route vs negotiate.** What concrete prompt-structure changes convert "runtime role negotiation" into "up-front pre-routing"? WHERE in the deep command YAMLs / skill SKILL.md files is the role currently negotiated (i.e., where does the dispatched agent have to figure out WHICH deep mode it is, vs being told explicitly)? What would a pre-resolved target look like? Propose SPECIFIC, MINIMAL edits (cite the exact file:line and the before/after). The goal: reduce the per-iteration prompt weight and the role-inference burden WITHOUT stripping the contextual cues Claude uses well.

## FILES TO INVESTIGATE

- `.opencode/commands/deep/assets/deep_research_auto.yaml` — focus on agent_config, context_loading, the dispatch step (step_dispatch_iteration), and the prompt_pack rendering. Quantify injected context.
- `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_context_auto.yaml`, `deep_ai-council_auto.yaml` — compare per-dispatch context weight; note differences.
- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md` — where is the role/identity stated vs negotiated?
- `.opencode/skills/deep-loop-runtime/SKILL.md` — shared executor/state/coverage overhead.
- `.opencode/agents/deep-research.md`, `orchestrate.md` — the role/identity contract the dispatched agent receives.
- `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` — the per-iteration prompt template (already small; quantify what fills it).

## OUTPUT CONTRACT (same as iteration 1)

1. Iteration narrative at iterations/iteration-002.md (Focus, Actions Taken, Findings w/ file:line + confirmed/inferred, Questions Answered [KQ4, KQ5], Questions Remaining, Next Focus).
2. Canonical JSONL `{"type":"iteration","iteration":2,...}` APPENDED to deep-research-state.jsonl (single-line, newline-terminated, type exactly "iteration"). Include newInfoRatio (should reflect how much NET-NEW evidence beyond iteration 1 — likely moderate, e.g. 0.5-0.75, since this is a new question area but builds on iteration 1's structure), status, focus, findingsCount, keyQuestions, answeredQuestions, durationMs, timestamp, sessionId "031-001-res-1782823402", generation 1.
3. Delta file deltas/iter-002.jsonl (iteration record + per-finding records).

All three REQUIRED.
