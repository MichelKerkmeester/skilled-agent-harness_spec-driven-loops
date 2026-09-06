---
title: "Implementation Summary: prove the pointer contract, run the failure mutation, and close the packet's acceptance criteria"
description: "The render gate ran from the final state and passed, the AC-006 mutation was watched failing on the real heat-matrix.html and restored with byte-identical proof, all 11 acceptance criteria dispositioned, AC-002 waived by ADR-006 on observed evidence, and the packet's documents now agree on what shipped."
trigger_phrases:
  - "implementation summary"
  - "closure phase summary"
  - "mutation proof"
  - "render gate evidence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/008-closure-and-proof"
    last_updated_at: "2026-09-06T02:55:00Z"
    last_updated_by: "glm-5.3-flash"
    recent_action: "Closed the packet: gate run, mutation proof, criteria filled"
    next_safe_action: "Reconcile spec.md and regenerate packet metadata, then validate strict"
    blockers: []
    key_files:
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md"
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/008-closure-and-proof/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20260906-closure-proof-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The render gate passed from the final state; the mutation failed naming the form; all 11 rows carry evidence, and AC-002 was later waived by ADR-006 rather than met."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: closure and proof for the pointer contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-closure-and-proof |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase built no corpus code. It produced proof and closure: the render gate run from
the final state, the failure mutation AC-006 demands, manual walks the checker cannot
see, the byte table AC-011 asks for, and a filled `acceptance-criteria.md` with a
decision record behind every row that is not a plain `Met`.

The packet may close. Nine criteria closed as `Met` on observed evidence, AC-005 closed
as `Superseded` against ADR-001 (restated against the declaration surface), and the
deferrals are written, not silent: O3 (ADR-003), the static-SVG no-script variant
(ADR-002), and the heaviest-form file choice (ADR-004).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `acceptance-criteria.md` (parent) | Modified | All 11 rows filled with observed evidence; Closure Statement written; AC-002 later moved to `Waived` per ADR-006 |
| `008-closure-and-proof/decision-record.md` | Created | Six ADRs: AC-005 restatement, no-script/first-paint interpretation, O3 deferral, heaviest-form correction, mutation-element correction, REQ-002 corpus-wide exception |
| `008-closure-and-proof/spec.md` | Modified | Status Draft → Complete after the gate passed |
| `008-closure-and-proof/implementation-summary.md` | Modified | This file |
| `008-closure-and-proof/tasks.md` | Modified | Checkboxes marked with evidence |
| parent `spec.md` | Modified | Status In Progress → Complete; Status Cross-check row reconciled |

No file under `.opencode/skills/sk-doc/sk-create-chart/` was modified by this phase. The
AC-006 mutation touched `heat-matrix.html` transiently and was restored byte-identical
(sha256 verified before and after; `git status` clean for the file; checker re-run
printed `RESULT: PASSED`).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every claim is an observed run. The gate and mutation ran through `check-corpus.cjs`
unchanged. The manual walks ran through raw Chrome DevTools Protocol against a headless
Chrome with a throwaway profile: Tab key events, Enter key events, mouse press/release
for the tap-pin walk, and `Emulation.setScriptExecutionDisabled` for the no-script
passes. The no-script byte comparison extracted the pre-packet files from HEAD
(`45fe10c`) and loaded them from a temp directory, so "renders the same as it renders
today" was measured against the actual pre-packet baseline rather than asserted.

The mutation discipline followed the plan: `cp` the real file aside, mutate in place,
watch `RESULT: FAILED` name the form and the contradiction branch, `cp` back, verify by
sha256 and a clean `git status` (not `git checkout --`), then re-run the checker to
`RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| AC-005 superseded, not met | Its verification step (wire a declaration, watch behaviour appear) cannot exist under the no-shared-runtime constraint; ADR-001 restates it against the declaration surface the checker actually enforces, per phase 001's recorded recommendation |
| AC-003 and AC-004 closed on the measured interpretation | Script-drawn figures have no static-SVG variant in this corpus; the honest reading is "no-script output unchanged from the pre-packet baseline", which was measured byte-for-byte on six forms spanning every class (ADR-002) |
| O3 held for a bounded follow-up, then taken by it | Converting silence to an error is a checker change needing its own mutation proof, and a closure phase proves the checker rather than changing it. `009-close-the-deferrals` made the change and ran the proof, so the rule now errors on a form with no contract row and on a row with no form (ADR-003) |
| Mutation landed on the figure wrapper div | No template carries a literal `<figure>`; the contract's register table names the wrapper as the inert attribute's home (ADR-005) |
| First-paint walk covered all 21 forms | The task named `calendar-grid` as heaviest, but measurement says `bar-line-composed` is; walking all 21 supersedes the file choice instead of arguing with it (ADR-004) |
| T010 (write the O3 answer into `template-contract.md`) routed to the decision record | The orchestrator's scope lock forbids editing the skill's reference docs in this phase; the spec's Files-to-Change table for this phase lists the decision record for exactly this case |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs --render` from the final state | PASS — 29 checks, 0 failures, 30 files, `Summary: errors: 0`, literal `RESULT: PASSED` (log: phase session record `closure-render-gate.log`) |
| AC-006 mutation on `heat-matrix.html` (in place) | PASS — `x interaction-hygiene: 120 assertion(s), 1 failure(s)`, `FAIL [interaction-hygiene] assets/templates/heat-matrix.html: the markup declares data-chart-inert and data-chart-tooltip. A form cannot both refuse the pointer and answer it. Remove the inert declaration or the carried register`, `RESULT: FAILED` |
| Mutation restore | PASS — sha256 `746ba037…df720b56` identical before and after, `git status` clean for the file, structural re-run `RESULT: PASSED` |
| Keyboard walk, one form per class + all six legend forms | PASS — six legend forms: Tab reaches every entry with a visible ring, Enter latches the dim, click-path drops the ring; card values all present in the table on `box-plot` |
| No-script walk, all 21 templates + HEAD comparison on 6 | PASS — visible text and SVG text byte-identical to the pre-packet baseline on every compared form |
| First paint at `Page.loadEventFired`, all 21 templates | PASS — figure content present before any listener can fire |
| Touch tap-pin-dismiss walk (`box-plot`) | PASS — tap pins (`data-open` set), outside tap dismisses |
| External-reference grep, checker patterns, 30 files | PASS — zero matches at HEAD and in the final tree; `no-external: 180 assertion(s), 0 failure(s)` in the gate run |
| Byte delta table, 27 changed corpus files | DONE — per-file numbers in AC-011; card copies land 6,306-7,196 bytes against the 7,016 excerpt |
| `validate.sh <packet> --strict` | PASS — `RESULT: PASSED` after metadata regeneration and reconciliation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

0. **RESOLVED in `009-close-the-deferrals`. REQ-002 did not hold corpus-wide, and this was found after closure.** A post-closure
   verification pass widened AC-002's card-versus-table check from one form per class to all
   21 templates. `distribution-strip` fails: each mark is an individual observation, the card
   reveals its value, and the table carries only `Records`, `Lowest`, `Median` and `Highest`
   per cohort, so no non-pointer route reaches any observation. Its delivery
   `pick-times-by-depot`, transferred in phase 007, fails identically. `stacked-area` was also
   flagged and cleared: its 851/769/502/244 are exactly its four series-column sums over 24
   rows, a derived aggregate whose every input is in the table. AC-002 moves to `Waived`, bounded to those two
   files, and the repair is a design decision recorded in ADR-006 and handed to the operator. The checker cannot catch
   this class today: it compares declarations against declarations, never a rendered card
   against the table. Phase 009 closed that too, with `card-readout`.

1. **RESOLVED in `009-close-the-deferrals`. O3 silence-passes was deferred, not resolved.**
   ADR-003 recorded the deferral and the bounded scope a future phase needed: an error branch for
   a form absent from the contract's per-form table, plus its own mutation recipe. Phase 009
   implemented exactly that as `pointer-contract-coverage`, in both directions, each watched
   failing before the rule was trusted.
2. **CLOSED as decided against in `009-close-the-deferrals`. No true static-SVG no-script read
   exists.** ADR-002 recorded that the corpus draws everything in script and always has, and
   called a `noscript` variant future work. Asked to leave nothing deferred, phase 009 answered
   the question instead of deferring it again: a pre-drawn variant is either a build step, which
   the corpus constraint forbids by name, or 21 hand-maintained duplicates that drift from their
   data blocks. The requirement it was imagined to serve is already met by the data table, which
   is plain HTML and needs no script. This is a design the corpus declines, not a gap.
3. **The card copies are near, not equal to, the 7,016-byte excerpt.** The measured
   range is 6,306-7,196 bytes because each form's card carries its own name, rows and
   registration; the excerpt figure is the mechanism's cost before adaptation. The AC-011
   table reports the real numbers rather than smoothing them toward the estimate.
4. **The render gate ran in about 25 seconds, not the quoted 3m10s.** The proof is the
   content (29 checks with render assertions present and 0 failures), not the duration;
   the quoted figure appears to reflect a colder machine or browser cache.
<!-- /ANCHOR:limitations -->

---
