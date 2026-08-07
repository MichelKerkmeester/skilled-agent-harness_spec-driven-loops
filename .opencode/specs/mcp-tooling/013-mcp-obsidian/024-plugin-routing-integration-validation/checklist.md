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
    last_updated_at: "2026-08-04T11:58:00Z"
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
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Plugin routing integration and validation for the six additions

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

- [x] CHK-000 [P0] Baseline captured before mutation [evidence: SKILL.md router inventoried: 9 intents (`INTENT_SIGNALS`), 8 `RESOURCE_MAP` entries]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-001 [P0] Six intents present in SKILL.md router with resolving reference lists [evidence: 6 intents in `INTENT_SIGNALS`+`RESOURCE_MAP`+specific list; 14 keyword hits (`rg -c` on SKILL.md)]
- [x] CHK-002 [P0] Leaf manifest regenerated and fresh [evidence: leaf-manifest.json regenerated `f57e497bae8b`; mode-registry +19 aliases; hub-router 24 classes]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] Live validation evidence per plugin recorded [evidence: live evidence: excalidraw JSON parse OK, charts YAML block OK, git roundtrip OK, minimal cssTheme OK (`/tmp/_pbtest-*` runs)]
- [x] CHK-004 [P1] Implementation summaries for 021-024 exist [evidence: implementation-summary.md exists for `021`, `022`, `023`, `024`]

<!-- /ANCHOR:testing -->

---

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-006 [P1] No known gaps remain between the phase docs and the executed artifacts [evidence: all tasks/checklist items checked with evidence (`tasks.md`/`checklist.md`); parent phase map rows updated]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] No vault content beyond the intended plugin files and enablement entries was modified [evidence: spot-checks used `/tmp/_pbtest-*` throwaways only; real vaults untouched]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-005 [P1] validate.sh errors zero across the four phases [evidence: `validate.sh` errors zero on all four phases]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 [P1] All new files live inside the phase folder and the stated mode tree paths [evidence: all writes inside mcp-obsidian mode tree + hub metadata + phase folders]
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