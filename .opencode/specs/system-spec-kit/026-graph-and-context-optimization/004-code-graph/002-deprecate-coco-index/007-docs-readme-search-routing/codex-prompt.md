ROLE
Senior engineer + technical writer doing the final CocoIndex reference removal: the workflow YAML assets + prose docs, rewriting "semantic code search" guidance to the HYBRID policy. Spec folder: `.../014-deprecate-coco-index/007-docs-readme-search-routing` (pre-approved, skip Gate 3). Load `sk-code`.

CONTEXT
CocoIndex + the rerank sidecar are deleted (skills gone, configs cleaned, code-graph + memory decoupled). THIS final phase removes the remaining coco references from WORKFLOW YAML ASSETS + PROSE DOCS and replaces semantic-code-search guidance with the **HYBRID policy: Code Graph (structural) + Grep**, NOT `memory_search` (memory indexes spec-docs, not arbitrary code). Authoritative scope:
- `.../014-deprecate-coco-index/resource-map.md` §3 (D2 HYBRID decision) + §5 (the 27 YAML assets, full file list with line refs)
- `001-touchpoint-research/research/iterations/iteration-004.md` (33 semantic-search routes + the HYBRID recommendation + 4-phase doc rewrite plan)
- `iteration-012.md` §"YAML assets" (the precise 27-file enumeration)

ACTION
1. **The 27 workflow YAML assets** under `.opencode/commands/**/assets/*.yaml` (speckit_plan/complete/implement _auto+_confirm; the 12 create_* _auto+_confirm; the 4 deep loop executors). For the `code_search_note:` fields, replace the "Use CocoIndex (mcp__cocoindex_code__search) for ..." guidance with HYBRID wording, e.g. "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery; verify hits with Read."
2. **P0 — the 4 deep-loop executor YAMLs** (`deep_start-research-loop_auto.yaml`, `deep_start-research-loop_confirm.yaml`, `deep_start-review-loop_auto.yaml`, `deep_start-review-loop_confirm.yaml`): REMOVE `cocoindex_code` from the `mcp_servers:` list AND `mcp__cocoindex_code__search` from the `tools:` list in the agent_config block. Adjust the "Code Context Bootstrap" step that used `mcp__cocoindex_code__search` to use Code Graph + Grep (or remove the bootstrap cleanly). The YAML MUST stay schema-valid and the loop MUST still be able to start with only `mk-spec-memory` registered.
3. **Prose docs → HYBRID:**
   - `README.md` — remove cocoindex/ccc from the MCP-server list, feature tables, install steps; update any "semantic code search" feature to the HYBRID description.
   - `AGENTS.md` — the CODE SEARCH DECISION TREE + tool-routing section: remove the CocoIndex branch; route concept/semantic code discovery to Code Graph structural + Grep.
   - `CLAUDE.md` (root) + `.claude/CLAUDE.md` — the SEARCH ROUTING block + decision tree: remove CocoIndex; concept search → Code Graph + Grep; keep `memory_search` only for spec-doc/memory semantic (not code).
   - `.opencode/install_guides/**` — remove cocoindex install/setup steps.

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED WRITE PATHS (only): `.opencode/commands/**/assets/*.yaml`, `.opencode/commands/**/assets/*.yml`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`, `.opencode/install_guides/**`.
- BANNED (done in earlier phases — do NOT touch): the MCP config files (opencode.json/.vscode/.gemini/.codex), agent files, command `.md`/`.toml` files, `.opencode/specs/**`, the deleted skill folders, `system-code-graph`, `system-spec-kit/mcp_server/lib/search`.
- When you do a CocoIndex→Code Graph text replace, DO NOT create duplicate words (e.g. "Code Graph, Code Graph") — read the surrounding sentence and produce clean prose.
- Do NOT git add/commit.

VERIFY (run; report)
- The 4 deep-loop executor YAMLs: confirm `cocoindex_code` is gone from `mcp_servers:` and `mcp__cocoindex_code__search` gone from `tools:`; the YAML parses (e.g. `python3 -c "import yaml,sys; yaml.safe_load(open(p))"` for each, if pyyaml available, else a structural check).
- `rg -n -i "cocoindex|mcp__cocoindex_code|ccc search|ccc index" .opencode/commands/**/assets README.md AGENTS.md CLAUDE.md .claude/CLAUDE.md .opencode/install_guides` returns ZERO live references.
- `rg -n "Code Graph, Code Graph|, Code Graph, Code Graph" README.md AGENTS.md CLAUDE.md .opencode/commands` returns ZERO (no replace artifacts).
- `git diff --stat` summary.

FORMAT (end with)
- `CHANGED PATHS:` newline list of every file edited (exact repo-relative paths).
- `VERIFY:` results of each command (pass/fail + key output), explicitly confirming the 4 loop-executor YAMLs are coco-free + parse.
- `NOTES:` anything incomplete or needing follow-up.
