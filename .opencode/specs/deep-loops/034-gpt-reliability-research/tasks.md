---
title: "Tasks: GPT Reliability Research Campaign"
description: "Task Format: T### [P?] Description (file path). Campaign not started."
trigger_phrases:
  - "tasks"
  - "gpt reliability research tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/034-gpt-reliability-research"
    last_updated_at: "2026-07-03T00:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task list authored"
    next_safe_action: "T001 setup"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: GPT Reliability Research Campaign

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Scaffold `research/` tree (iterations/, findings-registry.md, iteration-log.md), author the 10 angle briefs seeded from 033's scorecards, and the xhigh dispatch prompt template with the evidence-cited output contract.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Run the orchestrated loop: up to 30 GPT-5.5-fast xhigh iterations, one at a time, ~2-min checks, per-iteration grade (productive/thin/stuck/off-target), kill+retry-once on stalls, dynamic angle rotation per the convergence rule.
- [ ] T003 Maintain `research/findings-registry.md`: extract + dedupe findings per iteration (surface, evidence, proposal, tag, expected effect, effort).
- [ ] T004 Maintain `research/iteration-log.md`: one row per iteration (angle, duration, verdict, new-findings count, steering decision).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Write `research/synthesis.md`: ranked P0/P1/P2 proposals, each mapped to a measured 033 failure and the behavior-benchmark cells that would verify the fix.
- [ ] T006 Close docs (impl-summary/checklist 100%), regen metadata, `validate.sh --strict`, commit+push scoped.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] ≥20 productive iterations or early convergence (all angles dry), evidence persisted per iteration.
- [ ] Registry covers ≥8 of 10 angles; synthesis ranks proposals with 033 linkage.
- [ ] Zero writes outside the packet tree.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Evidence base**: `../033-deep-loop-behavior-benchmarks/005-scorecard-and-integration/scorecard.md`
<!-- /ANCHOR:cross-refs -->
