DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

LEAF deep-research agent. Iteration 4 of 10. Report findings only; do NOT implement fixes. Build on iters 1-3.

## STATE

STATE SUMMARY:
Segment 1 | Iteration 4 of 10
Q1 mostly answered, Q2 answered, Q3 answered. Q4 (THIS), Q5 remain.
Last 2 ratios: 0.50 -> 0.40 | Stuck count: 0
Next focus: Q4 behavioral regressions (empirical test runs).

Research Topic: What did the 014 CocoIndex + LLM-reranker deprecation arc miss?
Iteration: 4 of 10
Focus Area: Q4 — BEHAVIORAL REGRESSIONS (empirical). Use Bash to actually RUN tests and confirm behavior, don't just read:
  (a) Confirm the broken test: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run --config mcp_server/vitest.config.ts sidecar-hardening 2>&1 | tail -20` — does it FAIL on the SPECKIT_CROSS_ENCODER assertion (iter-1/2 Finding)?
  (b) Run the rerank/rescue/confidence suites to confirm NO regression: `... vitest.mjs run --config mcp_server/vitest.config.ts stage3-rerank confidence-scoring result-explainability rescue 2>&1 | tail -20`. Report pass/fail counts.
  (c) Static-check runtime workflows that might assume cross-encoder/cocoindex at RUNTIME: grep `/doctor` command + playbooks for `cocoindex`/`coco-daemon`/`ccc`/`cross-encoder` runtime steps (does `/doctor` still try to health-check a removed cocoindex daemon?); check `/speckit` + council workflows for removed-tool assumptions. Confirm the 3-factor confidence math: was the removed 0.20 reranker weight truly inert (rawValue still caps at 0.80)? Read confidence-scoring.ts WEIGHT_* + the rawValue computation.
  Classify: REGRESSION (broke something live) vs NO-REGRESSION (verified clean) vs BROKEN-TEST (stale test fails).

Remaining Key Questions: Q4 (THIS), Q5 (full doc sweep).
Last 3 Iterations Summary: iter1 live-code (0.45) 2P1+2P2; iter2 4-runtime/config (0.50) P1 gemini search.toml+2P2; iter3 capability-gap (0.40) P1 opencode search.md + 6 more stranded promises, MMR+rescue COVERED, semantic-code-search REAL-GAP(intentional).

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-state.jsonl
- Read priors: .../research/iterations/iteration-001.md ..003.md
- Write narrative: .../research/iterations/iteration-004.md
- Write delta: .../research/deltas/iter-004.jsonl

## KNOWN CONTEXT (do not re-discover)
- Already-found (do NOT re-report): 4 P1 (tool-schemas.ts, gemini search.toml, opencode search.md, sidecar-hardening test), P2s (RerankProvider variant, vscode/devin configs, code-graph SKILL.md:52, types.ts scoringMethod, embeddings.ts comment, validate-doc-model-refs.js, sk-code code-org).
- 3-factor confidence: WEIGHT_MARGIN 0.35 + WEIGHT_CHANNEL_AGREEMENT 0.30 + WEIGHT_ANCHOR_DENSITY 0.15 = 0.80 cap; the removed WEIGHT_RERANKER was 0.20 and its term was claimed inert (always 0). VERIFY this claim empirically/by reading the math.
- KEPT exceptions (NOT misses): MMR, rescue layer, always-null trace field, PipelineRow.rerankerScore, scoringMethod field itself (only the 'cross-encoder' union variant is stale).

## CONSTRAINTS
- LEAF. No sub-agents. 3-5 actions, max 12 tool calls. You MAY run vitest via Bash (it is fast for targeted files). Write findings to files. Do NOT edit strategy/registry/dashboard.
- Empirical: prefer RUNNING the test over asserting it fails. Report actual pass/fail counts. A confirmed NO-REGRESSION is a valuable finding.

## OUTPUT CONTRACT — ALL THREE artifacts
1. Narrative `.../research/iterations/iteration-004.md` (Focus, Actions Taken, Findings [severity + evidence + REGRESSION/NO-REGRESSION/BROKEN-TEST], Questions Answered, Questions Remaining, Next Focus).
2. Append `>>` to state-log EXACT: `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}`.
3. Delta `.../research/deltas/iter-004.jsonl`: iteration line + finding/ruled_out lines.
Begin now.
