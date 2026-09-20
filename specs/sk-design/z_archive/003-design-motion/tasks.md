---
title: "Tasks: Reconstruct the sk-design motion mode"
description: "Task breakdown for rebuilding the missing motion packet from the intact design-motion source, its references, procedure, assets, and required Level-2 document structure. Tasks preserve the read-only mode contract and do not introduce runtime work."
trigger_phrases:
  - "motion reconstruction tasks"
  - "temporal interaction tasks"
  - "sk-design motion task breakdown"
  - "motion source traceability tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/003-design-motion"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted motion reconstruction tasks"
    next_safe_action: "Execute motion packet verification tasks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
      - ".opencode/skills/sk-design/design-motion/references/"
      - ".opencode/skills/sk-design/design-motion/procedures/"
      - ".opencode/skills/sk-design/design-motion/assets/"
      - ".opencode/specs/sk-design/003-design-motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-motion-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design motion mode
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

- [ ] T001 Read the complete design-motion SKILL.md and capture its mode contract
- [ ] T002 [P] Read every reference file under .opencode/skills/sk-design/design-motion/references/
- [ ] T003 [P] Read the procedure card under .opencode/skills/sk-design/design-motion/procedures/
- [ ] T004 [P] Read every asset file under .opencode/skills/sk-design/design-motion/assets/
- [ ] T005 Read the four Level-2 manifest templates and the validated Level-2 reference packet
- [ ] T006 Record the restraint gate, routing, Read/Glob/Grep fallback, one-card rule, proof fields, and stack-boundary handoff
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Author spec.md with source-faithful ownership, boundaries, requirements, edge cases, and traceability
- [ ] T008 Author plan.md with source-first phases, affected surfaces, testing strategy, dependencies, and rollback
- [ ] T009 Author tasks.md with bounded setup, authoring, and verification work
- [ ] T010 Author checklist.md with Level-2 protocol, source checks, N/A handling, and summary
- [ ] T011 Preserve the required frontmatter fields and continuity values in all four files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Confirm spec.md has the reconstruction banner immediately before section 1 and the exact Spec Folder metadata row
- [ ] T013 Confirm every file has exactly four trigger phrases and the required continuity fields
- [ ] T014 Confirm every template anchor has one matching close and markdown remains well formed
- [ ] T015 Confirm Sources / Traceability cites the SKILL.md, seven references, procedure, and three assets without unsupported behavior
- [ ] T016 Confirm only spec.md, plan.md, tasks.md, and checklist.md exist in the target packet
- [ ] T017 Record line counts without running a generator, validator, node/npm command, or git command
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
