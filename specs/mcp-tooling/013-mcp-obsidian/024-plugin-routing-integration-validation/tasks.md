---
title: "Plugin routing integration and validation for the six additions"
description: "Wire the six plugins into the SKILL.md router and resource map, refresh hub metadata, and validate the file-layer contract live with throwaway-vault discipline."
trigger_phrases:
  - "plugin routing integration"
  - "charts dataview excalidraw git outliner minimal routing"
  - "plugin validation closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/024-plugin-routing-integration-validation"
    last_updated_at: "2026-08-04T11:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/024-plugin-routing-integration-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Plugin routing integration and validation for the six additions

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001-T00N; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T11 [P] Inventory router surfaces (INTENT_SIGNALS, RESOURCE_MAP, keywords) and the new reference sets [evidence: SKILL.md INTENT_SIGNALS/RESOURCE_MAP/specific_plugin_intents inventoried (9 intents); six new reference sets verified on disk]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T21 Add the six plugin intents and resource-map entries to SKILL.md [evidence: 6 intents added to INTENT_SIGNALS + RESOURCE_MAP + specific_plugin_intents tuple; keywords comment + description + intro updated; version 1.4.1.0 to 1.5.0.0]
- [x] T22 Regenerate leaf manifest and hub metadata [evidence: leaf-manifest regenerated f57e497b; mode-registry aliases +19 terms; hub-router vocabularyClasses +6 (24 total) with keyword definitions]
- [x] T23 Run live file-layer validation per plugin on a throwaway vault [evidence: live spot-checks pass: excalidraw embedded JSON parse, charts YAML block contract, git throwaway roundtrip, minimal cssTheme layer; scenario files carry per-plugin evidence]
- [x] T24 Write implementation summaries for 021-024 [evidence: implementation summaries written for 021-024]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T31 [P] validate.sh on all four phases, link guard, metadata regen [evidence: validate.sh all four phases Errors 0; metadata regenerated; parent phase map rows 21-24 updated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Extend `SKILL.md` with six plugin intents (PLUGIN_CHARTS, PLUGIN_DATAVIEW, PLUGIN_EXCALIDRAW, PLUGIN_GIT, PLUGIN_OUTLINER, PLUGIN_MINIMAL) in INTENT_SIGNALS + RESOURCE_MAP + keywords + resource map comments, load the new reference sets on demand, regenerate the mcp-tooling leaf manifest and hub metadata, run at least one live file-layer validation per plugin against a throwaway vault (never the real vaults), verify routing via the advisor/hub surfaces where warm, and close out phases 021-024 with implementation summaries, metadata regeneration, and validate.sh.

---

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->