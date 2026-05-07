# Deep Review Report Final - Packet 070 Post-Fix Verification

## Verdict

**Status**: FAIL  
**Date**: 2026-05-05  
**Iterations**: 6-8 post-fix verification  
**Executor**: cli-codex (gpt-5.5, high, fast)  
**Scope**: on-disk reads, `sqlite3`, `skill_advisor.py`, and `skill_graph_compiler.py`; no MCP tools

## Executive Summary

Packet 070 is not commit-ready from this no-MCP post-fix review. The schema/family migration landed cleanly and the prior cleanup findings are fixed, but the primary P1-002 behavioral routing probe still returns `sk-code-review` ahead of `deep-review`.

The important nuance: shadow scoring now has the intended order for the primary prompt (`deep-review` 0.838 > `sk-code-review` 0.819333), but the actual returned top-1 is still live-ranked (`sk-code-review` 0.942 > `deep-review` 0.936). The user instruction says to use behavioral top-1 ordering as the verdict, so this is a FAIL.

## Iteration 6 - Schema Migration Integrity

**Status**: PASS - 9/9 checks passed.

| Check | Status | Evidence |
|---|---|---|
| SQLite file | PASS | `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite` exists. |
| SQLite schema CHECK | PASS | `family TEXT NOT NULL CHECK(family IN ('cli', 'mcp', 'sk-code', 'deep-loop', 'sk-util', 'system'))`. |
| SQLite distinct families | PASS | `cli`, `deep-loop`, `mcp`, `sk-code`, `sk-util`, `system`. |
| Source SQL CHECK | PASS | `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:126`. |
| Dist SQL CHECK | PASS | `.opencode/skills/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js:53`. |
| Compiler validation | PASS | `VALIDATION PASSED: all metadata files are valid`. |
| Per-skill metadata | PASS | `.opencode/skills/deep-review/graph-metadata.json:4`; `.opencode/skills/deep-research/graph-metadata.json:4`. |
| No active `sk-deep` metadata family | PASS | No hits from active metadata grep. |
| Compiled graph families | PASS | Families include `deep-loop`; members are `deep-research`, `deep-review`; `sk-deep present: False`. |

## Iteration 7 - Routing Probe

**Status**: FAIL - primary prompt top-1 is `sk-code-review`; regressions otherwise none.

| Prompt | Expected | Actual top-1 | Status | Scores |
|---|---|---|---|---|
| `iterative review loop for spec folder audit` | `deep-review` | `sk-code-review` | FAIL | `sk-code-review` live 0.942 / shadow 0.819333; `deep-review` live 0.936 / shadow 0.838 |
| `review this PR for code quality` | `sk-code-review` | `sk-code-review` | PASS | live 0.959 / shadow 0.874667 |
| `single pass code review with security findings` | `sk-code-review` | `sk-code-review` | PASS | live 0.948675 / shadow 0.841567 |
| `audit findings drift readiness` | `sk-code-review` | `sk-code-review` | PASS | live 0.934755 / shadow 0.82634 |
| `deep research loop with convergence tracked` | `deep-research` | `deep-research` | PASS | live 0.925725 / shadow 0.8163 |
| `multi-pass review with convergence detection` | `deep-review` | `deep-review` | PASS | live 0.95685 / shadow 0.8658 |
| `spec folder audit packet` | `deep-review` or `system-spec-kit` | `system-spec-kit` | PASS | `system-spec-kit` live 0.9 / shadow 0.78; `deep-review` live 0.886554 / shadow 0.796607 |
| `code review findings drift` | `sk-code-review` | `sk-code-review` | PASS | live 0.95835 / shadow 0.8578 |

Active finding:

- **P0-006** - Primary deep-review routing still fails live behavioral top-1. Evidence: `skill_advisor.py "iterative review loop for spec folder audit" --threshold 0.0` returns `sk-code-review` before `deep-review`.

## Iteration 8 - Adversarial Final Pass

**Status**: PASS.

| Check | Status | Evidence |
|---|---|---|
| Active-code `'sk-deep'` family literal | PASS | No hits under active TS/Python MCP server source excluding dist and fixtures. |
| Source/dist `deep-loop` consistency | PASS | Dist count 20; source count 9. |
| Phase 002-004 identity-renames | PASS | No hits for `deep-review to deep-review` or `deep-research to deep-research`. |
| Changelog symlinks | PASS | `deep-review` and `deep-research` symlinks exist; no `sk-deep*` changelog entries. |
| P1-004 entity kind | PASS | `reference-category` count is 0; `.opencode/skills/sk-code/graph-metadata.json:201` is `"kind": "reference"`. |

## Prior Findings Reconciliation

| Prior ID | Original Severity | Post-Fix Status | Verdict | Evidence |
|---|---|---|---|---|
| P0-004 | P0 | Fixed | DROP | Identity-rename grep across Phase 002-004 markdown returned no hits. |
| P1-001 | P1 | Fixed | DROP | New changelog symlinks exist; old `sk-deep*` changelog entries are absent. |
| P1-002 | P1 | Partially fixed | AMEND / ESCALATE | Shadow scoring favors `deep-review`, but live behavioral ordering still returns `sk-code-review` top-1 for the primary prompt. |
| P1-003 | P1 | Fixed | DROP | SQLite, source SQL, dist SQL, compiled graph, and skill metadata all use `deep-loop`; `sk-deep` is absent. |
| P1-004 | P1 | Fixed | DROP | Compiler validation passes and `reference-category` is absent from `sk-code` metadata. |

## Final Referee Verdict

**FAIL**.

The schema migration is correct, P1-003 is fixed, P1-004 is fixed, stale changelog symlinks are fixed, and Phase 002-004 identity-renames are gone. Commit readiness is blocked solely by the live routing behavior for P1-002. If the intended runtime consumes shadow scores for ranking, that contract needs explicit proof; the observed CLI behavior still ranks by live score.
