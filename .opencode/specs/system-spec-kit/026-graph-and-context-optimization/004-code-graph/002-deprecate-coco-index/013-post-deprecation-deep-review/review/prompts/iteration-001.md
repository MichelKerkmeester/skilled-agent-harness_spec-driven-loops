Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
You are iteration 1 of up to 14 in an autonomous deep-review loop auditing a JUST-COMPLETED deprecation for things that were MISSED or BROKEN. You are read-only except your two output files. Sequential_thinking (≥5 thoughts) is MANDATORY before you emit output.

# CONTEXT
STATE SUMMARY (review mode): Iteration 1 of 14 | Target: 014 CocoIndex/rerank-sidecar deprecation arc (track) | Dimensions 0/4 | Next: D1 correctness | Findings P0:0 P1:0 P2:0 | Verdict: PENDING

The 014 arc (~21 commits) removed `mcp-coco-index` (CocoIndex semantic code search = forked cocoindex-code + the `ccc` CLI + a `cocoindex_code` MCP server) and `system-rerank-sidecar` (FastAPI cross-encoder on port 8765), and decoupled `system-code-graph` (NOW tree-sitter only — no ccc, no `.venv`) + `system-spec-kit` (the memory MCP) from them, across 4 runtime mirrors (`.opencode` / `.claude` / `.gemini` / `.codex`). The executor's own greps had BLIND SPOTS: it searched `cocoindex` but missed the `ccc` CLI name, and scope-excluded `.gemini/`, `.codex/`, `cli-*/`. Memory search is embedder-backed hybrid (vector/bm25/fts/graph/degree) — coco coupling there was vestigial.

Full charter + all 30 review surfaces: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md` first.

KNOWN CONTEXT — 4 confirmed misses to VERIFY (re-grep, cite file:line), then EXTEND by finding adjacent/new ones:
- `.gemini/GEMINI.md:5` still routes to deleted `mcp__cocoindex_code__search` (the other routing docs `CLAUDE.md`/`AGENTS.md`/`.claude/CLAUDE.md`/`.codex/AGENTS.md` are clean).
- `.gitignore:123` `.cocoindex_code/` stale ignore entry.
- `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json` has stale `system-rerank-sidecar`/`8765` (only the `scripts/` copy was recompiled).
- `.opencode/commands/memory/manage.md` declares the `ccc <status|reindex|feedback>` subcommand + a CCC MODE section for removed `ccc_*` tools.

# ACTION — iteration 1 = dimension D1 CORRECTNESS over cluster A (reference completeness, surfaces 1-5). Execute in order:
1. Verify the 4 known misses: grep/read each, confirm exact file:line + classify severity (P0 = would cause a runtime tool-not-found or wrong routing for a user; P1 = stale live config/command; P2 = advisory). Acceptance: each confirmed-or-refuted with the grep output as evidence.
2. EXTEND the alias sweep in the dirs the executor EXCLUDED — `.gemini/`, `.codex/`, `cli-*/`, and any hidden config dirs — for: `cocoindex`, `CocoIndex`, `cocoindex_code`, `mcp__cocoindex_code`, bare `ccc ` + subcommands (index|search|mcp|run-daemon|reset|init|status|reindex|feedback), `ccc_status|ccc_reindex|ccc_feedback`, `8765`. Acceptance: a deduped list of NEW live references with file:line. EXCLUDE (do not report): `**/changelog/**`, `**/dist/**`, `**/benchmarks/**`, `**/specs/**`, `**/node_modules/**`, and the DOCUMENTED EXCEPTIONS (`process-memory-harness.ts`/`process-sweep.vitest.ts`, `embedder_pluggability.md` §3 which carries an obsolescence banner, `F-AC3-*.json`/`409-fixture.json` test-query fixtures, cli-* `pkill ccc search` cleanup lines).
3. Check the runtime/DB JSON (surface 5): `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json`, `.../mcp_server/database/.doctor-update.last-run.json`, `.utcp_config.json`. Report coco refs per file with line numbers.

# FORMAT
Write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-001.md` with:
```
## Iteration 1 — D1 Correctness / Reference Completeness
### Dimensions covered: correctness
### Files reviewed: <file:line list you actually examined>
### Findings
- **F-P{0|1|2}-001** [P0|P1|P2] <title> — `path:line` — Evidence: <the exact grep/read output> — Recommendation: <one line>
- ... (one bullet per finding)
### Claim-adjudication packets (one per P0/P1 finding)
- findingId: F-..., claim: "...", evidenceRefs: ["path:line"], counterevidenceSought: "...", alternativeExplanation: "...", finalSeverity: P{0|1}, confidence: 0.NN, downgradeTrigger: "..."
### Next focus: <dimension + surfaces for iteration 2>
Review verdict: PASS|CONDITIONAL|FAIL
```
THEN append exactly ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-001.jsonl`:
`{"type":"iteration","iteration":1,"mode":"review","dimensions":["correctness"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":N,"newFindingsRatio":0.NN,"status":"complete","findingDetails":[{"id":"F-...","severity":"P1","title":"...","dimension":"correctness","file":"path:line","evidence":"...","recommendation":"..."}],"timestamp":"<ISO8601>"}`

CONSTRAINTS: read-only (never modify a reviewed file); do NOT fix anything (this is review, not remediation); do NOT dispatch sub-agents; sequential_thinking ≥5 thoughts before output.
