---
title: "Iteration 001 — Registration, transport, configuration, and baseline counts"
trigger_phrases: []
---
# Iteration 001 — Registration, transport, configuration, and baseline counts

## Route proof

- Mode: research
- Target agent: deep-research
- Agent definition loaded: true
- Resolved route: Resolved route: mode=research target_agent=deep-research
- Executor metadata: cli-codex model=gpt-5.6-luna reasoning=max service-tier=fast

## Scope and method

The parent objective is a deletion, not an in-place shrink: the frozen decisions require replacing the database with a generated trigger index plus ripgrep, rewiring consumers, and only then deleting the server surface. [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:49-55] The parent explicitly assigns phase 002 to consumer rewiring and phase 003 to deletion of the server, transport, plugin, bridge, hook, commands, and flags. [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:156-163]

This iteration searched hidden, non-archived, ignore-aware repository content for the named MCP tools, all 41 tool ids, server/launcher/plugin identifiers, memory command routes, hf-embed, and actual `SPECKIT_*` assignments/catalog references. `z_archive` and the lineage itself were excluded. The server tree is represented by one aggregate surface entry in `inventory.external.json`; its evidence list preserves representative internal `path:line` locations. The line-level external inventory is the `external.files[path].hits[]` collection in that same artifact. Every hit row carries line, term(s), surface type, reference kind, lifecycle, phase, action, and break risk.

## Findings

### 1. The server exposes exactly 41 registered tools

`TOOL_DEFINITIONS` is the live MCP registration list, and `context-server.ts` serves it unchanged from the `tools/list` handler. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:931-980] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:960-972] The exact ids are:

```text
memory_context, session_resume, session_bootstrap,
memory_search, memory_quick_search, memory_match_triggers, memory_save,
memory_list, memory_stats, memory_health, session_health,
memory_delete, memory_update, memory_validate, memory_bulk_delete,
memory_retention_sweep, memory_learned_expire, memory_learned_clear,
memory_embedding_reconcile,
checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete,
task_preflight, task_postflight, memory_drift_why, memory_causal_link,
memory_causal_stats, memory_causal_unlink, eval_run_ablation,
eval_reporting_dashboard,
memory_index_scan, memory_index_scan_status, memory_index_scan_cancel,
memory_get_learning_history, memory_ingest_start, memory_ingest_status,
memory_ingest_cancel, embedder_list, embedder_set, embedder_status
```

The runtime classifies the same complete set as memory-runtime tools, so even the composite/session and maintenance tools are coupled to initialization and database availability rather than being harmless names. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:248-287] Phase 003 owns deletion of the definitions, dispatch, handlers, schemas, and tests as one server-tree operation. External references to retrieval/context/save/session behavior are phase-002 rewires; external references to server-only maintenance, mutation, causal, embedder, and evaluation operations are deletion or explicit replacement decisions in phase 003.

### 2. Baseline size differs from the parent estimate

The tracked server tree contains 1,482 files and 453,964 lines in this checkout; the full worktree tree contains 3,203 files and 618,788 lines because generated distributions, database artifacts, benchmarks, and test fixtures are present. The parent states 1,480 tracked files and 453,813 tracked lines. [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:77-79] [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:138-146]

Therefore the parent baseline is low by 2 tracked files and 151 tracked lines. Its 41-tool estimate is confirmed. Its 373-flag estimate is not reproduced by the checked-in catalogs: `SPECKIT_*` token inventory is 315 unique names in `.env.example`, 312 in `mcp-server/ENV-REFERENCE.md`, and 405 unique tokens across the live worktree server tree (prefix placeholders included). The external scan observed 649 distinct `SPECKIT_*` tokens because it includes references and historical/current documentation beyond the authoritative catalog. These must be split into memory-only flags, shared runtime flags, retained advisor flags, and generic spec-kit flags before deletion; a single “373 flags” deletion count is not safe.

### 3. Five runtime configurations carry the transport contract

| Surface | Evidence | Classification | Owner/action | Break risk |
|---|---|---|---|---|
| `.claude/mcp.json` | `system-spec-memory`, launcher, DB IPC, hf socket at lines 3-24; advisor and shared-socket notes at lines 37-49 | Live config entry; tool/server grant | Phase 003 removes only the memory server entry and memory-only env; phase 002 preserves/rewires consumers. Keep the advisor entry and its own IPC socket; split the shared hf ownership contract before removing memory. | High |
| `.codex/config.toml` | Memory server/launcher/env at lines 4-18; separate advisor at lines 24-35 | Live config entry; tool grant | Phase 003 deletes the memory table and `memory_match_triggers` grant. Retain `system_skill_advisor`, its socket, and its advisor-specific flag. | High |
| `opencode.json` | Memory server/launcher/env at lines 11-33; advisor at lines 47-59 | Live config entry; tool/server grant | Phase 003 removes the memory entry. Do not remove the shared `HF_EMBED_SERVER_URL` or advisor entry until the retained advisor has an independent owner/path. | High |
| `.cursor/mcp.json` | Memory server/launcher/env at lines 3-27; advisor and shared-socket notes at lines 37-49 | Live config entry; tool grant | Same split as Claude config: delete memory transport in phase 003, retain advisor and shared model-server contract. | High |
| `.pi/mcp.json` | Memory server/launcher/env at lines 3-16; advisor at lines 21-31 | Live config entry; tool/server grant | Phase 003 deletes only memory registration and env; retain advisor. | High |

`.utcp_config.json` contains unrelated MCP entries but no system-spec-memory hit in the scan; it is a safe negative control, not a deletion target. [SOURCE: .utcp_config.json:15-250]

### 4. Shared hf-embed is a retained integration, not a memory-server deletion target

All four duplicated runtime configurations explicitly say the memory and skill-advisor services share one resident model server and socket. [SOURCE: .claude/mcp.json:24-49] [SOURCE: opencode.json:33-59] The advisor launcher also treats `SPECKIT_IPC_SOCKET_DIR`, `HF_EMBED_SERVER_URL`, and the system-spec-memory database name as a cross-process boundary, with filtering/pinning logic around its own graph database. [SOURCE: .opencode/bin/system-skill-advisor-launcher.cjs:141-152] [SOURCE: .opencode/bin/system-skill-advisor-launcher.cjs:285-298] Phase 002 must preserve the advisor's behavior while removing memory consumers; phase 003 must remove the memory side of the socket/launcher contract without deleting `.opencode/bin/hf-model-server.cjs` or advisor supervision. A blind `hf-embed` or `SPECKIT_IPC_SOCKET_DIR` sweep would break Gate 2 skill routing.

### 5. Launcher, CLI shim, plugin, hook, and proxy surfaces are live old-contract breakpoints

- `.opencode/bin/system-spec-memory-launcher.cjs` is the front-proxy/lease owner and names the backend, socket, daemon, respawn lock, and launcher log throughout its implementation. [SOURCE: .opencode/bin/system-spec-memory-launcher.cjs:98-181] [SOURCE: .opencode/bin/system-spec-memory-launcher.cjs:302-365] Delete it in phase 003 after phase-002 rewires complete.
- `.opencode/bin/spec-memory.cjs` is a live daemon-backed 41-tool CLI shim, including the socket default, stale-dist override, and `spec-memory` tool dispatch. [SOURCE: .opencode/bin/spec-memory.cjs:23-142] Delete it and its tests/docs in phase 003; do not replace it with another database shim.
- `.opencode/bin/lib/launcher-session-proxy.cjs` carries the allowlisted retrieval, session, mutation, checkpoint, and embedder tool ids. [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:46-66] Remove the memory allowlist/dispatch branches in phase 003; if a caller still needs a session/continuity action, phase 002 must move it to a file-local contract first.
- `.opencode/plugins/system-spec-memory.js` is a live OpenCode plugin that imports the bridge, injects continuity, and exposes `system_spec_memory_status`. [SOURCE: .opencode/plugins/system-spec-memory.js:32-52] [SOURCE: .opencode/plugins/system-spec-memory.js:93-126] Delete plugin, bridge, mirrored hook concern, and plugin tests in phase 003 after consumer rewiring.
- `.opencode/hooks/spec-memory/README.md` documents the plugin API, warm bridge, cache, marker, and symlink mirror as an active integration, not merely a historical note. [SOURCE: .opencode/hooks/spec-memory/README.md:20-67] Delete this memory-only hook surface in phase 003; update any hooks index that still advertises it.
- `.opencode/bin/hf-model-server.cjs` is shared infrastructure. Its socket resolution reads `HF_EMBED_SERVER_URL` and `SPECKIT_IPC_SOCKET_DIR`. [SOURCE: .opencode/bin/hf-model-server.cjs:118-126] Retain it for the advisor unless later phase work explicitly supplies an independent replacement.

### 6. Environment and command contracts are broader than the parent row implies

`.env.example` labels the database, launcher, IPC, validation, search, graph, retention, session, embedding, and CLI settings as “SPEC KIT MEMORY — INFRASTRUCTURE” and documents the launcher log/socket contract. [SOURCE: .env.example:68-95] The authoritative server environment reference explicitly ties flags to `memory_context`, `memory_search`, the launcher, `spec-memory` CLI, and `hf-embed`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:221-293] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:604-626] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:733-747]

The deletion list must be generated from the flag reference and read sites, not from a count: memory DB paths, launcher/IPC/lease flags, search/graph/retention/embedding flags, and `SPECKIT_SPEC_MEMORY_*` CLI/plugin flags are phase 003 candidates; advisor-only flags, generic spec-kit validation flags, and shared model-server flags require retain/rewire review. The exact flag hit rows are retained in `inventory.external.json` for later iterations to classify by read site.

### 7. Initial old-contract breakage set

The highest-risk live dependencies to clear before phase 003 are: five runtime MCP registrations; Gate 1 and other agent/tool grants; `memory_context`/`memory_search`/`memory_match_triggers`/`memory_save` calls; the memory CLI and launcher; the OpenCode plugin and bridge; hook route/index entries; and the shared hf/advisor notes. The parent itself warns that Gate 1 must retain a mechanism and that deletion before phase 2 would leave it without one. [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:117-123] [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:171-180]

## Machine counts for this iteration

The compact external scan found 22,024 external files and 57,308 unique matching file-line hits after the ignore-aware exclusions. The represented server tree adds 3,203 worktree files, 618,788 worktree lines, 1,482 tracked files, 453,964 tracked lines, 6,234 matching internal lines, and the 41 registered tools. These are line-hit counts, not deletion-row counts; historical packets and catalog prose are intentionally retained for classification rather than silently treated as live consumers. The current unique live-file count is 1,049, including 423 live files with a tool grant, tool call, or code-import classification. The narrower requested command/agent directories contain 123 live files (87 `.opencode/commands`, 8 `.opencode/agents`, 11 `.claude/agents`, 8 `.codex/agents`, 8 `.pi/agents`, and 1 `.cursor` surface), so the parent’s “~167 external consumers” is not a reproducible count without a stated inclusion rule.

## Evidence artifact

`inventory.external.json` is the exhaustive machine inventory for this iteration. It is lineage-local and records the requested fields for every retained external hit plus the aggregate server-tree entry. Subsequent iterations must broaden the review angles over the already-captured rows rather than stop on convergence telemetry.

## Iteration verdict

The transport and implementation surface is identified. The 41-tool estimate is correct; the server size and flag/consumer estimates need explicit counting rules. Continue with consumer instructions, agents, skills, commands, hooks, and historical/live classification.

New information ratio: 0.94
Duration: 11 minutes (bounded scan and source verification)
