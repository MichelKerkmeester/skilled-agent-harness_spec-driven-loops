ROLE
Senior engineer removing a now-DELETED skill (mcp-coco-index) + a deleted sidecar from the skill-advisor routing engine and cleanup scripts. Spec folder: `.../014-deprecate-coco-index/008-runtime-artifacts-cleanup` (pre-approved, skip Gate 3). Load `sk-code`.

CONTEXT
`mcp-coco-index` + `system-rerank-sidecar` skills are DELETED. The skill-advisor still SCORES and ROUTES to mcp-coco-index (graph edges, scorer fixtures, lanes, skill_advisor.py, doc) — so it would recommend a non-existent skill. Cleanup/doctor scripts still probe the deleted sidecar. Remove all of it. Keep advisor tests green.

ACTION
1. **system-skill-advisor** — remove every `mcp-coco-index` / `cocoindex` reference:
   - `graph-metadata.json`: drop mcp-coco-index from any `enhances`/`related_to`/`depends_on` edges.
   - scorer fixtures: `mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts`, `harder-intent-prompt-corpus.ts`, `mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl`, `mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` — remove or relabel the test cases whose expected skill is `mcp-coco-index` (route them to `system-code-graph`/Grep where the intent is code search, or drop coco-specific cases).
   - scorer code: `mcp_server/lib/scorer/lanes/explicit.ts`, `lexical.ts`, `mcp_server/lib/scorer/fusion.ts`, `mcp_server/lib/embedders/schema.ts`, `mcp_server/scripts/skill_advisor.py` — remove hardcoded `mcp-coco-index`/`cocoindex` strings/branches.
   - tests: `mcp_server/tests/compat/shim.vitest.ts`, `mcp_server/tests/scorer/semantic-lane-promotion.vitest.ts` — update/remove coco cases so the suite stays green.
   - docs: `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `references/graph/skill_graph_query_cookbook.md` — remove coco mentions.
   - Do NOT hand-edit the compiled `mcp_server/scripts/skill-graph.json` (the orchestrator recompiles it after your edits).
2. **enhances edges in other skills**: `.opencode/skills/deep-research/graph-metadata.json` + `.opencode/skills/mcp-code-mode/graph-metadata.json` — drop mcp-coco-index from `enhances`/`related_to`.
3. **scripts**: `.opencode/scripts/orphan-mcp-sweeper.sh` (remove the `rerank_sidecar:app` process match, the `:8765` lsof probe, and the `ORPHAN_PRESERVE_RERANK_SIDECAR` logic — the sidecar is gone); `.opencode/commands/doctor/scripts/mcp-doctor.sh` (remove the CocoIndex/ccc doctor check); `.github/hooks/scripts/session-start.sh` (remove the cocoindex reference).

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED: `.opencode/skills/system-skill-advisor/**` (EXCEPT `**/changelog/**`), `.opencode/skills/deep-research/graph-metadata.json`, `.opencode/skills/mcp-code-mode/graph-metadata.json`, `.opencode/scripts/orphan-mcp-sweeper.sh`, `.opencode/commands/doctor/scripts/mcp-doctor.sh`, `.github/hooks/scripts/session-start.sh`.
- BANNED: any `**/changelog/**`, `.opencode/specs/**`, the deleted skill folders, and any path outside ALLOWED. Do NOT touch deep-research/mcp-code-mode files OTHER than their `graph-metadata.json`.
- Do NOT git add/commit. Do NOT recompile the skill-graph (orchestrator does it).

VERIFY (run; report)
- `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run` (or the scorer test subset) — green.
- `python3 -c "import ast; ast.parse(open('.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py').read())"` — parses.
- `bash -n .opencode/scripts/orphan-mcp-sweeper.sh && bash -n .opencode/commands/doctor/scripts/mcp-doctor.sh && bash -n .github/hooks/scripts/session-start.sh` — all parse.
- `rg -n -i "mcp-coco-index|cocoindex|rerank_sidecar|ORPHAN_PRESERVE_RERANK" .opencode/skills/system-skill-advisor .opencode/skills/deep-research/graph-metadata.json .opencode/skills/mcp-code-mode/graph-metadata.json .opencode/scripts/orphan-mcp-sweeper.sh .opencode/commands/doctor/scripts/mcp-doctor.sh .github/hooks/scripts/session-start.sh -g '!**/changelog/**' -g '!**/skill-graph.json'` returns ZERO.

FORMAT (end with)
- `CHANGED PATHS:` newline list (exact repo-relative paths).
- `VERIFY:` results of each command (pass/fail + key output), confirming advisor tests green.
- `NOTES:` anything incomplete.
