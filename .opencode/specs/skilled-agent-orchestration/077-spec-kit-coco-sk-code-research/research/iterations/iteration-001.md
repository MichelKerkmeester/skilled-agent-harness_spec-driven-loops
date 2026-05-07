# Iteration 1 — Surface Map and First Drift Pass

## Focus
Mapped the three target surfaces at a filesystem and SKILL.md-claim level: `system-spec-kit`, `mcp-coco-index`, and the OpenCode side of `sk-code`. This pass focused on obvious contract drift, routing gaps, and concrete follow-up targets for validator, indexing, and OpenCode-resource coverage work.

## Actions Taken
- Action 1: Read the deep-research strategy Sections 3, 6-12 and confirmed there are no prior `iteration-*.md` files under `research/iterations/`.
- Action 2: Read the relevant parts of `deep-research/SKILL.md` and `system-spec-kit/SKILL.md` to confirm the iteration artifact contract and research-file exemption.
- Action 3: Enumerated `.opencode/skills/system-spec-kit/`, `.opencode/skills/mcp-coco-index/`, and `.opencode/skills/sk-code/{references,assets}/opencode/`, then compared those inventories against SKILL.md resource claims.
- Action 4: Inspected mcp-coco-index CLI/MCP entry points and indexing settings to identify first-pass CLI/MCP parity and freshness risks.
- Action 5: Inspected sk-code OpenCode router references, OpenCode assets, and cross-links for missing authoring resources and stale paths.

## Findings

### system-spec-kit

### F-001-001 — Directory resource in markdown-only router [P1]
`system-spec-kit/SKILL.md` maps `ROLLOUT_FLAGS` to both `references/config/environment_variables.md` and the directory `feature_catalog/19--feature-flag-reference/` at `.opencode/skills/system-spec-kit/SKILL.md:208`-`.opencode/skills/system-spec-kit/SKILL.md:210`. The same router contract says `_guard_in_skill` accepts only markdown resources and raises `ValueError(f"Only markdown resources are routable: {relative_path}")` at `.opencode/skills/system-spec-kit/SKILL.md:254`-`.opencode/skills/system-spec-kit/SKILL.md:259`. The target directory does contain markdown files, but the RESOURCE_MAP entry itself is a directory, so this intent path is structurally incompatible with the documented loader.

### mcp-coco-index

### F-001-002 — Default indexing likely excludes sk-code resources under `.opencode/` [P1]
The research topic asks whether mcp-coco-index ingests `.opencode/skills/sk-code/` resources, but default project settings exclude hidden paths via `DEFAULT_EXCLUDED_PATTERNS` entry `"**/.*"` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:50`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:59`. Those defaults are assigned to `ProjectSettings.exclude_patterns` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:86`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:89`, while `sk-code` declares its OpenCode scope under `.opencode/` at `.opencode/skills/sk-code/SKILL.md:22`-`.opencode/skills/sk-code/SKILL.md:23`. This makes sk-code resource ingestion unlikely under defaults unless project settings override hidden-directory exclusion. A live index query should verify the actual rank/absence in iteration 5.

### F-001-003 — MCP freshness default is a performance and concurrency hotspot [P2]
The MCP server exposes `refresh_index` with `default=True` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:116`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:122`, and calls `client.index(project_root)` before search when it is true at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:139`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:140`. The skill docs explicitly warn to set `refresh_index=false` after the first query and note a known simultaneous-refresh `ComponentContext` issue at `.opencode/skills/mcp-coco-index/SKILL.md:316`-`.opencode/skills/mcp-coco-index/SKILL.md:318`. This is not necessarily a correctness bug, but it is a concrete freshness/performance target for iteration 4.

### sk-code

### F-001-004 — OpenCode scope includes skills/agents/commands, but assets only provide language checklists [P2]
`sk-code` says OPENCODE covers `.opencode/` skills, agents, commands, MCP servers, hooks, scripts, tests, config, and multiple languages at `.opencode/skills/sk-code/SKILL.md:20`-`.opencode/skills/sk-code/SKILL.md:23`. Its OpenCode workflow then says to load shared patterns, language standards, quick references, and checklists at `.opencode/skills/sk-code/SKILL.md:147`-`.opencode/skills/sk-code/SKILL.md:152`. The on-disk OpenCode assets currently enumerate only `config_checklist.md`, `javascript_checklist.md`, `python_checklist.md`, `shell_checklist.md`, `typescript_checklist.md`, and `universal_checklist.md` under `.opencode/skills/sk-code/assets/opencode/checklists/`. There are no surface-specific authoring checklists for skills, agents, or commands, so the declared OpenCode scope is broader than the available checklist coverage.

### F-001-005 — OpenCode shared reference has stale checklist relative link [P2]
`.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:551`-`.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:554` links the cross-language checklist as `../../assets/checklists/universal_checklist.md`. From `references/opencode/shared/`, that resolves under `references/assets/checklists/`, but the real checklist path is `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`. This is a concrete resource_map/link drift target for the sk-code asset/reference iterations.

## Questions Answered
- Q1: Partially answered. Found one concrete system-spec-kit SKILL.md router drift in `ROLLOUT_FLAGS`; deeper validator/template/MCP drift remains.
- Q3: Partially answered. MCP exposes only `search` while CLI has init/index/search/status/reset/mcp/daemon commands; freshness behavior is documented but still risky.
- Q4: Partially answered. Defaults strongly suggest `.opencode/skills/sk-code/` is not ingested unless hidden-dir exclusion is overridden; live query/rank testing remains.
- Q5: Partially answered. sk-code has language checklists but lacks skills/agents/commands authoring checklists despite claiming that scope.
- Q7: Partially answered. sk-code OPENCODE detection is path-first and should trigger for `.opencode/` spec-kit work, but this needs validation in a `/spec_kit:complete`-style flow.

## Questions Remaining
- Q1: Need full system-spec-kit doc/code drift review across validator scripts, template manifests, and MCP tool docs.
- Q2: Still open; no targeted coverage audit was performed in iteration 1.
- Q3: Still open for CLI/MCP behavior tests and decision-tree drift beyond the initial entry-point map.
- Q4: Still open for actual CocoIndex query results and rank quality against sk-code resources.
- Q5: Still open for a complete OpenCode reference/assets gap list.
- Q6: Still open; STACK_FOLDERS/resource_map contract needs a dedicated on-disk comparison.
- Q7: Still open; cross-skill loading during spec-kit writes needs a targeted workflow trace.

## Next Focus (for iteration 2)
Audit `system-spec-kit` validator and script coverage: start with `scripts/spec/validate.sh`, `scripts/rules/check-template-headers.sh`, `scripts/rules/check-graph-metadata.sh`, `scripts/dist/spec-folder/generate-description.js`, and `scripts/dist/graph/backfill-graph-metadata.js`. Prioritize whether strict validation catches phase-parent metadata drift, missing `description.json` / `graph-metadata.json`, broken template anchors, and RESOURCE_MAP entries that cannot be loaded.
