ROLE
Senior engineer doing a precise, mechanical reference-removal across runtime config + agent/command files. Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/006-runtime-configs-4runtime-mirror` (pre-approved, skip Gate 3). Load `sk-code`.

CONTEXT
The `mcp-coco-index` + `system-rerank-sidecar` skills are now DELETED and code-graph/memory are decoupled. THIS phase removes the CocoIndex MCP registration + rerank env from the runtime CONFIG layer and the agent/command files across all 4 runtimes. Authoritative scope: `.../014-deprecate-coco-index/resource-map.md` §4 (Phase 006 row) + `001-touchpoint-research/research/iterations/iteration-005.md` (97 config/mirror touchpoints with exact key paths) + `iteration-012.md` (the doctor_update.yaml + gemini update.toml + the 6 pass-1 misses).

ACTION — remove every LIVE `cocoindex_code` / `cocoindex` / `ccc` / rerank-sidecar reference within the ALLOWED scope below:
1. **MCP registration configs** — remove the entire `cocoindex_code` MCP server block from: `opencode.json` (the `cocoindex_code` block + the `_NOTE_8`/`_NOTE_9` rerank opt-in notes + any cocoindex mention in `_NOTE_TOTAL_MCP_BUDGET`), `.vscode/mcp.json`, `.gemini/settings.json`, `.codex/config.toml` (cocoindex_code block + `RERANK_SIDECAR_PORT` env). Keep the JSON/TOML valid (no trailing-comma breakage).
2. **Agent files (4-runtime mirror)** — remove `mcp__cocoindex_code__search` / cocoindex refs from `.opencode/agents/**`, `.claude/agents/**`, `.gemini/agents/**`, `.codex/agents/**` (e.g. context, deep-review). Same logical edit must be applied to ALL runtime mirrors that have it.
3. **Command files** — remove cocoindex refs from command `.md`/`.toml` files: `.opencode/commands/**/*.md`, `.claude/commands/**/*.md`, `.gemini/commands/**/*.toml`, `.codex/commands/**` — including the `mcp__cocoindex_code__search` entries in `allowed-tools:` frontmatter (e.g. deep/start-research-loop.md, start-review-loop.md, ask-ai-council.md), `doctor_update.yaml`, `.gemini/commands/doctor/update.toml`, and the leftover "retired-search"/CocoIndex prose in `.opencode/commands/doctor/speckit.md` + `update.md` + `mcp.md` (remove those route descriptions entirely — coco is gone, there is no retired-search route).

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED WRITE PATHS (only): `opencode.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `.codex/config.toml`, `.opencode/agents/**`, `.claude/agents/**`, `.gemini/agents/**`, `.codex/agents/**`, `.opencode/commands/**/*.md`, `.opencode/commands/**/*.toml`, `.claude/commands/**`, `.gemini/commands/**`, `.codex/commands/**`, and `.opencode/commands/doctor/assets/doctor_update.yaml` ONLY (of the doctor assets).
- BANNED (phase 007 owns these — do NOT touch): the workflow YAML assets `.opencode/commands/**/assets/*.yaml` and `*.yml` EXCEPT `doctor_update.yaml`; `README.md`; `AGENTS.md`; `CLAUDE.md` (root) + `.claude/CLAUDE.md`; `.opencode/install_guides/**`. ALSO BANNED: `.opencode/specs/**`, the deleted skill folders, `system-code-graph`, and `system-spec-kit/mcp_server/lib/search`.
- Do NOT git add/commit.

VERIFY (run; report)
- `node -e "JSON.parse(require('fs').readFileSync('opencode.json','utf8'))"` (and the same for `.vscode/mcp.json`, `.gemini/settings.json`) — all parse OK.
- TOML sanity for `.codex/config.toml` (e.g. `python3 -c "import tomllib,sys; tomllib.load(open('.codex/config.toml','rb'))"` if available, else a structural grep).
- `rg -n -i "cocoindex|mcp__cocoindex_code|RERANK_SIDECAR|SPECKIT_CROSS_ENCODER|RERANKER_LOCAL|retired-search" opencode.json .vscode .gemini/settings.json .codex/config.toml .opencode/agents .claude/agents .gemini/agents .codex/agents .opencode/commands/**/*.md .claude/commands .gemini/commands .opencode/commands/doctor/assets/doctor_update.yaml` returns ZERO live references (historical/changelog mentions excluded).
- `git diff --stat` summary of touched files.

FORMAT (end with)
- `CHANGED PATHS:` newline list of every file edited (exact repo-relative paths).
- `VERIFY:` results of each command (pass/fail + key output).
- `NOTES:` anything incomplete, any ref you intentionally left for phase 007, or mirror files that did NOT have the ref (so the count reconciles).
