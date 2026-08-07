---
title: "Relocation Map: Phase 4 — onboard implement"
description: "Audit table for the 128-file sk-code content relocation split across shared and mode-packet destinations."
trigger_phrases:
  - "sk-code relocation map"
  - "sk-code onboard implement map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/004-onboard-implement"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented the phase 004 relocation split map"
    next_safe_action: "Proceed to 005 foldin-review to fold sk-code-review into code-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Relocation Map: Phase 4 — onboard implement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## Summary

Phase 004 moved 128 files from the flat top-level `references/`, `assets/`, and `scripts/` directories into the parent-hub packet layout. All moves used `git mv` so history is preserved. `benchmark/` and `manual_testing_playbook/` intentionally stayed at the hub as routing-level test artifacts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:audit-table -->
## Audit Table

| Destination | Source Sub-Trees Moved There | File Count |
|-------------|-------------------------------|------------|
| `shared/` | Surface detection and routing (`stack_detection`, `smart_routing`, `phase_detection`); universal cross-cutting rules; surface-shared rule sets renamed from `webflow/shared` to `shared/references/webflow-shared` and from `opencode/shared` to `shared/references/opencode-shared`; universal asset patterns | 17 |
| `code-implement/` | Webflow and opencode authoring reference trees including CSS, HTML, JavaScript style, quick-reference, `quality_standards`, implementation, deployment, and performance; motion.dev references; build assets including webflow patterns, integrations, templates, scripts, motion.dev snippets, and opencode recipes | 82 |
| `code-quality/` | Comment-hygiene scripts and hooks; dist-staleness scripts and hooks; opencode authoring and language checklists; code-quality checklist | 16 |
| `code-verify/` | Webflow verification references renamed from `webflow/verification` to `webflow-verification`; alignment and stack-folder verification scripts; verification checklists | 9 |
| `code-debug/` | Webflow debugging references renamed from `webflow/debugging` to `webflow-debugging`; debug checklists | 4 |
<!-- /ANCHOR:audit-table -->

---

<!-- ANCHOR:renamed-dirs -->
## Renamed Directories

| Original Sub-Tree | New Sub-Tree |
|-------------------|--------------|
| `opencode/shared` | `opencode-shared` |
| `webflow/shared` | `webflow-shared` |
| `webflow/verification` | `webflow-verification` |
| `webflow/debugging` | `webflow-debugging` |
<!-- /ANCHOR:renamed-dirs -->

---

<!-- ANCHOR:verification -->
## Verification Notes

- All 128 moves were tracked by git as renames.
- Deterministic repair fixed 111 links across 43 files.
- Full markdown link-resolution reports zero broken content links.
- `changelog/` and `benchmark/` were excluded from repointing because they are historical records that intentionally cite the old paths.
<!-- /ANCHOR:verification -->
