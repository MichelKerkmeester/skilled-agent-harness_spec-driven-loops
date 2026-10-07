---
title: "Spec — mcp-obsidian feature-catalog divider conformance"
description: "Add the missing Style-A section dividers to the 11 plugin feature-catalog leaves so they match the sibling cli/ and mcp/ leaves and the repo-wide catalog convention."
trigger_phrases:
  - "feature-catalog divider conformance"
  - "style-a section dividers"
  - "mcp-obsidian catalog leaves"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/z_archive/013-mcp-obsidian/029-feature-catalog-divider-conformance"
    last_updated_at: "2026-10-07T00:00:00Z"
    last_updated_by: "packet-reconstruction"
    recent_action: "No continuity update was recorded"
    next_safe_action: "None, the packet is archived"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-reconstruction"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec — mcp-obsidian feature-catalog divider conformance

<!-- ANCHOR:metadata -->
## Status

- **Level:** 1
- **State:** complete
- **Type:** Documentation conformance (skill catalog docs only; no runtime code)

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## Purpose

Add the missing Style-A section dividers to the 11 plugin feature-catalog leaves so they match the sibling `cli/` and `mcp/` leaves and the repo-wide catalog convention. They were the only catalog files in the skill without them.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## Scope

- **`feature-catalog/plugins/*.md` (11 files)** — insert a `---` divider before every numbered H2 after `## 1.` (matching the `cli/`/`mcp/` sibling layout: between each numbered section, none after the intro, none between `###` H3s).
- Version bump + changelog.
- **Out of scope:** the `cli/` (14) and `mcp/` (6) leaves and the `feature-catalog.md` index (already conformant); any catalog *content*.

<!-- /ANCHOR:scope -->

## Root cause

`validate_document.py` classifies these as the `feature_catalog` doc type, whose contract does not require section dividers (`requiredSections: []`, no divider rule) — so they validated with 0 issues despite the gap, and the earlier reference/asset conformance pass (026) did not cover `feature-catalog/`.

<!-- ANCHOR:success-criteria -->
## Acceptance criteria

- AC1: every `plugins/*.md` leaf has 3 body dividers (matching the `cli/`/`mcp/` siblings) and still passes `validate_document.py` (0 issues).
- AC2: the change is exclusively `---` + blank-line insertions — 0 content/table/code lines altered.
- AC3: the inserter is idempotent (a re-run adds 0) and code-fence aware.

<!-- /ANCHOR:success-criteria -->

## Outcome

All met. Shipped to v4. 33 dividers across 11 files, additive-only, all validate clean. Details in `implementation-summary.md`.
