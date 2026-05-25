DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) plan the completeness sweep, (2) run the greps, (3) diff against prior inventory, (4) flag misses/dups, (5) compose the JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 8 of 12. FOCUS = RQ1 COMPLETENESS + DEDUP sweep — find LIVE touchpoints the focused RQ passes (iters 1-7) may have missed, and dedup the inventory.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: iterations 001-007 (the accumulated classified inventory + phase DAG).
- SCOPE: `.opencode/specs/**` = FROZEN (LEAVE-historical, exclude from greps).

ACTION (pre-planned, <= 12 tool calls)
1. Skim iterations 001-007 to build the set of ALREADY-MAPPED live files.
2. Run COMPLETENESS greps over the LIVE surface, EXCLUDING `.opencode/specs/**`, node_modules, .venv, .git, __pycache__:
   - `rg -l -i 'cocoindex|coco-index|mcp-coco-index'` then subtract already-mapped.
   - `rg -l 'ccc_status|ccc_reindex|ccc_feedback|classify_query_intent'`.
   - `rg -l 'rerank.?sidecar|rerank_sidecar|RERANK_SIDECAR|SPECKIT_CROSS_ENCODER|RERANKER_LOCAL|localhost:8765|8765'`.
   - `rg -l 'COCOINDEX_|ccc mcp|ccc search|ccc index|ccc status'`.
   - Check easy-to-miss spots: `.opencode/skills/*/graph-metadata.json` (skill-advisor enhances edges to mcp-coco-index), `skill-graph` compiled json, `descriptions.json`, hooks, `package.json`/lockfiles, `.opencode/plugin*`, sk-code/sk-doc references.
3. Produce a DELTA list: NET-NEW live files not in iters 001-007, each classified. And a DUP/correction list (any prior row that was wrong or duplicated).
4. Reconcile the TOTAL live touchpoint count + sanity-check the iter-007 phase DAG file-count estimates (flag any phase whose count looks off).
5. Note residual gaps for iteration 9.

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-008.md`:
   - `## Focus (RQ1 completeness + dedup)`
   - `## Net-new live touchpoints` — table: `File (file:line) | Token | Mutation Class | Phase | Note`
   - `## Corrections / dedup` — any prior-row fixes
   - `## Reconciled totals` — total live touchpoints + per-phase count check vs iter-007
   - `## Gaps for next iteration`
   - Cite `[SOURCE: file:line]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ1 completeness + dedup sweep","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~11 tool calls; stop after the two outputs.
