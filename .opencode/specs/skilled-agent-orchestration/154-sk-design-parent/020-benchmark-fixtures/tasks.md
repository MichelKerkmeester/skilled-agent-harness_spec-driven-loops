---
title: "Tasks: sk-design checked-in routing-benchmark fixtures"
description: "Completed task list for the benchmark fixtures: re-synced gold resources to corrected routers and reran deterministic Mode-A report pairs for all five modes."
trigger_phrases:
  - "sk-design benchmark fixtures tasks"
  - "motion benchmark report tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T07:52:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Gold fixtures re-synced"
    next_safe_action: "Use the checked-in reports as the reproducible routing baseline"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design checked-in routing-benchmark fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

- [x] T001 Read the missing-fixtures finding and the audit (R2), foundations (P2-3), and motion (P2) per-mode fixture shapes from the lineage research
- [x] T002 Confirm the report-pair shape from the skill-benchmark runner
- [x] T003 Consume each mode's `manual_testing_playbook/` scenarios and their `expected_intent` and `expected_resources` metadata through the runner
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Capture the design-interface Mode-A report pair under `design-interface/`
- [x] T005 [P] Capture the design-foundations Mode-A report pair under `design-foundations/`
- [x] T006 [P] Capture the design-motion Mode-A report pair under `design-motion/`
- [x] T007 [P] Capture the design-audit Mode-A report pair under `design-audit/`
- [x] T008 [P] Capture the design-md-generator Mode-A report pair under `design-md-generator/`
- [x] T012 [P] Re-sync scenario `expected_resources` frontmatter to corrected router output
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the skill-benchmark in Mode-A router-replay mode for all five modes and capture the per-mode reports
- [x] T010 Confirm motion has its own labelled report artifact and each report cites its source manual_testing_playbook scenario rows
- [x] T011 Run `validate.sh --strict` on this packet with 0 errors and 0 warnings
- [x] T013 Confirm D2 reports 100 for all five modes after gold re-sync
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The skill-benchmark runs for all five modes, motion has its own report and strict validation passes

### Status note

This packet is complete. It captures deterministic Mode-A report pairs per mode from each mode's manual_testing_playbook corpus, re-syncs stale gold resources to corrected router output and records the reproducible baseline.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See the audit, foundations, and motion lineage research and the per-mode report folders in this packet
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
