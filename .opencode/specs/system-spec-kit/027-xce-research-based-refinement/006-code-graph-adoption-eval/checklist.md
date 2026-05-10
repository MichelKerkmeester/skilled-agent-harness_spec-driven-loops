---
title: "Verification Checklist: 027/006 Code Graph Adoption Evaluation Harness"
description: "QA validation checklist for the Level 3 eval harness phase."
trigger_phrases:
  - "027 phase 006 checklist"
  - "code graph adoption eval checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/006-code-graph-adoption-eval"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned checklist with Level 3 anchors and pt-02 subprocess hardening amendments"
    next_safe_action: "Implement Phase 006 after Phases 001-004 land"
---
# Verification Checklist: 027/006 Code Graph Adoption Evaluation Harness

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the phase implemented until complete |
| **[P1]** | Required | Must complete or explicitly defer with approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-017 are present in spec.md.
- [ ] CHK-002 [P0] decision-record.md documents the Level 2 to Level 3 bump and dispatcher hardening rationale.
- [ ] CHK-003 [P0] Plan sequences provider preflight, subprocess lifecycle, result schema, mocked stress, reporting, and live smoke.
- [ ] CHK-004 [P0] Phases 001 through 004 are complete before a live full harness run.
- [ ] CHK-005 [P1] First five labeled tasks are manually reviewed for quality before scaling.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `labeled-tasks.jsonl` contains 12 to 20 valid tasks with required fields.
- [ ] CHK-011 [P0] CLI dispatcher spawns one OpenCode subprocess per task and condition.
- [ ] CHK-012 [P0] `EVAL_ADVISOR_MODE` switches baseline and after conditions.
- [ ] CHK-013 [P0] Subprocess stdin uses `</dev/null` or ignored-stdin equivalent.
- [ ] CHK-014 [P0] Each subprocess enforces 600s timeout, SIGTERM, grace wait, SIGKILL escalation, and close-event wait.
- [ ] CHK-015 [P0] Provider auth preflight runs once before dispatch and invalidates on auth-shaped errors.
- [ ] CHK-016 [P0] JSONL result rows use the discriminated schema required by REQ-013.
- [ ] CHK-017 [P0] Incremental JSONL save preserves completed results after a crash.
- [ ] CHK-018 [P0] Two retries are applied to non-timeout failures.
- [ ] CHK-019 [P0] Metrics include file-reads-avoided, HitRate, Jaccard, token measurement, token waste ratio, and first-action adherence.
- [ ] CHK-020 [P0] Report generator computes complete pairs, incomplete pairs, skipped rows, and paired t-test only over complete pairs.
- [ ] CHK-021 [P1] Stale-process and DB/readiness-shaped failures use short-backoff retry.
- [ ] CHK-022 [P1] Stress config can invoke the harness as a runnable stress test.
- [ ] CHK-023 [P2] Report includes power-analysis output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Mocked 12 by 2 dispatcher stress test covers success, retry, timeout, metrics-missing, DB/readiness retry, and final-failed rows.
- [ ] CHK-031 [P0] `npx vitest run eval-dispatcher-stress.vitest.ts` passes before live full-harness execution.
- [ ] CHK-032 [P0] `npx vitest run code-graph-adoption-eval.vitest.ts --coverage` passes with at least 80 percent coverage.
- [ ] CHK-033 [P0] One-task-per-condition smoke test passes after mocked stress.
- [ ] CHK-034 [P0] `npm run check` passes.
- [ ] CHK-035 [P1] Live 12-task by 2-condition harness run completes in under 2 hours after mocked stress passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-040 [P0] Every P0 requirement has file:line evidence in implementation-summary.md after implementation.
- [ ] CHK-041 [P0] All pt-02 BLOCKING IDs for Phase 006 map to implemented requirements or explicit decisions.
- [ ] CHK-042 [P0] Mocked stress result is recorded before any full live harness result.
- [ ] CHK-043 [P1] Incomplete-pair reporting behavior is demonstrated by fixtures.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] Provider auth preflight never logs secrets.
- [ ] CHK-051 [P0] Subprocess command construction avoids shell injection by using explicit argument arrays or equivalent safe APIs.
- [ ] CHK-052 [P1] stdout and stderr capture paths stay inside the run directory.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] spec.md, plan.md, tasks.md, checklist.md, decision-record.md, and implementation-summary.md remain synchronized.
- [ ] CHK-061 [P0] Strict spec-kit validation passes for the phase folder.
- [ ] CHK-062 [P1] Report output format and rerun/resume behavior are documented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] New CLI, metrics, report, task, and test files follow the existing mcp_server layout.
- [ ] CHK-071 [P1] eval-runs output and raw stdout/stderr artifacts are gitignored or written outside committed paths.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 33 | 0/33 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision ADR-001 documents the Level 3 bump rationale.
- [ ] CHK-101 [P1] Alternatives document split hardening and reject-findings options with rationale.
- [ ] CHK-102 [P1] Dispatcher hardening remains local until a second consumer earns extraction.
- [ ] CHK-103 [P2] Component diagram or dependency map is updated if implementation introduces a shared dispatcher helper.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P0] Per-task timeout remains capped at 600 seconds.
- [ ] CHK-111 [P1] Full run wallclock target remains under 2 hours for 12 tasks by 2 conditions.
- [ ] CHK-112 [P1] Report records inconclusive statistical power honestly when effect size or N is insufficient.
- [ ] CHK-113 [P2] Provider quota usage is recorded for the full harness run.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure removes the CLI entry without affecting runtime MCP tools.
- [ ] CHK-121 [P0] Harness is opt-in and cannot run during normal MCP startup.
- [ ] CHK-122 [P1] Failed or interrupted runs can resume from JSONL state.
- [ ] CHK-123 [P1] Run directory cleanup instructions are documented.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No user secrets or provider tokens are written to run artifacts.
- [ ] CHK-131 [P1] Task prompts only reference local repository files.
- [ ] CHK-132 [P2] Raw logs can be redacted before sharing reports.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P0] Level 3 docs include spec.md, plan.md, tasks.md, checklist.md, decision-record.md, and implementation-summary.md.
- [ ] CHK-141 [P1] decision-record.md status and consequences stay aligned with implemented subprocess behavior.
- [ ] CHK-142 [P1] implementation-summary.md includes mocked stress, smoke, and live run results when implementation completes.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Implementation owner | Technical owner | [ ] Pending | Pending implementation |
<!-- /ANCHOR:sign-off -->
