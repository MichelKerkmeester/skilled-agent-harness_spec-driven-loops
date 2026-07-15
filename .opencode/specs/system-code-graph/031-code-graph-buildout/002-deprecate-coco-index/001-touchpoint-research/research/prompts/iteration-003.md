DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) pre-plan what to read, (2) read the evidence, (3) extract findings with file:line citations, (4) identify gaps, (5) compose the JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 3 of 12. FOCUS = RQ3 — the PRECISE edit-set to decouple `system-code-graph` from CocoIndex while keeping the structural skill green.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: strategy.md (Known Context), iteration-001.md + iteration-002.md (already-mapped inventory — RQ3 seed is in iter-002's last section). Treat prior rows as known; add NET-NEW detail only.
- SCOPE: `.opencode/specs/**` = FROZEN. Goal of THIS skill: KEEP `system-code-graph`, only sever its CocoIndex coupling.

ACTION (pre-planned, <= 12 tool calls)
1. Read strategy.md + iteration-002.md "RQ3 seed" section.
2. Enumerate the EXACT decouple edit-set in `.opencode/skills/system-code-graph/` with file:line + the surgical change per file:
   - `mcp_server/tool-schemas.ts` — the `ccc_status`/`ccc_reindex`/`ccc_feedback` schema entries (CODE_GRAPH_TOOL_SCHEMAS): which entries to remove (11 tools -> 8).
   - `mcp_server/tools/code-graph-tools.ts` — the ccc_* registration/dispatch.
   - the ccc_* HANDLER files (grep for ccc_status/ccc_reindex/ccc_feedback handler impls).
   - `mcp_server/lib/query-intent-classifier.ts` (or wherever `code_graph_classify_query_intent` lives) — the semantic/hybrid -> coco routing branch to neutralize (route to structural-only or "no semantic backend").
   - `references/integrations/ccc_bridge_integration.md` — DELETE.
   - SKILL.md — glossary "Semantic search (CocoIndex)", router pseudocode CCC intent, "When NOT to use -> mcp-coco-index", Tool Dispatch Contract ccc rows: EDIT-decouple list with line refs.
   - `mcp_server/lib/shared/cocoindex-path.ts` + `mcp_server/handlers/query.ts:424-425` + the CCC bridge tests (`code-graph-siblings-readiness.vitest.ts`) — classify + note what each becomes.
   - `system-spec-kit/mcp_server/lib/code-graph-boundary.ts` — does it expose any ccc surface? Check + classify.
3. Determine the VERIFY gate: which test files / build commands must pass after decoupling to prove code-graph is still green (e.g., code-graph vitest suites minus the ccc tests).
4. Note gaps for iteration 4.

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-003.md`:
   - `## Focus (RQ3)`
   - `## Code-graph decouple edit-set` — table: `File (file:line) | Current coco coupling | Surgical change | Mutation Class`
   - `## Tool count` — confirm 11 -> 8 with the removed tool ids
   - `## Verify gate` — tests/commands that prove code-graph stays green post-decouple
   - `## Gaps for next iteration`
   - Every claim cites `[SOURCE: file:line]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ3 code-graph decouple edit-set","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~10 tool calls; stop after the two outputs.
