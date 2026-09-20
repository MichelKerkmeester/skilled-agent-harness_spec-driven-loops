---
title: "Feature Specification: Phase 18 — catalog and reference topology simplification"
description: "Reduce mcp-obsidian feature-catalog nesting to cli, mcp, and plugins while removing decimal subheadings from every mode reference without breaking links."
trigger_phrases:
  - "mcp obsidian catalog flattening"
  - "reference heading normalization"
  - "feature catalog topology"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/018-catalog-reference-topology"
    last_updated_at: "2026-08-03T20:32:51Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 18 migration specification"
    next_safe_action: "Move catalog cards into the approved three-folder topology and normalize reference subheadings"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-catalog-reference-topology"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 18 — catalog and reference topology simplification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `017-health-md-live-validation-closeout` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian feature catalog spreads 25 cards over 14 narrowly named directories, making navigation heavier than the surface warrants. Its root inventory also reports stale totals. Separately, five reference files use 26 decimal subheadings such as `2.1` and `3.4`; the numbering adds maintenance overhead without improving navigation and one cross-reference depends on it.

### Purpose
Consolidate feature cards into the approved three-folder surface topology (`cli/`, `mcp/`, `plugins/`) and make all mcp-obsidian reference subheadings descriptive rather than decimal-numbered. Preserve every feature card, current behavior, asset, and relative link.

**End goal:** a simpler catalog tree, accurate root inventory, zero decimal subheadings in `mcp-obsidian/references/`, and no broken in-repo links.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move 14 CLI cards from command-specific folders into `feature-catalog/cli/`.
- Move 6 MCP cards from priority folders into `feature-catalog/mcp/`.
- Keep the 5 plugin cards in `feature-catalog/plugins/`.
- Normalize the six off-taxonomy validation Type values in the three untouched plugin cards (`beancount-finance`, `obsidian-tables`, `obsidian42-brat`) to the canonical taxonomy (`Asset` → `Fixture`, `Validation reference` → `Reference`) so the catalog package validator passes.
- Repair fifteen pre-existing relative link errors in the three plugin reference index files (`beancount-finance.md`, `obsidian-tables.md`, `obsidian42-brat.md`) so the Markdown link guard reports zero mcp-obsidian breakage.
- Update the root catalog's topology explanation, counts, headings, and all moved-card links.
- Update every affected inbound link and each moved card's canonical-path metadata.
- Replace all decimal H3–H6 headings in `mcp-obsidian/references/**/*.md` with descriptive unnumbered headings; replace any numeric subsection prose reference with a durable descriptive reference.
- Refresh generated skill manifest and phase metadata; validate catalog, links, and phase docs.

### Out of Scope
- Changes to any catalog card's shipped-behavior claims beyond path/topology metadata.
- Flattening cards into the catalog root.
- Changes to manual-testing-playbook scenario topology.
- Vault files, plugin configuration, or rendered Obsidian UI behavior.
- Other skills' feature catalogs and references.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/{cli,mcp,plugins}/**` | Move/Modify | Approved three-folder card topology and canonical paths |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/feature-catalog.md` | Modify | Accurate counts, surface-group navigation, moved-card links |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/**/*.md` | Modify | Repair moved-card links only where present |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/**/*.md` | Modify | Remove decimal subheadings and numeric-subsection prose references |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/{beancount-finance,obsidian-tables,obsidian42-brat}.md` | Modify | Normalize validation Type values to the canonical taxonomy (user-approved) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/{beancount-finance,obsidian-tables,obsidian42-brat}/*.md` | Modify | Repair pre-existing relative link errors (user-approved) |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | Reflect moved/added skill resources |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Catalog topology has only three card folders | `feature-catalog/` contains only `cli/`, `mcp/`, and `plugins/` as card directories; card totals are 14, 6, and 5 respectively |
| REQ-002 | Migration preserves all feature cards and links | Exactly 25 cards remain; root links, playbook links, and card canonical paths resolve after the move |
| REQ-003 | Reference subheadings are unnumbered | Grep finds zero H3–H6 decimal heading forms in `mcp-obsidian/references/**/*.md`; all 26 discovered headings retain descriptive text |
| REQ-004 | Numeric prose references are removed safely | Grep finds zero decimal-section prose references in mcp-obsidian docs, or every remaining result is outside the changed reference contract and reviewed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Root catalog reflects current surface | Root catalog states 25 entries across 14 CLI, 6 MCP, and 5 plugin cards without stale category totals |
| REQ-006 | Generated and document gates are fresh | Skill manifest freshness, catalog validation, Markdown link validation, and phase validation provide evidence |
| REQ-007 | Plugin card validation types are canonical | `validate_catalog_package.py --package mcp-tooling/mcp-obsidian` reports PASS with zero violations; the mcp-obsidian reference indexes show zero broken relative links in the Markdown link guard |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can find every feature card from the root catalog using the three surface directories.
- **SC-002**: Reference navigation uses descriptive headings only; no link or prose instruction depends on a decimal subheading.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Card moves break inbound links | Catalog or playbook navigation fails | Enumerate references before moving; run link validation after |
| Risk | Broad heading normalization changes meaning | Reference guidance becomes less precise | Remove only the numeric prefix; retain exact descriptive text |
| Risk | Stale generated manifest | Skill packaging gate fails | Regenerate leaf-manifest after all moves |
| Dependency | User-selected three-folder taxonomy | Path mapping must not drift | Use only `cli/`, `mcp/`, and existing `plugins/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
