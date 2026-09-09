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
    packet_pointer: "hooks/017-cache-optimizer-review-remediation"
    last_updated_at: "2026-09-09T08:05:23Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Fixed three review findings with negative controls"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-hooks/017-cache-optimizer-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-cache-optimizer-review-remediation |
| **Completed** | 2026-09-09 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three fixes, each with a control that fails without it.

**One extension loads.** `npm:pi-cache-optimizer` removed from the enabled packages, leaving the
vendored fork — which is the point of vendoring it. The project and user settings turned out to be
the same file on disk, so the single edit covers both scopes.

**Movement is detected.** `validateEdits` now requires the line count the read reported and refuses
when the file no longer has it. This is what a content hash cannot do on its own: an identical line
shifted into the target index hashes the same, but shifting it requires inserting or deleting a
line, which the count sees. Interior lines of a range are verified too, when the caller supplies
their hashes, so a drifted middle is no longer written over.

**Escalation counts two different things separately.** The repeated-signature count drives the
same-request guard and abort; the blocked-turn streak drives a distinct, higher threshold whose
message says plainly that the errors differ and the turn is not converging.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defects came from an independent review that was asked to falsify two claims rather than
confirm them. Both claims turned out to be wrong in part, which is why the review was worth running:
the shipped suite was green throughout and could not have found any of this.

Each finding was re-verified here before being acted on — the double load by reading Pi's own
identity function, the hash gap and the escalation arithmetic by reading the code paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Line count, not a position-bound hash.** Binding the hash to a line number looks like the obvious
fix and does nothing: the check happens at the claimed index either way, so an identical line
arriving at that index still matches. Movement is only observable as a change in the file's length,
which is what the guard now asserts.

**`line_count` is required rather than optional.** An optional guard that the caller may omit is
not a guard. The tool is new enough that no established usage breaks, and the refusal explains what
to send.

**Both failure counters were kept.** The bug was that one silently shadowed the other and then
described itself wrongly. Deleting the streak would have removed a real protection; giving it its
own threshold and an honest message keeps it and makes both claims true.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Suite | 98/98 pass, 0 fail (was 92) |
| `npm run check` | exit 0 |
| Negative control — fixes disabled | 4 of the new tests fail, including the shifted-line and differing-failure cases |
| Negative control — fixes restored | 98/98 |
| Enabled packages | one `cache-optimizer` entry, was two |
| Settings scopes | project and user settings share an inode, so one edit covers both |
| Comment hygiene | no artifact ids or spec paths in changed code |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The line-count guard is defeated by a change that inserts and deletes an equal number of lines
between the read and the edit. Range-interior hashes narrow that further when supplied, but a
caller that omits them keeps the endpoint-only guarantee.

The economics pricing path is still unexercised live, because no model entry carries a cost block.
That is a data gap rather than a defect and is left to an explicit decision.

The batch-completion assumption about tool-call ids is unresolved: a provider emitting duplicate or
empty ids would leave a batch pending and the guard would never fire. Confirming it needs a
provider that does so.
<!-- /ANCHOR:limitations -->

---


