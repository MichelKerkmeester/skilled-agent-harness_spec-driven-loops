---
title: "Feature Specification: Phase 1: plugin-doc-removal"
description: "Delete the seventy-nine files belonging exclusively to the twelve removed Obsidian plugins, leaving Iconic and Health.md intact."
trigger_phrases:
  - "delete obsidian plugin doc sets"
  - "mcp-obsidian plugin file removal"
  - "which obsidian plugin files are removed"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: plugin-doc-removal

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY


Twelve of the fourteen dedicated plugin doc sets in the `mcp-obsidian` mode are removed, together
with their example assets, feature-catalog entries and manual-testing-playbook scenarios. Iconic
and Health.md are retained untouched. This phase deletes files only; every reference to them is
reconciled in phase 2, so the tree is deliberately inconsistent between the two phases.

**Key Decisions**: the retained set is exactly Iconic and Health.md; the theme surface is not
plugin support and stays.

**Critical Dependencies**: none. Every target file is tracked in git, so the phase is reversible
with `git restore`.

---
<!-- ANCHOR:metadata -->

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-skill-surface-reconciliation |
| **Handoff Criteria** | `references/plugins/` holds only `iconic/`, `health-md/`, `installed-plugins.md` and `plugin-operation-logic.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->

## Phase Context

This is **Phase 1** of the Reduce mcp-obsidian dedicated plugin support to Iconic and Health.md
only specification.

**Scope Boundary**: deletion only. No surviving file is edited in this phase; the dangling
references the deletions create are phase 2's work.

**Dependencies**:
- None. This phase runs first.

**Deliverables**:
- Seventy-nine files removed across four surfaces.
- The two retained plugin doc sets byte-identical to their pre-phase state.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->

## 2. PROBLEM & PURPOSE

### Problem Statement
Twelve of the mode's fourteen dedicated plugin doc sets are unwanted.
Each is a four-file bundle, and most carry example assets, a feature-catalog entry and a
playbook tie-in as well. Their roughly 8,700 reference lines are dead weight a reader must rule
out before reaching the note and vault surfaces the mode exists for.

### Purpose
Every file belonging exclusively to a removed plugin is gone, and nothing belonging to Iconic,
Health.md, the theme system, the CLIs or the MCP is touched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->

## 3. SCOPE

### In Scope
- Delete the twelve removed plugins' reference doc sets (48 files).
- Delete their example assets (9 files, including the BRAT root asset).
- Delete their feature-catalog entries (11 files).
- Delete their manual-testing-playbook tie-ins (11 files).

### Out of Scope
- Editing any file that survives - phase 2 owns every reconciliation, so this phase intentionally
  leaves dangling references behind.
- `references/plugins/iconic/`, `references/plugins/health-md/`, `assets/plugins/iconic/`,
  `assets/plugins/health-md/` - the retained set.
- `feature-catalog/plugins/theme-system.md` and
  `manual-testing-playbook/plugin-tie-ins/theme-activation.md` - the theme surface is not
  dedicated plugin support.
- `references/plugins/installed-plugins.md` and `references/plugins/plugin-operation-logic.md` -
  cross-plugin documents, edited in phase 2 rather than deleted.
- The operator's Obsidian vault. No plugin is uninstalled or disabled anywhere.

### Files to Change

All paths are relative to `.opencode/skills/mcp-tooling/mcp-obsidian/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/plugins/advanced-canvas/` | Delete | Four-file doc set |
| `references/plugins/charts/` | Delete | Four-file doc set |
| `references/plugins/claudian/` | Delete | Four-file doc set |
| `references/plugins/dataview/` | Delete | Four-file doc set |
| `references/plugins/git/` | Delete | Four-file doc set |
| `references/plugins/make-md/` | Delete | Four-file doc set |
| `references/plugins/meta-bind/` | Delete | Four-file doc set |
| `references/plugins/notion-bases/` | Delete | Four-file doc set |
| `references/plugins/obsidian-local-rest-api/` | Delete | Four-file doc set |
| `references/plugins/obsidian-tables/` | Delete | Four-file doc set |
| `references/plugins/obsidian42-brat/` | Delete | Four-file doc set |
| `references/plugins/outliner/` | Delete | Four-file doc set |
| `assets/plugins/charts/` | Delete | 1 example |
| `assets/plugins/dataview/` | Delete | 2 examples |
| `assets/plugins/git/` | Delete | 2 examples |
| `assets/plugins/obsidian-tables/` | Delete | 1 example |
| `assets/plugins/outliner/` | Delete | 2 examples |
| `assets/brat-data-entry.example.json` | Delete | BRAT root asset |
| `feature-catalog/plugins/{advanced-canvas,charts,claudian,dataview,git,make-md,meta-bind,notion-bases,obsidian-tables,obsidian42-brat,outliner}.md` | Delete | 11 catalog entries |
| `manual-testing-playbook/plugin-tie-ins/{advanced-canvas-styling,brat-headless-install,charts-render-block,claudian-command-skill,dataview-metadata-query,git-status-roundtrip,meta-bind-file-layer,notion-bases-dataview-install,notion-bases-relation-rollup,obsidian-tables-roundtrip,outliner-settings-defaults}.md` | Delete | 11 playbook scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | All twelve removed-plugin directories under `references/plugins/` are gone |
| REQ-002 | `references/plugins/iconic/` and `references/plugins/health-md/` are unchanged, all four files each |
| REQ-003 | The five removed asset directories and `assets/brat-data-entry.example.json` are gone |
| REQ-004 | The eleven feature-catalog entries and eleven playbook tie-ins are gone |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `feature-catalog/plugins/theme-system.md` and `plugin-tie-ins/theme-activation.md` survive |
| REQ-006 | No file outside the four named surfaces is deleted or modified |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->

## 5. SUCCESS CRITERIA

- **SC-001**: `ls references/plugins/` prints exactly `health-md`, `iconic`, `installed-plugins.md`, `plugin-operation-logic.md`.
- **SC-002**: `git status --porcelain` shows exactly 79 deletions under the mode and zero modifications.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A glob deletes a retained doc set | High | Delete by explicit path list, never by wildcard over `references/plugins/*` |
| Risk | The theme files are mistaken for plugin files | Medium | Both theme paths are named in Out of Scope and asserted in acceptance criteria |
| Risk | Deletions land outside the mode | High | Every path is relative to the mode root and verified with `git status` before handoff |
| Dependency | Git tracking | Rollback | Every target is tracked; `git restore -- <path>` recovers any file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The mode's reference tree drops by roughly 8,700 lines, which is the point of the phase rather than a side effect to measure.

### Security
- **NFR-S01**: No credential, token or vault path is touched. The deletions are documentation only.

### Reliability
- **NFR-R01**: Every deletion is recoverable from git history for the life of the repository.

---

## 8. EDGE CASES

### Data Boundaries
- A named target is already absent: treat it as satisfied, record it, and do not search for a substitute to delete.
- A directory holds an unexpected extra file: delete the directory whole, and report the extra file in the summary.

### Error Scenarios
- A delete is refused by permissions: stop, report the path, and do not retry with force.
- A retained file is found modified: stop immediately, restore it, and report it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 79, LOC: ~8,700, Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N (documentation only) |
| Research | 2/20 | The inventory is frozen in this spec |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 5/15 | Dependencies: phases 2 and 3 consume this output |
| **Total** | **35/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A retained plugin doc set is deleted | H | L | Explicit path list; post-delete assertion on both retained sets |
| R-002 | A theme file is deleted as a plugin | M | M | Named in Out of Scope and asserted in acceptance criteria |
| R-003 | Deletion escapes the mode directory | H | L | `git status` reviewed before handoff |

---

## 11. USER STORIES

### US-001: A narrow plugin surface (Priority: P0)

**As an** agent operating an Obsidian vault, **I want** the mode to document only the plugins the
operator actually uses, **so that** routing and reading are not diluted by twelve plugins nobody
asked about.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Retained plugins survive intact (Priority: P1)

**As an** operator who relies on Iconic rulebooks and Health.md visualizations, **I want** those
two doc sets untouched, **so that** the reduction costs me nothing I use.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

None. The retained set was named by the operator, and the theme boundary is settled in Out of Scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the Architecture Decision Record section at the end of `plan.md`

---


