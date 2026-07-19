---
title: "Code Graph: Manual Testing Playbook"
description: "Operator validation package for the system-code-graph skill and mk-code-index MCP server, covering readiness, structural queries, detect_changes, context retrieval, coverage graph references and doctor-code-graph policy."
trigger_phrases:
  - "system-code-graph manual testing playbook"
  - "mk-code-index manual testing playbook"
  - "code graph validation"
  - "code graph runtime playbook"
importance_tier: "important"
version: 1.2.0.23
---
# Code Graph: Manual Testing Playbook

This playbook validates the code graph runtime at `.opencode/skills/system-code-graph/mcp-server/`. Live MCP examples use the `mk-code-index` namespace as `mcp__mk_code_index__*`, while the stable tool IDs remain `code_graph_*` and `detect_changes`. Since the 028 MCP-to-CLI program, the same tools are also reachable through the daemon-backed `node .opencode/bin/code-index.cjs` CLI (the transport-down fallback), covered by scenario 025.

---

## 1. OVERVIEW

The playbook contains 28 scenarios across 9 groups. It targets the current reality map: read-path checks are bounded and half-auto, full scan/verify/status are operator actions, `detect_changes` is read-only and blocks on stale state, and coverage graph automation is limited to deep-loop command YAML. Group 09 adds post-rename infrastructure probes.

| Group | Scenario Files |
| --- | --- |
| Read-path freshness | [read-path-freshness](../manual-testing-playbook/read-path-freshness) |
| Manual scan / verify / status | [manual-scan-verify-status](../manual-testing-playbook/manual-scan-verify-status) |
| Detect changes | [detect-changes](../manual-testing-playbook/detect-changes) |
| Context retrieval | [context-retrieval](../manual-testing-playbook/context-retrieval) |
| Coverage graph | [coverage-graph](../manual-testing-playbook/coverage-graph) |
| MCP tool surface | [mcp-tool-surface](../manual-testing-playbook/mcp-tool-surface) |
| Doctor code graph | [doctor-code-graph](../manual-testing-playbook/doctor-code-graph) |
| Post-rename infrastructure | [post-rename-infrastructure](../manual-testing-playbook/post-rename-infrastructure) |
| Plugins and hooks | [plugins-and-hooks](../manual-testing-playbook/plugins-and-hooks) |

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
- CLI fallback calls are shown as `node .opencode/bin/code-index.cjs <tool> [--flags]`; sandbox them with a fresh `SPECKIT_IPC_SOCKET_DIR` so host daemons stay untouched.
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
| 001 | ensure-ready selective reindex | [ensure-ready-selective-reindex.md](../manual-testing-playbook/read-path-freshness/ensure-ready-selective-reindex.md) |
| 002 | query self-heal stale file | [query-self-heal-stale-file.md](../manual-testing-playbook/read-path-freshness/query-self-heal-stale-file.md) |

---

## 8. MANUAL SCAN / VERIFY / STATUS

| ID | Scenario | File |
| --- | --- | --- |
| 003 | code_graph_scan incremental | [code-graph-scan-incremental.md](../manual-testing-playbook/manual-scan-verify-status/code-graph-scan-incremental.md) |
| 004 | code_graph_scan full | [code-graph-scan-full.md](../manual-testing-playbook/manual-scan-verify-status/code-graph-scan-full.md) |
| 005 | code_graph_verify blocked on stale | [code-graph-verify-blocked-on-stale.md](../manual-testing-playbook/manual-scan-verify-status/code-graph-verify-blocked-on-stale.md) |
| 006 | code_graph_status readonly | [code-graph-status-readonly.md](../manual-testing-playbook/manual-scan-verify-status/code-graph-status-readonly.md) |

---

## 9. DETECT CHANGES

| ID | Scenario | File |
| --- | --- | --- |
| 007 | detect_changes no inline index | [detect-changes-no-inline-index.md](../manual-testing-playbook/detect-changes/detect-changes-no-inline-index.md) |
| 024 | detect_changes with multi-file unified diff (F018 coverage) | [detect-changes-multi-file-diff.md](../manual-testing-playbook/detect-changes/detect-changes-multi-file-diff.md) |

---

## 10. CONTEXT RETRIEVAL

| ID | Scenario | File |
| --- | --- | --- |
| 008 | code_graph_context readiness block | [code-graph-context-readiness-block.md](../manual-testing-playbook/context-retrieval/code-graph-context-readiness-block.md) |
| 028 | code_graph_context CALLS edge-confidence differentiation (edge-confidence-differentiation flag gated) | [code-graph-context-edge-confidence-differentiation.md](../manual-testing-playbook/context-retrieval/code-graph-context-edge-confidence-differentiation.md) |
| 029 | code_graph_context seeded-PPR impact ranking, benchmark-only CUT verdict (seeded-ppr-ranking flag gated) | [code-graph-context-seeded-ppr-ranking.md](../manual-testing-playbook/context-retrieval/code-graph-context-seeded-ppr-ranking.md) |

---

## 11. COVERAGE GRAPH

| ID | Scenario | File |
| --- | --- | --- |
| 009 | deep_loop_graph_convergence yaml fire | [deep-loop-graph-convergence-yaml-fire.md](../manual-testing-playbook/coverage-graph/deep-loop-graph-convergence-yaml-fire.md) |
| 010 | deep_loop_graph_upsert conditional | [deep-loop-graph-upsert-conditional.md](../manual-testing-playbook/coverage-graph/deep-loop-graph-upsert-conditional.md) |

---

## 12. MCP TOOL SURFACE

| ID | Scenario | File |
| --- | --- | --- |
| 011 | tool call shape validation (authoritative tool list: `mcp-server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` + `TOOL_DEFINITIONS` alias) | [tool-call-shape-validation.md](../manual-testing-playbook/mcp-tool-surface/tool-call-shape-validation.md) |
| 022 | code_graph_query blast_radius multi-subject + transitive (F018 coverage) | [code-graph-query-blast-radius.md](../manual-testing-playbook/mcp-tool-surface/code-graph-query-blast-radius.md) |
| 016 | MCP tool manifest post-rename | [mcp-tool-manifest-post-rename.md](../manual-testing-playbook/mcp-tool-surface/mcp-tool-manifest-post-rename.md) |
| 025 | code-index CLI fallback surface (028: list-tools parity, warm-only 75, usage 64, blocked-read) | [code-index-cli-fallback-surface.md](../manual-testing-playbook/mcp-tool-surface/code-index-cli-fallback-surface.md) |
| 026 | code_graph_query asOf time-travel relationship reads (bitemporal-reads flag gated) | [code-graph-query-asof-time-travel.md](../manual-testing-playbook/mcp-tool-surface/code-graph-query-asof-time-travel.md) |
| 027 | code_graph_query BM25 fallback-only symbol suggestions (resolver flag gated) | [code-graph-query-bm25-symbol-resolver.md](../manual-testing-playbook/mcp-tool-surface/code-graph-query-bm25-symbol-resolver.md) |

---

## 13. DOCTOR CODE GRAPH

| ID | Scenario | File |
| --- | --- | --- |
| 015 | doctor apply mode policy | [doctor-apply-mode-policy.md](../manual-testing-playbook/doctor-code-graph/doctor-apply-mode-policy.md) |
| 023 | code_graph_apply sub-operations rescan/prune/repair (F018 coverage) | [code-graph-apply-sub-operations.md](../manual-testing-playbook/doctor-code-graph/code-graph-apply-sub-operations.md) |

---

## 14. POST-RENAME INFRASTRUCTURE

| ID | Scenario | File |
| --- | --- | --- |
| 017 | launcher startup prefix | [launcher-startup-prefix.md](../manual-testing-playbook/post-rename-infrastructure/launcher-startup-prefix.md) |
| 018 | mcp.json server key rename | [mcp-json-server-key-rename.md](../manual-testing-playbook/post-rename-infrastructure/mcp-json-server-key-rename.md) |
| 019 | database path verification | [database-path-verification.md](../manual-testing-playbook/post-rename-infrastructure/database-path-verification.md) |
| 020 | TypeScript build and entry point | [typescript-build-and-entry-point.md](../manual-testing-playbook/post-rename-infrastructure/typescript-build-and-entry-point.md) |
| 021 | root dist cleanup verification (file retains historical name `021-unicode-normalization-fix-from-009`) | [unicode-normalization-fix-from-009.md](../manual-testing-playbook/post-rename-infrastructure/unicode-normalization-fix-from-009.md) |

---

## 15. PLUGINS AND HOOKS

| ID | Scenario | File |
| --- | --- | --- |
| code-graph-freshness-guard | Code Graph Freshness Guard | [code-graph-freshness-guard.md](../manual-testing-playbook/plugins-and-hooks/code-graph-freshness-guard.md) |
| code-graph-plugin | Code Graph OpenCode Plugin | [code-graph-plugin.md](../manual-testing-playbook/plugins-and-hooks/code-graph-plugin.md) |

---

## 16. AUTOMATED TEST CROSS-REFERENCE

Automated coverage lives in the code_graph runtime tests and build checks. Use this section as the manual-to-automated trace point when recording evidence for release review.

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

Each scenario maps to the runtime catalog at [../feature-catalog/feature-catalog.md](../feature-catalog/feature-catalog.md).
