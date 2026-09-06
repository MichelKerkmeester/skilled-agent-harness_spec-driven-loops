---
title: "Implementation Summary: close every deferral the packet left"
description: "Repaired the three tables whose card could outrun them, added the two corpus rules that make the property enforceable rather than discovered, watched every new branch fail before trusting it, and closed the last item as a design the corpus declines rather than work it postpones."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/009-close-the-deferrals"
    last_updated_at: "2026-09-06T04:34:06Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Repairs landed, both rules watched failing, deferrals closed"
    next_safe_action: "None; the phase is complete and the parent packet carries no open item"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/distribution-strip.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-close-the-deferrals"
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
| **Spec Folder** | 009-close-the-deferrals |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three repairs and two rules.

The repairs give each table whatever its card can reveal. `distribution-strip` and its delivery
`pick-times-by-depot` gained a column carrying every record in sorted order, placed behind the
five-number summary rather than replacing it, so the summary still does the job it was designed
for. `stacked-area` gained a table foot of whole-period series totals, which is the one figure
its monthly rows never stated and exactly what its card reads out.

The rules make the property enforceable. `card-readout` is the first rule in this corpus that
opens a card: a card exists only while a pointer is on a mark, so the rule writes an instrumented
copy of each card-carrying file to a temporary directory, drives a pointer across a sample of its
marks, and requires every number the card shows to appear in the table. `pointer-contract-coverage`
requires a row in the per-form contract table for every form on disk, and a form for every row.

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/distribution-strip.html` | Modified | Table carries every record behind the summary |
| `assets/templates/stacked-area.html` | Modified | Table foot carries the whole-period series totals |
| `assets/examples/pick-times-by-depot.html` | Modified | Same repair as its parent |
| `scripts/check-corpus.cjs` | Modified | `card-readout` and `pointer-contract-coverage` |
| `scripts/README.md` | Modified | Both rules documented, three mutation recipes added |
| `references/template-contract.md` | Modified | Rules 18 and 19, the readout subsection, the strip's row corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Repairs first, then rules, so each rule arrived on a corpus that already satisfied it. A rule
landing on a red corpus cannot be told apart from a rule that is itself wrong, and the register
rule one phase earlier was sequenced the same way for the same reason.

`stacked-area` was repaired even though its case was the weaker one: every input to its card was
already in the table and only the sum was missing. Leaving it would have forced `card-readout` to
ship with a carve-out, and a rule with an exception is a rule nobody trusts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The table grew; the card did not shrink | Reducing the strip's card to the summary the table already carried would have removed the only reason the form answers a pointer at all |
| The summary columns stay in front of the readings | The five-number summary is what most readers want; the readings are what accessibility requires. Both fit |
| `stacked-area` repaired despite passing on the merits | An exception in a new rule is worth less than the repair it excuses |
| The number matcher splits on comma-then-space | A thousands separator is a comma with no space and a list separator is a comma with one; getting this wrong reports a false failure on exactly the files this phase repaired |
| The no-script variant closed as declined, not deferred | It is a build step the constraint forbids by name, or 21 hand-maintained duplicates that drift from their data blocks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs --render` | `RESULT: PASSED`, 0 errors, from the repaired state |
| `card-readout` | 17 assertions, 0 failures |
| `pointer-contract-coverage` | 42 assertions, 0 failures |
| Pointer sweep, all 27 corpus files | No card shows a value its table lacks |
| Contract-coverage mutation, form without a row | `RESULT: FAILED` naming `treemap`, restored, sha256 match, `RESULT: PASSED` |
| Contract-coverage mutation, row without a form | `RESULT: FAILED` naming `sunburst`, restored, sha256 match, `RESULT: PASSED` |
| Comment hygiene, all changed files | exit 0 on each |

Two render runs failed on a browser that died before writing anything, `settled-render` on
`treemap` once and `dark-render` on `candlestick` once. Neither was a content failure: each file
opened cleanly in isolation, three and five times respectively, with byte-identical DOM and PNG,
while dozens of Chrome processes from another session saturated the machine. A different file
failed each time, which is the signature of a lost race rather than a defect in any chart.

That was worth fixing rather than re-rolling. A full pass spawns the browser over a hundred times
in sequence and this phase added seventeen more, so `openOnce` now retries a spawn once. Only the
spawn is retried: a document that comes back and disagrees with its twin is still a failure,
because that is the condition these checks exist to catch. A gate that fails at random is not a
proof, and re-running it until it agrees with you is not a method.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`card-readout` samples rather than exhausts.** It walks up to eight marks per form, not all
   of them, because the rule already opens a browser per card-carrying file. A card that lies on
   one specific mark and tells the truth on the eight sampled would pass. Exhaustive walking is
   available by raising one constant if a defect ever justifies the runtime.
2. **The rule compares numbers, not labels.** A card showing the right value under the wrong
   series name passes. Labels are covered by `series-mapping` from the colour side, not here.
3. **A synthetic `pointermove` is not a human hover.** The rule dispatches events rather than
   moving a mouse, so a form whose card depends on real pointer coordinates rather than on the
   event target would report `card-never-opened`, which is an error rather than a silent pass.
<!-- /ANCHOR:limitations -->

---


