DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) pre-plan what to read, (2) read the evidence, (3) extract classified findings with file:line citations, (4) identify gaps for the next iteration, (5) compose the JSONL iteration record. Only after these 5 thoughts emit the output files.

CONTEXT
- Topic: Map every LIVE touchpoint for deprecating `mcp-coco-index` + `system-rerank-sidecar` and decoupling `system-code-graph` from CocoIndex, into a classified resource map + a dependency-ordered deprecation phase DAG.
- Iteration: 1 of 12. FOCUS this iteration = RQ1: seed the exhaustive LIVE-reference inventory.
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST (state continuity), in order:
  - .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/deep-research-strategy.md  (charter, Known Context, Next Focus)
  - .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/deep-research-state.jsonl
- SCOPE BOUNDARY (critical): files under `.opencode/specs/**` are FROZEN historical records — class = LEAVE-historical; never propose editing them. The LIVE surface to classify = the three skills (`.opencode/skills/mcp-coco-index`, `.opencode/skills/system-rerank-sidecar`, `.opencode/skills/system-code-graph`), the `system-spec-kit` skill, commands under `.opencode/commands/{create,speckit,doctor,deep,memory}`, agents, hooks, and runtime configs (`opencode.json`, `.vscode/mcp.json`, `.gemini/`, `.claude/`, `.codex/`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `.opencode/install_guides/`).
- KNOWN COUPLINGS (verify with evidence, do not re-derive from scratch):
  - (A) `system-rerank-sidecar` is consumed by `mk-spec-memory` via `mcp_server/lib/search/cross-encoder.ts` `local` provider (opt-in `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true`) and the ensure helper `bin/lib/ensure-rerank-sidecar.cjs`.
  - (B) `system-code-graph` is bound to CocoIndex via `ccc_status`/`ccc_reindex`/`ccc_feedback` MCP tools, `code_graph_classify_query_intent` semantic/hybrid routing, and `references/integrations/ccc_bridge_integration.md`.

ACTION (pre-planned, <= 12 tool calls total)
1. Read strategy.md + state.jsonl to confirm focus and known context.
2. Enumerate LIVE references using `rg` for these spellings: `mcp-coco-index`, `cocoindex`, `cocoindex_code`, `\bccc\b`, `system-rerank-sidecar`, `rerank_sidecar`, `COCOINDEX_RERANK_VIA_SIDECAR`. EXCLUDE `.opencode/specs/**`, `node_modules`, `.venv`, `.git`, `__pycache__`. Group hits by file.
3. Open the top LIVE files (the 3 skills, runtime configs, commands, agents, hooks) and assign each a mutation class: DELETE | EDIT-decouple | EDIT-remove-ref | LEAVE-historical. Cite file:line.
4. Record gaps to hand to iteration 2 (which RQ1 areas remain; which RQ2/RQ3 threads opened).

FORMAT (write exactly these two outputs, then exit)
A) Write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/iterations/iteration-001.md` containing:
   - `## Focus (RQ1)` — one line
   - `## Classified Live Touchpoints` — a table with columns: `File (file:line) | Token(s) | Mutation Class | Note`
   - `## Graph edges discovered` — optional `node:` / `edge:` lines for couplings found
   - `## Gaps for next iteration`
   - Every factual claim cites `[SOURCE: file:line]`.
B) Append ONE line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":1,"newInfoRatio":0.9,"status":"complete","focus":"RQ1 live-reference inventory seed","novelty":"<one sentence on what is newly mapped>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files above. Do NOT edit any source, config, or spec file — report findings only.
- Never edit anything under `.opencode/specs/**` (frozen historical).
- Stay within ~10 tool calls. Stop immediately after writing the two outputs.
