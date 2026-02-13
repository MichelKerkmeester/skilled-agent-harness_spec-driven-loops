<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Memory Command README Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-12 |
| **Branch** | `112-memory-command-readme-alignment` |
| **Parent Spec** | 003-system-spec-kit/111-readme-anchor-schema |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

Spec 111 implemented README indexing features in the Spec Kit Memory MCP server, including: `includeReadmes` parameter, 4-source indexing pipeline, `findProjectReadmes()`/`findSkillReadmes()` discovery functions, `README_EXCLUDE_PATTERNS`, tiered importance weights (0.3/0.4/0.5), YAML frontmatter extraction, title-based trigger generation, and anchor prefix matching. However, the command documentation files (`.md`) and YAML workflow assets that users and AI agents rely on to understand and use these features have NOT been updated to reflect this new functionality. This creates a documentation gap where implemented capabilities are invisible to command consumers.

### Purpose

Align all memory-related command documentation and YAML workflow assets with the features implemented in spec 111, ensuring that `includeReadmes`, 4-source pipeline, tiered weights, prefix matching, and README discovery are accurately documented where users interact with these capabilities.

---

## 3. SCOPE

### In Scope

- Update `manage.md` command documentation with `includeReadmes` parameter, README scan workflow, and tiered weight documentation
- Update `save.md` command documentation with `includeReadmes` in parameter table, 4-source pipeline description, and prefix matching in anchor section
- Update `CONTEXT.md` with prefix matching documentation and README context mention
- Update `spec_kit_implement_auto.yaml` and `spec_kit_implement_confirm.yaml` anchor patterns with prefix matching notes
- Update `create_folder_readme.yaml` with auto-indexing weight note
- Update remaining create YAML files with anchor prefix matching mentions
- Verify all modified files for consistency and cross-reference accuracy

### Out of Scope

- Changes to MCP server code (covered by spec 111)
- Changes to the memory system itself (indexing, search, parsing)
- New command creation
- Restructuring existing command documentation format

### Files to Change

| File Path | Change Type | Priority |
|-----------|-------------|----------|
| `.opencode/command/memory/manage.md` | Modify | P0 |
| `.opencode/command/memory/save.md` | Modify | P1 |
| `.opencode/command/memory/CONTEXT.md` | Modify | P2 |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modify | P2 |
| `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Modify | P2 |
| `.opencode/command/create/assets/create_folder_readme.yaml` | Modify | P3 |
| `.opencode/command/create/assets/create_folder_skill.yaml` | Modify | P3 |
| `.opencode/command/create/assets/create_folder_agent.yaml` | Modify | P3 |
| `.opencode/command/create/assets/create_folder_command.yaml` | Modify | P3 |
| `.opencode/command/create/assets/create_folder_spec.yaml` | Modify | P3 |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `manage.md` documents the `includeReadmes` parameter with type, default, and usage | Parameter appears in command parameter table with `boolean`, `true` default, and description of README scan behavior |
| REQ-002 | `manage.md` documents the README scan workflow within the index scan section | Section describes 4-source discovery pipeline: specFiles, constitutionalFiles, skillReadmes, projectReadmes |
| REQ-003 | `manage.md` documents tiered importance weights | Weight table shows: User work 0.5, Project READMEs 0.4, Skill READMEs 0.3 with scoring formula |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `save.md` parameter table includes `includeReadmes` | Parameter listed with type, default, and description consistent with manage.md |
| REQ-005 | `save.md` documents 4-source indexing pipeline | Pipeline description matches manage.md, references `findProjectReadmes()` and `findSkillReadmes()` |
| REQ-006 | `save.md` anchor section documents prefix matching | Explanation that `anchors: ['summary']` matches `summary-049` via prefix fallback with shortest-match selection |

### P2 - Optional (can defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `CONTEXT.md` mentions README context discovery | Section noting that README files are now part of the memory context pipeline |
| REQ-008 | `CONTEXT.md` documents anchor prefix matching | Brief note on prefix matching behavior for anchor retrieval |
| REQ-009 | `spec_kit_implement_auto.yaml` anchor pattern includes prefix matching note | Anchor pattern documentation updated with prefix matching behavior |
| REQ-010 | `spec_kit_implement_confirm.yaml` anchor pattern includes prefix matching note | Same as REQ-009 for the confirm variant |

### P3 - Low Priority (defer without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | `create_folder_readme.yaml` notes auto-indexing at 0.3 weight | YAML includes note that created README files are auto-indexed with importance_weight 0.3 |
| REQ-012 | Remaining create YAMLs mention anchor prefix matching | Brief note in anchor-related sections about prefix matching behavior |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `manage.md` accurately documents all 3 new features (`includeReadmes`, 4-source pipeline, tiered weights)
- **SC-002**: `save.md` parameter table is consistent with `manage.md` and includes `includeReadmes`
- **SC-003**: Anchor prefix matching is documented in at least `save.md` and `CONTEXT.md`
- **SC-004**: All modified YAML files parse correctly (no syntax errors)
- **SC-005**: No information contradicts the actual implementation in spec 111
- **SC-006**: Cross-references between files are consistent (e.g., weight values match across all documents)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 111 implementation accuracy | Documentation must match actual code behavior | Cross-reference against spec 111 implementation-summary.md |
| Risk | Documentation drift | Future code changes may invalidate these docs | Note spec 111 version in docs for traceability |
| Risk | YAML syntax errors | Broken workflow assets | Validate YAML parsing after each edit |
| Dependency | Existing command format conventions | Must follow established documentation patterns | Read each file before editing to match style |

---

## 7. EDGE CASES

### Content Boundaries

- Files that already partially document README features: merge, don't duplicate
- YAML files with strict indentation: preserve exact formatting
- Files with existing anchor documentation: extend, don't replace

### Error Scenarios

- If a target file has been significantly restructured since analysis: re-analyze before editing
- If weight values in spec 111 change: update all 3 documents (manage.md, save.md, CONTEXT.md) atomically

---

## RELATED DOCUMENTS

- **Parent Spec**: `003-system-spec-kit/111-readme-anchor-schema/` (implementation details)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

---

## CHANGE LOG

### v1.0 (2026-02-12)
**Initial specification**
- Defined scope: 8 features needing alignment across 10 files
- Prioritized files: P0 (manage.md), P1 (save.md), P2 (CONTEXT.md + YAMLs), P3 (create YAMLs)
- Established requirements REQ-001 through REQ-012
- Linked to parent spec 111 for implementation reference

---

<!--
LEVEL 2 SPEC
- Core + L2 verify addendum
- Metadata, problem, scope, requirements, success criteria
- Risk/dependency matrix, edge cases
-->
