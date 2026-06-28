---
title: "Tasks: Parent-skill native invocability"
description: "Task Format: T### [P?] Description (file path). Decision tasks for ADR-001 are complete; 001 has no source build and carries NFR-S01 to 002."
trigger_phrases:
  - "parent skill invocability tasks"
  - "native invocation task list"
  - "skill discovery probe tasks"
  - "parent mode mechanism tasks"
  - "phase 1 research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled tasks to ADR-001 Accepted: Option E chosen; no runtime probe/source build in 001"
    next_safe_action: "Use 002 to document hub union-grant semantics and finish remaining validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "NFR-S01 closure is carried to 002."
    answered_questions:
      - "A-E mechanism framing is complete."
      - "Option E is accepted; A/B remain fallback surfaces."
---
# Tasks: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
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

Decision tasks are reconciled to reality. This packet has no source implementation; downstream validation and NFR-S01 closure live in 002.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Phase intent: record the mechanism decision honestly.**

- [x] T001 Record the confirmed `Skill(mode)` gap and the one-`graph-metadata.json` invariant (spec.md)
- [x] T002 Frame mechanism options A through E with tradeoffs (decision-record.md)
- [x] T003 Accept Option E, invokable-hub routing, as the chosen mechanism (decision-record.md)
- [x] T004 Record A/B commands and agents as fallback complementary surfaces if hub invocation is insufficient (decision-record.md)
- [ ] T005 Carry NFR-S01 to 002 because 001 does not prove per-mode permission narrowing (spec.md, checklist.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**No source build happens in 001. Downstream packets apply the accepted mechanism.**

- [x] T006 Record that 001 changes authored docs only and does not edit skill/runtime/configuration files (implementation-summary.md)
- [ ] T007 Apply/document the hub union-grant decision in 002 before claiming NFR-S01 satisfied (002-deep-loop-alignment)
- [ ] T008 Keep routing-parity and drift-guard fixtures green when downstream packets implement or validate the mechanism (test fixtures)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Downstream verification.**

- [ ] T009 Confirm a parent skill's modes are reachable through `Skill(<parent>)` (downstream runtime probe)
- [ ] T010 Confirm the single-identity invariant and hub union-grant documentation remain accurate (fixtures plus review)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] NFR-S01 carried to 002 is closed or explicitly accepted there
- [ ] Manual downstream verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
