---
title: "Feature Catalog Standards — Templates & Retroactive Rework"
description: "Phase parent: establish new feature catalog standards (templates, heading rename, sub-headings, trigger_phrases, related references) then retroactively apply them across all 370 catalog files in three skills."
trigger_phrases:
  - "feature catalog rework"
  - "catalog retroactive update"
  - "feature catalog standards"
  - "feature catalog trigger phrases"
  - "catalog snippet subheadings"
importance_tier: "normal"
contextType: "general"
---
# Feature Catalog Standards — Templates & Retroactive Rework

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (Phase Parent) |
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
| Long HOW IT WORKS sections without H3 sub-headings | TBD (audit in 002) |
| Master catalogs missing `trigger_phrases` + `last_updated` | 3 |

The two template files were also non-conformant: missing required fields, broken section hierarchy, inconsistent naming.

### Purpose
Phase 001 (complete): Establish the correct template standard. Phases 002–009: Retroactively apply that standard to every existing feature catalog file across all three skills.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `feature_catalog_snippet_template.md`: restructure, add frontmatter contract section, fix hierarchy, add checklist
- `feature_catalog_template.md`: add quick-jump callout, update scaffolds, convert §2 to decision table, expand authoring notes

### Out of Scope
- Any existing feature catalog instance files (system-spec-kit, system-skill-advisor, system-code-graph)
- Adding new template files
- Changes to sk-doc SKILL.md

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` | Modify | Restructure to 5 sections, add frontmatter contract, fix hierarchy, add checklist |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modify | Quick-jump callout, updated scaffolds, decision table §2, expanded authoring notes |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `trigger_phrases` present in all three scaffolds | Snippet template scaffold, master template §4 scaffold, master template §5 scaffold all include trigger_phrases in frontmatter |
| REQ-002 | Template marker in per-feature scaffolds | `<!-- sk-doc-template: skill_asset_feature_catalog -->` appears after H1 in both per-feature scaffolds |
| REQ-003 | Fix `### Authoring Notes` hierarchy | Promoted to `## 4. AUTHORING NOTES` as a proper H2 section in snippet template |
| REQ-004 | Fix filename case inconsistency | `FEATURE_CATALOG.md` → `feature_catalog.md` in snippet template line 78 |
| REQ-005 | Add `## 5. CHECKLIST` to snippet template | Pre-publish checklist with Structure / Content / Quality categories |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Add `## 2. FRONTMATTER CONTRACT` section to snippet template | Shows all fields with required/optional inline comments |
| REQ-007 | Convert §2 of master template to decision table | "Create when / Keep simpler when" as a 2-column table |
| REQ-008 | Add quick-jump callout to master template | Visible callout after H1 pointing to §4 and §5 |
| REQ-009 | Expand authoring notes in master template | Two new bullets covering trigger_phrases and importance_tier |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Snippet template has exactly 5 numbered H2 sections (OVERVIEW, FRONTMATTER CONTRACT, TEMPLATE SCAFFOLD, AUTHORING NOTES, CHECKLIST)
- **SC-002**: `trigger_phrases` appears in all three scaffold frontmatter blocks
- **SC-003**: `feature_catalog.md` (lowercase) is consistent across both template files
- **SC-004**: No existing catalog instance files are modified (git diff --stat shows only the two template files)

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scripts parsing template section headers | Section rename breaks script | Check for any scripts referencing snippet template section names before editing |
| Dependency | sk-doc SKILL.md references to templates | None expected — links point to file paths, not section IDs | Verify no section-anchor links in sk-doc skill |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope is clear from cross-analysis of 365+ real-world instantiations.

<!-- /ANCHOR:questions -->
