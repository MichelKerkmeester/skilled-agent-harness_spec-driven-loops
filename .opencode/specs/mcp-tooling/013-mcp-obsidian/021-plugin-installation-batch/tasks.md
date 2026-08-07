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
    last_updated_at: "2026-08-04T11:55:00Z"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001-T00N; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T11 [P] Inventory the three vault `.obsidian` trees and the six GitHub releases (asset names via API) [evidence: `main.js`/`manifest.json`/`styles.css` confirmed in all six releases; vault trees enumerated]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T21 Fetch and write the five plugins into all three vaults; fetch and write the Minimal theme; enable ids in `community-plugins.json`; set `cssTheme` in `appearance.json` [evidence: 5/5 plugins + Minimal theme present in all 3 vaults; `community-plugins.json` 11 entries each; `cssTheme=Minimal`; `.bak.20260804` backups taken]
- [x] T22 Record installed versions per vault from `manifest.json` [evidence: charts 3.9.0, dataview 0.5.70 tag (manifest 0.5.68), excalidraw 2.26.2, git 2.38.6, outliner 4.10.2, Minimal 9.0.2]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T31 [P] Verify `main.js`/`theme.css` presence per vault, `community-plugins.json` parse + ids, `appearance.json` diff; run `git diff --check` [evidence: 3/3 vaults verify: main.js present for all five plugins, Minimal theme.css present, community-plugins.json parses with 11 ids incl. all five new ids, cssTheme=Minimal; `git diff --check` clean]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Install the latest release of obsidian-charts (phibr0/obsidian-charts), dataview (blacksmithgu/obsidian-dataview), excalidraw (zsviczian/obsidian-excalidraw-plugin), obsidian-git (Vinzent03/obsidian-git), outliner (vslinko/obsidian-outliner) and the Minimal theme (kepano/obsidian-minimal) into all three vaults (main, iCloud Michel Kerkmeester, Barter): fetch release assets via the GitHub API, write plugin files under `<vault>/.obsidian/plugins/<id>/` and theme files under `<vault>/.obsidian/themes/Minimal/`, append plugin ids to `community-plugins.json`, set `cssTheme: Minimal` in `appearance.json`, and record every installed version as evidence for the reference phases.

---

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->