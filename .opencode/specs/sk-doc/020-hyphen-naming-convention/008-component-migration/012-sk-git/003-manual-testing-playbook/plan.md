---
title: "Implementation Plan: sk-git manual testing playbook (020 phase 008/012/003)"
description: "Implementation plan for the sk-git manual-playbook tree rename. The executor will move the root index, seven category directories, and 41 scenarios through one semantic map, then prove link and scenario-discovery parity."
trigger_phrases:
  - "sk-git manual playbook implementation plan"
  - "020 manual scenario rename plan"
  - "playbook path closure plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the manual-playbook execution plan and discovery-parity evidence path"
    next_safe_action: "Verify the manual-playbook tree is already kebab on v4 and re-count against its actual entries"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/manual-testing-playbook/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git manual testing playbook

> **SUPERSEDED — VERIFY-ONLY (v4 reconciliation, 2026-07-15).** Concurrent v4 work already committed this rename (on `skilled/v4.0.0.0`). The steps below are now the VERIFICATION procedure for the completed kebab state — not rename execution. Do NOT re-run or reverse any rename; adopt v4's kebab names as the baseline. Re-count the 49-entry map against v4's actual tree (42 files / 8 dirs). See the packet's v4-reconciliation-inventory.md.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-git manual-testing-playbook root, categories, and scenarios |
| **Change class** | Directory/file rename plus path-pointer rewrite |
| **Execution** | One dependency-closed, path-scoped batch on the pinned migration worktree |

### Overview
The executor will apply a 49-entry map: one root index, seven category directories, and 41 scenario files. It will update the root index and all consumers in the same batch, then compare the scenario ID set, category membership, metadata, links, and content so the filesystem rename cannot reduce discoverability.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and the 49-entry playbook-map hash are recorded.
- [ ] The category and scenario inventory contains the root index, seven category directories, and 41 scenario files.
- [ ] Every scenario has a stable GIT ID and a recorded source-to-target path.

### Definition of Done
- [ ] All applicable directory/file entries are renamed once or recorded as already compliant.
- [ ] The root index and every in-tree pointer resolve through kebab-case paths.
- [ ] The GIT-001 through GIT-041 set and category membership are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Root index closure**: treats manual_testing_playbook.md as a path-bearing index, not a free-form content rename.
- **Category closure**: renames each category directory with all nested scenarios as one dependency-closed unit.
- **Scenario map**: maps each underscore scenario basename to one hyphenated basename while preserving its GIT ID and contract.
- **Discovery parity**: compares the pre- and post-change scenario ID set, category counts, link targets, and package-artifact entries.
- **Exemption filter**: excludes code identifiers, keys, fields, Python/tool-mandated names, and other 020 exclusions.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE and the 49-entry map hash.
- Inventory root index, seven category directories, 41 scenarios, all links, all scenario IDs, and metadata.
- Abort on collisions, duplicate targets, missing scenario IDs, or an unknown path.

### Phase 2: Implementation
- Rename the root index and category directories through the semantic map.
- Rename all nested scenario files in the same category-closed batch.
- Rewrite the root index's 41-row table, category links, package-artifact list, SKILL.md/README.md pointers, and in-tree path references.
- Preserve scenario IDs, frontmatter, commands, keys, content, modes, and symlinks; record no-op dispositions for pre-existing targets.

### Phase 3: Verification
- Resolve every playbook link and assert the 41 scenario IDs are present exactly once.
- Compare category membership and content/metadata parity.
- Inspect git rename status and the path-scoped diff; record all counts and exit codes in the SOL report.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the candidate inventory with the 49-entry map and map hash; every entry has one disposition. |
| REQ-002 | Run the rename-map checker over the root index, scenarios, SKILL.md, README.md, and package-artifact pointers; require zero broken links and zero source paths. |
| REQ-003 | Extract GIT-001 through GIT-041 before and after; compare the set, count, category, and index multiplicity. |
| REQ-004 | Compare scenario bytes/fields, frontmatter, commands, keys, modes, and symlinks outside approved path values. |
| REQ-005 | Run the exemption-aware naming check and inspect the diff for sibling or exempt surface changes. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 020 frozen map and BASE | Internal | Required | No safe path classification or parity baseline. |
| Phase 005 reference checker | Internal | Required | Link closure cannot be evidenced consistently. |
| sk-git manual playbook validator | Internal | Required | Scenario structure and ID parity lack the canonical check. |
| Phase 002 asset targets | Sibling | Sequenced | Cross-links from the worktree checklist must point at the asset phase's target state. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A missing scenario, duplicate GIT ID, broken index link, category drift, content-parity failure, or out-of-scope path appears.
- **Procedure**: Stop before commit; restore the manual-playbook-only batch from the pinned worktree, or revert the phase commit. Recreate the 49-entry map and discovery comparison before retrying.
<!-- /ANCHOR:rollback -->
