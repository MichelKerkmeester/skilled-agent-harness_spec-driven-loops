---
title: "Feature Specification: sk-create-diagram type reference library"
description: "Port all 27 diagram-type reference files and one canonical example asset per type, per phase 001's trim manifest."
trigger_phrases:
  - "diagram type reference library"
  - "27 diagram type references"
  - "diagram example assets"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/003-diagram-type-reference-library"
    last_updated_at: "2026-08-12T06:31:38.000Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec ahead of executor dispatch"
    next_safe_action: "Dispatch phase 003 executor prompt via cli-opencode after phase 002 lands"
    blockers:
      - "Depends on phase 002's SKILL.md skeleton and references/ folder existing"
    key_files:
      - "spec.md"
      - "../001-inventory-and-skill-contract/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram type reference library

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 6 |
| **Predecessor** | `../002-skill-scaffold-and-design-system/spec.md` |
| **Successor** | `../004-import-export-tooling/spec.md` |
| **Handoff Criteria** | All 27 `type-*.md` references and their canonical examples exist, are frontmatter-valid, and are reachable from `SKILL.md`'s selection-guide table |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: The 27 diagram-type reference files and one canonical example HTML asset per type, plus the small set of special-pattern examples (`decision-record.md` §4/resource-map.md §3). No `SKILL.md` restructuring here — that is frozen output of phase 002.

**Dependencies**: Phase 002's `SKILL.md` and `references/` folder must exist (this phase adds into them, it does not create the skeleton).

**Deliverables**: See §3 Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill's actual value — 27 distinct diagram types, each with its own layout conventions, anti-patterns, and complexity budget — has not been ported yet. Phase 002 only ships the shared design system.

### Purpose

Port every `type-*.md` reference and one canonical example per type, so the skill can actually produce all 27 documented diagram types.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Port all 27 `references/type-*.md` files listed in `../001-inventory-and-skill-contract/resource-map.md` §1, each with the full reference frontmatter block.
- Port one canonical `assets/example-<type>.html` per type (27 files, the minimal-light variant).
- Port the ~7 special-pattern examples that are not covered by the canonical set: `example-quadrant-consultant.html`, `example-loop-terminal.html`, `example-sequence-oauth.html`, `example-sequence-oauth-dark.html`, `example-sequence-oauth-full.html`, `example-import-drawio.html`, `example-import-mermaid.html`.
- Update `SKILL.md`'s §3 selection-guide table (already scaffolded in phase 002 as a stub or partial) so every type row links to its ported reference.

### Out of Scope

- `export.md`, `import-drawio.md`, `import-mermaid.md`, and the two extraction scripts (phase 004).
- Hub wiring (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/sk-create-diagram/references/type-*.md` (27 files) | Create | Ported diagram-type references |
| `.opencode/skills/sk-doc/sk-create-diagram/assets/example-*.html` (27 canonical + 7 special) | Create | Ported example assets |
| `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md` | Modify | Selection-guide table links to every ported type |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 27 `type-*.md` files exist with valid reference frontmatter. | File count and frontmatter spot-checked. |
| REQ-002 | Every type has at least one example asset. | 27 canonical + 7 special-pattern files present under `assets/`. |
| REQ-003 | `SKILL.md`'s selection-guide table links every type to its reference file with a working relative path. | Every row resolves to an existing file. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each type's complexity-budget limits and anti-patterns survive porting. | Spot-checked against `context/skills/diagram-design/SKILL.md` §7 complexity-budget table and each type's own anti-pattern notes. |
| REQ-005 | Every copied example asset is byte-identical to its source file. | `cmp -s` confirms identity for a representative sample across both dispatch batches. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find .opencode/skills/sk-doc/sk-create-diagram/references -name 'type-*.md' | wc -l` equals 27.
- **SC-002**: Every ported reference resolves any cross-reference it makes back into itself (no dangling links to files this phase did not create).
- **SC-003**: `validate_skill_package.py --check` reports no hard failures for the added files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 27 files is a lot of mechanical work — one dropped file silently ships an incomplete type roster. | Medium | Explicit file-count acceptance criterion (SC-001), checked mechanically, not by sampling. |
| Dependency | Phase 002's `SKILL.md` skeleton and `references/` folder | High | Must land first; this phase only adds files into an existing structure. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — executes the frozen phase 001 manifest.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Executor brief: `../001-inventory-and-skill-contract/resource-map.md` §1, §3
