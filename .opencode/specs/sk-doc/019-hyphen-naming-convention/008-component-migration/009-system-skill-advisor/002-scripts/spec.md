---
title: "Feature Specification: system-skill-advisor scripts"
description: "Rename non-Python snake_case script filenames in the system-skill-advisor surface to kebab-case and update every dataset, registry, source, and documentation reference without touching Python script names or import identifiers."
trigger_phrases:
  - "system-skill-advisor scripts naming"
  - "skill advisor regression fixture rename"
  - "kebab-case non-Python scripts"
  - "advisor script reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the scripts migration contract from the real advisor inventory"
    next_safe_action: "Execute the non-Python script filename rename on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/build-holdout.mjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current non-Python filename candidate is fixtures/skill_advisor_regression_cases.jsonl."
      - "skill_advisor.py, skill_advisor_bench.py, skill_advisor_regression.py, skill_advisor_runtime.py, and skill_graph_compiler.py remain Python exemptions."
      - "Underscores in Python imports, tool IDs, JSONL fields, and code identifiers are not filesystem rename targets."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor scripts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scripts tree is mostly already compliant, but its regression dataset is named
skill_advisor_regression_cases.jsonl. That file is loaded by TypeScript validation, routing-accuracy tooling,
holdout provenance, manual scenarios, reference docs, and generated graph metadata. The adjacent Python scripts use
PEP-8 snake_case deliberately and must not be renamed.

### Purpose
Rename each in-scope non-Python script filename to kebab-case and update its complete reference closure while
preserving Python filenames, Python imports, data keys, and tool identifiers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl to
  skill-advisor-regression-cases.jsonl.
- Update direct loaders and provenance references in handlers/advisor-validate.ts,
  scripts/routing-accuracy/build-holdout.mjs, routing fixtures, manual playbooks, references, and install docs.
- Scan shell sourcing, registry entries, test fixtures, and path-valued metadata for additional non-Python candidates.
- Re-run the script inventory after the rename so a newly discovered candidate cannot be silently omitted.

### Out of Scope
- skill_advisor.py, skill_advisor_bench.py, skill_advisor_regression.py, skill_advisor_runtime.py, and
  skill_graph_compiler.py, including their Python imports and module names.
- JSONL field names, prompt/tool identifiers, Python package directories, generated graph metadata, and unrelated
  script trees outside system-skill-advisor.
- The mcp-server root, reference filenames, feature catalog, and manual-playbook names owned by sibling phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl | Rename | Dataset filename to kebab-case |
| .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts | Modify | Update the dataset path |
| .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/build-holdout.mjs | Modify | Update fixture resolution and provenance |
| .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/holdout-prompts.jsonl | Modify | Update path-valued origin references |
| .opencode/skills/system-skill-advisor/{INSTALL_GUIDE,README}.md | Modify | Update operator commands and script paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All non-Python script filename candidates are classified | The full scripts inventory has no unclassified filename; the regression dataset maps to one kebab-case target. |
| REQ-002 | The regression dataset is renamed | skill-advisor-regression-cases.jsonl exists and the old filename is absent from the live tree. |
| REQ-003 | Every dataset reference is updated | Loader, holdout, registry/provenance, test, manual-playbook, reference, and install-doc path scans resolve the new name. |
| REQ-004 | Python exemptions are preserved | The five named Python scripts and all imports/module references remain byte-for-byte filename-compatible. |
| REQ-005 | Dataset behavior is unchanged | Regression, holdout-generation, and validation commands consume the same records and produce BASE-equivalent counts. |
| REQ-006 | No identifiers are renamed | JSONL keys, tool IDs, Python symbols, and frontmatter fields retain their existing spelling. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The only current non-Python snake_case script filename is replaced with its kebab-case target.
- **SC-002**: All source, registry, fixture, and documentation references resolve without changing dataset semantics.
- **SC-003**: Python compatibility and routing-accuracy evidence remains at BASE parity.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 package-root result | A root rename changes the absolute path prefix used by script consumers | Apply the phase's path map as a prefix-aware input and verify the combined closure. |
| Risk | A path string is confused with a Python module name | Import resolution can fail even though filesystem checks pass | Separate filename/path scans from identifier/import scans and assert Python exemptions explicitly. |
| Risk | Generated graph metadata is edited by hand | Later indexing can overwrite the apparent fix | Update source consumers and regenerate metadata only through the central workflow. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must use the pinned inventory to confirm whether any additional non-Python script filename
appeared after this authoring pass; the five named Python files remain exempt regardless.
<!-- /ANCHOR:questions -->
