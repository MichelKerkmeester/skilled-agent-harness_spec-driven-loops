---
title: "Tasks: sk-git changelog verification (032 phase 008/012/005)"
description: "Read-only tasks for verifying the sk-git migration changelog entry and version bump."
trigger_phrases:
  - "sk-git changelog tasks"
  - "032 version bump verification tasks"
  - "migration release evidence tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the changelog verification task breakdown"
    next_safe_action: "Run the read-only evidence checks after sibling phases land"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/changelog/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git changelog verification

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
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin the candidate commit and collect sibling phase reports, map hashes, and final scope counts.
- [ ] T002 Read the current SKILL.md and README.md version values and locate changelog/v1.3.2.0.md.
- [ ] T003 [P] Confirm this phase has no rename, content-edit, version-bump, release, or tag authority.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Compare the changelog entry with the references, assets, manual-playbook, and benchmark sibling maps.
- [ ] T005 Verify the entry states the kebab-case rule and Python, Python-package, and tool-mandated exemptions.
- [ ] T006 Verify SKILL.md, README.md, and changelog all expose version 1.3.2.0.
- [ ] T007 Record any mismatch as a blocking finding without repairing it in this phase.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify the entry exists, has the correct heading, and names all four sibling surfaces.
- [ ] T009 Verify its source/target and exemption claims match the sibling evidence exactly.
- [ ] T010 Verify git status and diff show no phase-005 mutation.
- [ ] T011 Record commands, exit codes, evidence paths, and candidate SHA in the SOL report.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x].
- [ ] No [B] blocked tasks remain.
- [ ] Every phase requirement has evidence in the checklist and SOL report.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Acceptance contract**: See checklist.md
- **Parent map**: See ../spec.md
<!-- /ANCHOR:cross-refs -->
