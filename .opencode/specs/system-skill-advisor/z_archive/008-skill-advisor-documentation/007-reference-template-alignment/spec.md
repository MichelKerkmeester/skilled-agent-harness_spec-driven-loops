---
title: "Feature Specification: System Skill Advisor Reference Template Alignment"
description: "Align system-skill-advisor references to the sk-doc reference template, canonicalize reference folders, keep compatibility stubs, and refresh routing/navigation docs."
trigger_phrases:
  - "system skill advisor reference template alignment"
  - "system-skill-advisor references"
  - "advisor reference folders"
  - "skill advisor smart router"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/007-reference-template-alignment"
    last_updated_at: "2026-05-24T07:27:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed reference template alignment and validation"
    next_safe_action: "Packet complete; preserve compatibility stubs during future reference edits"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/references/"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "system-skill-advisor-reference-template-alignment-2026-05-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use canonical subfolders plus compatibility stubs."
      - "Create a new spec packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: System Skill Advisor Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The `system-skill-advisor` reference set was flat, kebab-case, and only partially aligned with the stricter `sk-doc` reference template. This packet makes canonical references snake_case, moves them into focused subfolders, keeps old root paths as compatibility stubs, and refreshes the skill router so future navigation prefers canonical docs.

**Key Decisions**: canonical subfolders with compatibility stubs, documentation-only router alignment.

**Critical Dependencies**: `sk-doc` reference template validation and system-spec-kit packet validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-24 |
| **Branch** | Current working tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor references were stored as one flat root folder with kebab-case filenames and inconsistent sk-doc reference-template structure. The `SKILL.md` smart-router also pointed at root reference paths, which made canonical resource loading brittle after reference moves.

### Purpose

Make `system-skill-advisor` references template-compliant, navigable by domain, and stable for existing links without changing runtime advisor behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Move canonical reference files into `scoring/`, `graph/`, `runtime/`, `config/`, `hooks/`, and `decisions/`.
- Leave root compatibility stubs at old kebab-case paths.
- Align canonical references with the sk-doc H1 intro plus `## 1. OVERVIEW` pattern.
- Update `system-skill-advisor/SKILL.md`, README navigation, active links, and relevant active docs.
- Validate changed skill, README, references, and packet docs.

### Out of Scope

- Runtime MCP tool behavior, tool IDs, schemas, scripts, generated JS output, database files, or command semantics.
- Historical changelog/provenance rewrites when compatibility stubs already preserve old links.
- Cross-skill reference moves outside `system-skill-advisor`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/references/` | Move/Create/Modify | Canonical reference folders plus root compatibility stubs. |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modify | Smart-router/resource map alignment. |
| `.opencode/skills/system-skill-advisor/README.md` | Modify | Structure and related-doc navigation. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modify | Active hook-reference link. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/README.md` | Modify | Active DB policy link. |
| `.opencode/skills/system-skill-advisor/feature_catalog/` | Modify | Active reference links where applicable. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/` | Modify | Active reference links where applicable. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve existing links. | Every old root kebab-case reference path exists as a valid compatibility stub pointing to the canonical file. |
| REQ-002 | Align canonical references to sk-doc template shape. | Each canonical reference has frontmatter, H1, a 1-2 sentence intro, `---`, `## 1. OVERVIEW`, numbered H2s, and no reference-level `### TABLE OF CONTENTS`. |
| REQ-003 | Preserve runtime behavior. | No advisor MCP runtime source, schema, script, command, or database behavior is intentionally changed by this packet. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Refresh smart-router navigation. | `SKILL.md` discovers markdown resources dynamically and maps intents to canonical paths only. |
| REQ-005 | Update active links. | README, INSTALL_GUIDE, database README, feature catalog, and manual playbook references prefer canonical paths. |
| REQ-006 | Validate documentation. | sk-doc validation, quick validation, rg checks, and packet strict validation pass or any residual issue is reported. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All canonical references and compatibility stubs pass `validate_document.py --type reference --blocking-only`.
- **SC-002**: `system-skill-advisor/SKILL.md` passes skill validation and uses the sk-doc smart-router resilience pattern.
- **SC-003**: `quick_validate.py .opencode/skills/system-skill-advisor --json` passes.
- **SC-004**: rg checks find no stale active root reference links, no canonical kebab-case reference filenames, and no reference-level table of contents.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing dirty runtime worktree | Accidental overlap with unrelated runtime changes | Restrict edits to documentation/reference surfaces named in scope. |
| Risk | Relative link drift after moving files | Broken documentation navigation | Run link smoke checks plus rg stale-path checks. |
| Dependency | sk-doc validators | Template compliance evidence depends on local scripts | Run extract, validate, quick_validate, and packet strict validation. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation

- **NFR-D01**: Canonical references use snake_case filenames and focused subfolders.
- **NFR-D02**: Compatibility stubs do not duplicate long-form content.

### Compatibility

- **NFR-C01**: Old root paths continue to resolve as short stubs.
- **NFR-C02**: Router resource maps point at canonical paths, not stubs.

---

## 8. EDGE CASES

### Link Compatibility

- Old root link: compatibility stub resolves and points to canonical file.
- Canonical link: first-party docs route directly to subfolder snake_case file.

### Validation

- Reference template validation: canonical docs and stubs are both validated.
- Strict packet validation: packet metadata and authored docs must remain coherent.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple docs and reference moves. |
| Risk | 10/25 | Documentation-only, but link drift is possible. |
| Research | 12/20 | Requires sk-doc template and current advisor tree inspection. |
| Multi-Agent | 0/15 | Single-agent implementation. |
| Coordination | 10/15 | Must avoid unrelated dirty runtime changes. |
| **Total** | **50/100** | **Level 3 selected for reference reorganization plus router/documentation alignment.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Moved references break active links. | Medium | Medium | Compatibility stubs plus rg/link checks. |
| R-002 | Router accidentally prefers stubs. | Medium | Low | RESOURCE_MAP uses canonical paths only. |
| R-003 | Runtime files are modified during doc cleanup. | High | Low | Scope edits to docs and inspect git diff. |

---

## 11. USER STORIES

### US-001: Canonical Advisor References (Priority: P0)

**As a** maintainer, **I want** advisor references grouped by domain with snake_case paths, **so that** router loading and human navigation are predictable.

**Acceptance Criteria**:
1. Given a canonical advisor reference, When I inspect its path, Then it lives in a relevant subfolder and uses snake_case.

### US-002: Compatibility Links (Priority: P0)

**As an** existing documentation consumer, **I want** old root reference links to resolve, **so that** existing docs do not break after the reorganization.

**Acceptance Criteria**:
1. Given an old root kebab-case path, When I open it, Then it is a short valid stub pointing to the canonical reference.

### US-003: Smart Router Alignment (Priority: P1)

**As an** agent maintaining the advisor skill, **I want** the smart router to discover and load canonical resources dynamically, **so that** future reference moves do not require static inventory rewrites.

**Acceptance Criteria**:
1. Given a scoring, graph, runtime, config, hook, decision, feature or playbook task, When router pseudocode selects resources, Then it maps to canonical paths and handles ambiguity/fallback.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. User selected folders plus stubs and a new spec packet.
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| `plan.md` | Implementation approach and validation strategy. |
| `tasks.md` | Task tracking for the reference cleanup. |
| `decision-record.md` | ADR for canonical folders plus compatibility stubs. |
| `implementation-summary.md` | Completion evidence and validation results. |
