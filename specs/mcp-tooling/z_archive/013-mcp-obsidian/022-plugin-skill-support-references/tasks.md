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
    last_updated_at: "2026-08-04T11:55:00Z"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Plugin skill support — references for charts, dataview, excalidraw, git, outliner, Minimal

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001-T00N; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T11 [P] Inventory the six artifacts (repos, releases, manifests, READMEs) and the existing reference-set pattern [evidence: Installed artifacts inventoried from all three vaults: charts 3.9.0, dataview 0.5.68, excalidraw 2.26.2, git 2.38.6, outliner 4.10.2, Minimal 9.0.2; iconic/health-md pattern read]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T21 Author charts reference set (block syntax, data sources, render contract) [evidence: charts reference set authored: charts.md/data-model.md/workflows.md/troubleshooting.md (v1.5.0.0); block languages `chart` YAML + `advanced-chart` JSON verified against installed bundle]
- [x] T22 Author dataview reference set (DQL, metadata model, query blocks) [evidence: dataview reference set authored (v1.5.0.0); DQL/metadata model grounded in manifest 0.5.68 + main.js defaults]
- [x] T23 Author excalidraw reference set (`.excalidraw.md` wrapper, embedded JSON, script file layer) [evidence: excalidraw reference set authored (v1.5.0.0); .excalidraw.md wrapper + embedded JSON documented]
- [x] T24 Author obsidian-git reference set (vault git semantics, config file, command file layer) [evidence: obsidian-git reference set authored (v1.5.0.0); vault git semantics + settings keys from main.js]
- [x] T25 Author outliner reference set (list semantics, indentation model) [evidence: outliner reference set authored (v1.5.0.0); editor-behavior contract, no note format]
- [x] T26 Author Minimal reference set (theme file layer, snippets, cssTheme) [evidence: Minimal reference set authored (v1.5.0.0); theme file layer, cssTheme, snippets boundary]
- [x] T27 Extend plugin-operation-logic data map with the six rows [evidence: plugin-operation-logic.md data map extended from 5 to 11 rows (charts, dataview, excalidraw, git, outliner, minimal)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T31 [P] Grep banned fence/keys, zero decimal headings, link integrity, version fields present [evidence: grep gates: zero banned fences/keys, zero decimal headings, all 24 files carry version frontmatter; links checked]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Research each artifact from its GitHub repo, README, manifest, and release facts (charts block syntax; dataview DQL and metadata model; excalidraw `.excalidraw.md` embedded JSON; obsidian-git config + vault git semantics; outliner list-indentation model; Minimal theme file layer), then author per-plugin reference sets under `references/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` mirroring the existing iconic/health-md pattern (index, data-model, workflows, troubleshooting with frontmatter + version), and extend `references/plugins/plugin-operation-logic.md` data map with the six rows.

---

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->