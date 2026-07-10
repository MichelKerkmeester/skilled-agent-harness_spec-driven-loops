---
title: "Tasks: Phase 7: routing-benchmark-and-review"
description: "Task list for running the router-mode Lane-C benchmark, reviewing its report, executing the independent deep-review pass, and recording the prompt-models routingClass decision."
trigger_phrases:
  - "phase 007 tasks"
  - "sk-prompt benchmark tasks"
  - "deep-review triage tasks"
  - "prompt-models routingClass"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-prompt-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T13:53:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Drafted phase 007 task list"
    next_safe_action: "Run benchmark, review, and triage"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/007-routing-benchmark-and-review/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review-draft"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Execution must resolve the prompt-models routingClass decision from D1/D2 results."
    answered_questions:
      - "This drafting pass authors the plan only and does not run benchmark or review commands."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: routing-benchmark-and-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Optional [P] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 003-006 are the full diff target for independent review. — Evidence: all 4 phases validated `--strict` 0/0 individually and recursively before this phase started.
- [x] T002 Confirm the merged `.opencode/skills/sk-prompt/` hub layout exists before benchmarking. — Evidence: `parent-skill-check.cjs` 0 invariant failures, 0 warnings.
- [x] T003 Confirm the benchmark command will use `.opencode/skills/sk-prompt/benchmark/router-final` as its output directory. — Evidence: `skill-benchmark-report.{md,json}` written there.
- [x] T004 Record that optional live true-verdict dispatch through `cli-opencode` is out of scope for this phase. — Evidence: only `--trace-mode=router` (deterministic Mode A) run; D1inter/D4 remain explicitly unscored, matching the original plan.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run the router-mode Lane-C skill-benchmark command from the workspace root. — Evidence: 3 runs total — first returned `NO-SCENARIOS` (playbook format mismatch), second `FAIL 42/100` (2/4 scenarios failing), third `PASS 100/100` after fixing 2 real bugs (see T008-T010).
- [x] T006 Verify the benchmark produced `skill-benchmark-report.md`. — Evidence: file exists, final content shows PASS 100/100.
- [x] T007 Verify the benchmark produced `skill-benchmark-report.json`. — Evidence: file exists with full per-scenario `routeTelemetry` detail.
- [x] T008 Read the markdown report and summarize D1-D5 results. — Evidence: final report — D1 intra 100/100, D2 discovery 100/100, D5 connectivity 100/100 (hard gate); D1inter/D4/D3 unscored (need live mode, expected for router trace).
- [x] T009 Read the JSON report for exact D1/D2 evidence. — Evidence: `routeTelemetry.workflowMode` correctly resolved `["prompt-models"]` for both named-model scenarios (SP-002, SP-004) once the weight was rebalanced from 3 to 5.
- [x] T010 Decide the routingClass question based on D1/D2 evidence. — Evidence: `routingClass: "metadata"` KEPT — no lexical carve-out needed. Recorded as an amendment to ADR-001 in `../002-architecture-decision/decision-record.md`. Two real bugs found+fixed en route: (1) `hub-router.json`'s `prompt-models` weight (3) was under-competitive against `prompt-improve`'s (4) — raised to 5; (2) the shared Lane-C scenario loader's `expected_intent` regex silently truncated hyphenated values at the first hyphen, always zeroing intentRecall for hyphenated `workflowMode`s regardless of actual routing correctness — fixed in `system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`.
- [x] T011 Run an independent deep-review pass over the full phases 003-006 diff. — Evidence: final comprehensive stale-reference sweep (0 hits outside known-excluded files), version-consistency check (all 3 SKILL.md + description.json versions internally consistent), `parent-skill-check.cjs` re-run (0/0), git-status scope check (confirmed no unintended files touched beyond the sk-prompt tree + the named referrer files; all other dirty files in the working tree pre-date this session).
- [x] T012 Triage each deep-review finding. — Evidence: 0 new findings from the phase 007 review pass itself (all real issues were caught and fixed live during phases 003-006 execution and the benchmark investigation, not held back for this pass); the one intentionally-deferred item (`skill-graph.json` regeneration) is already documented in phase 006.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Confirm no P0 deep-review finding remains untriaged. — Evidence: `implementation-summary.md` Verification table shows 0 untriaged P0 findings; the 2 benchmark bugs found are fixed and documented in T010.
- [x] T014 Confirm every deferred non-blocking finding has a named follow-up. — Evidence: `skill-graph.json` regeneration (phase 006, named follow-up = next coordinated repo-wide reindex).
- [x] T015 Confirm the routingClass decision cites benchmark D1/D2 evidence. — Evidence: `../002-architecture-decision/decision-record.md` ADR-001 Amendment cites the exact `routeTelemetry` JSON evidence and the before/after scores (0/100 -> 100/100).
- [x] T016 Run strict spec validation for the phase folder. — Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../007-routing-benchmark-and-review --strict` — Errors: 0, Warnings: 0.
- [x] T017 Prepare handoff notes for phase 008 cutover. — Evidence: `implementation-summary.md` records the PASS 100/100 verdict, the 2 fixed bugs, and confirms phase 008's STRICT parent-skill-check gate is already satisfied ahead of time.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T017 all checked.
- [x] No `[B]` blocked tasks remaining — Evidence: none carry `[B]`.
- [x] Router-mode benchmark report exists in markdown and JSON forms — Evidence: T006, T007.
- [x] Deep-review findings are triaged with no open P0 item — Evidence: T012, T013.
- [x] `prompt-models` routingClass decision is recorded from D1/D2 benchmark evidence — Evidence: T010, T015.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
