DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 6 of 20 (DEEPEN RQ1)

## STATE

state_summary: Iter 6 of 20. RQ1-4 surveyed iters 1-4. RQ5 synthesis iter 5 verdict: HYBRID (distributed references + enhances edges, NO new skill). Ratios: 0.85→0.78→0.72→0.68→0.65. Now deepen RQ1 with concrete per-model token-budget defaults + fitToolResult truncation marker syntax + eviction priority ladder, ready for direct patch authoring in follow-on packet.

Research Topic: Mine smallcode-master for small-model output-quality runtime patterns.

Iteration: 6 of 20

Focus Area: **RQ1 deepening — Concrete per-model token-budget defaults table + truncation-marker syntax + eviction priority ladder.** Iter 1 surfaced 5 budget engine patterns at the principle level. This iter produces patch-ready specifics: (a) per-model token budget defaults TABLE for SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Opus, Sonnet (rows × columns: context_window, max_budget_pct, working_memory_tokens, summary_threshold), (b) truncation-marker syntax candidates (smallcode uses `[... truncated N tokens]`; propose 1-2 variations our skills should adopt for in-prompt context), (c) eviction priority ladder (smallcode: tool results → conversation → system; propose mapping for our agent-config-iter recipes), (d) suggested integration with sk-prompt's cli_prompt_quality_card.md (e.g. new "Composition guidance: budget awareness" subsection).

Remaining Key Questions (all 5 surveyed; iters 6-N deepen + fill gaps):
- [x] RQ1 — Context Budget Engine (iter 1 survey + iter 6 deepen)
- [x] RQ2 — Output Verification Pipeline (iter 2)
- [x] RQ3 — Per-Model Profiles & Escalation (iter 3)
- [x] RQ4 — Structured Scope/Permissions (iter 4)
- [x] RQ5 — Skill Architecture verdict: HYBRID (iter 5)

Last 3 Iterations Summary:
- iter 3: RQ3 (ratio 0.72 progress)
- iter 4: RQ4 (ratio 0.68 complete)
- iter 5: RQ5 verdict HYBRID (ratio 0.65 insight)

## STATE FILES

- Config: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-config.json`
- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/iterations/iteration-006.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deltas/iter-006.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Already-shipped 113 items: RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation. DO NOT re-propose.

## SOURCE BOUNDARIES

- Re-read with deepening intent: `external/smallcode-master/src/context/budget.ms`, `external/smallcode-master/smallcode.toml`, `external/smallcode-master/PLAN.md` (for any budget rationale not yet captured)
- Cross-reference: `external/smallcode-master/src/model/profiles.ms` (per-model context_length values — needed for the defaults table)
- Read iter-001.md (RQ1 baseline patterns)
- Read-only refs: `.opencode/skills/cli-devin/SKILL.md` §3 Model Selection (context windows per model), `.opencode/skills/cli-opencode/SKILL.md` §3 (DeepSeek/Kimi/Qwen/GLM context windows), `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` (current composition-guidance structure)

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-006.md** — Focus/Actions Taken/Findings/Questions Answered/Questions Remaining/Next Focus. Findings MUST include:
   - The concrete per-model token-budget defaults TABLE (≥8 rows)
   - Truncation-marker syntax proposal (1-2 candidates, with rationale)
   - Eviction priority ladder mapping (smallcode → our agent-config-iter recipe)
   - sk-prompt cli_prompt_quality_card.md integration point (exact section name + insertion location)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"insight","focus":"RQ1 deepening — concrete budget defaults table","graphEvents":[]}`. Expected ratio 0.45-0.65.

3. **deltas/iter-006.jsonl** — one iter record + ≥3 finding records (one per concrete artifact produced: defaults table, truncation marker, eviction ladder).

## EXECUTION

1. Pre-plan (medium, 3 steps):
   a. Re-read `src/context/budget.ms` for the BudgetConfig struct + fitToolResult truncation suffix + evict() priority logic.
   b. Read `src/model/profiles.ms` to extract context_length per model. Read our cli-devin/cli-opencode SKILL.md §3 tables for DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1 / SWE-1.6 / gpt-5.5 / Opus context windows.
   c. Author the concrete artifacts: defaults table (rows × columns), truncation marker syntax (1-2 candidates), eviction priority ladder mapping, sk-prompt insertion point.
2. Execute. Stop after step c.
3. Append JSONL + delta. Stop.
