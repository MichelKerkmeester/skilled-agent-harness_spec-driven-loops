---
title: "Tasks — 027/005 code-graph adoption eval"
description: "Per-file tasks for the eval harness phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/005 code-graph adoption eval

<!-- SPECKIT_LEVEL: 3 -->

## P0 — Task curation
| # | Task | File | Done |
|---|------|------|------|
| T1 | Cherry-pick 12-20 refactoring tasks from recent PRs | `mcp_server/scripts/dist/eval/tasks/labeled-tasks.jsonl` (new, ~20 lines) | [ ] |
| T2 | Each task labeled with id/prompt/expected_files_to_read/expected_completeness_keywords | same | [ ] |
| T3 | Manual review of first 5 tasks for quality | spec author | [ ] |

## P0 — Lib + dispatcher
| # | Task | File | Done |
|---|------|------|------|
| T4 | `getSessionTokens(sessionId, db)` query helper | `mcp_server/lib/eval/token-measurement.ts` (new, ~25 LOC) | [ ] |
| T5 | `pairedDelta()` paired t-test helper | same | [ ] |
| T6 | `computeFileReadsAvoided()` metric | `mcp_server/lib/eval/eval-metrics.ts` (edit, +20 LOC) | [ ] |
| T7 | `computeAnswerCompleteness()` Jaccard metric | same | [ ] |
| T8 | CLI dispatcher main | `mcp_server/scripts/dist/eval/code-graph-adoption-eval.js` (new, ~200 LOC) | [ ] |
| T9 | Subprocess opencode run with `</dev/null` + 10-min timeout | same | [ ] |
| T10 | EVAL_ADVISOR_MODE env toggle | same | [ ] |
| T11 | Incremental JSONL result saving | same | [ ] |
| T12 | Retry logic (2 retries per task) | same | [ ] |

## P0 — Report
| # | Task | File | Done |
|---|------|------|------|
| T13 | Read run JSONL files | `mcp_server/lib/eval/report-generator.ts` (new, ~50 LOC) | [ ] |
| T14 | Paired t-test per metric | same | [ ] |
| T15 | Markdown report with pass/fail at p<0.05 | same | [ ] |
| T16 | Power-analysis section | same | [ ] |

## P0 — Smoke test
| # | Task | File | Done |
|---|------|------|------|
| T17 | 1-task smoke per condition | `mcp_server/tests/code-graph-adoption-eval.vitest.ts` (new, ~100 LOC) | [ ] |
| T18 | Assert result file format | same | [ ] |
| T19 | Assert metric computation | same | [ ] |

## P0 — Stress config
| # | Task | File | Done |
|---|------|------|------|
| T20 | Add stress entry | `mcp_server/vitest.stress.config.ts` (edit, +10 LOC) | [ ] |

## P0 — pt-02 amendments (NEW)

| # | Task | File | Done |
|---|------|------|------|
| **T-005A** | Provider preflight cache + auth-shaped error invalidation (REQ-011) | `mcp_server/lib/eval/provider-preflight.ts` (new, ~50 LOC) + tests | [ ] |
| **T-005B** | Hardened subprocess dispatcher helper: `</dev/null` stdin, 600s timeout, SIGTERM→grace→SIGKILL, close-event wait, stdout/stderr capture (REQ-012) | `mcp_server/lib/eval/dispatcher.ts` (new, ~80-120 LOC) + tests | [ ] |
| **T-005C** | Discriminated result row schema (status/attempt/maxAttempts/condition/taskId/metrics/error/stdoutPath/stderrPath/sessionId/includeInPairedStats) + zod validation (REQ-013) | `mcp_server/lib/eval/result-schema.ts` (new, ~40 LOC) + tests | [ ] |
| **T-005D** | Update report generator to skip incomplete pairs + count `complete_pairs`/`incomplete_pairs`/`skipped_rows` separately (REQ-009 amended) | `report-generator.ts` (edit) + tests | [ ] |
| **T-005E** | Mocked 12×2 dispatcher stress test with 6 outcome classes (success / retry / timeout / metrics-missing / DB-readiness / final-failed) (REQ-014) | `mcp_server/tests/eval-dispatcher-stress.vitest.ts` (new, ~150 LOC) | [ ] |
| **T-005F** | Stale-process detection + DB/readiness short-backoff retry branch (REQ-015) | `dispatcher.ts` + tests | [ ] |
| **T-keep-but-not-sufficient** | 1×2 smoke test KEPT but explicitly NOT sufficient reliability coverage (per amendment); MUST pass + REQ-014 stress MUST also pass | smoke + stress | [ ] |

## P0 — Verification + Run
| # | Task | File | Done |
|---|------|------|------|
| T21 | `npm run check` green | terminal | [ ] |
| T22 | `npx vitest run code-graph-adoption-eval.vitest.ts --coverage` ≥80% | terminal | [ ] |
| T22b | **`npx vitest run eval-dispatcher-stress.vitest.ts` PASS (REQ-014 mocked stress)** | terminal | [ ] |
| T23 | Run full harness: 12 tasks × 2 runs (only after mocked stress passes) | terminal | [ ] |
| T24 | Review report; document findings | `implementation-summary.md` (new) | [ ] |
