---
title: "Tasks: Parent-skill native invocability"
description: "Task Format: T### [P?] Description (file path). All tasks are pending: this packet is plan-only and execution is gated by the user."
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
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability/001-native-invocability-planning"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Listed Phase 1 research tasks; all pending pending the user gate"
    next_safe_action: "Await user gate; then start the runtime extensibility probe task"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

All tasks below are pending. This packet is plan-only and every implementation task is gated on the user's go-ahead.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Phase intent: research and design. This phase produces the mechanism decision.**

- [ ] T001 [P] Probe OpenCode skill discovery for any hook, config, or manifest the binary honors (research notes)
- [ ] T002 [P] Probe Claude-Code skill discovery for the same extension points (research notes)
- [ ] T003 Confirm the no-in-repo-extension-point finding: `opencode.json` has no skills config and `.opencode/plugin/` is empty (research notes)
- [ ] T004 Prototype the least-bad mechanism against the one-`graph-metadata.json` invariant (prototype notes)
- [ ] T005 Produce the mechanism decision selecting among options A through D with cited evidence and a fallback (decision-record.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Gated on Phase 1. Do not start before the mechanism decision and the user go-ahead.**

- [ ] T006 [B] Implement the chosen mechanism generically for parent skills (surfaces decided in Phase 1)
- [ ] T007 [B] Keep exactly one advisor identity per parent skill (advisor maps and registry)
- [ ] T008 [B] Keep routing-parity and drift-guard fixtures green or migrate them deliberately (test fixtures)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Gated on Phase 2.**

- [ ] T009 [B] Confirm a parent skill's modes are natively reachable by the operator (runtime probe)
- [ ] T010 [B] Confirm the single-identity invariant is intact and the `sk-design` conversion can adopt the mechanism (fixtures plus review)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
