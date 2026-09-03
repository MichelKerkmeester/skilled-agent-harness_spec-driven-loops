---
title: "Iteration 004 — lifecycle classification and completeness audit"
trigger_phrases: []
---
# Iteration 004 — lifecycle classification and completeness audit

## Scope and evidence method

This iteration rebuilt inventory.external.json from rg --json records. The parser takes the path from record.data.path.text and stores an explicit path on every hit row, so colon-containing paths are not split. The scan uses --no-ignore-global to include the root opencode.json and the negative-control .utcp_config.json, while explicitly excluding .git, node_modules, z_archive, this lineage, and the complete .opencode/skills/system-spec-kit/mcp-server tree. The server tree is retained as one aggregate entry. No repository code was executed or changed, no validation or generator command was run, and no memory MCP call was made.

The previous colon-delimited artifact was replaced because it had malformed path keys. The current artifact has zero parser errors, zero colon-containing path keys, and a per-hit action, phase owner, lifecycle, risk, terms, and extracted flag list. The lifecycle label is a documented path-structure classification: runs, research, reports, reviews, deltas, archive, fixtures, snapshots, and JSONL are treated as historical narrative; other matching paths are treated as live instructions or implementation. Ambiguous semantic cases still require source review during implementation.

## Finding 1 — the lossless inventory is broader than a consumer count

At scan time 2026-09-02T17:24:41.708Z, the external row set contained 18,586 matching paths and 89,854 matching lines. Of those, 15,890 paths and 58,641 lines were classified as live; 2,696 paths and 31,213 lines were classified as historical narrative. The external inventory contains 797 distinct extracted SPECKIT_*, HF_*, IPC_*, MEMORY_DB_PATH, and hf-embed identifiers. These are reference observations, not counts of independently owned consumers.

The row-level artifact is inventory.external.json. Each file key is a path, and each hit row repeats path, line, surfaceType, referenceKind, lifecycle, phaseOwner, action, breakRisk, terms, and flags. The server aggregate is under mcpServer, with representedSeparately: true.

## Finding 2 — counts by surface type

Counts are all hit-lines / live hit-lines followed by all files / live files. The mcp-server external bucket covers non-target MCP-server paths; the deprecating server tree is the separate aggregate below.

| Surface type | Hit-lines | Files | Ownership signal |
|---|---:|---:|---|
| spec packet | 71,600 / 44,441 | 15,041 / 12,597 | classify each packet row; live child contracts are usually 002, delete-only packet text is 003 |
| catalog/playbook/benchmark | 12,017 / 8,281 | 2,010 / 1,884 | rewrite live procedures in 002; retire delete-only scenarios in 003 |
| documentation | 140 / 140 | 17 / 17 | rewrite live guidance in 002 or remove memory-only narrative in 003 |
| config/metadata | 85 / 85 | 5 / 5 | remove registrations in 003 after 002 rewires grants |
| hook | 1,484 / 1,358 | 494 / 442 | rewire injection in 002; delete memory adapter in 003 |
| agent | 301 / 273 | 84 / 72 | rewire live grants/instructions in 002 |
| command | 621 / 621 | 84 / 84 | rewire surviving commands in 002; delete obsolete routes in 003 |
| skill/reference | 1,292 / 1,292 | 464 / 464 | update contracts/templates in 002 |
| code | 510 / 504 | 115 / 111 | split shared imports in 002; remove server-only imports in 003 |
| bin launcher/shim | 267 / 267 | 30 / 30 | remove memory launchers/allowlists in 003 |
| plugin/bridge | 25 / 25 | 5 / 5 | delete memory plugin/bridge family in 003 |
| test | 718 / 605 | 140 / 87 | add replacement proof in 002; delete obsolete memory suites in 003 |
| environment | 325 / 325 | 2 / 2 | split server-only and retained flags in 002; remove server rows in 003 |
| package/script | 1 / 1 | 1 / 1 | remove server workspace/bin entry in 003 |
| CI | 0 / 0 | 0 / 0 | no matching CI row in the external scan |

The large spec-packet bucket is intentional: the repository has many packet documents and historical lineages outside z_archive; their rows remain individually searchable in the JSON artifact. It must not be mistaken for 15,041 runtime consumers.

## Finding 3 — counts by reference kind

| Reference kind | Hit-lines | Files | Concrete handling |
|---|---:|---:|---|
| env flag | 43,690 / 33,253 live | 14,515 / 13,563 live | classify each identifier; retain advisor/shared flags |
| doc mention | 30,477 / 13,975 live | 5,438 / 3,811 live | rewrite live instruction; preserve historical evidence |
| code import | 5,378 / 3,305 live | 1,944 / 1,225 live | trace producer/consumer seam before deletion |
| config entry | 6,282 / 5,703 live | 980 / 872 live | remove memory registrations; retain advisor config |
| tool call | 3,510 / 1,937 live | 1,076 / 680 live | replace call with local/index contract in 002 |
| test | 371 / 353 live | 41 / 38 live | migrate assertions or delete memory-only tests |
| tool grant | 146 / 115 live | 82 / 74 live | remove old grants in 003 after command/agent rewiring |

Reference-kind classification is first-match and intentionally conservative. For example, a line containing both a call and an environment flag is assigned one primary kind while its full term and flag lists remain on the row.

## Finding 4 — phase ownership and retain exceptions

| Classification | Hit-lines | Files | Meaning |
|---|---:|---:|---|
| 002 rewire | 39,568 / 27,776 live | 10,096 / 8,987 live | live consumers receive the generated trigger-index, ripgrep, lineage-local, or other approved replacement |
| retain exception | 18,847 / 6,919 live | 2,686 / 2,105 live | split or preserve shared advisor/HF/IPC capability; not a blind delete |
| 003 delete | 31,439 / 23,946 live | 5,804 / 4,798 live | delete memory-only registrations, routes, launchers, plugin family, package tree, and obsolete tests after 002 |

The phase totals are row classifications, not disjoint consumer counts: one file can contain rows with different owners, and the server aggregate is separately owned by 003. The full row action is the handoff contract. In particular, the 002 owner must establish the replacement before 003 removes system-spec-memory; 003 must not remove the shared exception merely because it contains a memory-adjacent token.

## Finding 5 — requested configuration and agent/command roots are present

The live runtime configuration census is:

- .claude/mcp.json: 19 rows; .codex/config.toml: 15; .cursor/mcp.json: 19; .pi/mcp.json: 13; root opencode.json: 19. Each registers the memory server and/or shared HF/IPC variables; remove only the memory registration and memory-only environment entries in 003.
- .env.example: 320 live rows, including memory DB/launcher/IPC/CLI sections and shared embedding/advisor flags; split in 002, remove server-only rows in 003.
- .opencode/commands: 84 files and 621 live rows. .opencode/agents: 8 files/48 rows; .claude/agents: 11/56; .codex/agents: 8/46; .pi/agents: 8/46. Live /memory:*, doctor-memory, deep-loop, tool grants, and generated-command templates are 002/003 route families.
- .opencode/hooks: 24 files/95 rows; .opencode/plugins: 13/70; .opencode/bin: 34 files/282 rows. These include injection, bridge/status, launcher, proxy, allowlist, and process-shim seams.
- .devin, .claude/hooks, CLAUDE.md, root REPO RULES.md, and .utcp_config.json have no matching target rows in the lossless scan. AGENTS.md has 11 live rows. The MCP tree's ENV-REFERENCE.md is deliberately represented by the aggregate rather than expanded.

The negative .utcp_config.json result is a coverage check, not permission to edit it. The root REPO RULES.md was read for execution policy but does not itself speak the retired contract.

## Finding 6 — concrete phase handoff and break-risk seams

Phase 002 must first rewire:

1. Context/agent families and /memory:search, /memory:save, /memory:manage, /doctor memory, and deep-loop YAML grants/calls to lineage-local JSONL/state plus generated trigger-index/ripgrep retrieval.
2. workflow.ts imports of @spec-kit/mcp-server/api/indexing, automatic memory_index_scan follow-up instructions, and daemon detection of .system-spec-memory-launcher.json to source-owned index/lease behavior.
3. Shared config, embedding, HF-local, and IPC seams so server-only DB/socket branches are separated from system-skill-advisor and other retained consumers.
4. Generator assets under .opencode/commands, skill/reference templates, feature catalogs, tests, and manual playbooks so future artifacts no longer teach the retired server.
5. Deep-loop reducers/ledgers/tests so memory_save and memory_context persistence become lineage-local state while deep-loop locks, projections, and reducer state remain intact.

Phase 003 then deletes:

1. The complete .opencode/skills/system-spec-kit/mcp-server tree as one unit, plus its package workspace/bin/script and server-only lock entries.
2. .opencode/bin/system-spec-memory-launcher.cjs, spec-memory.cjs, memory allowlists in launcher-session-proxy.cjs, .opencode/plugins/system-spec-memory.js, memory hook adapters, and memory-only plugin tests/playbooks.
3. Memory registrations from all five runtime configs, old tool grants/routes, server-only .env.example/ENV-REFERENCE rows, launcher leases, orphan/session cleanup branches, and memory-only install/catalog entries.

Surfaces that can break an old contract if deleted naively:

- workflow.ts → @spec-kit/mcp-server/api/indexing: a config-only removal leaves a compile/import failure.
- Orphan/session cleanup → context-server, launcher leases, daemon-ipc.sock, and hf-embed.sock: removing all process/socket logic can strand memory daemons or kill a retained advisor/embedder.
- Shared embeddings/IPC/HF-local → both memory and system-skill-advisor: retain the model-server socket and advisor path while removing memory-only DB/branch logic.
- Deep-loop YAML → reducer/ledger/lock/projection: remove MCP persistence, not the loop state machine.
- Generator templates/install/catalogs → future generated commands and playbooks: update producers before deleting generated consumers.

The inventory marks these rows high risk, but source-level findings confirm the specific seams: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:101-106,605-640, scripts/deploy-mcp.sh:49-82, .opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515, shared embedding/HF/IPC sources, .opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347, and the plugin/deep-loop tests named in iteration 003.

## Finding 7 — server aggregate and parent-estimate corrections

The target tree census is a single aggregate:

- Worktree: 3,203 regular files, 32,456,976 bytes, 618,794 newline-counted lines.
- Tracked: 1,481 files, 20,273,034 bytes, 453,964 newline-counted lines.
- Target-tree match scan: 703 files, 7,756 matching lines, 37 tool names observed literally, 41 exposed tool names from the schema, and 410 unique flag identifiers.

The 41 exposed tools are: checkpoint_create, checkpoint_delete, checkpoint_list, checkpoint_restore, embedder_list, embedder_set, embedder_status, eval_reporting_dashboard, eval_run_ablation, memory_bulk_delete, memory_causal_link, memory_causal_stats, memory_causal_unlink, memory_context, memory_delete, memory_drift_why, memory_embedding_reconcile, memory_get_learning_history, memory_health, memory_index_scan, memory_index_scan_cancel, memory_index_scan_status, memory_ingest_cancel, memory_ingest_start, memory_ingest_status, memory_learned_clear, memory_learned_expire, memory_list, memory_match_triggers, memory_quick_search, memory_retention_sweep, memory_save, memory_search, memory_stats, memory_update, memory_validate, session_bootstrap, session_health, session_resume, task_postflight, and task_preflight.

Against the parent estimate, the tracked tree is +1 file and +151 newline-counted lines. The estimate of 41 tools is correct. The parent’s 373-flag figure is not reproducible as the current server-tree unique-identifier count (410) or the external repository count (797); those are different scopes and include aliases/shared flags. The “~167 consumers” estimate is not derivable from raw paths: the scan finds 8,987 live files with at least one 002 row and 4,798 with at least one 003 row, but many are docs, specs, generated evidence, or multiple rows in one consumer. Treat ~167 as a logical ownership estimate requiring reconciliation, not as an exhaustive path count.

## Finding 8 — historical narrative and negative knowledge

The scan deliberately retains non-z_archive historical research, run, report, review, delta, fixture, snapshot, and JSONL paths so evidence is not silently erased. Those rows are labeled historical narrative by the path rule and should not be rewritten merely to make a deletion grep clean; they should be excluded from live route validation or explicitly marked as historical. The current lineage is excluded from its own inventory.

No .devin agent memory row, .claude/hooks memory row, root CLAUDE.md row, root REPO RULES.md row, or .utcp_config.json target row was found. System-skill-advisor, its database/launcher, shared HF model-server, shared embeddings, and generic IPC are retain exceptions unless a row is explicitly memory-only.

## New information ratio

0.45 — the scan adds lossless path handling, global-ignore coverage, corrected surface categories, complete live/historical counts, and parent-estimate reconciliation. It broadens the evidence set without changing the earlier source-level break-risk findings.
