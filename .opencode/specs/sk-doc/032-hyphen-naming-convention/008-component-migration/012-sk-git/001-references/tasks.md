---
title: "Tasks: sk-git references (032 phase 008/012/001)"
description: "Tasks for the sk-git reference-file rename and pointer-closure phase."
trigger_phrases:
  - "sk-git references tasks"
  - "032 reference rename tasks"
  - "reference pointer closure tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/001-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/001-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the references phase task breakdown"
    next_safe_action: "Verify the references surface is already kebab on v4 and all pointers resolve"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git references

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

- [ ] T001 Pin BASE and record the nine-entry reference rename-map hash.
- [ ] T002 Inventory source paths, target paths, modes, symlinks, and tracked consumers under sk-git.
- [ ] T003 [P] Confirm the asset, manual-playbook, benchmark, and changelog boundaries are excluded from this phase.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Apply the semantic map for commit_workflows.md, continuous_integration.md, finish_workflows.md, github_mcp_integration.md, gitkraken_mcp_integration.md, large_reorg_playbook.md, quick_reference.md, shared_patterns.md, and worktree_workflows.md.
- [ ] T005 Update SKILL.md and README.md reference paths, router tables, and verification commands.
- [ ] T006 [P] Update assets/worktree-checklist.md and cross-links inside references/.
- [ ] T007 Record an explicit no-op disposition for any source whose hyphenated target is already present at BASE.
- [ ] T008 Confirm no source and target path coexist and no non-path identifier, key, or field changed.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify every map entry has one disposition and every target resolves.
- [ ] T010 Verify the active pointer scan reports zero source-path references and zero broken target links.
- [ ] T011 Verify mode, symlink, content, frontmatter-field, and data-key parity for each renamed file.
- [ ] T012 Verify the diff is limited to the reference files and their listed pointer consumers.
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
