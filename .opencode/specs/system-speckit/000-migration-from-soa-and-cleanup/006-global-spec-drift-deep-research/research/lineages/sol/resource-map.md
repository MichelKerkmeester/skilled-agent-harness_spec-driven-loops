# Resource Map: SOL Global Spec-Drift Lineage

This map records the source families used by the SOL lineage. It is generated from converged iteration evidence because the owning packet had no `resource-map.md` at initialization.

## 1. Lineage Control and Research Contract

| Resource | Role |
|---|---|
| `deep-research-config.json` | Immutable topic, convergence, executor, and lineage-boundary configuration. |
| `deep-research-state.jsonl` | Append-only iteration, blocked-stop, convergence, and synthesis lifecycle state. |
| `deep-research-strategy.md` | Questions, negative knowledge, exhausted approaches, and next focus. |
| `findings-registry.json` | Consolidated question and finding projection. |
| `deep-research-dashboard.md` | Iteration and convergence projection. |
| `iterations/iteration-001.md` ... `iteration-009.md` | Write-once evidence narratives. |
| `deltas/iter-001.jsonl` ... `iter-009.jsonl` | Write-once machine-readable iteration deltas. |

## 2. Inventory and Governance

| Resource | Evidence provided |
|---|---|
| `.opencode/specs/**/spec.md` | Raw and active candidate inventory, depth, track distribution, numbering, and status. |
| `AGENTS.md` | Current phase-parent lean-trio and documentation-level policy. |
| `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md` | Parent sequencing, accepted skipped phases, and 006-to-007 handoff gate. |
| `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md` | Full-tree scope, research requirements, and durable-output gate. |

## 3. Migration and Topology Evidence

| Resource | Evidence provided |
|---|---|
| `.../001-system-speckit-renumber/implementation-summary.md` | Clean `026-041` migration plus surviving deleted packet-pointer target. |
| `.../002-system-deep-loop-renumber/implementation-summary.md` | Selected-but-skipped renumber, unknown gaps, stale `children_ids`. |
| `.../003-system-code-graph-cleanup/implementation-summary.md` | Clean track numbering and 152 deferred stale index entries. |
| `.../004-sk-doc-alignment/implementation-summary.md` | Operator-skipped ownership and active concurrent migration boundary. |
| `.../005-sk-design-reconstruct/implementation-summary.md` | Reconstructed packet set and stale track-root metadata follow-up. |
| `.opencode/specs/sk-doc/015-sk-doc-parent/{010..015}-*/spec.md` | Exact current proof of six duplicated sibling prefixes. |
| `.opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup/{spec,plan,tasks,implementation-summary}.md` | Packet-wide deleted ownership target. |

## 4. Completion and Metadata Evidence

| Resource | Evidence provided |
|---|---|
| Active `spec.md`, `graph-metadata.json`, `checklist.md` files | Fleet reconciliation counts across status, checklists, continuity, and parent/child state. |
| `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/{spec.md,graph-metadata.json}` | Current terminal-spec/graph-planned example. |
| `.opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/{spec.md,graph-metadata.json}` | Current draft-spec/graph-complete example. |

## 5. Context-Optimization Program Evidence

| Resource | Evidence provided |
|---|---|
| `system-speckit/z_archive/024-compact-code-graph/001-precompact-hook/implementation-summary.md` | PreCompact cache, SessionStart injection, 4,000-token and latency bounds. |
| `system-speckit/z_archive/024-compact-code-graph/002-session-start-hook/implementation-summary.md` | Four-way source-aware session priming. |
| `system-speckit/z_archive/024-compact-code-graph/023-context-preservation-metrics/implementation-summary.md` | In-memory quality metrics, deferred persistence/status unification, packet-time limitations. |
| `system-speckit/z_archive/024-compact-code-graph/024-hookless-priming-optimization/implementation-summary.md` | Session snapshots, minimal resume, bootstrap, and telemetry. |
| `system-deep-loop/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts/implementation-summary.md` | Transitional no-write redirect and bounded workflow snapshots. |
| `.../003-discoverability-docs-mirrors-and-index/implementation-summary.md` | Active discoverability removal and redirect transition. |
| `.../004-fixtures-benchmarks-and-runtime-cleanup/implementation-summary.md` | Active dispatch closure and historical compatibility boundary. |
| `continuity-refactor-gates/research/iterations/iteration-005.md` | Thin continuity, pointer-first resume, dedup savings and latency claims. |
| `continuity-refactor-gates/research/iterations/iteration-040.md` | Explicit automatic narrative-compaction deferral. |
| `continuity-refactor-gates/handover.md` | Automated/manual gate evidence and later remediation statement. |

## 6. Current Implementation Verification

| Resource | Evidence provided |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Current bounded merge, cache persistence, and provenance. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Current compact/startup/resume/clear routing. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Current composite bootstrap and telemetry. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | Current minimal resume and bootstrap event handling. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts` | Final traffic-light status calculated separately from quality score. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/context-metrics.ts` | Process-local metric state and aligned 24-hour graph threshold. |
| `.opencode/commands/deep/*` | Current absence of standalone deep-context command. |
| `.opencode/skills/system-deep-loop/**` | Historical-only remaining deep-context reference classification. |

## 7. Teardown Contract

| Resource | Evidence provided |
|---|---|
| `007-memory-db-teardown/spec.md` | Exact allowlist, excluded databases, hard gates, and irreversible classes. |
| `007-memory-db-teardown/plan.md` | Stop-delete-verify ordering and historyless rebuild boundary. |
| `007-memory-db-teardown/tasks.md` | Named execution and verification steps. |
| `007-memory-db-teardown/implementation-summary.md` | Confirms scaffold-only state and unresolved execution decisions. |

## 8. Source-Coverage Summary

| Source family | Coverage role |
|---|---|
| Repository inventory | Full-tree scale and active/historical classification. |
| Canonical spec documents | Status, ownership, migration intent, and limitations. |
| Generated metadata | Graph status and parent/child projection. |
| Current implementation | Corroborates mechanisms and corrects archived limitations. |
| Current command/path inventory | Independent active-surface verification. |
| Teardown contract | Destructive boundary, rebuildability, and irreversible loss. |

Known gap: structural caller verification was unavailable because the current code graph contained zero nodes. This is reported as unavailable evidence, not silently replaced with a graph claim.
