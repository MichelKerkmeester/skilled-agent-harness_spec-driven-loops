---
title: "Implementation Summary"
description: "Everything the chart phases recorded as not-done is closed, and what remains is a boundary rather than a gap."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/028-closeout"
    last_updated_at: "2026-09-09T17:46:09Z"
    last_updated_by: "claude-conductor"
    recent_action: "Closed every recorded item across the chart phases and had the result reviewed"
    next_safe_action: "Nothing outstanding in this line of work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-028-closeout"
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
| **Spec Folder** | 028-closeout |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four phases closed with items recorded rather than done. All of them are closed. A fresh review of
the whole line of work then found eleven more, every one of them the same failure: an assertion that
passes for a reason other than the one its message gives. Those are closed too.

### What the closeout found on its own

Two checks could not fire. `metric-block` compared a repository-relative label against a resolved
directory, so a form drawing no metric header could drop its declaration and the corpus stayed
green. `points` was held one way only. A paragraph in the colour reference described a categorical
rotation the shipped palette does not perform. And the derivation the whole corpus rests on was
documented in a prose note rather than held by anything.

### What the review found

The worst was in the family this closeout had just written: `palette-derivation` compared the record
against itself and never read the palette, so a departed value could be changed to anything. Its
membership test was role-blind, so any colour the reference publishes could be moved into any role —
including the gridline, which is deliberately ungated and had nothing else holding it.

Four families tested for code in text that still carried comments, so a commented-out mark, a
gradient mentioned in a sentence, a reference drawing that was entirely comment, and a labelled
guard that could not run all passed. Two form sets were hand-listed and out of date, which was
hiding real drift in `tracker`. A key kind declared as a rule was never required to render as one.
The legend message named three measurements and held one. And the applicator's corner ladder
collapsed to zero for any rung the reference had nothing small enough for — the stock reference
included, which meant every themed set squared its data marks and said nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/check-corpus.cjs` | Modify | Two repaired guards, two rewritten families, four comment leaks, two derived applicability sets |
| `scripts/apply-design-md.cjs` | Modify | The corner ladder falls back to the corpus rung instead of zero; the default path is exported |
| `assets/color/palettes.json` | Modify | The derivation as structure: 27 roles to reference tokens, 4 departures, 9 stated arithmetics |
| `assets/templates/tracker.html` | Modify | The held series owns the metric classes it paints |
| `assets/style-reference/*/origin.md` | Modify | Pins refreshed, and now held |
| `scripts/tests/**` | Modify / Create | Four vendored references, three tests, one real assertion where there had been a tautology |
| `references/color-system.md`, `references/design-md-theming.md` | Modify | The rotation corrected against measurement; the corner ladder's floor documented |
| `changelog/v1.11.0.0.md`, `v1.12.0.0.md`, `SKILL.md`, `README.md` | Modify / Create | A wrong measured claim corrected, and version 1.12.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every fix was reproduced before it was made and again after. Twenty-six mutations were run across
this pass: eight on the rewritten derivation family, four on the comment leaks, four on the derived
applicability sets, four on the tightened key and legend assertions, two on the repaired guards, two
on the reverse points direction, one on the pin family, and one negative control per new test.

The review was run by a fresh Opus on a second account against the four commits and the working
tree. Its findings were verified here before any of them were acted on, and one of its claims was
wrong in my favour and still corrected: it reported the neutral ordering as entirely unheld, and
what I found was that a swap is caught by block drift unless it is propagated — so I propagated it,
confirmed nothing held it, and held it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The derivation became 27 role-to-token records rather than a membership set | A flat set of published colours answers "is this colour in the reference" when the question is "does this role take the token it says it takes". The long form is the only one that catches a value moved between roles. |
| A circle construction the rule cannot parse is an error | The reason I gave for not building this check earlier was that it would silently skip forms it did not understand. Failing loud on those removes the objection rather than working around it. |
| The curve set stays hand-listed and gains a coverage check | It states an obligation, not applicability: deriving it from the files that carry a curve block would mean deleting the block deletes the obligation. |
| The corner ladder falls back to the corpus rung, and the floor is documented rather than redesigned | Zero was a silent defect and is fixed. Mapping by the reference's own element names would carry more of a reference through and change every themed set produced so far, which is a decision about the register rather than a repair. |
| A wrong measured claim was corrected in place with a note saying it was wrong | It shipped in a changelog, a reference and a commit message. The commit message cannot be changed; the other two now carry the correction and say so. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0`. 42 families; `palette-derivation` 96 assertions and `style-reference` 15 are new, `legend` 42 to 56, `metric-block` to 122, `mark-policy` to 253. |
| Mutation proof | PASS. Twenty-six mutations, each failing on its own message; every one of them passed before its fix. |
| `node --test scripts/tests/` | PASS. 9 of 9, with a negative control run against each of the three new tests. |
| `node scripts/check-corpus.cjs --render` | PASS. |
| `node ../shared/scripts/render-screenshots.cjs` | PASS. 40 rendered, 0 failed, 0 stale. |
| Both references still theme | PASS. `--default` reproduces the stock corner ladder exactly; evilcharts themes 25 forms with both themes gated. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

These are boundaries, not deferrals. Each is something a static check cannot reach, stated so that
nobody reads silence as coverage.

1. **Nine ramp values are exempt from the derivation by kind, not by arithmetic.** They are held by the ramp contract in `palette-source`, which asserts their separation and their direction; the derivation says which rule holds them rather than implying it holds them itself.
2. **The guide's per-reading requirement is not checkable.** Whether a card opens on a reading or on a series is a runtime fact. `stacked-area` is the worked counter-example and the contract states it as the author's call.
3. **Nine of the eleven forms carrying a `REFERENCE` block ship an empty list.** The drawing is now held for real, so the code is proved rather than assumed; inventing targets for forms whose data has none would be writing data.
4. **The evilcharts reference cannot be re-derived from anything the packet carries.** Its source clone lives in another packet's research context. The conversions are recorded so the arithmetic can be checked by hand, but nothing here can regenerate it.
5. **The corner ladder is a floor.** A reference whose corners are all larger than the corpus rungs contributes none of them. Documented with what a role-name mapping would buy.
<!-- /ANCHOR:limitations -->

---


