---
title: "Feature Specification: system-code-graph scripts"
description: "Inventory non-Python script filenames in the system-code-graph surface, rename any remaining snake_case candidate to kebab-case, and update every source, registry, fixture, and documentation reference without touching Python script names or import identifiers."
trigger_phrases:
  - "system-code-graph scripts naming"
  - "code graph script filename audit"
  - "kebab-case non-Python scripts"
  - "code graph script reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts migration contract"
    next_safe_action: "Confirm script filename census on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/scripts/doctor.sh"
      - ".opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current script inventory contains doctor.sh and score-seeded-ppr-retrieval.mjs; both filenames are already kebab-case."
      - "No non-Python snake_case script filename is present in the inspected system-code-graph tree."
      - "Python filenames, Python import directories, script identifiers, tool IDs, and data keys remain exempt."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-code-graph scripts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the system-code-graph component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-code-graph surface has two actual script files: scripts/doctor.sh and
mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs. Both are already kebab-case, but the phase still needs a
pinned filename census and reference scan so a later script addition cannot reintroduce snake_case unnoticed. Any
conditional rename must remain separate from Python, tool, identifier, and data-key spelling.

### Purpose
Prove that every non-Python script filename is classified, conditionally rename any newly discovered snake_case
candidate, and close its complete path-reference closure without fabricating a rename when the census is clean.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory .opencode/skills/system-code-graph/scripts/ and mcp_server/scripts/ for non-Python script filenames.
- Preserve the current kebab-case names doctor.sh and score-seeded-ppr-retrieval.mjs; if the pinned BASE exposes
  another non-Python snake_case script filename, map it to one kebab-case target and rename it.
- Update source loaders, shell sourcing, registry entries, fixtures, tests, path-valued metadata, and documentation
  references for any conditional target.
- Re-run the full script inventory and retain zero-candidate evidence when no rename is required.

### Out of Scope
- Python .py filenames, Python import-package directories, Python imports, code identifiers, tool IDs, JSON/YAML/TOML
  keys, frontmatter fields, generated metadata, and unrelated script trees.
- The mcp-server root and direct package-layout names, reference files, runtime names, feature catalog, and manual
  playbook paths owned by sibling phases.
- A synthetic rename or broad underscore substitution when the actual script census is already clean.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/scripts/doctor.sh | Verify/Conditional rename | Current script filename is already kebab-case |
| .opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs | Verify/Conditional rename | Current evaluation script filename is already kebab-case |
| .opencode/skills/system-code-graph/{SKILL,README,INSTALL_GUIDE}.md | Modify if needed | Repair any script path references |
| .opencode/skills/system-code-graph/mcp_server/tests/ and runtime consumers | Modify if needed | Repair any source, fixture, or registry path references |
| 002-scripts/checklist.md | Evidence | Record the inventory and zero-candidate or conditional-rename result |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script inventory is complete | Every file under scripts/ and mcp_server/scripts/ is classified by filename form and exemption status. |
| REQ-002 | Non-Python candidates are canonical | The current two scripts remain kebab-case; any additional in-scope snake_case filename has one approved kebab target and no old live name. |
| REQ-003 | Every script reference is updated | Shell sourcing, imports/requires, registries, fixtures, tests, metadata, and documentation resolve the target path. |
| REQ-004 | Exemptions are preserved | Python filenames/package directories, identifiers, tool IDs, data keys, frontmatter fields, and generated metadata retain their existing spelling. |
| REQ-005 | Script behavior is unchanged | Script syntax, exit behavior, evaluation inputs, and discovery counts match BASE; a proven no-rename result is accepted. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No non-Python snake_case script filename remains unclassified in the system-code-graph surface.
- **SC-002**: Any conditional rename has zero stale live references and preserves script behavior.
- **SC-003**: A zero-candidate result is documented with the complete inventory rather than hidden behind a fabricated diff.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 package-root result | A root rename changes the path prefix used by mcp_server/scripts consumers | Apply the package-root map as a prefix-aware input and verify the combined closure. |
| Risk | A path string is confused with an identifier | Tool dispatch or script behavior can change even when filesystem checks pass | Separate filename/path scans from identifier/import scans and assert preserved tokens. |
| Risk | A clean census is treated as no evidence needed | A later script candidate can survive into the subtree gate | Require a complete inventory, old-name scan, and zero-candidate receipt. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The current tree predicts a no-rename result; execution must confirm that prediction against the
pinned BASE and retain evidence for every script path consumer.
<!-- /ANCHOR:questions -->

