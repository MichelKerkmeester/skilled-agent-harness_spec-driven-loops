---
title: "Tasks: Reconstruct the sk-design interface mode"
description: "Task breakdown for rebuilding the missing interface packet from the intact design-interface source, its 19 references, six procedures, pre-flight asset, and required Level-2 document structure. Tasks preserve the source boundaries and do not introduce runtime work."
trigger_phrases:
  - "interface reconstruction tasks"
  - "design-interface task breakdown"
  - "interface source traceability tasks"
  - "interface composition tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/002-design-interface"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Reconstructed interface source contract"
    next_safe_action: "Review packet against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/"
      - ".opencode/skills/sk-design/design-interface/assets/"
      - ".opencode/skills/sk-design/design-interface/procedures/"
      - ".opencode/specs/sk-design/002-design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-interface-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design interface mode
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

- [ ] T001 Read the complete design-interface SKILL.md and capture its mode contract
- [ ] T002 [P] Read every reference file under .opencode/skills/sk-design/design-interface/references/
- [ ] T003 [P] Read every procedure file under .opencode/skills/sk-design/design-interface/procedures/
- [ ] T004 [P] Read the interface pre-flight asset under .opencode/skills/sk-design/design-interface/assets/
- [ ] T005 Read the four Level-2 manifest templates and the validated Level-2 reference packet
- [ ] T006 Record direction, voice, IA, composition, routing, quality, proof, and handoff boundaries
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Author spec.md with source-faithful direction, voice, IA, composition, requirements, edge cases, and traceability
- [ ] T008 Author plan.md with source-first phases, affected surfaces, testing strategy, dependencies, and rollback
- [ ] T009 Author tasks.md with bounded setup, authoring, and structural-verification work
- [ ] T010 Author checklist.md with Level-2 protocol, source checks, N/A handling, and summary
- [ ] T011 Preserve the required frontmatter fields and continuity values in all four files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Confirm spec.md has the exact reconstruction banner before section 1 and the exact Spec Folder metadata row
- [ ] T013 Confirm every file has exactly four trigger phrases and the required continuity fields
- [ ] T014 Confirm every required template anchor has one matching close and Markdown remains well formed
- [ ] T015 Confirm Sources / Traceability cites all 19 references, six procedures, and the real asset path
- [ ] T016 Confirm no unsupported behavior, runtime result, external lookup, validator, generator, Node/npm command, or Git action is claimed
- [ ] T017 Confirm only spec.md, plan.md, tasks.md, and checklist.md exist in the target packet and record line counts
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
