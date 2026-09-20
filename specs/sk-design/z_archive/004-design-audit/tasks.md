---
title: "Tasks: Reconstruct the sk-design audit mode"
description: "Task breakdown for rebuilding the missing audit packet from the intact design-audit source, its references, procedures, assets, scripts, and supporting playbook material. Tasks preserve the read-only audit contract and do not introduce runtime work."
trigger_phrases:
  - "audit reconstruction tasks"
  - "design QA task breakdown"
  - "audit scoring tasks"
  - "audit source traceability tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/004-design-audit"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful audit tasks"
    next_safe_action: "Review tasks against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/references/"
      - ".opencode/skills/sk-design/design-audit/assets/"
      - ".opencode/skills/sk-design/design-audit/procedures/"
      - ".opencode/skills/sk-design/design-audit/scripts/"
      - ".opencode/specs/sk-design/004-design-audit/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-audit-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design audit mode
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

- [ ] T001 Read the complete design-audit SKILL.md and capture its public mode contract
- [ ] T002 [P] Read every reference file under .opencode/skills/sk-design/design-audit/references/
- [ ] T003 [P] Read every asset file under .opencode/skills/sk-design/design-audit/assets/
- [ ] T004 [P] Read both private procedure cards and both deterministic check scripts
- [ ] T005 [P] Read the supporting README, feature catalog, manual playbook, and changelog
- [ ] T006 Read the four Level-2 manifest templates and the validated Level-2 reference packet
- [ ] T007 Record target resolution, evidence labels, register gate, score, severity, hardening, procedure, owner, handoff, and script boundaries
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Author spec.md with source-faithful audit ownership, evidence contract, score, edge cases, risks, and traceability
- [ ] T009 Author plan.md with source-first phases, affected-surface map, testing strategy, dependencies, and downstream boundaries
- [ ] T010 Author tasks.md with bounded setup, authoring, and structural-verification work
- [ ] T011 Author checklist.md with Level-2 protocol, source checks, N/A handling, and summary
- [ ] T012 Preserve the required frontmatter fields, exactly four trigger phrases, continuity values, markers, and anchors in all four files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Confirm spec.md has the reconstruction banner immediately before section 1 and the exact Spec Folder metadata row
- [ ] T014 Confirm every file has exactly four trigger phrases and the required continuity fields within the size limit
- [ ] T015 Confirm every required template anchor has one matching close and Markdown remains well formed
- [ ] T016 Confirm Sources / Traceability cites the real references, procedures, assets, scripts, and supporting paths without unsupported behavior
- [ ] T017 Confirm the packet contains only spec.md, plan.md, tasks.md, and checklist.md and no generated metadata
- [ ] T018 Record line counts without running a generator, validator, node/npm command, or git command
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual source-fidelity and structure verification passed
- [ ] The packet remains explicitly marked as a reconstruction draft
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
