---
title: "Feature Specification: System Code Graph Reference Template Alignment"
description: "Align system-code-graph references to sk-doc reference-template rules, canonicalize them into focused snake_case folders, preserve old-path stubs, and refresh router/navigation docs."
trigger_phrases:
  - "system-code-graph references"
  - "reference template alignment"
  - "code graph router"
  - "sk-doc reference template"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/007-docs-and-readmes/006-reference-template-alignment"
    last_updated_at: "2026-05-24T08:04:41Z"
    last_updated_by: "codex"
    recent_action: "Implemented system-code-graph reference split and smart-router alignment"
    next_safe_action: "Re-run sk-doc and strict spec validation if any docs change again"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
      - ".opencode/skills/system-code-graph/references/"
    session_dedup:
      fingerprint: "sha256:2dc9a03fcc75ddef164033350424db778b192dcd8b925c766f73083ccd128be9"
      session_id: "system-code-graph-reference-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use foldered canonical references plus old-path compatibility stubs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: System Code Graph Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The `system-code-graph` references were still root-level kebab-case files and the skill router used static paths. This packet aligns those references with sk-doc's reference-template pattern, moves canonical docs into focused snake_case subfolders, leaves compatibility stubs at old paths, and updates active navigation to prefer the canonical files.

**Key Decisions**: Canonical references live in `runtime/`, `readiness/`, `config/`, and `integrations/`; root kebab-case files remain as short pointer stubs.

**Critical Dependencies**: sk-doc validators and the existing `system-code-graph` runtime contract.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-24 |
| **Branch** | Existing worktree |
| **Parent Spec** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The code-graph reference set did not follow sk-doc reference-template naming and structure 1:1. Root-level kebab-case references made router maps stale-prone, and active docs pointed to paths that should become compatibility surfaces instead of preferred knowledge-base targets.

### Purpose

Provide a template-aligned, navigable code-graph documentation set without changing runtime behavior, MCP tool IDs, schemas, scripts, commands, or source code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Move canonical references into focused snake_case subfolders.
- Leave old root paths as valid, short compatibility stubs.
- Align canonical references with sk-doc reference-template structure.
- Update `SKILL.md` smart router/resource maps to canonical references.
- Update active README and architecture links.
- Create and validate this Level 3 documentation packet.

### Out of Scope

- Runtime code behavior changes.
- MCP tool schema or command changes.
- Database, launcher, parser, or handler implementation changes.
- Historical changelog/provenance rewrites.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/references/runtime/*.md` | Create/Move | Canonical runtime references. |
| `.opencode/skills/system-code-graph/references/readiness/*.md` | Create/Move | Canonical readiness references. |
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Create/Move | Canonical config reference. |
| `.opencode/skills/system-code-graph/references/integrations/ccc_bridge_integration.md` | Create/Move | Canonical CCC bridge reference. |
| `.opencode/skills/system-code-graph/references/*.md` | Create | Compatibility stubs at old paths. |
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | sk-doc-style smart router and canonical resource map. |
| `.opencode/skills/system-code-graph/README.md` | Modify | Related-document table points at canonical references. |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify | Active architecture links point at canonical references. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/022-reference-template-alignment/` | Create/Modify | Packet docs and validation evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical references use snake_case filenames under focused subfolders. | `find references -path '*/*'` shows canonical `runtime/`, `readiness/`, `config/`, and `integrations/` files with underscores. |
| REQ-002 | Old root paths remain valid compatibility stubs. | Each old kebab-case root path exists, has frontmatter, H1, intro, `---`, `## 1. OVERVIEW`, and points at the canonical file. |
| REQ-003 | Canonical references follow sk-doc reference-template structure. | `extract_structure.py` and `validate_document.py --type reference --blocking-only` pass for all changed references. |
| REQ-004 | Router prefers canonical paths only. | `SKILL.md` resource domains and `RESOURCE_MAP` target canonical subfolder paths, not root stubs. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Active docs use canonical links. | `README.md` and `ARCHITECTURE.md` link to canonical references. |
| REQ-006 | Runtime behavior is unchanged. | Only documentation/navigation and packet files change; no schemas, handlers, commands, or scripts are edited. |
| REQ-007 | Validation evidence is recorded. | `implementation-summary.md` and `checklist.md` list the commands and outcomes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All changed/new references pass sk-doc blocking reference validation.
- **SC-002**: `system-code-graph/SKILL.md` passes sk-doc blocking skill validation and includes dynamic markdown discovery, `_guard_in_skill()`, `load_if_available()`, `_task_text()`, weighted intent scoring, ambiguity handling, `UNKNOWN_FALLBACK_CHECKLIST`, and no-KB notices.
- **SC-003**: `quick_validate.py .opencode/skills/system-code-graph --json` returns valid.
- **SC-004**: Stale root-path references are absent from active docs; only compatibility stubs preserve old filenames.
- **SC-005**: Strict packet validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc validator behavior | Template drift could remain hidden if validators are skipped. | Run extract, blocking validation, quick validation, and stale-link checks. |
| Risk | Existing external links to old root paths | Direct links could break if files are only moved. | Keep old root paths as pointer stubs. |
| Risk | Router points at stubs | Agents would load thin pointers instead of useful references. | Keep `RESOURCE_MAP` canonical-only and check stale paths with `rg`. |
| Risk | Runtime scope drift | Documentation cleanup could accidentally touch code behavior. | Avoid runtime files; use grep and git diff review to confirm docs-only scope. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:quality -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: The reference taxonomy must make the owning domain obvious from the path.
- **NFR-M02**: Compatibility stubs must remain short and avoid duplicated long-form content.

### Reliability

- **NFR-R01**: Active router maps must load canonical references with inventory checks and duplicate suppression.

### Security

- **NFR-S01**: Router pseudocode must sandbox resource paths with `_guard_in_skill()`.
<!-- /ANCHOR:quality -->

---

## 8. EDGE CASES

### Existing Old-Path Links

Old links to root kebab-case reference files resolve through compatibility stubs.

### Router Resource Loading

Router resource maps target canonical references only, so agents do not spend a knowledge-load on pointer stubs.

### Historical Files

Changelogs and archived provenance can retain old path text because compatibility stubs preserve link behavior and the active-doc checks cover live navigation surfaces.

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple reference moves, stubs, router and active docs. |
| Risk | 8/25 | Documentation-only, but stale links and router drift matter. |
| Research | 8/20 | Needed local sk-doc template and current code-graph tree inspection. |
| Multi-Agent | 0/15 | Single-agent implementation. |
| Coordination | 8/15 | Must preserve existing code-graph and sk-doc contracts. |
| **Total** | **42/100** | **Level 3 selected for architecture/router documentation discipline.** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Router loads compatibility stubs instead of canonical docs | Medium | Low | Keep `RESOURCE_MAP` canonical-only and run stale-path checks. |
| R-002 | Old direct links break after moves | Medium | Low | Keep root stubs with valid reference shape. |
| R-003 | Future edits reintroduce kebab-case canonical paths | Low | Medium | Use `rg` and sk-doc validation before completion. |

---

<!-- ANCHOR:stories -->
## 11. USER STORIES

### US-001: Canonical Reference Navigation (Priority: P0)

As an agent maintaining `system-code-graph`, I want references grouped by domain and named in snake_case, so that sk-doc discovery and future navigation are predictable.

**Acceptance Criteria**:
1. Given the reference tree, when I inspect canonical files, then they live under `runtime/`, `readiness/`, `config/`, or `integrations/`.
2. Given old links, when I open an old root path, then I get a valid stub pointing at the canonical file.

### US-002: Router Alignment (Priority: P0)

As an agent loading code-graph knowledge, I want the smart router to use sk-doc discovery and path guards, so that it loads current canonical resources safely.

**Acceptance Criteria**:
1. Given `SKILL.md`, when sk-doc validates it, then the document passes blocking checks.
2. Given a router resource map, when I inspect paths, then canonical references are preferred and stubs are not mapped as primary resources.
<!-- /ANCHOR:stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md` - implementation approach and validation plan.
- `tasks.md` - completed work items.
- `checklist.md` - verification evidence.
- `decision-record.md` - taxonomy and router decisions.
- `implementation-summary.md` - final delivery summary.
