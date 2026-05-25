DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) pre-plan what to read, (2) read the evidence, (3) extract findings with file:line citations, (4) identify gaps for the next iteration, (5) compose the JSONL iteration record. Only then emit the output files.

CONTEXT
- Topic: Map every LIVE touchpoint for deprecating `mcp-coco-index` + `system-rerank-sidecar` and decoupling `system-code-graph` from CocoIndex.
- Iteration: 2 of 12. FOCUS = RQ2 (rerank-sidecar consumers + the mk-spec-memory fallback) — the most dangerous coupling. Secondary: open RQ3 (code-graph decouple edit-set).
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST, in order:
  - .../014-deprecate-coco-index/001-touchpoint-research/research/deep-research-strategy.md (charter + Known Context + Next Focus)
  - .../014-deprecate-coco-index/001-touchpoint-research/research/iterations/iteration-001.md (ALREADY-MAPPED inventory — treat as known; do NOT re-list those rows)
  - .../014-deprecate-coco-index/001-touchpoint-research/research/deep-research-state.jsonl
- EXCLUSION SET: iteration-001.md already mapped 30+ touchpoints. Add only NET-NEW touchpoints or DEEPER detail; do not repeat rows already there.
- SCOPE BOUNDARY: `.opencode/specs/**` = FROZEN (LEAVE-historical, never edit). LIVE surface only.

ACTION (pre-planned, <= 12 tool calls)
1. Read strategy.md + iteration-001.md + state.jsonl.
2. RQ2 — trace EVERY consumer of `system-rerank-sidecar` with file:line:
   - `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` — the `local` provider branch (where it calls the sidecar over HTTP).
   - `.opencode/bin/lib/ensure-rerank-sidecar.cjs` + any launcher wiring (`mk-spec-memory-launcher.cjs`) that spawns/ensures the sidecar.
   - Flag plumbing: `SPECKIT_CROSS_ENCODER`, `RERANKER_LOCAL` — where read/defaulted (ENV_REFERENCE.md, opencode.json notes, config resolution code).
   - Reaper/telemetry references (sidecar-reaper.jsonl, owner-death checks).
   - Confirm or refute: is mk-spec-memory the ONLY non-coco consumer? Grep for other HTTP callers of localhost:8765 / the sidecar.
3. DECIDE + record: exactly what mk-spec-memory LOSES when the sidecar is removed (cross-encoder rerank entirely?), and the SAFE FALLBACK (what reranking/scoring path remains — RRF/vector-only? what does cross-encoder.ts do when `local` is unavailable today?). Cite the code path that determines the fallback.
4. RQ3 seed — list the `system-code-graph` files that register/route to coco (ccc_* tool schemas, classifier, bridge handlers) with file:line, for the next iteration to detail.
5. Note gaps for iteration 3.

FORMAT (write exactly these two, then exit)
A) Write `.../014-deprecate-coco-index/001-touchpoint-research/research/iterations/iteration-002.md`:
   - `## Focus (RQ2 primary, RQ3 seed)`
   - `## Rerank-sidecar consumers` — table: `File (file:line) | Role | Mutation Class | Note`
   - `## What mk-spec-memory loses + safe fallback` — explicit decision with cited code path
   - `## RQ3 seed: code-graph→coco registration points` — file:line list
   - `## Gaps for next iteration`
   - Every claim cites `[SOURCE: file:line]`.
B) Append ONE line to `.../014-deprecate-coco-index/001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ2 rerank-sidecar consumers + memory fallback","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only; do NOT edit source/config/spec.
- Never edit `.opencode/specs/**`. Stay within ~10 tool calls; stop after the two outputs.
