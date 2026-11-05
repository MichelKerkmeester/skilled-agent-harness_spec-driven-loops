---
title: "Implementation Summary"
description: "The chart references now describe only the chart work, with every research citation and phase reference gone and every rule it backed still stated on its own figures."
trigger_phrases:
  - "chart research cleanup implementation summary"
  - "chart citations removed"
  - "sk-design-chart 0.23.7.0"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/003-chart-research-cleanup"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the cleanup and the evidence that proves it"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-003-chart-research-cleanup"
      parent_session_id: null
    completion_pct: 100
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-chart-research-cleanup |
| **Status** | Complete |
| **Completed** | 2026-11-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A chart reference now reads as a rule set rather than as a set of pointers into a research packet. The four files keep every rule the citations backed, and each rule carries the figure or the decision that supports it.

### Phase 3: chart-research-cleanup

The cleanup touched the four chart documents that named a research packet or a phase. `color-system.md` keeps the standalone categorical gates and their measured hue and contrast figures, without the comparison that produced them. `catalog.md` keeps the radar and pie decision as a decision, with no phase or source line attached. `template-contract.md` states the stacked-area card as one rule rather than as a correction to an earlier figure. `origin.md` records where the evilcharts reference came from by reading its own measured source file.

The word "research" still appears outside these four files in three record classes. Each is a record rather than a citation. The changelog format keeps a "Spec folder:" line in every entry, a dated benchmark run report names the run it recorded and the style-library site descriptions use the word about the sites themselves.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-design/sk-design-chart/references/color-system.md` | Modified | Role split and categorical gates stated on their own, with their measured figures |
| `.skilled/skills/sk-design/sk-design-chart/references/catalog.md` | Modified | Radar and pie decision and palette rules stated on their own |
| `.skilled/skills/sk-design/sk-design-chart/references/template-contract.md` | Modified | Template rules and type scale stated on their own |
| `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/origin.md` | Modified | Provenance read from the measured source file, with no research pointer |
| `.skilled/skills/sk-design/sk-design-chart/SKILL.md` | Modified | Version 0.23.7.0 |
| `.skilled/skills/sk-design/sk-design-chart/changelog/v0.23.7.0.md` | Created | Release entry for the cleanup |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each of the four files was read against the rule that each citation backed. The rule was stated in place first, then the pointer came out, so no section was left with a claim and no support. The sweep over `.skilled/skills/sk-design` ran after the four files were cleaned, which is what separates a remaining citation from a dated record. The mode moved to 0.23.7.0 and its changelog entry followed.

The final gate run covered `validate_document.py` on the four files and the changelog, the chart corpus check, the three chart tests and the packet gate. `validate_document.py` reports VALID 0 issues on all four files. The chart corpus reports RESULT PASSED with errors 0. The `apply-design-md`, `corpus-mutations` and `typo-flags` tests each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Keep the rule and drop the citation | The rule is what a chart author needs, and the citation was provenance the chart skill does not ship |
| State the measured figures in place | The figures are what let a reader trust a rule without opening another packet |
| Keep the changelog "Spec folder:" lines | The changelog format requires the record, and the line names where the release was made rather than the source of a rule |
| Keep the dated benchmark report and the site descriptions | Each names its own record or subject, so the word "research" carries its ordinary meaning there |
| Use a patch bump from 0.23.6.0 to 0.23.7.0 | No rule changed for a consumer, but the release still needs a changelog entry that names the cleanup |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `validate_document.py` on the four chart files | PASS, VALID 0 issues on `color-system.md`, `catalog.md`, `template-contract.md` and `origin.md` |
| `validate_document.py` on the changelog | PASS, VALID 0 issues |
| Search for `Phase 13`, `this phase`, `from the research` and `another packet` over the four files | PASS, no line |
| Sweep of every `sk-design` mode | PASS, no other research leak. The remaining hits are changelog "Spec folder:" lines, a dated benchmark run report and style-library site descriptions |
| `SKILL.md` version | PASS, 0.23.7.0 |
| `check-corpus.cjs` on `sk-design-chart` | PASS, RESULT PASSED errors 0 |
| `apply-design-md`, `corpus-mutations` and `typo-flags` tests | PASS, exit 0 each |
| `validate.sh` on this folder with `--strict` | PASS, RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The sweep still reports three non-citation classes.** The changelog "Spec folder:" lines, the dated benchmark run report and the style-library site descriptions keep the word on purpose, so a search for the bare word reports more than a citation leak. Search for the citation markers instead.
2. **The cleanup keeps the reasoning the research packet established.** A rule whose derivation never reached the chart file would now stand without it. The four files carried their own figures and decisions, and `validate_document.py` checks structure rather than reasoning.
3. **The evidence is the working tree at baseline `10474a9567`.** This phase commits nothing, so a later diff has to compare against that baseline rather than against `main`.
<!-- /ANCHOR:limitations -->

---
