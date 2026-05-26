---
title: "Code Graph: Manual Testing Playbook"
description: "Operator validation package for the system-code-graph skill and mk-code-index MCP server, covering readiness, structural queries, detect_changes, context retrieval, coverage graph references and doctor-code-graph policy."
trigger_phrases:
  - "system-code-graph manual testing playbook"
  - "mk-code-index manual testing playbook"
  - "code graph validation"
  - "code graph runtime playbook"
importance_tier: "important"
---
# Code Graph: Manual Testing Playbook

This playbook validates the code graph runtime at `.opencode/skills/system-code-graph/mcp_server/`. Live MCP examples use the `mk-code-index` namespace as `mcp__mk_code_index__*`, while the stable tool IDs remain `code_graph_*` and `detect_changes`.

---

## 1. OVERVIEW

The playbook contains 16 scenarios across 9 groups. It targets the current reality map: read-path checks are bounded and half-auto, full scan/verify/status are operator actions, `detect_changes` is read-only and blocks on stale state, and coverage graph automation is limited to deep-loop command YAML. Group 09 adds post-rename infrastructure probes. Group 10 adds the Devin CLI SessionStart hook scenario shipped in packet 036-cli-devin-code-graph-hook.

| Group | Scenario Files |
| --- | --- |
| Read-path freshness | [01--read-path-freshness](./01--read-path-freshness/) |
| Manual scan / verify / status | [02--manual-scan-verify-status](./02--manual-scan-verify-status/) |
| Detect changes | [03--detect-changes](./03--detect-changes/) |
| Context retrieval | [04--context-retrieval](./04--context-retrieval/) |
| Coverage graph | [05--coverage-graph](./05--coverage-graph/) |
| MCP tool surface | [06--mcp-tool-surface](./06--mcp-tool-surface/) |
| Doctor code graph | [08--doctor-code-graph](./08--doctor-code-graph/) |
| Post-rename infrastructure | [09--post-rename-infrastructure](./09--post-rename-infrastructure/) |
| Devin hooks | [10--devin-hooks](./10--devin-hooks/) |

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Build the MCP server before handler-level checks: `node .opencode/skills/system-code-graph/node_modules/typescript/bin/tsc -p .opencode/skills/system-code-graph/tsconfig.json`.
3. Use disposable workspace copies for file mutation, stale graph, scan and doctor apply scenarios.
4. Capture stdout, stderr, exit code and MCP JSON payload excerpts.

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Scenario ID and file path.
- Exact command or MCP call used.
- JSON fields that prove readiness, action, status or output shape.
- PASS, FAIL or SKIP verdict with one reason.

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands are shown as `bash: <command>`.
- MCP tool calls are shown as `mcp__mk_code_index__<tool>(<args>)` for the standalone code graph server.
- Slash-command scenarios cite the command and the YAML path. Run them in a disposable workspace.
- `->` separates sequential steps.

## 5. REVIEW PROTOCOL AND RELEASE READINESS

A scenario passes only when the expected fields appear and the transcript shows no hidden full scan, unrequested mutation or missing readiness block.

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

Operators may dispatch sub-agents in parallel waves for independent scenarios, especially read-only category checks. The primary use remains single-operator sequential execution so command transcripts, MCP payloads and verdict evidence stay easy to audit.

---

## 7. READ-PATH FRESHNESS

| ID | Scenario | File |
| --- | --- | --- |
| 001 | ensure-ready selective reindex | [001-ensure-ready-selective-reindex.md](./01--read-path-freshness/001-ensure-ready-selective-reindex.md) |
| 002 | query self-heal stale file | [002-query-self-heal-stale-file.md](./01--read-path-freshness/002-query-self-heal-stale-file.md) |

---

## 8. MANUAL SCAN / VERIFY / STATUS

| ID | Scenario | File |
| --- | --- | --- |
| 003 | code_graph_scan incremental | [003-code-graph-scan-incremental.md](./02--manual-scan-verify-status/003-code-graph-scan-incremental.md) |
| 004 | code_graph_scan full | [004-code-graph-scan-full.md](./02--manual-scan-verify-status/004-code-graph-scan-full.md) |
| 005 | code_graph_verify blocked on stale | [005-code-graph-verify-blocked-on-stale.md](./02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md) |
| 006 | code_graph_status readonly | [006-code-graph-status-readonly.md](./02--manual-scan-verify-status/006-code-graph-status-readonly.md) |

---

## 9. DETECT CHANGES

| ID | Scenario | File |
| --- | --- | --- |
| 007 | detect_changes no inline index | [007-detect-changes-no-inline-index.md](./03--detect-changes/007-detect-changes-no-inline-index.md) |
| 024 | detect_changes with multi-file unified diff (F018 coverage) | [024-detect-changes-multi-file-diff.md](./03--detect-changes/024-detect-changes-multi-file-diff.md) |

---

## 10. CONTEXT RETRIEVAL

| ID | Scenario | File |
| --- | --- | --- |
| 008 | code_graph_context readiness block | [008-code-graph-context-readiness-block.md](./04--context-retrieval/008-code-graph-context-readiness-block.md) |

---

## 11. COVERAGE GRAPH

| ID | Scenario | File |
| --- | --- | --- |
| 009 | deep_loop_graph_convergence yaml fire | [009-deep-loop-graph-convergence-yaml-fire.md](./05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md) |
| 010 | deep_loop_graph_upsert conditional | [010-deep-loop-graph-upsert-conditional.md](./05--coverage-graph/010-deep-loop-graph-upsert-conditional.md) |

---

## 12. MCP TOOL SURFACE

| ID | Scenario | File |
| --- | --- | --- |
| 011 | tool call shape validation (authoritative tool list: `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` + `TOOL_DEFINITIONS` alias) | [011-tool-call-shape-validation.md](./06--mcp-tool-surface/011-tool-call-shape-validation.md) |
| 022 | code_graph_query blast_radius multi-subject + transitive (F018 coverage) | [022-code-graph-query-blast-radius.md](./06--mcp-tool-surface/022-code-graph-query-blast-radius.md) |
| 016 | MCP tool manifest post-rename | [016-mcp-tool-manifest-post-rename.md](./06--mcp-tool-surface/016-mcp-tool-manifest-post-rename.md) |

---

## 13. DOCTOR CODE GRAPH

| ID | Scenario | File |
| --- | --- | --- |
| 015 | doctor apply mode policy | [015-doctor-apply-mode-policy.md](./08--doctor-code-graph/015-doctor-apply-mode-policy.md) |
| 023 | code_graph_apply sub-operations rescan/prune/repair (F018 coverage) | [023-code-graph-apply-sub-operations.md](./08--doctor-code-graph/023-code-graph-apply-sub-operations.md) |

---

## 14. POST-RENAME INFRASTRUCTURE

| ID | Scenario | File |
| --- | --- | --- |
| 017 | launcher startup prefix | [017-launcher-startup-prefix.md](./09--post-rename-infrastructure/017-launcher-startup-prefix.md) |
| 018 | mcp.json server key rename | [018-mcp-json-server-key-rename.md](./09--post-rename-infrastructure/018-mcp-json-server-key-rename.md) |
| 019 | database path verification | [019-database-path-verification.md](./09--post-rename-infrastructure/019-database-path-verification.md) |
| 020 | TypeScript build and entry point | [020-typescript-build-and-entry-point.md](./09--post-rename-infrastructure/020-typescript-build-and-entry-point.md) |
| 021 | unicode-normalization fix from 009 | [021-unicode-normalization-fix-from-009.md](./09--post-rename-infrastructure/021-unicode-normalization-fix-from-009.md) |

---

## 15. DEVIN HOOKS

Validates the Devin CLI `SessionStart` hook variant shipped in packet `036-cli-devin-code-graph-hook`. The hook source lives at `system-spec-kit/mcp_server/hooks/devin/session-start.ts` (intentional asymmetry vs the advisor pattern — see ADR-001 of packet 036). Registration lives in `.devin/hooks.v1.json` under `SessionStart`.

| ID | Scenario | File |
| --- | --- | --- |
| 025 | Devin CLI SessionStart Hook | [025-devin-session-start.md](./10--devin-hooks/025-devin-session-start.md) |

---

## 16. AUTOMATED TEST CROSS-REFERENCE

Automated coverage lives in the code_graph runtime tests and build checks. Use this section as the manual-to-automated trace point when recording evidence for release review.

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

Each scenario maps to the runtime catalog at [../feature_catalog/feature_catalog.md](../feature_catalog/feature_catalog.md).
