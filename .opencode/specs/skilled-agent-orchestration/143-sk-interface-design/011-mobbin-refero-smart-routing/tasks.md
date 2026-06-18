---
title: "Tasks: Phase 11: mobbin-refero-smart-routing [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mobbin refero routing tasks"
  - "phase 011 tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/011-mobbin-refero-smart-routing"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added the hybrid initiative/ask decision gate for Mobbin/Refero"
    next_safe_action: "Strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/references/design-grounding/design_references_mcp.md"
      - ".opencode/skills/sk-interface-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mobbin-refero-smart-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: mobbin-refero-smart-routing

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Author the decision gate.

- [x] T001 Add the "Deciding whether to consult (initiative or ask)" gate to design_references_mcp.md §3: category taxonomy, initiative/ask/fall-back, source pick
- [x] T002 Add the §1 pointer to the gate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Surface it in the skill.

- [x] T003 Reframe SKILL.md §2 resource row from ON_DEMAND to INITIATIVE/ASK with the source split
- [x] T004 Add SKILL.md §4 ALWAYS rule 7 (decide at the critique step, by initiative or ask)
- [x] T005 Version bump (v1.5.0.0) + changelog
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Confirm gate + guardrails.

- [x] T006 Confirm the existing guardrails (one reference, no chooser, read live, never copied, grounding upstream) are intact
- [x] T007 Strict-validate this phase; reconcile parent map + children_ids
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
