---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/005-provenance-title-sweep"
    last_updated_at: "2026-09-07T21:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 006"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0530105964aac7ab42317af48a9fa57807e22a7d69583fbabdcbd0ed98b9e75f"
      session_id: "scaffold-005-provenance-title-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-provenance-title-sweep |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The templates' `[template:level-N/doc]` provenance token had survived into the titles of every document scaffolded before child 018 taught the scaffolder to strip it. This sweep removed the token from 767 titles across 250 packets, every one outside the four packet groups other sessions own, and regenerated each packet's description and graph metadata twice so their fingerprints match. The placeholder rule gains the third class child 018 had to revert: a `[template:` token on a title line is now a hard placeholder, scoped to title lines because that is the only place a scaffold ever carried it. A fixture that carries the token proves the class in the extended suite, and the three valid fixtures no longer carry it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 767 spec documents in 250 packets | Modified | Title token stripped |
| `description.json` and `graph-metadata.json` in 241 packets | Regenerated | Fingerprints that match |
| `runtime/cli/rules/check-placeholders.sh` | Modified | Third class, title-scoped |
| `runtime/cli/test-fixtures/073-template-provenance-title/` | Created | A fixture carrying the token |
| `runtime/cli/test-fixtures/{002,003,004,055-063}-*/` | Modified | Titles stripped |
| `runtime/cli/tests/test-validation-extended.sh` | Modified | The isolated case for the class |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A script stripped the token from title lines only, first over the packet tree and then over the hidden backup directories a glob skips; the packet list it produced drove a background regeneration of every touched packet. The first list had reached vendored copies and scratch backups inside archived packets and the never-touched fixture, and every change there was reverted before anything ran. The rule class and its fixture shipped together with the sweep so the corpus never sat in a state the rule would fail. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope the rule class to title lines | The token never lived anywhere else in a scaffold; a body mention in a transcript is not a placeholder |
| Revert the vendored copies and backups | They are not packet documents; changing them would have been noise in 383 files |
| Leave quoted transcripts alone | Research and review logs quote the old titles as evidence |
| Ship the sweep and the rule in one commit | Either alone leaves the corpus failing the other |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Title grep over real packets outside the excluded groups | 0 |
| Titles stripped, metadata regenerated | 767 documents, 482 metadata files, 250 packets |
| Validation lane with the new fixture case | 98, 31 and 84 checks pass; the token case fails the fixture as expected |
| Goldens and registry coverage; progressive validation | 10 and 50 tests pass |
| `npm run check` | passes |
| Full runtime and CLI projects | the runtime project passes 104 files and 1,260 tests and the CLI project 140 files and 1,361 tests, including the new fixture |
| Strict sample of twelve regenerated packets | 6 pass; 6 fail on ANCHORS_VALID, SCAFFOLD_NEVER_TOUCHED and archive-copy rules that predate the sweep |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vendored copies and scratch backups inside archived packets keep the token** They are not packet documents and the rule never scans them.
2. **Some regenerated packets fail strict on older rules** Anchors, scaffold signatures and archive-copy paths; none is a title.
<!-- /ANCHOR:limitations -->

---
