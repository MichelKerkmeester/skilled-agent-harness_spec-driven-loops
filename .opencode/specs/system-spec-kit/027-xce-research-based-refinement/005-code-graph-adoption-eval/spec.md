---
title: "Phase 005 — Code Graph Adoption Evaluation Harness"
description: "ADAPT XCE's benchmark methodology to a lightweight local eval harness. CLI dispatcher spawns OpenCode subprocesses to run 12-20 refactoring tasks on our codebase in baseline (current brief) vs after (Phase 004 mandate brief) modes. Measures 3 primary metrics + 2 diagnostics + RQ8 token-reduction instrumentation. ~500 LOC: 1 CLI entry + 1 metric library + 1 task set + 1 report generator + 1 test harness."
trigger_phrases:
  - "027 phase 005"
  - "code-graph adoption eval"
  - "eval harness"
  - "baseline vs after measurement"
  - "token reduction validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval"
    last_updated_at: "2026-05-08T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/005 phase from sub-packet-proposals.md Proposal 5"
    next_safe_action: "Implement after Phases 001-004 land — depends on all 4"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08-027-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code Graph Adoption Evaluation Harness

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Build the lightweight eval harness proposed in 027 RQ7 (`../research/iterations/iteration-007.md` F-041) with RQ8 token-reduction instrumentation (iteration-008 F-046) and pt-02 subprocess hardening from `../research/027-xce-research-based-refinement-pt-02/research.md`. A CLI dispatcher spawns OpenCode subprocesses to execute 12-20 refactoring tasks on our own codebase in two modes: **baseline** (current advisor brief) vs **after** (Phase 004's MUST-invoke mandate brief). Measures 3 primary metrics (file-reads-avoided, context-accuracy via `computeHitRate`, answer-completeness via Jaccard) + 2 diagnostics (token waste ratio, first-action adherence) + RQ8 token-reduction instrumentation that queries `session-analytics-db.ts` for `total_tokens` post-session-stop.

ADAPT verdict from findings.md items #14 (token reduction) + #15 (benchmark methodology, DEFER → built here as the lightweight local alternative).

**Key Decisions**:
- **Lightweight local harness**, not SWE-bench Verified (excluded per parent 027 spec.md:127).
- **Subprocess OpenCode dispatch** with `</dev/null` redirect (per 097 fix). Reuses cli-opencode skill.
- **Paired comparison protocol**: same task set, same model, baseline vs after — controls for prompt/model variance.
- **N≥20 tasks per condition** for statistical power.

**Critical Constraints**:
- Phase 004 must ship FIRST — its mandate brief is the "after" condition's independent variable.
- Phases 001-003 must ship FIRST — they're the tools being evaluated.
- 10-minute per-task timeout to bound total wallclock.
- Incremental result saving (JSONL per task) — never lose data on partial harness crash.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | **3** (bumped from L2 per pt-02 amendment — subprocess/auth/result-schema hardening kept in-packet rather than split; see `decision-record.md`) |
| **Priority** | P2 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/sub-packet-proposals.md` Proposal 5; `../research/iterations/iteration-007.md`, `iteration-008.md`; pt-02 amendments in `../research/027-xce-research-based-refinement-pt-02/` |
| **Depends on** | `027/001-code-graph-hld-lld`, `027/002-code-graph-trace`, `027/003-code-graph-impact-analysis`, `027/004-skill-advisor-first-action-mandate` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

XCE claims +7.4pp on SWE-bench Verified (external/README.md:37-47) and ~20% token reduction with steering active (external/README.md:188). We can't run SWE-bench (Python-only, 50GB+ Docker, our codebase is TypeScript). But we CAN run a lightweight version of the same protocol on our own code: 12-20 refactoring tasks, paired comparison, file-reads-avoided as proxy for steering effect, token measurement via our existing session-analytics infrastructure.

**Purpose**: ship a CLI eval harness that empirically validates whether Phases 001-004 deliver the predicted token reduction (5-15% expected per iteration-008 F-046, vs XCE's 20% claim) and the predicted file-reads-avoided improvement. Output: a report comparing baseline vs after across all 5 metrics with statistical significance testing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New CLI entry `mcp_server/scripts/dist/eval/code-graph-adoption-eval.js` (~200 LOC):
  - Reads task set from `tasks/labeled-tasks.jsonl`.
  - Spawns OpenCode subprocess per task (uses 097's `</dev/null` pattern).
  - Switches advisor mode via env var (toggle Phase 004 mandate on/off).
  - Captures `session_id`, post-session metrics, and JSONL-streams results to `eval-runs/<run_id>/<task_id>.jsonl`.
- New metric library `mcp_server/lib/eval/token-measurement.ts` (~25 LOC):
  - Queries `session_analytics.analytics_sessions` for `total_tokens`, `prompt_tokens`, `completion_tokens` by session_id.
  - Returns paired delta (baseline − after).
- New task set `mcp_server/scripts/dist/eval/tasks/labeled-tasks.jsonl` (~20 lines JSONL):
  - 12-20 refactoring tasks on our own TypeScript codebase.
  - Each task has: `id`, `prompt`, `expected_files_to_read[]`, `expected_completeness_keywords[]`.
- New report generator `mcp_server/lib/eval/report-generator.ts` (~50 LOC):
  - Reads run JSONL files.
  - Computes 5 metrics + statistical significance (paired t-test).
  - Renders markdown report.
- Test harness `mcp_server/tests/code-graph-adoption-eval.vitest.ts` (~100 LOC):
  - Smoke test: 1 task in each condition.
  - Asserts result file format + metric computation.
- Stress config entry `mcp_server/vitest.stress.config.ts` (+10 LOC) for harness as a stress run.

### Out of Scope
- SWE-bench Verified evaluation (Docker, Python PRs, swe-bench-eval pipeline).
- Cross-model comparison (same model both conditions).
- Real-time dashboard (post-hoc query only).
- Production-grade harness — this is a one-shot validation tool.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CLI dispatcher spawns OpenCode subprocess per task | Subprocess uses 097's `</dev/null` pattern; one process per task |
| REQ-002 | Mode toggle via env var (baseline vs after) | `EVAL_ADVISOR_MODE=baseline\|after` switches Phase 004 mandate |
| REQ-003 | 3 primary metrics computed: file-reads-avoided, context-accuracy (HitRate), answer-completeness (Jaccard) | Output JSONL has all 3 fields per task |
| REQ-004 | RQ8 token measurement via `session-analytics-db.ts` | Each task's run records `prompt_tokens`, `completion_tokens`, `total_tokens` |
| REQ-005 | 12-20 labeled tasks in `tasks/labeled-tasks.jsonl` | File has ≥12 lines, each a valid JSON object with required fields |
| REQ-006 | Incremental result saving (JSONL per task) | Crash mid-run preserves completed-task results |
| REQ-007 | Markdown report with paired t-test significance | Report renders pass/fail per metric at p<0.05 |
| REQ-008 | 10-min per-task timeout | Subprocess SIGTERM at 600s; result marked `timeout: true` |

### P0 — pt-02 amendments (NEW)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| **REQ-011** | **Provider auth preflight** | Before task dispatch, run provider availability/auth preflight ONCE, cache the result, AND fail-fast (or ask) before the run if the selected provider is unavailable. Cached preflight invalidates on auth-shaped errors. (Resolves B-iter005-002.) |
| **REQ-012** | **Subprocess lifecycle** | Each OpenCode subprocess MUST: (a) use ignored stdin OR equivalent `</dev/null`; (b) enforce 600s timeout; (c) send `SIGTERM` first; (d) wait grace period (5s); (e) escalate to `SIGKILL`; (f) wait for close/exit event before continuing dispatch loop. (Resolves B-iter005-001 + B-iter005-003.) |
| **REQ-013** | **Discriminated result schema** | Every JSONL result row MUST include: `status: "success" \| "timeout" \| "failed"`, `attempt`, `maxAttempts`, `condition`, `taskId`, `metrics: null \| object`, `error: null \| {code, message}`, `stdoutPath`, `stderrPath`, `sessionId`, `includeInPairedStats: boolean`. (Resolves B-iter005-004.) |
| **REQ-014** | **Mocked dispatcher stress test** | Unit tests MUST run ≥12 tasks × 2 conditions using mocked subprocesses and cover: success, non-timeout failure with retries, timeout, metrics-missing retry, DB/readiness error retry, AND final failed records. (Resolves B-iter005-005.) |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | **Report generator skips incomplete baseline/after pairs, counts skipped/incomplete rows separately, AND only includes complete pairs in paired statistics** | Report includes `complete_pairs`, `incomplete_pairs`, `skipped_rows`; t-test runs only on complete pairs. (Amended per B-iter005-004 + B-iter005-006.) |
| REQ-010 | Retry logic (2 retries per task) | On non-timeout failures, retry up to 2x before marking failed |
| **REQ-015** | **Stale process / lock guard** | The run SHOULD detect stale OpenCode processes before dispatch AND apply short-backoff retry (e.g., 1s/2s/4s) for DB-lock or readiness-shaped failures. (Resolves B-iter005-007.) |
| REQ-016 | Stress config entry for harness as runnable stress test | `npm run stress -- code-graph-adoption-eval` invokes harness |

### P2
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-017 | Power analysis output | Report includes power-analysis: "N=20 per condition gives X% power to detect Y effect at p<0.05" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running `node scripts/dist/eval/code-graph-adoption-eval.js --tasks 12 --runs 2` produces a report comparing baseline vs after across all 5 metrics in <2 hours wallclock.
- **SC-002**: Report definitively states whether Phase 004's mandate produces statistically significant token reduction (p<0.05 paired t-test).
- **SC-003**: Phase 003's risk weights can be empirically validated from the harness output.
- **SC-004**: All harness code passes `npm run check` (lint + typecheck) and ≥80% line coverage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Subprocess OpenCode dispatch unreliable at scale | High | REQ-012 hardened lifecycle (stdin / 600s / SIGTERM→SIGKILL / close-wait); REQ-014 mocked stress test; retry logic; incremental save |
| Risk | Labeled task set quality insufficient | Medium | Tasks versioned; manual review of first 5 results before scaling |
| Risk | 5-15% effect below significance at N=10 | Medium | Run N=20 minimum; report "inconclusive" if p>0.05 |
| Risk | OpenCode MCP config switching fragile | Medium | Use env var toggle (no file writes); document harness README |
| **Risk** | **A subprocess can survive timeout and keep shared OpenCode state locked** | High | REQ-012 process-tree cleanup + close-event wait; REQ-015 stale-process detection |
| **Risk** | **Provider auth failures can consume the full run budget** | High | REQ-011 preflight + cached provider status; auth-shaped errors invalidate cache |
| **Risk** | **Mixed failures can corrupt paired statistics if row schema is loose** | High | REQ-013 discriminated result rows + REQ-009 amended for incomplete-pair accounting |
| **Risk** | **Level 2 underestimates operational complexity** if all subprocess hardening remains in scope | High | **Bump to Level 3** (this packet) per pt-02 decision; alternative was split-out hardening packet — not chosen, see `decision-record.md` |
| Dependency | Phases 027/001-004 must ship first | Internal | Hard sequence — this phase is last |
| Dependency | Existing `session-analytics-db.ts` total_tokens query | Internal | Already shipped, stable |
| Dependency | Existing `eval-metrics.ts` 12 metric functions | Internal | Already shipped, reused |
| Dependency | cli-opencode skill stable | Internal | Stabilized by 097 packet (`</dev/null` fix) — this packet's REQ-012 also reuses 097 stdin pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: Per-task wallclock <10 min p95.
- **NFR-P02**: Total run wallclock for 20 tasks × 2 conditions <2 hours.
- **NFR-R01**: Crash recovery: rerun continues from incremental JSONL state.
- **NFR-A01**: Run output is reproducible (same task set + same git SHA + same model = same result envelope, modulo LLM nondeterminism).

---

## 8. EDGE CASES

- Subprocess hangs beyond 10 min: SIGTERM, mark `timeout: true`, continue with next task.
- DB readiness gate fails mid-task: mark `error: db_unavailable`, retry once.
- session-analytics-db has no row for session_id: mark `error: metrics_missing`, retry once with renewed session capture.
- Task expects file but file doesn't exist (codebase changed): mark `error: stale_task_set`.
- Both conditions produce identical metrics: report `effect: null` and explain — likely tasks too easy.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope (1 CLI + 1 metric lib + 1 task set + 1 report gen + 1 test harness + stress config + provider preflight + dispatcher helper + result schema + mocked stress) | 25/25 |
| Risk (subprocess reliability, statistical power, auth lifecycle, locked-state recovery, schema discrimination) | 22/25 |
| Research (mostly done; task curation remains) | 8/20 |
| **Total** | **55/70** | **Level 3** (per pt-02 amendment; subprocess hardening kept in-packet, see `decision-record.md`) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Subprocess timeout leaves OpenCode state locked | High | Medium | REQ-012 lifecycle cleanup plus REQ-015 stale-process guard |
| R-002 | Provider auth failure burns full run budget | High | Medium | REQ-011 cached provider auth preflight and auth-error invalidation |
| R-003 | Mixed failed rows corrupt paired statistics | High | Medium | REQ-013 discriminated row schema plus REQ-009 complete-pair filtering |
| R-004 | Task labels are too weak to measure real impact | Medium | Medium | Manual review first 5 tasks and keep task set versioned |
| R-005 | Effect size is below statistical power | Medium | Medium | Report inconclusive results honestly and include power analysis |

---

## 11. USER STORIES

### US-001: Run Paired Baseline vs After Evaluation (Priority: P0)

**As a** spec-kit maintainer, **I want** a paired local harness, **so that** I can measure whether code-graph steering reduces file reads and token use on this repository.

**Acceptance Criteria**:
1. **Given** the task set is valid and providers are available, **When** the CLI runs baseline and after conditions, **Then** the report includes paired metrics for complete task pairs only.

---

### US-002: Survive Dispatcher Failure Modes (Priority: P0)

**As a** maintainer running a long eval, **I want** subprocess failures to be isolated and recorded, **so that** a timeout, auth error, or metrics miss does not corrupt the whole run.

**Acceptance Criteria**:
1. **Given** mocked subprocesses produce mixed outcomes, **When** the stress test runs 12 tasks by 2 conditions, **Then** each row validates against the discriminated schema and incomplete pairs are excluded from paired statistics.

---

### US-003: Produce an Honest Adoption Report (Priority: P1)

**As a** reviewer, **I want** the report to distinguish complete pairs, incomplete pairs, skipped rows, and statistical power, **so that** I can tell a real improvement from an inconclusive result.

**Acceptance Criteria**:
1. **Given** a run contains missing or failed rows, **When** the report generator runs, **Then** it counts those rows separately and does not include them in the paired t-test.

---

## 12. OPEN QUESTIONS

- Task curation: cherry-pick from real refactor PRs in this repo, or synthesize from RQ patterns? (Default: cherry-pick from recent merged PRs for ground-truth labels.)
- Cross-validation across LLM providers? (Default: out of scope — single model both conditions.)
- Should harness output feed back into Phase 003's `RISK_WEIGHTS` tuning automatically? (Default: no, manual review per packet.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Part 1**: See `../research/research.md`
- **Research Part 2**: See `../research/027-xce-research-based-refinement-pt-02/research.md`
