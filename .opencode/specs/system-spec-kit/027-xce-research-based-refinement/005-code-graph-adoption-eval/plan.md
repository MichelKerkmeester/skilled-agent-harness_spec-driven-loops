---
title: "Plan — 027/005 code-graph adoption eval"
description: "Phased plan: task curation → CLI dispatcher → metric lib → report generator → smoke harness."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 027/005 code-graph adoption eval

<!-- SPECKIT_LEVEL: 3 -->

## OVERVIEW
~500 LOC. Sequential phases. Wall-clock 4-6 hours implementation + 2 hours run.

## PHASES

### Phase 1: Task curation (REQ-005)
- Cherry-pick 12-20 tasks from recent merged PRs in this repo.
- Each task labeled with `id`, `prompt`, `expected_files_to_read[]`, `expected_completeness_keywords[]`.
- Output: `mcp_server/scripts/dist/eval/tasks/labeled-tasks.jsonl`.
- Manual quality review of first 5 tasks before scaling to 20.

### Phase 2: Token-measurement lib (REQ-004)
- Create `mcp_server/lib/eval/token-measurement.ts`.
- Implement `getSessionTokens(sessionId, db)` returning `{prompt_tokens, completion_tokens, total_tokens, turn_count}`.
- Implement `pairedDelta(baselineMetrics, afterMetrics)` returning per-task delta + statistical t-stat.

### Phase 2.5: Provider auth preflight (REQ-011, NEW)
- **Before any task dispatch, run provider availability/auth preflight** (single one-shot OpenCode call with `--noop` or trivial prompt).
- Cache result for the run lifetime; invalidate on auth-shaped errors.
- Fail fast (or ask user to confirm) if provider unavailable.

### Phase 2.7: Hardened subprocess dispatcher helper (REQ-012, NEW)
- Create `mcp_server/lib/eval/dispatcher.ts` (~80-120 LOC):
  - Owns stdin (`</dev/null`), 600s timeout, SIGTERM-then-grace-then-SIGKILL escalation, close-event wait.
  - Captures stdout/stderr to per-task paths.
  - Returns discriminated result row per REQ-013 schema.
- All CLI-spawn paths in the eval harness MUST use this helper (NOT direct `child_process.spawn`).

### Phase 3: CLI dispatcher (REQ-001, REQ-002, REQ-006, REQ-008, REQ-013)
- Create `mcp_server/scripts/dist/eval/code-graph-adoption-eval.js`.
- Read task set from JSONL.
- For each task × {baseline, after}:
  - **Use the dispatcher helper from Phase 2.7** (NOT raw spawn).
  - Pass `EVAL_ADVISOR_MODE=baseline|after` env.
  - Capture session_id from stdout.
  - Query session-analytics for token counts.
  - Compute task-level metrics.
  - **Construct discriminated result row** per REQ-013 (status/attempt/maxAttempts/condition/taskId/metrics/error/stdoutPath/stderrPath/sessionId/includeInPairedStats).
  - Stream incremental result to `eval-runs/<run_id>/<task_id>.jsonl` with **condition-separated paths OR condition/attempt embedded in every row**.

### Phase 4: Metric computation (REQ-003)
- Reuse `mcp_server/lib/eval/eval-metrics.ts` `computeHitRate` for context-accuracy.
- Implement `computeFileReadsAvoided(actual_reads, expected_reads)`.
- Implement `computeAnswerCompleteness(answer, expected_keywords)` via Jaccard on tokenized answer.

### Phase 5: Report generator (REQ-007, REQ-009 amended, REQ-017)
- Create `mcp_server/lib/eval/report-generator.ts`.
- Read all JSONL results.
- **Skip incomplete baseline/after pairs**; count `complete_pairs`, `incomplete_pairs`, `skipped_rows` separately (REQ-009 amended).
- Compute paired t-test per metric ON COMPLETE PAIRS ONLY.
- Render markdown report with pass/fail at p<0.05.
- Add power-analysis section.

### Phase 6: Mocked dispatcher stress test (REQ-014, NEW — runs BEFORE manual full-harness)
- Create `mcp_server/tests/eval-dispatcher-stress.vitest.ts` (~150 LOC):
  - ≥12 tasks × 2 conditions using mocked subprocesses.
  - Mock outcomes cover: success, non-timeout failure with retries, timeout, metrics-missing retry, DB/readiness error retry, AND final failed records.
  - Asserts result-row schema discrimination AND paired-stats inclusion logic.

### Phase 7: Smoke test harness (REQ-008, REQ-010, REQ-015)
- Create `mcp_server/tests/code-graph-adoption-eval.vitest.ts`.
- Smoke: 1 task each condition (kept — but NOT treated as sufficient reliability coverage on its own; REQ-014 stress test is the reliability proof).
- Assert result file format, metric computation, report generation.
- **Stale-process detection** (REQ-015): if running OpenCode processes detected before dispatch, log warning and apply short-backoff retry for DB-lock/readiness errors.

### Phase 8: Stress config (REQ-016)
- Edit `mcp_server/vitest.stress.config.ts` adding entry `code-graph-adoption-eval`.

### Phase 9: Verification + run
- `npm run check` green.
- ≥80% line coverage.
- **Mocked stress test (REQ-014) MUST pass before manual full-harness run.**
- Run full harness: `node scripts/dist/eval/code-graph-adoption-eval.js --tasks 12 --runs 2`.
- Review report; document findings in `implementation-summary.md`.

## DEPENDENCIES

- Phases 027/001, 002, 003, 004 must ship first.
- Existing `session-analytics-db.ts`, `eval-metrics.ts`.
- 097 packet's `</dev/null` fix in cli-opencode dispatch.

## OUT OF SCOPE

- SWE-bench Verified.
- Cross-model comparison.
- Real-time dashboard.
