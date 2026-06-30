DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) review all prior findings, (2) determine dependency ordering, (3) define phase boundaries, (4) identify risks + rollback points, (5) compose the JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 7 of 12. FOCUS = RQ6 — SYNTHESIZE the dependency-ordered deprecation PHASE DAG from all prior findings. This is the planning output that becomes the 002+ phase children of 014.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST (this iteration is synthesis — read the prior iteration findings):
  - strategy.md (charter + Known Context)
  - iterations 001 (inventory), 002 (rerank consumers+fallback), 003 (code-graph decouple edit-set), 004 (semantic-search HYBRID policy), 005 (97 config/mirror touchpoints), 006 (28 deletion-completeness items).
- SCOPE: `.opencode/specs/**` = FROZEN. Research only — propose the plan; do NOT implement.

ACTION (pre-planned, <= 12 tool calls)
1. Read strategy.md + all 6 iteration files (they hold the classified touchpoints).
2. RQ6 — produce the deprecation PHASE DAG. Hard ordering constraint: DECOUPLE BEFORE DELETE.
   - Decouple `system-code-graph` from coco (sever ccc_* tools/routing) BEFORE deleting mcp-coco-index.
   - Remove mk-spec-memory's local cross-encoder path + flags BEFORE deleting system-rerank-sidecar.
   - Rewrite semantic-search routing docs (HYBRID policy) BEFORE/with deleting coco.
   - Delete skills + clean runtime artifacts LAST.
3. Propose concrete phase children for 014 (e.g. 002-decouple-code-graph, 003-remove-memory-rerank-path, 004-remove-rerank-sidecar-skill, 005-remove-coco-index-skill, 006-runtime-configs-4runtime-mirror, 007-docs-readme-search-routing). For EACH phase give: scope (which iter findings/files), dependencies (which phases must precede), verify gate (tests/commands), rollback point, est. file count.
4. RISK REGISTER: top risks (memory rerank regression, semantic-search vacuum, 4-runtime drift, MCP-registration breakage, daemon orphan) with mitigation per phase.
5. NEGATIVE-KNOWLEDGE list: things that look in-scope but are NOT (frozen .opencode/specs/**, already-removed cloud rerankers 022/013, shared HF model cache, code-graph structural core which stays).
6. Note gaps for iteration 8 (RQ1 dedup/completeness sweep).

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-007.md`:
   - `## Focus (RQ6)`
   - `## Phase DAG` — ordered table: `Phase | Scope | Depends on | Verify gate | Rollback | ~Files`
   - `## Ordering rationale` — why this order (decouple-before-delete)
   - `## Risk register` — table: `Risk | Phase | Impact | Mitigation`
   - `## Negative knowledge (NOT in scope)`
   - `## Gaps for next iteration`
   - Cite `[SOURCE: file:line]` or `[SOURCE: iteration-00N.md]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ6 deprecation phase DAG + ordering + risk","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~11 tool calls; stop after the two outputs.
