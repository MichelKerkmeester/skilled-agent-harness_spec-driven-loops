---
title: "Iteration 003 — implementation, test, template, and flag seam audit"
trigger_phrases: []
---
# Iteration 003 — implementation, test, template, and flag seam audit

## Scope and evidence method

This iteration follows the live consumer census with source-level dependency tracing. The line-level inventory remains the authoritative exhaustive row set: every external hit has `path`, `surfaceType`, `referenceKind`, `lifecycle`, `phase`, `action`, and `breakRisk`; the server tree is represented as one aggregate entry as requested. No code was executed or changed, and no memory MCP call was made.

## Finding 1 — system-spec-kit scripts import the server API and are not removable by config cleanup alone

The system-spec-kit package identifies itself as a “Semantic Memory MCP server and CLI tools” workspace and includes `shared`, `mcp-server`, and `scripts` workspaces (`.opencode/skills/system-spec-kit/package.json:1-10`). Its `start`, `test:root`, `test:mcp`, and CLI smoke scripts directly build or execute the server and generated context tooling (`:14-26`). The lockfile also exposes `context-server` and `spec-memory` bins in the `mcp-server` package (`package-lock.json:26-46`).

The live script-side workflow imports `@spec-kit/mcp-server/api/indexing` (`.opencode/skills/system-spec-kit/scripts/core/workflow.ts:605-611`), emits `memory_index_scan` follow-up instructions and second-writer warnings around `context-index.sqlite` (`:613-640`), and imports daemon liveness detection (`:101-106`). `daemon-detect.ts` owns the `.system-spec-memory-launcher.json` lease filename (`.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:35-37`).

Ownership: phase 002 must replace the workflow’s automatic index/daemon branches with generated trigger-index and source-owned file operations before phase 003 removes the server API dependency. Phase 003 removes the `mcp-server` workspace/bin and memory-specific package scripts, but must preserve any `shared` modules still required by skill-advisor or other non-memory consumers. This is a high-risk code/import seam; deleting only the MCP config leaves TypeScript imports and package scripts broken.

## Finding 2 — process and install tooling has explicit memory daemon lifecycle branches

`.opencode/skills/system-spec-kit/scripts/deploy-mcp.sh` builds the system-spec-memory server and, in recycle mode, finds and terminates the `context-server` child so the launcher respawns it (`:49-82`). `.opencode/scripts/orphan-mcp-sweeper.sh` classifies both `system-spec-memory-launcher.cjs` and `context-server.js` (`:204-212`), parses `SPECKIT_DB_DIR`/`MEMORY_DB_PATH` (`:296-301`), deduplicates same-DB context servers (`:409-434`), and deliberately preserves live `daemon-ipc.sock` and `hf-embed.sock` connections (`:504-515`). `.opencode/scripts/session-cleanup.sh` treats the memory launcher and context server as target processes (`:102-113`). `process-memory-harness.ts` declares `spec-memory-launcher` and `spec-memory-server` project-daemon rules (`:88-100`), while `process-sweep.ts` carries the memory launcher suffix and `.spec-memory-owner.json` lease (`:78-82`).

Ownership: phase 003 removes memory-specific process classes, leases, build/recycle entries, and cleanup targets. Phase 002 must first identify whether each orphan-sweep/socket branch is shared with advisor or HF supervision; the `hf-embed.sock` preservation rule must survive for the retained model-server/advisor path. A blind removal can either leave orphaned memory daemons or kill a still-used advisor/embedder process.

## Finding 3 — shared embedding and IPC modules are mixed ownership, not a server-tree deletion proxy

`shared/config.ts` resolves both `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` (`:8-11`). The shared embedder adapter and Ollama adapter explicitly say they are shared by system-spec-memory and skill-advisor (`shared/embeddings/adapter.ts:4-13`; `adapters/ollama.ts:4-10`). The HF-local provider resolves `hf-embed.sock` and `SPECKIT_IPC_SOCKET_DIR` (`shared/embeddings/providers/hf-local.ts:32-35,371-382`), and its failure text still names `system-spec-memory` (`:827-831`). The shared IPC server reads `SPECKIT_MAX_SECONDARY_CLIENTS` and `SPECKIT_IPC_SOCKET_DIR` (`shared/ipc/socket-server.ts:134,187,202-203`). `trigger-extractor.ts` still exports the old `memory_match_triggers` concept, which is the direct seam for the phase-002 generated-trigger-index replacement.

Ownership: phase 002 splits or renames memory-only settings and updates error/help text; phase 003 removes only memory-only DB/IPC consumers. Retain shared embedder interfaces, HF-local socket code, and advisor-compatible IPC where source inspection confirms a surviving owner. The parent’s D1 “delete outright” applies to the system-spec-memory subsystem, not to every shared adapter or the retained system-skill-advisor model server.

## Finding 4 — deep-loop state contracts and tests encode per-iteration memory persistence

The deep-loop ledger schema and reducer contain `memory_save` fields and status/event handling, while `deep-research-memory-upsert-yaml.vitest.ts` asserts the exact old order and calls: reducer → graph upsert → `step_memory_upsert_iteration` with `mcp_tool: memory_save` → context refresh → evaluation (`:55-87`). The workflow YAML itself calls memory save/context in those steps (`.opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347`).

Ownership: phase 002 changes the workflow and its unit tests to use lineage-local JSONL/ledger state and generated file-local retrieval; phase 003 removes the memory MCP integration branch and memory-specific fixtures only after the new assertions exist. The deep-loop reducer, ledger, lock, and projection remain live and are not deletion targets. This is a high break-risk seam because a naive deletion of all `memory_save` tokens would corrupt the loop’s state contract rather than merely removing a consumer.

## Finding 5 — plugin, bridge, hook, and manual test artifacts are a coherent delete family

The OpenCode plugin test resolves `.opencode/plugins/system-spec-memory.js`, the memory bridge/schema, Claude hook roots, and the CLI shim (`.opencode/plugins/tests/system-spec-memory.test.cjs:17-45`). The test suite exercises plugin export/config status and continuity-transform behavior, including the `system-spec-memory` transform receipt (`:154-170,412-447`). The feature playbook says the plugin is auto-discovered, spawns the warm CLI bridge, injects continuity, exposes `system_spec_memory_status`, and relies on `SYSTEM_SPEC_MEMORY_PLUGIN_DISABLED`/`SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED` (`.opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-memory-plugin.md:22-43`).

Ownership: phase 003 deletes the plugin, bridge helpers, memory hook adapters, plugin test suite, playbook, and memory-only kill-switch aliases. Phase 002 replaces continuity injection with generated/file-local sources wherever a surviving runtime still needs a brief. Leaving tests/playbooks in place after deletion creates false acceptance instructions; deleting them before rewiring leaves no proof for the replacement path.

## Finding 6 — install, package, templates, feature catalogs, and playbooks are live documentation/configuration surfaces

The master installer lists Spec Kit Memory as an MCP product, names `system-spec-memory` and `install-spec-kit-memory.sh`, and advertises its install order (`.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`). The install README registers three MCP servers, links the Spec Kit Memory guide, lists native SQLite/vector dependencies, and presents the memory server in the component matrix (`.opencode/install-guides/README.md:25-55,183-190,268-278`). The `sk-doc` command contract and create-* auto/confirm assets propagate memory grants and save/index instructions into future generated commands and catalogs.

The system-spec-kit feature catalog and manual playbooks contain current acceptance routes for memory search/save, DB path precedence, warm-only CLI, session resume, launcher/proxy reconnect, flags, plugin behavior, and causal/graph diagnostics. Some entries are historical narrative or benchmark evidence; the inventory records those as historical when detected. Live playbook instructions must be rewritten or deleted with the owning route, not left as documentation that teaches a removed command.

Ownership: phase 002 updates generator templates and surviving source-owned continuity guidance; phase 003 removes memory install entries, server package references, delete-only feature catalog sections, and memory manual-testing scenarios. Preserve unrelated Code Mode, skill-advisor, and generic deep-loop documentation.

## Finding 7 — environment catalog is a mixed server/retained-infrastructure contract

`.env.example` dedicates sections to memory DB paths, launcher/daemon/IPC/validation flags (`:68-110`), graph/cognitive/learning flags (`:230-310`), embedding/HF model-server variables (`:446-461`), and the memory CLI front door (`:578-593`). The aggregate MCP `ENV-REFERENCE.md` contains the server’s complete flag catalog. The scoped machine inventory measures 407 distinct `SPECKIT_*` tokens in the server tree and 649 distinct external tokens (including advisor, git, completion, deep-loop, and historical/read-site vocabulary); these are catalog observations, not a deletion count.

Delete candidates include `SPECKIT_DB_*`, `MEMORY_DB_PATH`, memory launcher/proxy/bridge/lease/retry variables, `SPECKIT_SPEC_MEMORY_CLI_*`, `SYSTEM_SPEC_MEMORY_*`, and memory-only graph/search/save flags. Retain or reclassify `SPECKIT_HF_*`, `HF_EMBED_SERVER_URL`, `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, advisor thresholds, generic IPC variables, and generic deep-loop flags when an advisor/shared owner remains. Phase 002 owns the split; phase 003 removes the server-only rows from `.env.example`, ENV-REFERENCE, config notes, and flag tests.

## Live implementation/test counts from the exhaustive index

The external live rows in this iteration are distributed as follows. Counts are hit-lines, with unique live files in parentheses:

| Surface type | Live hit-lines | Unique live files | Dominant action |
|---|---:|---:|---|
| agent | 200 | 35 | 002 rewire grants and retrieval instructions |
| command | 666 | 87 | 002 rewire surviving workflows; 003 delete obsolete routes |
| skill/reference | 460 | 92 | 002 rewire contracts and references |
| catalog/playbook/benchmark | 3,135 | 508 | rewrite live procedures; retire delete-only scenarios |
| code | 366 | 93 | split shared imports; remove server lifecycle branches |
| test | 482 | 65 | update replacement tests; remove memory-only suites |
| hook | 97 | 30 | rewire injection; remove memory hook adapter |
| plugin/bridge | 74 | 12 | 003 delete plugin/bridge tests and implementation |
| bin launcher/shim | 215 | 32 | 003 delete memory launcher/CLI branches; retain advisor/HF |
| config/metadata | 83 | 21 | remove memory entries; preserve advisor config |
| environment | 334 | 2 | split server flags from shared/advisor flags |
| package/script | 3 | 2 | remove memory workspace/scripts |

The complete path/line classification, including historical rows and the aggregate server entry, is in `inventory.external.json`; this table is a compact live implementation view, not a replacement for the row-level inventory.

## Break-risk seams requiring explicit handoff

1. `workflow.ts` → `@spec-kit/mcp-server/api/indexing`: remove only after generated/file-local replacement is available.
2. Orphan/session cleanup → launcher/context-server/HF sockets: preserve advisor/HF supervision while deleting memory daemon classes.
3. Shared embeddings/IPC → both memory and skill-advisor: split ownership before deleting DB/socket constants.
4. Deep-loop YAML/reducer/tests → `memory_save`/`memory_context`: retain lineage state and replace only MCP persistence.
5. Installer/package/feature catalog → future generated commands: update source templates before deleting generated consumers.

## Negative knowledge

- `.utcp_config.json` remains a non-target MCP configuration; no system-spec-memory entry was found.
- No `.devin/agents` live memory row was found in the scoped inventory; historical matches elsewhere remain recorded when present.
- The system-skill-advisor server and its own database/launcher are not delete targets; shared HF socket use is confirmed by both runtime config notes and source comments.

## New information ratio

`0.65` — this iteration adds source-import, package, lifecycle, test, template, and flag ownership; it confirms the earlier route findings rather than changing the tool or server-size baseline.
