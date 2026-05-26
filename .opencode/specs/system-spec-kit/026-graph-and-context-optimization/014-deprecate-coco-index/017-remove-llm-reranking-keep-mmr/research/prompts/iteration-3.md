DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

LEAF deep-research agent. Iteration 3 of 10. Report findings only; do NOT implement fixes. Build on iters 1-2.

## STATE

STATE SUMMARY:
Segment 1 | Iteration 3 of 10
Q1 mostly answered (iter1), Q2 answered (iter2). Q3/Q4/Q5 remain.
Last 2 ratios: 0.45 -> 0.50 | Stuck count: 0
Next focus: Q3 capability-gap assessment.

Research Topic: What did the 014 CocoIndex + LLM-reranker deprecation arc miss?
Iteration: 3 of 10
Focus Area: Q3 — CAPABILITY-GAP ASSESSMENT. The deprecation removed two capabilities: (1) CocoIndex semantic/vector CODE search (find-code-by-concept over embeddings), replaced by HYBRID code-graph (tree-sitter structural: callers/imports/symbols/outlines) + Grep (exact/regex). (2) the LLM cross-encoder reranker (relevance re-scoring of memory-search candidates), replaced by algorithmic MMR diversity reranking + the ADR-011 retrieval-rescue layer. Assess:
  (a) Does code-graph + Grep actually cover "find code by concept/intent" (the cocoindex use case), or is there a genuine user-facing gap? Look at the routing docs (CLAUDE.md/AGENTS.md code-search decision tree, sk-code, system-code-graph SKILL.md) — do they still promise or imply semantic code search that no longer exists? Does any code/agent/command still CALL a removed semantic-search tool (e.g. `mcp__cocoindex_code__search`) expecting results?
  (b) Does MMR (diversity) + rescue-layer adequately replace the cross-encoder (relevance)? Is there a documented quality regression, or a doc that still claims reranker-driven relevance gains the system no longer delivers?
  (c) Surface any FLAG/FEATURE/DOC that still promises the removed capability and would now silently no-op or mislead (beyond the tool-schemas.ts + gemini search.toml already found).
This is analytical: read the routing/decision docs + the code-search call sites, reason about coverage, cite evidence. Classify each gap as REAL-GAP (capability lost, not covered) vs COVERED (replacement adequate) vs STRANDED-PROMISE (doc/flag promises removed capability).

Remaining Key Questions: Q3 (THIS), Q4 (regressions), Q5 (docs).
Last 3 Iterations Summary: iter1: live-code sweep (0.45) — 2 P1 + 2 P2; iter2: 4-runtime/non-obvious sweep (0.50) — P1 gemini search.toml + 2 P2 stale MCP configs + verified P1 test; 16 surfaces clean.

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/research/deep-research-state.jsonl
- Read priors: .../research/iterations/iteration-001.md, iteration-002.md
- Write narrative: .../research/iterations/iteration-003.md
- Write delta: .../research/deltas/iter-003.jsonl

## KNOWN CONTEXT (do not re-discover)
- D1 (decision): memory search loses the LLM reranker; MMR (SPECKIT_MMR) + ADR-011 rescue layer remain. D2: HYBRID (code-graph + Grep) replaces cocoindex semantic code search.
- system-code-graph is tree-sitter STRUCTURAL only (no embeddings) — it does NOT do semantic/embedding code search. Grep does exact/regex. So "find code by concept" via embeddings is GONE; the replacement is structural+lexical.
- Already-found stranded promises (do NOT re-report): tool-schemas.ts rerank desc (P1), gemini search.toml cross-encoder docs (P1), .vscode/.devin stale 39-tools+Voyage (P2), RerankProvider variant+JSDoc (P2).
- KEPT exceptions (NOT misses): MMR, rescue layer, frozen benchmarks, z_archive, embedder_pluggability decision rationale.

## CONSTRAINTS
- LEAF. No sub-agents. 3-5 actions, max 12 tool calls. Write findings to files. Do NOT edit strategy/registry/dashboard.
- Evidence-based: cite file:line. Distinguish a REAL capability gap from a cosmetic stranded-promise. Don't manufacture a gap if the replacement genuinely covers the use case — "COVERED" is a valid, valuable answer.

## OUTPUT CONTRACT — ALL THREE artifacts
1. Narrative `.../research/iterations/iteration-003.md` (Focus, Actions Taken, Findings [severity + file:line + evidence + REAL-GAP/COVERED/STRANDED-PROMISE], Questions Answered, Questions Remaining, Next Focus).
2. Append `>>` to state-log EXACT: `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}`.
3. Delta `.../research/deltas/iter-003.jsonl`: iteration line + one finding/ruled_out line each.
Begin now.
