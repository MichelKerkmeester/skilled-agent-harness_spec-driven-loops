---
title: "Feature Specification: Lineage Timestamp Guard"
description: "Detect fabricated JSONL timestamps in fan-out lineage state at the orchestration boundary by checking every record against the lineage's real wall-clock window."
trigger_phrases:
  - "lineage timestamp guard"
  - "fabricated timestamps"
  - "timestamp anomaly detection"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/007-deep-review-followup-hardening/002-lineage-timestamp-guard"
    last_updated_at: "2026-07-04T16:33:20.324Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Implemented timestamp guard"
    next_safe_action: "Review final verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/lineage-timestamp-window.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/lineage-timestamp-window.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-002-timestamp-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Lineage Timestamp Guard

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

On 2026-07-02, a real 10-iteration deep-review lineage (gpt-5.5-fast xhigh) wrote a tidy fabricated timestamp sequence — 12:01:00, 12:02:00, ... 12:10:00, all BEFORE its actual 13:15-13:49Z run window — into its JSONL state, and nothing noticed. The findings were fine; the telemetry was fiction. This child adds a timestamp sanity check at the fan-out orchestration boundary: every JSONL record's timestamp must fall within the lineage's real wall-clock window (with bounded skew tolerance). Anomalies are detected, counted, and recorded as ledger/summary events — warn-first, so real runs are never retroactively failed on model misbehavior, but the fiction is no longer invisible.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 |
| **Predecessor** | 001-orchestrator-validation-parity |
| **Successor** | 003-session-id-parity-tests |
| **Handoff Criteria** | The checker flags every record outside the lineage window on a replay of the real 2026-07-02 fabricated-timestamp lineage data shape, emits ledger/summary events, never alters exit codes, and the full deep-loop-runtime vitest suite has 0 new failures against the known baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Lineage subprocesses own their JSONL state writes (`deep-review-state.jsonl` et al.) and the prompt asks for ISO-8601 timestamps, but nothing verifies truthfulness. The runner (`fanout-run.cjs`) knows each lineage's authoritative wall-clock window — it records `started_at`/`completed_at` in the orchestration ledger — yet post-completion artifact validation checks structure only, not temporal plausibility. Observed consequence: fabricated sequences pass silently, corrupting duration analytics, convergence-timing analysis, and any future audit that trusts lineage telemetry.

### Purpose
Make fabricated lineage timestamps detectable at the boundary that already owns ground truth, without changing run outcomes: detection events in the status ledger and orchestration summary, per-lineage anomaly counts, warn-first severity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A pure checker function: given a lineage's JSONL records and the real window (start, end, skew tolerance), classify each timestamped record as in-window or anomalous, returning counts and a bounded sample of offenders.
- Integration at lineage completion in the fan-out runner (alongside existing artifact validation), emitting a `timestamp_anomaly` ledger event and an orchestration-summary field when anomalies exist.
- Unit tests including a fixture reproducing the real fabricated shape (uniform minute-spaced sequence predating the window).

### Out of Scope
- Failing or retrying lineages on anomalies (warn-first rollout; escalation is a future decision).
- Rewriting or correcting the fabricated values.
- Non-fan-out (single-executor) loop paths.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/` (new or existing validate module) | Create/Modify | Pure window-check function |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Invoke at lineage completion; ledger + summary emission |
| `.opencode/skills/deep-loop-runtime/tests/unit/` | Create | Checker unit tests + fabricated-shape fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detection correctness | The fabricated-shape fixture (minute-spaced sequence before the window) yields anomaly count == record count; an honest in-window fixture yields 0 |
| REQ-002 | Zero outcome change | Exit codes, retry classification, and salvage behavior identical with and without anomalies |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Boundary events | Anomalous lineages produce a `timestamp_anomaly` ledger event and a summary field with counts and a bounded offender sample |
| REQ-004 | Skew tolerance | A documented tolerance (order of minutes) prevents false positives from clock skew and write latency; boundary-exact records pass |
| REQ-005 | Suite green | Full deep-loop-runtime vitest suite: 0 new failures |
| REQ-006 | Clean-path gating | Clean lineages emit no `timestamp_anomaly` ledger event and no `timestamp_anomalies` summary field |
| REQ-007 | Mutation sensitivity | Breaking the lower-bound comparison makes the fabricated pre-window fixture fail with anomaly count dropping below record count |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replaying the 2026-07-02 lineage's record shape against its real window flags 11/11 timestamped records.
- **SC-002**: An honest lineage produces zero events and byte-identical ledger output except absence of the anomaly event.
- **SC-003**: Full suite has 0 new failures against the known two-failure baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legit records near window edges flagged | M | Documented skew tolerance; boundary fixtures |
| Risk | Records without timestamps crash the checker | L | Untimestamped records are skipped, counted separately |
| Dependency | Ledger append helpers in fanout-pool | L | Reuse existing appendStatusLedger path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Performance | Single pass over JSONL already read for artifact validation | No extra file reads |
| NFR-002 | Compatibility | No schema change to existing ledger events | New event type only, additive |

## 8. EDGE CASES

| # | Edge Case | Expected Behavior |
|---|-----------|-------------------|
| 1 | Record timestamp exactly at window start/end | In-window (inclusive bounds plus tolerance) |
| 2 | Unparseable timestamp string | Counted as anomalous with reason `unparseable` |
| 3 | Record with no timestamp field | Skipped; counted as `untimestamped`, not anomalous |
| 4 | Retried lineage (attempt > 1) | Window spans the successful attempt's slot only |
| 5 | Empty JSONL | Zero counts, no event |

## 9. COMPLEXITY ASSESSMENT

| Factor | Assessment | Notes |
|--------|------------|-------|
| Algorithm | Trivial | Range check per record |
| Integration | Small | One call site at lineage completion |
| Blast radius | Minimal | Warn-only; no outcome change by REQ-002 |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| False positives erode trust in the signal | Low | Medium | Tolerance + boundary fixtures + inclusive bounds |
| Warn-only means nobody looks | Medium | Low | Summary field surfaces counts where operators already look |

## 11. USER STORIES

- **US-001**: As a fan-out operator, when a lineage invents its timeline I see it in the run summary immediately instead of discovering it during manual verification. Acceptance: anomaly counts in orchestration summary.
- **US-002**: As an analytics consumer, I can filter lineages with anomalous telemetry before trusting duration data. Acceptance: ledger event queryable per lineage.

## 12. OPEN QUESTIONS

- None. The defect, ground-truth source, and integration point were all identified from the live 2026-07-02 incident.
<!-- /ANCHOR:questions -->

## 13. ACCEPTANCE SCENARIO: Fabricated Pre-Window Sequence

**Given** a lineage state log with 11 minute-spaced timestamps before the runner window, when the checker evaluates the records, then all 11 records are anomalous and the offender sample is bounded.

## 14. ACCEPTANCE SCENARIO: Honest In-Window Sequence

**Given** a lineage state log whose timestamps fall inside the runner window, when the checker evaluates the records, then anomaly counts are zero and no offender sample is returned.

## 15. ACCEPTANCE SCENARIO: Boundary-Exact Records

**Given** records exactly at `windowStart` and `windowEnd`, when the checker applies inclusive bounds and tolerance, then those records remain clean.

## 16. ACCEPTANCE SCENARIO: Unparseable Timestamp

**Given** a record with a `timestamp` field that is not parseable as ISO-8601, when the checker evaluates it, then it is counted as both `unparseable` and `anomalous`.

## 17. ACCEPTANCE SCENARIO: Untimestamped Record

**Given** a record with no `timestamp` field, when the checker evaluates it, then it increments `untimestamped` without incrementing `anomalous`.

## 18. ACCEPTANCE SCENARIO: Clean Emission Gating

**Given** a successful fanout lineage with clean timestamp counts, when the runner writes the status ledger and orchestration summary, then no timestamp-anomaly event or summary field is emitted.

## 19. L3 VALIDATOR TRACE: Plan Summary

Pointer: `plan.md` documents the pure-core thin-shell summary and technical context.

## 20. L3 VALIDATOR TRACE: Quality Gates

Pointer: `plan.md` records Definition of Ready and Definition of Done for this child.

## 21. L3 VALIDATOR TRACE: Architecture

Pointer: `plan.md` names the checker, runner call site, and emission path.

## 22. L3 VALIDATOR TRACE: Implementation Phases

Pointer: `plan.md` breaks the work into setup, implementation, and verification phases.

## 23. L3 VALIDATOR TRACE: Testing Strategy

Pointer: `plan.md` lists unit and regression verification with vitest.

## 24. L3 VALIDATOR TRACE: Dependencies

Pointer: `plan.md` states the child is independent of sibling phases.

## 25. L3 VALIDATOR TRACE: Rollback

Pointer: `plan.md` keeps rollback to removing the additive call site.

## 26. L3 VALIDATOR TRACE: Phase Dependencies

Pointer: `plan.md` defines setup before implementation before verification.

## 27. L3 VALIDATOR TRACE: Effort

Pointer: `plan.md` scopes the effort as small to small-medium.

## 28. L3 VALIDATOR TRACE: Enhanced Rollback

Pointer: `plan.md` names false positives and consumer breakage rollback actions.

## 29. L3 VALIDATOR TRACE: AI Execution

Pointer: `plan.md` records the pre-task checklist, execution rules, reporting format, and blocker handling.

## 30. L3 VALIDATOR TRACE: Architecture Overview

Pointer: Architecture stays limited to one pure helper and one fanout runner integration.

## 31. L3 VALIDATOR TRACE: Risk Mitigation

Pointer: Tolerance, clean gating, and warn-first emission mitigate false positives and rollout risk.

## 32. L3 VALIDATOR TRACE: Task Notation

Pointer: `tasks.md` defines pending, completed, parallelizable, and blocked markers.

## 33. L3 VALIDATOR TRACE: Task Phase 1

Pointer: `tasks.md` Phase 1 records code-reading and test-convention setup.

## 34. L3 VALIDATOR TRACE: Task Phase 2

Pointer: `tasks.md` Phase 2 records checker and runner integration tasks.

## 35. L3 VALIDATOR TRACE: Task Phase 3

Pointer: `tasks.md` Phase 3 records focused fixtures, invariance, full suite, and doc closeout.

## 36. L3 VALIDATOR TRACE: Completion Criteria

Pointer: `tasks.md` records all tasks complete and strict validation run.

## 37. L3 VALIDATOR TRACE: Cross References

Pointer: `tasks.md` links back to spec, plan, and decisions.

## 38. L3 VALIDATOR TRACE: Architecture Tasks

Pointer: The implementation tasks are limited to the checker, call site, and tests.

## 39. L3 VALIDATOR TRACE: What Built

Pointer: `implementation-summary.md` records the pure checker, fanout integration, and tests.

## 40. L3 VALIDATOR TRACE: How Delivered

Pointer: `implementation-summary.md` records read order, baseline, implementation, mutation check, and doc closeout.

## 41. L3 VALIDATOR TRACE: Decisions

Pointer: `implementation-summary.md` records the runtime decisions that held during implementation.

## 42. L3 VALIDATOR TRACE: Verification

Pointer: `implementation-summary.md` records the exact command results and suite deltas.

## 43. L3 VALIDATOR TRACE: Limitations

Pointer: `implementation-summary.md` records the P2 state-read deferral and warn-first limitation.

## 44. L3 VALIDATOR TRACE: Architecture Summary

Pointer: Architecture remains additive and warning-only at the orchestration boundary.

## 45. L3 VALIDATOR TRACE: Checklist Protocol

Pointer: `checklist.md` defines P0, P1, and P2 handling.

## 46. L3 VALIDATOR TRACE: Pre-Implementation

Pointer: `checklist.md` confirms requirements, approach, and decisions existed before implementation.

## 47. L3 VALIDATOR TRACE: Code Quality

Pointer: `checklist.md` records comment hygiene and pure-checker evidence.

## 48. L3 VALIDATOR TRACE: Security

Pointer: `checklist.md` records no secrets, credentials, or external I/O.

## 49. L3 VALIDATOR TRACE: Documentation

Pointer: `checklist.md` records implementation-summary and tolerance documentation evidence.

## 50. L3 VALIDATOR TRACE: File Organization

Pointer: `checklist.md` records in-scope runtime files and packet docs only.

## 51. L3 VALIDATOR TRACE: Architecture Verification

Pointer: `checklist.md` verifies warn-first behavior and runner-owned timing.

## 52. L3 VALIDATOR TRACE: Performance Verification

Pointer: `checklist.md` records the P2 deferral for reusing salvage-loaded state records.

## 53. L3 VALIDATOR TRACE: Deployment Readiness

Pointer: `checklist.md` records rollback by call-site removal.

## 54. L3 VALIDATOR TRACE: Compliance Verification

Pointer: `checklist.md` records no regulatory or privacy surface.

## 55. L3 VALIDATOR TRACE: Documentation Verification

Pointer: `checklist.md` records final-state agreement across packet docs.

## 56. L3 VALIDATOR TRACE: Sign-Off

Pointer: `checklist.md` records command-output verification by this implementation session.

## 57. L3 VALIDATOR TRACE: Decision Context

Pointer: `decision-record.md` preserves the warn-first and boundary-placement context.

## 58. L3 VALIDATOR TRACE: Decision Consequences

Pointer: `decision-record.md` records the positive and negative consequences of the chosen rollout.

## 59. L3 VALIDATOR TRACE: Decision Implementation

Pointer: `decision-record.md` records affected systems and rollback notes.

## 60. L3 VALIDATOR TRACE: Generated Metadata

Pointer: `description.json` and `graph-metadata.json` are refreshed for memory and graph visibility.

---

## RELATED DOCUMENTS

- **Origin incident**: fabricated 12:01-12:10 sequence in `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/gpt/deep-review-state.jsonl` vs the 13:15-13:49Z ledger window in `review/orchestration-status.log`
- **Local decisions**: `decision-record.md` — **Plan**: `plan.md` — **Tasks**: `tasks.md` — **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
