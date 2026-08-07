---
title: "Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal"
description: "Install and enable six Obsidian community plugins plus the Minimal theme across all three vaults, with recorded versions."
trigger_phrases:
  - "plugin installation batch"
  - "charts dataview excalidraw git outliner minimal install"
  - "minimal theme install"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/021-plugin-installation-batch"
    last_updated_at: "2026-08-04T11:58:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-plugin-installation-batch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal

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

- [x] CHK-000 [P0] Baseline captured before mutation [evidence: vault `.obsidian` trees and release asset lists inventoried first]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-001 [P0] All five plugins present in all three vaults with main.js + manifest.json [evidence: verify loop `OK` 5/5 per vault]
- [x] CHK-002 [P0] Minimal theme present with theme.css in all three vaults [evidence: `Minimal/theme.css` (264778 bytes) in each vault]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] community-plugins.json parses and contains the five new ids plus all prior ids [evidence: 11 entries per vault; diff vs `.bak.20260804` shows 0 lost]
- [x] CHK-004 [P1] appearance.json keeps prior keys and sets cssTheme to Minimal [evidence: `cssTheme=Minimal` set; prior keys preserved]

<!-- /ANCHOR:testing -->

---

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-006 [P1] No known gaps remain between the phase docs and the executed artifacts [evidence: tasks T11/T21/T22/T31 checked with evidence (`tasks.md` scan); implementation-summary written]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] No vault content beyond the intended plugin files and enablement entries was modified [evidence: only .obsidian/plugins/*, community-plugins.json, appearance.json changed; config `.bak.20260804` backups verify prior state]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-005 [P1] Installed versions recorded per vault in evidence [evidence: installed versions per vault recorded from `manifest.json` reads in tasks T22 evidence]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 [P1] All new files live inside the phase folder and the stated mode tree paths [evidence: writes confined to vault `.obsidian` trees and the phase folder (`git status` review)]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 3 | 3/3 |
| P1 items | 2 | 2/2 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->