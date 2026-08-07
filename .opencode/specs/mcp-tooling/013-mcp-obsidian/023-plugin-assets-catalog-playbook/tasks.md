---
title: "Plugin assets, catalog cards, and playbook scenarios for the six additions"
description: "Author example assets, six feature-catalog plugin cards, and manual-testing-playbook tie-in scenarios for charts, dataview, excalidraw, git, outliner, Minimal."
trigger_phrases:
  - "plugin assets catalog playbook"
  - "charts dataview excalidraw git outliner minimal catalog"
  - "plugin tie in scenarios"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/023-plugin-assets-catalog-playbook"
    last_updated_at: "2026-08-04T11:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/023-plugin-assets-catalog-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Plugin assets, catalog cards, and playbook scenarios for the six additions

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001-T00N; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T11 [P] Inventory the six reference sets for asset shapes and the existing card/playbook pattern [evidence: Six reference sets read as asset shape sources; iconic card + iconic-rules scenario used as exemplars]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T21 Author example assets for all six plugins [evidence: 11 assets authored across 6 sets (charts-block, dataview-query/metadata, drawing-note + scene, git-settings/commands, outliner-settings x2, minimal-activation/snippet); JSON examples parse, md examples carry version]
- [x] T22 Add six feature-catalog plugin cards and update root counts [evidence: 6 cards added (charts/dataview/excalidraw/git/outliner/minimal); root catalog count updated 25 to 31; plugins category 5 to 11]
- [x] T23 Add six playbook tie-in scenarios (OBS-016..OBS-021) [evidence: 6 scenarios added OBS-016..OBS-021 with throwaway-vault discipline; playbook index rows + range updated to OBS-011..OBS-021]
- [x] T24 Update README plugin knowledge layer and changelog [evidence: README plugin knowledge layer + FAQ extended to 11 artifacts; changelog v1.5.0.0 written]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T31 [P] Package validator, link guard, heading grep, card taxonomy [evidence: validate_catalog_package.py PASS 0 violations; check-markdown-links 0 broken in mcp-obsidian; heading grep clean; card taxonomy canonical]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Author copyable example assets under `assets/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` (charts block example, dataview query example, excalidraw `.excalidraw.md` skeleton, obsidian-git config example, outliner list example, Minimal snippet example), add six feature-catalog plugin cards under `feature-catalog/plugins/` with canonical taxonomy types, add manual-testing-playbook tie-in scenarios (OBS-016..OBS-021) under `manual-testing-playbook/plugin-tie-ins/`, update the root catalog counts and the README plugin knowledge layer, and write the changelog entry.

---

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->