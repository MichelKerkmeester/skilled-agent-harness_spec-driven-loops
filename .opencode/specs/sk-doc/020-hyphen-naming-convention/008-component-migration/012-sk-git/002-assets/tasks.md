---
title: "Tasks: sk-git assets (032 phase 008/012/002)"
description: "Tasks for the sk-git asset and template filename rename phase."
trigger_phrases:
  - "sk-git assets tasks"
  - "032 asset rename tasks"
  - "asset template pointer tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the assets phase task breakdown"
    next_safe_action: "Verify the asset surface is already kebab on v4 and all pointers resolve"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/assets/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git assets

> **SUPERSEDED — VERIFY-ONLY (v4 reconciliation, 2026-07-15).** Concurrent v4 work already committed this rename (on `skilled/v4.0.0.0`). The tasks below are now VERIFICATION tasks for the completed kebab state — not rename execution. Do NOT re-run or reverse any rename. See the packet's v4-reconciliation-inventory.md.

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

- [ ] T001 Pin BASE and record the three-entry asset rename-map hash.
- [ ] T002 Inventory source paths, target paths, modes, symlinks, content fingerprints, and tracked consumers.
- [ ] T003 [P] Confirm the references, manual-playbook, benchmark, and changelog boundaries are excluded from this phase.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Apply commit_message_template.md -> commit-message-template.md, pr_template.md -> pr-template.md, and worktree_checklist.md -> worktree-checklist.md.
- [ ] T005 Update SKILL.md, README.md, and asset/resource tables to target paths.
- [ ] T006 [P] Repair references/ links inside assets/worktree-checklist.md and preserve the checklist content contract.
- [ ] T007 Record an explicit no-op disposition for any target already present at BASE.
- [ ] T008 Confirm no source and target coexist and no key, field, example, or non-path text changed.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify every map entry has one disposition and every target resolves.
- [ ] T010 Verify active asset and reference pointer scans report zero source-path references.
- [ ] T011 Verify content, frontmatter-field, data-key, mode, symlink, and example parity.
- [ ] T012 Verify the diff is limited to assets and listed pointer consumers.
- [ ] T013 Record commands, exit codes, counts, candidate SHA, BASE SHA, and map hash in the SOL report.
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
