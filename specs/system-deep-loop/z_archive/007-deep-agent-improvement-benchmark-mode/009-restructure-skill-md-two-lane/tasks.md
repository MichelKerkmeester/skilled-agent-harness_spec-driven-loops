---
title: "Tasks: SKILL.md two-lane restructure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill-md two-lane tasks"
  - "co-equal lane restructure tasks"
  - "model-benchmark router intent tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/009-restructure-skill-md-two-lane"
    last_updated_at: "2026-05-29T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase 009 tasks"
    next_safe_action: "Restructure SKILL.md into two co-equal lanes + align router"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-docs"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: SKILL.md two-lane restructure

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Read the current SKILL.md structure, the §1 lane table, the §3 Mode 4 block, and the smart-router pseudocode as the input baseline (`.opencode/skills/deep-agent-improvement/SKILL.md`)
- [ ] T002 [P] Confirm the phase 008 two-lane command reality so the doc matches the shipped commands (`.opencode/commands/deep/start-agent-improvement-loop.md`, `.opencode/commands/deep/start-model-benchmark-loop.md`)
- [ ] T003 [P] Confirm the MODEL_BENCHMARK RESOURCE_MAP targets resolve before the phase 010 reorg (`.opencode/skills/deep-agent-improvement/references/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Restructure §1 so Lane A and Lane B read as co-equal and the Lane B cross-reference points at the real Lane B section (`.opencode/skills/deep-agent-improvement/SKILL.md`)
- [ ] T005 Lift the "Mode 4: Model-Benchmark" content into a co-equal Lane B section, preserving entry point, dispatcher, scorer selection, mode-aware records, and hardening env gates (`.opencode/skills/deep-agent-improvement/SKILL.md`)
- [ ] T006 Confirm the smart-router MODEL_BENCHMARK intent and its RESOURCE_MAP entry stay internally consistent after the restructure (`.opencode/skills/deep-agent-improvement/SKILL.md`)
- [ ] T007 Keep shared runtime-contract and rules sections intact and referenced by both lanes, with no content regression (`.opencode/skills/deep-agent-improvement/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm two co-equal lanes present and lane cross-references correct (REQ-001, REQ-003)
- [ ] T009 Confirm MODEL_BENCHMARK router intent plus matching RESOURCE_MAP entry present (REQ-002)
- [ ] T010 Confirm DQI excellent (>=90), HVR clean, no ToC, no content regression, and validate.sh strict passes (REQ-004, REQ-005, REQ-006)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
