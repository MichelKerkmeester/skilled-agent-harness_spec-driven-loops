---
title: "Tasks: Phase 1: research-and-context"
description: "Task list for the read-only phase 001 research gate before mcp-tooling parent-hub architecture decisions."
trigger_phrases:
  - "mcp-tooling parent tasks"
  - "research gate tasks"
  - "mcp bridge referrer inventory tasks"
  - "figma transport fold-in tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/001-research-and-context"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted pending tasks for the read-only research gate"
    next_safe_action: "Human review before executing the scoped research passes"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/001-research-and-context/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/001-research-and-context/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research-and-context

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

- [ ] T001 Confirm phase scope, parent handoff criteria, and the no-write boundary outside `001-research-and-context/` (`spec.md` §3 SCOPE)
- [ ] T002 List the exact live descriptor files to read for the three bridges (`mcp-chrome-devtools/SKILL.md`, `mcp-click-up/SKILL.md`, `mcp-figma/SKILL.md` plus each `graph-metadata.json`)
- [ ] T003 [P] Define the referrer inventory grep terms and required evidence format for the three bridge skill ids and their skill-folder paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Execute the skill-state research pass and capture current versions, tracked file counts, graph metadata, README posture, and `allowed-tools` for all three bridges (`spec.md` Planning-Time Skill-State Snapshot)
- [ ] T005 Execute the transport-eligibility pass and classify each bridge workflow or transport from its `allowed-tools`, confirming figma's `depends_on sk-design` pairing edge (`spec.md` §4 REQ-003)
- [ ] T006 Execute the referrer inventory pass and record every live file reference with file:line evidence, including the stale `mcp-open-design` entry in `doctor_mcp_install.yaml` and the 3 labeled-prompts rows targeting `mcp-chrome-devtools`
- [ ] T007 Confirm the name-keyed `.utcp_config.json` manuals and the `code_mode` registration key stay out of the repoint set (`spec.md` Planning-Time Referrer Inventory)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Reconcile research artifacts so the skill-state snapshot, transport-eligibility evidence, and referrer inventory do not contradict each other
- [ ] T009 Verify zero files outside this phase folder were modified during phase execution
- [ ] T010 Run phase-folder validation and stop for human review before phase 002 begins
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Research gate reviewed and confirmed to keep the phase 002 decision-record target shape valid
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
