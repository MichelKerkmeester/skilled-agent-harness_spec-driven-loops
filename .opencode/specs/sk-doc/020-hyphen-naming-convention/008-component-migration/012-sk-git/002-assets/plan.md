---
title: "Implementation Plan: sk-git assets (032 phase 008/012/002)"
description: "Implementation plan for the sk-git asset and template filename rename. The executor will apply the three-entry semantic map, repair asset and reference pointers, and prove that template content contracts remain intact."
trigger_phrases:
  - "sk-git assets implementation plan"
  - "032 sk-git asset phase plan"
  - "asset template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the assets execution plan and content-parity evidence path"
    next_safe_action: "Verify the asset surface is already kebab on v4 and all pointers resolve"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/assets/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git assets

> **SUPERSEDED — VERIFY-ONLY (v4 reconciliation, 2026-07-15).** Concurrent v4 work already committed this rename (on `skilled/v4.0.0.0`). The steps below are now the VERIFICATION procedure for the completed kebab state — not rename execution. Do NOT re-run or reverse any rename; adopt v4's kebab names as the baseline. See the packet's v4-reconciliation-inventory.md.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-git assets, templates, and their path consumers |
| **Change class** | Filesystem rename plus path-pointer rewrite |
| **Execution** | Dependency-closed, path-scoped batch on the pinned migration worktree |

### Overview
The executor will apply the three-entry semantic map for the asset files, then update asset and reference pointers in SKILL.md, README.md, and the asset content that links into references/. Content parity is part of the phase contract so a path rename cannot silently alter a template's frontmatter, examples, keys, or behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and the three-entry asset map hash are recorded.
- [ ] Source, target, metadata, and consumer inventories are complete.
- [ ] Phase 001 reference targets are known before the worktree checklist links are rewritten.

### Definition of Done
- [ ] Each applicable asset source is renamed once or recorded as already compliant.
- [ ] All active asset and reference pointers resolve through kebab-case paths.
- [ ] Asset content and the exemption boundary pass parity review.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Semantic asset map**: maps commit_message_template.md, pr_template.md, and worktree_checklist.md to their hyphenated targets.
- **Consumer inventory**: covers SKILL.md, README.md, assets/*, references/*, and tracked path-valued consumers.
- **Content parity check**: compares frontmatter fields, data keys, examples, headings, modes, symlink targets, and bytes outside approved path values.
- **Dependency-closed batch**: keeps asset renames and pointer rewrites together, with no source/target duplicate state.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE and the asset-map hash.
- Inventory the three source paths, targets, modes, symlinks, and all active pointers.
- Run collision and exemption checks before any rename.

### Phase 2: Implementation
- Rename applicable files under assets/ to kebab-case.
- Rewrite SKILL.md, README.md, assets/*, and references/* path pointers.
- Compare asset content before and after; preserve all non-path content and metadata.
- Record explicit no-op dispositions for targets already present.

### Phase 3: Verification
- Resolve every active asset and reference link.
- Confirm content parity and path-scoped diff.
- Record the source-map, pointer, parity, and exemption results in the SOL report.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the candidate inventory with the three-entry map and map hash; every entry has one disposition. |
| REQ-002 | Run the rename-map reference checker over SKILL.md, README.md, assets/*, and references/*; require zero broken targets and zero source pointers. |
| REQ-003 | Compare bytes, headings, frontmatter fields, data keys, examples, mode bits, and symlink targets before and after. |
| REQ-004 | Inspect the diff for asset-only scope and assert sibling surfaces are unchanged. |
| REQ-005 | Run the exemption-aware naming check and review tool-mandated names and non-path content. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 frozen map and BASE | Internal | Required | No safe classification or parity baseline. |
| Phase 001 reference targets | Sibling | Required | Worktree-checklist.md cannot be fully repaired. |
| Phase 005 reference checker | Internal | Required | Pointer closure lacks a consistent evidence source. |
| sk-git worktree workflow | Internal | Required | Shared-tree execution invalidates rename evidence. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Collision, content-parity drift, unresolved pointer, or out-of-scope file appears.
- **Procedure**: Stop before commit; restore the asset-only batch from the pinned worktree, or revert the phase commit. Rebuild the source/target and content-parity inventories before retrying.
<!-- /ANCHOR:rollback -->
