---
title: "Implementation Summary"
description: "The changelog template now asks for the v4.0.2.1 layout, and the shape check passes that entry with no skipped rule."
trigger_phrases:
  - "release notes layout default implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/009-release-notes-layout-default"
    last_updated_at: "2026-11-17T16:57:21Z"
    last_updated_by: "template-author"
    recent_action: "Made the v4.0.2.1 layout the template default and taught the shape check its table"
    next_safe_action: "Rewrite the worked examples, then fix the old spec-folder lines"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-release-notes-layout-default"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-release-notes-layout-default |
| **Completed** | In progress (2026-11-17) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A changelog written from the template now reads like the v4.0.2.1 release notes. The shape check passes that entry as it stands, with every rule run and none skipped.

### The template describes the new layout

The template, SKILL.md and both `/create:changelog` workflows now ask for:
- an opening of lead sentences with short bullets
- an important box that lists every break
- a linked glance table and anchored items made of short bullets
- warning boxes, and folded blocks for detail
- one source line per paragraph

v4.0.2.1 is named as the layout model.

### The shape check reads the layout

The order rule reads the glance table's Section column. A spec-folder list folded in a closing `<details>` block still closes the entry. HTML tag lines no longer count as one-word sentences.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modified | The new default layout |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | Contract, rules and validation lists, version 1.6.0.0 |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Modified | Glance table, folded spec list, HTML lines |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` | Modified | Four tests for the checker changes |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modified | Format and checks |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modified | Format and checks |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.6.0.0.md` | Created | The skill's own entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase 8 checker was run on v4.0.2.1 and on every changelog first. The checker and tests changed next, and each new test was run against the phase 8 checker to see it fail. The docs followed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Change the checker, not v4.0.2.1 | Its two failures came from the new layout itself, and the published release would churn again |
| Keep the compact tier as short plain bullets | A table is heavier than a release of under 10 changes needs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Shape check on v4.0.2.1 | PASS with no note. Its mean is 9.37 words a sentence |
| Changelog tests | PASS: 47 passed, against a baseline of 39 passed and 1 failed |
| New tests on the phase 8 checker | 5 fail, the 4 new tests and the model-entry test |
| `hvr_scan.py` on the template and SKILL.md | 0 new hard blockers. SKILL.md keeps one semicolon it had before |
| Both workflow YAML files parse | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The worked examples still show the older layout.** Rewriting them is the next task.
2. **Old spec-folder lines are not fixed yet.** 5 entries have content after the line and 266 skill and release entries lack the `&nbsp;` line. Packet-local entries add 3 and 1,654.
<!-- /ANCHOR:limitations -->

---
