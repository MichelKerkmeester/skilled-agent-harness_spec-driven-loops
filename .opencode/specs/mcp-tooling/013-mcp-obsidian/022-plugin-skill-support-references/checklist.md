---
title: "Plugin skill support — references for charts, dataview, excalidraw, git, outliner, Minimal"
description: "Research the six newly installed artifacts and author per-plugin reference sets (index, data-model, workflows, troubleshooting) plus plugin-operation-logic rows."
trigger_phrases:
  - "plugin skill support references"
  - "charts dataview excalidraw git outliner minimal references"
  - "plugin reference sets"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/022-plugin-skill-support-references"
    last_updated_at: "2026-08-04T11:58:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/022-plugin-skill-support-references"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Plugin skill support — references for charts, dataview, excalidraw, git, outliner, Minimal

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required invariant | Cannot close the phase |
| **[P1]** | Required documentation and metadata check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-000 [P0] Baseline captured before mutation [evidence: existing iconic/health-md reference sets read as baseline; installed artifacts inventoried (versions 3.9.0/0.5.68/2.26.2/2.38.6/4.10.2/9.0.2)]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-001 [P0] Six reference sets exist with four files each [evidence: 24/24 files present across 6 sets (`ls` per set), all with version 1.5.0.0 frontmatter]
- [x] CHK-002 [P0] Zero decimal H3-H6 headings in the new references [evidence: rg decimal-heading grep clean (`rg -n` scan of the six folders)]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] plugin-operation-logic data map covers the six plugins [evidence: plugin-operation-logic.md data map has 11 rows including the six new artifacts (`rg -n` row count)]
- [x] CHK-004 [P1] All links in the new references resolve [evidence: `check-markdown-links.cjs` reports 0 broken links in mcp-obsidian]

<!-- /ANCHOR:testing -->

---

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-006 [P1] No known gaps remain between the phase docs and the executed artifacts [evidence: tasks T11..T31 checked (`tasks.md`); implementation-summary written]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] No vault content beyond the intended plugin files and enablement entries was modified [evidence: no vault content modified; extraction was read-only (`manifest.json`/`main.js` reads)]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-005 [P1] Unverifiable claims marked VERIFY, none invented [evidence: VERIFY markers used for unconfirmable details (settings keys absent from `main.js`)]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 [P1] All new files live inside the phase folder and the stated mode tree paths [evidence: all 24 files under `references/plugins/` per-set folders]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 4 | 0/4 |
| P1 items | 5 | 0/5 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->