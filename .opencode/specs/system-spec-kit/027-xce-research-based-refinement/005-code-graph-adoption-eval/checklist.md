---
title: "Checklist — 027/005 code-graph adoption eval"
description: "QA checklist for the eval harness phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 027/005 code-graph adoption eval

<!-- SPECKIT_LEVEL: 3 -->

Mark each item `[x]` only with file:line evidence after completion.

## P0 — Task curation
- [ ] **C-001**: 12-20 tasks in labeled-tasks.jsonl with all required fields
- [ ] **C-002**: First 5 tasks manually reviewed for quality

## P0 — CLI dispatcher
- [ ] **C-003**: Subprocess uses `</dev/null` pattern (097 fix applied)
- [ ] **C-004**: `EVAL_ADVISOR_MODE` env toggle works (baseline vs after)
- [ ] **C-005**: 10-min per-task timeout enforced
- [ ] **C-006**: Incremental JSONL save survives mid-run crash
- [ ] **C-007**: 2 retries per non-timeout failure

## P0 — Metrics
- [ ] **C-008**: 3 primary metrics computed (file-reads-avoided, HitRate, Jaccard)
- [ ] **C-009**: RQ8 token measurement via session-analytics-db
- [ ] **C-010**: 2 diagnostic metrics computed (token waste ratio, first-action adherence)

## P0 — Report
- [ ] **C-011**: Markdown report with paired t-test
- [ ] **C-012**: Pass/fail at p<0.05 per metric
- [ ] **C-013**: Power-analysis section

## P0 — pt-02 amendments (NEW)
- [ ] **C-014** (REQ-011): Provider auth preflight runs ONCE before dispatch; cached for run lifetime; invalidates on auth-shaped errors
- [ ] **C-015** (REQ-012): Each subprocess uses `</dev/null` stdin + 600s timeout + SIGTERM-then-grace-then-SIGKILL + close-event wait
- [ ] **C-016** (REQ-013): Every JSONL result row has discriminated schema (status/attempt/maxAttempts/condition/taskId/metrics/error/stdoutPath/stderrPath/sessionId/includeInPairedStats); zod-validated
- [ ] **C-017** (REQ-014): Mocked 12×2 dispatcher stress test PASSES with 6 outcome classes covered (success / retry / timeout / metrics-missing / DB-readiness / final-failed)
- [ ] **C-018** (REQ-015): Stale-process detection + short-backoff retry branch present
- [ ] **C-019** (REQ-009 amended): Report generator counts `complete_pairs`/`incomplete_pairs`/`skipped_rows` separately AND only includes complete pairs in paired t-test

## P2
- [ ] **C-020** (REQ-017): Power-analysis section in report

## P0 — Verification
- [ ] **C-V01**: `npm run check` green
- [ ] **C-V02**: `npx vitest run code-graph-adoption-eval.vitest.ts --coverage` ≥80%
- [ ] **C-V02b**: `npx vitest run eval-dispatcher-stress.vitest.ts` PASS (REQ-014)
- [ ] **C-V03**: strict validate passes
- [ ] **C-V04**: Full harness run: 12 tasks × 2 runs completes in <2 hours **AND mocked stress passed first**
- [ ] **C-V05**: implementation-summary.md authored with run findings
- [ ] **C-V06**: decision-record.md authored documenting L2→L3 bump rationale
