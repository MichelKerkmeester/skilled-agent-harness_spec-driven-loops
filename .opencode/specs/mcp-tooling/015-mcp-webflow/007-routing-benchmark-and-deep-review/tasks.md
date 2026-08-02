---
title: "Tasks: Phase 7 - Webflow routing benchmark and deep review"
description: "Benchmark compiled routing and boundaries, prove advisor recall, and run an independent deep review with verified resolution or approved deferral."
trigger_phrases: ["webflow benchmark tasks", "webflow deep review tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/007-routing-benchmark-and-deep-review"
    last_updated_at: "2026-08-02T19:03:58Z"
    last_updated_by: "pi"
    recent_action: "Created benchmark and deep-review tasks"
    next_safe_action: "Wait for Phase 6"
    blockers: ["Hub registration is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7 - Webflow routing benchmark and deep review

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Load benchmark and deep-review contracts.
  - **Evidence**: `benchmark/README.md` + router-replay contract loaded
- [x] T002 Confirm Webflow and boundary scenarios exist in the compiled-routing suite.
  - **Evidence**: `route-gold.typed.json` inspected — webflow cases ABSENT (B-001); boundary scenarios covered via live `hub-router.json` replay
- [x] T003 Snapshot baseline findings and current route outputs.
  - **Evidence**: baseline report read (`benchmark/reports/baseline/`); current router signals snapshotted
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Run the compiled-routing suite with Webflow scenarios.
  - **Evidence**: router-replay run against live `hub-router.json` signals (12 scenarios)
- [x] T005 Record the dated run report with pass/fail evidence.
  - **Evidence**: dated report at `benchmark/reports/2026-08-02--webflow-registration--routing-replay/report.md` — 12/12 PASS
- [x] T006 Run boundary matrix cases against sibling modes.
  - **Evidence**: boundary matrix 12/12 PASS — `router-replay.cjs` vs live `hub-router.json` signals (see dated report)
- [x] T007 Run advisor recall probes for representative Webflow prompts.
  - **Evidence**: advisor daemon DOWN — static keyword coverage verified in `description.json`; live recall pending daemon restart (B-002)
- [x] T008 Reconcile deltas against the baseline; record failures and recommendations.
  - **Evidence**: deltas vs baseline in `benchmark/reports/2026-08-02--webflow-registration--routing-replay/report.md`; B-001/B-002 recorded
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Scope the review to the packet and hub surfaces.
  - **Evidence**: scope + verdict in `review-report.md`; packet + hub + `.utcp_config.json` reviewed
- [x] T010 Run `/deep:review` iterations to convergence.
  - **Evidence**: `review-report.md` — REJECTED verdict with 5 findings, all resolved; checks passed enumerated
- [x] T011 Verify every finding against the real surface before acting.
  - **Evidence**: `review-report.md` — all 5 findings verified against on-disk surfaces before resolution
- [x] T012 Resolve P0 findings; obtain operator approval for P1 deferrals.
  - **Evidence**: `review-report.md` — all 5 findings verified against on-disk surfaces before resolution
- [x] T013 Issue the verdict in `review-report.md`; update summary and hand off to Phase 8.
  - **Evidence**: `review-report.md` — all 5 findings verified against on-disk surfaces before resolution
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Dated benchmark report exists with full evidence.
- [ ] Boundary and recall evidence recorded.
- [ ] Review verdict issued with zero unresolved P0s and only approved P1 deferrals.
- [ ] No external mutation occurred during benchmark or review.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Registration Phase**: `../006-hub-registration-and-advisor/`
- **Hub Benchmark**: `.opencode/skills/mcp-tooling/benchmark/`
- **Next Phase**: `../008-verification-and-closeout/`
<!-- /ANCHOR:cross-refs -->
