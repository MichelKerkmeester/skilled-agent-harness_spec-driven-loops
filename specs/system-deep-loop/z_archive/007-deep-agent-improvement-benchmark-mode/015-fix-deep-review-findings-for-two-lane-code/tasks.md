---
title: "Tasks: fix deep-review findings for two-lane code"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "two-lane remediation tasks"
  - "014 findings tasks"
  - "Lane B fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T12:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 015 Level 3 task list from 014 findings"
    next_safe_action: "Start T001 parser fix"
    blockers: []
    key_files:
      - "../014-review-two-lane-workflow-implementation/review/all-findings.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: fix deep-review findings for two-lane code

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

P0 release blocker - the Lane B command must run before any hardening lands.

- [ ] T001 Fix `parseArgs` to accept `--key value` additively (scripts/shared/loop-host.cjs)
- [ ] T002 Add space-form parser regression test + TST-1 identity assertion (scripts/tests/loop-host.vitest.ts)
- [ ] T003 Verify Lane B command end-to-end through the YAML path to benchmark-complete
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

P1 security cluster.

- [ ] T004 Read-only grader/executor dispatch default + cwd sandbox assert, F-P1-1 (scripts/model-benchmark/dispatch-model.cjs)
- [ ] T005 [P] Quote or argv-array YAML interpolation, F-P1-2 (deep_start-model-benchmark-loop_auto.yaml + _confirm.yaml)
- [ ] T006 [P] Fixture-id traversal sanitization + adversarial table test, F-P1-9 (scripts/model-benchmark/run-benchmark.cjs)
- [ ] T007 [P] Criteria-exec fail-closed default + documented opt-in, F-P1-10 (SKILL.md + scorer gate)
- [ ] T008 Packet-local owner-checked score cache, F-P1-11 (scripts/agent-improvement/score-candidate.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

P1 traceability cluster, P2 dispositions, and the final verification gate.

- [ ] T009 [P] Valid Lane B session outcome, F-P1-3 (both Lane B YAMLs)
- [ ] T010 Thread executor/model fields, F-P1-4 (start-model-benchmark-loop.md + loop-host + run-benchmark)
- [ ] T011 [P] Benchmark plateau stop, F-P1-5 (scripts/shared/reduce-state.cjs)
- [ ] T012 [P] Config-path consolidation, F-P1-6 (Lane B YAMLs + command doc + reduce-state)
- [ ] T013 [P] Scorer provenance on failure, F-P1-7 (scripts/model-benchmark/run-benchmark.cjs)
- [ ] T014 [P] Lane-resolution ordering, F-P1-8 (start-agent-improvement-loop.md)
- [ ] T015 Candidate-keyed cache key, F-P1-12 (scripts/agent-improvement/score-candidate.cjs)
- [ ] T016 [P] Per-iteration immutable reports, F-P1-13 (scripts/model-benchmark/run-benchmark.cjs)
- [ ] T017 [P] Packet-local pause state, F-P1-14 (scripts/model-benchmark/dispatch-model.cjs)
- [ ] T018 [P] Lane B promotion gate, F-P1-15 (deep_start-model-benchmark-loop_confirm.yaml)
- [ ] T019 [P] Repoint agent-note script paths across 4 mirrors, F-P1-16 (agents/deep-agent-improvement.md + mirrors)
- [ ] T020 Disposition each of the 16 P2 advisories: FIXED with evidence or DOCUMENT-ACCEPT with rationale
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every active finding (1 P0 + 1 refuted + 16 P1 + 16 P2) carries exactly one disposition in decision-record.md
- [ ] vitest green; TST-1 byte-identity holds; Lane B end-to-end verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Register**: See `decision-record.md`
- **Findings source**: See `../014-review-two-lane-workflow-implementation/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
