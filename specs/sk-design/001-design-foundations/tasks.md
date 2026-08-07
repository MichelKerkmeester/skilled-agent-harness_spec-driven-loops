---
title: "Tasks: Reconstruct the sk-design foundations mode"
description: "Task breakdown for rebuilding the missing foundations packet from the intact design-foundations source, its references and assets, and the required Level-2 document structure. Tasks preserve the read-only mode contract and do not introduce runtime work."
trigger_phrases:
  - "foundations reconstruction tasks"
  - "static visual system tasks"
  - "sk-design task breakdown"
  - "foundations source traceability tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/001-design-foundations"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted foundations reconstruction task breakdown"
    next_safe_action: "Execute authoring verification tasks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/SKILL.md"
      - ".opencode/skills/sk-design/design-foundations/references/"
      - ".opencode/skills/sk-design/design-foundations/assets/"
      - ".opencode/specs/sk-design/001-design-foundations/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-foundations-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design foundations mode
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

Task Format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the complete design-foundations SKILL.md and capture its mode contract
- [ ] T002 [P] Read every reference file under .opencode/skills/sk-design/design-foundations/references/
- [ ] T003 [P] Read every asset file under .opencode/skills/sk-design/design-foundations/assets/
- [ ] T004 Read the four Level-2 manifest templates and the validated Level-2 reference packet
- [ ] T005 Record backendKind reference-base, Read/Glob/Grep, mutatesWorkspace false, shared handoff, and one-card selection
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Author spec.md with source-faithful ownership, boundaries, requirements, edge cases, and traceability
- [ ] T007 Author plan.md with source-first phases, affected surfaces, testing strategy, dependencies, and rollback
- [ ] T008 Author tasks.md with bounded setup, authoring, and verification work
- [ ] T009 Author checklist.md with Level-2 protocol, source checks, N/A handling, and summary
- [ ] T010 Preserve the required frontmatter fields and continuity values in all four files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm spec.md has the reconstruction banner immediately before section 1 and the exact Spec Folder metadata row
- [ ] T012 Confirm every file has exactly four trigger phrases and the required continuity fields
- [ ] T013 Confirm every template anchor has one matching close and markdown remains well formed
- [ ] T014 Confirm Sources / Traceability cites real references/assets paths and no unsupported behavior is stated
- [ ] T015 Confirm only spec.md, plan.md, tasks.md, and checklist.md exist in the target packet
- [ ] T016 Record line counts without running a generator, validator, node/npm command, or git command
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remaining
- [ ] Manual source-fidelity and structure verification passed
- [ ] The packet remains explicitly marked as a reconstruction draft
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: See spec.md
- Plan: See plan.md
- Verification Checklist: See checklist.md
<!-- /ANCHOR:cross-refs -->
