# Iteration 4 — CocoIndex CLI/MCP Parity

## Focus
Audited `mcp-coco-index` CLI vs MCP parity and decision-tree drift, with special attention to status/reindex/feedback ownership after iteration 3 found the `system-spec-kit` `ccc_*` descriptors are listed but not dispatched.

## Actions Taken
- Action 1: Read strategy Sections 3, 6-12 and prior iterations 1-3 to avoid repeating the surface map, validator, and system-spec-kit MCP findings.
- Action 2: Read `mcp-coco-index/SKILL.md`, `references/tool_reference.md`, `references/search_patterns.md`, and `references/settings_reference.md` for the documented CLI/MCP contract and routing decision tree.
- Action 3: Read `mcp_server/cocoindex_code/cli.py`, `server.py`, `client.py`, `protocol.py`, `query.py`, `schema.py`, and `daemon.py` to compare command behavior, daemon protocol shape, and MCP response models.
- Action 4: Rechecked `system-spec-kit` `ccc_status`, `ccc_reindex`, and `ccc_feedback` registrations and dispatcher coverage to decide whether CocoIndex maintenance has a working MCP owner.

## Findings

### system-spec-kit / mcp-coco-index

### F-004-001 — CocoIndex maintenance has no working MCP owner [P1]
`mcp-coco-index` documents the intended split as "MCP server exposes `search` only" and says "Index/status/reset operations remain CLI-only unless routed through the Spec Kit Memory `ccc_*` tools" at `.opencode/skills/mcp-coco-index/SKILL.md:220`. The dedicated tool reference repeats that `status`, `index`, and `reset` are CLI-only at `.opencode/skills/mcp-coco-index/references/tool_reference.md:22`-`.opencode/skills/mcp-coco-index/references/tool_reference.md:23` and `.opencode/skills/mcp-coco-index/references/tool_reference.md:230`-`.opencode/skills/mcp-coco-index/references/tool_reference.md:233`.

The fallback owner named by that sentence is not callable today. `system-spec-kit` defines `ccc_status`, `ccc_reindex`, and `ccc_feedback` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:735`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:755` and documents them at `.opencode/skills/system-spec-kit/references/memory/memory_system.md:139`-`.opencode/skills/system-spec-kit/references/memory/memory_system.md:141`, but `ALL_DISPATCHERS` has no CocoIndex dispatcher at `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:91`-`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:101`; unrecognized names return `null` at `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:103`-`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:120`.

Concrete fix target: choose one owner. Either implement `ccc_*` dispatchers in `system-spec-kit`, or delete that fallback language and point agents to `ccc status`, `ccc index`, `ccc search --refresh`, `doctor.sh`, and `ensure_ready.sh` as the only maintenance path.

### mcp-coco-index

### F-004-002 — MCP/search telemetry docs overstate emitted fields [P1]
`mcp-coco-index/SKILL.md` says result rows carry seven extra fields, including `source_realpath`, `content_hash`, `dedupedAliases`, and `uniqueResultCount`, at `.opencode/skills/mcp-coco-index/SKILL.md:272`. `references/tool_reference.md` repeats this for CLI rows at `.opencode/skills/mcp-coco-index/references/tool_reference.md:75`, for MCP rows at `.opencode/skills/mcp-coco-index/references/tool_reference.md:273`, and the example shows row-level `source_realpath`, `content_hash`, `dedupedAliases`, and object-shaped `rankingSignals` at `.opencode/skills/mcp-coco-index/references/tool_reference.md:409`-`.opencode/skills/mcp-coco-index/references/tool_reference.md:430`.

The actual runtime shape is narrower. The daemon protocol `SearchResult` includes `file_path`, `language`, `content`, `start_line`, `end_line`, `score`, `raw_score`, `path_class`, and `rankingSignals: list[str]` only at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:95`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:114`. The MCP `CodeChunkResult` mirrors that same row shape at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:42`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:68`. `source_realpath` and `content_hash` are selected for dedup inside `query.py` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:74`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:86`, but `_ranked_result()` discards them before returning `QueryResult` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:176`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:217`.

Concrete fix target: update docs to distinguish stored chunk columns, internal dedup keys, top-level response telemetry, and row-level fields; or extend `SearchResult` / `CodeChunkResult` if those fields are meant to be public.

### F-004-003 — MCP startup indexing can race the default refresh path [P2]
`ccc mcp` starts a background index task as soon as the MCP server starts at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:473`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:499`. The MCP `search` tool also defaults `refresh_index` to `true` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:116`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:123` and runs `client.index(project_root)` before search when that flag is true at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:137`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:151`.

The skill already warns that simultaneous `refresh_index=true` requests can produce `ComponentContext` errors at `.opencode/skills/mcp-coco-index/SKILL.md:313`-`.opencode/skills/mcp-coco-index/SKILL.md:318`. This code path means a normal first MCP query can overlap with the startup index, and both routes share the same daemon-backed client object from `ccc mcp`.

Concrete fix target: make startup indexing and search refresh share a single serialized readiness gate, or remove one of the two default refreshes. The current docs put the burden on callers to set `refresh_index=false` after the first query, but the duplicate-index risk exists before the caller has completed any query.

### F-004-004 — CLI path scoping differs from MCP and is underdocumented in the reference [P2]
The CLI docs present `--path` as optional with default `.` at `.opencode/skills/mcp-coco-index/references/tool_reference.md:36`-`.opencode/skills/mcp-coco-index/references/tool_reference.md:43`, and the CLI/MCP mapping only says CLI path is a single string while MCP `paths` is a list at `.opencode/skills/mcp-coco-index/references/tool_reference.md:279`-`.opencode/skills/mcp-coco-index/references/tool_reference.md:287`.

The actual CLI has a hidden current-directory default. If `--path` is omitted and the user runs `ccc search` from below the project root, `resolve_default_path()` returns `"{relative-cwd}/*"` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:92`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:101`, and `search()` applies that default at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:367`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:374`. MCP searches have no current working directory equivalent and default to the whole project unless `paths` is supplied.

Concrete fix target: document the CLI's cwd-scoped default in the parameter table and recommend explicit `--path` / `paths` for parity. `references/search_patterns.md:145`-`.opencode/skills/mcp-coco-index/references/search_patterns.md:150` already hints at this, but the primary tool reference still hides the behavior.

### sk-code

No new direct sk-code finding this iteration. The next pass should test whether CocoIndex ingests `.opencode/skills/sk-code/` resources and whether semantic queries surface those references with usable rank.

## Questions Answered
- Q3: Partially answered. CLI/MCP search parameters mostly map cleanly, but maintenance ownership is broken because the documented Spec Kit Memory `ccc_*` fallback is registered without a dispatcher. Freshness behavior also has a startup-index vs default-refresh race target.
- Q4: Not answered this iteration except for setup. The `.opencode` hidden-directory exclusion from iteration 1 remains the main hypothesis to test with actual sk-code ingestion/rank checks.

## Questions Remaining
- Q3: Still open for live CLI/MCP behavior tests, especially whether the startup refresh race can be reproduced and whether helper scripts should become the documented maintenance owner.
- Q4: Still open for actual CocoIndex query/rank checks against `sk-code` resources.
- Q5: Still open for detailed sk-code OpenCode reference/assets gaps.
- Q6: Still open for `STACK_FOLDERS` and resource_map drift.
- Q7: Still open for cross-skill loading during `/speckit:complete`-style writes.

## Next Focus (for iteration 5)
Audit mcp-coco-index ingestion of `sk-code` resources and the embedding-provider abstraction. Start with the default include/exclude settings, the project `.cocoindex_code/settings.yml` if present, and live or fixture searches for `sk-code` OpenCode resource phrases; then check whether model/provider changes are safely represented in config, daemon restart behavior, and docs.
