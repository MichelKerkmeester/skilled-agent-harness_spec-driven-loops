---
title: "Tasks: sk-design checked-in routing-benchmark fixtures"
description: "Task list for the benchmark fixtures: derive a fixture set per mode from each manual_testing_playbook, persist a motion-labelled report, and run the skill-benchmark for all five modes. Not started."
trigger_phrases:
  - "sk-design benchmark fixtures tasks"
  - "motion benchmark report tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Enumerated the fixture-seeding tasks across five modes"
    next_safe_action: "Derive fixtures from the manual playbooks, then run the skill-benchmark"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Read the missing-fixtures finding and the audit (R2), foundations (P2-3), and motion (P2) per-mode fixture shapes from the lineage research
- [ ] T002 Confirm the `../014-routing-benchmark` report-pair shape so the seeded fixtures align with the skill-benchmark harness
- [ ] T003 Read each mode's `manual_testing_playbook/` scenarios and their `expected_intent` and `expected_resources` metadata
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Derive the design-interface fixture set from its playbook scenarios (id, prompt, expected mode, expected intent, expected resources) under `014-routing-benchmark/design-interface/`
- [ ] T005 [P] Derive the design-foundations fixture set from its six playbook scenarios under `014-routing-benchmark/design-foundations/`
- [ ] T006 [P] Derive the design-motion fixture set from its playbook scenarios and persist a motion-labelled benchmark report under `014-routing-benchmark/design-motion/`
- [ ] T007 [P] Derive the design-audit fixture set from its five replay prompts under `014-routing-benchmark/design-audit/`
- [ ] T008 [P] Derive the design-md-generator fixture set from its playbook scenarios under `014-routing-benchmark/design-md-generator/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the skill-benchmark against the seeded fixtures for all five modes and capture the per-mode reports
- [ ] T010 Confirm motion has its own labelled report artifact and each fixture cites its source manual_testing_playbook scenario id
- [ ] T011 Run `validate.sh --strict` on this packet (0 errors)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The skill-benchmark runs against the fixtures for all five modes, motion has its own report, and strict validation passes

### Status note

This packet is NOT STARTED. It scaffolds the checked-in fixture set per mode the 014 and 015 work called for, since no mode had its claimed score backed by checked-in fixtures and motion had no benchmark report at all. A later subagent derives the fixtures from each mode's manual_testing_playbook, persists a motion-labelled report, runs the skill-benchmark for all five modes, and records the reproducible baseline.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See the audit, foundations, and motion lineage research and `../014-routing-benchmark/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
