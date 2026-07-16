---
title: "Tasks: system-skill-advisor changelog verification"
description: "Concrete evidence tasks for verifying the rename-set changelog entry and matching version bump without performing migration work."
trigger_phrases:
  - "changelog verification tasks"
  - "advisor release evidence tasks"
  - "version bump audit tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/007-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification tasks"
    next_safe_action: "Locate the canonical version source and newest release entry"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/changelog"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The release version is supplied by the execution owner; this phase does not infer or create it."
---

# Tasks: system-skill-advisor changelog verification

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

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Locate the canonical skill version source and newest changelog entry
- [ ] T002 Collect sibling 001–006 checklist receipts and phase 008 gate evidence
- [ ] T003 Record current version strings, release dates, links, and known documentation drift
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Perform no rename, source edit, or release-entry rewrite in this phase
- [ ] T005 Compare the release entry's claimed rename groups and exemptions to sibling evidence
- [ ] T006 Record missing, contradictory, or unsupported claims as blocking evidence
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the entry covers MCP root, scripts, references, hooks, catalog, and playbook outcomes
- [ ] T008 Confirm preserved exemptions, compatibility impact, and verification receipts are stated
- [ ] T009 Confirm version/date/link metadata agrees with the canonical source and release decision
- [ ] T010 Emit a pass/fail receipt for the subtree gate
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
