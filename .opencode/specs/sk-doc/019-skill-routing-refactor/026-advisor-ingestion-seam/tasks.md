---
title: "Task Breakdown: Advisor Ingestion Seam"
description: "Planned tasks for the mechanism decision, implementation, journey documentation, and routing-evidence guidance."
trigger_phrases:
  - "advisor ingestion seam tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Design phase after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Advisor Ingestion Seam

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` planned; `T-nn` in execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Re-verify startup-only watcher discovery and event-gated refresh at the execution tip
- [ ] T-02 Decision record: choose the closure mechanism with daemon-safety trade-offs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-03 Implement the chosen mechanism with unit coverage
- [ ] T-04 Integration test: scaffold → mechanism → warm advisor resolves the new skill
- [ ] T-05 Document the refresh step in both journeys; flag slug-only scaffold defaults
- [ ] T-06 Routing-evidence step tied to scored fields; smoke-test one-liner documented
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-07 Advisor daemon suite green; no watcher-latency regression
- [ ] T-08 SOL adversarial review of the daemon diff; land via rebase-and-push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Integration proof green on a warm daemon; both journeys document the step; suite green; landed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · Evidence `../024-create-journey-gate-fixes/research/swarm/lens3-report.md`
<!-- /ANCHOR:cross-refs -->
