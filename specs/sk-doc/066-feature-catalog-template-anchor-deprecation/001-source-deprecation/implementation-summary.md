---
title: "Implementation Summary"
description: "New feature catalog files no longer get a template-name comment under their heading, because the scaffolds and checklist that put it there no longer carry it."
trigger_phrases:
  - "source deprecation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/001-source-deprecation"
    last_updated_at: "2026-10-10T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Removed the marker from the mode templates and bumped the mode"
    next_safe_action: "Run phase 2, the retroactive sweep"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md"
      - ".skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-source-deprecation |
| **Completed** | 2026-10-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

New feature catalog files now go straight from their H1 to `## 1. OVERVIEW`. The `<!-- sk-doc-template: skill_asset_feature_catalog -->` line that every catalog carried came from the mode's own scaffolds, and nothing in the repository ever read it.

### Phase 1: source-deprecation

The marker had one producer: the per-feature scaffold in both feature catalog assets, which commit `7d7650471d` introduced while stamping 588 snippets in the same sweep. The snippet checklist then asked authors to confirm it was present. The other create-* modes never had a marker in their templates, which is why only feature catalogs carried one everywhere. You now get a scaffold without it, a checklist that no longer asks for it and worked examples that show the heading on its own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | Modified | Scaffold no longer emits the marker |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | Modified | Scaffold and checklist no longer carry it |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/references/examples.md` | Modified | Worked examples match the scaffold |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md` | Modified | Version 1.0.2.0 |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/changelog/v1.0.2.0.md` | Created | Changelog entry |
| `.hermes/skills/sk-create-feature-catalog/SKILL.md` | Modified | Regenerated copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A census of every `sk-doc-template:` value and a reader inventory over code and config came first. The edits then removed the marker at its producer, and the generator refreshed the Hermes copy. Each edited file was validated, and the mode's fixture tests ran before the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the marker rather than keep it as an optional field | Nothing reads it, so any compatibility path would serve no caller |
| Bump the mode as a patch (1.0.2.0) | The scaffold changed shape without breaking anything that consumes catalogs |
| Leave the other stray `sk-doc-template:` comments alone | No template emits them and the request names only the feature catalog anchor |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -rn 'sk-doc-template' <mode> --exclude-dir=changelog` | PASS, no match |
| `validate_document.py` on five edited files | PASS, each exit 0 with 0 issues |
| `test_validator_fixtures.py` | PASS, ALL PASS |
| `sync-skills-hermes.cjs --check` | PASS, 70 copies in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Existing catalogs still carry the marker after this phase.** Phase 2 removes every copy.
<!-- /ANCHOR:limitations -->

---
