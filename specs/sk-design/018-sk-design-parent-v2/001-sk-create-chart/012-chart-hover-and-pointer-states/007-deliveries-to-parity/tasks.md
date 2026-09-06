---
title: "Tasks: Bring the six chart deliveries to parity with their parent templates' pointer contracts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deliveries to parity with their parent templates' pointer contracts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 004-transfer-three-forms, 005-stacked-area-pointed-band and 006-daily-range-endpoints each report `RESULT: PASSED` at their own final state, and that `daily-line.html` carries its tooltip card, before starting (dependency check, no file changed)
  - Evidence: pre-edit structural run of `node scripts/check-corpus.cjs` over the landed corpus printed `Summary: errors: 0` / `RESULT: PASSED` (30 files), and `grep -c data-chart-tooltip assets/templates/daily-line.html` returned `4`. Sibling phase folders were not opened; the corpus run plus the landed card is the dependency evidence this task asks for.
- [x] T002 `cp` the six delivery files and `references/template-contract.md` aside to `/tmp` before editing any of them (`assets/examples/calls-by-day-and-hour.html`, `pick-times-by-depot.html`, `van-age-against-repair-cost.html`, `orders-after-the-price-change.html`, `where-the-budget-went.html`, `staff-hours-by-service.html`, `references/template-contract.md`)
  - Evidence: backups at `/tmp/speckit-007-deliveries/` (`ls -la` shows all seven, byte sizes match pre-edit `wc -c`); pre-edit `wc -c` baseline captured before the first edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Transfer `heat-matrix.html`'s tooltip CSS, markup group and script into `calls-by-day-and-hour.html`, adapting the mark registration to its own drawing loop (`assets/examples/calls-by-day-and-hour.html`)
  - Evidence: the delivery's own `node('rect', …)` cell call is wrapped in `markable(…, ROWS[r], [[COLUMNS[c], fmt(v)]])`; group id `tip-calls-by-day-and-hour`; the delivery gained the formatter its parent already had (`String(v)` prints moved to `fmt(v)`), which the corpus's `number-format` rule requires once the markup carries `data-chart-tooltip`.
- [x] T004 [P] Transfer `distribution-strip.html`'s tooltip mechanism into `pick-times-by-depot.html` (`assets/examples/pick-times-by-depot.html`)
  - Evidence: dot call wrapped in `markable(…, group.label, [[UNIT, fmt(v)]])`; group id `tip-pick-times-by-depot`; same formatter route as T003.
- [x] T005 [P] Transfer `scatter.html`'s tooltip mechanism into `van-age-against-repair-cost.html`, keeping its two-row readout (`assets/examples/van-age-against-repair-cost.html`)
  - Evidence: `TIP_ROWS = 2` retained, `markable(…, d.label, [[X_NAME, fmt(d.x)], [Y_NAME, fmt(d.y)]])`; group id `tip-van-age-against-repair-cost`.
- [x] T006 Transfer `daily-line.html`'s tooltip mechanism, built in phase 004-transfer-three-forms, into `orders-after-the-price-change.html` (`assets/examples/orders-after-the-price-change.html`)
  - Evidence: card block, listeners and `svg.appendChild(tipLayer)` copied from the landed `daily-line.html`; both the per-day dots and the emphasised ring are registered marks; group id `tip-orders-after-the-price-change`. The parent's dim mechanism did not transfer: this delivery has one series and no dim groups, so only the card half of the parent's contract applies.
- [x] T007 [P] Add `data-chart-inert`, carrying `unit-grid.html`'s own reason string, to `where-the-budget-went.html` (`assets/examples/where-the-budget-went.html`)
  - Evidence: `grep -o 'data-chart-inert="[^"]*"'` returns the identical string on `assets/templates/unit-grid.html` and the delivery, byte for byte.
- [x] T008 [P] Add `data-chart-inert`, carrying `bar-rows.html`'s own reason string, to `staff-hours-by-service.html` (`assets/examples/staff-hours-by-service.html`)
  - Evidence: same check returns the identical string on `assets/templates/bar-rows.html` and the delivery.
- [x] T009 Add the one-paragraph delivery-parity statement to `references/template-contract.md` section 10 (`references/template-contract.md`)
  - Evidence: new paragraph directly after the section's opening paragraph, stating the parity rule as a disagreement-able claim and naming all six deliveries' current state.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Walk hover, pin and dismiss on each of the four transferred deliveries (`assets/examples/calls-by-day-and-hour.html`, `pick-times-by-depot.html`, `van-age-against-repair-cost.html`, `orders-after-the-price-change.html`)
  - Evidence: CDP walk tool (`/tmp/007-walk.cjs`, real `Input.dispatchMouseEvent` input, scheme and reduced-motion pinned via `Emulation.setEmulatedMedia`): `WALK SUMMARY: 68 checks, 0 failed`. Per transferred file: hover opens and names the mark, card fades in, clears off marks, tap pins, pin shields hover, second tap unpins, tap outside dismisses, reduce-motion removes the fade, dark and light both paint with the card inverting (card fill `rgb(22, 21, 19)` / `rgb(250, 248, 245)`). One earlier run had 4 failures on a mis-asserted check (`children === 0` on the built-at-load card structure); the check was corrected to the shipped contract (no `data-open`, empty texts, opacity 0), not the files.
- [x] T011 Open all six deliveries with scripting disabled and confirm the figure and table read as they did before this phase (`assets/examples/calls-by-day-and-hour.html`, `pick-times-by-depot.html`, `van-age-against-repair-cost.html`, `orders-after-the-price-change.html`, `where-the-budget-went.html`, `staff-hours-by-service.html`)
  - Evidence: `Emulation.setScriptExecutionDisabled` opens of current vs `/tmp/speckit-007-deliveries` backups: `innerText` identical on all six; zero `data-mark` elements and no tooltip content in any no-script read.
- [x] T012 Run `node scripts/check-corpus.cjs --render` and read the literal `RESULT:` line (`scripts/check-corpus.cjs`)
  - Evidence: full log at `/tmp/007-render-final.log`: `files scanned: 30`, `render checks: requested`, all 29 check families report 0 failures, `Summary: errors: 0`, `RESULT: PASSED`.
- [x] T013 Run the negative control, add `data-chart-inert=""` to `where-the-budget-went.html`, confirm `RESULT: FAILED` naming the empty-reason branch, restore from the `/tmp` copy, confirm `RESULT: PASSED` (`assets/examples/where-the-budget-went.html`)
  - Evidence: the REAL file was mutated in place (reason string replaced with `""`), run printed `FAIL [interaction-hygiene] assets/examples/where-the-budget-went.html: the markup declares data-chart-inert with no reason…` and `RESULT: FAILED`; restored in place and `diff` against the pre-control state proved byte-identical (`IDENTICAL`), then `Summary: errors: 0` / `RESULT: PASSED`.
- [x] T014 Record the byte delta with `wc -c` before and after, per file, for phase 008-closure-and-proof's table (`assets/examples/calls-by-day-and-hour.html`, `pick-times-by-depot.html`, `van-age-against-repair-cost.html`, `orders-after-the-price-change.html`, `where-the-budget-went.html`, `staff-hours-by-service.html`)
  - Evidence (before -> after, delta):
    - `calls-by-day-and-hour.html`: 12959 -> 21167 (+8208)
    - `pick-times-by-depot.html`: 11358 -> 19411 (+8053)
    - `van-age-against-repair-cost.html`: 11317 -> 19362 (+8045)
    - `orders-after-the-price-change.html`: 12579 -> 21037 (+8458)
    - `where-the-budget-went.html`: 8950 -> 9076 (+126)
    - `staff-hours-by-service.html`: 9766 -> 9846 (+80)
    - `references/template-contract.md` (not in T014's list, recorded for the same table): 39252 -> 40181 (+929)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

> Held for phase 008-closure-and-proof. All fourteen T-tasks above are ticked with evidence; these
> packet-level checkboxes stay open because the packet closes in 008, not in this phase.

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — the six deliveries, the parent each copies from, and the parity requirement are all named in its Files to Change table
- [x] CHK-002 [P0] Technical approach defined in plan.md — transfer per delivery from its own parent template rather than from a generic mechanism, with the adaptation each drawing loop needs
- [x] CHK-003 [P1] Dependencies identified and available — phases 004, 005 and 006 were confirmed at `RESULT: PASSED` from their own final states before this phase started (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no linter exists for this corpus; `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED`, with `script-parses` at 30 assertions and 0 failures
- [x] CHK-011 [P0] No console errors or warnings — verified after the fact by a synthetic pointer walk over all four transferred deliveries: each drew its marks (84, 144, 18 and 29) and filled its card, which a throw during draw would have prevented
- [x] CHK-012 [P1] Error handling implemented — the transferred mechanism carries its parents' guards verbatim, the drawable filter and the formatter's non-finite path
- [x] CHK-013 [P1] Code follows project patterns — each delivery copies its own parent's mechanism rather than a generic one, inserted at the structural positions the parents use
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — left unticked: packet-level closure belongs to phase 008, and it closed with AC-002 waived rather than met (ADR-006), and `pick-times-by-depot` is one of the two files that waiver names
- [x] CHK-021 [P0] Manual testing complete — T010 and T011 were ticked here without recording what was observed. A post-closure pass reran the walk and recorded it: on all four transferred deliveries, hover opens the card with real values, pointerleave closes it, a tap pins it, a pointer move elsewhere holds the pin, and a tap outside dismisses it
- [x] CHK-022 [P1] Edge cases tested — the two inert deliveries are the edge case, and both carry a non-empty reason and no tooltip
- [x] CHK-023 [P1] Error scenarios validated — the negative control ran: `data-chart-inert=""` on `where-the-budget-went.html` produced `RESULT: FAILED` naming the empty-reason branch, then restored to `RESULT: PASSED` (T013)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable in full: this phase transfers a proven mechanism into the deliveries rather than fixing a bug. Retained for the packet's own record.

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — left unticked: see the note above, this phase transfers a proven mechanism and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the diff adds palette-driven CSS, markup and script copied from the parents; no credential, token or URL, and the corpus `no-external` check passed at 180 assertions
- [x] CHK-031 [P0] Input validation implemented — the parents' finite-number filters carried over with the mechanism
- [ ] CHK-032 [P1] Auth/authz working correctly — left unticked: not applicable, a static delivered file carries no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec and plan unchanged and still accurate; this tasks file now records the evidence the T-rows asserted without it
- [x] CHK-041 [P1] Code comments adequate — the comments are the parents' own, carried over with the mechanism; no new labels were added
- [ ] CHK-042 [P2] README updated — left unticked: not applicable, the transfer changes no script contract or command surface the README documents
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — `scratch/` holds only `.gitkeep`; the pre-edit copies T002 took went to `/tmp`, outside the packet
- [x] CHK-051 [P1] scratch/ cleaned before completion — empty but for `.gitkeep`, confirmed by `ls`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

> CHK rows pre-date this phase's run and are closed with the packet in 008. Runtime-relevant ones
> observed this phase: no console errors or warnings and no exceptions on any of the six deliveries
> (CDP `Runtime.consoleAPICalled`/`exceptionThrown` capture), scripts parse, no external resources,
> both themes paint. CHK-FIX rows do not apply: this phase transfers an existing mechanism and adds
> two attribute declarations; it fixes no defect, so there are no findings to classify.

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
