---
title: "Tasks: foundations + motion styles-library wiring (Phase C)"
description: "Run queue for wiring design-foundations and design-motion to the styles library via the phase-007 seam: shape contracts, build the typed compatibility graph and restraint gate, verify authority order. Planned scaffold; all tasks pending."
trigger_phrases:
  - "foundations motion wiring tasks"
  - "compatibility graph tasks"
  - "restraint gate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/009-foundations-motion"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the foundations-motion L3 scaffold"
    next_safe_action: "Build the phase-007 seam wiring for foundations then motion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-found-motion-011-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: foundations + motion styles-library wiring (Phase C)

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the phase-007 seam contract and phase-008 fixtures are consumable (`../007-*/`, `../008-interface-audit-pilots/`)
- [x] T002 [P] Shape the foundations contract: relationship blueprint + typed graph fields (`.opencode/skills/sk-design/design-foundations/`)
- [x] T003 [P] Shape the motion contract: restraint gate + polarity-aware eligibility fields (`.opencode/skills/sk-design/design-motion/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the foundations typed compatibility graph over 1 coherent style + max 3 axis owners (`design-foundations/`)
- [x] T005 Build the foundations relationship blueprint + transformation ledger (source → relationship → transformation → lock) (`design-foundations/`)
- [x] T006 Add foundations downstream `not-assessed` checks and reject raw averaging/interpolation + top-level co-presence (`design-foundations/`)
- [x] T007 Build the motion restraint-first query gate that resolves BEFORE any retrieval (`design-motion/`)
- [x] T008 Build motion polarity-aware eligibility with hard negatives, purpose/state archetypes, and negative baselines (`design-motion/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify foundations never emits averaged tokens and never overrides target roles/values, accessibility, or extraction truth (`design-foundations/`)
- [x] T010 Verify motion gates before retrieval, blocks hard-negative false positives, and never overrides reduced-motion/performance proof or the target mechanism (`design-motion/`)
- [x] T011 Update spec/plan/tasks status and run parent recursive validation (`.opencode/specs/sk-design/011-sk-design-styles-utilization/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Foundations typed-edge + motion restraint-gate acceptance criteria verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
