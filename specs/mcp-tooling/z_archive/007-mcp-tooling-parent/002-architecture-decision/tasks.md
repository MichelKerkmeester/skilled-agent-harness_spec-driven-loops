---
title: "Tasks: Phase 2: architecture-decision"
description: "Decision-gate task tracking for freezing the mcp-tooling parent-hub architecture as six ADRs before scaffold work begins."
trigger_phrases:
  - "mcp-tooling architecture tasks"
  - "mcp bridge decision gate tasks"
  - "adr authoring tasks"
  - "phase 002 tasks"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted pending decision-gate tasks"
    next_safe_action: "Operator reviews the decision gate before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Read the operator-locked decisions and treat topology, transport, naming, identity dissolution, code-mode exclusion, and versioning as frozen inputs
- [ ] T002 Confirm the phase is documentation-only and scoped to `002-architecture-decision/` files
- [ ] T003 [P] Review `sk-design`'s `mode-registry.json`/`hub-router.json` as the transport-axis precedent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author ADR-001 (topology: two workflow bridges, one figma transport, transport-axis extension) with `allowed-tools` evidence
- [ ] T005 Author ADR-002 (figma transport plus cross-hub pairing to `sk-design`) and ADR-003 (naming, keep `mcp-` prefix)
- [ ] T006 Author ADR-004 (identity dissolution), ADR-005 (code-mode exclusion), and ADR-006 (versioning, no commands, default mode)
- [ ] T007 Add the concrete `mode-registry.json` and `hub-router.json` target shapes to `plan.md`, including the transport-axis extension and cross-hub pairing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Check no bracketed scaffold placeholders remain across the five phase files
- [ ] T009 Confirm anchors, frontmatter, `SPECKIT_LEVEL: 3`, and `SPECKIT_TEMPLATE_SOURCE` markers are intact
- [ ] T010 Run phase-folder validation and hold phase 003 until the operator approves or amends the gate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Operator has approved or amended all six ADRs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
