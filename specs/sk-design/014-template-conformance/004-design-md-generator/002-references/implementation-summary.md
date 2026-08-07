---
title: "Implementation Summary: design-md-generator references/ conformance"
description: "Planning stub — fixes and the exemplar placement decision not yet applied."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit implementation-summary stub"
    next_safe_action: "Read all 10 root references files and the 4-vendor examples/ tree"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: design-md-generator references/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-references |
| **Status** | Planned — not yet fixed |
| **Completed** | Pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. This is a planning stub for two confirmed defect classes, a first-pass audit of six unsampled files, and one recorded-but-unexecuted placement decision for the vendor exemplar tree, all in `design-md-generator/references/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md` | Planned (Modify) | Fix `importance_tier` enum violation |
| `.opencode/skills/sk-design/design-md-generator/references/{quality-checklist,writing-style-guide,design-md-format}.md` | Planned (Modify) | Convert numbered H2s to ALL-CAPS |
| `.opencode/skills/sk-design/design-md-generator/references/{anti-patterns,authoring-boundary,color-role-taxonomy,component-taxonomy,guided-run,troubleshooting}.md` | Planned (Audit) | First full read against the template |
| `.opencode/skills/sk-design/design-md-generator/references/examples/**` | Planned (Decide + Modify) | Execute the relocate-or-exempt decision from `decision-record.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered — planning stub. Planned as two mechanical fixes, a template diff for the unsampled files, and a recorded architectural decision for the exemplar tree, verified by re-read plus `validate.sh`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the vendor exemplars as a placement decision, not a content-conformance fix | Rewriting `stripe/DESIGN.md` to add ALL-CAPS numbered H2s would destroy its value as a literal, unedited demonstration of the mode's output format |
| Full decision recorded in `decision-record.md`, not inline in this summary | The choice is genuinely architectural (where does generated-output documentation live relative to skill authoring docs) and deserves its own ADR, matching the program's guidance that a child only gets a decision-record when it makes a real architectural call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `importance_tier` fix re-read | Pending |
| H2-casing re-read (3 files) | Pending |
| 6-file template diff | Pending |
| Exemplar decision executed + cross-reference grep | Pending |
| `validate.sh` | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet started** — none of the fixes, the 6-file audit, or the exemplar decision has run yet.
<!-- /ANCHOR:limitations -->
