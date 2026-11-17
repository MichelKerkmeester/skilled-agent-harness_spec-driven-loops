---
title: "Implementation Summary"
description: "A changelog draft whose spec-folder line does not close the entry now fails the shape check, and the three changelog checklists name where the line sits."
trigger_phrases:
  - "spec line position gates implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/008-spec-line-position-gates"
    last_updated_at: "2026-11-17T16:54:33Z"
    last_updated_by: "generate-context"
    recent_action: "Added the spec-position rule and named the position in four docs"
    next_safe_action: "Run the commit and push for the spec-line position gates"
    packet_purpose: "Purpose: Every gate a changelog draft passes checks that the spec-folder line closes the entry."
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py"
      - ".skilled/skills/sk-doc/sk-create-changelog/SKILL.md"
      - ".skilled/commands/create/assets/create-changelog-auto.yaml"
      - ".skilled/commands/create/assets/create-changelog-confirm.yaml"
    session_dedup:
      fingerprint: "sha256:24bfcf4c6b6f5afb1cf765ff9cebab510f5df8448f52dc062c5c3024f2fd200c"
      session_id: "scaffold-008-spec-line-position-gates"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T16:54:33Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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
| **Spec Folder** | 008-spec-line-position-gates |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A changelog draft that keeps its spec-folder line under the summary used to pass every gate. It now fails the shape check, and every checklist a writer or reviewer follows says the line closes the entry.

### The spec-folder line has a checked place

The template already put the spec-folder line last, after an `&nbsp;` line. Now `check_changelog_shape.py` fails a draft when content follows the line or no `&nbsp;` line comes before it. An entry with one block per dated section may follow each block with the next section's heading. The SKILL.md checklist, both `/create:changelog` workflows and `PUBLIC-RELEASE.md` describe the same place.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Modified | Adds the `spec-position` rule |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` | Modified | Closes the fixture with the spec line and tests the rule |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | Names the position in validation items 4 and 11 |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modified | Names the position in the step 5 format check |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modified | Names the position in FORMAT CHECKS |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/README.md` | Modified | Lists the position in the shape gate's purpose |
| `PUBLIC-RELEASE.md` | Modified | Says an entry closes with its spec-folder line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The measured probe from `spec.md` was run before and after the rule. The shape-check tests ran on the new checker and on the old one, so each new test was seen to fail without the rule.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Let a block precede the next H2 only in an entry with several blocks | Spec-folder changelogs carry one block per dated section, and each block closes its own section |
| Pass extra test text through the fixture | Text appended after the fixture would land after the spec line and break the rule in tests about other rules |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Measured probe | PASS: was `PASS` with exit 0, now `FAIL` with two `[spec-position]` lines and exit 1 |
| Shape-check and validator tests | PASS: 39 passed, 1 failed. The failure is `test_the_model_entry_passes_every_rule`, which failed before this phase |
| Old checker against the new tests | PASS: the two new rule tests fail on it |
| `validate_document.py` on SKILL.md and the scripts README | PASS: 0 issues each |
| Both workflow YAML files parse | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The model-entry test still fails.** It reads v4.0.2.1, which lost its section tags and has content after its spec line. Fixing that entry was kept out of this phase.
2. **Old entries were not checked.** Five entries have content after the spec line and 1,876 lack the `&nbsp;` line. The shape check runs on drafts, so they keep working, but running it on them fails.
<!-- /ANCHOR:limitations -->

---


