---
title: "Feature Catalog Standards — Templates & Retroactive Rework"
description: "Phase parent: establish new feature catalog standards then retroactively apply them across all 370 catalog files in three skills."
trigger_phrases:
  - "feature catalog rework"
  - "catalog retroactive update"
  - "feature catalog standards"
  - "feature catalog trigger phrases"
  - "catalog snippet subheadings"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-feature-catalog-template-improvements"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Restructured to phase-parent with lean trio; moved Phase 001 docs to child folder"
    next_safe_action: "Resume a child phase folder or run validation"
    blockers: []
    key_files:
      - "spec.md"
      - "roadmap.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "restructure-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Catalog Standards — Templates & Retroactive Rework

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-31 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Cross-analysis of all 370 feature catalog files across three skills (system-spec-kit: 314 files, 25 categories; system-skill-advisor: 41 files, 7 categories; system-code-graph: 15 files, 7 categories) reveals pervasive drift from the desired standard:

| Gap | Files affected |
|---|---|
| `CURRENT REALITY` heading (must be `HOW IT WORKS`) | 365 |
| Missing template marker `<!-- sk-doc-template: ... -->` | 328 |
| Missing `trigger_phrases` in frontmatter | 309 |
| Old 2-col validation table (`File \| Focus`) | 249 |
| Missing `Related references` in SOURCE METADATA | 315 |
| Long HOW IT WORKS sections without H3 sub-headings | ~100-150 |
| Master catalogs missing `trigger_phrases` + `last_updated` | 3 |

The two template files were also non-conformant: missing required fields, broken section hierarchy, inconsistent naming.

### Purpose

Phase 001 (complete): Establish the correct template standard. Phases 002–009 (complete): Retroactively apply that standard to every existing feature catalog file across all three skills.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Feature catalog snippet template: restructure to 5 sections, add frontmatter contract, fix hierarchy, add checklist
- Feature catalog template: add quick-jump callout, update scaffolds, convert §2 to decision table, expand authoring notes
- Retroactive application of new standard to all 370 catalog files across three skills

### Out of Scope

- Changes to sk-doc SKILL.md
- Adding new template files beyond the two existing ones
- Any feature catalog work outside the three target skills

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` | Modify | 001 | 5-section restructure, frontmatter contract, checklist |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modify | 001 | Quick-jump, decision table §2, updated scaffolds |
| 365+ snippet files across 3 skills | Modify | 002-009 | Retroactive standardization |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-template-improvements/` | Establish correct template standard (2 template files) | Complete |
| 2 | `002-mechanical-sweep/` | Python scripts for heading renames, template markers, validation tables | Complete |
| 3 | `003-trigger-phrases-spec-kit/` | Add trigger_phrases to 309 system-spec-kit snippets | Complete |
| 4 | `004-trigger-phrases-advisor-codegraph/` | Add trigger_phrases to 4 advisor+code-graph snippets | Complete |
| 5 | `005-subheadings-spec-kit/` | Add H3 sub-headings to 106 system-spec-kit snippets | Complete |
| 6 | `006-subheadings-advisor-codegraph/` | Add H3 sub-headings to 1 advisor+code-graph snippet | Complete |
| 7 | `007-related-references/` | Add Related references to 312 snippets | Complete |
| 8 | `008-master-catalog-enrichment/` | Enrich 3 master catalog files | Complete |
| 9 | `009-validation-sweep/` | Validation script + targeted fixes for all 370 files | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Both template files updated to new standard | Read template files, verify 5 sections + scaffolds |
| 002 | 003-007 | Mechanical sweep complete (headings, markers, tables) | git diff --stat shows expected file counts |
| 003-007 | 008 | All snippet files have trigger_phrases, sub-headings, related references | Grep for trigger_phrases, H3 headers, Related references |
| 008 | 009 | Master catalogs enriched | Read master catalogs, verify trigger_phrases + last_updated |
| 009 | Done | 95%+ compliance across all 370 files | Validation script compliance report |

<!-- /ANCHOR:phase-map -->
---

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

### Cross-Phase Success Criteria

- **SC-001**: All 370 feature catalog files have `trigger_phrases` in frontmatter
- **SC-002**: All 370 files use `HOW IT WORKS` heading (not `CURRENT REALITY`)
- **SC-003**: All 370 files have template marker after H1
- **SC-004**: All 370 files use 3-col validation table (`File|Type|Role`)
- **SC-005**: All 370 files have `Related references` in SOURCE METADATA
- **SC-006**: Long HOW IT WORKS sections have H3 sub-headings
- **SC-007**: Both template files match new standard (5 sections, scaffolds, etc.)
- **SC-008**: 3 master catalogs enriched with `trigger_phrases` + `last_updated`

### Final Compliance (as of Phase 009 completion)

| Check | Result | Gap |
|---|---|---|
| `trigger_phrases` in frontmatter | 100% | 0 |
| `HOW IT WORKS` heading | 100% | 0 (366 renamed) |
| Template marker after H1 | 100% | 0 (330 inserted) |
| Validation table `File|Type|Role` | 100% | 0 (248 fixed) |
| Related references in SOURCE METADATA | 100%* | 3 singletons exempt |
| Master catalogs enriched | 3/3 | — |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 5. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scripts parsing template section headers | Section rename breaks script | Check for any scripts referencing snippet template section names before editing |
| Dependency | sk-doc SKILL.md references to templates | None expected — links point to file paths, not section IDs | Verify no section-anchor links in sk-doc skill |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 6. OPEN QUESTIONS

None — all phases complete. Scope was clear from cross-analysis of 365+ real-world instantiations.

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Roadmap**: See `roadmap.md` for cross-phase gap summary and dependency graph
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
