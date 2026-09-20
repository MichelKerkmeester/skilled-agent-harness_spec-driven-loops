---
title: "Tasks: Reconstruct the sk-design shared backbone"
description: "Task breakdown for rebuilding the missing shared-backbone packet from the complete shared, benchmark, and feature-catalog source sets and the required Level-2 document structure. Tasks preserve the documentation-only boundary and do not introduce runtime work."
trigger_phrases:
  - "shared backbone reconstruction tasks"
  - "sk-design proof contract tasks"
  - "design benchmark evidence tasks"
  - "shared procedure card tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/008-design-shared-backbone"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Draft shared backbone task breakdown"
    next_safe_action: "Execute packet structure checks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/feature_catalog/"
      - ".opencode/specs/sk-design/008-design-shared-backbone/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-shared-backbone-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design shared backbone
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

- [ ] T001 Read all 24 files under .opencode/skills/sk-design/shared/
- [ ] T002 [P] Read all 15 files under .opencode/skills/sk-design/benchmark/
- [ ] T003 [P] Read all 6 files under .opencode/skills/sk-design/feature_catalog/
- [ ] T004 Read the four Level-2 manifest templates and the validated Level-2 reference packet
- [ ] T005 Record register-first loading, context manifests, proof fields, hard gates, and handoff boundaries
- [ ] T006 Record dispatch and token schemas, canonicalization, fail-closed rules, and variant parameters
- [ ] T007 Record procedure-card schema, selection rules, shared polish card, and feature-catalog inventory
- [ ] T008 Record deterministic script responsibilities, test coverage, benchmark snapshots, and measurement gaps
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 Author spec.md with source-faithful shared contracts, boundaries, evidence, edge cases, and traceability
- [ ] T010 Author plan.md with source-first phases, affected surfaces, evidence boundaries, and rollback
- [ ] T011 Author tasks.md with bounded setup, authoring, and verification work
- [ ] T012 Author checklist.md with Level-2 protocol, source checks, N/A treatment, and summary
- [ ] T013 Preserve the required frontmatter fields and continuity values in all four files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Confirm spec.md has the reconstruction banner immediately before section 1 and the exact Spec Folder metadata row
- [ ] T015 Confirm every file has exactly four trigger phrases and the required continuity fields
- [ ] T016 Confirm every template anchor has one matching close and Markdown remains well formed
- [ ] T017 Confirm Sources / Traceability cites every requested source set and the benchmark caveats remain explicit
- [ ] T018 Confirm no packet statement claims a validator, generator, benchmark, deterministic script, transport, or runtime execution result
- [ ] T019 Confirm only spec.md, plan.md, tasks.md, and checklist.md exist in the target packet
- [ ] T020 Record line counts without running a generator, validator, node/npm command, or git command
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
