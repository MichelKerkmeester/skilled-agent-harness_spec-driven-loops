DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 11 of 20 (GAP AUDIT)

## STATE

state_summary: Iter 11 of 20. Trajectory 0.85→0.78→0.72→0.68→0.65→0.55→0.45→0.35→0.28→0.25. Approaching convergence (rolling avg 0.29; threshold 0.15). Iters 1-5 surveyed RQ1-5. Iters 6-9 deepened RQ1-4. Iter 10 cross-cut AGENTS.md + enhances. Now: AUDIT for gaps and missed high-value patterns.

Iteration: 11 of 20

Focus Area: **Gap audit — read iters 1-10 + preflight context-card, identify high-value patterns NOT YET surfaced, either add them or confirm coverage.** Two possible outcomes:
(A) Surface 1-3 missed patterns from smallcode that should land as findings (e.g. smallcode's planner.ms auto-decompose has connections to RQ2 verification; 2-stage tool routing in src/tools/router.ms has connections to RQ4 structured-permissions; bench/ evaluation harness might be a future packet idea).
(B) Confirm coverage: explicitly check preflight context-card §Overview + §RQ1-5 against iters 1-10 findings and report "no high-value patterns missed" with evidence. In this case, newInfoRatio should be LOW (0.10-0.20), signaling convergence ready.

Originally OUT OF SCOPE per ADR-002 trim (was 7 RQs → 5):
- ~~RQ-tool-routing — 2-stage routing + forgiving JSON parser (dropped: overlaps mcp-code-mode)~~
- ~~RQ-auto-decompose — planner.ms task decomposition (dropped: overlaps sk-prompt medium-pre-plan)~~

These were dropped for SCOPE reasons but if they have HIGH ratio of small-model output-quality contribution and current iters 1-10 don't capture them, surface as findings now. Otherwise confirm they remain ruled-out.

Last 3 Iterations Summary:
- iter 8: RQ3 deepen (0.35 insight)
- iter 9: RQ4 deepen (0.28 insight)
- iter 10: cross-cutting AGENTS.md (0.25 insight)

## STATE FILES

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-011.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/deltas/iter-011.jsonl`
- State Log: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3–5 research actions.
- Already-shipped 113: RCAF, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation. DO NOT re-propose.

## SOURCE BOUNDARIES

- Read iters 1-10 systematically (skim findings sections + Questions Answered)
- Read preflight context-card §Overview + spot-check §RQ1-5 for any high-density code quote not yet reflected in iter findings
- Optionally read smallcode source for dropped-RQ patterns: `src/planner/planner.ms` (auto-decompose), `src/tools/router.ms` (2-stage routing), `src/tools/validator.ms` (forgiving parser) — but only if preflight card §Overview suggests they're relevant to our 5 RQs.
- DO NOT broaden scope — the ADR-002 5-RQ freeze is in effect.

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-011.md** — Findings MUST include:
   - Audit table: per-iter (1-10), patterns covered + any gaps surfaced + completeness rating
   - Outcome (A or B): list 1-3 missed patterns to add as findings, OR confirm coverage with explicit "no high-value patterns missed"
   - For dropped-RQ patterns (planner.ms, router.ms, validator.ms): include/exclude verdict with rationale
   - Recommendations for synthesis pass (research.md structure): per-RQ section template + ordering rationale

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":11,"newInfoRatio":<0..1>,"status":"<insight|exhausted>","focus":"Gap audit — coverage confirmation or missed patterns","graphEvents":[]}`. If outcome B (coverage confirmed) → ratio 0.10-0.20 + status "exhausted". If outcome A (missed patterns) → ratio 0.20-0.35 + status "insight".

3. **deltas/iter-011.jsonl** — one iter record + ≥3 finding records (audit table summary, outcome verdict, synthesis recommendations).

## EXECUTION

1. Pre-plan (3 steps):
   a. Read iters 1-10 (focus on Findings sections only — ~50 lines each = 500 lines).
   b. Read preflight context-card §Overview + skim §RQ1-5 line ranges for unaddressed patterns. Optionally read smallcode dropped-RQ files if relevance is unclear.
   c. Author audit table + outcome + dropped-RQ verdict + synthesis recommendations.
2. Execute. Stop at step c.
3. Append JSONL + delta. Stop.
