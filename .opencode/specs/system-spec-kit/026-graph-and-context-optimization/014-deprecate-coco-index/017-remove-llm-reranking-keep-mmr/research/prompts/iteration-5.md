DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

LEAF deep-research agent. Iteration 5 of 10 (likely final — Q5 closes the question set). Report findings only; do NOT implement fixes. Build on iters 1-4.

## STATE

STATE SUMMARY:
Segment 1 | Iteration 5 of 10
Q1-Q4 answered. Q5 (THIS) is the last open question → answering it should trigger convergence.
Last 2 ratios: 0.40 -> 0.35 | Stuck count: 0
Next focus: Q5 final comprehensive doc sweep + close the command-mirror pattern.

Research Topic: What did the 014 CocoIndex + LLM-reranker deprecation arc miss?
Iteration: 5 of 10
Focus Area: Q5 — FINAL COMPREHENSIVE DOC SWEEP. Two parts:
  (a) CLOSE THE COMMAND-MIRROR PATTERN: iters 2-3 found stale cross-encoder docs in the Gemini (`.gemini/commands/memory/search.toml`) AND OpenCode (`.opencode/commands/memory/search.md`) `/memory:search` command prompts. Check the OTHER runtime mirrors of the SAME command family for the same staleness: `.codex/` and `.claude/` `/memory:search` (or memory/search command files if they exist), AND the sibling memory commands across ALL 4 runtimes (`memory/context`, `memory/manage`) for stale cross-encoder/getRerankerStatus/cocoindex claims. Determine the FULL blast radius of the command-prompt staleness.
  (b) SWEEP-FOR-COMPLETENESS: grep all live docs (`.opencode/skills/**/*.md` references/SKILL/changelog excluded only where clearly historical, `.opencode/specs/**` current packets, root *.md) for cross-encoder/cocoindex/`getRerankerStatus`/`rerank-2.5`/`CodeRankEmbed`-as-default claims NOT already catalogued in iters 1-4. Classify each: REPAIRABLE-STALE (live doc, wrong, fixable) vs INTENTIONAL-HISTORICAL (changelog/benchmark/decision-record/z_archive — leave).
  Goal: a COMPLETE catalogue so the remediation packet has the full list. Do NOT re-report the 4 P1 + ~8 P2 already found; find what's LEFT.

Remaining Key Questions: Q5 (THIS — last one).
Last 3 Iterations Summary: iter2 4-runtime/config (0.50) gemini search.toml P1; iter3 capability-gap (0.40) opencode search.md P1 + 6 stranded promises; iter4 regressions (0.35) BROKEN-TEST confirmed (3 fail) + NO-REGRESSION across pipeline/workflows/confidence-math.

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-state.jsonl
- Read priors: .../research/iterations/iteration-001.md ..004.md
- Write narrative: .../research/iterations/iteration-005.md
- Write delta: .../research/deltas/iter-005.jsonl

## KNOWN CONTEXT — already-catalogued (do NOT re-report; find what's LEFT)
- P1: tool-schemas.ts rerank desc; .gemini/commands/memory/search.toml; .opencode/commands/memory/search.md; sidecar-hardening.vitest.ts:545 (broken test, 3 fails).
- P2: stage3-rerank.ts RerankProvider variant+JSDoc; .vscode/mcp.json + .devin/config.json (39 tools + Voyage rerank-2.5); system-code-graph/SKILL.md:52 self-contradiction; shared/types.ts scoringMethod 'cross-encoder' union; shared/embeddings.ts:43 stale comment; sk-doc validate-doc-model-refs.js cross-encoder paths; sk-code code_organization.md:492 deleted-file tree.
- INFO/kept: registry.ts local mapping (w/ context comment), always-null trace field, hybrid-search.vitest.ts stale env setup, doctor-update.last-run.json log, eval ground-truth queries, stress corpus rerank-gate, frozen benchmarks, z_archive, changelogs.
- VERIFIED NO-REGRESSION: pipeline/confidence/workflows clean; confidence 0.20 weight inert.

## CONSTRAINTS
- LEAF. No sub-agents. 3-5 actions, max 12 tool calls. Write findings to files. Do NOT edit strategy/registry/dashboard.
- Cross-check every hit against the already-catalogued + KEPT lists before reporting — only NEW items.

## OUTPUT CONTRACT — ALL THREE artifacts
1. Narrative `.../research/iterations/iteration-005.md` (Focus, Actions Taken, Findings [severity + file:line + REPAIRABLE-STALE/INTENTIONAL-HISTORICAL], Questions Answered, Questions Remaining, Next Focus). Include a short "command-mirror blast radius" summary table (which of the 4 runtimes' memory/search|context|manage commands are stale vs clean).
2. Append `>>` to state-log EXACT: `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}`.
3. Delta `.../research/deltas/iter-005.jsonl`: iteration line + finding/ruled_out lines.
Begin now.
