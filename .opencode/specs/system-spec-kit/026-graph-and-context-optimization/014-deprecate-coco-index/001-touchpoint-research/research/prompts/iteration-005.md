DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) pre-plan, (2) read evidence, (3) extract findings with file:line, (4) gaps, (5) compose JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 5 of 12. FOCUS = RQ5 — every runtime CONFIG + the 4-runtime mirror (.opencode / .claude / .gemini / .codex) multiplier.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: strategy.md, iterations 001-004 (known inventory — add NET-NEW only; iter-001 already listed opencode.json/.vscode/.codex MCP blocks, so go DEEPER: exact JSON/TOML key paths + the mirror multiplier).
- SCOPE: `.opencode/specs/**` = FROZEN.

ACTION (pre-planned, <= 12 tool calls)
1. Read strategy.md + scan iterations 001-004 for already-mapped config rows.
2. RQ5 — enumerate the FULL config + mirror surface with file:line and exact key path:
   - MCP registration blocks for `cocoindex_code`: `opencode.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `.codex/config.toml` — exact block line ranges + whether the rerank-sidecar env (RERANK_SIDECAR_PORT / SPECKIT_CROSS_ENCODER / RERANKER_LOCAL notes) lives in opencode.json's mk-spec-memory env block (_NOTE_8/_NOTE_9).
   - The 4-runtime AGENT mirror: for any agent that references coco/cocoindex (e.g. context, deep-review), list the parallel files: `.opencode/agents/*.md`, `.claude/agents/*.md`, `.gemini/agents/*.md`, `.codex/agents/*.toml`. Confirm which mirrors exist for each.
   - The 4-runtime COMMAND mirror: deep/speckit/doctor/memory commands referencing coco across `.opencode/commands/`, `.claude/commands/`, `.gemini/commands/*.toml`, `.codex/` — list parallels.
   - `.gemini/commands/*` and `.gemini/settings.json` cocoindex refs (iter-001 noted .gemini hits — enumerate them).
   - README.md, `.opencode/install_guides/*`, `.gitignore` coco/ccc/.cocoindex_code refs (file:line).
3. Produce the x4 MULTIPLIER table: per logical edit, how many physical files across runtimes.
4. Note gaps for iteration 6.

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-005.md`:
   - `## Focus (RQ5)`
   - `## Config + mirror touchpoints` — table: `File (file:line) | Key path / block | Runtime | Mutation Class | Note`
   - `## 4-runtime mirror multiplier` — table: `Logical edit | Physical files (count) | Runtimes`
   - `## Gaps for next iteration`
   - Every claim cites `[SOURCE: file:line]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ5 4-runtime mirror + configs","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~10 tool calls; stop after the two outputs.
