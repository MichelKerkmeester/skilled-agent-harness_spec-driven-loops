---
title: "Implementation Summary: a gallery generated from the corpus, and the rule that makes a stale one an error."
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
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/004-light-dark-gallery"
    last_updated_at: "2026-09-06T06:26:46Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Gallery generated; its rule watched failing in both directions"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-light-dark-gallery"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 004-light-dark-gallery |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One page shows every chart in the corpus twice, once with a light scheme pinned and once with a
dark one. Before it, comparing the two meant changing a system setting and reloading, twenty-six
times.

### Generated, never authored

`scripts/build-gallery.cjs` reads `assets/templates/` and writes the page. Its `--check` mode fails
when the written page differs by a byte from a fresh build. That is the whole design: a hand-listed
gallery omits the form somebody added last week, and the omission looks exactly like a form that
was never meant to be listed.

Each of the fifty-two frames pins its own scheme, written into the framed document once it loads,
because a colour scheme cannot be forced on a frame from outside it. Without the pin, a pair is two
copies of whatever the reader's system happens to be set to, which is not a comparison.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/build-gallery.cjs` | Created | Reads the directory, writes the page, checks the page against the directory |
| `assets/gallery.html` | Created | Generated: 26 forms, 52 frames |
| `scripts/check-corpus.cjs` | Modified | The `gallery` rule, and an exemption so a contact sheet is not judged as a chart |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Written, then immediately gated — which is how the integration problem surfaced within a minute
rather than at closure. The page lives under `assets/`, so the corpus checker treated it as a chart
and produced twenty-four failures demanding a data block, a colour system and a palette block from
a page that has none of those things by nature.

The fix was not to give the gallery a data block. It was to say plainly that it is not a chart, and
to hold it to the one obligation it does have.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Generated from the directory | A gallery is easy to write and easy to let rot, and a rotten one is worse than none because it still looks authoritative |
| A rule, not just a generator | Running the generator is optional; failing the corpus when the page falls behind is not |
| Exempt the page from the chart rules | Asking a contact sheet for a colour system is a category error. Its obligation is completeness |
| Pin the scheme per frame | Two frames showing the reader's own scheme are a duplicate, not a comparison |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Coverage | 26 forms, 52 frames; `--check` passes against the written page |
| `gallery` rule | 27 assertions, 0 failures |
| Mutation, form dropped from the page | `FAIL [gallery] ... funnel appears in 0 gallery frame(s) and needs two`, `RESULT: FAILED` |
| Mutation, corpus grown without a rebuild | Named both the count mismatch (26 declared, 27 on disk) and the missing form, `RESULT: FAILED` |
| Restore | sha256 `852ff466ce16eb10` matching, probe removed, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The scheme pin depends on same-origin frame access.** Opened over a protocol that blocks
   inspecting a frame's document, each frame falls back to the reader's own scheme. The page
   degrades to a duplicate rather than breaking, and says so in a comment.
2. **The gallery shows templates, not deliveries.** The six files under `assets/examples/` are
   built from templates already on the page, so including them would repeat forms rather than add
   any.
3. **Freshness is checked, appearance is not.** The rule proves every form is present twice. It
   does not prove either rendering is any good.
<!-- /ANCHOR:limitations -->

---


