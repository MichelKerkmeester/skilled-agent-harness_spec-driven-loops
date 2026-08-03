---
title: "Implementation Plan — Phase 18 — catalog and reference topology simplification"
description: "Move feature cards into cli, mcp, and plugins; remove decimal reference subheadings; validate all links and generated metadata."
trigger_phrases:
  - "phase 18 plan"
  - "catalog topology migration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/018-catalog-reference-topology"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 18 implementation plan"
    next_safe_action: "Execute the approved move map"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — Phase 18 — catalog and reference topology simplification

<!-- ANCHOR:summary -->
## 1. SUMMARY

Apply the approved compact catalog structure: 14 CLI cards under `cli/`, 6 MCP cards under `mcp/`, and 5 plugin cards under `plugins/`. Normalize the 26 decimal H3–H6 reference headings without changing their descriptive labels, repair links, regenerate the mcp-tooling leaf manifest, and validate. Rollback is a git revert restoring every prior path and link.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Card preservation | 14 CLI + 6 MCP + 5 plugin Markdown cards after move | find + Python count |
| Link integrity | Root catalog and all inbound moved-card links resolve | Markdown link validator + targeted grep |
| Heading normalization | No decimal H3–H6 forms remain in references | rg |
| Content preservation | Only heading prefixes/path metadata change in reference/card docs | git diff review |
| Skill packaging | mcp-tooling leaf manifest fresh | ci-skill-root-metadata |
| Phase docs | Phase validation has no errors | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Previous location | Destination | Card count |
|-------------------|-------------|-----------:|
| `notesmd-cli-*` + `obsidian-cli-*` folders | `feature-catalog/cli/` | 14 |
| `mcp-{high,medium,low}-priority/` | `feature-catalog/mcp/` | 6 |
| `plugins/` | `feature-catalog/plugins/` | 5 |

The root catalog remains the display-order authority. Card filenames stay stable; only their category directory changes. Decimal subheadings become descriptive H3/H4 headings; H2 section numbering stays intact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Capture move map, inbound links, numbered-heading inventory, and baseline counts |
| Migration | Move cards, update root/inbound links and canonical paths, remove decimal heading prefixes |
| Verification | Run counts, link checks, manifest generation, catalog validation, and phase validation |

Sequenced in tasks.md (T001–T007).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation topology test: all 25 cards survive, all root and playbook references resolve, and the catalog package validator accepts the three-directory layout. Formatting test: the decimal-heading grep returns zero and the single numeric prose cross-reference is rewritten descriptively. No vault or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| `sk-create-feature-catalog` package contract | Three folders could violate catalog rules | Retain descriptive kebab-case categories and the root inventory |
| Existing card links | Moves create dangling paths | Map before move; validate after move |
| Existing leaf manifest | New paths remain stale | Regenerate through the required skill-root gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the migration commit to restore the original 14 directories, original links, headings, and manifest. No user vault content or plugin settings participates in the migration.
<!-- /ANCHOR:rollback -->
