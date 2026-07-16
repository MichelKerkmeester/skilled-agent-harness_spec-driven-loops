---
title: "Tasks: sk-code changelog and version verification (032 phase 008/008)"
description: "Execution tasks for checking the sk-code release entry, version coherence, exemption boundary, and handoff to the final subtree gate without performing migration work."
trigger_phrases:
  - "sk-code changelog verification tasks"
  - "sk-code release evidence tasks"
  - "sk-code version check tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification tasks"
    next_safe_action: "Execute the release-evidence task set"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-code changelog and version verification

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

- [ ] T001 Load the 001-007 checklists, maps, handoffs, pinned BASE SHA, and candidate release evidence.
- [ ] T002 [P] Inventory the new changelog entry, historical entries, active version surfaces, dates, and public summaries.
- [ ] T003 Classify each 001-007 surface and every retained non-kebab name against the 032 exemption/frozen boundary.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build a release-evidence matrix covering hub/shared, code-opencode, code-quality, code-review, code-webflow,
  playbook, and benchmark handoffs.
- [ ] T005 Compare the candidate version with BASE `4.1.0.0`, `SKILL.md`, `README.md`, frontmatter, and active metadata.
- [ ] T006 Compare historical changelog files with BASE and record any mutation, missing entry, or overclaim.
- [ ] T007 Prepare the 009 handoff with entry paths, version values, exemption coverage, and unresolved findings.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Check that the new changelog entry covers every 001-007 rename surface and applicable reference/validation evidence.
- [ ] T009 Check that the post-migration version is greater than `4.1.0.0` and consistent across all declared active surfaces.
- [ ] T010 Verify that the phase performed no filesystem rename, code change, unrelated changelog rewrite, or history mutation.
- [ ] T011 Mark the release evidence pass or block result; route every discrepancy to 009 without silently correcting it.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the release-evidence matrix
- [ ] The phase checklist is green or records the blocking handoff to 009
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Predecessor**: See ../007-benchmark/spec.md
- **Successor**: See ../009-skill-gate/spec.md
- **Governing policy**: See ../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->

