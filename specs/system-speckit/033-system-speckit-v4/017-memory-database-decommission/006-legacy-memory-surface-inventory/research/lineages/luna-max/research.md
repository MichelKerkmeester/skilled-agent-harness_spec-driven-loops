---
title: "Deep Research: system-spec-memory Legacy Surface Inventory"
trigger_phrases: []
---
# Deep Research: system-spec-memory Legacy Surface Inventory

Lineage: luna-max (detached fan-out) | Session: fanout-luna-max-1788366600409-l2538s | Spec: .opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory | Stop: maxIterations (5)

## 1. Executive Summary

The repository contains a substantially wider retirement surface than the parent’s logical consumer estimate suggests. The final case-insensitive, global-ignore-aware inventory records 18,799 external paths and 92,554 matching hit-lines, each with an explicit path, line, surface type, reference kind, lifecycle, phase owner, concrete action, break risk, matched terms, and extracted flags. The target system-spec-memory MCP server tree is represented once as the required aggregate entry.

The actionable order is strict:

1. Phase 002 rewires live agents, commands, skills, hooks, deep-loop persistence, workflow indexing, package/process seams, generators, tests, catalogs, and environment contracts to the approved generated trigger-index, ripgrep, lineage-local, and file-local successors.
2. Phase 002 splits shared embedding, HF model-server, IPC, and advisor paths so they retain a non-memory owner.
3. Phase 003 deletes the memory-only server tree, registrations, launchers, plugin/bridge family, routes, package/process lifecycle, server-only flags, install/catalog entries, and obsolete tests.

Five high-risk old-contract seams must be preserved or split before deletion: workflow.ts importing server indexing APIs; orphan/session cleanup sharing daemon and HF socket logic; shared embeddings/HF/IPC serving system-skill-advisor; deep-loop YAML/reducer/ledger state using memory persistence; and templates/install/catalogs that generate future consumers.

## 2. Methodology

Parent spec.md and goal.md were read before the first research action. Five mandatory research iterations were executed with executor metadata cli-codex model gpt-5.6-luna, max reasoning, fast tier. Convergence was telemetry only; the run continued through maxIterations 5.

The final inventory uses rg --json with --ignore-case and --no-ignore-global. It excludes .git, node_modules, z_archive, this lineage, and the complete .opencode/skills/system-spec-kit/mcp-server tree. The target MCP tree is separately censused and represented by one aggregate object. JSON event parsing prevents colon-containing paths from being split. A final scan-to-artifact parity check passed with zero extra rows, zero stale rows, zero parser errors, zero required-field omissions, zero exclusion violations, and zero malformed path keys.

Lifecycle classification is structural and intentionally conservative. Paths under runs, research, reports, reviews, deltas, archive, fixtures, snapshots, and JSONL are historical narrative; other matching paths are live instruction or implementation. This is a triage label, not a claim that every historical-looking file is semantically inert.

The complete row-level artifact is inventory.external.json. It is the authoritative exhaustive list for this lineage; the tables below are summaries and must not replace it.

## 3. Baseline and parent-estimate corrections

At the final parity snapshot, the external scan had 60,768 live hit-lines across 16,016 live paths and 31,786 historical hit-lines across 2,783 historical paths. The artifact records 872 distinct external flag identifiers after case normalization.

The target MCP tree census is:

| Scope | Files | Bytes | Newline-counted lines |
|---|---:|---:|---:|
| Worktree regular files | 3,203 | 32,456,976 | 618,794 |
| Tracked files | 1,481 | 20,273,034 | 453,964 |

The target-tree case-insensitive match census is 706 files and 7,858 matching lines. The schema exposes exactly 41 tools; 37 names occur literally in the target-tree scan because some schema/registration names are represented through aliases or structured fields. The aggregate records all 41 names and 410 unique server-tree flag identifiers.

The parent estimate of 41 tools is confirmed. The tracked tree is +1 file and +151 newline-counted lines against the parent estimate of 1,480 files and 453,813 lines. The parent’s 373-flag figure is not reproducible on the current target-tree scope of 410 or the external scope of 872; these scopes include different shared/advisor aliases. The approximately 167-consumer figure is a logical ownership estimate, not a raw path count. The inventory finds 9,016 live paths with at least one 002 row and 4,893 with at least one 003 row, but those sets mix docs, specs, generated evidence, and multiple rows per consumer.

## 4. Findings and classified counts

### 4.1 Surface type

Counts are all hit-lines / live hit-lines followed by all paths / live paths. The mcp-server row here is only the external bucket for non-target MCP-server paths; the deprecating tree is the separate aggregate in Section 5.

| Surface type | Hit-lines all/live | Paths all/live |
|---|---:|---:|
| spec packet | 73,919 / 46,252 | 15,213 / 12,693 |
| catalog/playbook/benchmark | 12,213 / 8,414 | 2,024 / 1,888 |
| documentation | 142 / 142 | 17 / 17 |
| config/metadata | 85 / 85 | 5 / 5 |
| hook | 1,504 / 1,378 | 494 / 442 |
| agent | 305 / 277 | 84 / 72 |
| command | 633 / 633 | 84 / 84 |
| skill/reference | 1,343 / 1,343 | 481 / 481 |
| code | 550 / 542 | 122 / 117 |
| bin launcher/shim | 270 / 270 | 30 / 30 |
| plugin/bridge | 37 / 37 | 5 / 5 |
| test | 725 / 612 | 141 / 88 |
| environment | 339 / 339 | 2 / 2 |
| package/script | 2 / 2 | 2 / 2 |
| CI | 0 / 0 | 0 / 0 |
| mcp-server external bucket | 487 / 442 | 95 / 90 |

The large spec-packet total is a repository-surface total, not a runtime-consumer total. Historical evidence outside z_archive remains visible and individually classified.

### 4.2 Reference kind

| Reference kind | Hit-lines all/live | Paths all/live |
|---|---:|---:|
| env flag | 44,860 / 34,210 | 14,619 / 13,600 |
| doc mention | 31,618 / 14,831 | 5,678 / 4,005 |
| code import | 5,546 / 3,433 | 2,041 / 1,309 |
| config entry | 6,454 / 5,849 | 1,053 / 938 |
| tool call | 3,550 / 1,969 | 1,096 / 697 |
| tool grant | 147 / 115 | 82 / 74 |
| test | 379 / 361 | 43 / 40 |

The primary kind is assigned by a conservative first-match classifier; the complete matched-term and flag arrays remain on each row. Mixed lines therefore retain their evidence even when one primary kind is reported.

### 4.3 Phase ownership

| Owner | Hit-lines all/live | Paths all/live | Action |
|---|---:|---:|---|
| 002 rewire | 41,078 / 28,928 | 10,187 / 9,016 | Replace live calls, grants, instructions, imports, and shared branches before deletion |
| retain exception | 19,022 / 7,010 | 2,725 / 2,138 | Split or preserve advisor/HF/IPC/shared capability; never blind-delete |
| 003 delete | 32,454 / 24,830 | 5,920 / 4,893 | Remove memory-only registrations, server tree, routes, launchers, plugin, package, flags, and obsolete tests after 002 |

These are row classifications and are intentionally non-disjoint. A single path can contain a memory-only row and a shared-advisor row.

## 5. MCP server aggregate

The target tree is one inventory entry at mcpServer in inventory.external.json. Its 41 exposed tools are:

checkpoint_create, checkpoint_delete, checkpoint_list, checkpoint_restore, embedder_list, embedder_set, embedder_status, eval_reporting_dashboard, eval_run_ablation, memory_bulk_delete, memory_causal_link, memory_causal_stats, memory_causal_unlink, memory_context, memory_delete, memory_drift_why, memory_embedding_reconcile, memory_get_learning_history, memory_health, memory_index_scan, memory_index_scan_cancel, memory_index_scan_status, memory_ingest_cancel, memory_ingest_start, memory_ingest_status, memory_learned_clear, memory_learned_expire, memory_list, memory_match_triggers, memory_quick_search, memory_retention_sweep, memory_save, memory_search, memory_stats, memory_update, memory_validate, session_bootstrap, session_health, session_resume, task_postflight, and task_preflight.

The target tree owns tool schemas and handlers in .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:931-980 and context-server.ts:248-287,960-972; the workflow API and package/process surfaces are linked from the external rows. Delete the tree as one unit in phase 003 only after every external live consumer has a replacement. Do not infer that the aggregate’s shared embeddings, HF socket, or generic IPC code is delete-only without tracing its retained owner.

## 6. Runtime and requested-surface handoff

The live configuration roots are:

| Root | Live rows |
|---|---:|
| .claude/mcp.json | 19 |
| .codex/config.toml | 15 |
| .cursor/mcp.json | 19 |
| .pi/mcp.json | 13 |
| opencode.json | 19 |
| .env.example | 334 |

The command and agent families are covered: .opencode/commands has 84 paths and 633 rows; .opencode/agents 8/49; .claude/agents 11/57; .codex/agents 8/47; .pi/agents 8/47. Hooks have 24 paths and 102 rows; plugins have 13 paths and 85 rows; bins have 34 paths and 285 rows. AGENTS.md has 11 rows.

Negative controls were checked after bypassing the global ignore: .devin, .claude/hooks, root CLAUDE.md, root REPO RULES.md, and .utcp_config.json have zero target rows. ENV-REFERENCE.md below the excluded target server tree is covered by the aggregate. The absence of a matching row is evidence for no target term, not authorization to modify a negative-control file.

## 7. Phase 002 rewire worklist

1. Rewrite context/agent families, /memory:search, /memory:save, /memory:manage, /doctor memory, and deep-loop YAML grants/calls to lineage-local JSONL/state, generated trigger indexing, ripgrep retrieval, or the approved file-local successor.
2. Replace workflow.ts imports of @spec-kit/mcp-server/api/indexing, automatic memory_index_scan follow-up instructions, and .system-spec-memory-launcher.json daemon detection with source-owned index/lease behavior.
3. Split SPEC_KIT_DB_DIR, SPECKIT_DB_DIR, MEMORY_DB_PATH, retry/launcher/IPC settings, and HF-local branches so system-skill-advisor and retained model-server consumers continue to work.
4. Update command YAML/TXT assets, SKILL.md/reference files, graph-metadata/description JSON, templates, install guidance, feature catalogs, manual playbooks, and generated-artifact producers.
5. Rewrite deep-loop reducer-facing persistence tests so memory_save and memory_context become lineage-local state while locks, projections, ledger state, and the loop contract remain.
6. Add replacement tests and route checks before deleting old assertions. The inventory is a handoff list, not permission to bulk-replace historical narrative.

## 8. Phase 003 deletion worklist

1. Delete the complete .opencode/skills/system-spec-kit/mcp-server tree as one unit, then remove its workspace/bin/script and server-only lock/package entries.
2. Delete .opencode/bin/system-spec-memory-launcher.cjs, spec-memory.cjs, memory allowlists in launcher-session-proxy.cjs, .opencode/plugins/system-spec-memory.js, memory hook adapters, and memory-only plugin tests/playbooks.
3. Remove memory registrations and grants from all five runtime configs; remove server-only .env.example and ENV-REFERENCE rows, install/catalog entries, launcher leases, orphan/session cleanup branches, and obsolete memory routes.
4. Preserve system-skill-advisor, shared HF model-server capability, shared embeddings/IPC, deep-loop lock/projection state, generic graph/council infrastructure, and historical evidence unless the row is explicitly server-only.

## 9. Break-risk surfaces

The following surfaces still speak the old contract and can break if removal is broad:

- workflow.ts → @spec-kit/mcp-server/api/indexing. Removing only configuration leaves a compile/import failure. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:101-106,605-640]
- deploy/orphan/session cleanup → context-server, launcher leases, daemon-ipc.sock, and hf-embed.sock. Removing all process/socket logic can strand memory daemons or kill a retained advisor/embedder. [SOURCE: .opencode/skills/system-spec-kit/scripts/deploy-mcp.sh:49-82; .opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515; .opencode/scripts/session-cleanup.sh:102-113]
- shared embeddings/HF-local/IPC → memory and system-skill-advisor. Split memory-only DB branches while retaining the shared model-server socket. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:4-13; .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:32-35,371-382; .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:134,187,202-203]
- deep-loop YAML/reducer/ledger/tests → memory_save/memory_context. Remove MCP persistence, not the loop state machine. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347; .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87]
- generators/install/catalogs → future artifacts. Update producers before deleting generated consumers. [SOURCE: .opencode/install-guides/install-scripts/install-all.sh:5-34,209-223; .opencode/commands/create/assets/create-skill-auto.yaml; .opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48]

## 10. Eliminated Alternatives

| Approach | Why eliminated | Evidence |
|---|---|---|
| Trust the prior colon-delimited scan | It created malformed path keys for colon-containing paths | inventory.external.json parser correction in iteration 004 |
| Use default ignore behavior as exhaustive | The global ignore hid root opencode.json and .utcp_config.json | rg debug output; final --no-ignore-global scan |
| Stop when convergence crossed the threshold | The operator fixed stopPolicy to max-iterations and required all five iterations | deep-research-config.json; iterations 001–005 |
| Treat every SPECKIT identifier as delete-only | Advisor, HF, IPC, deep-loop, completion, and historical flags share the vocabulary | .env.example:68-110,230-310,446-461; advisor/HF sources |
| Delete shared embedding/HF/IPC or deep-loop state with the server | Those seams have retained owners and would break live contracts | Section 9 source anchors |
| Call the memory MCP during inventory | The task is decommissioning the subsystem and the lineage is write-restricted | detachedLineage in deep-research-config.json |

## Divergence Map

- Pivots taken: no graph-backed divergent pivot was dispatched; the five iterations broadened the search axis from registrations to consumers, implementation/process seams, lifecycle classification, and final parity.
- Saturated directions: runtime configuration, agent/command/skill grants, hooks/plugins/bins, package/process APIs, shared HF/IPC, deep-loop persistence, templates/catalogs/playbooks, and historical-vs-live coverage.
- Audited operator overrides: artifact_dir was bound directly to the fanout lineage override; resolveArtifactRoot was not run; parent fanout merge, spec mutation, memory save, validation, and git staging were omitted because they would write outside the authorized lineage.
- Evidence: iteration-001.md through iteration-005.md, their deltas and gateway receipts, deep-research-state.jsonl, and inventory.external.json.
- Remaining frontier: implementation-time semantic ownership review of mixed rows, exact replacement parity for continuity writes, and final post-rewire residue scans. Those are phase 002/003 work, not unresolved inventory coverage.

## 11. Preserve Set

- System-skill-advisor registration, database/launcher, advisor thresholds, and advisor-specific memory DB pin behavior.
- Shared HF model-server and hf-embed socket capability, shared embedding adapters, and generic IPC settings with a surviving owner.
- Deep-loop locks, append-only projections, reducer state, and lineage-local continuity writer contract.
- Historical research, run, report, benchmark, and JSONL evidence outside z_archive, labeled historical and excluded from live route validation.
- Generic graph/council/completion/spec-gate infrastructure unless a row is explicitly system-spec-memory-only.

## 12. Open Questions and Risks

- The parent’s approximately 167 logical consumers still need owner-by-owner reconciliation against the row inventory; raw path counts cannot answer it.
- Mixed rows in shared files need source-level edits rather than a token deletion. In particular, HF socket and IPC paths must be checked for advisor use.
- The replacement must state honest loss for semantic paraphrase, vector/BM25/graph fusion, decay, access tracking, and causal traversal where ripgrep cannot preserve the old behavior.
- The final scan classifies lifecycle by path structure. Re-open ambiguous live-vs-historical rows if an implementation target sits under a research or report directory.
- No repository tests were run by this lineage because the user prohibited repository tooling and out-of-scope writes; implementation phases must provide the authoritative runtime and test gates.

## 13. Convergence Report

| Iteration | Focus | newInfoRatio | Status |
|---|---|---:|---|
| 1 | registrations, launch/config/transport, baseline | 0.94 | complete |
| 2 | agent/command routes, doctor, runtime mirrors, tool grants | 0.80 | complete |
| 3 | implementation, package, process, shared seams, tests, templates | 0.65 | complete |
| 4 | lossless parser, global-ignore coverage, lifecycle and phase counts | 0.45 | complete |
| 5 | exact-query parity and requested-root audit | 0.25 | complete |

Stop reason: maxIterationsReached. Total iterations: 5. Convergence threshold: 0.05, used as telemetry only. During synthesis, a stricter case-insensitive coverage pass expanded the artifact beyond the exact-case iteration-005 snapshot; a final case-insensitive parity audit then passed with 92,554 rows and 18,799 paths. The loop did not synthesize early.

## 14. References

- [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:156-163] parent phase ordering and scope; parent estimates are discussed in Section 3.
- [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:43-55] frozen replacement and non-goals.
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:931-980] exposed tool definitions.
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:248-287,960-972] runtime tool registration/call boundary.
- [SOURCE: .claude/mcp.json; .codex/config.toml; .cursor/mcp.json; .pi/mcp.json; opencode.json] runtime registration matrix.
- [SOURCE: .env.example:68-110,230-310,446-461,578-593] environment and shared-infrastructure catalog.
- [SOURCE: .opencode/agents/context.md:20-21,74-80,146,172-198] canonical context consumer; mirrored runtime agent files are listed in the inventory.
- [SOURCE: .opencode/commands/doctor/_routes.yaml:33-50,65-79,105-117; .opencode/commands/doctor/assets/doctor-memory.yaml:21-44,143-172] doctor route family.
- [SOURCE: .opencode/plugins/system-spec-memory.js:32-52,93-126,352-626; .opencode/hooks/spec-memory/README.md:18-126] plugin, bridge, hook, and injection family.
- [SOURCE: inventory.external.json] exhaustive case-insensitive path-plus-line inventory and target-tree aggregate.
- [SOURCE: resource-map.md] synthesis source map for the lineage.

## 15. Artifact and scope note

This is a detached research handoff, not an implementation. All files created or modified by this lineage are inside the luna-max directory. Parent spec files, generated context, memory databases, parent resource maps, repository validation, and git state were intentionally left untouched.
