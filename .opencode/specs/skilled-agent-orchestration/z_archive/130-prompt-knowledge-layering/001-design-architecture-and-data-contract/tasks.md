---
title: "Tasks: Design — 3-layer prompt-knowledge architecture + contracts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "prompt knowledge design tasks"
  - "architecture decision tasks"
  - "data contract tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/001-design-architecture-and-data-contract"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "opus-orchestrator"
    recent_action: "Design ratified"
    next_safe_action: "Start phase 002 / 003"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-130-001-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Design — 3-layer prompt-knowledge architecture + contracts

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

- [x] T001 Audit current prompt-knowledge state across cli-* + sk-prompt + sk-prompt-small-model
- [x] T002 [P] Generate centralized-SSOT architecture (lens A)
- [x] T003 [P] Generate minimal-disruption architecture (lens B)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Sequential-thinking synthesis; lock Architecture A + all-models scope (spec.md §8)
- [x] T005 Author `recommended_frameworks` JSON schema (spec.md §9)
- [x] T006 Author per-model profile template (spec.md §10)
- [x] T007 Author the single prompt-composition precedence rule (spec.md §11)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 validate.sh --strict on this folder (PASSED)
- [x] T009 Confirm contracts are self-contained for downstream phases
- [x] T010 Update parent Phase Documentation Map + resume pointer
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (design coherent; contracts frozen)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (§8 decision, §9 schema, §10 template, §11 precedence)
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
