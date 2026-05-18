DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 7 of 20 (DEEPEN RQ2)

## STATE

state_summary: Iter 7 of 20. RQ1-5 surveyed iters 1-5. RQ1 deepened iter 6 with concrete defaults table + truncation marker syntax + eviction ladder. Trajectory 0.85→0.78→0.72→0.68→0.65→0.55. Now deepen RQ2.

Research Topic: Mine smallcode-master for small-model output-quality runtime patterns.

Iteration: 7 of 20

Focus Area: **RQ2 deepening — Concrete output-verification recipe additions.** Iter 2 surfaced verifier + hard-fail + tool-scorer at principle level. This iter produces patch-ready specifics: (a) the EXACT lines of `system_instructions` to add to `cli-devin/assets/agent-config-deep-research-iter.json` for SWE-1.6 output-verification discipline (compile/execute/smoke-test/lint pipeline analog for research output, with refuse-to-ship gate), (b) confidence-scoring rubric formula adapted from smallcode's `0.35×compiled + 0.25×executed + 0.25×tests + 0.1×lint − 0.05×auto_fixed` (smallcode-specific terms map to: structure-check, cite-check, recommendation-actionability, citation-accuracy, anti-hallucination), (c) integration handshake with the existing `post-dispatch-validate.ts` (extend or sibling?), (d) hard-fail message template for refused delivery.

Remaining Key Questions (all 5 surveyed; iters 6-N deepen + fill gaps):
- [x] RQ1 — Context Budget Engine (iter 1 + iter 6 deepen)
- [x] RQ2 — Output Verification Pipeline (iter 2 + iter 7 deepen ← current)
- [x] RQ3 — Per-Model Profiles & Escalation
- [x] RQ4 — Structured Scope/Permissions
- [x] RQ5 — Skill Architecture verdict: HYBRID

Last 3 Iterations Summary:
- iter 4: RQ4 (ratio 0.68 complete)
- iter 5: RQ5 verdict HYBRID (0.65 insight)
- iter 6: RQ1 deepen (0.55 insight)

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/iterations/iteration-007.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deltas/iter-007.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Already-shipped 113: RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation. DO NOT re-propose.

## SOURCE BOUNDARIES

- Re-read smallcode source: `external/smallcode-master/src/governor/verifier.ms`, `external/smallcode-master/src/governor/hard_fail.ms`. Extract the EXACT scoring formula + refusal-message template.
- Read iter-002.md (RQ2 baseline).
- Read-only refs: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (current system_instructions — augment, don't replace), `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` (iter contract — where to add a verification section), `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (current validation surface — sibling or extension target).

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-007.md** — Findings MUST include:
   - The exact `system_instructions` lines to add to agent-config-deep-research-iter.json (drop-in JSON snippet, plus brief integration note)
   - Confidence-scoring rubric formula adapted to research output (with term mapping smallcode→ours)
   - post-dispatch-validate.ts integration handshake (sibling validator vs new validation step extending the existing function)
   - Hard-fail message template (refused-delivery boilerplate cli-devin returns when verification fails)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"insight","focus":"RQ2 deepening — verification recipe additions","graphEvents":[]}`. Expected ratio 0.40-0.55.

3. **deltas/iter-007.jsonl** — one iter record + ≥3 finding records (one per concrete artifact).

## EXECUTION

1. Pre-plan (3 steps):
   a. Re-read verifier.ms + hard_fail.ms with patch-authoring intent. Extract the scoring formula + refusal-message template verbatim.
   b. Read agent-config-deep-research-iter.json + deep-loop-iter-contract.md + post-dispatch-validate.ts (focus on validateIterationOutputs function).
   c. Author the concrete artifacts: drop-in system_instructions JSON snippet, rubric formula, validate.ts integration handshake, hard-fail message template.
2. Execute. Stop at step c.
3. Append JSONL + delta. Stop.
