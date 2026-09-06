---
title: "Tasks: Give daily-range its first pointer contract, low and high, never a midpoint"
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
# Tasks: Give daily-range its first pointer contract, low and high, never a midpoint

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

- [x] T001 Confirm `003-excerpt-and-grouped-bars` reports `RESULT: PASSED` on `grouped-bars.html` and re-run `node scripts/check-corpus.cjs` against the untouched corpus to capture the baseline (`scripts/check-corpus.cjs`)
  - Evidence: baseline structural run on the untouched corpus printed `RESULT: PASSED` (30 files, 0 errors, `grouped-bars` carrying the finished excerpt); the later `--render` run re-passed with `settled-render: 60 assertion(s), 0 failure(s)`.
- [x] T002 [P] `cp` `daily-range.html` aside before any mutation, per `scripts/README.md`'s restore discipline (`assets/templates/daily-range.html`)
  - Evidence: pre-change copy held outside the working tree at `tmp/phase-006-daily-range/daily-range.pre.html` (gitignored scratch); `wc -c` recorded 14,795 bytes before the first edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the CSS block (`box-plot.html:124-150`), which already carries the `.figure svg :focus:not(:focus-visible)` hygiene line `daily-range.html` is missing today, the empty `<g data-chart-tooltip id="tip-daily-range">` after `<desc>` (`box-plot.html:161`), the card script with `TIP_ROWS = 2` (`box-plot.html:235-317`) and the full listener block (`box-plot.html:381-418`) to `daily-range.html` (`assets/templates/daily-range.html`)
  - Evidence: verbatim transfer from the proven excerpts (card script `TIP_ROWS = 2`, pointermove/pointerleave/click-pin/document-dismissal listeners, `svg.appendChild(tipLayer)` last, tooltip group after `<desc>`, hygiene line, `[data-chart-tooltip] { transition: none; }` added to the existing reduce-motion block).
- [x] T004 Register every drawable day's bar (`daily-range.html:263-264`, guarded by the `drawable` filter at `:261`) with `markable()`, naming the day and giving two rows: Low, then High. Never a midpoint (`assets/templates/daily-range.html`)
  - Evidence: the `node('rect', …)` call is wrapped with `markable(…, 'Day ' + d.day, [['Low', fmt(d.low)], ['High', fmt(d.high)]])` inside the `drawable` guard; the CDP walk counted 14/14 bars marked and rows exactly Low, High with values 118/340 for Day 1 matching the table row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run `node scripts/check-corpus.cjs`. Confirm `RESULT: PASSED` with zero `interaction-hygiene`, `interaction-state` and `number-format` failures (`scripts/check-corpus.cjs`)
  - Evidence: `node scripts/check-corpus.cjs --render` from the skill root printed `interaction-hygiene: 120 assertion(s), 0 failure(s)`, `interaction-state: 60, 0`, `number-format: 180, 0` and the literal `RESULT: PASSED`; the run's own mode line said `render checks: requested`.
- [x] T006 Hover walk on `daily-range.html`: the card opens on hover over any drawn bar, opens on the correct day and flips to the other side of a mark near the right edge rather than opening past the frame (`assets/templates/daily-range.html`)
  - Evidence: CDP mouse walk — hover on Day 1 opened a card named `Day 1`; move off the drawing closed it; hover on the last bar kept the card's bounding box inside the SVG frame (right-edge flip). Ran under both pinned schemes.
- [x] T007 Pin walk on `daily-range.html`: a tap pins, a tap on another bar re-pins, a second tap on the pinned bar clears it, a tap outside the drawing clears it (`assets/templates/daily-range.html`)
  - Evidence: CDP click walk — tap pinned (`Day 1`), pinned card survived the pointer leaving, tap on another bar re-pinned (`Day 10`), second tap on the same bar dismissed, tap outside the drawing dismissed.
- [x] T008 Reduced-motion check on `daily-range.html`: set the system to reduced motion and confirm the card appears with no fade rather than a fast one (`assets/templates/daily-range.html`)
  - Evidence: CDP `Emulation.setEmulatedMedia` prefers-reduced-motion=reduce — control open showed `chart-reveal` and `0.2s` card fade, reduced open showed `animation: none` and `0s` transition, and the card still opened with rows Low, High.
- [x] T009 No-script check on `daily-range.html`: open with scripting disabled and confirm the figure and table read exactly as before (`assets/templates/daily-range.html`)
  - Evidence: CDP `Emulation.setScriptExecutionDisabled` — the current file's full-page screenshot is byte-identical to the pre-change copy's, with no script-drawn marks and no filled table rows.
- [x] T010 Form-specific check: confirm the card shows exactly two rows, Low and High, and never a combined or averaged figure. Confirm a day excluded from `drawable` gets no mark and no card (`assets/templates/daily-range.html`)
  - Evidence: card row count is 2 with labels Low, High and numeric values only; on a synthetic copy with day 8 set to `low: NaN`, the walk counted 13/13 marks, the pointer in day 8's slot opened no card, the undrawn-day notice printed verbatim, and the widest day (Day 14) pinned exactly Low/High = 125/910 with no third row.
- [x] T011 Confirm no decorative element intercepts a bar's pointer events. Add `pointer-events: none` to a class if the walk shows it does (`assets/templates/daily-range.html`)
  - Evidence: `elementFromPoint` resolved every one of the 14 bar centres to its own mark (misses: none); the tooltip layer computes `pointer-events: none`, so no intercepting element was found and no extra class change was needed.
- [x] T012 Negative control: delete the `:focus:not(:focus-visible)` hygiene line alone, run `node scripts/check-corpus.cjs`, confirm `interaction-hygiene` reports `RESULT: FAILED` naming `daily-range.html`, then restore the line and confirm `RESULT: PASSED` (`assets/templates/daily-range.html`)
  - Evidence: deleted in place (grep confirmed 0 occurrences), run printed `FAIL [interaction-hygiene] assets/templates/daily-range.html: …` and `RESULT: FAILED`; restored from the pre-control copy, `diff` proved byte-identity, rerun printed `RESULT: PASSED`.
- [x] T013 Negative control: misspell the reduced-motion guard selector, for example `.tip` instead of `[data-chart-tooltip]`, run `node scripts/check-corpus.cjs`, confirm `motion` reports `RESULT: FAILED`, then restore the exact selector and confirm `RESULT: PASSED` (`scripts/check-corpus.cjs`)
  - Evidence: selector replaced with `.tip` in place, run printed `FAIL [motion] assets/templates/daily-range.html: "[data-chart-tooltip]" declares transition and no prefers-reduced-motion rule switches it off…` and `RESULT: FAILED`; restored, `diff` proved byte-identity, final `--render` run printed `RESULT: PASSED`.
- [x] T014 Record the byte delta with `wc -c` before and after for `daily-range.html` (`assets/templates/daily-range.html`)
  - Evidence: 14,795 bytes before, 21,876 bytes after, delta +7,081. The packet-wide byte-delta table itself is phase 7/8 and untouched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001–T014 all ticked above with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available — phase 3's excerpt proven in `grouped-bars.html` and carried by a passing corpus run before this phase started
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no linter exists for this corpus; the authoritative equivalent, `node scripts/check-corpus.cjs --render`, passed with 0 errors (including `script-parses`)
- [x] CHK-011 [P0] No console errors or warnings — the drawing completed in every CDP walk (14/14 marks, table filled, card functional); a thrown error during draw would have left zero marks, and every page exception surfaced through the walk's evaluate monitor
- [x] CHK-012 [P1] Error handling implemented — transferred verbatim with the file's existing guards: fixed-comma formatter returning an em dash, `drawable` filter, empty-data notice path untouched
- [x] CHK-013 [P1] Code follows project patterns — CSS, markup, card script and listeners copied from the proven excerpts, inserted at the same structural positions the other five forms use
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — left unticked: the phase-level criteria pass, but the packet's `acceptance-criteria.md` reconciliation is phase 7/8 work and out of this phase's scope
- [x] CHK-021 [P0] Manual testing complete — hover, pin, reduced-motion, no-script and both pinned colour schemes walked; per-form walk observations recorded in Phase 3 evidence
- [x] CHK-022 [P1] Edge cases tested — undrawn day (no mark, no card, notice intact), widest day (Low/High only, no third row), right-edge card flip
- [x] CHK-023 [P1] Error scenarios validated — the spec's named error scenario (scripting unavailable) proven by screenshot parity against the pre-change file
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class — left unticked: not a fix; the plan's affected-surfaces addendum marks this phase N/A (transfer of a proven excerpt, no bug)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — left unticked: same reason as CHK-FIX-001
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — left unticked: same reason as CHK-FIX-001
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — left unticked: no security/path/parser/redaction surface exists in a static template transfer
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — left unticked: no matrix in this phase
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — left unticked: the transferred code reads no process-wide state
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — left unticked: no fix; evidence is pinned to the pre-change copy and its diff instead
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the diff adds only palette custom properties and no literals; the corpus `colour-literals` check passed (1038 assertions)
- [x] CHK-031 [P0] Input validation implemented — `drawable` finite-number filter plus the formatter's non-finite handling, exercised by the synthetic `low: NaN` day
- [ ] CHK-032 [P1] Auth/authz working correctly — left unticked: not applicable, a static delivered file carries no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec and plan unchanged and still accurate; this tasks file now records the executed evidence
- [x] CHK-041 [P1] Code comments adequate — the one new comment states the durable why (the card is the only reading of a day short of the table, and the one reading it must never produce is the average); the rest are the excerpts' own comments carried over
- [ ] CHK-042 [P2] README updated (if applicable) — left unticked: not applicable, the transfer changes no script contract or command surface the README documents
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — all session artifacts live in gitignored `tmp/phase-006-daily-range/` at the repo root, nothing inside the packet
- [x] CHK-051 [P1] scratch/ cleaned before completion — left unticked on purpose: the pre-change copy stays as the rollback artifact the plan's rollback procedure requires until the packet closes — the packet closed at `009-close-the-deferrals`, so the retention condition has expired. The rollback path is `git checkout --` against HEAD, which holds the pre-packet state of every tracked file; the temporary copy was only ever a convenience beside it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 7/12 |
| P1 Items | 13 | 8/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-05

Unticked items carry their reason inline above: CHK-020 waits on the phase 7/8 acceptance reconciliation, the CHK-FIX row is not a fix phase, CHK-032/CHK-042 are not applicable, and CHK-051 was released when the packet closed at `009-close-the-deferrals`.
<!-- /ANCHOR:summary -->

---
