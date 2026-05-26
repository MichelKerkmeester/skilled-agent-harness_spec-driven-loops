DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) plan the dynamic/runtime hunt, (2) gather evidence, (3) verify couplings, (4) flag residual risk, (5) compose the JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 9 of 12. FOCUS = what STATIC grep MISSES — runtime/dynamic references + final coupling verification. (iter-8 newInfoRatio was 0.07; static inventory is near-complete, so hunt the non-obvious.)
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: iterations 001-008 (esp. 007 phase DAG, 008 reconciled totals).
- SCOPE: `.opencode/specs/**` = FROZEN.

ACTION (pre-planned, <= 12 tool calls)
1. Skim iters 007-008 for the current map + residual gaps.
2. Hunt DYNAMIC / RUNTIME couplings that text-grep on skill names misses:
   - Runtime imports/requires of coco/sidecar code: `rg "require\(|from ['\"].*(cocoindex|rerank|ensure-rerank)" ` across `.opencode/skills/system-spec-kit`, `.opencode/bin`, `.opencode/skills/system-code-graph` (live dirs only).
   - MCP tool DISCOVERY at runtime (tools resolved by name, not literal string) — e.g. launcher tool registration, `mcp__cocoindex_code__*` dynamic refs.
   - skill-advisor `enhances` edges: which `graph-metadata.json` files declare edges to/from `mcp-coco-index`/`system-rerank-sidecar`, and does removing them require `skill_graph_compiler.py --export-json` recompile + the compiled `skill-graph.json` regeneration? (iter-8 flagged this.)
   - code-graph readiness/boundary: does `code-graph-boundary.ts` or readiness code call `ccc_*` at runtime (not just schema)?
   - any health/doctor check that probes `localhost:8765` or the coco daemon at runtime.
3. FINAL VERIFICATION of the 2 dangerous couplings — confirm with a fresh read that (A) memory's only sidecar tie is the `local` cross-encoder provider + ensure helper (no other runtime path), and (B) code-graph's only coco tie is the ccc_* tools + classifier routing (no hidden runtime dependency). State CONFIRMED or list residual risk.
4. Note residual gaps + the explicit list of open uncertainties to hand to the deepseek adversarial closers (iters 11-12).

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-009.md`:
   - `## Focus (dynamic/runtime + final coupling verification)`
   - `## Dynamic/runtime touchpoints grep missed` — table: `File (file:line) | Mechanism | Mutation Class | Phase | Note`
   - `## Coupling verification` — A + B: CONFIRMED or residual risk, with evidence
   - `## skill-graph recompile requirement` — what must run after edge removal
   - `## Open uncertainties for deepseek closers`
   - Cite `[SOURCE: file:line]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"complete","focus":"dynamic/runtime refs + final coupling verification","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~11 tool calls; stop after the two outputs.
