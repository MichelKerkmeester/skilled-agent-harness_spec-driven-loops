---
title: "Tasks: sk-code benchmark artifacts (032 phase 008/007)"
description: "Execution tasks for the sk-code benchmark storage rename and navigation closure."
trigger_phrases:
  - "benchmark naming tasks"
  - "sk-code benchmark rename tasks"
  - "benchmark storage path tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark phase tasks"
    next_safe_action: "Execute the tracked benchmark path rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-code benchmark artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load frozen map, BASE benchmark evidence, and 006 corpus handoff.
- [ ] T002 [P] Inventory storage labels, report files, fixture paths, README links, and command output paths.
- [ ] T003 Classify generated output, compliant directories, exact names, schemas, keys, identifiers, and frozen content.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename d4r_live, fixtures/sk_code, live_final, live_mode_b, live_remediated, router_baseline, and router_final as mapped.
- [ ] T005 Update benchmark/README.md, storage readmes, report links, command examples, and corpus paths.
- [ ] T006 Preserve generated report content, report filenames, fixture files, and schemas.
- [ ] T007 Record final storage, artifact, and corpus-discovery evidence for 008 and 009.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare final path/file manifest and generated artifact hashes with BASE.
- [ ] T009 Run non-zero benchmark/report discovery through the renamed paths.
- [ ] T010 Compare scenario IDs and corpus membership with the 006 handoff.
- [ ] T011 Verify no active old storage label or out-of-scope content change remains.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Playbook predecessor**: See ../006-manual-testing-playbook/spec.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->
