---
title: "Implementation Summary: v4 changelog in the root README voice"
description: "The v4 changelog rewritten into benefit-led bullets and short paragraphs, four counts corrected against the tree, and the jev and orca arrivals surfaced in the glance list without a single other fact moving."
trigger_phrases:
  - "v4 changelog voice summary"
  - "changelog rewrite evidence"
  - "census and hvr results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/045-v4-changelog-voice-rewrite"
    last_updated_at: "2026-09-21T00:00:00Z"
    last_updated_by: "pi"
    recent_action: "Rewrote the changelog into the root README's voice and recorded the evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - "../CHANGELOG-v4.0.0.0.md"
    session_dedup:
      fingerprint: "sha256:5c3848494cfc7a98d7c69e7763eb2aed5d81000caa8452b46d5cfac606a9f770"
      session_id: "2026-09-21-v4-changelog-voice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: v4 changelog in the root README voice

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-v4-changelog-voice-rewrite |
| **Completed** | 2026-09-21 |
| **Level** | 1 |
| **Status** | Complete |
| **Shipped As** | One commit on `skilled/v4.0.0.0` and `main`, carrying the rewrite and this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` now reads the way the root README's §8 reads. Every long paragraph became benefit-led bullets or a short paragraph, four counts the tree contradicts were corrected, and the two late-cycle skill moves reached the glance list where a reader skims first.

### What the reader gains

The document asks less of its reader at no cost to its accuracy. A paragraph that stacked nine sentences and 1,437 characters (the rules-corpus passage) is now a lead line, four labelled bullets and two short paragraphs, and the other 41 long paragraphs in the body took the same treatment. The census that counted them now counts none.

Four numbers changed, each measured from the thing it describes:

- Seven hubs route to modes, not six: seven skill directories carry both `hub-router.json` and `mode-registry.json`
- `mcp-tooling` holds nine modes, not ten, at both places the document names the count: `.skilled/skills/mcp-tooling/mode-registry.json` lists nine
- Six hubs resolve the compiled router contract first, not five: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/` holds six entries

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../CHANGELOG-v4.0.0.0.md` | Modified | Voice rewrite, four count corrections, two glance bullets |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | The packet and its evidence |
| `../spec.md` | Modified | Phase map row 45 and its handoff row |
| `../timeline.md` | Modified | Milestone for this packet |
| `scratch/changelog-prose-audit.py`, `scratch/rewrite-changelog.py`, `scratch/facts-before.json`, `scratch/facts-after.json` | Created | The census, the rewrite and the before-and-after fact extraction |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rewrite ran as a script against the anchored copy rather than as a hand edit, so every line the rewrite did not target stayed byte for byte identical and the fact diff is meaningful. The script refuses to write unless the file still hashes to the copy the line numbers came from, and it refuses unless the heading and separator counts match before and after. Both guards held.

The census and the human-voice scan ran before the edit to fix the baseline and after it to prove the change. The fact extraction pulls every backtick span, every seven-plus hex token, every numeral, every number word, every heading and every table row from the pre-rewrite copy and from the working copy, then diffs the two as multisets.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite by line-numbered script instead of hand edits | Every untouched line stays identical by construction, so the extraction diff isolates what actually changed |
| Keep the bullet lists and the table rows untouched | They were already in the target shape, and splitting them would have risked facts for no readability gain |
| Correct only the four enumerated counts | Each was measured from its own source, and a wider sweep would have moved facts the evidence did not cover |
| Leave the closing list's prose alone | Its measurements are the section's record, and the plan froze its facts |
| Split the one body-length paragraph the census caught beyond the range the plan named | The census defines a wall by measurement rather than by line number, so leaving it would have failed the gate the plan set |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Wall census, `sentences > 4 OR chars > 500` | PASS: 42 in the body and 43 over the whole file before, 0 after |
| Human voice scan | PASS: hard blockers 3 to 0, hard word blockers 0 both times, mechanical ceiling 63 to 78 |
| Semicolon sweep excluding `&nbsp;` entities | PASS: 3 prose occurrences before, 0 after, the 44 entities untouched |
| Skeleton counts, `^## ` / `^#### ` / `^---$` / `^&nbsp;$` | PASS: 18 / 56 / 19 / 44 before and after |
| Fact extraction diff | PASS: backticks 0 removed and 6 added (the two new bullets), hex identical, numerals identical, headings identical, table rows identical, number words limited to the four corrections and the new bullets |
| Ground truth for the four corrections | PASS: 7 hub directories, 9 `mcp-tooling` modes, 6 activation-cohort entries |
| `validate.sh 045-v4-changelog-voice-rewrite --strict` | PASS: `RESULT: PASSED` |
| `validate.sh 033-system-speckit-v4 --strict` | PASS: `RESULT: PASSED` |
| `validate.sh --recursive --strict` | 45 of 46 PASSED, with the pre-existing `030` goal-slice failure (`goal.md` durable slice over 4,000 characters) unchanged and outside this packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The closing list's bullets stay long.** The census measures paragraphs, not list items, and those bullets are the section's record, so they were left as written.
2. **One summarizing count is new prose.** The completion-gate paragraph now opens with "It grew two checks of its own", a count the two following sentences name. It is a restatement, not a new fact, and the extraction diff shows it as the only number word added outside the corrections and the two bullets.
<!-- /ANCHOR:limitations -->

---
