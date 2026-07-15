---
title: "Implementation Plan: Manual testing playbook (017 subtree 008 phase 009)"
description: "The system-spec-kit manual_testing_playbook tree contains 440 underscore-bearing basenames: the root, 18 category directories, and 421 scenario or support files. This phase renames permitted playbook paths to kebab-case and closes every playbook link, index, runner, and path pointer while preserving scenario identity and the program exemption boundary."
trigger_phrases:
  - "system-spec-kit manual testing playbook"
  - "manual_testing_playbook to manual-testing-playbook"
  - "playbook scenario kebab-case"
  - "manual testing phase 009"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/009-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned manual-playbook execution"
    next_safe_action: "Execute the manual-playbook path map after catalog evidence is available"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (Manual testing playbook) |
| **Change class** | Scenario/category tree rename and reference closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Freeze the 440-entry inventory, build a reviewed semantic map, move the root/category/scenario tree in dependency-closed batches, and update playbook navigation and runner references with each batch. Preserve scenario identity and all non-filesystem contracts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 008 catalog handoff and the playbook baseline are available.
- [ ] The ledger reports 440 candidates: root, 18 directories, and 421 files.
- [ ] Active indexes, runners, cross-tree handoffs, and exemption boundaries are listed.

### Definition of Done
- [ ] Every candidate has a reviewed target or explicit exemption disposition.
- [ ] The root, categories, scenarios, indexes, links, and runners resolve under the target names.
- [ ] Scenario/category parity and procedure-content invariants match the baseline.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use explicit semantic mappings for category and scenario names; do not apply a blind underscore-to-hyphen replacement.
- Batch by path dependency so a moved scenario, index row, link, and runner glob remain coherent.
- Compare scenario identity, category assignment, and path resolution before and after the move.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Enumerate the root, 18 candidate category directories, 421 candidate files, compliant names, and exempt paths.
- Search active playbook consumers for root/category/scenario paths, runner globs, catalog handoffs, and README links.

### Phase 2: Implementation
- Freeze and review the full semantic map with exact, casefold, and Unicode-normalization collision checks.
- Rename the root, categories, and files in dependency-closed batches; update indexes, links, runners, and path values beside each batch.
- Keep scenario IDs, headings, procedure prose, frontmatter fields, and code/data identifiers unchanged.

### Phase 3: Verification
- Resolve every active playbook link, index entry, runner glob, and catalog handoff.
- Compare scenario/category counts, IDs, headings, and content hashes with the baseline.
- Classify all old-path matches as active, frozen, generated, exempt, or unresolved; unresolved matches block acceptance.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory and map report account for root, 18 directories, and 421 files. |
| REQ-002 | Map review proves permitted targets are kebab-case and collision-free. |
| REQ-003 | Link, index, runner, README, and catalog-handoff resolution checks pass. |
| REQ-004 | Scenario ID, heading, procedure, frontmatter, and identifier diff audit passes. |
| REQ-005 | Pre/post category and scenario parity report matches. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 feature catalog | Internal | Required | Catalog-to-playbook pointers cannot be closed confidently. |
| Playbook inventory and map | Internal | Required | A partial move cannot prove coverage preservation. |
| Phase 010 verification | Internal | Downstream | Config/checkpoint/vector/agent boundary evidence remains separate. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Stop on any scenario/category count mismatch, collision, missing link, or changed procedure invariant. Revert the current dependency-closed batch together with its indexes and path references; do not repair the playbook with broad text replacement.
<!-- /ANCHOR:rollback -->

