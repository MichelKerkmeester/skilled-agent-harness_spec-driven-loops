DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 8 of 20 (DEEPEN RQ3)

## STATE

state_summary: Iter 8 of 20. Trajectory 0.85→0.78→0.72→0.68→0.65→0.55→0.45. Deepening pass continues.

Research Topic: Mine smallcode-master for small-model output-quality runtime patterns.

Iteration: 8 of 20

Focus Area: **RQ3 deepening — Concrete model-profile.json schema + escalation decision matrix.** Iter 3 surfaced principles; this iter produces patch-ready specifics: (a) JSON schema for `model-profile.json` covering ≥6 of our models (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Opus, Sonnet; fields: id, provider, context_length, tool_calling_support, chat_template, strengths, weaknesses, free_tier, pro_tier, escalation_target, average_iter_wall_clock_min), (b) escalation decision matrix (when_to_downgrade rules, when_to_escalate rules, quota_aware rules — concrete IF/THEN clauses), (c) where the registry lives in the skill tree (Option A: `.opencode/skills/sk-prompt/assets/model-profile.json` since sk-prompt is the cross-CLI master; Option B: new top-level config file; pick one + rationale), (d) bayesian tool-scoring placement decision (cli-* iter recipes per-call vs mcp-code-mode tool-registry layer — pick one + rationale).

Last 3 Iterations Summary:
- iter 5: RQ5 verdict HYBRID (0.65 insight)
- iter 6: RQ1 deepen (0.55 insight)
- iter 7: RQ2 deepen (0.45 insight)

## STATE FILES

- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/iterations/iteration-008.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deltas/iter-008.jsonl`
- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Already-shipped 113: RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation. DO NOT re-propose.

## SOURCE BOUNDARIES

- Re-read smallcode: `external/smallcode-master/src/model/profiles.ms` (extract profile schema verbatim), `external/smallcode-master/src/governor/tool_scorer.ms` (extract Laplace-smoothing + demotion logic), `external/smallcode-master/bin/escalation.js` (extract escalation triggers + conversation-format conversion logic).
- Read iter-003.md (RQ3 baseline).
- Read-only refs: `.opencode/skills/cli-devin/SKILL.md` §3 Model Selection, `.opencode/skills/cli-opencode/SKILL.md` §3 Model Selection, `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` (cross-CLI master location), `.opencode/skills/mcp-code-mode/SKILL.md` (tool-registry layer for bayesian-scoring placement question).

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-008.md** — Findings MUST include:
   - The model-profile.json schema (full JSON with ≥6 model rows, all fields specified)
   - Escalation decision matrix (concrete IF/THEN rules covering downgrade + escalate + quota-aware)
   - Registry location verdict (Option A/B with rationale)
   - Bayesian scoring placement verdict (cli-* recipes vs mcp-code-mode tool-registry with rationale)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"insight","focus":"RQ3 deepening — model-profile schema + escalation matrix","graphEvents":[]}`. Expected ratio 0.30-0.50.

3. **deltas/iter-008.jsonl** — one iter record + ≥3 finding records (one per concrete artifact: schema, escalation matrix, registry-location verdict, bayesian-placement verdict).

## EXECUTION

1. Pre-plan (3 steps):
   a. Re-read profiles.ms + tool_scorer.ms + escalation.js for schema/formula/triggers verbatim.
   b. Read cli-devin/cli-opencode SKILL.md §3 tables + mcp-code-mode for the placement context.
   c. Author concrete artifacts: schema JSON, escalation matrix, registry location verdict, bayesian placement verdict.
2. Execute. Stop at step c.
3. Append JSONL + delta. Stop.
