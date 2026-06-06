DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 10 of 20 (CROSS-CUTTING: AGENTS.md + Enhances Edges)

## STATE

state_summary: Iter 10 of 20. Trajectory 0.85→0.78→0.72→0.68→0.65→0.55→0.45→0.35→0.28. RQ1-4 deepened; RQ5 verdict HYBRID. Now cross-cutting: AGENTS.md draft + enhances edges between existing skills.

Iteration: 10 of 20

Focus Area: **Cross-cutting: AGENTS.md addition + enhances edge wiring for HYBRID architecture.** Iter 5 verdict was HYBRID. This iter produces patch-ready specifics for the architecture realization: (a) the EXACT AGENTS.md addition (sibling rule to existing CLI dispatch rule §1 line 39, with full literal text), (b) per-skill `graph-metadata.json` enhances-edge additions: which existing skills should add `enhances` edges to which other skills (cli-devin → sk-prompt? cli-opencode → cli-devin? sk-code → cli-devin?), with weights 0.3-0.5 + rationale per edge (note: sk-prompt already has `enhances` to cli-claude-code/cli-codex/cli-gemini at weight 0.4 — extend the same pattern), (c) per-skill trigger_phrases additions in graph-metadata.json so the advisor surfaces small-model patterns on the right prompts, (d) skill-advisor 5-lane score simulation for 3 sample small-model prompts (e.g. "dispatch SWE-1.6 to read this file", "use cli-devin for code review with output verification", "extract patterns from smallcode-master") — confirm the HYBRID wiring would clear the 0.8 threshold.

Last 3 Iterations Summary:
- iter 7: RQ2 deepen (0.45 insight)
- iter 8: RQ3 deepen (0.35 insight)
- iter 9: RQ4 deepen (0.28 insight)

## STATE FILES

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-010.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deltas/iter-010.jsonl`
- State Log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/findings-registry.json`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3–5 research actions.
- Already-shipped: RM-8, RCAF, sequential_thinking 2-layer, etc. DO NOT re-propose.

## SOURCE BOUNDARIES

- Read AGENTS.md (full file — current state)
- Read each skill's graph-metadata.json: `.opencode/skills/{cli-devin,cli-opencode,sk-prompt,sk-code,mcp-code-mode}/graph-metadata.json`
- Read sk-prompt's enhances precedent in detail (weights, context strings)
- Read system-skill-advisor SKILL.md + `mcp_server/lib/scorer/fusion.ts` lines 41-200 for scoring mechanics
- Read iter-005.md (RQ5 HYBRID verdict)

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-010.md** — Findings MUST include:
   - The exact AGENTS.md addition (full literal text, with insertion location specified — line number or anchor)
   - Per-skill enhances-edge additions: bullet list of {source_skill, target_skill, weight, context_string, rationale}. Cover at minimum: cli-devin → sk-prompt, cli-opencode → cli-devin, cli-devin → cli-opencode, sk-code → cli-devin
   - Per-skill trigger_phrases additions for graph-metadata.json (small-model keywords: small model, swe-1.6, output verification, budget engine, structured permissions, etc.)
   - 5-lane scoring simulation: 3 sample prompts × 5 lanes = 15 score estimates with rationale. Confirm at least 2/3 prompts trigger the HYBRID-related skills above the 0.8 threshold.

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":10,"newInfoRatio":<0..1>,"status":"insight","focus":"Cross-cutting — AGENTS.md addition + enhances edge wiring","graphEvents":[]}`. Expected ratio 0.18-0.30.

3. **deltas/iter-010.jsonl** — one iter record + ≥3 finding records.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read AGENTS.md + each skill's graph-metadata.json + sk-prompt enhances precedent.
   b. Read advisor's fusion.ts threshold logic + 5-lane scoring mechanics.
   c. Author concrete artifacts: AGENTS.md addition + enhances edges + trigger phrases + 5-lane simulation.
2. Execute. Stop at step c.
3. Append JSONL + delta. Stop.
