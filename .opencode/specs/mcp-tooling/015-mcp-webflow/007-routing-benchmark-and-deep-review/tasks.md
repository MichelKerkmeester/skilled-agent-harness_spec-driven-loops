---
title: "Tasks: Phase 7 - Webflow routing benchmark and deep review"
description: "Benchmark compiled routing and boundaries, prove advisor recall, and run an independent deep review with verified resolution or approved deferral."
trigger_phrases: ["webflow benchmark tasks", "webflow deep review tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/007-routing-benchmark-and-deep-review"
    last_updated_at: "2026-08-02T16:40:00Z"
    last_updated_by: "pi"
    recent_action: "Created benchmark and deep-review tasks"
    next_safe_action: "Wait for Phase 6"
    blockers: ["Hub registration is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
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
- [ ] T001 Load benchmark and deep-review contracts.
- [ ] T002 Confirm Webflow and boundary scenarios exist in the compiled-routing suite.
- [ ] T003 Snapshot baseline findings and current route outputs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Run the compiled-routing suite with Webflow scenarios.
- [ ] T005 Record the dated run report with pass/fail evidence.
- [ ] T006 Run boundary matrix cases against sibling modes.
- [ ] T007 Run advisor recall probes for representative Webflow prompts.
- [ ] T008 Reconcile deltas against the baseline; record failures and recommendations.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T009 Scope the review to the packet and hub surfaces.
- [ ] T010 Run `/deep:review` iterations to convergence.
- [ ] T011 Verify every finding against the real surface before acting.
- [ ] T012 Resolve P0 findings; obtain operator approval for P1 deferrals.
- [ ] T013 Issue the verdict in `review-report.md`; update summary and hand off to Phase 8.
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
