---
title: "Implementation Summary"
description: "README authors now have a rule for GitHub alerts and folded tables, and the validator blocks a fold that would hide the rest of a page."
trigger_phrases:
  - "readme html conventions implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/008-readme-html-conventions"
    last_updated_at: "2026-11-18T07:14:13Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the rule, the fold check and the four-file pilot, all gates green"
    next_safe_action: "Commit, merge origin/main and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-readme-html-conventions"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-readme-html-conventions |
| **Completed** | 2026-11-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A README can now flag a step that loses work with a GitHub alert, and tuck a long lookup table into a fold. The validator refuses a fold that GitHub would render wrong, so neither feature can quietly break a page.

### Phase 8: readme-html-conventions

The README writing reference gains an Alerts and Folded Tables subsection. An alert is for a step that loses work or breaks something, two at most a README. A fold is for a lookup table of 15 rows or more, with the section's opening sentence kept above it. The checklist carries one line for both.

`validate_document.py` now checks every `<details>` fold in every document type. A fold that never closes hides the rest of the page on GitHub, and a table right after the `<summary>` line shows as raw pipes, so both block. Four files carry the pilot: the hand-edit warnings in the Codex and Devin sync docs became alerts, and the Claude Code and Devin entry maps are folded.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md` | Modified | The alert and fold rule |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md` | Modified | One checklist line |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | The blocking fold check |
| `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py` | Modified | Three tests for the check |
| `.codex/SYNC.md`, `.devin/SYNC.md` | Modified | The hand-edit warning as an alert |
| `.claude/hooks/README.md`, `.devin/hooks/README.md` | Modified | The entry map folded |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A survey came first. No README used an alert, one used a fold, and a scan of every tracked `.md` file found 677 folds in 257 files with none broken outside `specs/`. A probe README with an unclosed fold printed `VALID`, which showed the gap. With the scan clean, the check could block on every document type without turning an existing file red.

The check landed with tests, then ran over all 64,445 tracked `.md` files and reported nothing. The pilot edits went through the validator, the voice scan, both README checkers and the link check. A bad path placed inside a fold still failed the reference checker, so the checkers read folded rows. GitHub's markdown API rendered the alert and the folded table, and showed a fold with no blank line after `<summary>` as raw pipes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The rule lives in `writing-patterns.md`, not in each template | Every README template points to that reference, so one rule reaches them all |
| A fold may hold a section's whole table when readers look one row up | Almost every long README table is its section's content. The line that matters is lookup against read-through, so a coverage matrix stays open |
| The check blocks on every document type | Changelogs fold the same way READMEs do, and the scan showed no current file breaks the shape |
| Only a tag alone on its line counts | Prose names `<details>` in inline code and examples show folds in fences. Neither is a fold |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probe with an unclosed fold | Before: `✅ VALID`, `Total issues: 0`. After: `❌ INVALID`, `[fold_unclosed]` |
| `validate_folds` over every tracked `.md` file | 64,445 files, 0 issues |
| `test_structure_validation.py` | `12 passed` |
| Four pilot files | `✅ VALID`, `hard blockers: 0`, ceiling 100/100 each. Both README checkers `pass=4 fail=0`. `readme_links.py` `0 problems` |
| Bad path inside the Claude Code fold | `check_readme_references.py` fails with `path does not exist`, and passes again once restored |
| `gh api markdown` | The SYNC render holds `markdown-alert-warning`. The hooks render holds `<details>`, `<summary>All 33 entries</summary>` and a 34-row table |
| `writing-patterns.md`, `quality-and-checklist.md` | `✅ VALID`. Voice ceilings 92 and 92, the same as before. The checklist's one hard blocker predates this phase |
| sk-doc `run-script-tests.sh` | 58 PASS, `all sk-doc script tests passed`, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS` |
| `check-markdown-links.cjs` | `0 broken markdown links` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only four files carry the pilot.** Other long lookup tables, such as the session readers file table and the Codex and Cursor entry maps, stay open until a rollout is chosen.
2. **The check does not judge whether a fold fits.** It catches a broken shape, not a fold around a table a reader needs to read through. That stays a review call against the rule.
<!-- /ANCHOR:limitations -->

---
