---
title: "Feature Specification: sk-git assets (017 phase 008/012/002)"
description: "The sk-git asset surface has three historical underscore-to-hyphen file renames and lingering asset pointers. This phase closes the asset/template rename and all links to the resulting kebab-case files without touching tool-mandated names or asset content contracts."
trigger_phrases:
  - "sk-git assets kebab-case"
  - "017 sk-git asset rename"
  - "asset template pointer closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the assets phase from the sk-git path history and live pointer inventory"
    next_safe_action: "Execute the asset rename map and pointer closure on the pinned worktree"
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
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-git assets

> Phase adjacency under the sk-git component parent: predecessor 001-references; successor 003-manual-testing-playbook. The siblings are independently scoped; the adjacency is an execution ordering hint for the component rollup.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/002-assets |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Origin** | Phase 002 of the sk-git component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The asset history contains three snake_case filenames: commit_message_template.md, pr_template.md, and worktree_checklist.md. The live checkout already contains their hyphenated targets from a prior pre-adoption change, while SKILL.md and worktree-checklist.md still expose historical underscore pointers into references/ and assets/. The execution phase must reconcile the asset map and consumer graph without changing the content contract of the templates.

The purpose is to leave every in-scope sk-git asset addressable through kebab-case filenames and every active asset pointer resolved, while preserving tool-mandated names, data keys, frontmatter fields, and the semantics of the templates.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the source-to-target map: commit_message_template.md -> commit-message-template.md; pr_template.md -> pr-template.md; worktree_checklist.md -> worktree-checklist.md.
- Update asset pointers in SKILL.md, README.md, the assets themselves, and tracked sk-git consumers that address these files.
- Repair links from worktree-checklist.md to the hyphenated reference paths owned by phase 001.
- Preserve asset content, frontmatter fields and values except path-valued references, and any file mode or symlink metadata.
- Record a no-op disposition when a target already exists at the pinned baseline.

### Out of Scope
- Renaming reference files, manual-playbook paths, benchmark profiles or artifacts, or changelog files.
- Renaming package.json, SKILL.md, .utcp_config.json, action.yml/action.yaml, or other tool-mandated names.
- Changing code identifiers, JSON/YAML/TOML keys, frontmatter field names, template semantics, or non-path examples.
- Executing this phase during documentation authoring.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-git/assets/* | Rename/Modify | Apply the three-entry asset map and repair internal links. |
| .opencode/skills/sk-git/SKILL.md | Modify | Replace asset path pointers and resource table entries. |
| .opencode/skills/sk-git/README.md | Modify | Replace asset path pointers and verification references. |
| .opencode/skills/sk-git/assets/worktree-checklist.md | Modify | Repair references/ links and keep checklist semantics unchanged. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every observed asset source name has exactly one target or explicit baseline no-op disposition. | The phase map and candidate report enumerate all three source names with no unknown or duplicate target. |
| REQ-002 | Active asset consumers use kebab-case paths. | The rename/reference checker finds zero active pointers to assets/commit_message_template.md, assets/pr_template.md, or assets/worktree_checklist.md; every target resolves. |
| REQ-003 | Asset content contracts remain unchanged apart from path-valued references. | Template structure, frontmatter fields, keys, examples, modes, and symlink targets are parity-checked before and after. |
| REQ-004 | The phase stays inside the asset boundary. | The diff contains no reference, manual-playbook, benchmark, changelog, code, or sibling-surface rename. |
| REQ-005 | The 017 exemptions are honored. | Tool-mandated names, Python names, keys, fields, and frozen content are absent from the rename map. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three asset entries are renamed to kebab-case or evidenced as already compliant at BASE.
- **SC-002**: SKILL.md, README.md, asset links, and reference links resolve without source-path pointers.
- **SC-003**: Asset semantics and all non-path content remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase depends on the frozen 017 map and on phase 001's reference targets because worktree-checklist.md links into references/. The main risks are stale asset names in the router tables, accidental edits to template content, and a false collision when a target was pre-adopted. The checklist requires source-map, content-parity, and pointer-closure evidence.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. A target that already exists at BASE is handled as an explicit no-op disposition rather than an untracked omission.
<!-- /ANCHOR:questions -->
