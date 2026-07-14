---
title: "Implementation Plan: system-skill-advisor references"
description: "Apply a 15-file reference rename map, repair all live path links and command examples, and verify navigation and reference validation without altering runtime identifiers or document contracts."
trigger_phrases:
  - "system-skill-advisor references implementation plan"
  - "reference link closure plan"
  - "advisor documentation path migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the references implementation plan"
    next_safe_action: "Freeze the 15-file reference map and path-consumer manifest"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/INSTALL_GUIDE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All reference directories are already compliant; only 15 Markdown filenames require mapping."
      - "Cross-phase catalog/playbook links are path consumers and do not authorize content redesign."
---

# Implementation Plan: system-skill-advisor references

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, shell/Node command examples, YAML/JSON path values |
| **Framework** | sk-doc reference and link conventions |
| **Storage** | Version-controlled reference files |
| **Testing** | Link/path scan, reference validation, command target checks |

### Overview
Build one explicit source-to-target map for the 15 reference files, then update path contexts across the advisor
surface and known external consumers. Preserve words that are identifiers, keys, tool IDs, or historical prose; only
filesystem path segments and path-derived values move.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 15-file list and collision report are pinned.
- [ ] Every live path hit is classified as link, command, frontmatter path, generated metadata, identifier, or history.
- [ ] Catalog/playbook sibling target maps are available for cross-links.

### Definition of Done
- [ ] All 15 files have kebab-case targets and no reference directory was renamed.
- [ ] Links, indexes, command paths, and path-valued metadata resolve.
- [ ] Reference content and identifiers retain BASE semantics.
- [ ] No stale live old-name path remains.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Path-only documentation rename with cross-surface link closure.

### Key Components
- Reference groups: config, decisions, graph, hooks, runtime, and scoring.
- Navigation consumers: SKILL, README, INSTALL_GUIDE, catalog, playbook, and command assets.
- Non-path tokens: tool IDs, frontmatter keys, classification tags, and historical mentions.

### Data Flow
Operators enter through top-level skill docs or command examples, follow a relative reference link, and then use
commands or cross-links from that reference. The map changes the target path at every hop without changing the
referenced contract or runtime value.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate the 15 reference files and calculate their target paths.
- [ ] Scan the repository for each old path and classify all hits.
- [ ] Record link and reference counts before the rename.

### Phase 2: Implementation
- [ ] Rename the 15 Markdown files by dependency-closed directory group.
- [ ] Update internal links, top-level indexes, command paths, path-valued frontmatter, and cross-surface references.
- [ ] Leave reference directories, code identifiers, tool IDs, keys, and frozen history unchanged.

### Phase 3: Verification
- [ ] Resolve every Markdown link and executable path example to an existing target.
- [ ] Run reference/document validation and compare link counts to BASE.
- [ ] Scan old names and classify only intentional non-path mentions.
- [ ] Record the handoff to the hook/catalog/playbook consumers.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | 15 source/target paths and collisions | rg, filesystem manifest |
| Link | Relative Markdown and index links | link checker or repository path resolver |
| Command | Shell/Node/Python example targets | path existence and smoke commands |
| Content | Identifier and frontmatter preservation | targeted diff and parser checks |
| Boundary | Historical/non-path hits | old-name disposition ledger |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Catalog/playbook target maps | Internal | Required | Cross-links cannot be proven |
| Root-name consumer contract | Internal | Required | Catalog/playbook classifier paths may reject targets |
| Frozen-history policy | Internal | Required | Old-name hit classification becomes ambiguous |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken link, command target, parser output, or identifier drift.
- **Procedure**: Restore the 15-file map and path-only edits in the isolated worktree, retain the disposition ledger,
  and narrow the consumer set before retrying. Do not rewrite frozen history to hide a failed link scan.
<!-- /ANCHOR:rollback -->
