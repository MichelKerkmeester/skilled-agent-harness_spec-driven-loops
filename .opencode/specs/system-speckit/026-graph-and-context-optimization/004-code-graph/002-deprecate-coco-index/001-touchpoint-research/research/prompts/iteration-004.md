DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) pre-plan, (2) read evidence, (3) extract findings with file:line, (4) identify gaps, (5) compose the JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 4 of 12. FOCUS = RQ4 — the semantic-search VACUUM left when CocoIndex is removed, and the replacement policy.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: strategy.md (Known Context), iterations 001-003 (known inventory — add NET-NEW only).
- SCOPE: `.opencode/specs/**` = FROZEN.

ACTION (pre-planned, <= 12 tool calls)
1. Read strategy.md + scan iterations 001-003 headers for what's already mapped.
2. RQ4 — enumerate EVERY live route that directs "find code by concept / semantic / how-does-X-work" to CocoIndex, with file:line:
   - Global `CLAUDE.md` SEARCH ROUTING + the CODE SEARCH DECISION TREE (CocoIndex triggers block).
   - `.claude/CLAUDE.md` SEARCH ROUTING line.
   - `AGENTS.md` tool-routing / decision tree.
   - `.opencode/agents/context.md` and `.opencode/agents/deep-review.md` (cocoindex usage).
   - `.opencode/commands/deep/*` allowed-tools + body refs to `mcp__cocoindex_code__search`.
   - Any sk-code / system-spec-kit reference that routes search to coco.
   - The `code_graph_classify_query_intent` "semantic"/"hybrid" verdict (what it tells callers to do).
3. For each route: state what BREAKS when coco is gone (broken tool ref, dangling instruction, dead decision-tree branch).
4. REPLACEMENT POLICY — present 3 options with pros/cons + a RECOMMENDATION:
   (a) DROP semantic code search — rely on code-graph structural + Grep/Glob only.
   (b) REPOINT concept search to `memory_search` (note: that indexes spec-docs/memory, not arbitrary code).
   (c) HYBRID — Grep + code-graph structural as the documented path; concept queries fall back to grep.
   Recommend one and say exactly which docs/routes each phase must rewrite.
5. Note gaps for iteration 5.

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-004.md`:
   - `## Focus (RQ4)`
   - `## Semantic-search routes to coco` — table: `File (file:line) | Route/Instruction | What breaks | Mutation Class`
   - `## Replacement policy options` — (a)/(b)/(c) with pros/cons
   - `## Recommendation` — chosen policy + the doc rewrite list
   - `## Gaps for next iteration`
   - Every claim cites `[SOURCE: file:line]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ4 semantic-search vacuum + replacement policy","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~10 tool calls; stop after the two outputs.
