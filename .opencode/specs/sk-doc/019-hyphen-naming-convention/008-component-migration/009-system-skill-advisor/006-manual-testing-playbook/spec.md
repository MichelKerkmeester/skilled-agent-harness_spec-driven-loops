---
title: "Feature Specification: system-skill-advisor manual testing playbook"
description: "Rename the manual_testing_playbook root, nine category directories, and 48 scenario/index files to kebab-case, update every catalog and documentation link, and preserve scenario IDs and operator contracts."
trigger_phrases:
  - "system-skill-advisor manual testing playbook"
  - "manual-testing-playbook tree migration"
  - "manual_testing_playbook to manual-testing-playbook"
  - "advisor scenario file rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the manual-playbook tree migration contract"
    next_safe_action: "Execute the playbook root, category, and scenario rename on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/system-skill-advisor/feature_catalog"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The playbook contains 48 files, including manual_testing_playbook/manual_testing_playbook.md, under nine snake_case category directories."
      - "Scenario IDs, frontmatter fields, JSON keys, and test semantics are preserved."
      - "Only filesystem path names and the links/pointers that resolve them change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor manual testing playbook

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor manual-testing tree uses the snake_case root manual_testing_playbook, nine snake_case category
directories, and 48 Markdown scenario/index files. Feature-catalog links, the top-level skill docs, test discovery,
and operator commands resolve those exact paths. Renaming without preserving scenario IDs and contract content would
make manual coverage appear present while pointing at different or missing scenarios.

### Purpose
Convert the complete manual-testing-playbook filesystem tree to kebab-case, repair all path references, and prove
that scenario identity, coverage, and operator behavior remain unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename manual_testing_playbook/ to manual-testing-playbook/ and the root index to
  manual-testing-playbook.md.
- Rename the nine category directories: auto_indexing, auto_update_daemon, cli_hooks_and_plugin,
  compat_and_disable, lifecycle_routing, native_mcp_tools, operator_h5, python_compat, and scorer_fusion.
- Rename all 48 Markdown scenario/index files to kebab-case.
- Update feature-catalog links, top-level docs, references, test fixtures, and manual command examples that point to
  those paths.

### Out of Scope
- Scenario IDs, frontmatter fields, template tokens, JSON/YAML/TOML keys, code identifiers, Python filenames,
  Python package directories, generated metadata, and scenario prose except for literal path pointers.
- Feature-catalog filesystem names, which are handled by phase 005; only direct catalog/playbook links are repaired
  here.
- Adding scenarios, changing operator coverage, or redesigning the manual-testing contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/manual_testing_playbook/ | Rename | Root to manual-testing-playbook/ |
| .opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md | Rename | Index to manual-testing-playbook.md |
| .opencode/skills/system-skill-advisor/manual_testing_playbook/{auto_indexing,auto_update_daemon,cli_hooks_and_plugin,compat_and_disable,lifecycle_routing,native_mcp_tools,operator_h5,python_compat,scorer_fusion}/ | Rename | Nine category directories to kebab-case |
| .opencode/skills/system-skill-advisor/manual_testing_playbook/**/*.md | Rename | All in-scope scenario files to kebab-case |
| .opencode/skills/system-skill-advisor/{SKILL,README,INSTALL_GUIDE}.md | Modify | Repair playbook paths and operator links |
| .opencode/skills/system-skill-advisor/feature_catalog/**/*.md | Modify | Repair catalog-to-playbook links |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook inventory is complete | The 48-file tree, root index, and nine category directories each have exactly one kebab-case target in the frozen map. |
| REQ-002 | The playbook tree is canonical | manual-testing-playbook/ and all permitted descendants use kebab-case; no old live root or scenario path remains. |
| REQ-003 | All playbook links are repaired | Catalog links, top-level docs, test fixtures, operator commands, and path-valued examples resolve to the new paths. |
| REQ-004 | Scenario identity is preserved | Scenario IDs, titles, frontmatter fields, steps, expected results, and coverage counts match BASE after path normalization. |
| REQ-005 | Python and tool exemptions are preserved | Python compatibility scenario references remain valid, but no .py filename or Python import directory is renamed. |
| REQ-006 | Manual verification remains executable | The manual-playbook validator/test and representative scenarios complete with BASE-equivalent discovery counts. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 48 playbook files and nine category directories are present under the kebab-case root.
- **SC-002**: Catalog, docs, tests, and operator commands resolve the same scenarios by their original IDs.
- **SC-003**: No scenario content or coverage is lost during the filesystem-only rename.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature-catalog phase | Two sibling tree maps affect each other's relative links | Use both frozen maps and run an integrated link scan at the subtree gate. |
| Risk | Scenario files are renamed but index links are not | Operators receive missing-file failures | Scan every Markdown link and execute representative scenario discovery. |
| Risk | Scenario IDs are treated as path names | Manual coverage or test matching changes | Compare IDs and parsed scenario counts before and after path normalization. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record any intentional old-name mention that is explanatory text rather than a live
path so the final gate does not mistake it for a stale scenario reference.
<!-- /ANCHOR:questions -->
