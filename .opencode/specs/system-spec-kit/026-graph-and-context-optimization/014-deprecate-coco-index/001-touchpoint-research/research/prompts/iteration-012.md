DEEP-RESEARCH (ADVERSARIAL CROSS-MODEL VALIDATION — PASS 2 / FINAL)

ROLE
You are a DeepSeek-v4 worker running the FINAL adversarial + hardening pass. Pass 1 (iteration-011.md) found 3 CRITICAL + 2 MEDIUM + 4 LOW gaps. Your job: ENUMERATE the gaps precisely (especially the ~40 YAML assets), verify each with file:line, and produce the CORRECTED phase DAG + a final completeness verdict. Reason carefully before writing. Read-only except the two output files.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 12 of 12 (FINAL — second DeepSeek closer).
- cwd via --dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST:
  - .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/iterations/iteration-011.md (your pass-1 gap list)
  - .../iterations/iteration-007.md (original 8-phase DAG)
  - .../iterations/iteration-010.md (consolidation)
- SCOPE: `.opencode/specs/**` = FROZEN.

TASKS (<= 14 tool calls)
1. ENUMERATE the YAML workflow assets that hardcode the coco MCP tool — run:
   `rg -l "mcp__cocoindex_code__search|cocoindex_code__search|cocoindex_code" .opencode/commands .opencode/skills -g '*.yaml' -g '*.yml'` (exclude `.opencode/specs/**`). List EACH file + the matching line(s). This is the missing Phase-007 (or Phase-006) inventory pass-1 only estimated as "~40".
2. PIN the other pass-1 gaps with exact file:line: the `_routes.yaml` coco doctor route + stale comment, `orphan-mcp-sweeper.sh` 8765 probe, feature_catalog CCC files (3), `mk-code-index-launcher.cjs` COCOINDEX_BIN_PATH, `mk-skill-advisor-launcher.cjs` RERANK_SIDECAR_PORT.
3. CORRECTED PHASE DAG: restate the phase DAG with pass-1 fixes applied (doctor `_routes.yaml` route → Phase 002; YAML-asset rewrite → expanded Phase 006/007; sweeper + route manifest → Phase 006/008). Note any phase whose file count materially changes.
4. FINAL VERDICT: is the map now COMPLETE+CORRECT and ready to scaffold the deprecation phases? Any residual risk?

FORMAT (write exactly these two, then exit)
A) Write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/iterations/iteration-012.md`:
   - `## Focus (DeepSeek adversarial validation, pass 2 / final)`
   - `## YAML assets hardcoding the coco MCP tool` — full enumerated list (file:line)
   - `## Pass-1 gaps pinned` — table: `Gap | file:line | Phase | Fix`
   - `## Corrected phase DAG` — the final ordered phase list with fixes folded in
   - `## Final verdict` — COMPLETE+CORRECT (ready to scaffold) or residual risk
   - Every claim cites `[SOURCE: file:line]`.
B) Ensure the state-log ends with a newline, then append ONE new line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":12,"newInfoRatio":<0..1>,"status":"complete","focus":"DeepSeek adversarial validation pass 2 final","novelty":"<one sentence>","executor":{"kind":"cli-opencode","model":"deepseek/deepseek-v4-pro","reasoningEffort":"high"},"timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two output files. Report findings only; do NOT edit source/config/spec.
- Never edit `.opencode/specs/**`.
