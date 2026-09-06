---
title: "Implementation Summary: readme human voice"
description: "What shipped, what it cost, and what the gates could not have told anyone."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/010-readme-human-voice"
    last_updated_at: "2026-09-06T17:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the phase and verified it"
    next_safe_action: "None open for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-readme-human-voice |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

909 prose em-dashes removed from 147 authored READMEs, replaced by the punctuation each sentence
actually wanted.

### The rule was already written down

The Human Voice Rules carry an Em Dash Ban: never use one, prefer a comma, full stop or colon. The
rules also name em-dashes as the clearest tell of machine-written prose. The rule existed and nothing
enforced it, so 1,446 of them sat across the repository's READMEs.

### What was in scope, and what was not

| Bucket | Count | Disposition |
|--------|-------|-------------|
| Authored READMEs under `.opencode/` and the root | 909 | Swept |
| Vendored copies of external projects | 377 | Left; rewriting someone else's prose is not a voice fix |
| Historical spec records | 153 | Left; they describe what was written then |
| Whole-cell table dashes | 88 | Left; a not-applicable glyph, not punctuation |
| Inside fenced code blocks | 13 | Left; not prose |

### The first attempt was wrong and was reverted whole

A blanket comma after every dash reads as a comma splice wherever the following clause can stand
alone. Two follow-up passes tried to repair that and each made it worse, because neither could
distinguish its own edits from prose that had always been there. Reverting all 146 files and sweeping
once with the corrected rule was cheaper than auditing what three layered passes had done.

The rule that worked: a colon after a bulleted label or before a clause that can stand alone, a comma
for a short appositive, a full stop where the continuation was already sentence-shaped, and paired
dashes become paired commas.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/**/README.md` and `README.md` | Modified (147) | 689 lines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Classify, bucket, transform, audit. The audit is the part that matters: every changed line was
compared against `HEAD` to confirm it had carried an em-dash and that no comma splice was introduced.
Three sentences wrap across lines with the dash at the end, which a line-based pass cannot see; they
were found by scanning for a trailing dash and fixed by hand.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replace by sentence shape, not one substitution | A blanket comma produces splices, which the same rules reject |
| Revert the failed sweep whole rather than patch it | Each repair pass compounded the previous one's damage |
| Leave vendored and historical text | Rewriting a copy of someone else's project, or a record of what was written then, is not a voice fix |
| Leave whole-cell dashes | They mean not-applicable; a comma there destroys the meaning |
| Name the semicolons rather than sweep them | 835 of them are also hard blockers, under a rule this request did not name |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Measure | Before | After |
|---------|--------|-------|
| Prose em-dashes, authored set | 909 | 0 |
| Comma splices introduced | n/a | 0 |
| Edits to lines carrying no em-dash | n/a | 0 |
| Whole-cell glyphs preserved | 88 | 88 |
| Code-block dashes preserved | 13 | 13 |
| `hvr_scan.py` on the root README | `x19 punctuation —`, 84 hard blockers | finding absent, 65 hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **835 semicolons remain, and the same scanner calls them hard blockers.** They are a different HVR
   rule. This request named em-dashes, so they are reported rather than swept.
2. **A replacement that reads worse than the dash is not detectable by any gate.** The diff was read
   on the heaviest files and sampled elsewhere; a stiff sentence somewhere in the tail is possible.
3. **Only READMEs were swept.** The same ban applies to every authored document in the repository,
   and this phase touched one file type.
<!-- /ANCHOR:limitations -->

---
